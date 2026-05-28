"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AccessibilityMode, TransformResult } from "@/lib/types";
import { emptyTransformResult } from "@/lib/placeholders";
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
  const [result, setResult] = useState<TransformResult>(() => {
    const cached = getCachedTransform(input, mode);
    return cached ?? emptyTransformResult(mode);
  });
  const [status, setStatus] = useState<TransformStatus>(() => {
    if (!input.trim()) return "idle";
    return getCachedTransform(input, mode) ? "success" : "idle";
  });
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);

  const runTransform = useCallback(
    async (text: string, activeMode: AccessibilityMode) => {
      const trimmed = text.trim();
      if (!trimmed) {
        setResult(emptyTransformResult(activeMode));
        setStatus("idle");
        setError(null);
        return;
      }

      const cached = getCachedTransform(trimmed, activeMode);
      if (cached) {
        setResult(cached);
        setStatus("success");
        setError(null);
        return;
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const requestId = ++requestIdRef.current;

      setStatus("loading");
      setError(null);

      try {
        const data = await fetchTransform(trimmed, activeMode, controller.signal);
        if (requestId !== requestIdRef.current) return;
        setResult(data);
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

    const trimmed = input.trim();
    if (!trimmed) {
      setResult(emptyTransformResult(mode));
      setStatus("idle");
      setError(null);
      return;
    }

    const cached = getCachedTransform(trimmed, mode);
    if (cached) {
      setResult(cached);
      setStatus("success");
      setError(null);
      return;
    }

    const timer = setTimeout(() => {
      void runTransform(input, mode);
    }, debounceMs);

    return () => {
      clearTimeout(timer);
    };
  }, [input, mode, debounceMs, enabled, runTransform]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  return { result, status, error, retry, isLoading: status === "loading" };
}

/** Prefetch all modes for a fixed input (e.g. features scroll). Returns version to re-read cache. */
export function usePrefetchTransforms(input: string): number {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const modes: AccessibilityMode[] = [
      "dyslexia",
      "autism",
      "visual",
      "hearing",
    ];

    void Promise.all(
      modes.map((mode) =>
        getCachedTransform(trimmed, mode)
          ? Promise.resolve()
          : fetchTransform(trimmed, mode).catch(() => undefined),
      ),
    ).then(() => setVersion((v) => v + 1));
  }, [input]);

  return version;
}
