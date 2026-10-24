import { z } from "zod";
import type { AdaptedAssignment } from "./types";
import { NEED_IDS } from "./types";
import { RESEARCH_IDS } from "./research";

const BLOCK_TYPES = ["text", "keyIdea", "vocab", "direction", "question", "checklist", "example", "break", "notes", "tip", "expectations"] as const;
const ICONS = ["read", "write", "think", "talk", "listen", "look", "move", "check", "calc", "draw"] as const;

const str = (max: number) => z.string().trim().max(max * 2).transform((s) => s.slice(0, max));
const optStr = (max: number) => z.string().trim().max(max * 2).transform((s) => s.slice(0, max) || undefined).optional().nullable().transform((v) => v ?? undefined);
const strList = (maxItems: number, maxLen: number) =>
  z
    .array(z.unknown())
    .optional()
    .nullable()
    .transform((arr) => {
      const out = (arr ?? [])
        .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
        .map((x) => x.trim().slice(0, maxLen))
        .slice(0, maxItems);
      return out.length ? out : undefined;
    });

const supportsSchema = z
  .object({
    starters: strList(4, 200),
    wordBank: strList(16, 60),
    hint: optStr(300),
    steps: strList(8, 240),
    length: optStr(80),
    responseOptions: strList(5, 80),
  })
  .partial()
  .optional()
  .nullable()
  .transform((s) => {
    if (!s) return undefined;
    const cleaned = Object.fromEntries(Object.entries(s).filter(([, v]) => v !== undefined));
    return Object.keys(cleaned).length ? cleaned : undefined;
  });

const blockSchema = z.object({
  type: z.enum(BLOCK_TYPES),
  text: optStr(1600),
  term: optStr(80),
  syllables: optStr(100),
  definition: optStr(300),
  number: z
    .union([z.string(), z.number()])
    .optional()
    .nullable()
    .transform((v) => (v === null || v === undefined || v === "" ? undefined : String(v).trim().slice(0, 12))),
  items: strList(16, 400),
  supports: supportsSchema,
  minutes: z.number().min(0).max(120).optional().nullable().transform((v) => (v ? Math.round(v) : undefined)),
  icon: z.enum(ICONS).optional().nullable().catch(undefined).transform((v) => v ?? undefined),
});

const sectionSchema = z.object({
  heading: str(120),
  purpose: optStr(240),
  minutes: z.number().min(0).max(240).optional().nullable().transform((v) => (v ? Math.round(v) : undefined)),
  blocks: z
    .array(z.unknown())
    .transform((arr) =>
      arr
        .map((b) => blockSchema.safeParse(b))
        .filter((r) => r.success)
        .map((r) => r.data!)
        .filter((b) => b.text || b.term || b.items?.length),
    ),
});

const changeSchema = z.object({
  title: str(120),
  detail: str(400),
  barrier: str(300),
  need: z.enum(["dyslexia", "adhd", "apd", "autism", "all"]).catch("all"),
  evidence: z.string().transform((e) => (RESEARCH_IDS.includes(e) ? e : "udl-knowledge")),
});

const barrierSchema = z.object({
  quote: str(300),
  issue: str(240),
  needs: z
    .array(z.string())
    .transform((n) => n.filter((x): x is (typeof NEED_IDS)[number] => (NEED_IDS as string[]).includes(x)))
    .catch([]),
});

