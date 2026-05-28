import type { AccessibilityMode, TransformResult } from "./types";
import { MODES } from "./constants";

export function emptyTransformResult(mode: AccessibilityMode): TransformResult {
  const config = MODES.find((m) => m.id === mode)!;
  return {
    blocks: [
      {
        type: "note",
        text: "Paste your assignment or click “Example” to generate an adapted version.",
      },
    ],
    modeLabel: config.label,
    modeDescription: config.description,
  };
}

export function cacheKey(input: string, mode: AccessibilityMode): string {
  return `${mode}::${input.trim()}`;
}
