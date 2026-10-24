import "server-only";
import { z } from "zod";
import { createdToText, outlineFor, type CreateRequest, type CreateResult, type CreatedAssignment } from "./create";
import { GeminiError, generateJson, hasGeminiKey } from "./gemini";
import type { FallbackReason } from "./types";

const LEVEL_RULE: Record<CreateRequest["level"], string> = {
  easier: "Slightly easier than typical for the grade: shorter sentences, concrete examples, fewer inference questions. Still teach the grade's real content.",
  "on-level": "Typical for the grade.",
  harder: "Slightly harder than typical for the grade: more inference, cause-and-effect, and academic vocabulary. Stay within the grade's standards.",
};

const SYSTEM = `You write original classroom assignments for teachers in U.S. schools. Another part of the app will later adapt your assignment for students with disabilities, so write a normal, grade-level assignment.

Rules:
1. ACCURACY. Use only well-established facts appropriate for the grade. Never invent statistics, dates, names, quotes, sources, or experiments. If you are unsure of a detail, leave it out.
2. READING (when asked for one): 2–4 short paragraphs, about 40 words per grade level in total (for example grade 5 ≈ 200 words), capped at 380 words. Use and explain the topic's key academic vocabulary in context. No headings, no bullet points.
3. QUESTIONS: exactly the number requested. Mix recall, explain (how/why), and apply/connect questions. At most one in three may be multiple choice, with exactly 4 choices and one correct answer; put choices in "choices" without letters. Otherwise "choices" is empty. When there is a reading, every question must be answerable from it.
4. Never reveal answers anywhere.
5. DIRECTIONS: one or two short sentences telling students what to do.
6. TITLE: 2–8 words, no ending punctuation.
7. If the topic is not suitable for a school assignment, return the title "Topic not suitable" with empty reading and questions.`;

const SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    directions: { type: "string" },
    reading: { type: "array", items: { type: "string" } },
    questions: {
      type: "array",
      items: {
        type: "object",
        properties: { text: { type: "string" }, choices: { type: "array", items: { type: "string" } } },
        required: ["text", "choices"],
      },
    },
  },
  required: ["title", "directions", "reading", "questions"],
};

const Created = z.object({
  title: z.string().min(2).max(120),
  directions: z.string().max(400),
  reading: z.array(z.string().max(1500)).max(6),
  questions: z
    .array(
      z.object({
        text: z.string().min(5).max(500),
        choices: z.array(z.string().min(1).max(200)).max(5),
      }),
    )
    .min(1)
    .max(10),
});

function userPrompt(req: CreateRequest): string {
  return `Write a grade ${req.grade} assignment.
Topic: ${req.topic}
Include: ${req.include === "reading" ? "a short reading, then questions about it" : "questions only (reading must be an empty array)"}
Number of questions: ${req.questions}
Level: ${LEVEL_RULE[req.level]}`;
}

function reasonFor(e: unknown): FallbackReason {
  if (e instanceof GeminiError) return e.kind === "quota" ? "quota_exceeded" : e.kind === "rate" ? "rate_limited" : "api_error";
  return "invalid_output";
}

export class TopicNotSuitableError extends Error {}

const outline = (req: CreateRequest, fallbackReason: FallbackReason): CreateResult => {
  const a = outlineFor(req);
  return { text: createdToText(a), title: a.title, source: "outline", fallbackReason };
};

export async function createAssignment(req: CreateRequest): Promise<CreateResult> {
  if (!hasGeminiKey()) return outline(req, "no_api_key");
  let created: CreatedAssignment;
  let model: string;
  try {
    const res = await generateJson({ system: SYSTEM, user: userPrompt(req), schema: SCHEMA, temperature: 0.5, maxOutputTokens: 4096, thinkingBudget: 1024 });
    const parsed = Created.safeParse(res.data);
    if (!parsed.success) return outline(req, "invalid_output");
    created = parsed.data;
    model = res.model;
  } catch (e) {
    console.error("[create]", e);
    return outline(req, reasonFor(e));
  }
  if (/^topic not suitable$/i.test(created.title.trim()) || created.questions.length === 0) throw new TopicNotSuitableError();
  // Keep the model's output within what was asked: requested question count, choices only when there are 3–5.
  const questions = created.questions.slice(0, req.questions).map((q) => ({ text: q.text, choices: q.choices.length >= 3 ? q.choices : [] }));
  const assignment = { ...created, reading: req.include === "reading" ? created.reading : [], questions };
  return { text: createdToText(assignment), title: assignment.title, source: "ai", model };
}
