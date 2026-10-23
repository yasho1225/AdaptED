"use client";

import type { CreateRequest, CreateResult } from "./create";
import type { AdaptResult, LearnerProfile } from "./types";

const cache = new Map<string, AdaptResult>();

function key(source: string, profile: LearnerProfile) {
  return JSON.stringify([source.trim(), [...profile.needs].sort(), [...profile.supports].sort(), profile.expectations, profile.language, profile.grade ?? "", profile.notes ?? ""]);
}

export async function requestAdaptation(source: string, profile: LearnerProfile, opts: { signal?: AbortSignal; live?: boolean } = {}): Promise<AdaptResult> {
  const k = key(source, profile) + (opts.live ? ":live" : "");
  const hit = cache.get(k);
  if (hit) return hit;

  if (!opts.live) {
    // Loaded on first use, so the three samples' pre-made versions stay out of the initial bundle.
    const { curatedResult } = await import("./curated");
    const curated = curatedResult(source, profile);
    if (curated) {
      cache.set(k, curated);
      return curated;
    }
  }

  const res = await fetch("/api/adapt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source, profile }),
    signal: opts.signal,
  });
  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new Error("The server returned an unexpected response. Please try again.");
  }
  if (!res.ok) {
    const msg = data && typeof data === "object" && "error" in data ? String((data as { error: unknown }).error) : "Something went wrong.";
    throw new Error(msg);
  }
  const result = data as AdaptResult;
  cache.set(k, result);
  return result;
}

/** Asks the server to write a new assignment from a topic (see create.ts). */
export async function requestCreate(req: CreateRequest, signal?: AbortSignal): Promise<CreateResult> {
  const res = await fetch("/api/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
    signal,
  });
  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new Error("The server returned an unexpected response. Please try again.");
  }
  if (!res.ok) {
    throw new Error(data && typeof data === "object" && "error" in data ? String((data as { error: unknown }).error) : "Something went wrong.");
  }
  return data as CreateResult;
}
