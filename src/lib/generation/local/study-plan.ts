import type { ContentBlock } from "@/lib/types";
import type { StudyPlanInput } from "@/lib/generation/types";
import { transformLocally } from "@/lib/local-transform";

export function generateStudyPlanLocal(input: StudyPlanInput): ContentBlock[] {
  const days = Math.min(Math.max(input.studyDurationDays, 1), 14);
  const mins = input.minutesPerDay;

  const lines: string[] = [
    `${input.subject} Study Plan`,
    `Test date: ${input.testDate}`,
    `${mins} minutes per day · ${days} days`,
    "",
  ];

  for (let d = 1; d <= days; d++) {
    const isLast = d === days;
    const isReview = d === days - 1 && days > 1;
    if (isLast) {
      lines.push(`Day ${d}: Light review and rest before the test.`);
    } else if (isReview) {
      lines.push(`Day ${d}: Review notes and practice one sample question.`);
    } else if (d === 1) {
      lines.push(`Day ${d}: Preview vocabulary and main ideas for ${input.subject}.`);
    } else {
      lines.push(`Day ${d}: Practice problems and check understanding.`);
    }
  }

  return transformLocally(lines.join("\n"), input.mode).blocks;
}
