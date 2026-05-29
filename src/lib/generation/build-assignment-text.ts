import { GRADE_OPTIONS } from "@/lib/generation/constants";
import type {
  AssignmentContentStyle,
  AssignmentInput,
  DifficultyLevel,
} from "@/lib/generation/types";
import type { AccessibilityMode } from "@/lib/types";

/** Shown in the demo textarea when the user clicks Generate. */
export const ASSIGNMENT_BRIEF_TEMPLATE = `Describe the topic:
(What should this assignment be about? For example: photosynthesis, fractions, the Civil War)

Grade level:
(For example: 6th, 7th, or 8th)

Difficulty:
(easy, medium, or hard)

What should the assignment include?
(Type info and questions — or: questions only)`;

const BRIEF_TOPIC_LINE =
  ASSIGNMENT_BRIEF_TEMPLATE.indexOf("(What should this assignment");

function normalizeBriefText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\u2014/g, "-")
    .replace(/\u2013/g, "-");
}

function isPlaceholderLine(line: string): boolean {
  const t = line.trim();
  if (/^\[.*\]$/.test(t) || /^\(.*\)$/.test(t)) return true;
  if (/^\(.*\S/.test(t) && t.endsWith(")")) return true;
  if (/for example:/i.test(t)) return true;
  if (/easy,\s*medium,\s*or\s*hard/i.test(t)) return true;
  if (/type info and questions/i.test(t)) return true;
  if (/what should this assignment be about/i.test(t)) return true;
  return false;
}

function briefSectionLines(raw: string): string[] {
  return normalizeBriefText(raw)
    .trim()
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !isPlaceholderLine(l));
}

/** Join all non-hint lines in a brief section (users often use multiple lines). */
function cleanBriefSection(raw: string): string {
  const lines = briefSectionLines(raw);
  if (!lines.length) return "";
  return lines.join(" ").replace(/^\[|\]$/g, "").trim();
}

/** Prefer the last line the user typed (below gray hint text). */
function lastBriefLine(raw: string): string {
  const lines = briefSectionLines(raw);
  return lines[lines.length - 1] ?? "";
}

function cleanBriefValue(raw: string): string {
  return cleanBriefSection(raw);
}

/** Select the topic hint line so the user can type immediately. */
export function focusAssignmentBriefTopic(
  textarea: HTMLTextAreaElement | null,
): void {
  if (!textarea) return;
  textarea.focus();
  if (BRIEF_TOPIC_LINE >= 0) {
    const end = ASSIGNMENT_BRIEF_TEMPLATE.indexOf("\n", BRIEF_TOPIC_LINE);
    const start = BRIEF_TOPIC_LINE;
    const stop = end === -1 ? ASSIGNMENT_BRIEF_TEMPLATE.length : end;
    textarea.setSelectionRange(start, stop);
  }
}

function normalizeGrade(raw: string): string | null {
  const cleaned = cleanBriefValue(raw);
  if (!cleaned) return null;

  const lower = cleaned.toLowerCase().replace(/^grade\s*/i, "").trim();
  const direct = GRADE_OPTIONS.find((g) => g.toLowerCase() === lower);
  if (direct) return direct;

  const withSuffix = lower.match(/^(\d{1,2})(?:st|nd|rd|th)?$/);
  if (withSuffix) {
    const n = Number(withSuffix[1]);
    const suffix =
      n % 10 === 1 && n % 100 !== 11
        ? "st"
        : n % 10 === 2 && n % 100 !== 12
          ? "nd"
          : n % 10 === 3 && n % 100 !== 13
            ? "rd"
            : "th";
    const candidate = `${n}${suffix}`;
    if (GRADE_OPTIONS.includes(candidate)) return candidate;
  }

  return GRADE_OPTIONS.includes(cleaned) ? cleaned : cleaned.slice(0, 12);
}

