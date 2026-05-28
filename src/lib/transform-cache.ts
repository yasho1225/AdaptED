import type { AccessibilityMode, TransformResult } from "./types";
import { getExampleTransform, seedExampleCache } from "./example-showcase";
import { cacheKey } from "./placeholders";

const cache = new Map<string, TransformResult>();
const inflight = new Map<string, Promise<TransformResult>>();

export function getCachedTransform(
  input: string,
  mode: AccessibilityMode,
): TransformResult | undefined {
  return cache.get(cacheKey(input, mode));
}

export function setCachedTransform(
  input: string,
  mode: AccessibilityMode,
  result: TransformResult,
): void {
  cache.set(cacheKey(input, mode), result);
}

export async function fetchTransform(
  input: string,
  mode: AccessibilityMode,
  signal?: AbortSignal,
): Promise<TransformResult> {
  const trimmed = input.trim();
  const key = cacheKey(trimmed, mode);

  const existing = cache.get(key);
  if (existing) return existing;

  const example = getExampleTransform(trimmed, mode);
  if (example) {
    cache.set(key, example);
    return example;
  }

  const pending = inflight.get(key);
  if (pending) return pending;

  const request = (async () => {
    const res = await fetch("/api/transform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: trimmed, mode }),
      signal,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        typeof data.error === "string"
          ? data.error
          : "Couldn't transform content. Please try again.",
      );
    }

    const result = data as TransformResult;
    cache.set(key, result);
    return result;
  })();

  inflight.set(key, request);

  try {
    return await request;
  } finally {
    if (inflight.get(key) === request) {
      inflight.delete(key);
    }
  }
}

seedExampleCache(setCachedTransform);
