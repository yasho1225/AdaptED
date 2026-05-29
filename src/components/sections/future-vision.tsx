"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const roadmap = [
  "Student-facing delivery with personalized reading pathways",
  "Teacher dashboard insights on which formats improve engagement",
  "Curriculum-level adaptation across weekly lesson plans",
];

export function FutureVision() {
  return (
    <section id="future-vision" className="section-band scroll-mt-[4.25rem] py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="surface-elevated rounded-3xl p-7 md:p-10"
        >
          <p className="section-eyebrow">Future vision</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.03em] text-card-foreground md:text-4xl">
            From assignment adaptation to a full accessibility layer for classrooms
          </h2>
          <p className="mt-4 max-w-3xl text-[15px] leading-7 text-card-muted-foreground md:text-base">
            Today, AdaptED transforms one assignment in seconds. Next, it becomes
            the accessibility operating layer that helps every learner receive
            content in a format they can use with confidence.
          </p>

          <div className="mt-7 space-y-3">
            {roadmap.map((item) => (
              <div
                key={item}
                className="rounded-xl border border-border bg-muted px-4 py-3 text-[14px] text-card-foreground"
              >
                {item}
              </div>
            ))}
          </div>

          <a href="#demo" className="btn-primary mt-7 inline-flex gap-2">
            See the live transformation
            <ArrowRight className="size-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
