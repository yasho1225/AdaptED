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
          const { theme } = mode;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => onChange(mode.id)}
              aria-pressed={isActive}
              className={cn(
                "relative overflow-hidden rounded-xl border border-white/25 bg-card px-3.5 py-3.5 text-left text-card-foreground transition-shadow duration-200",
                isActive
                  ? cn("shadow-[var(--shadow-soft)] ring-2 ring-offset-2 ring-offset-background", theme.ring, theme.border)
                  : "hover:border-white/40 hover:shadow-[var(--shadow-soft)]",
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="mode-card-indicator"
                  className={cn("absolute inset-0 rounded-xl", theme.tint)}
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
              <span
                className={cn(
                  "relative mb-2.5 flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold shadow-sm",
                  theme.icon,
                )}
              >
                {mode.icon}
              </span>
              <span className="relative block text-[14px] font-semibold tracking-[-0.01em]">
                {mode.shortLabel}
              </span>
              <span className="relative mt-0.5 hidden text-[12px] leading-snug text-card-muted-foreground sm:block">
                {mode.description.split(".")[0]}.
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1 rounded-xl border border-border/80 bg-muted p-1">
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
                ? "text-card-foreground"
                : "text-card-muted-foreground hover:text-card-foreground",
            )}
          >
            {isActive && (
              <motion.div
                layoutId="mode-tab-indicator"
                className={cn(
                  "absolute inset-0 rounded-lg border bg-card shadow-sm",
                  theme.border,
                )}
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            )}
            <span className="relative flex items-center gap-1.5">
              {isActive && (
                <span className={cn("size-1.5 shrink-0 rounded-full", theme.icon)} />
              )}
              {mode.shortLabel}
            </span>
          </button>
        );
      })}
    </div>
  );
}
