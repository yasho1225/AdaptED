import type { ModeConfig } from "./types";

export const EXAMPLE_ASSIGNMENT = `Explain photosynthesis and then describe its importance in ecosystems.

Photosynthesis is the process by which green plants use sunlight to convert carbon dioxide and water into glucose and oxygen. Chlorophyll in the leaves captures light energy.

After reading, complete the following:
1. Name the inputs and outputs of photosynthesis.
2. Explain why photosynthesis matters for food chains and oxygen in the atmosphere.`;

export const FEATURE_SAMPLE =
  "Explain photosynthesis and then describe its importance in ecosystems.";

export const MODES: ModeConfig[] = [
  {
    id: "dyslexia",
    label: "Dyslexia Mode",
    shortLabel: "Dyslexia",
    description: "Simpler words, short chunks, easier scanning",
    color: "from-violet-500 to-purple-600",
    icon: "Aa",
  },
  {
    id: "adhd",
    label: "ADHD / Executive Function",
    shortLabel: "ADHD",
    description: "Small actionable steps, clear sequence, less overload",
    color: "from-amber-500 to-orange-600",
    icon: "1→",
  },
  {
    id: "apd",
    label: "Auditory Processing",
    shortLabel: "APD",
    description: "Structured written notes from spoken-style content",
    color: "from-blue-500 to-indigo-600",
    icon: "▤",
  },
  {
    id: "autism",
    label: "Autism Structure",
    shortLabel: "Autism",
    description: "Predictable sections, calm tone, zero ambiguity",
    color: "from-teal-500 to-emerald-600",
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
