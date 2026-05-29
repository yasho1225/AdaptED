"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { TransformResult } from "@/lib/types";
import { renderFormattedText } from "@/lib/render-text";
import { getFallbackBannerMessage } from "@/lib/fallback-messages";
import { cn } from "@/lib/utils";
import { Download, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadTransformResult } from "@/lib/export-transform";
import type { AccessibilityMode } from "@/lib/types";

interface TransformOutputProps {
  result: TransformResult;
  modeSlug: AccessibilityMode;
  canDownload?: boolean;
  modeIcon: string;
  modeAccent: string;
  modeTint?: string;
  modeBorder?: string;
}

const blockStyles: Record<string, string> = {
  title:
    "text-[17px] font-semibold tracking-[-0.02em] leading-snug text-card-foreground",
  chunk:
    "text-[15px] leading-7 text-card-foreground py-2.5 border-b border-border/50 last:border-0",
  key: "rounded-xl bg-card-accent/5 border border-card-accent/15 px-4 py-3 text-[14px] font-medium leading-relaxed text-card-foreground",
  step: "flex gap-3 text-[14px] leading-relaxed text-card-foreground",
  bullet: "text-[14px] leading-7 text-card-foreground pl-1",
  caption:
    "font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-card-muted-foreground",
  describe:
    "rounded-xl bg-muted border border-border px-4 py-3 text-[14px] leading-7 text-card-foreground",
  note: "text-[14px] leading-relaxed text-card-muted-foreground italic",
};

function modeSurfaceClass(modeSlug: AccessibilityMode): string {
  switch (modeSlug) {
    case "dyslexia":
      return "rounded-xl border border-mode-dyslexia-border bg-mode-dyslexia-muted/45 p-4 space-y-3";
    case "adhd":
      return "rounded-xl border-2 border-dashed border-mode-adhd-border bg-mode-adhd-muted/60 p-3 space-y-2";
    case "apd":
      return "rounded-xl border border-mode-apd-border bg-mode-apd-muted/50 p-4 space-y-3";
    case "autism":
      return "rounded-xl border-2 border-mode-autism-border bg-mode-autism-muted/40 p-4 space-y-3";
  }
}

function modeBlockClass(
  modeSlug: AccessibilityMode,
  blockType: string,
  text: string,
): string {
  if (modeSlug === "dyslexia") {
    if (blockType === "chunk") {
      return "rounded-lg border border-mode-dyslexia-border bg-card px-4 py-3 text-[17px] leading-[1.85] tracking-wide shadow-sm last:!border-b";
    }
    if (blockType === "key") {
      return "rounded-lg border-2 border-mode-dyslexia-border bg-mode-dyslexia-muted/70 px-4 py-3 text-[15px] font-medium leading-relaxed shadow-sm";
    }
    if (blockType === "bullet") {
      return "rounded-lg border border-mode-dyslexia-border/80 bg-card px-3 py-2 text-[16px] leading-8";
    }
    if (blockType === "title") {
      return "rounded-lg border border-mode-dyslexia-border bg-card px-3 py-2 text-[19px] font-semibold mb-0";
    }
    if (blockType === "note") {
      return "rounded-md border border-dashed border-mode-dyslexia-border/70 bg-card/70 px-3 py-2 text-[13px] not-italic";
    }
  }

  if (modeSlug === "adhd") {
    if (blockType === "step") {
      return "rounded-lg border-2 border-mode-adhd-border bg-card px-3 py-2.5 font-medium shadow-sm";
    }
    if (blockType === "bullet" && (text.startsWith("☐") || text.startsWith("[ ]"))) {
      return "rounded-lg border-2 border-mode-adhd bg-mode-adhd-muted px-3 py-2 font-medium";
    }
    if (blockType === "title") return "text-mode-adhd";
  }

  if (modeSlug === "apd") {
    if (blockType === "caption") {
      return "rounded-md border-l-4 border-l-mode-apd bg-card px-3 py-1.5 font-bold text-mode-apd not-italic normal-case tracking-normal";
    }
    if (blockType === "bullet") return "pl-2 font-medium";
    if (blockType === "key") return "border-l-4 border-l-mode-apd";
  }

  if (modeSlug === "autism") {
    if (blockType === "caption" && text.startsWith("SECTION")) {
      return "mt-5 first:mt-0 rounded-lg bg-card border border-mode-autism-border px-3 py-2 font-bold text-card-foreground not-italic normal-case tracking-normal";
    }
    if (blockType === "chunk" || blockType === "step") {
      return "rounded-lg border border-mode-autism-border bg-card px-3 py-2.5";
    }
    if (blockType === "bullet") return "bg-card/80 rounded-md px-2 py-1";
  }

  return "";
}

export function TransformOutput({
  result,
  modeSlug,
  canDownload = false,
  modeIcon,
  modeAccent,
  modeTint,
  modeBorder,
}: TransformOutputProps) {
  const fallbackMessage = getFallbackBannerMessage(result.fallbackReason);

  return (
    <div className={cn("flex h-full flex-col", modeSurfaceClass(modeSlug))}>
      {fallbackMessage && (
        <div
          className="alert-warning mb-4 flex gap-2 rounded-lg px-3 py-2.5"
          role="status"
        >
          <Info className="mt-0.5 size-4 shrink-0 text-warning-foreground" aria-hidden />
          <span>{fallbackMessage}</span>
        </div>
      )}
      {result.source === "gemini" && (
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-card-accent">
          AI-enhanced
        </p>
      )}
      <div className="mb-5 flex items-start justify-between gap-3 border-b border-border/50 pb-4">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={cn("mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full", modeAccent)}
          />
          <div className="min-w-0">
            <p className="text-[15px] font-semibold tracking-[-0.01em] text-card-foreground">
              {result.modeLabel}
            </p>
            <p className="mt-0.5 text-[13px] leading-snug text-card-muted-foreground">
              {result.modeDescription}
            </p>
          </div>
        </div>
        {canDownload && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 gap-1.5 font-medium"
            onClick={() => void downloadTransformResult(result, modeSlug)}
          >
            <Download className="size-3.5" aria-hidden />
            Download
          </Button>
        )}
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
                modeBlockClass(modeSlug, block.type, block.text),
                block.type === "step" && "flex items-start gap-3",
                block.type === "bullet" &&
                  (block.text.startsWith("☐") || block.text.startsWith("[ ]")) &&
                  cn(
                    "rounded-lg border px-3 py-2",
                    modeTint ?? "bg-muted",
                    modeBorder ?? "border-border",
                  ),
                block.type === "caption" &&
                  block.text.startsWith("SECTION") &&
                  "mt-4 first:mt-0 border-l-2 border-l-card-accent pl-3 font-semibold text-card-foreground",
              )}
            >
              {block.type === "step" && (
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-semibold",
                    modeIcon,
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
