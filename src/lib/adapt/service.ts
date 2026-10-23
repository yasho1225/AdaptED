import "server-only";
import { computeMetrics, originalReadingText } from "./analyze";
import { checkFidelity, fidelityFeedback, readingText, restoreMissingQuestions } from "./fidelity";
import { GeminiError, generateJson, hasGeminiKey } from "./gemini";
import { adaptOffline } from "./offline-engine";
import { redactPersonalInfo } from "./privacy";
import { buildSystemPrompt, buildUserPrompt } from "./prompt";
import { parseAdaptedAssignment } from "./schema";
import type { AdaptResult, AdaptedAssignment, FallbackReason, LearnerProfile } from "./types";

/** After quota errors, skip the model for a while so the app stays fast. */
let cooldownUntil = 0;
let cooldownReason: FallbackReason = "quota_exceeded";

function finalize(
  source: string,
  assignment: AdaptedAssignment,
  profile: LearnerProfile,
  meta: Pick<AdaptResult, "source" | "model" | "fallbackReason">,
  notices: string[],
): AdaptResult {
  let fidelity = checkFidelity(source, assignment, profile.language);
  if (fidelity.missing.length) {
    assignment = restoreMissingQuestions(source, assignment, fidelity.missing);
    fidelity = checkFidelity(source, assignment, profile.language, fidelity.missing);
  }
  return {
    assignment,
    ...meta,
    fidelity,
    metrics: { before: computeMetrics(originalReadingText(source)), after: computeMetrics(readingText(assignment)) },
    profile,
    notices,
    generatedAt: new Date().toISOString(),
  };
}

function offline(source: string, profile: LearnerProfile, reason: FallbackReason, notices: string[]): AdaptResult {
  const extra = [...notices];
  if (profile.language !== "english") extra.push("Translation needs the AI engine, so this offline version is in English.");
  return finalize(source, adaptOffline(source, profile), profile, { source: "offline", fallbackReason: reason }, extra);
}

export async function adaptAssignment(rawSource: string, profile: LearnerProfile): Promise<AdaptResult> {
  const { text: source, redacted } = redactPersonalInfo(rawSource.trim());
  const notices: string[] = redacted ? ["Personal details (names, emails, phone numbers) were removed before processing."] : [];

  if (!hasGeminiKey()) return offline(source, profile, "no_api_key", notices);
  if (Date.now() < cooldownUntil) return offline(source, profile, cooldownReason, notices);

  const system = buildSystemPrompt();
  const user = buildUserPrompt(source, profile);

  try {
    let { data, model } = await generateJson({ system, user, temperature: 0.4 });
    let assignment = parseAdaptedAssignment(data);
    if (!assignment) {
      ({ data, model } = await generateJson({ system, user: `${user}\n\nYour previous output did not match the schema. Return complete JSON with at least one section.`, temperature: 0.3 }));
      assignment = parseAdaptedAssignment(data);
    }
    if (!assignment) return offline(source, profile, "invalid_output", notices);

    // One corrective pass if academic content was lost.
    const report = checkFidelity(source, assignment, profile.language);
    const feedback = fidelityFeedback(report, source);
    if (feedback) {
      try {
        const retry = await generateJson({
          system,
          user: `${user}\n\nA fidelity check of your previous answer found problems. Fix them and return the full corrected JSON.\n${feedback}`,
          temperature: 0.3,
        });
        const fixed = parseAdaptedAssignment(retry.data);
        if (fixed && checkFidelity(source, fixed, profile.language).matchedQuestions >= report.matchedQuestions) {
          assignment = fixed;
          model = retry.model;
        }
      } catch {
        /* keep the first answer; missing questions are restored verbatim below */
      }
    }
    return finalize(source, assignment, profile, { source: "ai", model }, notices);
  } catch (error) {
    const kind = error instanceof GeminiError ? error.kind : "other";
    const reason: FallbackReason = kind === "quota" ? "quota_exceeded" : kind === "rate" ? "rate_limited" : "api_error";
    if (kind === "quota" || kind === "rate") {
      cooldownUntil = Date.now() + (kind === "quota" ? 10 : 1) * 60_000;
      cooldownReason = reason;
    }
    console.error("[adapt] model failed, using offline engine:", error instanceof Error ? error.message : error);
    return offline(source, profile, reason, notices);
  }
}
