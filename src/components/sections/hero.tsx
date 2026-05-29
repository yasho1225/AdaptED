"use client";

import { MODES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export function Hero() {
  return (
    <section
      className="relative overflow-hidden pt-24 pb-5 md:pt-28 md:pb-7"
      aria-labelledby="hero-heading"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, oklch(1 0 0 / 0.1) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute -top-24 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>

      <div className="mx-auto grid max-w-6xl items-start gap-8 px-5 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10">
        <div className="text-center lg:text-left">
          <motion.h1
            id="hero-heading"
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mx-auto max-w-2xl text-[2.35rem] font-bold leading-[1.05] tracking-[-0.045em] sm:text-5xl lg:mx-0 lg:max-w-none lg:text-[3.5rem] lg:leading-[1.02]"
          >
            Education should adapt to students
            <span className="text-primary"> — not the other way around.</span>
          </motion.h1>

          <motion.p
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mx-auto mt-5 max-w-2xl text-lg font-medium leading-8 text-foreground md:text-xl lg:mx-0"
          >
            AdaptED instantly transforms lessons into accessible formats for
            different learning needs.
          </motion.p>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-[17px] md:leading-8 lg:mx-0"
          >
            Upload any worksheet, PDF, notes, or assignment and instantly adapt
            it for different students.
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
          >
            <a href="#demo" className="btn-primary group w-full gap-2 sm:w-auto">
              Try live demo
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a href="#features" className="btn-secondary w-full sm:w-auto">
              See all modes
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-lg justify-self-center lg:max-w-[440px]"
        >
          <div className="absolute -inset-4 rounded-3xl bg-primary/8 blur-2xl" />

          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="surface-elevated relative overflow-hidden rounded-2xl"
          >
            <div className="flex items-center gap-2 border-b border-card-border/80 bg-[oklch(0.975_0.014_252)] px-4 py-3">
              <span className="size-2.5 rounded-full bg-red-400/90" aria-hidden />
              <span className="size-2.5 rounded-full bg-amber-400/90" aria-hidden />
              <span className="size-2.5 rounded-full bg-emerald-400/90" aria-hidden />
              <span className="ml-2 text-[12px] font-medium text-card-muted-foreground">
                AdaptED · Live preview
              </span>
            </div>

            <div className="grid gap-0 sm:grid-cols-2">
              <div className="border-b border-card-border/70 bg-card p-4 sm:border-b-0 sm:border-r">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-card-muted-foreground">
                  Original
                </p>
                <p className="mt-2 text-[13px] leading-6 text-card-muted-foreground">
                  Photosynthesis is the process by which green plants use sunlight
                  to make food. Chlorophyll captures light energy…
                </p>
              </div>

              <div className="mode-tint-dyslexia border-l-2 border-l-mode-dyslexia-border p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-card-muted-foreground">
                    Dyslexia mode
                  </p>
                  <span className="rounded-full border border-mode-dyslexia-border bg-card px-2 py-0.5 text-[10px] font-semibold text-card-foreground">
                    Adapted
                  </span>
                </div>
                <div className="mt-2 space-y-2">
                  <p className="text-[14px] font-medium leading-snug text-card-foreground">
                    Plants make food using sunlight.
                  </p>
                  <p className="text-[13px] leading-6 text-card-foreground">
                    This is called <strong>photosynthesis</strong>.
                  </p>
                  <p className="text-[13px] leading-6 text-card-foreground">
                    Leaves use <strong>chlorophyll</strong> to catch light.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-card-border/80 bg-[oklch(0.975_0.014_252)] px-4 py-3">
              <div className="flex flex-wrap gap-1.5">
                {MODES.map((mode, i) => (
                  <span
                    key={mode.id}
                    className={cn(
                      "rounded-md px-2 py-0.5 text-[10px] font-semibold",
                      i === 0
                        ? cn("shadow-sm", mode.theme.icon)
                        : "bg-card text-card-muted-foreground ring-1 ring-card-border/90",
                    )}
                  >
                    {mode.shortLabel}
                  </span>
                ))}
              </div>
              <span className="text-[11px] font-medium text-card-accent">
                Switch mode → instant rewrite
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
