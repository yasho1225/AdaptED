import type {
  Expectations,
  LearnerProfile,
  NeedId,
  OutputLanguage,
  SupportId,
} from "./types";

export interface NeedConfig {
  id: NeedId;
  label: string;
  shortLabel: string;
  /** One line a non-specialist understands */
  tagline: string;
  /** The barrier this need typically meets in a standard assignment */
  barrier: string;
  defaultSupports: SupportId[];
  evidence: string[];
}

export const NEEDS: Record<NeedId, NeedConfig> = {
  dyslexia: {
    id: "dyslexia",
    label: "Dyslexia",
    shortLabel: "Dyslexia",
    tagline: "Removes decoding and spelling as the gatekeeper to the ideas.",
    barrier:
      "Dense text, unfamiliar long words, and heavy writing demands use up effort on decoding and spelling instead of thinking.",
    defaultSupports: ["vocab-preview", "chunked-text", "read-aloud", "reduced-writing"],
    evidence: ["ida-definition", "ida-accommodations", "udl-language", "tts-meta"],
  },
  adhd: {
    id: "adhd",
    label: "ADHD",
    shortLabel: "ADHD",
    tagline: "Turns one big task into short, visible, finishable pieces.",
    barrier:
      "Multi-step instructions, long unbroken work, and no visible progress make it hard to start, stay on track, and finish.",
    defaultSupports: ["start-step", "task-chunks", "checklist", "movement-breaks", "highlight-verbs", "self-check"],
    evidence: ["adhd-classroom", "self-regulation", "udl-strategy", "segmenting"],
  },
  apd: {
    id: "apd",
    label: "Auditory Processing",
    shortLabel: "APD",
    tagline: "Nothing important lives only in the teacher's voice.",
    barrier:
      "Spoken directions, class discussion, and noisy group work carry information the student may not reliably catch or hold.",
    defaultSupports: ["written-directions", "guided-notes", "visual-cues", "check-understanding", "quiet-alternatives"],
    evidence: ["asha-capd", "asha-portal", "udl-perception", "guided-notes"],
  },
  autism: {
    id: "autism",
    label: "Autism",
    shortLabel: "Autism",
    tagline: "Says exactly what to do, how much, and what finished looks like.",
    barrier:
      "Ambiguous wording, figurative language, open-ended prompts, and unstated expectations leave the student guessing what is wanted.",
    defaultSupports: ["predictable-structure", "explicit-expectations", "literal-language", "worked-example", "open-ended-scaffold", "sensory-notes"],
    evidence: ["teacch", "ncaep", "figurative", "udl-interests"],
  },
};

export interface SupportConfig {
  id: SupportId;
  label: string;
  description: string;
  /** Needs this support is most associated with (shown grouped under them) */
  needs: NeedId[];
  /** Precise instruction for the model */
  instruction: string;
  evidence: string[];
}

