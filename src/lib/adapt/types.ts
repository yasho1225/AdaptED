/**
 * Core data model for AdaptED's adaptation engine.
 *
 * The model returns a structured AdaptedAssignment (never free text) so the UI
 * can render it, explain every change, and verify that nothing academic was lost.
 */

export type NeedId = "dyslexia" | "adhd" | "apd" | "autism";

export const NEED_IDS: NeedId[] = ["dyslexia", "adhd", "apd", "autism"];

export type SupportId =
  // Reading access (dyslexia-led, useful for many)
  | "vocab-preview"
  | "chunked-text"
  | "read-aloud"
  | "reduced-writing"
  // Executive function (ADHD-led)
  | "task-chunks"
  | "start-step"
  | "checklist"
  | "movement-breaks"
  | "highlight-verbs"
  | "self-check"
  // Auditory access (APD-led)
  | "written-directions"
  | "guided-notes"
  | "visual-cues"
  | "check-understanding"
  | "quiet-alternatives"
  // Clarity & predictability (autism-led)
  | "literal-language"
  | "explicit-expectations"
  | "worked-example"
  | "predictable-structure"
  | "open-ended-scaffold"
  | "sensory-notes";

/** Accommodate = same learning targets, different access. Modify = teacher-approved change to the targets. */
export type Expectations = "accommodate" | "modify";

export type OutputLanguage = "english" | "simple-english" | "spanish" | "french" | "hindi" | "chinese" | "arabic" | "vietnamese";

export interface LearnerProfile {
  needs: NeedId[];
  supports: SupportId[];
  grade?: string;
  expectations: Expectations;
  language: OutputLanguage;
  /** Optional teacher note about this learner's preferences. Never names or medical details. */
  notes?: string;
}

export type BlockType =
  | "text"
  | "keyIdea"
  | "vocab"
  | "direction"
  | "question"
  | "checklist"
  | "example"
  | "break"
  | "notes"
  | "tip"
  | "expectations";

export type CueIcon =
  | "read"
  | "write"
  | "think"
  | "talk"
  | "listen"
  | "look"
  | "move"
  | "check"
  | "calc"
  | "draw";

export interface QuestionSupports {
  starters?: string[];
  wordBank?: string[];
  hint?: string;
  steps?: string[];
  length?: string;
  responseOptions?: string[];
}

export interface Block {
  type: BlockType;
  text?: string;
  /** vocab */
  term?: string;
  syllables?: string;
  definition?: string;
  /** question: label from the ORIGINAL assignment, e.g. "2" or "3b" */
  number?: string;
  /** checklist items, expectations rows, guided-note lines (blanks as ____), answer choices */
  items?: string[];
  supports?: QuestionSupports;
  minutes?: number;
  icon?: CueIcon;
}

export interface Section {
  heading: string;
  purpose?: string;
  minutes?: number;
  blocks: Block[];
}

export interface Change {
  title: string;
  detail: string;
  /** The barrier in the original this change addresses */
  barrier: string;
  need: NeedId | "all";
  /** id from RESEARCH registry */
  evidence: string;
}

export interface Barrier {
  /** exact excerpt from the original assignment */
  quote: string;
  issue: string;
  needs: NeedId[];
}

export interface LanguageReplacement {
  original: string;
  replacement: string;
}

export interface AdaptedAssignment {
  title: string;
  studentIntro: string;
  estimatedMinutes?: number;
  sections: Section[];
  changes: Change[];
  teacherNotes: string[];
  barriers: Barrier[];
  preserved: { objectives: string[]; vocabulary: string[] };
  languageReplacements?: LanguageReplacement[];
}

export interface TextMetrics {
  words: number;
  sentences: number;
  avgSentenceLength: number;
  longestSentence: number;
  gradeLevel: number;
  longWordsPct: number;
}

export interface FidelityReport {
  originalQuestions: number;
  matchedQuestions: number;
  missing: string[];
  restored: string[];
  /** Questions present but with much of the original content missing (English only) */
  altered: string[];
  choicesPreserved: boolean;
  vocabularyKept: string[];
  vocabularyDropped: string[];
  passed: boolean;
}

export type AdaptSource = "ai" | "offline" | "curated";

export type FallbackReason =
  | "no_api_key"
  | "quota_exceeded"
  | "rate_limited"
  | "api_error"
  | "invalid_output"
  | "timeout";

export interface AdaptResult {
  assignment: AdaptedAssignment;
  source: AdaptSource;
  model?: string;
  fallbackReason?: FallbackReason;
  fidelity: FidelityReport;
  metrics: { before: TextMetrics; after: TextMetrics };
  profile: LearnerProfile;
  /** Notices for the teacher, e.g. "translation unavailable offline". */
  notices: string[];
  generatedAt: string;
}
