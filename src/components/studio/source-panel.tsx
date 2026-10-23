"use client";

import { useRef, useState } from "react";
import { FileText, ShieldCheck, Upload } from "lucide-react";
import { SAMPLES } from "@/lib/adapt/samples";
import { extractFileText } from "@/lib/extract-file";
import { cn } from "@/lib/utils";

const MAX = 12000;

export function SourcePanel({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<{ kind: "idle" | "busy" | "error" | "ok"; msg?: string }>({ kind: "idle" });
  const activeSample = SAMPLES.find((s) => s.text === value)?.id;

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setStatus({ kind: "busy", msg: `Reading ${file.name}…` });
    try {
      const text = await extractFileText(file);
      onChange(text.slice(0, MAX));
      setStatus({ kind: "ok", msg: `Loaded text from ${file.name}${text.length > MAX ? " (trimmed to the first 12,000 characters)" : ""}. Check it below before adapting.` });
    } catch (e) {
      setStatus({ kind: "error", msg: e instanceof Error ? e.message : "Couldn't read that file." });
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="sheet flex h-full flex-col p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="grid size-8 place-items-center rounded-full bg-ink text-sm font-bold text-paper" aria-hidden>
          1
        </span>
        <h3 className="text-xl">The assignment</h3>
      </div>

      <fieldset className="mt-5">
        <legend className="text-sm font-semibold text-ink-2">Try a sample</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {SAMPLES.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={activeSample === s.id}
              onClick={() => onChange(s.text)}
              className={cn("chip text-left transition-colors", activeSample === s.id ? "border-ink bg-ink text-paper" : "hover:border-ink-3")}
            >
              <span>{s.subject}</span>
              <span className={cn("text-xs font-normal", activeSample === s.id ? "text-paper/80" : "text-ink-3")}>Gr {s.grade}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 flex items-end justify-between gap-3">
        <label htmlFor="assignment-text" className="text-sm font-semibold text-ink-2">
          Or paste / upload your own
        </label>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => fileRef.current?.click()} disabled={status.kind === "busy"}>
          <Upload className="size-4" aria-hidden /> Upload PDF / Word
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
          placeholder={"Paste an assignment here — directions, any reading, and the questions.\n\nYou can also drop a PDF or Word file."}
          className="field ruled min-h-[18rem] h-full resize-y font-sans text-[0.95rem] leading-8"
          aria-describedby="source-help source-status"
        />
        {!value && <FileText className="pointer-events-none absolute right-4 bottom-4 size-8 text-rule-strong" aria-hidden />}
      </div>

      <div className="mt-2 flex flex-wrap items-start justify-between gap-2 text-sm">
        <p id="source-help" className="flex items-start gap-1.5 text-ink-3">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-ok" aria-hidden />
          Files are read in your browser. Don&apos;t include student names — emails and phone numbers are removed automatically.
        </p>
        <span className="tabular-nums text-ink-3">{value.length.toLocaleString()} / {MAX.toLocaleString()}</span>
      </div>
      <p id="source-status" role="status" className={cn("mt-1 text-sm", status.kind === "error" ? "font-semibold text-warn" : "text-ink-2")}>
        {status.msg ?? ""}
      </p>
    </div>
  );
}
