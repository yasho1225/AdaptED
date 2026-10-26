import { NextResponse } from "next/server";
import { createAssignment } from "@/lib/adapt/create-server";
import { GeminiError, geminiKeyName, generateJson, lastGeminiFailure } from "@/lib/adapt/gemini";
import { defaultProfile } from "@/lib/adapt/profile";
import { SAMPLES } from "@/lib/adapt/samples";
import { adaptAssignment } from "@/lib/adapt/service";
import { rateLimited } from "@/lib/rate-limit";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

/** A Google error message, without anything that could be a key. */
function safeMessage(e: unknown): string {
  const text = e instanceof Error ? e.message : String(e);
  return text.replace(/AIza[0-9A-Za-z_-]{20,}/g, "[key]").slice(0, 300);
}

/**
 * Is AI working on this deployment? Never shows the key. Open it in a browser:
 *   /api/status                   key found? does Gemini accept a tiny real call?
 *   /api/status?check=translate   a real Spanish adaptation of the science sample, timed
 *   /api/status?check=create      a real "Create one with AI", timed
 */
export async function GET(request: Request) {
  if (rateLimited(request)) return NextResponse.json({ error: "Too many checks at once. Wait a minute." }, { status: 429 });
  const check = new URL(request.url).searchParams.get("check");
  const keyName = geminiKeyName();
  const base = {
    deployment: process.env.VERCEL_ENV ?? "local",
    key: keyName ? `found in ${keyName}` : "missing: add GEMINI_API_KEY for this environment, then redeploy",
  };
  if (!keyName) return NextResponse.json(base, { headers: { "Cache-Control": "no-store" } });

  const started = Date.now();
  let result: Record<string, unknown>;
  try {
    if (check === "translate") {
      const r = await adaptAssignment(SAMPLES[0].text, { ...defaultProfile("dyslexia"), language: "spanish" });
      result = {
        check: "Spanish adaptation of the science sample",
        works: r.source === "ai",
        madeBy: r.source === "ai" ? `AI (${r.model})` : `no AI: ${r.fallbackReason}`,
        questionsKept: `${r.fidelity.matchedQuestions} of ${r.fidelity.originalQuestions}`,
      };
    } else if (check === "create") {
      const r = await createAssignment({ topic: "the water cycle", grade: "5", include: "reading", questions: 4, level: "on-level" });
      result = { check: "Create one with AI (the water cycle, grade 5)", works: r.source === "ai", madeBy: r.source === "ai" ? `AI (${r.model})` : `no AI: ${r.fallbackReason}`, title: r.title };
    } else {
      const r = await generateJson({
        system: "You are a health check. Answer with the JSON asked for.",
        user: 'Return {"ok": true}.',
        schema: { type: "object", properties: { ok: { type: "boolean" } }, required: ["ok"] },
        maxOutputTokens: 256,
        deadline: Date.now() + 25_000,
      });
      result = { check: "tiny Gemini call", works: (r.data as { ok?: unknown })?.ok === true, model: r.model };
    }
  } catch (e) {
    result = { check: check ?? "tiny Gemini call", works: false, error: e instanceof GeminiError ? e.kind : "other", message: safeMessage(e) };
  }
  // When an adaptation fell back, say what Gemini actually answered.
  const failure = lastGeminiFailure();
  if (result.works === false && failure && failure.at >= started && !("message" in result)) result = { ...result, error: failure.kind, model: failure.model, message: safeMessage(new Error(failure.message)) };
  return NextResponse.json({ ...base, ...result, seconds: Math.round((Date.now() - started) / 100) / 10 }, { headers: { "Cache-Control": "no-store" } });
}
