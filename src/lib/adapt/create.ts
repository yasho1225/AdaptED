/**
 * "Create an assignment" — a teacher describes a topic and AdaptED writes a new, grade-level
 * assignment in the same plain format a teacher would paste in. The result goes into the
 * studio like any other assignment, so it is then adapted, checked, and explained the same way.
 *
 * Shared by the browser and the server (no secrets here).
 */
import { GRADES } from "./profile";
import type { FallbackReason } from "./types";

export type CreateInclude = "reading" | "questions";
export type CreateLevel = "easier" | "on-level" | "harder";

export interface CreateRequest {
  topic: string;
  grade: string;
  include: CreateInclude;
  questions: number;
  level: CreateLevel;
}

export interface CreatedAssignment {
  title: string;
  directions: string;
  reading: string[];
  questions: { text: string; choices: string[] }[];
}

export interface CreateResult {
  text: string;
  title: string;
  /** "ai": written just now by the model. "outline": made without AI — a starter the teacher fills in. */
  source: "ai" | "outline";
  model?: string;
  fallbackReason?: FallbackReason;
}

export const TOPIC_MAX = 140;
export const QUESTION_COUNTS = [3, 4, 5, 6, 8];
export const LEVELS: { value: CreateLevel; label: string }[] = [
  { value: "easier", label: "A bit easier" },
  { value: "on-level", label: "On grade level" },
  { value: "harder", label: "A bit harder" },
];

export const DEFAULT_CREATE: CreateRequest = { topic: "", grade: "7", include: "reading", questions: 5, level: "on-level" };

/** Validates untrusted input (from the browser or the API body). */
export function sanitizeCreateRequest(raw: unknown): CreateRequest | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const topic = typeof r.topic === "string" ? r.topic.replace(/\s+/g, " ").trim().slice(0, TOPIC_MAX) : "";
  if (topic.length < 2) return null;
  const grade = typeof r.grade === "string" && GRADES.includes(r.grade) ? r.grade : DEFAULT_CREATE.grade;
  const include: CreateInclude = r.include === "questions" ? "questions" : "reading";
  const n = Number(r.questions);
  const questions = Number.isFinite(n) ? Math.min(8, Math.max(3, Math.round(n))) : DEFAULT_CREATE.questions;
  const level: CreateLevel = r.level === "easier" || r.level === "harder" ? r.level : "on-level";
  return { topic, grade, include, questions, level };
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** A short title line the assignment parser recognises (≤ 12 words, no end punctuation). */
function titleLine(title: string): string {
  return title.replace(/[.!?:;]+$/, "").split(/\s+/).slice(0, 12).join(" ").trim() || "New assignment";
}

/** The plain-text worksheet format AdaptED reads (same as a pasted assignment). */
export function createdToText(a: CreatedAssignment): string {
  const parts = [titleLine(a.title), a.directions.trim(), ...a.reading.map((p) => p.trim()).filter(Boolean)];
  const qs = a.questions.map((q, i) => [`${i + 1}. ${q.text.trim()}`, ...q.choices.map((c, j) => `${String.fromCharCode(65 + j)}. ${c.replace(/^[A-E][.)]\s*/, "").trim()}`)].join("\n"));
  return [...parts.filter(Boolean), qs.join("\n")].join("\n\n");
}

/** "The water cycle" → "the water cycle" mid-sentence; "American Revolution" and single words are left as typed. */
function inSentence(topic: string): string {
  const [first, second] = topic.split(" ");
  return second && /^[a-z]/.test(second) && /^[A-Z][a-z]/.test(first) ? topic.charAt(0).toLowerCase() + topic.slice(1) : topic;
}

export const READING_PLACEHOLDER = "[Add a short reading here: two or three paragraphs your students should read first.]";

/**
 * Without AI there is no way to write accurate new content, so AdaptED gives a starter outline:
 * real question stems built around the topic, and a clearly marked spot for the teacher's reading.
 * Nothing in it is a made-up fact.
 */
export function outlineFor(req: CreateRequest): CreatedAssignment {
  const t = inSentence(req.topic);
  const withReading = req.include === "reading";
  const from = withReading ? " from the reading" : "";
  // Stems are written to read naturally whether the topic is a noun ("volcanoes") or a clause ("how volcanoes form").
  const stems = [
    `What is the most important idea about ${t}? Explain it in your own words.`,
    `Describe two important facts about ${t}${from}.`,
    `Give one real-world example connected to ${t}. Explain the connection.`,
    `Why is it useful to understand ${t}? Use${withReading ? " evidence from the reading" : " an example"} in your answer.`,
    `Explain one cause and its effect related to ${t}.`,
    `Connect ${t} to something else you have learned. How are they related?`,
    `Draw or describe a diagram about ${t}. Label the main parts.`,
    `What is one question you still have about ${t}?`,
  ];
  return {
    title: cap(t),
    directions: withReading ? "Read the passage carefully, then answer the questions in complete sentences." : "Answer each question in complete sentences.",
    reading: withReading ? [READING_PLACEHOLDER] : [],
    questions: stems.slice(0, req.questions).map((text) => ({ text, choices: [] })),
  };
}