export const adaptedAssignmentSchema = z.object({
  title: str(140),
  studentIntro: str(400).catch(""),
  estimatedMinutes: z.number().min(1).max(240).optional().nullable().transform((v) => (v ? Math.round(v) : undefined)),
  sections: z
    .array(z.unknown())
    .min(1)
    .transform((arr) =>
      arr
        .map((s) => sectionSchema.safeParse(s))
        .filter((r) => r.success)
        .map((r) => r.data!)
        .filter((s) => s.blocks.length > 0),
    ),
  changes: z
    .array(z.unknown())
    .catch([])
    .transform((arr) => arr.map((c) => changeSchema.safeParse(c)).filter((r) => r.success).map((r) => r.data!).slice(0, 12)),
  teacherNotes: strList(8, 400).transform((v) => v ?? []),
  barriers: z
    .array(z.unknown())
    .catch([])
    .transform((arr) => arr.map((c) => barrierSchema.safeParse(c)).filter((r) => r.success).map((r) => r.data!).slice(0, 14)),
  preserved: z
    .object({ objectives: strList(6, 240).transform((v) => v ?? []), vocabulary: strList(16, 60).transform((v) => v ?? []) })
    .catch({ objectives: [], vocabulary: [] }),
  languageReplacements: z
    .array(z.object({ original: str(160), replacement: str(200) }).nullable().catch(null))
    .optional()
    .nullable()
    .transform((arr) => {
      const out = (arr ?? []).filter((x): x is { original: string; replacement: string } => !!x);
      return out.length ? out.slice(0, 12) : undefined;
    }),
});

export function parseAdaptedAssignment(raw: unknown): AdaptedAssignment | null {
  const result = adaptedAssignmentSchema.safeParse(raw);
  if (!result.success) return null;
  const data = result.data as AdaptedAssignment;
  if (data.sections.length === 0) return null;
  return data;
}

/** JSON Schema sent to Gemini (`responseJsonSchema`) to constrain decoding. */
export const GEMINI_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    studentIntro: { type: "string", description: "1–2 sentences to the student: what this is and why it matters." },
    estimatedMinutes: { type: "integer" },
    sections: {
      type: "array",
      items: {
        type: "object",
        properties: {
          heading: { type: "string" },
          purpose: { type: "string" },
          minutes: { type: "integer" },
          blocks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: { type: "string", enum: [...BLOCK_TYPES] },
                text: { type: "string" },
                term: { type: "string" },
                syllables: { type: "string" },
                definition: { type: "string" },
                number: { type: "string", description: "For question blocks: the label of the ORIGINAL question (e.g. \"2\" or \"3b\")." },
                items: { type: "array", items: { type: "string" } },
                supports: {
                  type: "object",
                  properties: {
                    starters: { type: "array", items: { type: "string" } },
                    wordBank: { type: "array", items: { type: "string" } },
                    hint: { type: "string" },
                    steps: { type: "array", items: { type: "string" } },
                    length: { type: "string" },
                    responseOptions: { type: "array", items: { type: "string" } },
                  },
                },
                minutes: { type: "integer" },
                icon: { type: "string", enum: [...ICONS] },
              },
              required: ["type"],
            },
          },
        },
        required: ["heading", "blocks"],
      },
    },
    changes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          detail: { type: "string" },
          barrier: { type: "string" },
          need: { type: "string", enum: [...NEED_IDS, "all"] },
          evidence: { type: "string", enum: RESEARCH_IDS },
        },
        required: ["title", "detail", "barrier", "need", "evidence"],
      },
    },
    teacherNotes: { type: "array", items: { type: "string" } },
    barriers: {
      type: "array",
      items: {
        type: "object",
        properties: {
          quote: { type: "string", description: "Exact, verbatim excerpt from the original." },
          issue: { type: "string" },
          needs: { type: "array", items: { type: "string", enum: [...NEED_IDS] } },
        },
        required: ["quote", "issue", "needs"],
      },
    },
    preserved: {
      type: "object",
      properties: {
        objectives: { type: "array", items: { type: "string" } },
        vocabulary: { type: "array", items: { type: "string" } },
      },
      required: ["objectives", "vocabulary"],
    },
    languageReplacements: {
      type: "array",
      items: {
        type: "object",
        properties: { original: { type: "string" }, replacement: { type: "string" } },
        required: ["original", "replacement"],
      },
    },
  },
  required: ["title", "studentIntro", "sections", "changes", "teacherNotes", "barriers", "preserved"],
} as const;
