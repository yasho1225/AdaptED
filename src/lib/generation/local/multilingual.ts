import type { ContentBlock } from "@/lib/types";
import type { MultilingualInput } from "@/lib/generation/types";
import { transformLocally } from "@/lib/local-transform";

const LANGUAGE_NOTE: Record<MultilingualInput["targetLanguage"], string> = {
  spanish: "Spanish accessibility version",
  hindi: "Hindi accessibility version",
  french: "French accessibility version",
  "simplified-english": "Simplified English version",
};

const DEMO_TITLE: Record<MultilingualInput["targetLanguage"], string> = {
  spanish: "Versión accesible en español",
  hindi: "सुलभ हिंदी संस्करण",
  french: "Version accessible en français",
  "simplified-english": "Simplified English version",
};

export function generateMultilingualLocal(input: MultilingualInput): ContentBlock[] {
  const blocks = transformLocally(input.content.trim(), input.mode).blocks;
  return [
    {
      type: "title",
      text: DEMO_TITLE[input.targetLanguage],
    },
    {
      type: "caption",
      text: `LANGUAGE: ${LANGUAGE_NOTE[input.targetLanguage].toUpperCase()}`,
    },
    {
      type: "note",
      text: "Demo preview — add GEMINI_API_KEY for full AI translation in this language.",
    },
    ...blocks,
  ];
}
