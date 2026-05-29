import type { AssignmentInput } from "@/lib/generation/types";
import { BLOCK_JSON_SCHEMA } from "@/lib/gemini/json-schema";
import { modeFormattingRules } from "./mode-rules";

const TYPE_LABELS: Record<AssignmentInput["assignmentType"], string> = {
  worksheet: "worksheet with practice items",
  quiz: "short quiz with clear questions",
  "study-guide": "study guide with review sections",
  practice: "practice question set",
};

export function buildAssignmentSystemPrompt(mode: AssignmentInput["mode"]): string {
  return `You are AdaptED — an accessibility-first assignment generator for teachers.

You create NEW classroom-ready assignments (not summaries). Output must match the selected accessibility mode and feel DISTINCT from other modes.

${BLOCK_JSON_SCHEMA}

${modeFormattingRules(mode)}

FORBIDDEN:
- Generic AI fluff ("In this assignment you will...")
- Content unrelated to the topic
- Mixing formatting rules from other modes`;
}

export function buildAssignmentUserPrompt(input: AssignmentInput): string {
  const goals = input.learningGoals?.trim()
    ? `\nLearning goals: ${input.learningGoals.trim()}`
    : "";
  const count = input.questionCount
    ? `\nTarget number of questions/items: ${input.questionCount}`
    : "";
  const time = input.timeEstimate?.trim()
    ? `\nSuggested time: ${input.timeEstimate.trim()}`
    : "";
  const contentStyle =
    input.contentStyle === "questions-only"
      ? `\nContent style: QUESTIONS ONLY — do not add teaching passages, summaries, or background readings about the topic. Only instructions plus questions/tasks.`
      : `\nContent style: TOPIC INFORMATION + QUESTIONS — include a short, grade-appropriate explanation or reference section about the topic (key ideas, vocabulary, or mini-summary) BEFORE the questions. Then include the questions/tasks.`;

  return `Generate a ${TYPE_LABELS[input.assignmentType]} for teachers.

Subject: ${input.subject}
Topic: ${input.topic}
Grade level: ${input.gradeLevel}
Difficulty: ${input.difficulty}
Accessibility mode: ${input.mode.toUpperCase()}${contentStyle}${goals}${count}${time}

Include a clear assignment title block, instructions appropriate for the mode, and the actual questions/tasks.
Match ${input.mode} formatting rules exactly.`;
}
