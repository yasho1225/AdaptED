import { studentText } from "@/lib/adapt/fidelity";
import type { AdaptedAssignment } from "@/lib/adapt/types";

function shingles(text: string, n = 3): Set<string> {
  const w = text.toLowerCase().replace(/\*\*/g, "").match(/[a-z0-9']+/g) ?? [];
  const out = new Set<string>();
  for (let i = 0; i + n <= w.length; i++) out.add(w.slice(i, i + n).join(" "));
  return out;
}

function jaccard<T>(a: Set<T>, b: Set<T>): number {
  const inter = [...a].filter((x) => b.has(x)).length;
  const union = new Set([...a, ...b]).size;
  return union ? inter / union : 1;
}

/** Structural fingerprint: ordered section headings + block types + support kinds. */
function structure(a: AdaptedAssignment): Set<string> {
  const s = new Set<string>();
  a.sections.forEach((sec, i) => {
    s.add(`h:${sec.heading.toLowerCase().replace(/\d+/g, "#")}`);
    sec.blocks.forEach((b) => {
      s.add(`t:${b.type}`);
      if (b.supports) Object.keys(b.supports).forEach((k) => s.add(`s:${k}`));
      if (b.icon) s.add("icon");
      if (b.minutes || sec.minutes) s.add("timed");
    });
    if (i === 0) s.add(`first:${sec.heading.toLowerCase()}`);
  });
  return s;
}

export function similarity(a: AdaptedAssignment, b: AdaptedAssignment) {
  return { text: jaccard(shingles(studentText(a)), shingles(studentText(b))), structure: jaccard(structure(a), structure(b)) };
}
