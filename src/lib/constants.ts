import type { AccessibilityMode, ModeConfig } from "./types";

/** Short copy for the features scroll list (left column). */
export const FEATURE_MODE_BLURBS: Record<
  AccessibilityMode,
  { title: string; blurb: string }
> = {
  dyslexia: { title: "Dyslexia", blurb: "Short chunks, simpler words" },
  adhd: { title: "ADHD", blurb: "One clear step at a time" },
  apd: { title: "APD", blurb: "Headings and bullet notes" },
  autism: { title: "Autism", blurb: "Same layout every lesson" },
};

export const EXAMPLE_ASSIGNMENT = `Explain photosynthesis and then describe its importance in ecosystems.

Photosynthesis is the process by which green plants use sunlight to convert carbon dioxide and water into glucose and oxygen. Chlorophyll in the leaves captures light energy.

After reading, complete the following:
1. Name the inputs and outputs of photosynthesis.
2. Explain why photosynthesis matters for food chains and oxygen in the atmosphere.`;

export const MODES: ModeConfig[] = [
  {
    id: "dyslexia",
    label: "Dyslexia Mode",
    shortLabel: "Dyslexia",
    description: "Simpler words, short chunks, easier scanning",
    color: "mode-icon-dyslexia",
    theme: {
      icon: "mode-icon-dyslexia",
      accent: "bg-mode-dyslexia",
      tint: "mode-tint-dyslexia",
      ring: "mode-ring-dyslexia",
      border: "mode-border-dyslexia",
    },
    icon: "Aa",
  },
  {
    id: "adhd",
    label: "ADHD / Executive Function",
    shortLabel: "ADHD",
    description: "Small actionable steps, clear sequence, less overload",
    color: "mode-icon-adhd",
    theme: {
      icon: "mode-icon-adhd",
      accent: "bg-mode-adhd",
      tint: "mode-tint-adhd",
      ring: "mode-ring-adhd",
      border: "mode-border-adhd",
    },
    icon: "1→",
  },
  {
    id: "apd",
    label: "Auditory Processing",
    shortLabel: "APD",
    description: "Structured written notes from spoken-style content",
    color: "mode-icon-apd",
    theme: {
      icon: "mode-icon-apd",
      accent: "bg-mode-apd",
      tint: "mode-tint-apd",
      ring: "mode-ring-apd",
      border: "mode-border-apd",
    },
    icon: "▤",
  },
  {
    id: "autism",
    label: "Autism Structure",
    shortLabel: "Autism",
    description: "Predictable sections, calm tone, zero ambiguity",
    color: "mode-icon-autism",
    theme: {
      icon: "mode-icon-autism",
      accent: "bg-mode-autism",
      tint: "mode-tint-autism",
      ring: "mode-ring-autism",
      border: "mode-border-autism",
    },
    icon: "☰",
  },
];

export const IMPACT_STATS = [
  {
    value: "1 in 5",
    label: "students face learning accessibility barriers",
    source: "NCES / disability estimates",
  },
  {
    value: "7+ hrs",
    label: "average weekly time teachers spend adapting materials",
    source: "Teacher workload surveys",
  },
  {
    value: "4 modes",
    label: "instant formats from one source lesson",
    source: "AdaptED MVP",
  },
  {
    value: "<30 sec",
    label: "to transform and compare accessible versions",
    source: "Demo flow target",
  },
];

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Upload or paste material",
    description:
      "Drop in a worksheet, assignment, or lesson notes—no reformatting required.",
  },
  {
    step: "02",
    title: "Choose accessibility mode",
    description:
      "Pick dyslexia, ADHD, auditory processing, or autism structure—each changes how content reads.",
  },
  {
    step: "03",
    title: "Instant accessible format",
    description:
      "Compare outputs side by side and share the version that fits each learner.",
  },
];
