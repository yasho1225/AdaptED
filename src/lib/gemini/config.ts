/** Default model — 2.0-flash free tier is often exhausted (limit: 0) on new keys. */
export const GEMINI_MODEL =
  process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
