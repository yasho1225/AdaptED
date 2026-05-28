/**
 * After quota/rate-limit errors, skip Gemini briefly so the demo stays fast
 * and we don't hammer a exhausted free tier.
 */
const DEFAULT_COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes

let disabledUntil = 0;
let lastReason: string | null = null;

export function markGeminiCooldown(
  reason: string,
  cooldownMs = DEFAULT_COOLDOWN_MS,
): void {
  disabledUntil = Date.now() + cooldownMs;
  lastReason = reason;
}

export function isGeminiInCooldown(): boolean {
  return Date.now() < disabledUntil;
}

export function getGeminiCooldownReason(): string | null {
  if (!isGeminiInCooldown()) return null;
  return lastReason;
}

export function clearGeminiCooldown(): void {
  disabledUntil = 0;
  lastReason = null;
}
