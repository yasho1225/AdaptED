/**
 * Deterministic analysis of an original assignment. Runs on both client and
 * server: it powers the Barrier Lens, the before/after metrics, the question
 * inventory the AI must preserve, and the offline engine.
 */
import type { Barrier, NeedId, TextMetrics } from "./types";

export interface ParsedQuestion {
  /** Label as written in the original ("1", "2b", "Q3"), normalized */
  label: string;
  text: string;
  choices: string[];
}

export interface ParsedAssignment {
  title: string | null;
  passages: string[];
  directions: string[];
  questions: ParsedQuestion[];
}

const QUESTION_LINE = /^\s*(?:Q(?:uestion)?\s*)?(\d{1,2})\s*[.):]\s+(.+)$/i;
const SUB_LINE = /^\s*\(?([a-h])[.)]\s+(.+)$/i;
const CHOICE_LINE = /^\s*\(?([A-Ea-e])[.)]\s+(.+)$/;
const IMPERATIVE =
  /^(annotate|reread|mark|read|answer|explain|describe|write|list|name|complete|use|show|draw|label|compare|contrast|identify|define|discuss|summarize|solve|find|calculate|circle|underline|highlight|choose|select|match|fill|look|listen|watch|think|work|turn|underline|analyze|support|cite|create|make|record|review|check|tell|give|include|after|before|then|be sure|remember)\b/i;

export function normalize(text: string): string {
  return text.replace(/\r\n?/g, "\n").replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\t/g, " ");
}

export function splitSentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"(])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function words(text: string): string[] {
  return text.match(/[A-Za-zÀ-ÿ'’-]+|\d+(?:[.,]\d+)?/g) ?? [];
}

/** Heuristic English syllable counter (good enough for readability estimates). */
export function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  if (w.length <= 3) return 1;
  const stripped = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
  const groups = stripped.match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups?.length ?? 1);
}

const ONSETS = new Set([
  "bl", "br", "ch", "cl", "cr", "dr", "fl", "fr", "gl", "gr", "ph", "pl", "pr", "sh", "th", "tr", "tw", "wh", "wr",
  "chr", "sch", "scr", "shr", "spl", "spr", "str", "thr",
]);

/** Split a word into readable syllable chunks joined by middle dots (onset-maximization heuristic). */
export function syllabify(word: string): string {
  const w = word.trim();
  const lower = w.toLowerCase();
  if (w.length < 5 || /[^a-z]/.test(lower)) return w;
  const groups: { start: number; end: number }[] = [];
  const re = /[aeiou]+y?|(?<=[^aeiou])y/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(lower))) groups.push({ start: m.index, end: m.index + m[0].length });
  if (groups.length && groups[0].start === 0 && lower[0] === "y") groups.shift();
  const last = groups[groups.length - 1];
  if (groups.length > 1 && last) {
    const tail = lower.slice(last.start);
    const before = lower[last.start - 1] ?? "";
    const silentE = tail === "e" && !/[^aeiou]le$/.test(lower);
    const silentEd = /^e[ds]$/.test(tail) && !/[td]/.test(before) && !(tail === "es" && /[sxz]|ch|sh/.test(lower.slice(last.start - 2, last.start)));
    if (silentE || silentEd) groups.pop();
  }
  if (groups.length < 2) return w;
  const cuts: number[] = [];
  for (let i = 0; i < groups.length - 1; i++) {
    const cStart = groups[i].end;
    const cEnd = groups[i + 1].start;
    const cluster = lower.slice(cStart, cEnd);
    if (cluster.length === 0) {
      cuts.push(cEnd);
    } else if (cluster.length === 1) {
      cuts.push(cluster === "x" ? cEnd : cStart);
    } else {
      let cut = cEnd - 1;
      for (let k = Math.min(3, cluster.length); k >= 2; k--) {
        const suffix = cluster.slice(cluster.length - k);
        if (ONSETS.has(suffix)) {
          cut = cEnd - k;
          break;
        }
      }
      if (cluster.endsWith("ck") || cluster === "ng") cut = cEnd;
      cuts.push(cut);
    }
  }
  const parts: string[] = [];
  let prev = 0;
  cuts.forEach((c) => {
    if (c > prev && c < w.length) {
      parts.push(w.slice(prev, c));
      prev = c;
    }
  });
  parts.push(w.slice(prev));
  return parts.join("·");
}

