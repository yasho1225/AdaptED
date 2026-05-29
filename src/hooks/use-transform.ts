"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AccessibilityMode, TransformResult } from "@/lib/types";
import { emptyTransformResult } from "@/lib/placeholders";
import {
  getExampleTransform,
  isExampleInput,
} from "@/lib/example-showcase";
import { fetchTransform, getCachedTransform } from "@/lib/transform-cache";

export type TransformStatus = "idle" | "loading" | "success" | "error";

/** Brief loading beat for hardcoded demo transforms (no API). */
const DEMO_LOADING_MS = 580;

interface UseTransformOptions {
  debounceMs?: number;
  enabled?: boolean;
}

function resolveCached(
  input: string,
  mode: AccessibilityMode,
): TransformResult | undefined {
  return getCachedTransform(input, mode) ?? getExampleTransform(input, mode);
}

export function useTransform(
  input: string,
  mode: AccessibilityMode,
  options: UseTransformOptions = {},
) {
  const { debounceMs = 550, enabled = true } = options;
  const trimmed = input.trim();
  const isExample = isExampleInput(trimmed);

  const cachedForMode = useMemo(() => {
    if (!trimmed) return null;
    return resolveCached(trimmed, mode);
  }, [trimmed, mode]);

  const [asyncResult, setAsyncResult] = useState<TransformResult | null>(null);
  const [status, setStatus] = useState<TransformStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fetchPending, setFetchPending] = useState(false);
  const [forceLoading, setForceLoading] = useState(false);
  const [demoAnimating, setDemoAnimating] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  const demoRunIdRef = useRef(0);

  const playExampleTransform = useCallback(
    async (text: string, activeMode: AccessibilityMode) => {
      const textTrimmed = text.trim();
      const cached = getExampleTransform(textTrimmed, activeMode);
      if (!cached) return;

      const runId = ++demoRunIdRef.current;
      setDemoAnimating(true);
      setStatus("loading");
      setError(null);
      setFetchPending(false);

      await new Promise((resolve) => setTimeout(resolve, DEMO_LOADING_MS));

      if (runId !== demoRunIdRef.current) return;

      setAsyncResult(cached);
      setStatus("success");
      setDemoAnimating(false);
    },
    [],
  );

  const runTransform = useCallback(
    async (text: string, activeMode: AccessibilityMode) => {
      const textTrimmed = text.trim();
      if (!textTrimmed) return;

      if (isExampleInput(textTrimmed)) {
        await playExampleTransform(text, activeMode);
        return;
      }

      const cached = resolveCached(textTrimmed, activeMode);
      if (cached) {
        setAsyncResult(cached);
        setStatus("success");
        setError(null);
        setFetchPending(false);
        return;
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const requestId = ++requestIdRef.current;

      setStatus("loading");
      setError(null);
      setFetchPending(false);

      try {
        const data = await fetchTransform(
          textTrimmed,
          activeMode,
          controller.signal,
        );
        if (requestId !== requestIdRef.current) return;
        setAsyncResult(data);
        setStatus("success");
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        if (requestId !== requestIdRef.current) return;
        setStatus("error");
        setError(
          err instanceof Error
            ? err.message
            : "Couldn't transform content. Please try again.",
        );
      }
    },
    [playExampleTransform],
  );

  const retry = useCallback(() => {
    void runTransform(input, mode);
  }, [input, mode, runTransform]);

  const transformNow = useCallback(async () => {
    const textTrimmed = input.trim();
    if (!textTrimmed) return;

    if (isExampleInput(textTrimmed)) {
      await playExampleTransform(input, mode);
      return;
    }

    setForceLoading(true);
    setError(null);
    setFetchPending(false);
    const started = Date.now();

    try {
      await runTransform(input, mode);
      const elapsed = Date.now() - started;
      if (elapsed < DEMO_LOADING_MS) {
        await new Promise((resolve) =>
          setTimeout(resolve, DEMO_LOADING_MS - elapsed),
        );
      }
    } finally {
      setForceLoading(false);
    }
  }, [input, mode, runTransform, playExampleTransform]);

  useEffect(() => {
    if (!enabled) {
      abortRef.current?.abort();
      abortRef.current = null;
      requestIdRef.current += 1;
      demoRunIdRef.current += 1;
      setFetchPending(false);
      setDemoAnimating(false);
      return;
    }

    if (!trimmed) {
      abortRef.current?.abort();
      abortRef.current = null;
      requestIdRef.current += 1;
      demoRunIdRef.current += 1;
      setAsyncResult(null);
      setStatus("idle");
      setFetchPending(false);
      setDemoAnimating(false);
      return;
    }

    if (isExample) {
      abortRef.current?.abort();
      abortRef.current = null;
      requestIdRef.current += 1;
      void playExampleTransform(input, mode);
      return () => {
        demoRunIdRef.current += 1;
        setDemoAnimating(false);
      };
    }

    if (cachedForMode) {
      abortRef.current?.abort();
      abortRef.current = null;
      requestIdRef.current += 1;
      demoRunIdRef.current += 1;
      setAsyncResult(cachedForMode);
      setStatus("success");
      setError(null);
      setFetchPending(false);
      setDemoAnimating(false);
      return;
    }

    abortRef.current?.abort();
    abortRef.current = null;
    requestIdRef.current += 1;
    demoRunIdRef.current += 1;
    setAsyncResult(null);

    let cancelled = false;
    const rafId = requestAnimationFrame(() => {
      if (!cancelled) setFetchPending(true);
    });

    const timer = setTimeout(() => {
      if (!cancelled) void runTransform(input, mode);
    }, debounceMs);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, [
    input,
    mode,
    debounceMs,
    enabled,
    runTransform,
    trimmed,
    isExample,
    cachedForMode,
    playExampleTransform,
  ]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const displayResult = !trimmed
    ? emptyTransformResult(mode)
    : demoAnimating
      ? emptyTransformResult(mode)
      : (asyncResult ?? cachedForMode ?? emptyTransformResult(mode));

  const displayStatus: TransformStatus = !trimmed
    ? "idle"
    : forceLoading || demoAnimating
      ? "loading"
      : isExample
        ? status === "error"
          ? "error"
          : status === "loading"
            ? "loading"
            : "success"
        : cachedForMode && !fetchPending
          ? "success"
          : fetchPending || status === "loading"
            ? "loading"
            : status;

  const displayError =
    isExample && status !== "error" ? null : cachedForMode && !isExample ? null : error;

  return {
    result: displayResult,
    status: displayStatus,
    error: displayError,
    retry,
    transformNow,
    isLoading: displayStatus === "loading",
    isExampleDemo: isExample,
  };
}

/** Prefetch all modes for a fixed input (e.g. features scroll). Returns version to re-read cache. */
export function usePrefetchTransforms(input: string): number {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const textTrimmed = input.trim();
    if (!textTrimmed || isExampleInput(textTrimmed)) return;

    const modes: AccessibilityMode[] = ["dyslexia", "adhd", "apd", "autism"];

    void Promise.all(
      modes.map((m) =>
        getCachedTransform(textTrimmed, m)
          ? Promise.resolve()
          : fetchTransform(textTrimmed, m).catch(() => undefined),
      ),
    ).then(() => setVersion((v) => v + 1));
  }, [input]);

  return version;
}
