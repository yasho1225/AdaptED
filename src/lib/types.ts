export type AccessibilityMode = "dyslexia" | "adhd" | "apd" | "autism";

export type BlockType =
  | "title"
  | "chunk"
  | "key"
  | "step"
  | "bullet"
  | "caption"
  | "describe"
  | "note";

export interface ContentBlock {
  type: BlockType;
  text: string;
}

export type TransformSource = "gemini" | "local";

/** Set when `source` is `local` but Gemini was expected. */
export type FallbackReason =
  | "no_api_key"
  | "quota_exceeded"
  | "rate_limited"
  | "api_error";

export interface TransformResult {
  blocks: ContentBlock[];
  modeLabel: string;
  modeDescription: string;
  source?: TransformSource;
  fallbackReason?: FallbackReason;
}

/** Mode accent tokens — never use for body text */
export interface ModeTheme {
  icon: string;
  accent: string;
  tint: string;
  ring: string;
  border: string;
}

export interface ModeConfig {
  id: AccessibilityMode;
  label: string;
  shortLabel: string;
  description: string;
  /** Icon badge gradient (deprecated alias: use theme.icon) */
  color: string;
  theme: ModeTheme;
  icon: string;
}
