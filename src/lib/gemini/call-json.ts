import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ContentBlock } from "@/lib/types";
import { parseGeminiJson } from "./parse-response";
import { isQuotaOrRateLimitError, isTransientError } from "./errors";
import { GEMINI_MODEL } from "./config";
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

export async function callGeminiJson(
  systemInstruction: string,
  userPrompt: string,
  options: { temperature?: number; retryTransient?: boolean } = {},
): Promise<ContentBlock[]> {
  const { temperature = 0.3, retryTransient = true } = options;
  const genAI = getClient();

  let lastError: unknown;
  const maxAttempts = retryTransient ? 1 + MAX_TRANSIENT_RETRIES : 1;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const model = genAI.getGenerativeModel({
        model: GEMINI_MODEL,
        systemInstruction,
        generationConfig: {
          temperature,
          maxOutputTokens: 4096,
          responseMimeType: "application/json",
        },
      });

      const result = await model.generateContent(userPrompt);
      const text = result.response.text();

      if (!text?.trim()) {
        throw new Error("Empty response from Gemini");
      }

      return parseGeminiJson(text);
    } catch (error) {
      lastError = error;
      if (isQuotaOrRateLimitError(error)) break;
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
    : new Error("Gemini request failed");
}
