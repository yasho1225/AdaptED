import type { StudyPlanInput } from "@/lib/generation/types";
import { BLOCK_JSON_SCHEMA } from "@/lib/gemini/json-schema";
import { modeFormattingRules } from "./mode-rules";

export function buildStudyPlanSystemPrompt(mode: StudyPlanInput["mode"]): string {
  return `You are AdaptED — an accessibility-first study plan generator.

Create realistic, paced study schedules for students. Output must match the accessibility mode.

${BLOCK_JSON_SCHEMA}

${modeFormattingRules(mode)}

ADHD-specific: shorter sessions, break reminders, checkbox bullets.
AUTISM-specific: same daily structure repeated, predictable section labels.
DYSLEXIA-specific: fewer words per block, no overload.
APD-specific: explicit headings and bullet agendas.

Include day-by-day plan from today until the test date.`;
}

export function buildStudyPlanUserPrompt(input: StudyPlanInput): string {
  return `Create a personalized study plan.

Subject: ${input.subject}
Test/exam date: ${input.testDate}
Total study window: ${input.studyDurationDays} days
Available study time: ${input.minutesPerDay} minutes per day
Accessibility mode: ${input.mode.toUpperCase()}

Spread tasks realistically. Include review and a light final review day before the test.
Format for ${input.mode} mode only.`;
}
