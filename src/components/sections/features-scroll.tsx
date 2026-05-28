"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import { MODES, FEATURE_SAMPLE } from "@/lib/constants";
import { transformContent } from "@/lib/transform";
import type { AccessibilityMode } from "@/lib/types";
import { cn } from "@/lib/utils";

export function FeaturesScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      const idx = Math.min(MODES.length - 1, Math.floor(v * MODES.length));
      setActiveIndex(idx);
    });
    return unsubscribe;
  }, [scrollYProgress]);

  const activeMode = MODES[activeIndex];
  const result = useMemo(
    () => transformContent(FEATURE_SAMPLE, activeMode.id as AccessibilityMode),
    [activeMode.id],
  );

  return (
    <section id="features" className="scroll-mt-[4.25rem] bg-muted/30">
      <div className="mx-auto max-w-6xl px-5 pt-20 pb-10 text-center sm:px-6 md:pt-24">
        <p className="section-eyebrow text-indigo-600">Accessibility modes</p>
        <h2 className="section-title">One lesson, transformed four ways</h2>
        <p className="section-description">
          Scroll to see how the same content adapts for each learning need.
        </p>
      </div>

      <div ref={containerRef} className="relative h-[380vh] max-lg:h-[320vh]">
        <div className="sticky top-[4.25rem] flex h-[calc(100vh-4.25rem)] items-center">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-14">
            <div className="space-y-3">
              {MODES.map((mode, i) => (
                <motion.div
                  key={mode.id}
                  animate={{
                    opacity: activeIndex === i ? 1 : 0.4,
                    x: activeIndex === i ? 0 : -6,
                  }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    "rounded-2xl border p-5 transition-shadow duration-300 md:p-6",
                    activeIndex === i
                      ? "border-border/80 bg-card shadow-[0_8px_30px_rgba(15,23,42,0.07)]"
                      : "border-transparent bg-transparent",
                  )}
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-semibold text-white shadow-sm",
                        mode.color,
                      )}
                    >
                      {mode.icon}
                    </span>
                    <div>
                      <h3 className="text-[16px] font-semibold tracking-[-0.02em]">
                        {mode.label}
                      </h3>
                      <p className="mt-0.5 text-[14px] leading-relaxed text-muted-foreground">
                        {mode.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="relative">
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-teal-500/8 via-indigo-500/8 to-violet-500/8 blur-2xl" />
              <motion.div
                layout
                className="relative rounded-2xl border border-border/70 bg-card p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)] ring-1 ring-black/[0.04] md:p-8"
              >
                <div className="mb-4 flex items-center gap-2 text-[12px] font-medium text-muted-foreground">
                  <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[10px] tracking-wider">
                    INPUT
                  </span>
                  <span className="truncate">{FEATURE_SAMPLE.slice(0, 56)}…</span>
                </div>

                <div
                  className={cn(
                    "mb-5 h-1 rounded-full bg-gradient-to-r",
                    activeMode.color,
                  )}
                />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeMode.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    className="min-h-[200px] space-y-3"
                  >
                    <p className="text-[14px] font-semibold tracking-[-0.01em] text-foreground">
                      {result.modeLabel}
                    </p>
                    {result.blocks.slice(0, 6).map((block, i) => (
                      <p
                        key={i}
                        className={cn(
                          "text-[14px] leading-7 text-foreground/85",
                          block.type === "key" &&
                            "rounded-lg border border-primary/10 bg-primary/5 px-3 py-2 font-medium",
                          block.type === "step" &&
                            "border-l-2 border-teal-500 pl-4",
                          block.type === "caption" &&
                            "font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground",
                        )}
                      >
                        {block.text}
                      </p>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
