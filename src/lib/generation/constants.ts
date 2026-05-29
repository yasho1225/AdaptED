import type {
  AssignmentType,
  DifficultyLevel,
  TargetLanguage,
} from "./types";

export const ASSIGNMENT_TYPE_OPTIONS: { value: AssignmentType; label: string }[] =
  [
    { value: "worksheet", label: "Worksheet" },
    { value: "quiz", label: "Quiz" },
    { value: "study-guide", label: "Study guide" },
    { value: "practice", label: "Practice questions" },
  ];

export const DIFFICULTY_OPTIONS: { value: DifficultyLevel; label: string }[] = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

export const GRADE_OPTIONS = [
  "3rd",
  "4th",
  "5th",
  "6th",
  "7th",
  "8th",
  "9th",
  "10th",
  "11th",
  "12th",
];

export const LANGUAGE_OPTIONS: {
  value: TargetLanguage;
  label: string;
}[] = [
  { value: "spanish", label: "Spanish" },
  { value: "hindi", label: "Hindi" },
  { value: "french", label: "French" },
  { value: "simplified-english", label: "Simplified English" },
];

/** Shown in transform workspace translate control (empty = show adapted English). */
export const TRANSLATE_WORKSPACE_OPTIONS: {
  value: TargetLanguage | "";
  label: string;
}[] = [
  { value: "", label: "English (original)" },
  ...LANGUAGE_OPTIONS,
];
