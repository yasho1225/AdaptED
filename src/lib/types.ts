export type AccessibilityMode =
  | "dyslexia"
  | "autism"
  | "visual"
  | "hearing";

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

export interface TransformResult {
  blocks: ContentBlock[];
  modeLabel: string;
  modeDescription: string;
}

export interface ModeConfig {
  id: AccessibilityMode;
  label: string;
  shortLabel: string;
  description: string;
  color: string;
  icon: string;
}
