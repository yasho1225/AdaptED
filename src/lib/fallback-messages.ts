import type { FallbackReason } from "@/lib/types";

export function getFallbackBannerMessage(
  reason: FallbackReason | undefined,
): string | null {
  switch (reason) {
    case "quota_exceeded":
      return "AI free tier limit reached — using built-in adapter. Results are still tailored per mode.";
    case "rate_limited":
      return "Too many AI requests — using built-in adapter for now. Try again in a few minutes.";
    case "api_error":
      return "AI temporarily unavailable — using built-in adapter.";
    case "no_api_key":
      return null;
    default:
      return null;
  }
}
