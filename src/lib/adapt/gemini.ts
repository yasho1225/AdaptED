import "server-only";
import { GoogleGenAI } from "@google/genai";
import { GEMINI_RESPONSE_SCHEMA } from "./schema";

const PRIMARY_MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
/** Used if the primary model id is retired or unavailable for this key. */
const FALLBACK_MODEL = "gemini-flash-latest";

/** The names a Gemini key is commonly stored under, in the order they are checked. */
const KEY_NAMES = ["GEMINI_API_KEY", "GOOGLE_API_KEY", "GOOGLE_GENERATIVE_AI_API_KEY"] as const;

export class GeminiError extends Error {
  constructor(
    message: string,
    readonly kind: "quota" | "rate" | "not_found" | "transient" | "timeout" | "other",
  ) {
    super(message);
    this.name = "GeminiError";
  }
}

function classify(error: unknown): GeminiError {
  if (error instanceof GeminiError) return error;
  const status = typeof error === "object" && error && "status" in error ? Number((error as { status: unknown }).status) : undefined;
  const text = error instanceof Error ? error.message : String(error);
  if (error instanceof Error && error.name === "AbortError") return new GeminiError("The AI took too long to answer", "timeout");
  if (status === 429 || /429|rate.?limit|too many requests/i.test(text)) {
    return new GeminiError(text, /quota|exhausted|billing|limit: 0/i.test(text) ? "quota" : "rate");
  }
  if (status === 403 || /quota|billing|permission/i.test(text)) return new GeminiError(text, "quota");
  if (status === 404 || /not found|is not supported|unknown model/i.test(text)) return new GeminiError(text, "not_found");
  if ((status && status >= 500) || /unavailable|overloaded|deadline|timeout|econnreset|fetch failed/i.test(text)) {
    return new GeminiError(text, "transient");
  }
  return new GeminiError(text, "other");
}

/** Which environment variable holds the key (never the key itself), or null if none is set. */
export function geminiKeyName(): (typeof KEY_NAMES)[number] | null {
  return KEY_NAMES.find((n) => process.env[n]?.trim()) ?? null;
}

export function hasGeminiKey(): boolean {
  return geminiKeyName() !== null;
}

let client: GoogleGenAI | null = null;
function getClient(): GoogleGenAI {
  const name = geminiKeyName();
  if (!name) throw new GeminiError("No Gemini API key is configured", "other");
  // GEMINI_BASE_URL is only for testing against a local stand-in for the API (scripts/e2e-ai-mock.mjs).
  const baseUrl = process.env.GEMINI_BASE_URL?.trim();
  client ??= new GoogleGenAI({ apiKey: process.env[name]!.trim(), ...(baseUrl ? { httpOptions: { baseUrl } } : {}) });
  return client;
}

export interface JsonCallOptions {
  system: string;
  user: string;
  temperature?: number;
  maxOutputTokens?: number;
  thinkingBudget?: number;
  schema?: unknown;
  /** Epoch ms by which the call must have answered; it is cancelled at that moment. */
  deadline?: number;
}

/** Below this, a call is not started: it could not finish in time. */
const MIN_CALL_MS = 4000;

async function callOnce(model: string, opts: JsonCallOptions): Promise<unknown> {
  const left = opts.deadline ? opts.deadline - Date.now() : Infinity;
  if (left < MIN_CALL_MS) throw new GeminiError("Not enough time left for another AI call", "timeout");
  const controller = new AbortController();
  const timer = Number.isFinite(left) ? setTimeout(() => controller.abort(), left) : undefined;
  try {
    const response = await getClient().models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: opts.user }] }],
      config: {
        systemInstruction: opts.system,
        temperature: opts.temperature ?? 0.4,
        maxOutputTokens: opts.maxOutputTokens ?? 16384,
        responseMimeType: "application/json",
        responseJsonSchema: opts.schema ?? GEMINI_RESPONSE_SCHEMA,
        thinkingConfig: { thinkingBudget: opts.thinkingBudget ?? 1024 },
        abortSignal: controller.signal,
      },
    });
    const text = response.text?.trim();
    if (!text) throw new GeminiError("Empty response from model", "transient");
    try {
      return JSON.parse(text.replace(/^```(?:json)?\s*|\s*```$/g, ""));
    } catch {
      throw new GeminiError("Model returned malformed JSON", "transient");
    }
  } catch (e) {
    if (controller.signal.aborted) throw new GeminiError("The AI took too long to answer", "timeout");
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

/** The most recent failure on this server instance, for /api/status (a fallback hides it from the visitor). */
let lastFailure: { kind: GeminiError["kind"]; message: string; model: string; at: number } | null = null;
export function lastGeminiFailure() {
  return lastFailure;
}

/**
 * Call Gemini for structured JSON with one transient retry and model fallback, all within the
 * deadline if one is given. Returns parsed JSON + model id.
 */
export async function generateJson(opts: JsonCallOptions): Promise<{ data: unknown; model: string }> {
  let model = PRIMARY_MODEL;
  let lastError: GeminiError | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return { data: await callOnce(model, opts), model };
    } catch (e) {
      lastError = classify(e);
      if (lastError.kind === "not_found" && model !== FALLBACK_MODEL) {
        model = FALLBACK_MODEL;
        continue;
      }
      if (lastError.kind === "transient" && attempt === 0) {
        await new Promise((r) => setTimeout(r, 700));
        continue;
      }
      break;
    }
  }
  const error = lastError ?? new GeminiError("Unknown model failure", "other");
  lastFailure = { kind: error.kind, message: error.message, model, at: Date.now() };
  throw error;
}
