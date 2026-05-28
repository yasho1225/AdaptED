import type { ModeConfig } from "./types";

export const EXAMPLE_ASSIGNMENT = `Photosynthesis Assignment

Read the passage below and answer questions 1–3.

Photosynthesis is the process by which green plants use sunlight to make food. Chlorophyll in the leaves captures light energy. The plant combines carbon dioxide from the air with water from the roots to produce glucose (sugar) and oxygen.

Look at the diagram: sunlight hits the leaf, arrows show CO₂ entering and O₂ leaving.

1. What are the inputs of photosynthesis?
2. What are the outputs?
3. Why is photosynthesis important for life on Earth?`;

export const FEATURE_SAMPLE =
  "The water cycle moves water through evaporation, condensation, and precipitation. Clouds form when water vapor cools in the atmosphere.";

export const MODES: ModeConfig[] = [
  {
    id: "dyslexia",
    label: "Dyslexia Mode",
    shortLabel: "Dyslexia",
    description: "Shorter sentences, clearer chunks, less overwhelm",
    color: "from-violet-500 to-purple-600",
    icon: "Aa",
  },
  {
    id: "autism",
    label: "Autism Mode",
    shortLabel: "Autism",
    description: "Predictable steps, bullets, calm structure",
    color: "from-teal-500 to-emerald-600",
    icon: "☰",
  },
  {
    id: "visual",
    label: "Visual Impairment Mode",
    shortLabel: "Visual",
    description: "Rich descriptions of visuals and diagrams",
    color: "from-blue-500 to-indigo-600",
    icon: "◎",
  },
  {
    id: "hearing",
    label: "Hearing Impairment Mode",
    shortLabel: "Hearing",
    description: "Visual notes and caption-style organization",
    color: "from-amber-500 to-orange-600",
    icon: "▤",
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
      "Pick dyslexia, autism, visual, or hearing support—each tuned to how students learn.",
  },
  {
    step: "03",
    title: "Instant accessible format",
    description:
      "Compare outputs side by side and share the version that fits each learner.",
  },
];
