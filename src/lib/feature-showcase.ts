import type { AccessibilityMode, TransformResult } from "./types";
import { MODES } from "./constants";

/** Fixed input shown in the features scroll panel. */
export const FEATURES_INPUT =
  "Explain photosynthesis and its importance in ecosystems.";

function label(mode: AccessibilityMode) {
  const config = MODES.find((m) => m.id === mode)!;
  return { modeLabel: config.shortLabel, modeDescription: config.description };
}

/**
 * Pre-configured outputs for the features scroll demo.
 * Hardcoded so the section never calls the API and always looks polished.
 */
export const FEATURE_SHOWCASE: Record<AccessibilityMode, TransformResult> = {
  dyslexia: {
    ...label("dyslexia"),
    source: "local",
    blocks: [
      { type: "title", text: "Easy-Read Version" },
      {
        type: "chunk",
        text: "Plants make food using sunlight. This is photosynthesis.",
      },
      {
        type: "key",
        text: "**Main idea:** Plants turn light into sugar and oxygen.",
      },
      {
        type: "chunk",
        text: "It feeds food chains and puts oxygen in the air.",
      },
    ],
  },

  adhd: {
    ...label("adhd"),
    source: "local",
    blocks: [
      { type: "title", text: "Your Action Plan" },
      { type: "step", text: "Step 1: Define photosynthesis in one sentence." },
      { type: "step", text: "Step 2: List inputs and outputs." },
      { type: "bullet", text: "☐ I explained why ecosystems need it." },
    ],
  },

  apd: {
    ...label("apd"),
    source: "local",
    blocks: [
      { type: "title", text: "Structured Study Notes" },
      { type: "caption", text: "TOPIC: Photosynthesis" },
      { type: "bullet", text: "• Sunlight + water + CO₂ → sugar + oxygen." },
      {
        type: "key",
        text: "★ It powers food chains and adds oxygen to the air.",
      },
    ],
  },

  autism: {
    ...label("autism"),
    source: "local",
    blocks: [
      { type: "title", text: "Lesson (Structured Format)" },
      { type: "caption", text: "SECTION 1: WHAT THIS IS" },
      {
        type: "chunk",
        text: "Photosynthesis is how plants use sunlight to make food.",
      },
      { type: "caption", text: "SECTION 2: KEY POINTS" },
      { type: "bullet", text: "• Plants make glucose and oxygen." },
      { type: "caption", text: "SECTION 3: STEP-BY-STEP BREAKDOWN" },
      { type: "step", text: "Step 1: Name inputs, outputs, and why it matters." },
    ],
  },
};

export function getFeatureShowcase(mode: AccessibilityMode): TransformResult {
  return FEATURE_SHOWCASE[mode];
}
