import type { TransformResult } from "./types";
import type { ContentBlock } from "./types";

function stripMarkdownBold(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1");
}

/** Plain-text version of adapted output (e.g. copy). */
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
  return `adapted-${modeSlug}-${date}.pdf`;
}

const PDF_MARGIN = 20;
const LINE_HEIGHT = 6;

function blockFontSize(block: ContentBlock): number {
  switch (block.type) {
    case "title":
      return 14;
    case "caption":
      return 9;
    case "key":
      return 11;
    default:
      return 11;
  }
}

function blockSpacingAfter(block: ContentBlock): number {
  switch (block.type) {
    case "title":
    case "caption":
      return 8;
    case "chunk":
      return 5;
    default:
      return 4;
  }
}

export async function downloadTransformResult(
  result: TransformResult,
  modeSlug: string,
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxWidth = pageWidth - PDF_MARGIN * 2;
  let y = PDF_MARGIN;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - PDF_MARGIN) {
      doc.addPage();
      y = PDF_MARGIN;
    }
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(30, 40, 60);
  const titleLines = doc.splitTextToSize(result.modeLabel, maxWidth);
  ensureSpace(titleLines.length * LINE_HEIGHT + 4);
  doc.text(titleLines, PDF_MARGIN, y);
  y += titleLines.length * LINE_HEIGHT + 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(80, 90, 110);
  const descLines = doc.splitTextToSize(result.modeDescription, maxWidth);
  ensureSpace(descLines.length * LINE_HEIGHT + 6);
  doc.text(descLines, PDF_MARGIN, y);
  y += descLines.length * LINE_HEIGHT + 6;

  doc.setDrawColor(180, 190, 210);
  ensureSpace(4);
  doc.line(PDF_MARGIN, y, pageWidth - PDF_MARGIN, y);
  y += 8;

  doc.setTextColor(30, 40, 60);

  for (const block of result.blocks) {
    const text = stripMarkdownBold(block.text);
    const fontSize = blockFontSize(block);
    const isBold =
      block.type === "title" ||
      block.type === "key" ||
      (block.type === "caption" && block.text.startsWith("SECTION"));

    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    const blockHeight = lines.length * LINE_HEIGHT + blockSpacingAfter(block);
    ensureSpace(blockHeight);
    doc.text(lines, PDF_MARGIN, y);
    y += blockHeight;
  }

  doc.save(buildDownloadFilename(modeSlug));
}
