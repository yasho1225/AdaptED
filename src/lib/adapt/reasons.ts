import type { FallbackReason } from "./types";

/** Why AI wasn't used, finishing the sentence "AI wasn't used because …". Shared by the studio's messages. */
export const FALLBACK_REASONS: Record<FallbackReason, string> = {
  no_api_key: "AI isn’t set up on this server",
  quota_exceeded: "the AI has reached its limit for now",
  rate_limited: "the AI is busy right now",
  api_error: "the AI had a problem",
  invalid_output: "the AI’s answer didn’t pass AdaptED’s checks",
  timeout: "the AI took too long to answer",
};
