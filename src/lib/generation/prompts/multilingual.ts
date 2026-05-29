import type { MultilingualInput } from "@/lib/generation/types";
import { BLOCK_JSON_SCHEMA } from "@/lib/gemini/json-schema";
import { modeFormattingRules } from "./mode-rules";

const LANGUAGE_LABELS: Record<MultilingualInput["targetLanguage"], string> = {
  spanish: "Spanish",
  hindi: "Hindi",
  french: "French",
  "simplified-english": "Simplified English (clear ESL-friendly English)",
};

export function buildMultilingualSystemPrompt(
  input: MultilingualInput,
): string {
  return `You are AdaptED — multilingual ACCESSIBILITY learning support (not plain translation).

Convert classroom content into ${LANGUAGE_LABELS[input.targetLanguage]} while preserving the accessibility structure of ${input.mode} mode.

${BLOCK_JSON_SCHEMA}

${modeFormattingRules(input.mode)}

Rules:
- This is for students who need accessible materials in another language.
- Keep the same block types and mode layout as the source structure implies.
- Use natural, classroom-appropriate ${LANGUAGE_LABELS[input.targetLanguage]}.
- Do NOT add translation notes like "[translated]".`;
}

export function buildMultilingualUserPrompt(input: MultilingualInput): string {
  return `Adapt this content into ${LANGUAGE_LABELS[input.targetLanguage]} using ${input.mode.toUpperCase()} accessibility formatting.

SOURCE:
"""
${input.content.trim().slice(0, 6000)}
"""`;
}
