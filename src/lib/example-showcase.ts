import { EXAMPLE_ASSIGNMENT, MODES } from "./constants";
import type { AccessibilityMode, TransformResult } from "./types";

const EXAMPLE_INPUT = EXAMPLE_ASSIGNMENT.trim();

function modeMeta(mode: AccessibilityMode) {
  const config = MODES.find((m) => m.id === mode)!;
  return {
    modeLabel: config.label,
    modeDescription: config.description,
    source: "local" as const,
  };
}

/**
 * Pre-built transforms for the demo "Example" assignment.
 * Instant on load — no API or live transform pass needed.
 */
export const EXAMPLE_SHOWCASE: Record<AccessibilityMode, TransformResult> = {
  dyslexia: {
    ...modeMeta("dyslexia"),
    blocks: [
      { type: "title", text: "Easy-Read Version" },
      { type: "note", text: "Read one short block at a time. **Bold** = big idea." },
      {
        type: "chunk",
        text: "Explain how plants make food from light.",
      },
      {
        type: "chunk",
        text: "Then tell why this matters in ecosystems.",
      },
      {
        type: "key",
        text: "**Main idea:** Green plants use sunlight to make plant sugar and oxygen.",
      },
      {
        type: "chunk",
        text: "The green part in leaves catches light energy.",
      },
      {
        type: "chunk",
        text: "Plants need carbon dioxide and water.",
      },
      {
        type: "chunk",
        text: "They make glucose (plant sugar) and oxygen.",
      },
      {
        type: "key",
        text: "**Why it matters:** Photosynthesis feeds food chains and adds oxygen to the air around Earth.",
      },
      {
        type: "chunk",
        text: "Question 1: List what goes in and what comes out of photosynthesis.",
      },
      {
        type: "chunk",
        text: "Question 2: Tell why photosynthesis matters for food chains and oxygen.",
      },
    ],
  },

  adhd: {
    ...modeMeta("adhd"),
    blocks: [
      { type: "title", text: "Your Action Plan" },
      { type: "note", text: "Do one step. Check it off. Then go to the next." },
      { type: "step", text: "Step 1: Read the full assignment once without writing." },
      {
        type: "step",
        text: "Step 2: Underline the main topic — photosynthesis and ecosystems.",
      },
      {
        type: "step",
        text: "Step 3: Write what photosynthesis means in your own words.",
      },
      {
        type: "step",
        text: "Step 4: Answer — 1. Name the inputs and outputs of photosynthesis." },
      { type: "bullet", text: "☐ Write your answer in complete sentences." },
      {
        type: "step",
        text: "Step 5: Answer — 2. Explain why photosynthesis matters for food chains and oxygen in the atmosphere.",
      },
      { type: "bullet", text: "☐ Write your answer in complete sentences." },
      { type: "step", text: "Step 6: Review your work against the instructions." },
      { type: "bullet", text: "☐ I finished every step above." },
    ],
  },

  apd: {
    ...modeMeta("apd"),
    blocks: [
      { type: "title", text: "Structured Study Notes" },
      { type: "caption", text: "TOPIC: Photosynthesis" },
      {
        type: "bullet",
        text: "• Plants use sunlight to turn carbon dioxide and water into glucose and oxygen.",
      },
      { type: "bullet", text: "• Chlorophyll in leaves captures light energy." },
      { type: "caption", text: "SECTION: Importance in ecosystems" },
      {
        type: "bullet",
        text: "• Supports food chains — many organisms rely on plant energy.",
      },
      {
        type: "bullet",
        text: "• Releases oxygen into the atmosphere for other living things.",
      },
      { type: "caption", text: "TOPIC: Assignment tasks" },
      { type: "bullet", text: "• Task 1: Name inputs and outputs of photosynthesis." },
      {
        type: "bullet",
        text: "• Task 2: Explain importance for food chains and atmospheric oxygen.",
      },
      {
        type: "key",
        text: "★ Photosynthesis links sunlight to food and oxygen across ecosystems.",
      },
      { type: "note", text: "Read each heading first, then the bullets under it." },
    ],
  },

  autism: {
    ...modeMeta("autism"),
    blocks: [
      { type: "title", text: "Lesson (Structured Format)" },
      { type: "caption", text: "SECTION 1: WHAT THIS IS" },
      {
        type: "chunk",
        text: "Photosynthesis is how green plants use sunlight to change carbon dioxide and water into glucose and oxygen.",
      },
      { type: "caption", text: "SECTION 2: KEY POINTS" },
      { type: "bullet", text: "• Chlorophyll in leaves captures light energy." },
      { type: "bullet", text: "• Outputs are glucose and oxygen." },
      {
        type: "bullet",
        text: "• Ecosystems depend on photosynthesis for food chains and oxygen.",
      },
      { type: "caption", text: "SECTION 3: STEP-BY-STEP BREAKDOWN" },
      { type: "step", text: "Step 1: Complete — 1. Name the inputs and outputs of photosynthesis." },
      {
        type: "step",
        text: "Step 2: Complete — 2. Explain why photosynthesis matters for food chains and oxygen in the atmosphere.",
      },
      {
        type: "note",
        text: "This lesson uses the same three sections every time.",
      },
    ],
  },
};

export function isExampleInput(input: string): boolean {
  return input.trim() === EXAMPLE_INPUT;
}

export function getExampleShowcase(
  mode: AccessibilityMode,
): TransformResult | undefined {
  return EXAMPLE_SHOWCASE[mode];
}

export function getExampleTransform(
  input: string,
  mode: AccessibilityMode,
): TransformResult | undefined {
  if (!isExampleInput(input)) return undefined;
  return getExampleShowcase(mode);
}

/** Warm the client cache so the demo loads with instant example output. */
export function seedExampleCache(
  set: (input: string, mode: AccessibilityMode, result: TransformResult) => void,
): void {
  const modes: AccessibilityMode[] = ["dyslexia", "adhd", "apd", "autism"];
  for (const mode of modes) {
    set(EXAMPLE_INPUT, mode, EXAMPLE_SHOWCASE[mode]);
  }
}
