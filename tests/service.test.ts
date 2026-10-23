import { beforeEach, describe, expect, it, vi } from "vitest";
import { SCIENCE } from "@/lib/adapt/curated/science";
import { SAMPLES } from "@/lib/adapt/samples";
import { defaultProfile } from "@/lib/adapt/profile";
import type { AdaptedAssignment } from "@/lib/adapt/types";

const generateJson = vi.fn();
vi.mock("@/lib/adapt/gemini", () => ({
  hasGeminiKey: () => true,
  generateJson: (...args: unknown[]) => generateJson(...args),
  GeminiError: class GeminiError extends Error {
    constructor(message: string, public kind: string) {
      super(message);
    }
  },
}));

const science = SAMPLES.find((s) => s.id === "science")!.text;
const withoutQuestion = (a: AdaptedAssignment, label: string): AdaptedAssignment => ({
  ...a,
  sections: a.sections.map((s) => ({ ...s, blocks: s.blocks.filter((b) => !(b.type === "question" && b.number === label)) })),
});

describe("adaptAssignment (AI path, mocked model)", () => {
  beforeEach(() => {
    generateJson.mockReset();
    vi.resetModules();
  });

  it("returns validated AI output with fidelity + metrics", async () => {
    generateJson.mockResolvedValueOnce({ data: SCIENCE.adhd, model: "gemini-test" });
    const { adaptAssignment } = await import("@/lib/adapt/service");
    const r = await adaptAssignment(science, defaultProfile("adhd"));
    expect(r.source).toBe("ai");
    expect(r.model).toBe("gemini-test");
    expect(r.fidelity.passed).toBe(true);
    expect(generateJson).toHaveBeenCalledTimes(1);
    const { system, user } = generateJson.mock.calls[0][0];
    expect(system).toContain("EVERY QUESTION SURVIVES");
    expect(user).toContain("QUESTION INVENTORY");
    expect(user).toContain("4: Which of the following is a producer?");
  });

  it("asks the model to fix dropped questions, using the corrected answer", async () => {
    generateJson
      .mockResolvedValueOnce({ data: withoutQuestion(SCIENCE.dyslexia, "3"), model: "m" })
      .mockResolvedValueOnce({ data: SCIENCE.dyslexia, model: "m" });
    const { adaptAssignment } = await import("@/lib/adapt/service");
    const r = await adaptAssignment(science, defaultProfile("dyslexia"));
    expect(generateJson).toHaveBeenCalledTimes(2);
    expect(generateJson.mock.calls[1][0].user).toContain("3: Explain why a fox depends on photosynthesis");
    expect(r.fidelity.missing).toEqual([]);
    expect(r.fidelity.restored).toEqual([]);
  });

  it("restores a question word-for-word if the retry still drops it", async () => {
    const broken = withoutQuestion(SCIENCE.autism, "5");
    generateJson.mockResolvedValue({ data: broken, model: "m" });
    const { adaptAssignment } = await import("@/lib/adapt/service");
    const r = await adaptAssignment(science, defaultProfile("autism"));
    expect(r.fidelity.restored).toEqual(["5"]);
    expect(r.fidelity.matchedQuestions).toBe(5);
    expect(r.assignment.sections.at(-1)?.heading).toMatch(/original/i);
  });

  it("falls back to the offline engine on quota errors and says why", async () => {
    const { GeminiError } = await import("@/lib/adapt/gemini");
    generateJson.mockRejectedValue(new (GeminiError as unknown as new (m: string, k: string) => Error)("429 quota", "quota"));
    const { adaptAssignment } = await import("@/lib/adapt/service");
    const r = await adaptAssignment(science, defaultProfile("apd"));
    expect(r.source).toBe("offline");
    expect(r.fallbackReason).toBe("quota_exceeded");
    expect(r.fidelity.missing).toEqual([]);
  });

  it("rejects schema-invalid output and falls back", async () => {
    generateJson.mockResolvedValue({ data: { title: "x", sections: [] }, model: "m" });
    const { adaptAssignment } = await import("@/lib/adapt/service");
    const r = await adaptAssignment(science, defaultProfile("adhd"));
    expect(r.source).toBe("offline");
    expect(r.fallbackReason).toBe("invalid_output");
  });
});
