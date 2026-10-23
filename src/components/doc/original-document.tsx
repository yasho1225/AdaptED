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
  // Single words are marked where they appear in the body, not in the title line.
  const bodyStart = Math.max(0, text.indexOf("\n"));
  barriers.forEach((b, index) => {
    const single = !/\s/.test(b.quote);
    const at = text.indexOf(b.quote, single ? bodyStart : 0);
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
          "barrier-mark rounded-[0.15em] bg-transparent px-0.5 text-inherit [box-decoration-break:clone] [-webkit-box-decoration-break:clone]",
          relevant ? "hl-mark" : "hl-under",
          activeBarrier === r.index && "outline outline-2 outline-offset-2 outline-[color:var(--mark-strong)]",
        )}
      >
        {clean.slice(r.start, r.end)}
        <sup className="ml-0.5 select-none tnum text-xs font-bold text-ink-2" aria-label={`barrier ${i + 1}`}>
          {i + 1}
        </sup>
      </mark>,
    );
    cursor = r.end;
  });
  if (cursor < clean.length) pieces.push(clean.slice(cursor));

  return (
    <div ref={ref} className={cn("whitespace-pre-wrap break-words leading-relaxed first-line:text-[1.15em] first-line:font-bold first-line:text-ink", className)} data-shown={shown.size}>
      {pieces}
    </div>
  );
});
