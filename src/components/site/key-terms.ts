/**
 * "The key words stay": after the hero switches worksheet versions, the science vocabulary every
 * version keeps glows in place for a moment, wherever it now sits.
 */

/** The science vocabulary of the hero worksheet: the words every version must keep. */
export const KEY_TERMS = ["photosynthesis", "ecosystem", "light energy", "glucose", "chloroplasts", "chlorophyll", "food chain", "oxygen"];

/**
 * Wraps the first occurrence of each key term in a span.key-term, skipping the title line, and
 * returns the spans in reading order. Splits text nodes in place (the node React rendered keeps its
 * prefix), so it is only used on a version that was just mounted and is never re-rendered.
 */
export function tagTerms(root: HTMLElement, title: string): HTMLElement[] {
  const found: HTMLElement[] = [];
  for (const term of KEY_TERMS) {
    const re = new RegExp(`\\b${term.replace(/\s+/g, "\\s+")}\\b`, "i");
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.parentElement?.closest(".key-term, .sr-only, sup") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
    });
    for (let node = walker.nextNode() as Text | null; node; node = walker.nextNode() as Text | null) {
      const t = node.data.indexOf(title);
      const from = t === -1 ? 0 : t + title.length;
      const m = re.exec(node.data.slice(from));
      if (!m) continue;
      const mid = node.splitText(from + m.index);
      mid.splitText(m[0].length);
      const span = document.createElement("span");
      span.className = "key-term";
      mid.replaceWith(span);
      span.appendChild(mid);
      found.push(span);
      break;
    }
  }
  // Reading order, so the glow passes through the page top to bottom.
  return found.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
}
