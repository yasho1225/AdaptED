import type { AccessibilityMode } from "@/lib/types";
import type {
  AssignmentContentStyle,
  AssignmentInput,
  AssignmentType,
  DifficultyLevel,
  MultilingualInput,
  StudyPlanInput,
  TargetLanguage,
} from "./types";

const MODES: AccessibilityMode[] = ["dyslexia", "adhd", "apd", "autism"];
const ASSIGNMENT_TYPES: AssignmentType[] = [
  "worksheet",
  "quiz",
  "study-guide",
  "practice",
];
const DIFFICULTIES: DifficultyLevel[] = ["easy", "medium", "hard"];
const CONTENT_STYLES: AssignmentContentStyle[] = [
  "with-topic-info",
  "questions-only",
];
const LANGUAGES: TargetLanguage[] = [
  "spanish",
  "hindi",
  "french",
  "simplified-english",
];

function str(v: unknown, max = 200): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export function parseAssignmentBody(
  body: unknown,
): { ok: true; data: AssignmentInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request body." };
  }
  const b = body as Record<string, unknown>;
  const mode = b.mode as AccessibilityMode;
  const assignmentType = b.assignmentType as AssignmentType;
  const difficulty = b.difficulty as DifficultyLevel;

  if (!MODES.includes(mode)) {
    return { ok: false, error: "Invalid accessibility mode." };
  }
  if (!ASSIGNMENT_TYPES.includes(assignmentType)) {
    return { ok: false, error: "Invalid assignment type." };
  }
  if (!DIFFICULTIES.includes(difficulty)) {
    return { ok: false, error: "Invalid difficulty level." };
  }

  const subject = str(b.subject, 120);
  const topic = str(b.topic, 200);
  const gradeLevel = str(b.gradeLevel, 40);

  if (!subject || !topic || !gradeLevel) {
    return { ok: false, error: "Subject, topic, and grade level are required." };
  }

  const questionCount =
    typeof b.questionCount === "number"
      ? Math.min(20, Math.max(3, Math.round(b.questionCount)))
      : undefined;

  const rawStyle = b.contentStyle as AssignmentContentStyle;
  const contentStyle = CONTENT_STYLES.includes(rawStyle)
    ? rawStyle
    : "with-topic-info";

  return {
    ok: true,
    data: {
      subject,
      topic,
      gradeLevel,
      difficulty,
      assignmentType,
      mode,
      contentStyle,
      learningGoals: str(b.learningGoals, 500) || undefined,
      questionCount,
      timeEstimate: str(b.timeEstimate, 80) || undefined,
    },
  };
}

export function parseStudyPlanBody(
  body: unknown,
): { ok: true; data: StudyPlanInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request body." };
  }
  const b = body as Record<string, unknown>;
  const mode = b.mode as AccessibilityMode;

  if (!MODES.includes(mode)) {
    return { ok: false, error: "Invalid accessibility mode." };
  }

  const subject = str(b.subject, 120);
  const testDate = str(b.testDate, 80);
  if (!subject || !testDate) {
    return { ok: false, error: "Subject and test date are required." };
  }

  const studyDurationDays =
    typeof b.studyDurationDays === "number"
      ? Math.min(30, Math.max(1, Math.round(b.studyDurationDays)))
      : 7;

  const minutesPerDay =
    typeof b.minutesPerDay === "number"
      ? Math.min(180, Math.max(10, Math.round(b.minutesPerDay)))
      : 30;

  return {
    ok: true,
    data: { subject, testDate, studyDurationDays, mode, minutesPerDay },
  };
}

export function parseMultilingualBody(
  body: unknown,
): { ok: true; data: MultilingualInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request body." };
  }
  const b = body as Record<string, unknown>;
  const mode = b.mode as AccessibilityMode;
  const targetLanguage = b.targetLanguage as TargetLanguage;

  if (!MODES.includes(mode)) {
    return { ok: false, error: "Invalid accessibility mode." };
  }
  if (!LANGUAGES.includes(targetLanguage)) {
    return { ok: false, error: "Invalid target language." };
  }

  const content = str(b.content, 8000);
  if (!content) {
    return { ok: false, error: "Content is required." };
  }

  return { ok: true, data: { content, targetLanguage, mode } };
}
