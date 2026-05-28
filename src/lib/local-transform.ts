import type {
  AccessibilityMode,
  ContentBlock,
  TransformResult,
} from "./types";
import { MODES } from "./constants";

const SIMPLIFY: Record<string, string> = {
  photosynthesis: "how plants make food from light",
  chlorophyll: "the green part in leaves",
  glucose: "plant sugar",
  ecosystems: "living communities in nature",
  atmosphere: "the air around Earth",
  carbon: "carbon",
  dioxide: "dioxide",
};

function simplifyWord(word: string): string {
  const lower = word.toLowerCase().replace(/[^a-z]/g, "");
  return SIMPLIFY[lower] ?? word;
}

function splitSentences(text: string): string[] {
  return text
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Dyslexia: short chunks + key ideas — no steps or section headers */
function transformDyslexia(input: string): ContentBlock[] {
  const blocks: ContentBlock[] = [
    { type: "title", text: "Easy-Read Version" },
    { type: "note", text: "Read one short block at a time. **Bold** = big idea." },
  ];

  splitParagraphs(input).forEach((para) => {
    splitSentences(para).forEach((s) => {
      const simple = s
        .split(/\s+/)
        .map(simplifyWord)
        .join(" ");
      const words = simple.split(/\s+/);
      if (words.length > 12) {
        const mid = Math.ceil(words.length / 2);
        blocks.push({ type: "chunk", text: words.slice(0, mid).join(" ") + "." });
        blocks.push({ type: "chunk", text: words.slice(mid).join(" ") + "." });
      } else {
        blocks.push({ type: "chunk", text: simple });
      }
    });
  });

  if (blocks.length > 4) {
    blocks.splice(3, 0, {
      type: "key",
      text: "**Main idea:** " + splitSentences(input)[0]?.replace(/\.$/, "") + ".",
    });
  }

  return blocks.slice(0, 16);
}

/** ADHD: numbered actionable steps + checkboxes — no paragraph chunks */
function transformAdhd(input: string): ContentBlock[] {
  const blocks: ContentBlock[] = [
    { type: "title", text: "Your Action Plan" },
    { type: "note", text: "Do one step. Check it off. Then go to the next." },
    { type: "step", text: "Step 1: Read the full assignment once without writing." },
  ];

  let step = 2;
  splitParagraphs(input).forEach((para) => {
    const numbered = para.match(/\d+\.\s*[^\n]+/g);
    if (numbered) {
      numbered.forEach((q) => {
        blocks.push({ type: "step", text: `Step ${step}: Answer — ${q.trim()}` });
        blocks.push({ type: "bullet", text: "☐ Write your answer in complete sentences." });
        step += 1;
      });
      return;
    }
    splitSentences(para).forEach((s) => {
      blocks.push({ type: "step", text: `Step ${step}: ${s}` });
      step += 1;
    });
  });

  blocks.push({ type: "step", text: `Step ${step}: Review your work against the instructions.` });
  blocks.push({ type: "bullet", text: "☐ I finished every step above." });

  return blocks.slice(0, 16);
}

/** APD: heading captions + bullets + takeaways — no Step N format */
function transformApd(input: string): ContentBlock[] {
  const blocks: ContentBlock[] = [
    { type: "title", text: "Structured Study Notes" },
    { type: "caption", text: "TOPIC: Main content" },
  ];

  splitParagraphs(input).forEach((para, i) => {
    if (i > 0) {
      blocks.push({ type: "caption", text: `SECTION: Part ${i + 1}` });
    }
    splitSentences(para).forEach((s) => {
      blocks.push({ type: "bullet", text: `• ${s}` });
    });
  });

  blocks.push({ type: "caption", text: "TOPIC: Key takeaways" });
  blocks.push({
    type: "key",
    text: "★ " + (splitSentences(input)[0] ?? "Core idea from the lesson."),
  });
  blocks.push({
    type: "note",
    text: "Read each heading first, then the bullets under it.",
  });

  return blocks.slice(0, 16);
}

/** Autism: fixed 3-section layout every time */
function transformAutism(input: string): ContentBlock[] {
  const sentences = splitSentences(input);
  const first = sentences[0] ?? input.slice(0, 120);

  const blocks: ContentBlock[] = [
    { type: "title", text: "Lesson (Structured Format)" },
    { type: "caption", text: "SECTION 1: WHAT THIS IS" },
    { type: "chunk", text: first },
    { type: "caption", text: "SECTION 2: KEY POINTS" },
  ];

  sentences.slice(1, 6).forEach((s) => {
    blocks.push({ type: "bullet", text: `• ${s}` });
  });

  blocks.push({ type: "caption", text: "SECTION 3: STEP-BY-STEP BREAKDOWN" });

  let step = 1;
  const questions = input.match(/\d+\.\s*[^\n]+/g);
  if (questions) {
    questions.forEach((q) => {
      blocks.push({ type: "step", text: `Step ${step}: Complete — ${q.trim()}` });
      step += 1;
    });
  } else {
    blocks.push({ type: "step", text: "Step 1: Read the material." });
    blocks.push({ type: "step", text: "Step 2: Write the main ideas in your own words." });
    blocks.push({ type: "step", text: "Step 3: Check your answers against the source." });
  }

  blocks.push({
    type: "note",
    text: "This lesson uses the same three sections every time.",
  });

  return blocks.slice(0, 16);
}

export function transformLocally(
  input: string,
  mode: AccessibilityMode,
): TransformResult {
  const config = MODES.find((m) => m.id === mode)!;
  const trimmed = input.trim();

  if (!trimmed) {
    return {
      blocks: [
        {
          type: "note",
          text: "Paste content to see an adapted version.",
        },
      ],
      modeLabel: config.label,
      modeDescription: config.description,
    };
  }

  let blocks: ContentBlock[];
  switch (mode) {
    case "dyslexia":
      blocks = transformDyslexia(trimmed);
      break;
    case "adhd":
      blocks = transformAdhd(trimmed);
      break;
    case "apd":
      blocks = transformApd(trimmed);
      break;
    case "autism":
      blocks = transformAutism(trimmed);
      break;
  }

  return {
    blocks,
    modeLabel: config.label,
    modeDescription: config.description,
  };
}
