import { describe, expect, it } from "vitest";
import { CURATED } from "@/lib/adapt/curated";
import { checkFidelity, studentText } from "@/lib/adapt/fidelity";
import { parseAdaptedAssignment } from "@/lib/adapt/schema";
import { RESEARCH } from "@/lib/adapt/research";
import { SAMPLES } from "@/lib/adapt/samples";
import { NEED_IDS } from "@/lib/adapt/types";
import { similarity } from "./distinctness";

/** Answers that must never appear in student-facing text. */
const LEAKS: Record<string, RegExp[]> = {
  science: [/inputs are (sunlight|carbon dioxide|water)/i, /answer is c\b/i],
  math: [/\b16 cups\b/i, /11:15/, /\$?253(\.00)?\b/, /\b1 1\/2 hours (on the bus|in total)/i, /jamal is not correct/i, /\b(16|18)\b.*\bbigger\b/],
  ela: [/1776/, /87 years/i, /declaration of independence/i],
};

describe.each(SAMPLES)("curated outputs — $id", (sample) => {
  it.each(NEED_IDS)("%s: schema round-trip, fidelity, evidence, verbatim barriers, no leaks", (need) => {
    const a = CURATED[sample.id][need];
    const parsed = parseAdaptedAssignment(JSON.parse(JSON.stringify(a)));
    expect(parsed).not.toBeNull();
    expect(parsed!.sections.length).toBe(a.sections.length);

    const f = checkFidelity(sample.text, a);
    expect(f.missing, "missing questions").toEqual([]);
    expect(f.choicesPreserved).toBe(true);
    expect(f.altered, "questions whose content drifted").toEqual([]);

    a.changes.forEach((c) => expect(RESEARCH[c.evidence], c.evidence).toBeDefined());
    expect(a.changes.length).toBeGreaterThanOrEqual(4);
    a.barriers.forEach((b) => expect(sample.text.includes(b.quote), `barrier not verbatim: ${b.quote}`).toBe(true));

    const text = studentText(a);
    LEAKS[sample.id].forEach((re) => expect(text, `answer leak ${re}`).not.toMatch(re));
  });

  it("the four needs produce clearly different assignments", () => {
    for (let i = 0; i < NEED_IDS.length; i++) {
      for (let j = i + 1; j < NEED_IDS.length; j++) {
        const sim = similarity(CURATED[sample.id][NEED_IDS[i]], CURATED[sample.id][NEED_IDS[j]]);
        expect(sim.structure, `${NEED_IDS[i]} vs ${NEED_IDS[j]} structure`).toBeLessThan(0.75);
      }
    }
  });
});