export function computeMetrics(text: string): TextMetrics {
  const prepared = text
    .replace(/\b(a\.m|p\.m|e\.g|i\.e|etc|Mr|Ms|Mrs|Dr|vs)\./gi, (x) => x.replace(/\./g, ""))
    .replace(/\n\s*\n/g, ". ")
    .replace(/\n/g, " ")
    .replace(/\.\s*\./g, ".");
  const sentences = splitSentences(prepared);
  const allWords = words(text).filter((w) => /[A-Za-zÀ-ÿ]/.test(w));
  const wordCount = allWords.length;
  const sentenceCount = Math.max(1, sentences.length);
  const syllables = allWords.reduce((sum, w) => sum + countSyllables(w), 0);
  const longWords = allWords.filter((w) => countSyllables(w) >= 3).length;
  const longest = sentences.reduce((max, s) => Math.max(max, words(s).length), 0);
  const avg = wordCount / sentenceCount;
  const grade = wordCount === 0 ? 0 : 0.39 * avg + 11.8 * (syllables / wordCount) - 15.59;
  return {
    words: wordCount,
    sentences: sentences.length,
    avgSentenceLength: Math.round(avg * 10) / 10,
    longestSentence: longest,
    gradeLevel: Math.max(0, Math.round(grade * 10) / 10),
    longWordsPct: wordCount ? Math.round((longWords / wordCount) * 100) : 0,
  };
}

function looksLikeChoices(lines: string[], parent: string): boolean {
  if (lines.length < 2 || lines.length > 6) return false;
  const short = lines.every((l) => words(l).length <= 14);
  const capital = lines.every((l) => /^\s*\(?[A-E][.)]/.test(l));
  return short && (capital || /\?\s*$/.test(parent) || /choose|select|circle|which/i.test(parent));
}

