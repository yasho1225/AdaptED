"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import { FEATURE_MODE_BLURBS, MODES } from "@/lib/constants";
import { FEATURES_INPUT, getFeatureShowcase } from "@/lib/feature-showcase";
import { renderFormattedText } from "@/lib/render-text";
import type { AccessibilityMode } from "@/lib/types";
import { cn } from "@/lib/utils";

function ShowcaseBlock({
  block,
}: {
  block: { type: string; text: string };
}) {
  return (
    <p
      className={cn(
        "text-[14px] leading-7 text-card-foreground",
        block.type === "key" &&
          "rounded-lg border border-card-accent/15 bg-card-accent/5 px-3 py-2 font-medium",
        block.type === "step" && "border-l-2 border-card-accent/50 pl-4",
        block.type === "caption" &&
          (block.text.startsWith("SECTION")
            ? "mt-3 first:mt-0 border-l-2 border-card-accent pl-3 font-semibold text-card-foreground not-italic normal-case tracking-normal"
            : "font-mono text-[11px] uppercase tracking-[0.1em] text-card-muted-foreground"),
        block.type === "bullet" &&
          (block.text.startsWith("☐")
            ? "rounded-lg border border-border bg-muted px-3 py-2"
            : ""),
      )}
    >
      {renderFormattedText(block.text)}
    </p>
  );
}

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
  const result = getFeatureShowcase(activeMode.id as AccessibilityMode);

  return (
    <section id="features" className="section-band scroll-mt-[4.25rem]">
      <div className="mx-auto max-w-6xl px-5 pt-12 pb-10 text-center sm:px-6 md:pt-16">
        <p className="section-eyebrow">Accessibility modes</p>
        <h2 className="section-title">One lesson, transformed four ways</h2>
        <p className="section-description">
          Scroll to see one lesson in four accessible formats.
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
                    x: activeIndex === i ? 0 : -6,
                  }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    "rounded-2xl border p-5 transition-shadow duration-300 md:p-6",
                    activeIndex === i
                      ? "surface-card border-white/25"
                      : "border-transparent bg-transparent",
                  )}
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold shadow-sm",
                        mode.theme.icon,
                      )}
                    >
                      {mode.icon}
                    </span>
                    <div>
                      <h3
                        className={cn(
                          "text-[16px] font-semibold tracking-[-0.02em]",
                          activeIndex === i
                            ? "text-card-foreground"
                            : "text-foreground",
                        )}
                      >
                        {FEATURE_MODE_BLURBS[mode.id].title}
                      </h3>
                      <p
                        className={cn(
                          "mt-0.5 text-[13px] leading-snug",
                          activeIndex === i
                            ? "text-card-muted-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {FEATURE_MODE_BLURBS[mode.id].blurb}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="relative">
              <div className="absolute -inset-3 rounded-3xl bg-primary/6 blur-2xl" />
              <motion.div
                layout
                className="surface-elevated relative rounded-2xl p-6 md:p-8"
              >
                <div className="mb-4 flex items-center gap-2 text-[12px] font-medium text-card-muted-foreground">
                  <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[10px] tracking-wider">
                    INPUT
                  </span>
                  <span className="truncate">{FEATURES_INPUT}</span>
                </div>

                <div
                  className={cn(
                    "mb-5 h-1 rounded-full",
                    activeMode.theme.accent,
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
                    <p className="text-[14px] font-semibold tracking-[-0.01em] text-card-foreground">
                      {result.modeLabel}
                    </p>
                    {result.blocks.map((block, i) => (
                      <ShowcaseBlock key={`${activeMode.id}-${i}`} block={block} />
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
