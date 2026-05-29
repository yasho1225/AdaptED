"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, FileText, Sparkles } from "lucide-react";
import { MODES } from "@/lib/constants";
import { getExampleShowcase } from "@/lib/example-showcase";
import { cn } from "@/lib/utils";
import type { AccessibilityMode } from "@/lib/types";

const MODE_CYCLE = ["dyslexia", "adhd", "apd", "autism"] as const;

const PREVIEW_HINT: Record<AccessibilityMode, string> = {
  dyslexia: "Short chunks · simpler words",
  adhd: "Steps & checklists",
  apd: "Headings & bullet notes",
  autism: "Fixed 3-section layout",
};

export function HeroShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState<"idle" | "transforming">("idle");
  const activeId = MODE_CYCLE[activeIndex];
  const activeMode = MODES.find((m) => m.id === activeId)!;
  const preview =
    getExampleShowcase(activeId) ?? getExampleShowcase("dyslexia");

  useEffect(() => {
    const cycle = window.setInterval(() => {
      setPhase("transforming");
      window.setTimeout(() => {
        setActiveIndex((i) => (i + 1) % MODE_CYCLE.length);
        setPhase("idle");
      }, 650);
    }, 3200);
    return () => window.clearInterval(cycle);
  }, []);

  const previewBlocks = useMemo(
    () =>
      (preview?.blocks ?? [])
        .filter((b) => b.type !== "note")
        .slice(0, 4),
    [preview],
  );

  return (
    <div
      className="relative mx-auto w-full max-w-lg lg:max-w-none"
      aria-label="Product preview: upload assignment, AI transforms into four accessibility formats"
    >
      <div className="pointer-events-none absolute -inset-x-6 -top-6 bottom-0 rounded-[2rem] bg-primary/12 blur-3xl" />

      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="surface-elevated relative overflow-hidden rounded-2xl"
      >
        {/* Step 1 — Upload */}
        <div className="panel-header">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-card shadow-sm">
              <FileText className="size-4 text-card-accent" aria-hidden />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-card-muted-foreground">
                Step 1 · Teacher uploads
              </p>
              <p className="text-[13px] font-medium text-card-foreground">
                Worksheet, PDF, or assignment
              </p>
            </div>
          </div>
          <p className="mt-3 rounded-lg border border-border/70 bg-card px-3 py-2.5 text-[12px] leading-6 text-card-muted-foreground">
            Explain photosynthesis and why it matters in ecosystems…
          </p>
        </div>

        <div className="flex justify-center border-b border-border/40 py-2" aria-hidden>
          <ArrowDown className="size-4 text-card-accent" />
        </div>

        {/* Step 2 — AI */}
        <div className="border-b border-card-border/70 bg-[oklch(0.99_0.006_252)] px-4 py-3.5">
          <div className="flex items-center gap-2">
            <motion.span
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-card-accent/15"
              animate={phase === "transforming" ? { scale: [1, 1.08, 1] } : {}}
              transition={{ duration: 0.5, repeat: phase === "transforming" ? Infinity : 0 }}
            >
              <Sparkles className="size-4 text-card-accent" aria-hidden />
            </motion.span>
            <div className="flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-card-accent">
                Step 2 · AI transformation
              </p>
              <p className="text-[12px] text-card-muted-foreground">
                {phase === "transforming" ? "Rewriting for accessibility…" : "Ready"}
              </p>
            </div>
          </div>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-muted">
            <motion.div
              className={cn("h-full rounded-full", activeMode.theme.accent)}
              animate={{ width: phase === "transforming" ? "100%" : "72%" }}
              transition={{ duration: phase === "transforming" ? 0.65 : 0.3 }}
            />
          </div>
        </div>

        <div className="flex justify-center border-b border-border/40 py-2" aria-hidden>
          <ArrowDown className="size-4 text-card-accent" />
        </div>

        {/* Step 3 — Four outputs */}
        <div className="bg-[oklch(0.99_0.006_252)] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-card-muted-foreground">
            Step 3 · Four accessible outputs
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {MODES.map((mode, index) => {
              const isActive = activeIndex === index;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-pressed={isActive}
                  aria-label={`Preview ${mode.label} output`}
                  className={cn(
                    "rounded-lg border px-2.5 py-2 text-left transition-all duration-200",
                    isActive
                      ? cn("bg-card shadow-md ring-2 ring-offset-1 ring-offset-card", mode.theme.ring, mode.theme.border)
                      : "border-border bg-muted/80 text-card-muted-foreground hover:bg-muted",
                  )}
                >
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold">
                    <span className={cn("size-2 rounded-full", mode.theme.accent)} />
                    {mode.shortLabel}
                  </span>
                  <span className="mt-0.5 block text-[10px] leading-snug opacity-80">
                    {PREVIEW_HINT[mode.id]}
                  </span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "mt-3 rounded-xl border p-3",
                activeMode.theme.border,
                activeMode.theme.tint,
              )}
            >
              <p className="text-[11px] font-semibold text-card-foreground">
                {activeMode.label} preview
              </p>
              <ul className="mt-2 space-y-1.5">
                {previewBlocks.map((block, i) => (
                  <li
                    key={i}
                    className="text-[11px] leading-relaxed text-card-muted-foreground line-clamp-2"
                  >
                    {block.text.replace(/\*\*/g, "")}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
