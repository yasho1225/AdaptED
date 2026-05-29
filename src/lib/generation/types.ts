import type { AccessibilityMode } from "@/lib/types";

export type AssignmentType =
  | "worksheet"
  | "quiz"
  | "study-guide"
  | "practice";

export type DifficultyLevel = "easy" | "medium" | "hard";

/** Whether the assignment teaches about the topic or is questions-only. */
export type AssignmentContentStyle = "with-topic-info" | "questions-only";

export type TargetLanguage =
  | "spanish"
  | "hindi"
  | "french"
  | "simplified-english";

export interface AssignmentInput {
  subject: string;
  topic: string;
  gradeLevel: string;
  difficulty: DifficultyLevel;
  assignmentType: AssignmentType;
  mode: AccessibilityMode;
  contentStyle?: AssignmentContentStyle;
  learningGoals?: string;
  questionCount?: number;
  timeEstimate?: string;
}

export interface StudyPlanInput {
  subject: string;
  testDate: string;
  studyDurationDays: number;
  mode: AccessibilityMode;
  minutesPerDay: number;
}

export interface MultilingualInput {
  content: string;
  targetLanguage: TargetLanguage;
  mode: AccessibilityMode;
}

export type GenerationKind = "assignment" | "study-plan" | "multilingual";
