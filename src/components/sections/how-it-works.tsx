"use client";

import { motion } from "framer-motion";
import { HOW_IT_WORKS } from "@/lib/constants";
import { Upload, SlidersHorizontal, Zap } from "lucide-react";

const icons = [Upload, SlidersHorizontal, Zap];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-[4.25rem] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <p className="section-eyebrow">How it works</p>
          <h2 className="section-title">Three steps. Zero friction.</h2>
        </motion.div>

        <div className="mt-14 grid gap-5 md:grid-cols-3 md:gap-6">
          {HOW_IT_WORKS.map((item, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  delay: i * 0.08,
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="surface-card relative rounded-2xl p-7 md:p-8"
              >
                <span
                  className="text-4xl font-bold tabular-nums tracking-[-0.04em] text-primary/45"
                  aria-hidden
                >
                  {item.step}
                </span>
                <div className="mt-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-soft)]">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-6 text-[17px] font-semibold tracking-[-0.02em]">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-[14px] leading-7 text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
