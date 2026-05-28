import type { TransformResult } from "./types";

function stripMarkdownBold(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1");
}

/** Plain-text version of adapted output for download or copy. */
export function transformResultToPlainText(result: TransformResult): string {
  const lines: string[] = [
    result.modeLabel,
    result.modeDescription,
    "—".repeat(40),
    "",
  ];

  for (const block of result.blocks) {
    const text = stripMarkdownBold(block.text);
    switch (block.type) {
      case "title":
      case "caption":
        lines.push(text, "");
        break;
      default:
        lines.push(text);
        break;
    }
  }

  return `${lines.join("\n").trimEnd()}\n`;
}

export function buildDownloadFilename(modeSlug: string): string {
  const date = new Date().toISOString().slice(0, 10);
  return `adapted-${modeSlug}-${date}.txt`;
}

export function downloadTransformResult(
  result: TransformResult,
  modeSlug: string,
): void {
  const blob = new Blob([transformResultToPlainText(result)], {
    type: "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = buildDownloadFilename(modeSlug);
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
