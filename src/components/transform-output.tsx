"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { TransformResult } from "@/lib/types";
import { renderFormattedText } from "@/lib/render-text";
import { getFallbackBannerMessage } from "@/lib/fallback-messages";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

interface TransformOutputProps {
  result: TransformResult;
  modeColor: string;
}

const blockStyles: Record<string, string> = {
  title:
    "text-[17px] font-semibold tracking-[-0.02em] leading-snug text-foreground",
  chunk:
    "text-[15px] leading-7 text-foreground/90 py-2.5 border-b border-border/50 last:border-0",
  key: "rounded-xl bg-primary/5 border border-primary/15 px-4 py-3 text-[14px] font-medium leading-relaxed text-foreground",
  step: "flex gap-3 text-[14px] leading-relaxed text-foreground/90",
  bullet: "text-[14px] leading-7 text-foreground/85 pl-1",
  caption:
    "font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground",
  describe:
    "rounded-xl bg-blue-50/80 border border-blue-100 px-4 py-3 text-[14px] leading-7 text-foreground/90",
  note: "text-[14px] leading-relaxed text-muted-foreground italic",
};

export function TransformOutput({ result, modeColor }: TransformOutputProps) {
  const fallbackMessage = getFallbackBannerMessage(result.fallbackReason);

  return (
    <div className="flex h-full flex-col">
      {fallbackMessage && (
        <div
          className="mb-4 flex gap-2 rounded-lg border border-amber-200/80 bg-amber-50/90 px-3 py-2.5 text-[13px] leading-snug text-amber-950"
          role="status"
        >
          <Info className="mt-0.5 size-4 shrink-0 text-amber-700" aria-hidden />
          <span>{fallbackMessage}</span>
        </div>
      )}
      {result.source === "gemini" && (
        <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-teal-700/80">
          AI-enhanced
        </p>
      )}
      <div className="mb-5 flex items-start gap-3 border-b border-border/50 pb-4">
        <div
          className={cn(
            "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-to-r",
            modeColor,
          )}
        />
        <div>
          <p className="text-[15px] font-semibold tracking-[-0.01em] text-foreground">
            {result.modeLabel}
          </p>
          <p className="mt-0.5 text-[13px] leading-snug text-muted-foreground">
            {result.modeDescription}
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={result.modeLabel + result.blocks.length}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 space-y-3 overflow-y-auto pr-1"
        >
          {result.blocks.map((block, i) => (
            <motion.div
              key={`${block.type}-${i}`}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.025, duration: 0.22 }}
              className={cn(
                blockStyles[block.type] ?? blockStyles.chunk,
                block.type === "step" && "flex items-start gap-3",
              )}
            >
              {block.type === "step" && (
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br text-[10px] font-semibold text-white",
                    modeColor,
                  )}
                >
                  {block.text.match(/^Step (\d+)/)?.[1] ?? "•"}
                </span>
              )}
              <span
                className={
                  block.type === "step" ? "flex-1 pt-0.5 leading-7" : undefined
                }
              >
                {renderFormattedText(
                  block.type === "step"
                    ? block.text.replace(/^Step \d+:\s*/, "")
                    : block.text,
                )}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
