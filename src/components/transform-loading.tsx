"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface TransformLoadingProps {
  modeLabel: string;
}

export function TransformLoading({ modeLabel }: TransformLoadingProps) {
  return (
    <div
      className="flex h-full min-h-[220px] flex-col items-center justify-center gap-5 rounded-xl border border-dashed border-card-border/80 bg-muted/30 py-10"
      aria-busy="true"
      aria-live="polite"
    >
      <motion.span
        className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles className="size-5 text-primary" aria-hidden />
      </motion.span>
      <div className="text-center">
        <p className="text-[15px] font-semibold tracking-[-0.02em] text-card-foreground">
          Adapting for {modeLabel}…
        </p>
        <p className="mt-1.5 text-[13px] text-card-muted-foreground">
          Restructuring content for this learning need
        </p>
      </div>
      <div className="w-full max-w-[280px] space-y-2.5 px-4">
        {[100, 82, 94].map((w, i) => (
          <motion.div
            key={i}
            className="h-2.5 overflow-hidden rounded-full bg-card-border/50"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.45, 0.9, 0.45] }}
            transition={{
              duration: 1.1,
              repeat: Infinity,
              delay: i * 0.12,
            }}
          >
            <motion.div
              className="h-full rounded-full bg-primary/50"
              animate={{ width: ["30%", `${w}%`, "30%"] }}
              transition={{
                duration: 1.1,
                repeat: Infinity,
                delay: i * 0.12,
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
