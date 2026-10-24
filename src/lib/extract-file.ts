"use client";

const MAX_BYTES = 10 * 1024 * 1024;

/**
 * Extract text from a teacher's file entirely in the browser — the file itself
 * never leaves the device; only the text is sent when the teacher clicks Adapt.
 */
export async function extractFileText(file: File): Promise<string> {
  if (file.size > MAX_BYTES) throw new Error("That file is larger than 10 MB. Try exporting just the assignment pages.");
  const name = file.name.toLowerCase();

  if (file.type === "application/pdf" || name.endsWith(".pdf")) {
    const { extractText, getDocumentProxy } = await import("unpdf");
    const pdf = await getDocumentProxy(new Uint8Array(await file.arrayBuffer()));
    const { text } = await extractText(pdf, { mergePages: false });
    const pages = (Array.isArray(text) ? text : [text]).map((t) => tidy(t));
    const joined = pages.join("\n\n").trim();
    if (joined.length < 20) throw new Error("This PDF looks like a scanned image, so there's no text to read. Try copying the text, or use a PDF with selectable text.");
    return joined;
  }

  if (name.endsWith(".docx") || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const mammoth = (await import("mammoth/mammoth.browser.js")) as unknown as {
      extractRawText: (o: { arrayBuffer: ArrayBuffer }) => Promise<{ value: string }>;
    };
    const { value } = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    return tidy(value);
  }

  if (file.type.startsWith("text/") || /\.(txt|md|rtf)$/.test(name)) {
    return tidy(await file.text());
  }

  throw new Error("AdaptED can read PDF, Word (.docx), and text files.");
}

/** Normalize whitespace from PDF/Word extraction while keeping paragraph and list breaks. */
function tidy(text: string): string {
  return text
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t ]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
