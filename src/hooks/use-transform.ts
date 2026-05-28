"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AccessibilityMode, TransformResult } from "@/lib/types";
import { emptyTransformResult } from "@/lib/placeholders";
import { getExampleTransform } from "@/lib/example-showcase";
import { fetchTransform, getCachedTransform } from "@/lib/transform-cache";

export type TransformStatus = "idle" | "loading" | "success" | "error";

interface UseTransformOptions {
  debounceMs?: number;
  enabled?: boolean;
}

export function useTransform(
  input: string,
  mode: AccessibilityMode,
  options: UseTransformOptions = {},
) {
  const { debounceMs = 550, enabled = true } = options;
  const trimmed = input.trim();

  const instantResult = useMemo(() => {
    if (!trimmed) return null;
    return getCachedTransform(trimmed, mode) ?? getExampleTransform(trimmed, mode);
  }, [trimmed, mode]);

  const [asyncResult, setAsyncResult] = useState<TransformResult | null>(null);
  const [status, setStatus] = useState<TransformStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fetchPending, setFetchPending] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);

  const runTransform = useCallback(
    async (text: string, activeMode: AccessibilityMode) => {
      const textTrimmed = text.trim();
      if (!textTrimmed) return;

      const cached =
        getCachedTransform(textTrimmed, activeMode) ??
        getExampleTransform(textTrimmed, activeMode);
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
        const data = await fetchTransform(textTrimmed, activeMode, controller.signal);
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
    [],
  );

  const retry = useCallback(() => {
    void runTransform(input, mode);
  }, [input, mode, runTransform]);

  useEffect(() => {
    if (!enabled) return;

    if (!trimmed || instantResult) {
      abortRef.current?.abort();
      abortRef.current = null;
      requestIdRef.current += 1;
      return;
    }

    abortRef.current?.abort();
    abortRef.current = null;
    requestIdRef.current += 1;

    let cancelled = false;
    const rafId = requestAnimationFrame(() => {
      if (!cancelled) setFetchPending(true);
    });

    const timer = setTimeout(() => {
      void runTransform(input, mode);
    }, debounceMs);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
      setFetchPending(false);
    };
  }, [input, mode, debounceMs, enabled, runTransform, trimmed, instantResult]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const displayResult = !trimmed
    ? emptyTransformResult(mode)
    : (instantResult ?? asyncResult ?? emptyTransformResult(mode));

  const displayStatus: TransformStatus = !trimmed
    ? "idle"
    : instantResult
      ? "success"
      : fetchPending || status === "loading"
        ? "loading"
        : status;

  const displayError = instantResult ? null : error;

  return {
    result: displayResult,
    status: displayStatus,
    error: displayError,
    retry,
    isLoading: displayStatus === "loading",
  };
}

/** Prefetch all modes for a fixed input (e.g. features scroll). Returns version to re-read cache. */
export function usePrefetchTransforms(input: string): number {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const textTrimmed = input.trim();
    if (!textTrimmed) return;

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