function normalizeDifficulty(raw: string): DifficultyLevel | null {
  const sources = [lastBriefLine(raw), cleanBriefSection(raw)].filter(Boolean);
  for (const source of sources) {
    const cleaned = source.toLowerCase();
    if (/\bhard\b/.test(cleaned)) return "hard";
    if (/\bmedium\b/.test(cleaned)) return "medium";
    if (/\beasy\b/.test(cleaned)) return "easy";
  }
  return null;
}

function normalizeContentStyle(raw: string): AssignmentContentStyle | null {
  const sources = [lastBriefLine(raw), cleanBriefSection(raw)].filter(Boolean);
  for (const cleaned of sources.map((s) => s.toLowerCase())) {
    if (
      /questions?\s*only|only\s*questions?|just\s*questions?|no\s*info/i.test(
        cleaned,
      )
    ) {
      return "questions-only";
    }
    if (
      /info|information|summary|reading|explain|teach|background|both|full/i.test(
        cleaned,
      )
    ) {
      return "with-topic-info";
    }
  }
  return null;
}

/** Human-readable hints when Generate is clicked but the brief is incomplete. */
export function getAssignmentBriefHint(text: string): string | null {
  const normalized = normalizeBriefText(text);
  if (!isAssignmentBriefForm(normalized)) {
    return "Click Generate to open the assignment form.";
  }

  const topicMatch = /Describe the topic:\s*\n([\s\S]*?)(?=\nGrade level:)/i.exec(
    normalized,
  );
  const gradeMatch = /Grade level:\s*\n([\s\S]*?)(?=\nDifficulty:)/i.exec(
    normalized,
  );
  const diffMatch =
    /Difficulty:\s*\n([\s\S]*?)(?=\nWhat should the assignment include\?)/i.exec(
      normalized,
    );
  const contentMatch =
    /What should the assignment include\?\s*\n([\s\S]*)$/i.exec(normalized);

  const missing: string[] = [];
  if (!topicMatch || !cleanBriefSection(topicMatch[1])) {
    missing.push("topic");
  }
  if (!gradeMatch || !normalizeGrade(gradeMatch[1])) {
    missing.push("grade level (e.g. 7th)");
  }
  if (!diffMatch || !normalizeDifficulty(diffMatch[1])) {
    missing.push("difficulty (easy, medium, or hard)");
  }
  if (!contentMatch || !normalizeContentStyle(contentMatch[1])) {
    missing.push('content style ("info and questions" or "questions only")');
  }

  if (!missing.length) return null;
  return `Still need: ${missing.join(", ")}.`;
}

export function isAssignmentBriefForm(text: string): boolean {
  const t = text.trim();
  return (
    t.includes("Describe the topic:") &&
    t.includes("Grade level:") &&
    t.includes("Difficulty:") &&
    t.includes("What should the assignment include?")
  );
}

export function parseAssignmentBrief(text: string): {
  topic: string;
  gradeLevel: string;
  difficulty: DifficultyLevel;
  contentStyle: AssignmentContentStyle;
} | null {
  const normalized = normalizeBriefText(text);
  if (!isAssignmentBriefForm(normalized)) return null;

  const topicMatch = /Describe the topic:\s*\n([\s\S]*?)(?=\nGrade level:)/i.exec(
    normalized,
  );
  const gradeMatch = /Grade level:\s*\n([\s\S]*?)(?=\nDifficulty:)/i.exec(
    normalized,
  );
  const diffMatch =
    /Difficulty:\s*\n([\s\S]*?)(?=\nWhat should the assignment include\?)/i.exec(
      normalized,
    );
  const contentMatch =
    /What should the assignment include\?\s*\n([\s\S]*)$/i.exec(normalized);

  if (!topicMatch || !gradeMatch || !diffMatch || !contentMatch) return null;

  const topic = cleanBriefValue(topicMatch[1]);
  const gradeLevel = normalizeGrade(gradeMatch[1]);
  const difficulty = normalizeDifficulty(diffMatch[1]);
  const contentStyle = normalizeContentStyle(contentMatch[1]);

  if (!topic || !gradeLevel || !difficulty || !contentStyle) return null;

  return { topic, gradeLevel, difficulty, contentStyle };
}

