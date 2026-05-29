"use client";

import { useEffect, useState } from "react";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "adapted-demo-tip-dismissed";

export function DemoTip() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  if (!visible) return null;

  return (
    <div
      className="flex flex-col gap-3 rounded-xl border border-card-border/80 border-l-4 border-l-primary bg-card px-4 py-3.5 shadow-[var(--shadow-soft)] sm:flex-row sm:items-center sm:justify-between"
      role="status"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15">
          <Sparkles className="size-4 text-primary" aria-hidden />
        </span>
        <p className="text-[14px] leading-relaxed text-card-foreground">
          <span className="font-semibold text-card-accent">Quick start:</span>{" "}
          use <span className="font-medium">Example</span>, then switch modes on
          the right — Dyslexia, ADHD, APD, and Autism each change the structure.
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={dismiss}
        className="shrink-0 border-card-border text-card-foreground"
        aria-label="Dismiss tip"
      >
        <X className="size-3.5" />
        Got it
      </Button>
    </div>
  );
}
