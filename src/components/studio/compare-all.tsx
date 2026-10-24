"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { AdaptedDocument } from "@/components/doc/adapted-document";
import { requestAdaptation } from "@/lib/adapt/client";
import { NEEDS, defaultProfile, writtenIn } from "@/lib/adapt/profile";
import { NEED_IDS, type AdaptResult, type LearnerProfile, type NeedId } from "@/lib/adapt/types";
import { cn } from "@/lib/utils";

type Slot = { status: "loading" } | { status: "done"; result: AdaptResult } | { status: "error"; message: string };

/** The same assignment adapted for each of the four needs, side by side. */
export function CompareAll({ source, base }: { source: string; base: LearnerProfile }) {
  const [slots, setSlots] = useState<Record<NeedId, Slot>>(() => Object.fromEntries(NEED_IDS.map((n) => [n, { status: "loading" }])) as Record<NeedId, Slot>);

  useEffect(() => {
    const controller = new AbortController();
    NEED_IDS.forEach((n) => {
      const profile: LearnerProfile = { ...defaultProfile(n), grade: base.grade, language: base.language };
      requestAdaptation(source, profile, { signal: controller.signal })
        .then((result) => setSlots((s) => ({ ...s, [n]: { status: "done", result } })))
        .catch((e: unknown) => {
          if (controller.signal.aborted) return;
          setSlots((s) => ({ ...s, [n]: { status: "error", message: e instanceof Error ? e.message : "Couldn’t make this version." } }));
        });
    });
    return () => controller.abort();
  }, [source, base.grade, base.language]);

  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 lg:mx-0 lg:grid lg:grid-cols-2 lg:overflow-visible lg:px-0 2xl:grid-cols-4">
      {NEED_IDS.map((n) => {
        const slot = slots[n];
        return (
          <section key={n} data-ui className={cn(`need-${n}`, "panel flex w-[86vw] max-w-md shrink-0 snap-center flex-col overflow-hidden lg:w-auto lg:max-w-none")} aria-label={`${NEEDS[n].label} version`}>
            <header className="px-4 py-3">
              <p className="flex items-center gap-2 font-bold">
                <span aria-hidden className="size-2 shrink-0 rounded-full bg-[color:var(--need)]" />
                {NEEDS[n].label}
              </p>
              <p className="text-xs text-ink-3">{NEEDS[n].tagline}</p>
            </header>
            {slot.status === "done" ? (
              <>
                <ul className="flex flex-wrap gap-1 px-4 pb-3">
                  {slot.result.assignment.changes.slice(0, 3).map((c, i) => (
                    <li key={i} className="rounded-full bg-paper-2 px-2 py-0.5 text-xs font-semibold">
                      {c.title}
                    </li>
                  ))}
                </ul>
                <div className="sheet max-h-[34rem] overflow-y-auto rounded-none" tabIndex={0} aria-label={`${NEEDS[n].label} adapted assignment, scrollable`}>
                  <AdaptedDocument assignment={slot.result.assignment} need={n} compact headingLevel={3} language={writtenIn(slot.result)} />
                </div>
              </>
            ) : slot.status === "error" ? (
              <p className="p-4 text-sm font-semibold text-warn">{slot.message}</p>
            ) : (
              <p className="flex items-center gap-2 p-4 text-sm text-ink-3">
                <Loader2 className="size-4 animate-spin" aria-hidden /> Adapting…
              </p>
            )}
          </section>
        );
      })}
    </div>
  );
}
