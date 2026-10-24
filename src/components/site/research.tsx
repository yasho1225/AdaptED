"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { NEEDS, SUPPORT_IDS, SUPPORTS } from "@/lib/adapt/profile";
import { RESEARCH } from "@/lib/adapt/research";
import { NEED_IDS, type NeedId } from "@/lib/adapt/types";
import { cn } from "@/lib/utils";
import { ExternalLink } from "./external-link";

/** The organisations whose guidance the rules follow, in the order the sentence names them. */
const ORGS: { name: string; href: string }[] = [
  { name: "CAST’s Universal Design for Learning", href: RESEARCH["udl-language"].url.replace(/representation\/.*$/, "") },
  { name: "the International Dyslexia Association", href: RESEARCH["ida-accommodations"].url },
  { name: "ASHA", href: RESEARCH["asha-capd"].url },
  { name: "the British Dyslexia Association", href: RESEARCH["bda-style"].url },
  { name: "TEACCH", href: RESEARCH.teacch.url },
  { name: "NCAEP", href: RESEARCH.ncaep.url },
];

const STUDIES = ["tts-meta", "letter-spacing", "dyslexia-fonts", "guided-notes", "figurative", "self-regulation", "segmenting"];

const linkClass = "font-bold text-ink underline decoration-ink-3/60 underline-offset-[0.2em] hover:decoration-brand";

/**
 * What each version adds and why, one version at a time: its picture, what it is for, and each
 * kind of help it starts with, linked to its source. The guidance behind the rules is one
 * sentence; the studies wait behind one disclosure.
 */
export function Research() {
  const [active, setActive] = useState<NeedId>("dyslexia");
  const supports = NEEDS[active].defaultSupports;

  const select = (n: NeedId, focus = false) => {
    setActive(n);
    if (focus) document.getElementById(`versions-tab-${n}`)?.focus();
  };

  return (
    <section id="research" aria-labelledby="research-heading" className="py-16 sm:py-20">
      <div className="container-page">
        <div className="grid gap-x-10 gap-y-6 lg:grid-cols-12 lg:items-end">
          <h2 id="research-heading" className="t-head lg:col-span-7">
            Built on research
          </h2>
          <p className="max-w-[44ch] text-ink-2 lg:col-span-5">
            Each version starts with the help research supports for that need, and every kind of help links to its source. Teachers can turn any of it off, or add more.
          </p>
        </div>

        <div className="mt-10">
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

          <div role="tabpanel" id="versions-panel" aria-labelledby={`versions-tab-${active}`} className={cn(`need-${active}`, "mt-8 grid gap-10 lg:grid-cols-12")}>
            <div className="lg:col-span-5">
              {/* The picture starts past the slanted edge, so the cut only trims paper. */}
              <div className="chisel-start relative aspect-[4/3] w-full max-w-[30rem] overflow-hidden bg-sheet [--cut:2.5rem]">
                <div className="absolute inset-y-0 right-0 left-[var(--cut)]">
                  <Image src={`/images/need-${active}.webp`} alt={`The top of the ${NEEDS[active].label} version of the sample worksheet`} fill sizes="(min-width: 1024px) 26rem, 85vw" className="object-contain object-left-top" />
                </div>
              </div>
              <p className="mt-6 max-w-[30ch] text-2xl leading-snug font-bold">{NEEDS[active].tagline}</p>
              <p className="mt-2 text-ink-3">{supports.length} kinds of help to start, out of {SUPPORT_IDS.length}</p>
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
                        <ExternalLink href={source.url} className="-my-3 mt-0.5 inline-block py-3 text-sm font-bold text-[color:var(--need)] underline decoration-current/30 underline-offset-[0.2em] hover:decoration-current">
                          {source.label}
                        </ExternalLink>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <p className="mt-14 max-w-[60ch] text-lg text-ink-2">
          The rules follow guidance from{" "}
          {ORGS.map((o, i) => (
            <span key={o.name}>
              {i > 0 && (i === ORGS.length - 1 ? ", and " : ", ")}
              <ExternalLink href={o.href} className={linkClass}>
                {o.name}
              </ExternalLink>
            </span>
          ))}
          .
        </p>

        <details className="group/studies mt-6 rounded-xl bg-surface">
          <summary className="flex min-h-16 list-none items-center justify-between gap-4 rounded-xl px-6 py-4 text-xl font-bold transition-colors duration-200 hover:bg-surface-2 sm:px-7 [&::-webkit-details-marker]:hidden">
            Peer-reviewed studies ({STUDIES.length})
            <ChevronDown className="size-5 shrink-0 transition-transform duration-200 group-open/studies:rotate-180" aria-hidden />
          </summary>
          <ul className="hidden gap-x-8 gap-y-4 px-6 pt-2 pb-7 group-open/studies:grid sm:grid-cols-2 sm:px-7 lg:grid-cols-3">
            {STUDIES.map((id) => {
              const r = RESEARCH[id];
              return (
                <li key={id}>
                  <ExternalLink href={r.url} className="group block text-ink">
                    <span className="font-bold underline decoration-ink-3/60 underline-offset-[0.2em] group-hover:decoration-brand">{r.label}</span>
                    <span className="block text-sm text-ink-2">{r.citation}</span>
                  </ExternalLink>
                </li>
              );
            })}
          </ul>
        </details>
      </div>
    </section>
  );
}
