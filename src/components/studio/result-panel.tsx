"use client";

import { useState } from "react";
import { Copy, Download, Info, LayoutGrid, Printer, Sparkles } from "lucide-react";
import { AdaptedDocument } from "@/components/doc/adapted-document";
import { NEEDS, writtenIn } from "@/lib/adapt/profile";
import type { AdaptResult, FallbackReason } from "@/lib/adapt/types";
import { PDF_UNSUPPORTED_LANGUAGES, assignmentToPlainText, downloadAdaptedPdf } from "@/lib/export-pdf";
import { cn } from "@/lib/utils";

export type ResultTab = "transform" | "student" | "why" | "teacher";

const REASONS: Record<FallbackReason, string> = {
  no_api_key: "AI isn’t set up on this server",
  quota_exceeded: "the AI has reached its limit for now",
  rate_limited: "the AI is busy right now",
  api_error: "the AI had a problem",
  invalid_output: "the AI’s answer didn’t pass AdaptED’s checks",
};

export function SourceBadge({ result, onRunLive, liveBusy }: { result: AdaptResult; onRunLive?: () => void; liveBusy?: boolean }) {
  if (result.source === "ai") {
    return (
      <p className="flex flex-wrap items-center gap-2 text-sm">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 font-bold text-brand-ink">
          <Sparkles className="size-4" aria-hidden /> Made just now by AI{result.model ? ` · ${result.model}` : ""}
        </span>
        <span className="text-ink-3">Read it over before you share it.</span>
      </p>
    );
  }
  if (result.source === "curated") {
    return (
      <p className="flex flex-wrap items-center gap-2 text-sm">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-paper-2 px-3 py-1 font-bold text-ink-2">Pre-made example · not made just now</span>
        {onRunLive && (
          <button type="button" onClick={onRunLive} disabled={liveBusy} className="btn btn-ghost btn-sm">
            <Sparkles className="size-4" aria-hidden /> {liveBusy ? "Making it…" : "Make it with AI now"}
          </button>
        )}
      </p>
    );
  }
  return (
    <p className="flex flex-wrap items-center gap-2 text-sm">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-warn-soft px-3 py-1 font-bold text-warn">
        <Info className="size-4" aria-hidden /> Made without AI
      </span>
      <span className="text-ink-3">AI wasn&apos;t used because {REASONS[result.fallbackReason ?? "api_error"]}. The help you picked is added, but the wording stays close to the original.</span>
    </p>
  );
}

/** Hand-drawn check that strokes itself in once: a small moment of relief when nothing was lost. */
function DrawnCheck() {
  return (
    <svg viewBox="0 0 24 24" className="size-6 shrink-0 self-center text-ok" aria-hidden>
      <circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      <path d="M7 12.5l3.2 3.2L17.2 8.6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" style={{ animation: "draw 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both" }} />
    </svg>
  );
}

function Metric({ label, before, after, decimals = 0, suffix, note, done }: { label: string; before?: number; after: number; decimals?: number; suffix?: string; note?: string; done?: boolean }) {
  return (
    <div className="min-w-0 px-5 py-4">
      <dt className="text-sm font-bold text-ink-2">{label}</dt>
      <dd className="tnum mt-1 flex items-baseline gap-2 font-mono text-xl font-bold">
        {before !== undefined && (
          <>
            <span className="text-ink-3 line-through decoration-1">{before.toFixed(decimals)}</span>
            <span className="font-sans text-base text-ink-3" aria-label="changed to">
              →
            </span>
          </>
        )}
        <span>{after.toFixed(decimals)}</span>
        {suffix && <span className="font-sans text-sm font-bold text-ink-2">{suffix}</span>}
        {done && <DrawnCheck />}
      </dd>
      {note && <dd className="mt-0.5 text-sm text-ink-3">{note}</dd>}
    </div>
  );
}

/** A ledger of measured before/after values (computed by code, not claimed by the AI). */
export function MetricsStrip({ result }: { result: AdaptResult }) {
  const { before, after } = result.metrics;
  const f = result.fidelity;
  return (
    <dl className="sheet grid grid-cols-1 divide-y divide-rule sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
      <Metric label="Reading level (grade)" before={before.gradeLevel} after={after.gradeLevel} decimals={1} note="An estimate" />
      <Metric label="Words per sentence" before={before.avgSentenceLength} after={after.avgSentenceLength} decimals={1} note="On average" />
      <Metric label="Questions kept" done={f.originalQuestions > 0 && f.missing.length === 0 && f.restored.length === 0} after={f.matchedQuestions} suffix={`of ${f.originalQuestions}`} note={f.restored.length ? `${f.restored.length} put back word for word` : "Checked by AdaptED"} />
      <Metric label="Changes" after={result.assignment.changes.length} suffix="each with a reason" note="See “What changed”" />
    </dl>
  );
}

