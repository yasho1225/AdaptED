"use client";

import { useRef, useState } from "react";
import { FileText, ShieldCheck, Sparkles, Upload } from "lucide-react";
import type { CreateRequest, CreateResult } from "@/lib/adapt/create";
import { SAMPLES } from "@/lib/adapt/samples";
import { extractFileText } from "@/lib/extract-file";
import { cn } from "@/lib/utils";
import { CreateForm } from "./create-form";

const MAX = 12000;

type Mode = "use" | "create";

export function SourcePanel({ value, onChange, onCreated }: { value: string; onChange: (v: string) => void; onCreated: (r: CreateResult, req: CreateRequest) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<Mode>("use");
  const [status, setStatus] = useState<{ kind: "idle" | "busy" | "error" | "ok"; msg?: string }>({ kind: "idle" });

  const created = (r: CreateResult, req: CreateRequest) => {
    setMode("use");
    setStatus(
      r.source === "ai"
        ? { kind: "ok", msg: `Created just now by AI: “${r.title}”. Check the facts and change anything you like. It is being adapted for your student below.` }
        : { kind: "ok", msg: r.source === "outline" && req.include === "reading" ? "AI isn’t available right now, so this is a starter outline with question ideas. Replace the line in [brackets] with your own reading, then press Adapt." : "AI isn’t available right now, so this is a starter outline with question ideas. Edit it, then press Adapt." },
    );
    onCreated(r, req);
  };
  const tabs: [Mode, string, typeof FileText][] = [
    ["use", "Use one I have", FileText],
    ["create", "Create one with AI", Sparkles],
  ];
  const activeSample = SAMPLES.find((s) => s.text === value)?.id;

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setStatus({ kind: "busy", msg: `Opening ${file.name}…` });
    try {
      const text = await extractFileText(file);
      onChange(text.slice(0, MAX));
      setStatus({ kind: "ok", msg: `Loaded ${file.name}${text.length > MAX ? " (only the first 12,000 characters fit)" : ""}. Look it over before you continue.` });
    } catch (e) {
      setStatus({ kind: "error", msg: e instanceof Error ? e.message : "Couldn't read that file." });
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div data-ui className="sheet flex h-full flex-col p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="grid size-8 place-items-center rounded-full bg-ink text-sm font-bold text-paper" aria-hidden>
          1
        </span>
        <h3 className="text-xl">Your assignment</h3>
      </div>

      <div role="tablist" aria-label="How to start" className="mt-5 grid grid-cols-2 gap-1 rounded-lg bg-paper-2 p-1">
        {tabs.map(([m, label, Icon]) => (
          <button
            key={m}
            role="tab"
            id={`source-tab-${m}`}
            aria-selected={mode === m}
            aria-controls={`source-panel-${m}`}
            tabIndex={mode === m ? 0 : -1}
            onClick={() => setMode(m)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                e.preventDefault();
                const next = m === "use" ? "create" : "use";
                setMode(next);
                document.getElementById(`source-tab-${next}`)?.focus();
              }
            }}
            className="tab inline-flex items-center justify-center gap-2"
          >
            <Icon className="size-4" aria-hidden /> {label}
          </button>
        ))}
      </div>

      {mode === "create" ? (
        <div role="tabpanel" id="source-panel-create" aria-labelledby="source-tab-create" className="flex flex-1 flex-col">
          <CreateForm onCreated={created} onError={(msg) => setStatus({ kind: "error", msg })} />
        </div>
      ) : (
      <div role="tabpanel" id="source-panel-use" aria-labelledby="source-tab-use" className="flex flex-1 flex-col">
      <fieldset className="mt-5">
        <legend className="text-sm font-semibold text-ink-2">Start with a sample</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {SAMPLES.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={activeSample === s.id}
              onClick={() => {
                onChange(s.text);
                setStatus({ kind: "idle" });
              }}
              className={cn("chip text-left transition-colors", activeSample === s.id ? "border-ink bg-ink text-paper" : "hover:border-ink-3")}
            >
              <span>{s.subject}</span>
              <span className={cn("text-xs font-normal", activeSample === s.id ? "text-paper/80" : "text-ink-3")}>Gr {s.grade}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <label htmlFor="assignment-text" className="text-sm font-semibold text-ink-2">
          Or use your own
        </label>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => fileRef.current?.click()} disabled={status.kind === "busy"}>
          <Upload className="size-4" aria-hidden /> Upload a PDF or Word file
        </button>
        <input ref={fileRef} type="file" accept=".pdf,.docx,.txt,.md,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="sr-only" tabIndex={-1} onChange={(e) => onFile(e.target.files?.[0])} aria-hidden />
      </div>

      <div
        className="relative mt-2 flex-1"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          void onFile(e.dataTransfer.files?.[0]);
        }}
      >
        <textarea
          id="assignment-text"
          data-lenis-prevent
          value={value}
          maxLength={MAX}
          onChange={(e) => onChange(e.target.value)}
          placeholder={"Paste your assignment here: the directions, any reading, and the questions.\n\nYou can also drag a PDF or Word file here."}
          className="field min-h-[18rem] h-full resize-y font-sans text-[0.95rem] leading-7"
          aria-describedby="source-help source-status"
        />
        {!value && <FileText className="pointer-events-none absolute right-4 bottom-4 size-8 text-rule-strong" aria-hidden />}
      </div>

      <div className="mt-2 flex flex-wrap items-start justify-between gap-2 text-sm">
        <p id="source-help" className="flex items-start gap-1.5 text-ink-3">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-ok" aria-hidden />
          Files open on your computer. Leave out student names. Emails and phone numbers are removed before anything is sent.
        </p>
        <span className="tabular-nums text-ink-3">{value.length.toLocaleString()} / {MAX.toLocaleString()}</span>
      </div>
      </div>
      )}
      <p id="source-status" role="status" className={cn("mt-1 text-sm", status.kind === "error" ? "font-semibold text-warn" : "text-ink-2")}>
        {status.msg ?? ""}
      </p>
    </div>
  );
}
