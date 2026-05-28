"use client";

import { motion } from "framer-motion";
import type { AccessibilityMode } from "@/lib/types";
import { MODES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ModeSelectorProps {
  active: AccessibilityMode;
  onChange: (mode: AccessibilityMode) => void;
  variant?: "tabs" | "cards";
}

const modeIconBg: Record<AccessibilityMode, string> = {
  dyslexia: "bg-mode-dyslexia",
  adhd: "bg-mode-adhd",
  apd: "bg-mode-apd",
  autism: "bg-mode-autism",
};

export function ModeSelector({
  active,
  onChange,
  variant = "tabs",
}: ModeSelectorProps) {
  if (variant === "cards") {
    return (
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
        {MODES.map((mode) => {
          const isActive = active === mode.id;
          const { theme } = mode;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => onChange(mode.id)}
              aria-pressed={isActive}
              className={cn(
                "relative overflow-hidden rounded-xl border px-3.5 py-3.5 text-left transition-shadow duration-200",
                isActive
                  ? cn(
                      "border shadow-[var(--shadow-soft)] ring-2 ring-offset-2 ring-offset-background",
                      theme.surface,
                      theme.border,
                      theme.ring,
                    )
                  : "border-border/80 bg-card hover:border-border hover:shadow-[var(--shadow-soft)]",
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="mode-card-indicator"
                  className={cn("absolute inset-0 rounded-xl", theme.surface)}
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
              <span
                className={cn(
                  "relative mb-2.5 flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold text-white shadow-sm",
                  modeIconBg[mode.id],
                )}
              >
                {mode.icon}
              </span>
              <span className="relative block text-[14px] font-semibold tracking-[-0.01em] text-foreground">
                {mode.shortLabel}
              </span>
              <span className="relative mt-0.5 hidden text-[12px] leading-snug text-muted-foreground sm:block">
                {mode.description.split(".")[0]}.
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1 rounded-xl border border-border/70 bg-muted/50 p-1">
      {MODES.map((mode) => {
        const isActive = active === mode.id;
        const { theme } = mode;
        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => onChange(mode.id)}
            aria-pressed={isActive}
            className={cn(
              "relative rounded-lg px-3 py-2 text-[13px] font-medium transition-colors duration-200",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {isActive && (
              <motion.div
                layoutId="mode-tab-indicator"
                className={cn(
                  "absolute inset-0 rounded-lg border shadow-sm",
                  theme.surface,
                  theme.border,
                )}
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            )}
            <span className="relative flex items-center gap-1.5">
              {isActive && (
                <span
                  className={cn("size-1.5 shrink-0 rounded-full", modeIconBg[mode.id])}
                />
              )}
              {mode.shortLabel}
            </span>
          </button>
        );
      })}
    </div>
  );
}
