import { cn } from "@/lib/utils";

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
