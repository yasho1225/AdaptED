"use client";

import { useCallback, useRef, useState } from "react";
import type { TransformResult } from "@/lib/types";

export type GenerationStatus = "idle" | "loading" | "success" | "error";

export function useGeneration<TBody extends object>(endpoint: string) {
  const [result, setResult] = useState<TransformResult | null>(null);
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const lastBodyRef = useRef<TBody | null>(null);

  const generate = useCallback(
    async (body: TBody): Promise<TransformResult | null> => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      lastBodyRef.current = body;

      setStatus("loading");
      setError(null);

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            typeof data.error === "string"
              ? data.error
              : "Generation failed. Please try again.",
          );
        }

        const parsed = data as TransformResult;
        setResult(parsed);
        setStatus("success");
        return parsed;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return null;
        setStatus("error");
        setError(
          err instanceof Error
            ? err.message
            : "Generation failed. Please try again.",
        );
        return null;
      }
    },
    [endpoint],
  );

  const retry = useCallback(() => {
    if (lastBodyRef.current) {
      void generate(lastBodyRef.current);
    }
  }, [generate]);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setResult(null);
    setStatus("idle");
    setError(null);
    lastBodyRef.current = null;
  }, []);

  return {
    result,
    status,
    error,
    generate,
    retry,
    reset,
    isLoading: status === "loading",
  };
}
