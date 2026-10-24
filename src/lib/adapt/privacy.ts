/**
 * Strip common personal identifiers before text leaves the server for the
 * model provider. Teachers should never need to include student details.
 */
const PATTERNS: [RegExp, string][] = [
  [/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email removed]"],
  [/(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b/g, "[phone removed]"],
  [/\b\d{3}-\d{2}-\d{4}\b/g, "[id removed]"],
  [/^(\s*(?:student\s*)?name\s*[:：]\s*)(?!_)(\S.*)$/gim, "$1________"],
  [/^(\s*(?:student\s*)?id\s*(?:#|number)?\s*[:：]\s*)(\S.*)$/gim, "$1________"],
];

export function redactPersonalInfo(text: string): { text: string; redacted: boolean } {
  let out = text;
  for (const [re, rep] of PATTERNS) out = out.replace(re, rep);
  return { text: out, redacted: out !== text };
}
