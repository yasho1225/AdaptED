"use client";

import { Wind } from "lucide-react";
import { useMotion } from "@/components/motion/motion-provider";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("font-display text-xl font-semibold tracking-tight", className)}>
      Adapt<span className="ml-0.5 rounded-[0.2em] bg-brand px-[0.14em] text-on-brand">ED</span>
    </span>
  );
}

export function Nav() {
  const { calm, setCalm } = useMotion();
  return (
    <header className="no-print sticky top-0 z-50 border-b border-rule/70 bg-paper/80 backdrop-blur-md">
      <a href="#studio" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
        Skip to the studio
      </a>
      <div className="container-page flex h-16 items-center justify-between gap-3">
        <a href="#top" aria-label="AdaptED home" className="rounded">
          <Logo />
        </a>
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {[
            ["#studio", "Studio"],
            ["#how", "How it works"],
            ["#research", "Research"],
          ].map(([href, label]) => (
            <a key={href} href={href} className="rounded-full px-3.5 py-2 text-[0.95rem] font-semibold text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink">
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCalm(!calm)}
            aria-pressed={calm}
            className={cn("btn btn-sm !px-3", calm ? "btn-primary" : "btn-ghost")}
            title="Calm mode turns off smooth scrolling and animations"
          >
            <Wind className="size-4" aria-hidden />
            <span className="hidden sm:inline">Calm mode</span>
            <span className="sr-only sm:hidden">Calm mode</span>
          </button>
          <a href="#studio" className="btn btn-primary btn-sm hidden sm:inline-flex">
            Try it
          </a>
        </div>
      </div>
    </header>
  );
}
