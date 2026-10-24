/**
 * Academic fidelity checks. These are computed by AdaptED's own code — not
 * claimed by the model — so the teacher can trust the "nothing was lost" badge.
 */
import { keyVocabulary, parseAssignment, words, type ParsedQuestion } from "./analyze";
import { isEnglish } from "./profile";
import type { AdaptedAssignment, Block, FidelityReport, OutputLanguage } from "./types";

const STOP = new Set(
  "the a an and or but of to in on for with by from at as is are was were be this that these those it its your you their they what which who why how when where does do did can could would should will about into than then there here also each every both all any".split(" "),
);

export function normalizeLabel(label: string | undefined): string {
  return (label ?? "").toLowerCase().replace(/^(q(uestion)?|#|no\.?)\s*/i, "").replace(/[^0-9a-z]/g, "");
}

function contentWords(text: string): Set<string> {
  return new Set(
    words(text.toLowerCase())
      .filter((w) => w.length >= 4 && !STOP.has(w))
      .map((w) => w.replace(/(ing|ed|es|s)$/, "")),
  );
}

function blockText(b: Block): string {
  const s = b.supports;
  return [
    b.text,
    b.term,
    b.definition,
    ...(b.items ?? []),
    ...(s?.starters ?? []),
    ...(s?.steps ?? []),
    s?.hint,
    s?.length,
  ]
    .filter(Boolean)
    .join(" ");
}

/** All student-facing text, used for metrics and vocabulary checks. */
export function studentText(a: AdaptedAssignment): string {
  const parts: string[] = [a.title, a.studentIntro];
  a.sections.forEach((sec) => {
    parts.push(sec.heading);
    sec.blocks.forEach((b) => {
      if (b.type === "checklist") return;
      parts.push(blockText(b));
    });
  });
  return parts.filter(Boolean).join("\n");
}

/** Reading-load text only (passages, directions, questions) — for fair before/after metrics. */
export function readingText(a: AdaptedAssignment): string {
  const parts: string[] = [];
  a.sections.forEach((sec) =>
    sec.blocks.forEach((b) => {
      if (b.type === "text" || b.type === "keyIdea" || b.type === "direction" || b.type === "question") {
        if (b.text) parts.push(b.text.replace(/\*\*/g, ""));
      }
    }),
  );
  return parts.join("\n");
}

export function adaptedQuestions(a: AdaptedAssignment): Block[] {
  return a.sections.flatMap((s) => s.blocks.filter((b) => b.type === "question"));
}

export function checkFidelity(
  original: string,
  adapted: AdaptedAssignment,
  language: OutputLanguage = "english",
  restored: string[] = [],
): FidelityReport {
  const parsed = parseAssignment(original);
  const qs = adaptedQuestions(adapted);
  const byLabel = new Map<string, Block>();
  qs.forEach((b) => {
    const key = normalizeLabel(b.number);
    if (key && !byLabel.has(key)) byLabel.set(key, b);
  });

  const missing: string[] = [];
  const altered: string[] = [];
  let choicesPreserved = true;

  parsed.questions.forEach((q: ParsedQuestion) => {
    const match = byLabel.get(normalizeLabel(q.label));
    if (!match) {
      missing.push(q.label);
      return;
    }
    if (q.choices.length && (match.items?.length ?? 0) < q.choices.length) choicesPreserved = false;
    if (isEnglish(language)) {
      const orig = contentWords(q.text);
      if (orig.size >= 3) {
        const got = contentWords(blockText(match));
        const overlap = [...orig].filter((w) => got.has(w)).length / orig.size;
        if (overlap < 0.34) altered.push(q.label);
      }
    }
  });

  const vocab = keyVocabulary(original);
  const haystack = studentText(adapted).toLowerCase();
  const kept: string[] = [];
  const dropped: string[] = [];
  if (isEnglish(language)) {
    vocab.forEach((v) => (haystack.includes(v.toLowerCase()) ? kept : dropped).push(v));
  } else {
    kept.push(...vocab.filter((v) => haystack.includes(v.toLowerCase())));
  }

  return {
    originalQuestions: parsed.questions.length,
    matchedQuestions: parsed.questions.length - missing.length,
    missing,
    restored,
    altered,
    choicesPreserved,
    vocabularyKept: kept,
    vocabularyDropped: dropped,
    passed: missing.length === 0 && choicesPreserved && dropped.length <= 1,
  };
}

/** Feedback for a single corrective retry when the model drops content. */
export function fidelityFeedback(report: FidelityReport, original: string): string | null {
  const problems: string[] = [];
  const parsed = parseAssignment(original);
  if (report.missing.length) {
    const list = parsed.questions
      .filter((q) => report.missing.includes(q.label))
      .map((q) => `  ${q.label}: ${q.text}`)
      .join("\n");
    problems.push(`These original questions are missing (each needs its own "question" block with "number" set to its label):\n${list}`);
  }
  if (!report.choicesPreserved) problems.push("Every answer choice of multiple-choice questions must be kept in that question's \"items\".");
  if (report.vocabularyDropped.length > 1)
    problems.push(`These academic terms were removed and must appear in the adapted assignment (you may add support, but keep the term): ${report.vocabularyDropped.join(", ")}.`);
  return problems.length ? problems.join("\n\n") : null;
}

/** Last-resort guarantee: append any still-missing questions verbatim so nothing is lost. */
export function restoreMissingQuestions(original: string, adapted: AdaptedAssignment, missing: string[]): AdaptedAssignment {
  if (!missing.length) return adapted;
  const parsed = parseAssignment(original);
  const blocks: Block[] = parsed.questions
    .filter((q) => missing.includes(q.label))
    .map((q) => ({ type: "question", number: q.label, text: q.text, items: q.choices.length ? q.choices : undefined }));
  return {
    ...adapted,
    sections: [
      ...adapted.sections,
      { heading: "More questions from the original", purpose: "Restored word-for-word so no work is lost.", blocks },
    ],
  };
}
