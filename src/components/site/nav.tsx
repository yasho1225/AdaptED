"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, Wind, X } from "lucide-react";
import { useMotion } from "@/components/motion/motion-provider";
import { cn } from "@/lib/utils";

const LINKS = [
  ["#how", "How it works"],
  ["#versions", "Versions"],
  ["#research", "Research"],
] as const;

/** The mark: a worksheet's lines with one on a highlighter's chisel stroke (same drawing as the favicon). */
export function Logomark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("size-8 shrink-0", className)}>
      <rect width="32" height="32" rx="8" className="fill-surface-3" />
      <rect x="7" y="8" width="18" height="3" className="fill-ink" />
      <polygon points="7.5,13 27,13 24.5,19 5,19" className="fill-yellow" />
      <rect x="8.5" y="14.5" width="12" height="3" className="fill-on-brand" />
      <rect x="7" y="21.5" width="11" height="3" className="fill-ink" />
    </svg>
  );
}

/** Mark plus wordmark; "ED" carries the highlighter colour. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Logomark />
      <span className="font-display text-[1.5rem] leading-none font-extrabold tracking-[-0.01em] [font-stretch:86%]">
        Adapt<span className="text-yellow">ED</span>
      </span>
    </span>
  );
}

/** Which section is on screen, for the nav's active link. */
function useCurrentSection() {
  const [current, setCurrent] = useState<string | null>(null);
  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>("main > section")];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setCurrent((e.target as HTMLElement).id || null);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);
  return current;
}

/** A plain bar: mark, three links, Calm mode, one action. On phones the links move into a menu. */
export function Nav() {
  const { calm, setCalm } = useMotion();
  const current = useCurrentSection();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // An open menu takes focus, and closes on Escape, on a tap outside, or when the screen widens.
  useEffect(() => {
    if (!open) return;
    menuRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    const close = (refocus: boolean) => {
      setOpen(false);
      if (refocus) buttonRef.current?.focus();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close(true);
    const onPointer = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!menuRef.current?.contains(t) && !buttonRef.current?.contains(t)) close(false);
    };
    const wide = window.matchMedia("(min-width: 768px)");
    const onWide = () => wide.matches && close(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    wide.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      wide.removeEventListener("change", onWide);
    };
  }, [open]);

  const calmToggle = (full: boolean) => (
    <button
      type="button"
      onClick={() => setCalm(!calm)}
      aria-pressed={calm}
      className={cn("btn btn-ghost btn-sm", full ? "w-full justify-start" : "!px-3.5")}
      title="Calm mode turns off smooth scrolling and animations"
    >
      <Wind className={cn("size-4", calm && "text-brand")} aria-hidden />
      <span className={full ? "" : "hidden lg:inline"}>Calm mode</span>
      {!full && <span className="sr-only lg:hidden">Calm mode</span>}
    </button>
  );

  return (
    <header className="no-print sticky top-0 z-50 bg-canvas/85 backdrop-blur-md">
      <a href="#studio" className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:font-bold focus:text-canvas">
        Skip to the studio
      </a>
      <div className="container-page flex h-16 items-center justify-between gap-3">
        <a href="#top" aria-label="AdaptED home" className="-mx-1 inline-flex min-h-11 items-center px-1">
          <Logo />
        </a>
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {LINKS.map(([href, label]) => {
            const on = current === href.slice(1);
            return (
              <a
                key={href}
                href={href}
                aria-current={on ? "location" : undefined}
                className={cn(
                  "relative inline-flex min-h-11 items-center px-3.5 text-base font-bold transition-colors duration-200",
                  "after:absolute after:inset-x-3.5 after:bottom-1.5 after:h-[3px] after:origin-left after:bg-brand after:transition-transform after:duration-200 after:ease-[var(--ease-out)]",
                  on ? "text-ink after:scale-x-100" : "text-ink-2 after:scale-x-0 hover:text-ink",
                )}
              >
                {label}
              </a>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden md:block">{calmToggle(false)}</div>
          <a href="#studio" className="btn btn-brand btn-sm">
            Try it
          </a>
          <button
            ref={buttonRef}
            type="button"
            className="btn btn-ghost btn-sm !px-3 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
            <span className="sr-only">Menu</span>
          </button>
        </div>
      </div>
      {open && (
        <div ref={menuRef} id="mobile-menu" className="absolute inset-x-0 top-full animate-[menu-in_200ms_var(--ease-out)] bg-surface pb-6 md:hidden">
          <nav aria-label="Main" className="container-page flex flex-col pt-2">
            {LINKS.map(([href, label]) => (
              <a key={href} href={href} onClick={() => setOpen(false)} aria-current={current === href.slice(1) ? "location" : undefined} className="flex min-h-14 items-center text-xl font-bold text-ink aria-[current=location]:text-brand">
                {label}
              </a>
            ))}
            <div className="mt-4">{calmToggle(true)}</div>
          </nav>
        </div>
      )}
    </header>
  );
}
