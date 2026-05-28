import type { BlockType, ContentBlock } from "@/lib/types";

const VALID_TYPES = new Set<BlockType>([
  "title",
  "chunk",
  "key",
  "step",
  "bullet",
  "caption",
  "describe",
  "note",
]);

function sanitizeBlock(raw: unknown): ContentBlock | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  const type = obj.type;
  const text = obj.text;
  if (typeof type !== "string" || typeof text !== "string") return null;
  if (!VALID_TYPES.has(type as BlockType)) return null;
  const trimmed = text.trim();
  if (!trimmed) return null;
  return { type: type as BlockType, text: trimmed.slice(0, 2000) };
}

export function parseGeminiJson(raw: string): ContentBlock[] {
  let parsed: unknown;
  try {
    const cleaned = raw
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
    parsed = JSON.parse(cleaned);
  } catch {
    return [{ type: "chunk", text: raw.trim().slice(0, 1500) }];
  }

  const blocksRaw =
    parsed &&
    typeof parsed === "object" &&
    "blocks" in parsed &&
    Array.isArray((parsed as { blocks: unknown }).blocks)
      ? (parsed as { blocks: unknown[] }).blocks
      : null;

  if (!blocksRaw) {
    return [{ type: "chunk", text: "Transformation completed but formatting was unclear." }];
  }

  const blocks = blocksRaw
    .map(sanitizeBlock)
    .filter((b): b is ContentBlock => b !== null);

  if (blocks.length === 0) {
    return [{ type: "chunk", text: "No content blocks returned." }];
  }

  return blocks;
}