const TYPE_TITLES: Record<AssignmentInput["assignmentType"], string> = {
  worksheet: "Practice Worksheet",
  quiz: "Quick Quiz",
  "study-guide": "Study Guide",
  practice: "Practice Questions",
};

function topicInformationSection(topic: string): string[] {
  return [
    "About this topic",
    `${topic} is the focus of this assignment. Read the summary below, then answer the questions.`,
    `Summary: Students should be able to explain what ${topic} is, why it matters, and give at least one real-world example.`,
    "Key points to understand:",
    `• The main idea of ${topic} in your own words`,
    `• Why ${topic} is important in this unit`,
    `• One example of ${topic} from class or daily life`,
    "",
    "Questions",
  ];
}

function baseQuestions(topic: string, count: number): string[] {
  const templates = [
    `Define ${topic} in your own words.`,
    `List two key facts about ${topic}.`,
    `Give one real-world example of ${topic}.`,
    `Why does ${topic} matter in this unit?`,
    `Compare ${topic} to a related idea you learned.`,
    `What is one question you still have about ${topic}?`,
  ];
  return templates.slice(0, Math.max(3, Math.min(count, templates.length)));
}

export function buildAssignmentSourceText(input: AssignmentInput): string {
  const n = input.questionCount ?? 5;
  const questions = baseQuestions(input.topic, n);
  const title = `${input.subject}: ${input.topic} — ${TYPE_TITLES[input.assignmentType]}`;
  const includeInfo = input.contentStyle !== "questions-only";
  const styleNote =
    input.contentStyle === "questions-only"
      ? "Questions only"
      : "Topic information + questions";

  return [
    title,
    `Grade ${input.gradeLevel} · ${input.difficulty} difficulty · ${styleNote}`,
    input.learningGoals ? `Goals: ${input.learningGoals}` : "",
    "",
    ...(includeInfo ? topicInformationSection(input.topic) : []),
    ...questions.map((q, i) => `${i + 1}. ${q}`),
  ]
    .filter(Boolean)
    .join("\n");
}

function inferSubject(text: string): string {
  return /math|algebra|geometry/i.test(text)
    ? "Mathematics"
    : /history|war|century/i.test(text)
      ? "History"
      : /english|essay|writing/i.test(text)
        ? "English"
        : "Science";
}

export function inferAssignmentInput(
  text: string,
  mode: AccessibilityMode,
  overrides?: Partial<
    Pick<
      AssignmentInput,
      "topic" | "gradeLevel" | "difficulty" | "subject" | "contentStyle"
    >
  >,
): AssignmentInput {
  const trimmed = text.trim();
  const topicSource = overrides?.topic ?? trimmed;
  const firstLine =
    topicSource
      .split("\n")
      .map((l) => l.trim())
      .find((l) => l.length > 3) ?? "Your lesson topic";

  const topic = firstLine
    .replace(/^\d+\.\s*/, "")
    .replace(/^#+\s*/, "")
    .slice(0, 72);

  return {
    subject: overrides?.subject ?? inferSubject(topicSource),
    topic: topic || "Lesson topic",
    gradeLevel: overrides?.gradeLevel ?? "7th",
    difficulty: overrides?.difficulty ?? "medium",
    assignmentType: "worksheet",
    mode,
    contentStyle: overrides?.contentStyle ?? "with-topic-info",
    questionCount: 5,
    timeEstimate: "20 minutes",
  };
}

export function buildAssignmentInputFromBrief(
  brief: {
    topic: string;
    gradeLevel: string;
    difficulty: DifficultyLevel;
    contentStyle: AssignmentContentStyle;
  },
  mode: AccessibilityMode,
): AssignmentInput {
  return inferAssignmentInput(brief.topic, mode, {
    topic: brief.topic,
    gradeLevel: brief.gradeLevel,
    difficulty: brief.difficulty,
    contentStyle: brief.contentStyle,
    subject: inferSubject(brief.topic),
  });
}
