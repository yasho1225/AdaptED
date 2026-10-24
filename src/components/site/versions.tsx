"use client";

import Image from "next/image";
import { useState } from "react";
import { NEEDS, SUPPORTS } from "@/lib/adapt/profile";
import { RESEARCH } from "@/lib/adapt/research";
import { NEED_IDS, type NeedId } from "@/lib/adapt/types";
import { cn } from "@/lib/utils";

/** One version at a time: its picture, what it is for, and each kind of help it starts with, with the source. */
export function Versions() {
  const [active, setActive] = useState<NeedId>("dyslexia");
  const supports = NEEDS[active].defaultSupports;

  const select = (n: NeedId, focus = false) => {
    setActive(n);
    if (focus) document.getElementById(`versions-tab-${n}`)?.focus();
  };

  return (
    <section id="versions" aria-labelledby="versions-heading" className="scroll-mt-16 py-24 sm:py-32">
      <div className="container-page">
        <div data-rise-group className="grid gap-x-10 gap-y-6 lg:grid-cols-12 lg:items-end">
          <h2 id="versions-heading" data-reveal className="t-head lg:col-span-7">
            What each version adds
          </h2>
          <p data-rise className="max-w-[44ch] text-ink-2 lg:col-span-5">
            The help each version starts with. Teachers can turn any of it off, or add more from 21 kinds of help.
          </p>
        </div>

        <div data-rise className="mt-12">
          <div role="tablist" aria-label="Versions" className="grid grid-cols-2 gap-1 rounded-xl bg-surface p-1 sm:inline-flex">
            {NEED_IDS.map((n, i) => (
              <button
                key={n}
                role="tab"
                id={`versions-tab-${n}`}
                aria-selected={active === n}
                aria-controls="versions-panel"
                tabIndex={active === n ? 0 : -1}
                onClick={() => select(n)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                    e.preventDefault();
                    select(NEED_IDS[(i + (e.key === "ArrowRight" ? 1 : NEED_IDS.length - 1)) % NEED_IDS.length], true);
                  }
                }}
                className={cn(`need-${n}`, "tab inline-flex items-center justify-center gap-2 !px-4 !text-base")}
              >
                <span aria-hidden className="size-2 shrink-0 rounded-full bg-[color:var(--need)]" />
                {NEEDS[n].label}
              </button>
            ))}
          </div>

          <div role="tabpanel" id="versions-panel" aria-labelledby={`versions-tab-${active}`} className={cn(`need-${active}`, "mt-10 grid gap-10 lg:grid-cols-12")}>
            <div className="lg:col-span-5">
              {/* The picture starts past the slanted edge, so the cut only trims paper. */}
              <div className="chisel-start relative aspect-[4/3] w-full max-w-[30rem] overflow-hidden bg-sheet [--cut:2.5rem]">
                <div className="absolute inset-y-0 right-0 left-[var(--cut)]">
                  <Image src={`/images/need-${active}.webp`} alt={`The top of the ${NEEDS[active].label} version of the sample worksheet`} fill sizes="(min-width: 1024px) 26rem, 85vw" className="object-contain object-left-top" />
                </div>
              </div>
              <p className="mt-6 max-w-[30ch] text-2xl leading-snug font-bold">{NEEDS[active].tagline}</p>
              <p className="mt-2 text-ink-3">{supports.length} kinds of help to start</p>
            </div>
            <ul className="grid content-start gap-x-10 gap-y-8 sm:grid-cols-2 lg:col-span-7 lg:pt-1">
              {supports.map((id) => {
                const s = SUPPORTS[id];
                const source = RESEARCH[s.evidence[0]];
                return (
                  <li key={id} className="flex gap-4">
                    <span aria-hidden className="bullet mt-[0.55em] text-[color:var(--need)]" />
                    <span className="min-w-0">
                      <span className="block text-lg font-bold">{s.label}</span>
                      <span className="mt-1 block max-w-[38ch] text-ink-2">{s.description}</span>
                      {source && (
                        <a href={source.url} target="_blank" rel="noreferrer" className="-my-3 mt-0.5 inline-block py-3 text-sm font-bold text-[color:var(--need)] underline decoration-current/30 underline-offset-[0.2em] hover:decoration-current">
                          {source.label}
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
