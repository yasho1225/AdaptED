"use client";

import { useState } from "react";
import { Copy, Download, Info, LayoutGrid, Printer, Sparkles } from "lucide-react";
import { AdaptedDocument } from "@/components/doc/adapted-document";
import { CountUp } from "@/components/motion/count-up";
import { NEEDS } from "@/lib/adapt/profile";
import type { AdaptResult, FallbackReason } from "@/lib/adapt/types";
import { PDF_UNSUPPORTED_LANGUAGES, assignmentToPlainText, downloadAdaptedPdf } from "@/lib/export-pdf";
import { cn } from "@/lib/utils";

export type ResultTab = "transform" | "student" | "why" | "teacher";

const REASONS: Record<FallbackReason, string> = {
  no_api_key: "no AI key is configured on this server",
  quota_exceeded: "the AI quota was reached",
  rate_limited: "the AI service is busy",
  api_error: "the AI service returned an error",
  invalid_output: "the AI's answer failed validation",
};

export function SourceBadge({ result, onRunLive, liveBusy }: { result: AdaptResult; onRunLive?: () => void; liveBusy?: boolean }) {
  if (result.source === "ai") {
    return (
      <p className="flex flex-wrap items-center gap-2 text-sm">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 font-bold text-brand-ink">
          <Sparkles className="size-4" aria-hidden /> Generated live by AI{result.model ? ` · ${result.model}` : ""}
        </span>
        <span className="text-ink-3">Review before sharing with students.</span>
      </p>
    );
  }
  if (result.source === "curated") {
    return (
      <p className="flex flex-wrap items-center gap-2 text-sm">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-paper-2 px-3 py-1 font-bold text-ink-2">Pre-built example · not generated live</span>
        {onRunLive && (
          <button type="button" onClick={onRunLive} disabled={liveBusy} className="font-semibold text-brand-ink underline-offset-4 hover:underline disabled:opacity-60">
            {liveBusy ? "Generating…" : "Generate it live instead"}
          </button>
        )}
      </p>
    );
  }
  return (
    <p className="flex flex-wrap items-center gap-2 text-sm">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-warn-soft px-3 py-1 font-bold text-warn">
        <Info className="size-4" aria-hidden /> Offline rule-based version
      </span>
      <span className="text-ink-3">AI wasn&apos;t used because {REASONS[result.fallbackReason ?? "api_error"]}. Structure and supports are applied; wording is kept from the original.</span>
    </p>
  );
}

function Metric({ label, before, after, decimals = 0, suffix, note }: { label: string; before?: number; after: number; decimals?: number; suffix?: string; note?: string }) {
  return (
    <div className="min-w-0 border-rule px-4 py-3 sm:border-l first:sm:border-l-0">
      <dt className="text-xs font-semibold uppercase tracking-wide text-ink-3">{label}</dt>
      <dd className="mt-1 flex items-baseline gap-1.5 font-display text-2xl font-semibold tabular-nums">
        {before !== undefined && (
          <>
            <span className="text-ink-3 line-through decoration-1">{before.toFixed(decimals)}</span>
            <span className="text-base text-ink-3" aria-label="changed to">
              →
            </span>
          </>
        )}
        <CountUp value={after} decimals={decimals} />
        {suffix && <span className="font-sans text-sm font-semibold text-ink-2">{suffix}</span>}
      </dd>
      {note && <dd className="mt-0.5 text-xs text-ink-3">{note}</dd>}
    </div>
  );
}

export function MetricsStrip({ result }: { result: AdaptResult }) {
  const { before, after } = result.metrics;
  const f = result.fidelity;
  return (
    <dl className="sheet grid grid-cols-2 divide-rule sm:grid-cols-4">
      <Metric label="Reading grade" before={before.gradeLevel} after={after.gradeLevel} decimals={1} note="Flesch–Kincaid estimate" />
      <Metric label="Words / sentence" before={before.avgSentenceLength} after={after.avgSentenceLength} decimals={1} note="Average sentence length" />
      <Metric label="Questions kept" after={f.matchedQuestions} suffix={`of ${f.originalQuestions}`} note={f.restored.length ? `${f.restored.length} restored word-for-word` : "Checked automatically"} />
      <Metric label="Changes explained" after={result.assignment.changes.length} suffix="with sources" note="See “Why it changed”" />
    </dl>
  );
}

export function ResultActions({ result }: { result: AdaptResult }) {
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const printOnly = PDF_UNSUPPORTED_LANGUAGES.has(result.profile.language);
  return (
    <div className="flex flex-wrap gap-2">
      {!printOnly && (
        <button
          type="button"
          className="btn btn-primary btn-sm"
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
          <Download className="size-4" aria-hidden /> {busy ? "Preparing…" : "Download PDF"}
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
        <h4 className="font-sans text-base font-bold">Notes for delivering this version</h4>
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
          <p className="mt-2 text-ink-2">No special delivery notes for this version.</p>
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
        <h4 className="font-sans text-base font-bold">This student&apos;s profile</h4>
        <dl className="mt-3 space-y-2 text-[0.95rem]">
          <div>
            <dt className="text-sm text-ink-3">Needs</dt>
            <dd className="font-semibold">{p.needs.map((n) => NEEDS[n].label).join(" + ")}</dd>
          </div>
          <div>
            <dt className="text-sm text-ink-3">Goals</dt>
            <dd className="font-semibold">{p.expectations === "accommodate" ? "Accommodation — same grade-level learning goals" : "Modified goals (teacher-approved)"}</dd>
          </div>
          <div>
            <dt className="text-sm text-ink-3">Supports</dt>
            <dd>{p.supports.length} selected</dd>
          </div>
        </dl>
        <p className="mt-4 border-t border-rule pt-4 text-sm text-ink-2">
          AdaptED supports — and never replaces — a student&apos;s IEP or 504 plan and the judgment of the teacher, specialists, and the student. Ask the student what helps.
        </p>
      </div>
    </div>
  );
}

export function ResultTabs({ tab, onTab, onCompare, comparing }: { tab: ResultTab; onTab: (t: ResultTab) => void; onCompare: () => void; comparing: boolean }) {
  const tabs: [ResultTab, string][] = [
    ["transform", "Transformation"],
    ["student", "Student view"],
    ["why", "Why it changed"],
    ["teacher", "Teacher notes"],
  ];
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div role="tablist" aria-label="Result views" className="-mx-1 flex gap-1 overflow-x-auto rounded-full bg-paper-2 p-1">
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
        <LayoutGrid className="size-4" aria-hidden /> Compare all four needs
      </button>
    </div>
  );
}

/** Hidden copy of the student document used by window.print(). */
export function PrintCopy({ result }: { result: AdaptResult }) {
  return (
    <div id="print-root" className="on-paper hidden print:block" aria-hidden>
      <AdaptedDocument assignment={result.assignment} need={result.profile.needs[0]} needs={result.profile.needs} headingLevel={3} />
    </div>
  );
}
