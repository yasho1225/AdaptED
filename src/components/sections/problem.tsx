"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Clock3, UserRoundCheck } from "lucide-react";

const painPoints = [
  {
    icon: AlertTriangle,
    title: "One format excludes many learners",
    description:
      "Traditional assignments assume every student processes information the same way.",
  },
  {
    icon: Clock3,
    title: "Teachers lose hours adapting manually",
    description:
      "Accessibility support often means late-night rewriting, reformatting, and simplification.",
  },
  {
    icon: UserRoundCheck,
    title: "Students are labeled instead of supported",
    description:
      "The assignment stays rigid, and students are expected to adapt to it.",
  },
];

export function Problem() {
  return (
    <section
      id="problem"
      className="scroll-mt-[4.25rem] border-t border-white/10 pt-10 pb-16 md:pt-14 md:pb-20"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <p className="section-eyebrow">The problem</p>
          <h2 className="section-title">Education often asks students to adapt first</h2>
          <p className="section-description max-w-3xl">
            AdaptED flips that model. We don&apos;t change the student. We adapt
            the assignment, instantly, so more learners can engage confidently.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 md:grid-cols-3 md:gap-6">
          {painPoints.map((item, i) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className="surface-card-interactive rounded-2xl p-6"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-card-accent text-white shadow-[var(--shadow-soft)]">
                <item.icon className="size-4.5" />
              </span>
              <h3 className="mt-4 text-[17px] font-semibold tracking-[-0.02em] text-card-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-[14px] leading-7 text-card-muted-foreground">
                {item.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
