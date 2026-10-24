"use client";

import { useMemo, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { AdaptedDocument } from "@/components/doc/adapted-document";
import { OriginalDocument, barrierRanges } from "@/components/doc/original-document";
import { detectBarriers, normalize } from "@/lib/adapt/analyze";
import { NEEDS, writtenIn } from "@/lib/adapt/profile";
import type { AdaptResult, Barrier, LearnerProfile } from "@/lib/adapt/types";
import { cn } from "@/lib/utils";

interface Props {
  source: string;
  profile: LearnerProfile;
  result: AdaptResult | null;
  loading: boolean;
}

export function useBarriers(source: string, result: AdaptResult | null): Barrier[] {
  return useMemo(() => {
    const clean = normalize(source).trim();
    const fromResult = (result?.assignment.barriers ?? []).map((b) => ({ ...b, quote: normalize(b.quote) })).filter((b) => clean.includes(b.quote));
    return fromResult.length >= 2 ? fromResult : detectBarriers(source);
  }, [source, result]);
}

export function TransformView({ source, profile, result, loading }: Props) {
  const [activeBarrier, setActiveBarrier] = useState<number | null>(null);
  const barriers = useBarriers(source, result);
  const shownRanges = useMemo(() => barrierRanges(normalize(source).trim(), barriers), [source, barriers]);
  const need = profile.needs[0];
  const needLabel = profile.needs.map((n) => NEEDS[n].label).join(" + ");

  const steps = [
    { label: `Found ${shownRanges.length} thing${shownRanges.length === 1 ? "" : "s"} that could get in the way`, done: true },
    { label: `Student: ${needLabel} · ${profile.supports.length} kinds of help`, done: true },
    { label: result ? (result.source === "curated" ? "Opened the pre-made example" : result.source === "ai" ? "Wrote the new version" : "Built a version without AI") : "Writing the new version", done: !!result },
    {
      label: result ? `Checked: ${result.fidelity.matchedQuestions} of ${result.fidelity.originalQuestions} questions kept` : "Checking that every question is still there",
      done: !!result,
    },
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {/* Two frames of the same height, each scrolling on its own: original and new version read side by side.
          The frame is dark (you operate it); the document in it is paper (a student reads it). */}
      <div data-ui className="panel relative flex h-[70svh] min-h-[28rem] flex-col overflow-hidden lg:h-[min(50rem,calc(100svh-7rem))]">
        <div className="flex items-center justify-between gap-3 px-5 py-3">
          <p className="label !text-ink">Original</p>
          <p className="text-sm text-ink-3">
            <span className="mark font-semibold">Highlighted</span> = could get in the way
          </p>
        </div>
        <div className="sheet min-h-0 flex-1 overflow-y-auto rounded-none px-5 py-5 sm:px-7" tabIndex={0} aria-label="Original assignment">
          <OriginalDocument text={source} barriers={barriers} need={need} activeBarrier={activeBarrier} className="text-[0.95rem] text-ink-2" />
        </div>
        {shownRanges.length > 0 && (
          <div className="max-h-[40%] shrink-0 overflow-y-auto px-5 py-4 sm:px-7">
            <p className="text-sm font-bold">What could get in the way</p>
            <ol className="mt-2 space-y-2 text-sm">
              {shownRanges.map((r, i) => {
                const b = barriers[r.index];
                return (
                  <li key={r.index} tabIndex={0} onMouseEnter={() => setActiveBarrier(r.index)} onMouseLeave={() => setActiveBarrier(null)} onFocus={() => setActiveBarrier(r.index)} onBlur={() => setActiveBarrier(null)} className="flex gap-2.5 rounded">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded bg-mark-strong tnum text-xs font-bold text-sheet-ink" aria-hidden>
                      {i + 1}
                    </span>
                    <span className="text-ink-2">
                      <span className="sr-only">Problem {i + 1}: </span>
                      {b.issue}
                      {b.needs.length > 0 && (
                        <span className="ml-1.5 inline-flex flex-wrap gap-1 align-middle">
                          {b.needs.map((n) => (
                            <span key={n} className={cn(`need-${n}`, "rounded-full bg-[color:var(--need-soft)] px-1.5 text-xs font-bold text-[color:var(--need)]")}>
                              {NEEDS[n].shortLabel}
                            </span>
                          ))}
                        </span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>

      <div data-ui className={cn("panel adapted-pane flex h-[70svh] min-h-[28rem] flex-col overflow-hidden lg:h-[min(50rem,calc(100svh-7rem))]", `need-${need}`)}>
        <div className="flex items-center gap-2.5 px-5 py-3">
          <span aria-hidden className="size-2 shrink-0 rounded-full bg-[color:var(--need)]" />
          <p className="label !text-ink">New version for {needLabel}</p>
        </div>
        {result && !loading ? (
          <div className="sheet min-h-0 flex-1 overflow-y-auto rounded-none" tabIndex={0} aria-label={`New version for ${needLabel}`}>
            <AdaptedDocument assignment={result.assignment} need={need} needs={profile.needs} headingLevel={3} language={writtenIn(result)} />
          </div>
        ) : (
          <div className="sheet min-h-0 flex-1 rounded-none p-6 sm:p-8" aria-live="polite">
            <ol className="space-y-3">
              {steps.map((s, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className={cn("grid size-6 place-items-center rounded-full", s.done ? "bg-ok text-paper" : "border-2 border-rule-strong")}>
                    {s.done ? <Check className="size-3.5" strokeWidth={3} aria-hidden /> : <Loader2 className="size-3.5 animate-spin text-ink-3" aria-hidden />}
                  </span>
                  <span className={s.done ? "font-semibold" : "text-ink-3"}>{s.label}</span>
                </li>
              ))}
            </ol>
            <div className="mt-8 space-y-3" aria-hidden>
              {[72, 92, 64, 88, 56].map((w, i) => (
                <div key={i} className="h-3.5 animate-pulse rounded bg-paper-2" style={{ width: `${w}%`, animationDelay: `${i * 120}ms` }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
