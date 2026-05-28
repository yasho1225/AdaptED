"use client";

import { motion } from "framer-motion";
import { IMPACT_STATS } from "@/lib/constants";
import { Card } from "@/components/ui/card";

export function Impact() {
  return (
    <section id="impact" className="scroll-mt-[4.25rem] bg-muted/30 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <p className="section-eyebrow text-indigo-600">Why it matters</p>
          <h2 className="section-title">Every student deserves access</h2>
          <p className="section-description max-w-xl">
            Teachers shouldn&apos;t choose between time and inclusion. AdaptED
            makes accessible materials the default—not the exception.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {IMPACT_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06, duration: 0.45 }}
            >
              <Card className="h-full gap-0 border-border/70 bg-card py-0 shadow-[0_4px_20px_rgba(15,23,42,0.05)] ring-1 ring-black/[0.03] transition-shadow duration-200 hover:shadow-[0_8px_28px_rgba(15,23,42,0.08)]">
                <div className="p-6 text-center">
                  <p className="text-3xl font-semibold tracking-[-0.03em] gradient-text md:text-[2rem]">
                    {stat.value}
                  </p>
                  <p className="mt-3 text-[14px] font-medium leading-snug text-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
                    {stat.source}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
