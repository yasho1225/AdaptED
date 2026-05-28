"use client";

import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap } from "lucide-react";

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
    <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, oklch(0.85 0.01 247) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute -top-24 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-br from-teal-400/20 via-indigo-400/15 to-violet-500/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div className="text-center lg:text-left">
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
            <Badge
              variant="secondary"
              className="mb-6 gap-1.5 rounded-full border border-teal-200/80 bg-teal-50 px-4 py-1.5 text-[13px] font-medium text-teal-800 shadow-sm"
            >
              <Sparkles className="size-3.5 text-teal-600" />
              Built for K–12 teachers · Demo ready
            </Badge>
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mx-auto max-w-xl text-[2.35rem] font-semibold leading-[1.06] tracking-[-0.04em] sm:text-5xl lg:mx-0 lg:max-w-none lg:text-[3.25rem] lg:leading-[1.05]"
          >
            Turn one lesson into{" "}
            <span className="gradient-text">four accessible versions</span>
            <span className="text-foreground">—in seconds.</span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted-foreground md:text-lg md:leading-8 lg:mx-0"
          >
            Paste or upload any assignment. AdaptED instantly reshapes it for
            dyslexia, autism, visual impairment, and hearing impairment—so every
            student gets material they can actually use.
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

          <motion.ul
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[13px] font-medium text-muted-foreground lg:justify-start"
          >
            {[
              { icon: Zap, text: "Under 30 seconds" },
              { icon: null, text: "4 accessibility modes" },
              { icon: null, text: "No setup required" },
            ].map((item) => (
              <li key={item.text} className="flex items-center gap-2">
                {item.icon ? (
                  <item.icon className="size-3.5 text-teal-600" aria-hidden />
                ) : (
                  <span
                    className="size-1.5 rounded-full bg-teal-500"
                    aria-hidden
                  />
                )}
                {item.text}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-lg lg:max-w-none"
        >
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-teal-500/15 via-indigo-500/10 to-violet-500/15 blur-2xl" />

          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_24px_60px_rgba(15,23,42,0.12)] ring-1 ring-black/[0.04]"
          >
            <div className="flex items-center gap-2 border-b border-border/70 bg-muted/50 px-4 py-3">
              <span className="size-2.5 rounded-full bg-red-400/90" />
              <span className="size-2.5 rounded-full bg-amber-400/90" />
              <span className="size-2.5 rounded-full bg-emerald-400/90" />
              <span className="ml-2 text-[12px] font-medium text-muted-foreground">
                AdaptED · Live preview
              </span>
            </div>

            <div className="grid gap-0 sm:grid-cols-2">
              <div className="border-b border-border/60 p-4 sm:border-b-0 sm:border-r">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Original
                </p>
                <p className="mt-2 text-[13px] leading-6 text-foreground/80">
                  Photosynthesis is the process by which green plants use sunlight
                  to make food. Chlorophyll captures light energy…
                </p>
              </div>

              <div className="bg-gradient-to-br from-violet-50/80 to-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-violet-700">
                    Dyslexia mode
                  </p>
                  <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-800">
                    Adapted
                  </span>
                </div>
                <div className="mt-2 space-y-2">
                  <p className="text-[14px] font-medium leading-snug text-foreground">
                    Plants make food using sunlight.
                  </p>
                  <p className="text-[13px] leading-6 text-foreground/85">
                    This is called <strong>photosynthesis</strong>.
                  </p>
                  <p className="text-[13px] leading-6 text-foreground/85">
                    Leaves use <strong>chlorophyll</strong> to catch light.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 bg-muted/30 px-4 py-3">
              <div className="flex gap-1.5">
                {["Dyslexia", "Autism", "Visual", "Hearing"].map((mode, i) => (
                  <span
                    key={mode}
                    className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                      i === 0
                        ? "bg-violet-600 text-white shadow-sm"
                        : "bg-background text-muted-foreground ring-1 ring-border/80"
                    }`}
                  >
                    {mode}
                  </span>
                ))}
              </div>
              <span className="text-[11px] font-medium text-teal-700">
                Switch mode → instant rewrite
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
