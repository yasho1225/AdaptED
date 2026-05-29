"use client";

import { motion } from "framer-motion";
import { ArrowUp, Upload, SlidersHorizontal, Zap } from "lucide-react";
import { FEATURE_MODE_BLURBS, HOW_IT_WORKS, MODES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const stepIcons = [Upload, SlidersHorizontal, Zap];

/** Single lightweight section after the live demo — no competing scroll experience. */
export function PostDemoBrief() {
  return (
    <section
      id="features"
      className="scroll-mt-[4.25rem] border-t border-white/10 py-16 md:py-20"
      aria-labelledby="modes-brief-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="section-eyebrow">What each mode does</p>
          <h2
            id="modes-brief-heading"
            className="section-title text-2xl md:text-[2.25rem]"
          >
            Same lesson — four learning experiences
          </h2>
          <p className="section-description mt-4 text-base">
            You just saw the live transform. Each mode changes structure and
            reading load, not just vocabulary.
          </p>
        </motion.div>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {MODES.map((mode, i) => {
            const blurb = FEATURE_MODE_BLURBS[mode.id];
            const { theme } = mode;
            return (
              <motion.li
                key={mode.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.35 }}
              >
                <a
                  href="#demo"
                  className={cn(
                    "surface-card-static interactive-hover flex h-full flex-col rounded-xl p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    "ring-1 ring-inset",
                    theme.border,
                  )}
                >
                  <span
                    className={cn(
                      "mb-3 flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold text-white",
                      theme.icon,
                    )}
                  >
                    {mode.icon}
                  </span>
                  <span className="text-[15px] font-semibold text-card-foreground">
                    {blurb.title}
                  </span>
                  <span className="mt-1 text-[13px] leading-snug text-card-muted-foreground">
                    {blurb.blurb}
                  </span>
                </a>
              </motion.li>
            );
          })}
        </ul>

        <div
          id="how-it-works"
          className="demo-shell mt-14 scroll-mt-[4.25rem] !p-6 md:!p-8"
        >
          <h3 className="text-center text-[15px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            How it works
          </h3>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {HOW_IT_WORKS.map((item, i) => {
              const Icon = stepIcons[i];
              return (
                <li key={item.step} className="text-center md:text-left">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-card text-card-accent shadow-sm">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <p className="mt-3 text-[11px] font-bold tabular-nums text-primary">
                    {item.step}
                  </p>
                  <p className="mt-1 text-[15px] font-semibold text-foreground">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>

        <p className="mt-10 flex flex-col items-center gap-3 text-center">
          <span className="text-[14px] font-medium text-muted-foreground">
            4 accessibility modes · under 30 seconds · no sign-up
          </span>
          <a href="#demo" className="btn-secondary inline-flex gap-2">
            <ArrowUp className="size-4" aria-hidden />
            Back to live demo
          </a>
        </p>
      </div>
    </section>
  );
}
