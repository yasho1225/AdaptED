import { beforeEach, describe, expect, it, vi } from "vitest";
import { parseAssignment } from "@/lib/adapt/analyze";
import { createdToText, outlineFor, sanitizeCreateRequest, DEFAULT_CREATE, READING_PLACEHOLDER } from "@/lib/adapt/create";

const generateJson = vi.fn();
let keyed = true;
vi.mock("@/lib/adapt/gemini", () => ({
  hasGeminiKey: () => keyed,
  generateJson: (...args: unknown[]) => generateJson(...args),
  GeminiError: class GeminiError extends Error {
    constructor(message: string, public kind: string) {
      super(message);
    }
  },
}));

const volcanoes = {
  title: "How Volcanoes Form",
  directions: "Read the passage, then answer the questions.",
  reading: [
    "Earth's outer layer is broken into large pieces called tectonic plates. These plates move very slowly over hotter rock below.",
    "Where plates pull apart or one plate slides under another, rock can melt into magma. Magma rises because it is less dense than the rock around it. When it reaches the surface, it is called lava.",
  ],
  questions: [
    { text: "What are tectonic plates?", choices: [] },
    { text: "Why does magma rise toward the surface?", choices: [] },
    { text: "Which word names melted rock that reaches the surface?", choices: ["Magma", "Lava", "Crust", "Mantle"] },
    { text: "Explain how plate movement can lead to a volcano.", choices: [] },
  ],
};

describe("create: request validation", () => {
  it("requires a topic and clamps everything else", () => {
    expect(sanitizeCreateRequest({ topic: " " })).toBeNull();
    expect(sanitizeCreateRequest(null)).toBeNull();
    const r = sanitizeCreateRequest({ topic: "  the   water cycle ", grade: "99", include: "bogus", questions: 40, level: "x" });
    expect(r).toEqual({ ...DEFAULT_CREATE, topic: "the water cycle", questions: 8 });
    expect(sanitizeCreateRequest({ topic: "x".repeat(500) })!.topic.length).toBe(140);
  });
});

describe("create: plain-text format", () => {
  it("round-trips through the assignment parser (title, reading, questions, choices)", () => {
    const parsed = parseAssignment(createdToText(volcanoes));
    expect(parsed.title).toBe("How Volcanoes Form");
    expect(parsed.passages).toHaveLength(2);
    expect(parsed.questions.map((q) => q.label)).toEqual(["1", "2", "3", "4"]);
    expect(parsed.questions[2].choices).toHaveLength(4);
    expect(parsed.questions[2].choices[1]).toMatch(/^B\. Lava$/);
  });

  it("starter outline invents no facts and reads naturally for clause-style topics", () => {
    const o = outlineFor({ ...DEFAULT_CREATE, topic: "How volcanoes form", questions: 5 });
    expect(o.reading).toEqual([READING_PLACEHOLDER]);
    expect(o.questions).toHaveLength(5);
    expect(o.questions[0].text).toBe("What is the most important idea about how volcanoes form? Explain it in your own words.");
    expect(o.questions.every((q) => !/what is how/i.test(q.text))).toBe(true);
    const qOnly = outlineFor({ ...DEFAULT_CREATE, topic: "American Revolution", include: "questions", questions: 3 });
    expect(qOnly.reading).toEqual([]);
    expect(qOnly.questions[1].text).toContain("American Revolution");
    expect(qOnly.questions.some((q) => /reading/.test(q.text))).toBe(false);
  });
});

describe("createAssignment (server)", () => {
  beforeEach(() => {
    generateJson.mockReset();
    keyed = true;
    vi.resetModules();
  });

  it("uses the model, trims to the requested count, and keeps choices only when there are 3+", async () => {
    generateJson.mockResolvedValueOnce({
      data: { ...volcanoes, questions: [...volcanoes.questions, { text: "Extra question nobody asked for?", choices: ["Yes", "No"] }] },
      model: "gemini-test",
    });
    const { createAssignment } = await import("@/lib/adapt/create-server");
    const r = await createAssignment({ ...DEFAULT_CREATE, topic: "volcanoes", grade: "6", questions: 4 });
    expect(r.source).toBe("ai");
    expect(r.model).toBe("gemini-test");
    expect(parseAssignment(r.text).questions).toHaveLength(4);
    const { user, system } = generateJson.mock.calls[0][0];
    expect(user).toContain("grade 6");
    expect(user).toContain("Number of questions: 4");
    expect(system).toMatch(/Never invent statistics/);
  });

  it("drops the reading when 'questions only' was asked", async () => {
    generateJson.mockResolvedValueOnce({ data: volcanoes, model: "gemini-test" });
    const { createAssignment } = await import("@/lib/adapt/create-server");
    const r = await createAssignment({ ...DEFAULT_CREATE, topic: "volcanoes", include: "questions", questions: 4 });
    expect(parseAssignment(r.text).passages).toHaveLength(0);
  });

  it("falls back to a labelled outline without a key, on bad output, and on API errors", async () => {
    keyed = false;
    let mod = await import("@/lib/adapt/create-server");
    expect(await mod.createAssignment({ ...DEFAULT_CREATE, topic: "volcanoes" })).toMatchObject({ source: "outline", fallbackReason: "no_api_key" });
    expect(generateJson).not.toHaveBeenCalled();

    keyed = true;
    vi.resetModules();
    mod = await import("@/lib/adapt/create-server");
    generateJson.mockResolvedValueOnce({ data: { title: "x" }, model: "m" });
    expect(await mod.createAssignment({ ...DEFAULT_CREATE, topic: "volcanoes" })).toMatchObject({ source: "outline", fallbackReason: "invalid_output" });

    const { GeminiError } = await import("@/lib/adapt/gemini");
    generateJson.mockRejectedValueOnce(new GeminiError("quota", "quota"));
    expect(await mod.createAssignment({ ...DEFAULT_CREATE, topic: "volcanoes" })).toMatchObject({ source: "outline", fallbackReason: "quota_exceeded" });
  });

  it("refuses topics the model marks as unsuitable", async () => {
    generateJson.mockResolvedValueOnce({ data: { title: "Topic not suitable", directions: "", reading: [], questions: [{ text: "n/a n/a", choices: [] }] }, model: "m" });
    const { createAssignment, TopicNotSuitableError } = await import("@/lib/adapt/create-server");
    await expect(createAssignment({ ...DEFAULT_CREATE, topic: "something" })).rejects.toBeInstanceOf(TopicNotSuitableError);
  });
});
