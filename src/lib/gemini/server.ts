import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AccessibilityMode, ContentBlock } from "@/lib/types";
import { MODES } from "@/lib/constants";
import {
  buildSystemPrompt,
  buildUserPrompt,
  MODE_TEMPERATURE,
} from "./prompts";
import { parseGeminiJson } from "./parse-response";
import { isQuotaOrRateLimitError, isTransientError } from "./errors";

const MODEL = "gemini-2.0-flash";
const MAX_INPUT_CHARS = 6000;
const MAX_TRANSIENT_RETRIES = 1;

function getClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  return new GoogleGenerativeAI(apiKey);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface TransformOptions {
  retryTransient?: boolean;
}

export async function transformWithGemini(
  input: string,
  mode: AccessibilityMode,
  options: TransformOptions = {},
): Promise<ContentBlock[]> {
  const { retryTransient = false } = options;
  const trimmed = input.trim().slice(0, MAX_INPUT_CHARS);
  const genAI = getClient();
  const temperature = MODE_TEMPERATURE[mode];

  let lastError: unknown;
  const maxAttempts = retryTransient ? 1 + MAX_TRANSIENT_RETRIES : 1;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const model = genAI.getGenerativeModel({
        model: MODEL,
        systemInstruction: buildSystemPrompt(mode),
        generationConfig: {
          temperature,
          maxOutputTokens: 2048,
          responseMimeType: "application/json",
        },
      });

      const result = await model.generateContent(buildUserPrompt(trimmed, mode));
      const text = result.response.text();

      if (!text?.trim()) {
        throw new Error("Empty response from Gemini");
      }

      return parseGeminiJson(text);
    } catch (error) {
      lastError = error;

      // Quota / free tier — fail fast (caller uses local fallback)
      if (isQuotaOrRateLimitError(error)) {
        break;
      }

      if (
        retryTransient &&
        attempt < maxAttempts - 1 &&
        isTransientError(error)
      ) {
        await sleep(500);
        continue;
      }

      break;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Gemini transformation failed");
}

export function buildTransformResult(
  blocks: ContentBlock[],
  mode: AccessibilityMode,
) {
  const config = MODES.find((m) => m.id === mode)!;
  return {
    blocks,
    modeLabel: config.label,
    modeDescription: config.description,
    source: "gemini" as const,
  };
}
