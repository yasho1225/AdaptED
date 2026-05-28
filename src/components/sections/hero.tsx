"use client";

import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-r from-teal-400/15 via-indigo-400/10 to-violet-400/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="mx-auto max-w-6xl px-5 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <Badge
            variant="secondary"
            className="mb-8 gap-1.5 rounded-full border border-border/80 bg-background px-4 py-1.5 text-[13px] font-medium text-muted-foreground shadow-sm"
          >
            <Sparkles className="size-3.5 text-teal-600" />
            Accessibility for every classroom
          </Badge>

          <h1 className="mx-auto max-w-4xl text-[2.5rem] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-5xl md:text-[3.5rem] md:leading-[1.06]">
            One lesson.{" "}
            <span className="gradient-text">Every learner.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
            Transform educational content into accessible formats instantly—for
            dyslexia, autism, visual impairment, and hearing impairment.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <a href="#features" className="btn-primary w-full sm:w-auto">
              Explore modes
            </a>
            <a href="#demo" className="btn-secondary w-full sm:w-auto">
              Try the demo
            </a>
          </div>

          <div className="mx-auto mt-12 flex max-w-lg flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] font-medium text-muted-foreground">
            <span>Input content</span>
            <span className="text-border" aria-hidden>
              →
            </span>
            <span>Choose mode</span>
            <span className="text-border" aria-hidden>
              →
            </span>
            <span>Adapted output</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-16 flex justify-center md:mt-20"
        >
          <a
            href="#features"
            className="flex flex-col items-center gap-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <span>Learn how it adapts</span>
            <ArrowDown className="size-4 animate-bounce motion-reduce:animate-none" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
