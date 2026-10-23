/**
 * Offline, rule-based adaptation. Used only when the AI is unavailable.
 *
 * It is deliberately conservative: it never invents facts, keeps every
 * original question verbatim, and builds structure from the teacher's
 * selected supports. It cannot paraphrase like the AI can, and the UI says so.
 */
import {
  IDIOMS,
  detectBarriers,
  keyVocabulary,
  parseAssignment,
  splitSentences,
  syllabify,
  words,
  type ParsedQuestion,
} from "./analyze";
import type {
  AdaptedAssignment,
  Block,
  Change,
  CueIcon,
  LanguageReplacement,
  LearnerProfile,
  NeedId,
  Section,
  SupportId,
} from "./types";

const VAGUE_SWAPS: [RegExp, string][] = [
  [/\bbriefly\b/gi, "in 1–2 sentences"],
  [/\ba few\b/gi, "2–3"],
  [/\bin detail\b/gi, "with at least 2 specific details"],
  [/\bseveral\b/gi, "3"],
  [/\bthoroughly\b/gi, "completely, with a reason for each part"],
  [/don'?t spend too long on any one (problem|question)/gi, "if one $1 takes more than 5 minutes, skip it and come back to it at the end"],
];

const VERB = /\b(read|answer|explain|describe|write|list|name|complete|use|show|draw|label|compare|contrast|identify|define|discuss|summarize|solve|find|calculate|circle|underline|highlight|choose|select|match|fill|look|listen|watch|analyze|support|cite|create|make|record|review|check|tell|give|include|predict|estimate|measure|determine|justify|evaluate)\b/i;

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function endSentence(s: string): string {
  const t = s.trim();
  return /[.!?:"]$/.test(t) ? t : `${t}.`;
}

/** Split only at safe clause boundaries; never cut a list or a mid-sentence clause. */
export function shortenSentence(sentence: string, maxWords = 16, splitThen = false): string[] {
  if (words(sentence).length <= maxWords && !splitThen) return [sentence.trim()];
  const boundary = splitThen
    ? /;\s+|,\s+(?=(?:and|but|so|then|and then)\s)/i
    : /;\s+|,\s+(?=(?:and|but|so)\s)/i;
  const out: string[] = [];
  let rest = sentence.trim();
  while (rest) {
    const m = rest.match(boundary);
    if (!m || m.index === undefined) {
      out.push(rest);
      break;
    }
    const left = rest.slice(0, m.index);
    const right = rest.slice(m.index + m[0].length);
    // A comma in the left side usually means a list ("a, b, and c") — keep it whole.
    const isList = m[0].startsWith(",") && left.includes(",");
    const minWords = splitThen ? 3 : 5;
    if (isList || words(left).length < minWords || words(right).length < minWords) {
      out.push(rest);
      break;
    }
    out.push(endSentence(left));
    rest = capitalize(right.replace(/^(?:and then|and|then)\s+/i, ""));
  }
  return out.map((p, i) => (i === 0 ? p : endSentence(p))).map((p) => endSentence(capitalize(p)));
}

function boldFirst(text: string, terms: string[]): string {
  let out = text;
  for (const term of terms) {
    const re = new RegExp(`(?<!\\*)\\b(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})\\b(?!\\*)`, "i");
    if (re.test(out)) {
      out = out.replace(re, "**$1**");
    }
  }
  return out;
}

function boldVerb(text: string): string {
  if (text.includes("**")) return text;
  return text.replace(VERB, (m) => `**${m}**`);
}

function definitionFor(term: string, passages: string[]): string | undefined {
  const re = new RegExp(`\\b${term}\\b\\s+(?:is|are|refers to|means)\\s+([^.;]+)`, "i");
  for (const p of passages) {
    const m = p.match(re);
    if (m) {
      const def = m[1].trim();
      return capitalize(def.length > 160 ? def.slice(0, 157) + "…" : def) + ".";
    }
  }
  // No definition in the source: show the sentence where it appears, as a context clue.
  const termRe = new RegExp(`\\b${term}`, "i");
  for (const p of passages) {
    const sentence = splitSentences(p).find((x) => termRe.test(x));
    const clean = sentence?.replace(/^["“]+|["”]+$/g, "");
    if (clean) return `In the reading: "${clean.length > 150 ? clean.slice(0, 147) + "…" : clean}"`;
  }
  return undefined;
}

function isMath(q: ParsedQuestion): boolean {
  return /\d/.test(q.text) && /(how many|how much|what time|solve|calculate|total|each|altogether|per|left|remain|fraction|percent|\$)/i.test(q.text);
}

function iconFor(q: ParsedQuestion): CueIcon {
  if (isMath(q)) return "calc";
  if (/\b(draw|label|diagram|sketch|graph)\b/i.test(q.text)) return "draw";
  if (/\b(discuss|talk|partner|share)\b/i.test(q.text)) return "talk";
  if (q.choices.length) return "check";
  return "write";
}

function starterFor(q: ParsedQuestion): string[] {
  const t = q.text.toLowerCase().replace(/\([^)]*\)/g, "").replace(/\s+/g, " ");
  if (q.choices.length) return [];
  if (isMath(q)) return ["The answer is ___ (write the units)."];
  const pair = t.match(/what (?:are|is) the ([a-z ]+?) and ([a-z ]+?) of /);
  if (pair) return [`The ${pair[1].trim()} are ___.`, `The ${pair[2].trim()} are ___.`];
  if (/^where\b/.test(t) && /, and (what|which|who)\b/.test(t)) return ["It happens in the ___.", "The ___ is ___."];
  if (/\bpredict\b/.test(t)) return ["I predict that ___ because ___."];
  if (/calculat|show how you/.test(t)) return ["My calculation: ___ = ___.", "So the answer is ___."];
  if (/\bhow\b.*\b(supports?|uses?|shows?|persuade)\b/.test(t)) return ["The author uses ___ to ___.", "For example, \"___\" shows ___."];
  if (/compare|contrast|similar|differ/.test(t)) return ["___ and ___ are alike because ___.", "They are different because ___."];
  if (/\birony|ironic\b/.test(t)) return ["Lincoln expected ___, but actually ___."].map((x) => (/lincoln/.test(t) ? x : "The speaker expected ___, but actually ___."));
  if (/\bis .+ correct\b|\bis .+ right\b/.test(t)) return ["___ is (correct / not correct) because ___."];
  if (/\bwhy\b/.test(t)) return ["___ because ___."];
  if (/\bhow\b/.test(t)) return ["One way is ___. This shows ___."];
  if (/\b(name|list|identify)\b/.test(t)) return ["One is ___. Another is ___."];
  if (/\b(opinion|agree|believe|would you)\b/.test(t)) return ["I think ___ because ___."];
  if (/\bwhat does .+ argue\b/.test(t)) return ["The author argues that ___.", "One piece of evidence is \"___\"."];
  if (/\b(describe|explain)\b/.test(t)) return ["___ because ___.", "For example, ___."];
  return ["My answer is ___ because ___."];
}

function lengthFor(q: ParsedQuestion): string {
  const explicit = q.text.match(/\b(\d+|one|two|three|four|five)\s*(?:-|–|to)?\s*(?:\d+\s*)?(sentences?|words?|paragraphs?|examples?|reasons?)\b/i);
  if (explicit) return explicit[0];
  const t = q.text.toLowerCase();
  if (q.choices.length) return "Choose 1 answer";
  if (isMath(q)) return "Show your work + answer with units";
  if (/\b(evidence|quote|quotation)s?\b/.test(t)) return "2–4 sentences with evidence from the text";
  if (/\b(name|list|identify)\b/.test(t)) return "A short list";
  if (/\b(explain|describe|compare|contrast|why|how)\b/.test(t)) return "2–3 sentences";
  return "1–2 sentences";
}

function openEndedSteps(q: ParsedQuestion): string[] | undefined {
  const t = q.text.toLowerCase();
  if (/\b(imagine|feel|feels|felt|perspective|point of view|would you|opinion|agree)\b/.test(t)) {
    return [
      "Find the part of the text the question is about.",
      "Write down one fact or quote from that part.",
      "Answer the question in one sentence.",
      "Add one sentence that explains how the fact supports your answer.",
    ];
  }
  if (/\b(explain|describe)\b.*\band\b/.test(t)) {
    return ["Answer the first part of the question.", "Answer the second part of the question.", "Reread: did you answer both parts?"];
  }
  return undefined;
}

function matchCase(original: string, replacement: string): string {
  return /^[A-Z]/.test(original) ? capitalize(replacement) : replacement;
}

function literalize(text: string, swaps: LanguageReplacement[]): string {
  let out = text;
  for (const [idiom, plain] of Object.entries(IDIOMS)) {
    const re = new RegExp(idiom.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const m = out.match(re);
    if (m) {
      swaps.push({ original: m[0], replacement: plain });
      out = out.replace(re, matchCase(m[0], plain));
    }
  }
  for (const [re, plain] of VAGUE_SWAPS) {
    const m = out.match(re);
    if (m) {
      swaps.push({ original: m[0], replacement: plain });
      out = out.replace(re, matchCase(m[0], plain));
    }
  }
  return out;
}

function chunkText(passage: string, maxWords: number): string[] {
  const sentences = splitSentences(passage).flatMap((s) => shortenSentence(s, maxWords));
  const paras: string[] = [];
  for (let i = 0; i < sentences.length; i += 2) paras.push(sentences.slice(i, i + 2).join(" "));
  return paras;
}

function readMinutes(text: string): number {
  return Math.max(2, Math.ceil(words(text).length / 110));
}

function questionMinutes(q: ParsedQuestion): number {
  if (q.choices.length) return 1;
  return isMath(q) ? 4 : 3;
}

const SPOKEN_ALT: [RegExp, string][] = [
  [/discuss with (?:a|your) partner|turn and talk/i, "Written option: write your ideas in 2–3 bullet points and trade papers with your partner."],
  [/watch the video/i, "Written option: use the transcript or captions for the video."],
  [/class discussion|discuss/i, "Written option: write your contribution on a sticky note or in the class chat."],
  [/listen/i, "Written option: ask for the written version of what you will hear."],
];

export function adaptOffline(source: string, profile: LearnerProfile): AdaptedAssignment {
  const has = (s: SupportId) => profile.supports.includes(s);
  const parsed = parseAssignment(source);
  const vocab = keyVocabulary(source, 6);
  const swaps: LanguageReplacement[] = [];
  const changes: Change[] = [];
  const teacherNotes: string[] = [];
  const sections: Section[] = [];
  const barriers = detectBarriers(source);
  const lit = (t: string) => (has("literal-language") ? literalize(t, swaps) : t);
  const emph = (t: string) => (has("highlight-verbs") ? boldVerb(t) : t);
  const maxWords = has("chunked-text") ? 15 : 22;

  const topic = (parsed.title ?? (vocab[0] ? capitalize(vocab[0]) : "this topic")).replace(/^(close reading|lesson|unit|worksheet|assignment|homework)\s*[:\-–—]\s*/i, "");
  const qCount = parsed.questions.filter((q) => !/[a-h]$/.test(q.label)).length || parsed.questions.length;
  const readingWords = parsed.passages.join(" ");
  const totalMinutes = (parsed.passages.length ? readMinutes(readingWords) : 0) + parsed.questions.reduce((m, q) => m + questionMinutes(q), 0);

  const barrierFor = (needs: NeedId[], fallback: string) =>
    barriers.find((b) => b.needs.some((n) => needs.includes(n)))?.issue ?? fallback;

  // ---------- Start here
  if (has("start-step")) {
    sections.push({
      heading: "Start here",
      minutes: 1,
      blocks: [
        {
          type: "direction",
          icon: "write",
          text: emph(vocab[0] ? `Write your name at the top. Then circle the word "${vocab[0]}" the first time you see it.` : "Write your name at the top and number your paper 1 to " + qCount + "."),
        },
      ],
    });
    changes.push({ title: "Added a one-minute first step", detail: "A no-decision starter makes beginning the work automatic.", barrier: "Getting started on a long task", need: "adhd", evidence: "udl-strategy" });
  }

  // ---------- Expectations
  const expectationItems = [
    `What I will do: ${parsed.passages.length ? "read about " + topic + " and " : ""}answer ${qCount} question${qCount === 1 ? "" : "s"}.`,
    `How much: ${parsed.questions.map((q) => `#${q.label} — ${lengthFor(q)}`).join("; ") || "complete each task"}.`,
    `How long: about ${totalMinutes} minutes.`,
    `I am finished when: every question has an answer and I checked my work.`,
    `Then I will: hand it in and read quietly or do my next task.`,
  ];
  if (has("explicit-expectations")) {
    changes.push({ title: "Made expectations explicit", detail: "States what to do, how much, how long, and what finished means.", barrier: barrierFor(["autism"], "Unstated expectations about length and completion"), need: "autism", evidence: "teacch" });
  }

  // ---------- Vocabulary
  const vocabBlocks: Block[] = has("vocab-preview")
    ? vocab.map((term) => ({ type: "vocab", term, syllables: syllabify(term), definition: definitionFor(term, parsed.passages), icon: "read" as CueIcon }))
    : [];
  if (vocabBlocks.length) {
    changes.push({ title: "Previewed key vocabulary", detail: `Broke ${vocabBlocks.length} academic words into syllables before the reading — every term is still used in the assignment.`, barrier: barrierFor(["dyslexia"], "Long academic words"), need: "dyslexia", evidence: "udl-language" });
  }

  // ---------- Reading
  const isProtected = (p: string) => /^["“]/.test(p.trim()) || (parsed.passages.some((x) => /^["“]/.test(x.trim())) && !/^(as we|read|this|in this|the following)/i.test(p) && parsed.passages.indexOf(p) > parsed.passages.findIndex((x) => /^["“]/.test(x.trim())));
  const protectedCount = parsed.passages.filter(isProtected).length;
  let chunkNo = 0;
  const readingSections: Section[] = parsed.passages.map((p, i) => {
    if (isProtected(p)) {
      // A text being studied (speech, poem, primary source) keeps its exact words.
      const sentences = splitSentences(p);
      const blocks: Block[] = [];
      for (let k = 0; k < sentences.length; k += 2) {
        chunkNo += 1;
        const chunk = sentences.slice(k, k + 2).join(" ");
        blocks.push({ type: "text", text: `[${chunkNo}] ${has("vocab-preview") ? boldFirst(chunk, vocab) : chunk}` });
      }
      return {
        heading: protectedCount > 1 ? `Read the text — part ${i}` : "Read the text",
        purpose: i === parsed.passages.findIndex(isProtected) ? "These are the author's exact words, split into numbered chunks." : undefined,
        minutes: has("task-chunks") ? readMinutes(p) : undefined,
        blocks,
      };
    }
    const paras = has("chunked-text") || has("task-chunks") ? chunkText(lit(p), maxWords) : [lit(p)];
    const blocks: Block[] = [];
    if (has("chunked-text") && paras.length > 1) {
      blocks.push({ type: "keyIdea", text: boldFirst(paras[0].split(/(?<=\.)\s/)[0], vocab) });
    }
    paras.forEach((t) => blocks.push({ type: "text", text: has("chunked-text") || has("vocab-preview") ? boldFirst(t, vocab) : t, icon: undefined }));
    return {
      heading: parsed.passages.length > 1 ? `Read part ${i + 1}` : "Read",
      minutes: has("task-chunks") ? readMinutes(p) : undefined,
      blocks,
    };
  });
  if (has("chunked-text") && parsed.passages.length) {
    changes.push({ title: "Chunked the reading", detail: `Split long sentences at natural clause breaks into short paragraphs (aim ≤ ${maxWords} words per sentence). No facts removed.`, barrier: barrierFor(["dyslexia", "adhd"], "Dense text"), need: "dyslexia", evidence: "bda-style" });
  }

  // ---------- Guided notes
  let notesBlock: Block | null = null;
  if (has("guided-notes") && parsed.passages.length && vocab.length) {
    const lines: string[] = [];
    const bank: string[] = [];
    for (const s of splitSentences(readingWords)) {
      const term = vocab.find((v) => new RegExp(`\\b${v}\\b`, "i").test(s) && !bank.includes(v));
      if (!term) continue;
      lines.push(s.replace(new RegExp(`\\b${term}\\b`, "i"), "____"));
      bank.push(term);
      if (lines.length >= 6) break;
    }
    if (lines.length >= 2) {
      notesBlock = { type: "notes", text: `Word bank: ${[...bank].sort().join(", ")}`, items: lines, icon: "write" };
      changes.push({ title: "Added guided notes", detail: "Fill-in-the-blank notes capture the key facts so nothing depends on remembering what was said.", barrier: barrierFor(["apd"], "Key information delivered once, orally"), need: "apd", evidence: "guided-notes" });
    }
  }

  // ---------- Directions
  const directionBlocks: Block[] = parsed.directions.flatMap((d) =>
    (has("written-directions") ? splitSentences(lit(d)).flatMap((s) => shortenSentence(s, 14, true)) : [lit(d)]).map((t) => {
      const alt = has("quiet-alternatives") ? SPOKEN_ALT.find(([re]) => re.test(t))?.[1] : undefined;
      return { type: "direction" as const, text: emph(t) + (alt ? ` ${alt}` : ""), icon: has("visual-cues") ? ("read" as CueIcon) : undefined };
    }),
  );
  if (has("written-directions")) {
    changes.push({ title: "Every direction in writing, one per line", detail: "Multi-step instructions were split into numbered single steps the student can reread anytime.", barrier: barrierFor(["apd", "adhd"], "Multi-step directions"), need: "apd", evidence: "asha-portal" });
  }

  // ---------- Questions
  const questionBlock = (q: ParsedQuestion): Block => {
    const supports: Block["supports"] = {};
    if (has("reduced-writing") && !q.choices.length) {
      const st = starterFor(q);
      if (st.length) supports.starters = st;
      const bank = vocab.filter((v) => readingWords.toLowerCase().includes(v.toLowerCase()));
      if (bank.length && !isMath(q)) supports.wordBank = bank;
      if (!isMath(q)) supports.responseOptions = ["Write it", "Type it", "Say it and record it"];
    }
    if (has("explicit-expectations") || has("task-chunks")) supports.length = lengthFor(q);
    if (has("quiet-alternatives")) {
      const alt = SPOKEN_ALT.find(([re]) => re.test(q.text))?.[1];
      if (alt) supports.hint = alt;
    }
    if (has("open-ended-scaffold")) {
      const steps = openEndedSteps(q);
      if (steps) supports.steps = steps;
    }
    if (isMath(q) && (has("task-chunks") || has("open-ended-scaffold") || has("chunked-text"))) {
      supports.steps = ["Underline the numbers you need.", "Decide which operation to use and why.", "Solve, then write the answer with units."];
    }
    return {
      type: "question",
      number: q.label,
      text: emph(lit(q.text)),
      items: q.choices.length ? q.choices : undefined,
      supports: Object.keys(supports).length ? supports : undefined,
      icon: has("visual-cues") ? iconFor(q) : undefined,
      minutes: has("task-chunks") ? questionMinutes(q) : undefined,
    };
  };

  const questionSections: Section[] = [];
  if (has("task-chunks") && parsed.questions.length > 2) {
    for (let i = 0; i < parsed.questions.length; i += 2) {
      const group = parsed.questions.slice(i, i + 2);
      questionSections.push({
        heading: `Answer question${group.length > 1 ? "s" : ""} ${group.map((q) => q.label).join(" & ")}`,
        minutes: group.reduce((m, q) => m + questionMinutes(q), 0),
        blocks: group.map(questionBlock),
      });
      if (has("movement-breaks") && i + 2 < parsed.questions.length && i % 4 === 2) {
        questionSections.push({ heading: "Brain break", minutes: 2, blocks: [{ type: "break", minutes: 2, icon: "move", text: "Stand up, stretch, and get a drink of water. Then come back to the next step." }] });
      }
    }
  } else if (parsed.questions.length) {
    questionSections.push({ heading: "Questions", blocks: parsed.questions.map(questionBlock) });
  }
  if (has("task-chunks")) {
    changes.push({ title: "Split the work into timed chunks", detail: "Each section is one short task with an estimated time, so the end is always in sight.", barrier: barrierFor(["adhd"], "One long block of work"), need: "adhd", evidence: "segmenting" });
  }
  if (has("reduced-writing")) {
    changes.push({ title: "Lightened the writing load, not the thinking", detail: "Sentence starters, a spelling word bank, and alternative ways to respond — the questions themselves are unchanged.", barrier: "Spelling and handwriting effort competing with ideas", need: "dyslexia", evidence: "udl-expression" });
  }

  // ---------- Break between reading and questions
  const breakSection: Section | null =
    has("movement-breaks") && totalMinutes >= 10 && !questionSections.some((s) => s.heading === "Brain break")
      ? { heading: "Brain break", minutes: 2, blocks: [{ type: "break", minutes: 2, icon: "move", text: "Stand up, stretch, and get a drink of water. Then come back to the next step." }] }
      : null;
  if (has("movement-breaks") && breakSection) {
    changes.push({ title: "Planned a short break", detail: "A 2-minute structured break between reading and writing.", barrier: "Sustaining attention through the full task", need: "adhd", evidence: "adhd-classroom" });
  }

  // ---------- Example
  const allMath = parsed.questions.length > 0 && parsed.questions.filter(isMath).length >= parsed.questions.length / 2;
  const usesEvidence = parsed.questions.some((q) => /\b(evidence|quote|text)\b/i.test(q.text));
  const exampleBlock: Block | null = has("worked-example")
    ? allMath
      ? {
          type: "example",
          text: "Example problem (not from your assignment): A recipe uses 1/2 cup of milk for one batch. How much milk is needed for 3 batches?",
          items: ["Example answer: 3 × 1/2 = 3/2 = 1 1/2 cups of milk.", "Notice: it shows the operation, the work, and the units."],
        }
      : usesEvidence
        ? {
            type: "example",
            text: "Example question (not from your assignment): In \"Goldilocks,\" how does Goldilocks feel about Baby Bear's porridge?",
            items: ["Example answer: Goldilocks likes Baby Bear's porridge. The text says she \"ate it all up,\" which shows she enjoyed it.", "Notice: it answers, quotes the text, and explains what the quote shows."],
          }
        : {
            type: "example",
            text: "Example question (not from your assignment): Why do people wear coats in winter?",
            items: ["Example answer: People wear coats in winter because the air is cold. A coat traps body heat, so the person stays warm.", "Notice: it answers the question, gives a reason, and uses 2 sentences."],
          }
    : null;
  if (exampleBlock) {
    changes.push({ title: "Showed what a complete answer looks like", detail: "A model answer on an unrelated question shows the expected format without giving away any answers.", barrier: barrierFor(["autism"], "No model of the expected answer"), need: "autism", evidence: "ncaep" });
  }

  // ---------- Finish
  const checklistItems = parsed.questions.map((q) => `Question ${q.label} answered`);
  const selfCheck = [
    `I answered all ${parsed.questions.length} question${parsed.questions.length === 1 ? "" : "s"}.`,
    parsed.questions.some(isMath) ? "Every math answer has units and shows my work." : "Each answer uses words from the reading.",
    parsed.questions.some((q) => /\band\b/i.test(q.text)) ? "I answered every part of questions that ask two things." : "My answers make sense when I read them again.",
  ];

  if (has("predictable-structure")) {
    sections.push({
      heading: "What this is about",
      blocks: [{ type: "text", text: `This assignment is about ${topic}.` }, ...(parsed.passages.length ? [{ type: "keyIdea" as const, text: boldFirst(splitSentences(parsed.passages[0])[0] ?? "", vocab) }] : [])],
    });
    sections.push({
      heading: "What to do",
      blocks: [
        ...(has("explicit-expectations") ? [{ type: "expectations" as const, items: expectationItems }] : []),
        ...directionBlocks,
      ],
    });
    const work: Block[] = [...vocabBlocks, ...readingSections.flatMap((s) => s.blocks), ...(notesBlock ? [notesBlock] : []), ...(exampleBlock ? [exampleBlock] : []), ...questionSections.flatMap((s) => s.blocks)];
    sections.push({ heading: "The work", blocks: work });
    sections.push({
      heading: "When you finish",
      blocks: [{ type: "checklist", items: has("self-check") ? selfCheck : checklistItems }, { type: "text", text: "Hand your work to your teacher. Then start your next task." }],
    });
    changes.push({ title: "Used a predictable four-part layout", detail: "What it's about → What to do → The work → When you finish. The same order every time.", barrier: "Unpredictable format", need: "autism", evidence: "teacch" });
  } else {
    if (has("explicit-expectations")) sections.push({ heading: "Before you start", blocks: [{ type: "expectations", items: expectationItems }] });
    if (vocabBlocks.length) sections.push({ heading: "Words to know", purpose: "Read these first. You will see them in the assignment.", blocks: vocabBlocks });
    if (directionBlocks.length) sections.push({ heading: "Directions", blocks: directionBlocks });
    sections.push(...readingSections);
    if (notesBlock) sections.push({ heading: "Guided notes", purpose: "Fill in the blanks from the reading.", blocks: [notesBlock] });
    if (breakSection) sections.push(breakSection);
    if (exampleBlock) sections.push({ heading: "What a good answer looks like", blocks: [exampleBlock] });
    sections.push(...questionSections);
    if (has("checklist") && !has("self-check")) sections.push({ heading: "Track your progress", blocks: [{ type: "checklist", items: checklistItems }] });
    if (has("self-check")) sections.push({ heading: "Check your work", blocks: [{ type: "checklist", items: has("checklist") ? [...checklistItems, ...selfCheck] : selfCheck }] });
  }

  if (has("checklist")) changes.push({ title: "Made progress visible", detail: "A tick-box list for each question.", barrier: "No visible sense of progress", need: "adhd", evidence: "self-regulation" });
  if (has("literal-language") && swaps.length) {
    changes.push({ title: "Replaced figurative and vague wording", detail: `${swaps.length} phrase${swaps.length === 1 ? "" : "s"} rewritten to say exactly what is meant.`, barrier: barrierFor(["autism"], "Figurative or vague wording"), need: "autism", evidence: "figurative" });
  }
  if (has("highlight-verbs")) changes.push({ title: "Bolded the action in each instruction", detail: "The verb that says what to do stands out in every direction and question.", barrier: "Locating the actual task inside long instructions", need: "adhd", evidence: "udl-knowledge" });

  // ---------- Teacher notes
  if (has("read-aloud")) teacherNotes.push("Allow text-to-speech or a reader for the passage and questions; the student view has a read-aloud button.");
  if (has("check-understanding")) {
    teacherNotes.push("After giving directions, ask the student to point to the step they will do first instead of asking \"Any questions?\"");
    teacherNotes.push("Face the student when speaking, keep background noise low, and give the written directions before speaking them.");
  }
  if (has("quiet-alternatives") && /discuss|partner|talk|video|listen/i.test(source)) teacherNotes.push("A listening-based task is in this assignment — the written option reaches the same objective.");
  if (has("sensory-notes")) teacherNotes.push("Give a 2-minute warning before switching activities, and offer a quieter workspace if the room gets loud. Check with the student which supports they prefer.");
  if (has("movement-breaks")) teacherNotes.push("Breaks are short and structured; a visual timer helps the student return on time.");
  if (profile.expectations === "modify") teacherNotes.push("Modified expectations were requested, but offline mode keeps all questions required. Mark optional items yourself, or use the AI engine.");

  return {
    title: parsed.title ? `${parsed.title}` : `${topic}`,
    studentIntro: `This assignment is about ${topic}. ${parsed.passages.length ? "You will read a short text and " : "You will "}answer ${qCount} question${qCount === 1 ? "" : "s"}.`,
    estimatedMinutes: has("task-chunks") || has("explicit-expectations") ? totalMinutes : undefined,
    sections,
    changes: dedupeChanges(changes),
    teacherNotes,
    barriers,
    preserved: {
      objectives: parsed.questions.slice(0, 4).map((q) => `Question ${q.label}: ${q.text.length > 90 ? q.text.slice(0, 87) + "…" : q.text}`),
      vocabulary: vocab,
    },
    languageReplacements: swaps.length ? swaps : undefined,
  };
}

function dedupeChanges(changes: Change[]): Change[] {
  const seen = new Set<string>();
  return changes.filter((c) => (seen.has(c.title) ? false : (seen.add(c.title), true)));
}
