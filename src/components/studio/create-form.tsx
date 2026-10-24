"use client";

import { useId, useRef, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { requestCreate } from "@/lib/adapt/client";
import { DEFAULT_CREATE, LEVELS, QUESTION_COUNTS, TOPIC_MAX, type CreateRequest, type CreateResult } from "@/lib/adapt/create";
import { GRADES } from "@/lib/adapt/profile";
import { cn } from "@/lib/utils";

const IDEAS = ["The water cycle", "Equivalent fractions", "Causes of the American Revolution", "How volcanoes form"];

/** "Create one with AI": a short brief → a new grade-level assignment, ready to adapt. */
export function CreateForm({ onCreated, onError }: { onCreated: (r: CreateResult, req: CreateRequest) => void; onError: (msg: string) => void }) {
  const id = useId();
  const [req, setReq] = useState<CreateRequest>(DEFAULT_CREATE);
  const [busy, setBusy] = useState(false);
  const [missing, setMissing] = useState(false);
  const topicRef = useRef<HTMLInputElement>(null);
  const set = <K extends keyof CreateRequest>(k: K, v: CreateRequest[K]) => setReq((r) => ({ ...r, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (req.topic.trim().length < 2) {
      setMissing(true);
      topicRef.current?.focus();
      return;
    }
    setBusy(true);
    try {
      onCreated(await requestCreate(req), req);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Couldn't create the assignment. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-5 flex flex-1 flex-col" noValidate aria-busy={busy}>
      <label htmlFor={`${id}-topic`} className="text-sm font-semibold text-ink-2">
        What should it be about?
      </label>
      <input
        ref={topicRef}
        id={`${id}-topic`}
        className="field mt-1.5 min-h-12 text-base"
        value={req.topic}
        maxLength={TOPIC_MAX}
        placeholder="For example: how volcanoes form"
        aria-invalid={missing || undefined}
        aria-describedby={missing ? `${id}-missing` : undefined}
        onChange={(e) => {
          set("topic", e.target.value);
          if (missing) setMissing(false);
        }}
      />
      {missing && (
        <p id={`${id}-missing`} className="mt-1.5 text-sm font-semibold text-warn">
          Type a topic first.
        </p>
      )}
      <div className="mt-2 flex flex-wrap gap-1.5" aria-label="Ideas">
        {IDEAS.map((t) => (
          <button key={t} type="button" className="chip text-[0.82rem] text-ink-2" onClick={() => set("topic", t)}>
            {t}
          </button>
        ))}
      </div>

      <fieldset className="mt-5">
        <legend className="text-sm font-semibold text-ink-2">What should it include?</legend>
        <div className="mt-1.5 grid grid-cols-2 gap-2">
          {(
            [
              ["reading", "A reading and questions"],
              ["questions", "Questions only"],
            ] as const
          ).map(([v, label]) => (
            <label key={v} className={cn("flex min-h-11 cursor-pointer items-center gap-2.5 rounded-lg border-2 px-3 py-2 text-sm font-semibold transition-colors", req.include === v ? "border-ink" : "border-transparent bg-paper-2 hover:border-rule-strong")}>
              <input type="radio" name={`${id}-include`} value={v} checked={req.include === v} onChange={() => set("include", v)} className="accent-[var(--ink)]" />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <label className="text-sm font-semibold text-ink-2">
          Grade
          <select className="field mt-1.5" value={req.grade} onChange={(e) => set("grade", e.target.value)}>
            {GRADES.map((g) => (
              <option key={g} value={g}>
                Grade {g}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold text-ink-2">
          Questions
          <select className="field mt-1.5" value={req.questions} onChange={(e) => set("questions", Number(e.target.value))}>
            {QUESTION_COUNTS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label className="col-span-2 text-sm font-semibold text-ink-2 sm:col-span-1">
          Level
          <select className="field mt-1.5" value={req.level} onChange={(e) => set("level", e.target.value as CreateRequest["level"])}>
            {LEVELS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6">
        <button type="submit" className="btn btn-primary w-full min-h-12 text-base" disabled={busy}>
          {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Sparkles className="size-4" aria-hidden />}
          {busy ? "Writing your assignment…" : "Create assignment"}
        </button>
        <p className="mt-2 text-center text-sm text-ink-3">AI writes it from scratch, then AdaptED adapts it for your student. Check the facts before you share it.</p>
      </div>
    </form>
  );
}
