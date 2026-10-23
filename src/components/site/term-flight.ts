import gsap from "gsap";

/**
 * "The key words stay": a shared-element transition for plain DOM text.
 * Before a worksheet version is swapped, the on-screen position of each key term is recorded.
 * After the new version renders, the same terms are found in it, and a highlighted copy of each
 * flies from its old spot to its new one while the rest of the page fades in around it.
 */

export interface TermSnapshot {
  rect: DOMRect;
  text: string;
  font: string;
  color: string;
  letterSpacing: string;
}

/** The science vocabulary of the hero worksheet: the words every version must keep. */
export const KEY_TERMS = ["photosynthesis", "ecosystem", "light energy", "glucose", "chloroplasts", "chlorophyll", "food chain", "oxygen"];

const termId = (t: string) => t.toLowerCase().replace(/\s+/g, "-");

/**
 * Wraps the first occurrence of each key term in a span[data-flip-id], skipping the title line.
 * Splits text nodes in place (the node React rendered keeps its prefix), so it is safe on static content.
 */
export function tagTerms(root: HTMLElement, title: string): HTMLElement[] {
  const existing = root.querySelectorAll<HTMLElement>("[data-flip-id]");
  if (existing.length) return [...existing];
  const found: HTMLElement[] = [];
  for (const term of KEY_TERMS) {
    const re = new RegExp(`\\b${term.replace(/\s+/g, "\\s+")}\\b`, "i");
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.parentElement?.closest("[data-flip-id], .sr-only, sup") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
    });
    for (let node = walker.nextNode() as Text | null; node; node = walker.nextNode() as Text | null) {
      const t = node.data.indexOf(title);
      const from = t === -1 ? 0 : t + title.length;
      const m = re.exec(node.data.slice(from));
      if (!m) continue;
      const mid = node.splitText(from + m.index);
      mid.splitText(m[0].length);
      const span = document.createElement("span");
      span.dataset.flipId = termId(term);
      span.className = "flip-term";
      mid.replaceWith(span);
      span.appendChild(mid);
      found.push(span);
      break;
    }
  }
  return found;
}

export function captureTerms(root: HTMLElement): Map<string, TermSnapshot> {
  const map = new Map<string, TermSnapshot>();
  root.querySelectorAll<HTMLElement>("[data-flip-id]").forEach((el) => {
    const cs = getComputedStyle(el);
    map.set(el.dataset.flipId!, {
      rect: el.getBoundingClientRect(),
      text: el.textContent ?? "",
      font: `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} / ${cs.lineHeight} ${cs.fontFamily}`,
      color: cs.color,
      letterSpacing: cs.letterSpacing,
    });
  });
  return map;
}

/**
 * Flies a highlighted copy of every term that exists in both versions.
 * Returns a cleanup that stops the flight and restores the real words.
 */
export function flyTerms(stage: HTMLElement, overlay: HTMLElement, terms: HTMLElement[], before: Map<string, TermSnapshot>) {
  const box = stage.getBoundingClientRect();
  const tl = gsap.timeline();
  let i = 0;
  for (const el of terms) {
    const from = before.get(el.dataset.flipId!);
    if (!from) continue;
    const to = el.getBoundingClientRect();
    // Skip pairs that start and end outside the visible sheet: nothing to watch.
    const visible = (r: DOMRect) => r.bottom > box.top && r.top < box.bottom;
    if (!visible(from.rect) && !visible(to)) continue;

    const clone = document.createElement("span");
    clone.className = "flip-clone";
    clone.textContent = from.text;
    Object.assign(clone.style, {
      left: `${from.rect.left - box.left}px`,
      top: `${from.rect.top - box.top}px`,
      font: from.font,
      color: from.color,
      letterSpacing: from.letterSpacing,
    });
    overlay.appendChild(clone);
    const scale = clone.offsetWidth ? to.width / clone.offsetWidth : 1;
    el.style.visibility = "hidden";

    const at = i++ * 0.06;
    tl.to(clone, { "--hl": 1, duration: 0.22, ease: "power1.out" }, at)
      .to(clone, { x: to.left - from.rect.left, y: to.top - from.rect.top, scale, duration: 0.95, ease: "power3.inOut" }, at + 0.08)
      .to(clone, { "--hl": 0, duration: 0.4, ease: "power1.in" }, at + 0.85)
      .add(() => {
        el.style.visibility = "";
        clone.remove();
      }, at + 1.1);
  }
  return () => {
    tl.kill();
    overlay.replaceChildren();
    terms.forEach((el) => (el.style.visibility = ""));
  };
}
