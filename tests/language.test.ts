import { describe, expect, it, vi } from "vitest";
import { SCIENCE } from "@/lib/adapt/curated/science";
import { checkFidelity } from "@/lib/adapt/fidelity";
import { defaultProfile, languageAttrs, sanitizeProfile, writtenIn } from "@/lib/adapt/profile";
import { buildUserPrompt } from "@/lib/adapt/prompt";
import { SAMPLES } from "@/lib/adapt/samples";

vi.mock("@/lib/adapt/gemini", () => ({ hasGeminiKey: () => false, generateJson: vi.fn(), GeminiError: class extends Error {} }));

const science = SAMPLES[0].text;

describe("languages", () => {
  it("accepts Simpler English and rejects unknown languages", () => {
    expect(sanitizeProfile({ ...defaultProfile("dyslexia"), language: "simple-english" })?.language).toBe("simple-english");
    expect(sanitizeProfile({ ...defaultProfile("dyslexia"), language: "klingon" })?.language).toBe("english");
  });

  it("asks the model for simple English or a full translation, keeping teacher fields in English", () => {
    const simple = buildUserPrompt(science, { ...defaultProfile("adhd"), language: "simple-english" });
    expect(simple).toMatch(/simple English for English language learners/);
    const es = buildUserPrompt(science, { ...defaultProfile("adhd"), language: "spanish" });
    expect(es).toMatch(/in Spanish/);
    expect(es).toMatch(/teacher-facing fields .* in English/);
  });

  it("keeps the English-only wording checks for Simpler English", () => {
    const report = checkFidelity(science, SCIENCE.dyslexia, "simple-english");
    expect(report.vocabularyDropped).toEqual([]);
    expect(report.vocabularyKept.length).toBeGreaterThan(0);
  });

  it("only AI output counts as translated, and Arabic reads right to left", () => {
    expect(writtenIn({ source: "offline", profile: { language: "spanish" } })).toBe("english");
    expect(writtenIn({ source: "ai", profile: { language: "spanish" } })).toBe("spanish");
    expect(languageAttrs("arabic")).toEqual({ lang: "ar", dir: "rtl" });
    expect(languageAttrs("hindi")).toEqual({ lang: "hi", dir: "ltr" });
  });

  it("says plainly when translation could not happen", async () => {
    const { adaptAssignment } = await import("@/lib/adapt/service");
    const r = await adaptAssignment(science, { ...defaultProfile("autism"), language: "french" });
    expect(r.source).toBe("offline");
    expect(r.notices.join(" ")).toMatch(/Translation needs the AI engine/);
    const s = await adaptAssignment(science, { ...defaultProfile("autism"), language: "simple-english" });
    expect(s.notices.join(" ")).toMatch(/Simpler English needs the AI engine/);
  });
});
