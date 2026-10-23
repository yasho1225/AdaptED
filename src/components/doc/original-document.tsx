"use client";

import { forwardRef, useMemo } from "react";
import type { Barrier, NeedId } from "@/lib/adapt/types";
import { normalize } from "@/lib/adapt/analyze";
import { cn } from "@/lib/utils";

interface Range {
  start: number;
  end: number;
  index: number;
}

/** Non-overlapping highlight ranges for barrier quotes (earliest, then longest wins). */
export function barrierRanges(text: string, barriers: Barrier[]): Range[] {
  const found: Range[] = [];
  barriers.forEach((b, index) => {
    const at = text.indexOf(b.quote);
    if (at >= 0) found.push({ start: at, end: at + b.quote.length, index });
  });
  found.sort((a, b) => a.start - b.start || b.end - b.start - (a.end - a.start));
  const out: Range[] = [];
  for (const r of found) {
    if (out.length && r.start < out[out.length - 1].end) continue;
    out.push(r);
  }
  return out;
}

interface Props {
  text: string;
  barriers: Barrier[];
  need?: NeedId;
  /** index of barrier to emphasise (hover/focus from the list) */
  activeBarrier?: number | null;
  className?: string;
  showMarks?: boolean;
}

export const OriginalDocument = forwardRef<HTMLDivElement, Props>(function OriginalDocument(
  { text, barriers, need, activeBarrier = null, className, showMarks = true },
  ref,
) {
  const clean = useMemo(() => normalize(text).trim(), [text]);
  const ranges = useMemo(() => (showMarks ? barrierRanges(clean, barriers) : []), [clean, barriers, showMarks]);
  const shown = new Map(ranges.map((r, i) => [r.index, i + 1]));

  const pieces: React.ReactNode[] = [];
  let cursor = 0;
  ranges.forEach((r, i) => {
    if (r.start > cursor) pieces.push(clean.slice(cursor, r.start));
    const b = barriers[r.index];
    const relevant = !need || b.needs.length === 0 || b.needs.includes(need);
    pieces.push(
      <mark
        key={`m${i}`}
        data-mark={r.index}
        className={cn(
          "barrier-mark rounded-[0.2em] bg-no-repeat px-0.5 text-inherit [box-decoration-break:clone] [-webkit-box-decoration-break:clone]",
          relevant ? "bg-[linear-gradient(104deg,transparent_2px,var(--mark)_4px,var(--mark)_calc(100%-4px),transparent_calc(100%-2px))]" : "bg-[linear-gradient(transparent_60%,var(--mark)_60%)] opacity-80",
          activeBarrier === r.index && "outline outline-2 outline-offset-2 outline-[color:var(--mark-strong)]",
        )}
        style={{ backgroundSize: "var(--mark-size, 100%) 100%" }}
      >
        {clean.slice(r.start, r.end)}
        <sup className="ml-0.5 select-none font-mono text-[0.65em] font-bold text-ink-2" aria-label={`barrier ${i + 1}`}>
          {i + 1}
        </sup>
      </mark>,
    );
    cursor = r.end;
  });
  if (cursor < clean.length) pieces.push(clean.slice(cursor));

  return (
    <div ref={ref} className={cn("whitespace-pre-wrap break-words leading-relaxed", className)} data-shown={shown.size}>
      {pieces}
    </div>
  );
});
