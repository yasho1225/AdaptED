import type { TransformResult, FallbackReason } from "@/lib/types";
import { MODES } from "@/lib/constants";
import { callGeminiJson } from "@/lib/gemini/call-json";
import { classifyGeminiError, isQuotaOrRateLimitError } from "@/lib/gemini/errors";
import {
  getGeminiCooldownReason,
  isGeminiInCooldown,
  markGeminiCooldown,
} from "@/lib/gemini/quota-state";
import type {
  AssignmentInput,
  StudyPlanInput,
  MultilingualInput,
} from "./types";
import {
  buildAssignmentSystemPrompt,
  buildAssignmentUserPrompt,
} from "./prompts/assignment";
import {
  buildStudyPlanSystemPrompt,
  buildStudyPlanUserPrompt,
} from "./prompts/study-plan";
import {
  buildMultilingualSystemPrompt,
  buildMultilingualUserPrompt,
} from "./prompts/multilingual";
import { generateAssignmentLocal } from "./local/assignment";
import { generateStudyPlanLocal } from "./local/study-plan";
import { generateMultilingualLocal } from "./local/multilingual";

function hasGeminiKey(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

function buildResult(
  blocks: TransformResult["blocks"],
  mode: AssignmentInput["mode"],
  subtitle: string,
  source: TransformResult["source"],
  fallbackReason?: FallbackReason,
): TransformResult {
  const config = MODES.find((m) => m.id === mode)!;
  return {
    blocks,
    modeLabel: config.label,
    modeDescription: subtitle,
    source,
    fallbackReason,
  };
}

async function withGeminiFallback<T>(
  mode: AssignmentInput["mode"],
  subtitle: string,
  runLocal: () => TransformResult["blocks"],
  runGemini: () => Promise<TransformResult["blocks"]>,
): Promise<TransformResult> {
  if (!hasGeminiKey()) {
    return buildResult(
      runLocal(),
      mode,
      subtitle,
      "local",
      "no_api_key",
    );
  }

  if (isGeminiInCooldown()) {
    const cooldownReason = getGeminiCooldownReason();
    const reason: FallbackReason =
      cooldownReason === "rate_limited" ||
      cooldownReason === "quota_exceeded" ||
      cooldownReason === "api_error"
        ? cooldownReason
        : "quota_exceeded";
    return buildResult(runLocal(), mode, subtitle, "local", reason);
  }

  try {
    const blocks = await runGemini();
    return buildResult(blocks, mode, subtitle, "gemini");
  } catch (error) {
    const reason = classifyGeminiError(error);
    if (isQuotaOrRateLimitError(error)) {
      markGeminiCooldown(reason);
    }
    return buildResult(runLocal(), mode, subtitle, "local", reason);
  }
}

export async function generateAssignment(
  input: AssignmentInput,
): Promise<TransformResult> {
  const subtitle = `Generated ${input.assignmentType.replace("-", " ")} · ${input.topic}`;

  return withGeminiFallback(
    input.mode,
    subtitle,
    () => generateAssignmentLocal(input),
    () =>
      callGeminiJson(
        buildAssignmentSystemPrompt(input.mode),
        buildAssignmentUserPrompt(input),
        { temperature: 0.35 },
      ),
  );
}

export async function generateStudyPlan(
  input: StudyPlanInput,
): Promise<TransformResult> {
  const subtitle = `Study plan · ${input.subject} · ${input.studyDurationDays} days`;

  return withGeminiFallback(
    input.mode,
    subtitle,
    () => generateStudyPlanLocal(input),
    () =>
      callGeminiJson(
        buildStudyPlanSystemPrompt(input.mode),
        buildStudyPlanUserPrompt(input),
        { temperature: 0.3 },
      ),
  );
}

export async function generateMultilingual(
  input: MultilingualInput,
): Promise<TransformResult> {
  const subtitle = `Multilingual accessibility · ${input.targetLanguage}`;

  return withGeminiFallback(
    input.mode,
    subtitle,
    () => generateMultilingualLocal(input),
    () =>
      callGeminiJson(
        buildMultilingualSystemPrompt(input),
        buildMultilingualUserPrompt(input),
        { temperature: 0.3 },
      ),
  );
}
