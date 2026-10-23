import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { NEEDS } from "@/lib/adapt/profile";
import { getResearch } from "@/lib/adapt/research";
import type { AdaptResult } from "@/lib/adapt/types";
import { cn } from "@/lib/utils";

export function WhyPanel({ result }: { result: AdaptResult }) {
  const a = result.assignment;
  const f = result.fidelity;
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_20rem]">
      <div>
        <ol className="sheet divide-y divide-rule">
          {a.changes.map((c, i) => {
            const src = getResearch(c.evidence);
            const tone = c.need === "all" ? "" : `need-${c.need}`;
            return (
              <li key={i} className={cn("grid gap-3 p-5 sm:p-6 md:grid-cols-12 md:gap-6", tone)}>
                <div className="md:col-span-5">
                  <h4 className="text-base leading-snug">{c.title}</h4>
                  {c.need !== "all" && (
                    <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-[color:var(--need)]">
                      <span aria-hidden className="size-2 rounded-full bg-[color:var(--need)]" />
                      {NEEDS[c.need].label}
                    </p>
                  )}
                  <p className="mt-2 text-[0.95rem] text-ink-2">{c.detail}</p>
                </div>
                <div className="md:col-span-3">
                  {c.barrier && c.barrier !== "—" && (
                    <p className="text-sm">
                      <span className="block font-bold text-ink-3">Barrier removed</span>
                      <span className="mark">{c.barrier.length > 140 ? c.barrier.slice(0, 137) + "…" : c.barrier}</span>
                    </p>
                  )}
                </div>
                {src && (
                  <a href={src.url} target="_blank" rel="noreferrer" className="group text-sm md:col-span-4">
                    <span className="flex items-center gap-1 font-bold text-brand-ink group-hover:underline">
                      {src.label} <ArrowUpRight className="size-3.5" aria-hidden />
                      <span className="sr-only">(opens in a new tab)</span>
                    </span>
                    <span className="mt-0.5 block text-ink-3">{src.supports}</span>
                  </a>
                )}
              </li>
            );
          })}
        </ol>

        {a.languageReplacements && a.languageReplacements.length > 0 && (
          <div className="sheet mt-6 overflow-x-auto p-5">
            <h4 className="font-sans text-base font-bold">Wording made literal</h4>
            <table className="mt-3 w-full min-w-[28rem] text-left text-[0.95rem]">
              <thead className="text-sm text-ink-3">
                <tr>
                  <th className="pb-2 font-semibold">Original</th>
                  <th className="pb-2 font-semibold">Now says</th>
                </tr>
              </thead>
              <tbody>
                {a.languageReplacements.map((r, i) => (
                  <tr key={i} className="border-t border-rule align-top">
                    <td className="py-2 pr-4 text-ink-2 line-through decoration-ink-3/60">{r.original}</td>
                    <td className="py-2 font-semibold">{r.replacement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <aside className="space-y-4">
        <div className="sheet p-5">
          <h4 className="flex items-center gap-2 font-sans text-base font-bold">
            <ShieldCheck className="size-5 text-ok" aria-hidden /> Academic fidelity
          </h4>
          <p className="mt-1 text-xs text-ink-3">Checked by AdaptED&apos;s own code, not claimed by the AI.</p>
          <dl className="mt-3 space-y-2 text-sm">
            <Row label="Questions kept" value={`${f.matchedQuestions} / ${f.originalQuestions}`} ok={f.missing.length === 0} />
            {f.restored.length > 0 && <Row label="Restored word-for-word" value={f.restored.join(", ")} ok={false} />}
            <Row label="Answer choices kept" value={f.choicesPreserved ? "All" : "Some missing"} ok={f.choicesPreserved} />
            {f.altered.length > 0 && <Row label="Reworded — please review" value={f.altered.map((q) => `#${q}`).join(", ")} ok={false} />}
            <Row label="Academic terms kept" value={f.vocabularyKept.length ? f.vocabularyKept.join(", ") : "—"} ok={f.vocabularyDropped.length === 0} />
            {f.vocabularyDropped.length > 0 && <Row label="Terms not found" value={f.vocabularyDropped.join(", ")} ok={false} />}
          </dl>
        </div>
        {a.preserved.objectives.length > 0 && (
          <div className="sheet p-5">
            <h4 className="font-sans text-base font-bold">Learning goals kept</h4>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-2">
              {a.preserved.objectives.map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </div>
  );
}

function Row({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 border-t border-rule pt-2 first:border-0 first:pt-0">
      <dt className="text-ink-2">{label}</dt>
      <dd className={cn("text-right font-bold", ok ? "text-ok" : "text-warn")}>{value}</dd>
    </div>
  );
}