export function ResultActions({ result }: { result: AdaptResult }) {
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const printOnly = PDF_UNSUPPORTED_LANGUAGES.has(result.profile.language);
  return (
    <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap">
      {!printOnly && (
        <button
          type="button"
          className="btn btn-primary btn-sm col-span-2"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await downloadAdaptedPdf(result);
            } finally {
              setBusy(false);
            }
          }}
        >
          <Download className="size-4" aria-hidden /> {busy ? "Getting it ready…" : "Download PDF"}
        </button>
      )}
      <button type="button" className={cn("btn btn-sm", printOnly ? "btn-primary" : "btn-ghost")} onClick={() => window.print()}>
        <Printer className="size-4" aria-hidden /> {printOnly ? "Print / save as PDF" : "Print"}
      </button>
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(assignmentToPlainText(result.assignment));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {
            setCopied(false);
          }
        }}
      >
        <Copy className="size-4" aria-hidden /> {copied ? "Copied!" : "Copy text"}
      </button>
      <span className="sr-only" role="status">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </div>
  );
}

export function TeacherPanel({ result }: { result: AdaptResult }) {
  const p = result.profile;
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="sheet p-6">
        <h4 className="font-sans text-base font-bold">Tips for giving this to your student</h4>
        {result.assignment.teacherNotes.length ? (
          <ul className="mt-3 space-y-3">
            {result.assignment.teacherNotes.map((n, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-ink" aria-hidden />
                <span>{n}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-ink-2">No special tips for this version.</p>
        )}
        {result.notices.length > 0 && (
          <ul className="mt-4 space-y-1 text-sm text-warn">
            {result.notices.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="sheet p-6">
        <h4 className="font-sans text-base font-bold">About this student</h4>
        <dl className="mt-3 space-y-2 text-[0.95rem]">
          <div>
            <dt className="text-sm text-ink-3">Needs help with</dt>
            <dd className="font-semibold">{p.needs.map((n) => NEEDS[n].label).join(" + ")}</dd>
          </div>
          <div>
            <dt className="text-sm text-ink-3">Learning goals</dt>
            <dd className="font-semibold">{p.expectations === "accommodate" ? "The same as the rest of the class" : "Changed by the teacher"}</dd>
          </div>
          <div>
            <dt className="text-sm text-ink-3">Kinds of help</dt>
            <dd>{p.supports.length} turned on</dd>
          </div>
        </dl>
        <p className="mt-4 border-t border-rule pt-4 text-sm text-ink-2">
          AdaptED helps with a student&apos;s IEP or 504 plan. It never replaces the plan, or what you, the specialists, and the student know. Ask the student what helps them.
        </p>
      </div>
    </div>
  );
}

export function ResultTabs({ tab, onTab, onCompare, comparing }: { tab: ResultTab; onTab: (t: ResultTab) => void; onCompare: () => void; comparing: boolean }) {
  const tabs: [ResultTab, string][] = [
    ["transform", "Before and after"],
    ["student", "Student view"],
    ["why", "What changed"],
    ["teacher", "Teacher notes"],
  ];
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div role="tablist" aria-label="Result views" className="grid w-full grid-cols-2 gap-1 rounded-xl bg-paper-2 p-1 sm:inline-flex sm:w-auto sm:rounded-full">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            role="tab"
            id={`tab-${id}`}
            aria-selected={tab === id}
            aria-controls={`panel-${id}`}
            tabIndex={tab === id ? 0 : -1}
            className="tab"
            onClick={() => onTab(id)}
            onKeyDown={(e) => {
              const i = tabs.findIndex(([t]) => t === tab);
              if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                e.preventDefault();
                const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length][0];
                onTab(next);
                document.getElementById(`tab-${next}`)?.focus();
              }
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <button type="button" className={cn("btn btn-sm", comparing ? "btn-primary" : "btn-ghost")} aria-pressed={comparing} onClick={onCompare}>
        <LayoutGrid className="size-4" aria-hidden /> Compare all four
      </button>
    </div>
  );
}

/** Hidden copy of the student document used by window.print(). */
export function PrintCopy({ result }: { result: AdaptResult }) {
  return (
    <div id="print-root" className="on-paper hidden print:block" aria-hidden>
      <AdaptedDocument assignment={result.assignment} need={result.profile.needs[0]} needs={result.profile.needs} headingLevel={3} language={writtenIn(result)} />
    </div>
  );
}
