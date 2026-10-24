"use client";

import { Check, ChevronDown, ChevronRight } from "lucide-react";
import { GRADES, LANGUAGES, NEEDS, SUPPORTS, SUPPORT_IDS, supportsForNeeds } from "@/lib/adapt/profile";
import { NEED_IDS, type LearnerProfile, type NeedId, type SupportId } from "@/lib/adapt/types";
import { cn } from "@/lib/utils";

export function ProfilePanel({ profile, onChange, action }: { profile: LearnerProfile; onChange: (p: LearnerProfile) => void; action?: React.ReactNode }) {
  const toggleNeed = (n: NeedId) => {
    const has = profile.needs.includes(n);
    if (has && profile.needs.length === 1) return;
    const needs = has ? profile.needs.filter((x) => x !== n) : NEED_IDS.filter((x) => x === n || profile.needs.includes(x));
    onChange({ ...profile, needs, supports: supportsForNeeds(needs) });
  };
  const toggleSupport = (s: SupportId) => {
    const supports = profile.supports.includes(s) ? profile.supports.filter((x) => x !== s) : SUPPORT_IDS.filter((x) => x === s || profile.supports.includes(x));
    onChange({ ...profile, supports });
  };

  const suggested = SUPPORT_IDS.filter((id) => SUPPORTS[id].needs.some((n) => profile.needs.includes(n)));
  const others = SUPPORT_IDS.filter((id) => !suggested.includes(id));
  const summary = [
    `${profile.supports.length} kind${profile.supports.length === 1 ? "" : "s"} of help on`,
    profile.expectations === "accommodate" ? "same goals as the class" : "goals changed",
    profile.notes?.trim() ? "a note added" : "",
  ].filter(Boolean);

  return (
    <div data-ui className="panel flex h-full flex-col p-5 sm:p-6">
      <h3 className="text-xl">Your student</h3>

      <fieldset className="mt-5">
        <legend className="text-sm font-semibold text-ink-2">What does this student need? <span className="font-normal text-ink-3">(pick one or more)</span></legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {NEED_IDS.map((n) => {
            const on = profile.needs.includes(n);
            return (
              <button
                key={n}
                type="button"
                aria-pressed={on}
                onClick={() => toggleNeed(n)}
                className={cn(`need-${n}`, "option min-h-[4.5rem] flex-col items-start gap-1 px-3.5 py-3", on && "border-[color:var(--need)] bg-[color:var(--need-soft)]")}
              >
                <span className="flex w-full items-start gap-2 text-base leading-tight font-semibold">
                  <span aria-hidden className="mt-[0.4em] size-2 shrink-0 rounded-full bg-[color:var(--need)]" />
                  {NEEDS[n].label}
                  {/* A square box, because more than one need can be picked. */}
                  <span className={cn("ml-auto grid size-5 shrink-0 place-items-center rounded-[5px] border-2", on ? "border-[color:var(--need)] bg-[color:var(--need)] text-[color:var(--on-need)]" : "border-rule-strong")} aria-hidden>
                    {on && <Check className="size-3.5" strokeWidth={3.5} />}
                  </span>
                </span>
                <span className="text-xs leading-snug text-ink-2">{NEEDS[n].tagline}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-semibold text-ink-2">
          Grade
          <select className="field mt-2" value={profile.grade ?? ""} onChange={(e) => onChange({ ...profile, grade: e.target.value || undefined })}>
            <option value="">Same as the assignment</option>
            {GRADES.map((g) => (
              <option key={g} value={g}>
                Grade {g}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold text-ink-2">
          Language for the student
          <select className="field mt-2" value={profile.language} onChange={(e) => onChange({ ...profile, language: e.target.value as LearnerProfile["language"] })}>
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* The finer settings fold away; the summary says what they are set to. */}
      <details className="group/fine mt-5 border-t border-rule">
        <summary className="flex min-h-14 list-none items-center justify-between gap-3 py-3 [&::-webkit-details-marker]:hidden">
          <span>
            <span className="block font-bold">Fine-tune</span>
            <span className="block text-sm text-ink-3">{summary.join(" · ")}</span>
          </span>
          <ChevronDown className="size-5 shrink-0 text-ink-2 transition-transform duration-200 group-open/fine:rotate-180" aria-hidden />
        </summary>
        <div className="hidden pb-1 group-open/fine:block">
          <fieldset className="mt-3">
            <legend className="text-sm font-semibold text-ink-2">
              Help to include <span className="font-normal text-ink-3">({profile.supports.length} on. Turn any of them off or on.)</span>
            </legend>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {suggested.map((id) => (
                <SupportChip key={id} id={id} on={profile.supports.includes(id)} onToggle={toggleSupport} />
              ))}
            </ul>
            {others.length > 0 && (
              <details className="group/more mt-2">
                <summary className="flex min-h-11 cursor-pointer list-none items-center gap-1.5 text-sm font-semibold text-ink-2 hover:text-ink [&::-webkit-details-marker]:hidden">
                  <ChevronRight className="size-4 transition-transform duration-200 group-open/more:rotate-90" aria-hidden />
                  More kinds of help ({others.length})
                </summary>
                <ul className="mt-2 hidden flex-wrap gap-1.5 group-open/more:flex">
                  {others.map((id) => (
                    <SupportChip key={id} id={id} on={profile.supports.includes(id)} onToggle={toggleSupport} />
                  ))}
                </ul>
              </details>
            )}
          </fieldset>

          <fieldset className="mt-4">
            <legend className="text-sm font-semibold text-ink-2">What should the student learn?</legend>
            <div className="mt-1.5 grid gap-2 sm:grid-cols-2" role="radiogroup">
              {(
                [
                  ["accommodate", "The same as everyone (best)", "Same learning goals. Only the way in changes."],
                  ["modify", "Change the goals", "Only if the student's plan allows it. Some questions can become optional."],
                ] as const
              ).map(([v, label, help]) => (
                <label key={v} className="option items-start gap-2.5 p-3">
                  <input type="radio" name="expectations" value={v} checked={profile.expectations === v} onChange={() => onChange({ ...profile, expectations: v })} className="mt-1" />
                  <span>
                    <span className="block text-sm font-bold">{label}</span>
                    <span className="block text-xs leading-snug text-ink-2">{help}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="mt-4 block text-sm font-semibold text-ink-2">
            Anything else that helps this student? <span className="font-normal text-ink-3">(optional)</span>
            <textarea
              className="field mt-2 min-h-[4.5rem] resize-y text-[0.95rem]"
              maxLength={300}
              value={profile.notes ?? ""}
              onChange={(e) => onChange({ ...profile, notes: e.target.value })}
              placeholder="For example: loves sports, likes typing more than writing. (No names or medical details.)"
            />
          </label>
        </div>
      </details>
      {action}
    </div>
  );
}

function SupportChip({ id, on, onToggle }: { id: SupportId; on: boolean; onToggle: (s: SupportId) => void }) {
  const s = SUPPORTS[id];
  return (
    <li>
      <button
        type="button"
        aria-pressed={on}
        onClick={() => onToggle(id)}
        title={s.description}
        className={cn("chip", !on && "text-ink-2")}
      >
        {on && <Check className="size-3.5" strokeWidth={3} aria-hidden />}
        {s.label}
        <span className="sr-only">: {s.description}</span>
      </button>
    </li>
  );
}
