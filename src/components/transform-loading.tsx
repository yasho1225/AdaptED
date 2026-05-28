"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface TransformLoadingProps {
  modeLabel: string;
}

export function TransformLoading({ modeLabel }: TransformLoadingProps) {
  return (
    <div
      className="flex h-full min-h-[200px] flex-col items-center justify-center gap-4 py-8"
      aria-busy="true"
      aria-live="polite"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className="size-8 text-primary" />
      </motion.div>
      <div className="text-center">
        <p className="text-sm font-medium text-card-foreground">
          Adapting for {modeLabel}…
        </p>
        <p className="mt-1 text-xs text-card-muted-foreground">Adapting content…</p>
      </div>
      <div className="w-full max-w-xs space-y-2 px-4">
        {[92, 76, 88].map((w, i) => (
          <motion.div
            key={i}
            className="h-2.5 rounded-md bg-muted"
            initial={{ opacity: 0.4, scaleX: 0.6 }}
            animate={{ opacity: [0.4, 0.8, 0.4], scaleX: [0.6, 1, 0.6] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.15,
            }}
            style={{ width: `${w}%`, margin: "0 auto" }}
          />
        ))}
      </div>
    </div>
  );
}
