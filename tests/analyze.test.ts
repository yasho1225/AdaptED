import { describe, expect, it } from "vitest";
import { computeMetrics, detectBarriers, parseAssignment, syllabify } from "@/lib/adapt/analyze";
import { redactPersonalInfo } from "@/lib/adapt/privacy";
import { sanitizeProfile } from "@/lib/adapt/profile";

describe("parseAssignment", () => {
  it("separates multiple-choice options from lettered sub-questions", () => {
    const mc = parseAssignment("1. Which is a mammal?\nA. Shark\nB. Whale\nC. Trout\n2. Why?");
    expect(mc.questions.map((q) => q.label)).toEqual(["1", "2"]);
    expect(mc.questions[0].choices).toHaveLength(3);
    const subs = parseAssignment("3. Answer both parts.\na) Define erosion in your own words using an example from the reading.\nb) Describe two ways people slow erosion near rivers and coasts today.");
    expect(subs.questions.map((q) => q.label)).toEqual(["3", "3a", "3b"]);
  });
  it("numbers unnumbered question lines", () => {
    expect(parseAssignment("Read the text.\n\nWhy did the empire fall apart so quickly?").questions[0].label).toBe("1");
  });
});

describe("analysis helpers", () => {
  it("syllabifies common academic words sensibly", () => {
    expect(syllabify("photosynthesis")).toBe("pho·to·syn·the·sis");
    expect(syllabify("chlorophyll")).toBe("chlo·ro·phyll");
    expect(syllabify("consecrate")).toBe("con·se·crate");
  });
  it("detects spoken-only and figurative barriers", () => {
    const b = detectBarriers("As we discussed in class, think outside the box. Briefly explain your answer.");
    expect(b.some((x) => x.needs.includes("apd"))).toBe(true);
    expect(b.some((x) => /saying/i.test(x.issue))).toBe(true);
  });
  it("computes plausible readability", () => {
    const m = computeMetrics("The cat sat. The dog ran.");
    expect(m.sentences).toBe(2);
    expect(m.gradeLevel).toBeLessThan(3);
  });
});

describe("privacy + input hygiene", () => {
  it("redacts contact details and names on name lines", () => {
    const r = redactPersonalInfo("Name: Jordan Lee\nEmail jordan@school.org or 555-123-4567");
    expect(r.text).not.toMatch(/Jordan|jordan@|555-123/);
    expect(r.redacted).toBe(true);
  });
  it("rejects invalid profiles", () => {
    expect(sanitizeProfile({ needs: ["nope"] })).toBeNull();
    expect(sanitizeProfile({ needs: ["adhd"], supports: ["bogus", "checklist"], language: "klingon" })).toMatchObject({ supports: ["checklist"], language: "english" });
  });
});

describe("worksheet header fields", () => {
  it("ignores Name/Date lines when finding the title", () => {
    expect(parseAssignment("Name: ________\nDate: ____\nThe Water Cycle\n\n1. What is evaporation?").title).toBe("The Water Cycle");
  });
});