export const SUPPORTS: Record<SupportId, SupportConfig> = {
  "vocab-preview": {
    id: "vocab-preview",
    label: "Preview key vocabulary",
    description: "Academic words broken into syllables with a plain definition — before the reading.",
    needs: ["dyslexia", "apd"],
    instruction:
      'Add a first section "Words to know" with 3–7 "vocab" blocks for the academic terms the student must read or use. Give "syllables" with middle dots (pho·to·syn·the·sis) and a plain definition taken only from the source or general knowledge at grade level. KEEP every academic term in the assignment itself — never replace it with a simpler word.',
    evidence: ["udl-language", "ida-accommodations"],
  },
  "chunked-text": {
    id: "chunked-text",
    label: "Short sentences, chunked reading",
    description: "One idea per sentence, short paragraphs under clear headings.",
    needs: ["dyslexia", "adhd"],
    instruction:
      "Rewrite reading passages as short sentences (aim ≤ 15 words) in paragraphs of 2–3 sentences, each under a short heading. Keep every fact, number, name, and term. Use active voice. Put the single most important idea of each part in a \"keyIdea\" block.",
    evidence: ["bda-style", "segmenting"],
  },
  "read-aloud": {
    id: "read-aloud",
    label: "Read-aloud ready",
    description: "Written so text-to-speech reads it naturally (the student view includes a read-aloud button).",
    needs: ["dyslexia"],
    instruction:
      "Write so text-to-speech reads it naturally: spell out symbols and abbreviations the first time (e.g. CO₂ → carbon dioxide (CO₂)), avoid slashes and parenthetical asides mid-sentence.",
    evidence: ["tts-meta", "ida-accommodations"],
  },
  "reduced-writing": {
    id: "reduced-writing",
    label: "Lighter writing load",
    description: "Sentence starters, a spelling word bank, and other ways to answer — same thinking required.",
    needs: ["dyslexia"],
    instruction:
      'For every written-response question add supports: 1–2 "starters" that frame the answer without giving it away, a "wordBank" of the hard-to-spell terms the answer will need, and "responseOptions" such as "Write it", "Type it", "Say it and record it", or "Draw and label it" when the objective is not writing itself. Never require copying the question.',
    evidence: ["udl-expression", "ida-accommodations"],
  },
  "task-chunks": {
    id: "task-chunks",
    label: "Timed chunks",
    description: "Work split into short sections with honest time estimates.",
    needs: ["adhd"],
    instruction:
      'Split the work into 3–6 sections, each one short task with a realistic "minutes" estimate (3–10 min each). Section headings name the outcome ("Find the inputs and outputs"), not "Part 1".',
    evidence: ["segmenting", "udl-strategy"],
  },
  "start-step": {
    id: "start-step",
    label: "A tiny first step",
    description: "A one-minute starter that makes beginning easy.",
    needs: ["adhd"],
    instruction:
      'Open with a section "Start here" containing one "direction" that takes under a minute and needs no decision (e.g. "Write your name and circle the word photosynthesis in the reading").',
    evidence: ["udl-strategy", "adhd-classroom"],
  },
  checklist: {
    id: "checklist",
    label: "Progress checklist",
    description: "A tick-box list so progress is visible.",
    needs: ["adhd", "autism"],
    instruction:
      'Include a "checklist" block listing every deliverable in order (one item per question or task), so the student can tick them off.',
    evidence: ["self-regulation", "udl-strategy"],
  },
  "movement-breaks": {
    id: "movement-breaks",
    label: "Planned brain breaks",
    description: "Short, structured breaks between chunks.",
    needs: ["adhd"],
    instruction:
      'Insert one "break" block (1–2 minutes, a concrete instruction such as "Stand, stretch, get water, come back") between larger chunks — at most one break per 10–12 minutes of work.',
    evidence: ["adhd-classroom", "udl-effort"],
  },
  "highlight-verbs": {
    id: "highlight-verbs",
    label: "Bold the action",
    description: "The verb that says what to do is bolded in every direction.",
    needs: ["adhd", "dyslexia"],
    instruction:
      "In every direction and question, wrap the main action verb in **double asterisks** (e.g. **List**, **Explain**). One bolded verb per instruction.",
    evidence: ["udl-knowledge"],
  },
  "self-check": {
    id: "self-check",
    label: "Self-check before handing in",
    description: "A short self-monitoring list at the end.",
    needs: ["adhd", "autism"],
    instruction:
      'End with a section "Check your work" with a "checklist" of 3–4 concrete self-checks tied to this assignment (e.g. "I named all 3 inputs").',
    evidence: ["self-regulation", "udl-strategy"],
  },
  "written-directions": {
    id: "written-directions",
    label: "All directions in writing",
    description: "Every spoken instruction is also on the page, one step per line.",
    needs: ["apd"],
    instruction:
      'Put every instruction in writing as numbered "direction" blocks, one action per direction, in the order the student does them. Any instruction that would normally be said aloud ("Listen to…", "As we discussed…", "Your teacher will explain…") must be fully written out with the information itself.',
    evidence: ["asha-portal", "udl-perception"],
  },
  "guided-notes": {
    id: "guided-notes",
    label: "Guided notes",
    description: "An outline with blanks to fill in while listening or reading.",
    needs: ["apd", "adhd"],
    instruction:
      'Add a "notes" block titled for the lesson content: 4–8 "items" that restate key facts from the source with one important word replaced by ____ (blanks only on key terms, answers must be findable in the reading). Put the missing words in a word bank via the block "text".',
    evidence: ["guided-notes", "asha-capd"],
  },
  "visual-cues": {
    id: "visual-cues",
    label: "Visual cues",
    description: "Each step has a picture cue: read, write, talk, look, calculate…",
    needs: ["apd", "autism"],
    instruction:
      'Give every direction and question an "icon" from: read, write, think, talk, listen, look, move, check, calc, draw — matching what the student physically does.',
    evidence: ["ncaep", "udl-perception"],
  },
  "check-understanding": {
    id: "check-understanding",
    label: "Check-for-understanding prompts",
    description: "Teacher notes with quick checks that don't rely on 'Any questions?'",
    needs: ["apd"],
    instruction:
      'Add 2–3 teacherNotes that are concrete check-for-understanding prompts the teacher can use after giving directions (e.g. "Ask the student to point to the step they will do first"), plus one note on reducing background noise or facing the student when speaking.',
    evidence: ["asha-portal", "asha-capd"],
  },
  "quiet-alternatives": {
    id: "quiet-alternatives",
    label: "Written alternative to listening tasks",
    description: "Discussion or audio-only tasks get a written path to the same goal.",
    needs: ["apd"],
    instruction:
      "If any task depends on listening (partner talk, video, discussion, dictation), keep it but add a written alternative that reaches the same objective (e.g. a shared written chat, a transcript, written partner notes).",
    evidence: ["udl-perception", "asha-portal"],
  },
  "literal-language": {
    id: "literal-language",
    label: "Literal, exact wording",
    description: "Idioms, sarcasm, and vague words replaced with exact meaning.",
    needs: ["autism"],
    instruction:
      'Replace idioms, figurative phrases, rhetorical questions, and vague words ("a few", "briefly", "some") with exact literal wording, and list each swap in "languageReplacements". EXCEPTION: if understanding figurative language IS the learning objective (e.g. an ELA question about a metaphor), keep the original text and add an explicit plain-language explanation of what the question is asking.',
    evidence: ["figurative", "udl-language"],
  },
  "explicit-expectations": {
    id: "explicit-expectations",
    label: "Exact expectations",
    description: "How much to write, how long it takes, and what 'finished' means.",
    needs: ["autism", "adhd"],
    instruction:
      'Add an "expectations" block near the top whose items answer, in this order: "What I will do:", "How much:", "How long:", "I am finished when:", "Then I will:". Give every open question a concrete "length" (e.g. "2–3 sentences", "1 labeled diagram").',
    evidence: ["teacch", "udl-strategy"],
  },
  "worked-example": {
    id: "worked-example",
    label: "Model of a good answer",
    description: "Shows the answer format using a different example — never the real answer.",
    needs: ["autism", "dyslexia"],
    instruction:
      'Add one "example" block that shows what a complete answer looks like using a DIFFERENT topic or item than any real question. It must never contain an answer to a question in the assignment.',
    evidence: ["ncaep", "udl-knowledge"],
  },
  "predictable-structure": {
    id: "predictable-structure",
    label: "Predictable layout",
    description: "Same section order every time: What, How much, Work, Finished.",
    needs: ["autism"],
    instruction:
      'Use exactly this section order: "What this is about" → "What to do" → "The work" → "When you finish". Do not add surprise sections or change headings mid-assignment.',
    evidence: ["teacch", "ncaep"],
  },
  "open-ended-scaffold": {
    id: "open-ended-scaffold",
    label: "Structure for open-ended questions",
    description: "Opinion, 'imagine', or feelings questions get a clear frame — same objective.",
    needs: ["autism"],
    instruction:
      'For open-ended, opinion, imagination, or perspective-taking questions, keep the question and objective but add "steps" that break it into concrete parts (e.g. 1. Name the character. 2. Find one sentence that shows how they feel. 3. Name the feeling.).',
    evidence: ["ncaep", "teacch"],
  },
  "sensory-notes": {
    id: "sensory-notes",
    label: "Sensory & transition notes",
    description: "Teacher notes about noise, lighting, timers, and changes in routine.",
    needs: ["autism"],
    instruction:
      "Add 1–2 teacherNotes about sensory or transition considerations specific to this activity (e.g. warn before switching from reading to partner work; offer a quiet workspace for group tasks). Do not assume every autistic student has the same sensitivities — phrase as options to check with the student.",
    evidence: ["udl-interests", "ncaep"],
  },
};

