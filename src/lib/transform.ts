import type {
  AccessibilityMode,
  ContentBlock,
  TransformResult,
} from "./types";
import { MODES } from "./constants";

const SIMPLIFY: Record<string, string> = {
  photosynthesis: "how plants make food from light",
  chlorophyll: "green stuff in leaves",
  glucose: "plant sugar",
  precipitation: "rain or snow",
  condensation: "water turning into clouds",
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

function shortenSentence(sentence: string): string {
  const words = sentence.split(/\s+/);
  if (words.length <= 12) return sentence;
  const mid = Math.ceil(words.length / 2);
  return `${words.slice(0, mid).join(" ")}. ${words.slice(mid).join(" ")}`;
}

function transformDyslexia(input: string): ContentBlock[] {
  const blocks: ContentBlock[] = [
    { type: "title", text: "Easy-Read Version" },
    { type: "note", text: "Key ideas are highlighted. Short chunks below." },
  ];

  const paragraphs = splitParagraphs(input);
  paragraphs.forEach((para, i) => {
    if (/^\d+\./.test(para) || /^[A-Z].*:$/.test(para.split("\n")[0] ?? "")) {
      blocks.push({ type: "key", text: para.replace(/\n/g, " · ") });
      return;
    }

    const sentences = splitSentences(para);
    sentences.forEach((s) => {
      const simplified = s
        .split(/\s+/)
        .map((w) => simplifyWord(w))
        .join(" ");
      const short = shortenSentence(simplified);
      short.split(/(?<=[.!?])\s+/).forEach((chunk) => {
        if (chunk.length > 8) {
          blocks.push({ type: "chunk", text: chunk });
        }
      });
    });

    if (i < paragraphs.length - 1) {
      blocks.push({ type: "chunk", text: "—" });
    }
  });

  return blocks;
}

function transformAutism(input: string): ContentBlock[] {
  const blocks: ContentBlock[] = [
    { type: "title", text: "Structured Lesson Plan" },
    { type: "note", text: "Follow each step in order. Same layout every time." },
  ];

  const paragraphs = splitParagraphs(input);
  let step = 1;

  paragraphs.forEach((para) => {
    const lines = para.split("\n").filter(Boolean);
    if (lines.length === 1 && lines[0].length < 80 && !lines[0].includes(".")) {
      blocks.push({ type: "key", text: lines[0] });
      return;
    }

    lines.forEach((line) => {
      if (/^\d+\./.test(line)) {
        blocks.push({ type: "step", text: line });
      } else {
        const sentences = splitSentences(line);
        sentences.forEach((s) => {
          blocks.push({
            type: "step",
            text: `Step ${step}: ${s}`,
          });
          step += 1;
        });
      }
    });

    const bullets = para.match(/\d+\.\s*[^?\n]+/g);
    if (bullets) {
      bullets.forEach((b) => blocks.push({ type: "bullet", text: b.trim() }));
    }
  });

  if (blocks.length <= 2) {
    splitSentences(input).forEach((s, i) => {
      blocks.push({ type: "step", text: `Step ${i + 1}: ${s}` });
    });
  }

  blocks.push({
    type: "note",
    text: "✓ Check off each step when finished. Take breaks between sections.",
  });

  return blocks;
}

function transformVisual(input: string): ContentBlock[] {
  const blocks: ContentBlock[] = [
    { type: "title", text: "Audio-Description Style Notes" },
    {
      type: "describe",
      text: "Visual elements in the original material are described below in plain language.",
    },
  ];

  const visualKeywords =
    /diagram|chart|image|figure|look at|see|color|arrow|draw|picture|illustrat/i;
  const paragraphs = splitParagraphs(input);

  paragraphs.forEach((para) => {
    if (visualKeywords.test(para)) {
      blocks.push({
        type: "describe",
        text: `[VISUAL DESCRIPTION] ${para.replace(
          /look at the diagram/gi,
          "Imagine a labeled diagram"
        )}. Picture arrows showing direction of flow, with clear labels for each part.`,
      });
    } else {
      splitSentences(para).forEach((s) => {
        blocks.push({ type: "chunk", text: s });
      });
    }
  });

  blocks.push({
    type: "key",
    text: "Summary: All information is available without needing to see images. Ask for tactile or enlarged print versions if needed.",
  });

  return blocks;
}

function transformHearing(input: string): ContentBlock[] {
  const blocks: ContentBlock[] = [
    { type: "title", text: "Visual Notes (Caption Style)" },
    { type: "caption", text: "[LESSON START]" },
  ];

  const paragraphs = splitParagraphs(input);
  let section = 1;

  paragraphs.forEach((para) => {
    blocks.push({
      type: "caption",
      text: `[SECTION ${section}]`,
    });
    section += 1;

    splitSentences(para).forEach((s) => {
      const keyMatch = s.match(
        /(important|because|means|is the|process|result)/i
      );
      if (keyMatch) {
        blocks.push({ type: "key", text: `★ ${s}` });
      } else {
        blocks.push({ type: "bullet", text: `• ${s}` });
      }
    });
  });

  blocks.push({ type: "caption", text: "[KEY TAKEAWAYS]" });
  blocks.push({
    type: "key",
    text: "Main idea: " + splitSentences(input)[0],
  });
  blocks.push({
    type: "note",
    text: "Designed for students who benefit from written, visual-first notes instead of spoken instruction.",
  });
  blocks.push({ type: "caption", text: "[LESSON END]" });

  return blocks;
}

export function transformContent(
  input: string,
  mode: AccessibilityMode
): TransformResult {
  const trimmed = input.trim();
  const config = MODES.find((m) => m.id === mode)!;

  if (!trimmed) {
    return {
      blocks: [
        {
          type: "note",
          text: "Paste your assignment or click “Load example” to see an adapted version.",
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
