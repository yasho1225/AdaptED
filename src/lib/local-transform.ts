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
  precipitation: "rain or snow",
  condensation: "water forming clouds",
  evaporation: "water turning into vapor",
  atmosphere: "the air around Earth",
  approximately: "about",
  demonstrate: "show",
  utilize: "use",
  furthermore: "also",
  therefore: "so",
  however: "but",
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

function transformDyslexia(input: string): ContentBlock[] {
  const blocks: ContentBlock[] = [
    { type: "title", text: "Easy-Read Version" },
    { type: "note", text: "Short sections. **Bold** marks big ideas." },
  ];

  splitParagraphs(input).forEach((para) => {
    if (/^\d+\./.test(para)) {
      blocks.push({ type: "key", text: para.replace(/\n/g, " · ") });
      return;
    }
    splitSentences(para).forEach((s) => {
      const simple = s
        .split(/\s+/)
        .map(simplifyWord)
        .join(" ");
      const words = simple.split(/\s+/);
      if (words.length > 14) {
        const mid = Math.ceil(words.length / 2);
        blocks.push({
          type: "chunk",
          text: words.slice(0, mid).join(" ") + ".",
        });
        blocks.push({
          type: "chunk",
          text: words.slice(mid).join(" ") + ".",
        });
      } else {
        blocks.push({ type: "chunk", text: simple });
      }
    });
  });

  return blocks.slice(0, 14);
}

function transformAutism(input: string): ContentBlock[] {
  const blocks: ContentBlock[] = [
    { type: "title", text: "Structured Lesson" },
    { type: "key", text: "What you will do: follow each step in order." },
  ];

  let step = 1;
  splitParagraphs(input).forEach((para) => {
    const questions = para.match(/\d+\.\s*[^\n]+/g);
    if (questions) {
      questions.forEach((q) => blocks.push({ type: "bullet", text: q.trim() }));
      return;
    }
    splitSentences(para).forEach((s) => {
      blocks.push({ type: "step", text: `Step ${step}: ${s}` });
      step += 1;
    });
  });

  blocks.push({
    type: "note",
    text: "✓ Finish one step before the next. Take a short break between sections.",
  });

  return blocks.slice(0, 14);
}

function transformVisual(input: string): ContentBlock[] {
  const blocks: ContentBlock[] = [
    { type: "title", text: "Audio-Description Notes" },
    {
      type: "describe",
      text: "[SCENE] You are learning from spoken-style notes—no picture required.",
    },
  ];

  const visual = /diagram|chart|image|figure|look at|arrow|draw|picture/i;

  splitParagraphs(input).forEach((para) => {
    if (visual.test(para)) {
      blocks.push({
        type: "describe",
        text: `[VISUAL] ${para}. Imagine labels on each part and arrows showing flow from start to end.`,
      });
    } else {
      splitSentences(para).forEach((s) => blocks.push({ type: "chunk", text: s }));
    }
  });

  blocks.push({
    type: "key",
    text: "Summary: All ideas are explained in words—you do not need to see the page layout.",
  });

  return blocks.slice(0, 14);
}

function transformHearing(input: string): ContentBlock[] {
  const blocks: ContentBlock[] = [
    { type: "title", text: "Visual Lecture Notes" },
    { type: "caption", text: "[LESSON START]" },
  ];

  let section = 1;
  splitParagraphs(input).forEach((para) => {
    blocks.push({ type: "caption", text: `[SECTION ${section}]` });
    section += 1;
    splitSentences(para).forEach((s) => {
      if (/important|because|process|means/i.test(s)) {
        blocks.push({ type: "key", text: `★ ${s}` });
      } else {
        blocks.push({ type: "bullet", text: `• ${s}` });
      }
    });
  });

  blocks.push({ type: "caption", text: "[KEY TAKEAWAYS]" });
  blocks.push({
    type: "key",
    text: `★ ${splitSentences(input)[0] ?? "Main idea from the lesson."}`,
  });
  blocks.push({ type: "caption", text: "[LESSON END]" });

  return blocks.slice(0, 14);
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
    case "autism":
      blocks = transformAutism(trimmed);
      break;
    case "visual":
      blocks = transformVisual(trimmed);
      break;
    case "hearing":
      blocks = transformHearing(trimmed);
      break;
  }

  return {
    blocks,
    modeLabel: config.label,
    modeDescription: config.description,
  };
}