export const SUPPORT_IDS = Object.keys(SUPPORTS) as SupportId[];

export const LANGUAGES: { value: OutputLanguage; label: string }[] = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish · Español" },
  { value: "chinese", label: "Chinese · 中文" },
  { value: "vietnamese", label: "Vietnamese · Tiếng Việt" },
  { value: "arabic", label: "Arabic · العربية" },
  { value: "french", label: "French · Français" },
  { value: "hindi", label: "Hindi · हिन्दी" },
];

export const GRADES = ["3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

export function defaultProfile(need: NeedId = "dyslexia"): LearnerProfile {
  return {
    needs: [need],
    supports: [...NEEDS[need].defaultSupports],
    expectations: "accommodate",
    language: "english",
  };
}

/** Union of default supports for the chosen needs, preserving catalogue order. */
export function supportsForNeeds(needs: NeedId[]): SupportId[] {
  const set = new Set<SupportId>();
  needs.forEach((n) => NEEDS[n].defaultSupports.forEach((s) => set.add(s)));
  return SUPPORT_IDS.filter((id) => set.has(id));
}

export function isDefaultSingleNeedProfile(p: LearnerProfile): NeedId | null {
  if (p.needs.length !== 1 || p.language !== "english" || p.expectations !== "accommodate" || p.notes?.trim()) {
    return null;
  }
  const need = p.needs[0];
  const defaults = NEEDS[need].defaultSupports;
  if (defaults.length !== p.supports.length) return null;
  return defaults.every((s) => p.supports.includes(s)) ? need : null;
}

const VALID_EXPECTATIONS: Expectations[] = ["accommodate", "modify"];

/** Sanitize an untrusted profile from the client. */
export function sanitizeProfile(raw: unknown): LearnerProfile | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const needs = Array.isArray(r.needs)
    ? (r.needs.filter((n) => typeof n === "string" && n in NEEDS) as NeedId[])
    : [];
  if (needs.length === 0) return null;
  const supports = Array.isArray(r.supports)
    ? (r.supports.filter((s) => typeof s === "string" && s in SUPPORTS) as SupportId[])
    : supportsForNeeds(needs);
  const expectations = VALID_EXPECTATIONS.includes(r.expectations as Expectations)
    ? (r.expectations as Expectations)
    : "accommodate";
  const language = LANGUAGES.some((l) => l.value === r.language)
    ? (r.language as OutputLanguage)
    : "english";
  const grade = typeof r.grade === "string" && GRADES.includes(r.grade) ? r.grade : undefined;
  const notes = typeof r.notes === "string" ? r.notes.trim().slice(0, 300) : undefined;
  return {
    needs: [...new Set(needs)],
    supports: [...new Set(supports)],
    expectations,
    language,
    grade,
    notes: notes || undefined,
  };
}
