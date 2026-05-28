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
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => onChange(mode.id)}
              aria-pressed={isActive}
              className={cn(
                "relative rounded-xl border px-3.5 py-3.5 text-left transition-all duration-200",
                isActive
                  ? "border-border bg-card shadow-[0_4px_20px_rgba(15,23,42,0.08)] ring-2 ring-teal-500/20"
                  : "border-border/70 bg-card/60 hover:border-border hover:bg-card hover:shadow-sm",
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="mode-card-indicator"
                  className={cn(
                    "absolute inset-0 rounded-xl bg-gradient-to-br opacity-[0.07]",
                    mode.color,
                  )}
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
              <span
                className={cn(
                  "relative mb-2.5 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br text-xs font-semibold text-white shadow-sm",
                  mode.color,
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
    <div className="flex flex-wrap gap-1 rounded-xl border border-border/60 bg-muted/40 p-1">
      {MODES.map((mode) => {
        const isActive = active === mode.id;
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
                className="absolute inset-0 rounded-lg bg-card shadow-sm ring-1 ring-black/[0.04]"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            )}
            <span className="relative">{mode.shortLabel}</span>
          </button>
        );
      })}
    </div>
  );
}
