import type { FallbackReason } from "@/lib/types";

export class GeminiApiError extends Error {
  readonly fallbackReason: FallbackReason;
  readonly statusCode?: number;

  constructor(message: string, fallbackReason: FallbackReason, statusCode?: number) {
    super(message);
    this.name = "GeminiApiError";
    this.fallbackReason = fallbackReason;
    this.statusCode = statusCode;
  }
}

function errorText(error: unknown): string {
  if (error instanceof Error) return `${error.message} ${error.name}`;
  return String(error ?? "");
}

/** Free tier exhausted, billing, or hard quota — do not retry; use local. */
export function isQuotaOrRateLimitError(error: unknown): boolean {
  const text = errorText(error).toLowerCase();
  const status =
    error &&
    typeof error === "object" &&
    "status" in error &&
    typeof (error as { status: unknown }).status === "number"
      ? (error as { status: number }).status
      : undefined;

  if (status === 429 || status === 403) return true;

  return (
    /429|quota|rate.?limit|resource.?exhausted|too many requests/i.test(text) ||
    /free.?tier|billing|exceeded|limit: 0/i.test(text) ||
    /generativelanguage.*429/i.test(text)
  );
}

/** Transient errors worth one quick retry before fallback. */
export function isTransientError(error: unknown): boolean {
  if (isQuotaOrRateLimitError(error)) return false;
  const text = errorText(error).toLowerCase();
  return /503|500|unavailable|overloaded|deadline|timeout|econnreset/i.test(
    text,
  );
}

export function classifyGeminiError(error: unknown): FallbackReason {
  if (isQuotaOrRateLimitError(error)) {
    const text = errorText(error).toLowerCase();
    if (/rate|429|too many/i.test(text)) return "rate_limited";
    return "quota_exceeded";
  }
  return "api_error";
}
