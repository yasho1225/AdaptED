import { describe, expect, it } from "vitest";
import { adaptOffline, shortenSentence } from "@/lib/adapt/offline-engine";
import { checkFidelity, studentText } from "@/lib/adapt/fidelity";
import { defaultProfile, supportsForNeeds } from "@/lib/adapt/profile";
import { RESEARCH } from "@/lib/adapt/research";
import { SAMPLES } from "@/lib/adapt/samples";
import { NEED_IDS, type LearnerProfile } from "@/lib/adapt/types";
import { similarity } from "./distinctness";

describe.each(SAMPLES)("offline engine — $id", (sample) => {
  it.each(NEED_IDS)("%s keeps every question and cites real evidence", (need) => {
    const a = adaptOffline(sample.text, defaultProfile(need));
    const f = checkFidelity(sample.text, a);
    expect(f.missing).toEqual([]);
    expect(f.choicesPreserved).toBe(true);
    expect(f.vocabularyDropped).toEqual([]);
    a.changes.forEach((c) => expect(RESEARCH[c.evidence]).toBeDefined());
    a.barriers.forEach((b) => expect(sample.text.includes(b.quote)).toBe(true));
  });

  it("produces structurally distinct outputs per need", () => {
    const outs = NEED_IDS.map((n) => adaptOffline(sample.text, defaultProfile(n)));
    for (let i = 0; i < outs.length; i++)
      for (let j = i + 1; j < outs.length; j++) expect(similarity(outs[i], outs[j]).structure).toBeLessThan(0.8);
  });

  it("handles combined needs (dyslexia + ADHD) in one coherent assignment", () => {
    const profile: LearnerProfile = { needs: ["dyslexia", "adhd"], supports: supportsForNeeds(["dyslexia", "adhd"]), expectations: "accommodate", language: "english" };
    const a = adaptOffline(sample.text, profile);
    expect(checkFidelity(sample.text, a).missing).toEqual([]);
    const headings = a.sections.map((s) => s.heading);
    expect(headings[0]).toBe("Start here");
    expect(studentText(a)).toContain("**");
  });
});

describe("text protection", () => {
  it("keeps the primary source verbatim", () => {
    const ela = SAMPLES.find((s) => s.id === "ela")!;
    for (const need of NEED_IDS) {
      const text = studentText(adaptOffline(ela.text, defaultProfile(need))).replace(/\*\*/g, "");
      expect(text).toContain("we can not dedicate—we can not consecrate—we can not hallow—this ground");
      expect(text).toContain("government of the people, by the people, for the people, shall not perish from the earth");
    }
  });

  it("never splits a list", () => {
    expect(shortenSentence("Photosynthesis is the process plants, algae, and some bacteria use to convert light energy into chemical energy stored in glucose.")).toHaveLength(1);
  });
});