/** Split an assignment into title, passages, directions and an ordered question inventory. */
export function parseAssignment(raw: string): ParsedAssignment {
  const text = normalize(raw).trim();
  const lines = text.split("\n");
  const questions: ParsedQuestion[] = [];
  const passages: string[] = [];
  const directions: string[] = [];
  let title: string | null = null;
  let paragraph: string[] = [];

  const flushParagraph = () => {
    const p = paragraph.join(" ").trim();
    paragraph = [];
    if (!p) return;
    const sentences = splitSentences(p);
    const firstSentence = sentences[0] ?? p;
    if (/^["“]/.test(p)) {
      passages.push(p);
    } else if (words(p).length <= 40 && IMPERATIVE.test(firstSentence) && !/[^.]{200,}/.test(p)) {
      directions.push(p);
    } else if (words(p).length <= 80 && sentences.some((s) => IMPERATIVE.test(s))) {
      // A short intro mixing context and instructions: separate the two.
      const context = sentences.filter((s) => !IMPERATIVE.test(s));
      const instr = sentences.filter((s) => IMPERATIVE.test(s));
      if (context.length) passages.push(context.join(" "));
      if (instr.length) directions.push(instr.join(" "));
    } else {
      passages.push(p);
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      flushParagraph();
      continue;
    }

    if (title === null && questions.length === 0 && passages.length === 0 && directions.length === 0 && paragraph.length === 0) {
      const wc = words(line).length;
      if (wc > 0 && wc <= 12 && !/[.?!]$/.test(line) && !QUESTION_LINE.test(line)) {
        title = line.replace(/[:\-–—]+$/, "").trim();
        continue;
      }
    }

    const q = line.match(QUESTION_LINE);
    if (q) {
      flushParagraph();
      const label = q[1];
      let qText = q[2].trim();
      // gather continuation lines + sub-items
      const subs: string[] = [];
      let j = i + 1;
      while (j < lines.length) {
        const next = lines[j].trim();
        if (!next) {
          // allow one blank line before lettered items
          const after = lines[j + 1]?.trim() ?? "";
          if (SUB_LINE.test(after) || CHOICE_LINE.test(after)) {
            j++;
            continue;
          }
          break;
        }
        if (QUESTION_LINE.test(next)) break;
        if (SUB_LINE.test(next) || CHOICE_LINE.test(next)) subs.push(next);
        else if (subs.length === 0) qText += " " + next;
        else break;
        j++;
      }
      i = j - 1;

      if (subs.length && looksLikeChoices(subs, qText)) {
        questions.push({ label, text: qText, choices: subs.map((s) => s.replace(/^\s*/, "")) });
      } else if (subs.length) {
        questions.push({ label, text: qText, choices: [] });
        subs.forEach((s) => {
          const m = s.match(SUB_LINE)!;
          questions.push({ label: `${label}${m[1].toLowerCase()}`, text: m[2].trim(), choices: [] });
        });
      } else {
        questions.push({ label, text: qText, choices: [] });
      }
      continue;
    }

    // Unnumbered question lines become labelled questions too
    if (/\?\s*$/.test(line) && words(line).length >= 4 && paragraph.length === 0) {
      flushParagraph();
      questions.push({ label: `${questions.length + 1}`, text: line, choices: [] });
      continue;
    }

    paragraph.push(line);
  }
  flushParagraph();

  // A trailing "After reading, complete the following:" style line is a direction.
  return { title, passages, directions, questions };
}

/** The original's reading load (passages, directions, question stems) — comparable with readingText() of an adaptation. */
export function originalReadingText(raw: string): string {
  const p = parseAssignment(raw);
  return [...p.directions, ...p.passages, ...p.questions.map((q) => q.text)].join("\n");
}

/* ------------------------------------------------------------------ */
/* Barrier Lens                                                        */
/* ------------------------------------------------------------------ */

export const IDIOMS: Record<string, string> = {
  "piece of cake": "very easy",
  "in a nutshell": "in summary",
  "hit the books": "study",
  "break the ice": "start the conversation",
  "on the same page": "agreeing about the plan",
  "bite off more than": "try to do too much",
  "the ball is in your court": "it is your turn to decide",
  "under the weather": "sick",
  "cut corners": "skip important steps",
  "get the hang of": "learn how to do",
  "think outside the box": "think of new ideas",
  "food for thought": "an idea to think about",
  "tip of the iceberg": "a small part of a bigger problem",
  "in your own words": "using your own sentences, not copying the text",
  "dig deeper": "look for more details",
  "take a stab at": "try",
  "jot down": "write a short note about",
  "go the extra mile": "do more than what is required",
  "back up your answer": "give a reason or evidence for your answer",
  "back up your claim": "give evidence for your claim",
  "wrap up": "finish",
  "touch on": "briefly write about",
  "shed light on": "explain",
  "at the end of the day": "in the end",
  "a far cry from": "very different from",
  "brainstorm": "make a list of ideas",
  "keep in mind": "remember",
  "take a look at": "look at",
  "turned a blind eye": "chose to ignore",
  "turn a blind eye": "choose to ignore",
  "heart of the matter": "most important part",
  "the big picture": "the main idea",
  "run out of steam": "lose energy",
  "on thin ice": "in a risky situation",
  "spill the beans": "tell the secret",
  "a drop in the bucket": "a very small amount",
  "hold your horses": "wait",
  "costs an arm and a leg": "is very expensive",
  "lion's share": "the largest part",
  "the last straw": "the final problem that causes a reaction",
  "bring to light": "show",
  "hand in hand": "together",
  "draw a conclusion": "decide what the evidence shows",
  "draw conclusions": "decide what the evidence shows",
  "point of view": "the way a person thinks about something",
};

const VAGUE = /\b(briefly|a few|several|a bit|a little|as needed|in detail|thoroughly|too long|and so on)\b/i;
const OPEN_VERB = /\b(explain|describe|discuss|analyze|reflect|consider|imagine|justify|evaluate)\b/i;
const LENGTH_HINT = /\b(\d+|one|two|three|four|five)\s*(?:-|–|to)?\s*(?:\d+\s*)?(sentences?|words?|paragraphs?|examples?|reasons?|points?)\b/i;
const SPOKEN = /\b(listen|as we discussed|as discussed in class|your teacher will (?:explain|read|tell)|discuss with (?:a|your) partner|turn and talk|class discussion|watch the video|dictation|lecture|i will explain|we talked about)\b/i;
const MULTI_STEP = /\b(and then|then|after that|and also|before you|once you)\b/i;

/** Find barriers in the original text. Quotes are verbatim substrings so the UI can highlight them. */
export function detectBarriers(raw: string): Barrier[] {
  const text = normalize(raw);
  const barriers: Barrier[] = [];
  const seen = new Set<string>();
  const add = (quote: string, issue: string, needs: NeedId[]) => {
    const q = quote.trim();
    if (!q || seen.has(q.toLowerCase()) || !text.includes(q)) return;
    seen.add(q.toLowerCase());
    barriers.push({ quote: q, issue, needs });
  };

  const sentences = splitSentences(text.replace(/\n+/g, " \n "));
  for (const sRaw of sentences) {
    const s = sRaw.replace(/\s*\n\s*/g, " ").trim();
    if (!text.includes(s)) continue;
    const wc = words(s).length;
    if (wc >= 24) add(s, `Long sentence (${wc} words) — a lot to decode and hold in memory at once.`, ["dyslexia", "adhd", "apd"]);
    const imperatives = (s.match(new RegExp(IMPERATIVE.source.replace("^", "\\b"), "gi")) ?? []).length;
    if (MULTI_STEP.test(s) && imperatives >= 2) add(s, "Several steps packed into one instruction — easy to lose track of what comes next.", ["adhd", "apd", "autism"]);
    if (SPOKEN.test(s)) add(s.match(SPOKEN)![0], "Relies on spoken information or listening — no written backup.", ["apd"]);
    if (OPEN_VERB.test(s) && !LENGTH_HINT.test(s) && /[?.]$/.test(s) && wc < 40) {
      const verb = s.match(OPEN_VERB)![0];
      add(s.slice(s.indexOf(verb)).split(/[.?]/)[0] || verb, `"${verb}" with no stated length or format — unclear what a complete answer looks like.`, ["autism", "adhd"]);
    }
  }

  const lower = text.toLowerCase();
  for (const idiom of Object.keys(IDIOMS)) {
    const at = lower.indexOf(idiom);
    if (at >= 0) add(text.slice(at, at + idiom.length), `Figurative phrase — means "${IDIOMS[idiom]}". May be read literally.`, ["autism", "apd"]);
  }
  const vague = text.match(VAGUE);
  if (vague) add(vague[0], `Vague amount ("${vague[0]}") — how much is enough is not stated.`, ["autism", "adhd"]);

  // Dense paragraphs
  text.split(/\n\s*\n/).forEach((p) => {
    const wc = words(p).length;
    if (wc >= 90 && (p.match(/^\s*\d+[.)]/gm)?.length ?? 0) < 2) {
      const first = splitSentences(p)[0] ?? p;
      add(first, `Dense paragraph (${wc} words) with no breaks or headings.`, ["dyslexia", "adhd"]);
    }
  });

  // Hard academic words (≥4 syllables, repeated or key)
  const freq = new Map<string, number>();
  const firstForm = new Map<string, string>();
  words(text).forEach((w) => {
    if (countSyllables(w) < 4 || w.length < 9 || STOP_LONG.has(w.toLowerCase())) return;
    const k = stem(w);
    if (!firstForm.has(k)) firstForm.set(k, w);
    freq.set(firstForm.get(k)!, (freq.get(firstForm.get(k)!) ?? 0) + 1);
  });
  [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .forEach(([w]) => add(w, `Long academic word (${countSyllables(w)} syllables) — keep it, but pre-teach and break it into parts.`, ["dyslexia"]));

  return barriers.slice(0, 14);
}

function stem(w: string): string {
  return w.toLowerCase().replace(/ies$/, "y").replace(/(ing|ed|es|s)$/, "").replace(/e$/, "");
}

/** Candidate academic vocabulary the adapted version must keep. */
export function keyVocabulary(raw: string, max = 8): string[] {
  const text = normalize(raw);
  const questionText = parseAssignment(text).questions.map((q) => q.text).join(" ").toLowerCase();
  const sentenceStarts = new Set(
    splitSentences(text.replace(/\n+/g, " ")).map((s) => words(s)[0]?.toLowerCase()).filter(Boolean),
  );
  const found = new Map<string, { word: string; n: number; syl: number }>();
  const lowercaseSeen = new Set(words(text).filter((w) => /^[a-z]/.test(w)).map(stem));
  for (const w of words(text)) {
    if (/['’\d-]/.test(w)) continue;
    const key = stem(w);
    if (w.length < 7 || STOP_LONG.has(w.toLowerCase()) || STOP_LONG.has(key)) continue;
    // Skip proper nouns that are not at the start of a sentence
    if (/^[A-Z]/.test(w) && (!sentenceStarts.has(w.toLowerCase()) || !lowercaseSeen.has(key))) continue;
    const cur = found.get(key);
    found.set(key, { word: cur && cur.word.length <= w.length ? cur.word : w, n: (cur?.n ?? 0) + 1, syl: countSyllables(w) });
  }
  return [...found.entries()]
    .map(([key, v]) => {
      const inQuestion = questionText.includes(key);
      const inflected = /(ing|ed|ly)$/.test(v.word.toLowerCase());
      const score = v.n * 2 + (inQuestion ? 3 : 0) + v.syl - (inflected ? 4 : 0);
      return { word: v.word.toLowerCase(), score, eligible: v.syl >= 3 || v.n >= 2 };
    })
    .filter((v) => v.eligible && v.score >= 4)
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map((v) => v.word);
}

const STOP_LONG = new Set([
  "following", "important", "everything", "something", "different", "information", "assignment",
  "question", "questions", "complete", "sentence", "sentences", "remember", "understand", "yourself", "another", "together",
  "example", "examples", "paragraph", "paragraphs", "describe", "explain", "including", "answer", "answers",
  "evidence", "probably", "actually", "usually", "especially", "carefully", "beginning", "continue",
  "afterward", "afterwards", "whatever", "however", "therefore", "anything", "everyone", "somebody",
  "completely", "direction", "directions", "worksheet", "problem", "problems", "possible", "really", "several", "activity",
  "between", "without", "through", "because", "already", "students", "student", "minutes", "partner", "reasoning",
  "thinking", "calculated", "throughout", "altogether", "rather", "living", "running", "annotate", "discussed",
  "correct", "analyze", "analysis", "reasonable", "foundation", "producing", "releasing", "combine", "absorbs",
]);
