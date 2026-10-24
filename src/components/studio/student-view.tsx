"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Minus, Pause, Plus, Square, Volume2 } from "lucide-react";
import { AdaptedDocument, DEFAULT_PREFS, type DisplayPrefs } from "@/components/doc/adapted-document";
import { writtenIn } from "@/lib/adapt/profile";
import type { AdaptResult } from "@/lib/adapt/types";
import { cn } from "@/lib/utils";
import { useReadAloud } from "./use-read-aloud";

const TINT_OPTIONS: { v: DisplayPrefs["tint"]; label: string; swatch: string }[] = [
  { v: "paper", label: "Paper", swatch: "bg-sheet" },
  { v: "cream", label: "Cream", swatch: "bg-[oklch(0.97_0.035_90)]" },
  { v: "blue", label: "Soft blue", swatch: "bg-[oklch(0.95_0.03_235)]" },
  { v: "gray", label: "Gray", swatch: "bg-[oklch(0.94_0.005_265)]" },
];

export function StudentView({ result }: { result: AdaptResult }) {
  const needs = result.profile.needs;
  const [prefs, setPrefs] = useState<DisplayPrefs>({ ...DEFAULT_PREFS, tint: needs.includes("dyslexia") ? "cream" : "paper" });
  const [focus, setFocus] = useState<number | null>(needs.includes("adhd") ? 0 : null);
  const tts = useReadAloud(result.assignment, writtenIn(result));
  const total = result.assignment.sections.length;

  return (
    <div>
      <div data-ui className="panel mb-4 flex flex-wrap items-center gap-x-5 gap-y-3 px-4 py-3" role="toolbar" aria-label="Display options">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-ink-2">Text</span>
          <button type="button" className="btn btn-ghost btn-sm size-11 !p-0" aria-label="Smaller text" disabled={prefs.size === 0} onClick={() => setPrefs((p) => ({ ...p, size: Math.max(0, p.size - 1) as DisplayPrefs["size"] }))}>
            <Minus className="size-4" aria-hidden />
          </button>
          <button type="button" className="btn btn-ghost btn-sm size-11 !p-0" aria-label="Larger text" disabled={prefs.size === 2} onClick={() => setPrefs((p) => ({ ...p, size: Math.min(2, p.size + 1) as DisplayPrefs["size"] }))}>
            <Plus className="size-4" aria-hidden />
          </button>
        </div>
        <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm font-semibold text-ink-2">
          <input type="checkbox" checked={prefs.wide || needs.includes("dyslexia")} disabled={needs.includes("dyslexia")} onChange={(e) => setPrefs((p) => ({ ...p, wide: e.target.checked }))} className="size-4 accent-[var(--ink)]" />
          Wide spacing
        </label>
        <fieldset className="flex items-center gap-1.5">
          <legend className="sr-only">Background</legend>
          <span className="text-sm font-semibold text-ink-2" aria-hidden>
            Background
          </span>
          {TINT_OPTIONS.map((t) => (
            <label key={t.v} className="grid size-11 cursor-pointer place-items-center" title={t.label}>
              <input type="radio" name="tint" className="peer sr-only" checked={prefs.tint === t.v} onChange={() => setPrefs((p) => ({ ...p, tint: t.v }))} />
              <span className={cn("block size-7 rounded-full border-2 border-rule-strong peer-checked:border-ink peer-checked:ring-2 peer-checked:ring-ink peer-checked:ring-offset-2 peer-checked:ring-offset-paper peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-brand", t.swatch)} />
              <span className="sr-only">{t.label}</span>
            </label>
          ))}
        </fieldset>
        <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm font-semibold text-ink-2">
          <input type="checkbox" checked={focus !== null} onChange={(e) => setFocus(e.target.checked ? 0 : null)} className="size-4 accent-[var(--ink)]" />
          One section at a time
        </label>
        {tts.supported && (
          <div className="flex items-center gap-1.5 sm:ml-auto">
            {tts.state === "playing" ? (
              <button type="button" className="btn btn-primary btn-sm" onClick={tts.pause}>
                <Pause className="size-4" aria-hidden /> Pause
              </button>
            ) : (
              <button type="button" className="btn btn-primary btn-sm" onClick={tts.play}>
                <Volume2 className="size-4" aria-hidden /> {tts.state === "paused" ? "Resume" : "Read aloud"}
              </button>
            )}
            {tts.state !== "idle" && (
              <button type="button" className="btn btn-ghost btn-sm size-11 !p-0" aria-label="Stop reading" onClick={tts.stop}>
                <Square className="size-3.5" aria-hidden />
              </button>
            )}
            <label className="text-sm text-ink-2">
              <span className="sr-only">Reading speed</span>
              <select className="field !w-auto !py-1 text-sm" value={tts.rate} onChange={(e) => tts.setRate(Number(e.target.value))}>
                <option value={0.75}>Slow</option>
                <option value={0.95}>Normal</option>
                <option value={1.15}>Fast</option>
              </select>
            </label>
          </div>
        )}
      </div>

      {focus !== null && (
        <div className="mb-4 flex items-center gap-3">
          <button type="button" className="btn btn-ghost btn-sm" disabled={focus === 0} onClick={() => setFocus((f) => Math.max(0, (f ?? 0) - 1))}>
            <ChevronLeft className="size-4" aria-hidden /> Back
          </button>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-paper-2" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={focus + 1} aria-label="Progress through sections">
            <div className={cn(`need-${needs[0]}`, "h-full rounded-full bg-[color:var(--need)] transition-[width] duration-500")} style={{ width: `${((focus + 1) / total) * 100}%` }} />
          </div>
          <span className="text-sm font-bold tabular-nums">
            {focus + 1} / {total}
          </span>
          <button type="button" className="btn btn-primary btn-sm" disabled={focus >= total - 1} onClick={() => setFocus((f) => Math.min(total - 1, (f ?? 0) + 1))}>
            Next <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>
      )}

      <div className="sheet overflow-hidden">
        <AdaptedDocument assignment={result.assignment} need={needs[0]} needs={needs} interactive prefs={prefs} activeBlock={tts.active} focusIndex={focus} headingLevel={3} language={writtenIn(result)} />
      </div>
    </div>
  );
}
