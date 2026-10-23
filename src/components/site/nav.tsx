"use client";

import { Wind } from "lucide-react";
import { useMotion } from "@/components/motion/motion-provider";
import { cn } from "@/lib/utils";

/** The wordmark: "ED" sits on a highlighter stroke, the site's one motif at text size. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("font-display text-[1.5rem] leading-none font-extrabold tracking-[-0.01em] [font-stretch:86%]", className)}>
      Adapt
      <span className="chisel ml-[0.06em] inline-block bg-yellow px-[0.22em] pt-[0.06em] pb-[0.02em] text-[#0a1b52] [--cut:0.2em]">ED</span>
    </span>
  );
}

/** A plain bar: wordmark, three links, Calm mode, one action. */
export function Nav() {
  const { calm, setCalm } = useMotion();
  return (
    <header className="field-blue no-print sticky top-0 z-50">
      <a href="#studio" className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:font-bold focus:text-[#0a1b52]">
        Skip to the studio
      </a>
      <div className="container-page flex h-16 items-center justify-between gap-3">
        <a href="#top" aria-label="AdaptED home" className="-mx-1 inline-flex min-h-11 items-center px-1">
          <Logo />
        </a>
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {[
            ["#studio", "Studio"],
            ["#how", "How it works"],
            ["#research", "Research"],
          ].map(([href, label]) => (
            <a key={href} href={href} className="inline-flex min-h-11 items-center px-3.5 text-base font-bold text-ink-2 underline decoration-transparent decoration-2 underline-offset-[0.45em] transition-colors hover:text-ink hover:decoration-brand">
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCalm(!calm)}
            aria-pressed={calm}
            className="btn btn-ghost btn-sm !px-3.5"
            title="Calm mode turns off smooth scrolling and animations"
          >
            <Wind className="size-4" aria-hidden />
            <span className="hidden sm:inline">Calm mode{calm ? ": on" : ""}</span>
            <span className="sr-only sm:hidden">Calm mode</span>
          </button>
          <a href="#studio" className="btn btn-brand btn-sm hidden sm:inline-flex">
            Try it
          </a>
        </div>
      </div>
    </header>
  );
}
