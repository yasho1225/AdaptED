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

export interface ModeTheme {
  /** Muted gradient for icons and indicators */
  gradient: string;
  /** Subtle surface tint for panels */
  surface: string;
  /** Active ring / focus */
  ring: string;
  /** Accent border */
  border: string;
  /** Label / eyebrow accent */
  text: string;
}

export interface ModeConfig {
  id: AccessibilityMode;
  label: string;
  shortLabel: string;
  description: string;
  /** @deprecated Use theme.gradient — kept for existing consumers */
  color: string;
  theme: ModeTheme;
  icon: string;
}
