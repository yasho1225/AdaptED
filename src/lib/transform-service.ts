import type {
  AccessibilityMode,
  FallbackReason,
  TransformResult,
} from "./types";
import { buildTransformResult, transformWithGemini } from "./gemini/server";
import { classifyGeminiError, isQuotaOrRateLimitError } from "./gemini/errors";
import {
  getGeminiCooldownReason,
  isGeminiInCooldown,
  markGeminiCooldown,
} from "./gemini/quota-state";
import { transformLocally } from "./local-transform";

function hasGeminiKey(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

function localWithFallback(
  input: string,
  mode: AccessibilityMode,
  reason: FallbackReason,
): TransformResult {
  return {
    ...transformLocally(input, mode),
    source: "local",
    fallbackReason: reason,
  };
}

/**
 * Prefer Gemini when configured; fall back to local on quota, rate limits, or errors.
 */
export async function transformContent(
  input: string,
  mode: AccessibilityMode,
): Promise<TransformResult> {
  const trimmed = input.trim();

  if (!hasGeminiKey()) {
    return localWithFallback(trimmed, mode, "no_api_key");
  }

  if (isGeminiInCooldown()) {
    const cooldownReason = getGeminiCooldownReason();
    const reason: FallbackReason =
      cooldownReason === "rate_limited" ||
      cooldownReason === "quota_exceeded" ||
      cooldownReason === "api_error"
        ? cooldownReason
        : "quota_exceeded";
    return localWithFallback(trimmed, mode, reason);
  }

  try {
    const blocks = await transformWithGemini(trimmed, mode, {
      retryTransient: true,
    });
    return buildTransformResult(blocks, mode);
  } catch (error) {
    const reason = classifyGeminiError(error);

    if (isQuotaOrRateLimitError(error)) {
      markGeminiCooldown(reason);
      console.warn("[transform] Gemini quota/rate limit — local fallback:", error);
    } else {
      console.error("[transform] Gemini error — local fallback:", error);
    }

    return localWithFallback(trimmed, mode, reason);
  }
}
