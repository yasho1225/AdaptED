"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import { AdaptedDocument } from "@/components/doc/adapted-document";
import { OriginalDocument, barrierRanges } from "@/components/doc/original-document";
import { useMotion } from "@/components/motion/motion-provider";
import { computeMetrics, detectBarriers, normalize, originalReadingText } from "@/lib/adapt/analyze";
import { SCIENCE } from "@/lib/adapt/curated/science";
import { checkFidelity, readingText } from "@/lib/adapt/fidelity";
import { NEEDS } from "@/lib/adapt/profile";
import { SAMPLES } from "@/lib/adapt/samples";
import { NEED_IDS, type NeedId } from "@/lib/adapt/types";
import { OPEN_IN_STUDIO, type OpenInStudioDetail } from "@/lib/events";
import { cn } from "@/lib/utils";
import { captureTerms, flyTerms, tagTerms, type TermSnapshot } from "./term-flight";

type Version = "original" | NeedId;
const VERSIONS: Version[] = ["original", ...NEED_IDS];
const SAMPLE = SAMPLES[0];
const TITLE = SCIENCE.dyslexia.title;

function Word({ i, children }: { i: number; children: React.ReactNode }) {
  return (
    <span className="hl-word" style={{ "--i": i } as React.CSSProperties}>
      {children}
    </span>
  );
}

function label(v: Version) {
  return v === "original" ? "Original" : NEEDS[v].label;
}

/** A before/after number pair, read aloud as "9.6 to 6.9". */
function Change({ from, to }: { from: number; to: number }) {
  return (
    <span className="tnum font-bold whitespace-nowrap text-ink">
      {from.toFixed(1)} <span aria-hidden>→</span>
      <span className="sr-only">to</span> {to.toFixed(1)}
    </span>
  );
}

/**
 * First viewport: the headline and one action top-left; a flat highlighter-yellow stage, its corner
 * cut on the chisel slant, opens like a pen stroke and carries the real worksheet in a dark app frame.
 * Switching versions flies the key science words from where they were to where they land (the
 * vocabulary is kept, only the way in changes), and the caption quotes what AdaptED's own code
 * measured for that version: the same numbers the studio shows.
 */
export function Hero() {
  const { calm } = useMotion();
  const [active, setActive] = useState<Version>("original");
  const sheetRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const before = useRef<Map<string, TermSnapshot> | null>(null);
  const barriers = useMemo(() => {
    const all = detectBarriers(SAMPLE.text);
    return barrierRanges(normalize(SAMPLE.text).trim(), all).map((r) => all[r.index]);
  }, []);

  const go = (v: Version) => {
    const doc = sheetRef.current?.querySelector<HTMLElement>("[data-version]");
    // Tag lazily, on the first switch, so hydration never repaints the sheet (it is the LCP element).
    before.current = !calm && doc ? (tagTerms(doc, TITLE), captureTerms(doc)) : null;
    setActive(v);
  };

  // Tag the key words in the version that just rendered, then fly them in from where they were.
  useLayoutEffect(() => {
    const stage = sheetRef.current;
    const doc = stage?.querySelector<HTMLElement>("[data-version]");
    if (!stage || !doc || !overlayRef.current) return;
    const prev = before.current;
    before.current = null;
    if (calm || !prev) return;
    const terms = tagTerms(doc, TITLE);
    const fade = gsap.from(doc, { opacity: 0, y: 10, duration: 0.6, delay: 0.1, ease: "power2.out", clearProps: "opacity,transform" });
    const stop = flyTerms(stage, overlayRef.current, terms, prev);
    return () => {
      fade.kill();
      gsap.set(doc, { clearProps: "opacity,transform" });
      stop();
    };
  }, [active, calm]);

  const choose = (v: Version) => {
    if (v !== active) go(v);
  };

  const openInStudio = (e: React.MouseEvent) => {
    // The studio scrolls itself to the result, so the link's own jump to #studio is skipped.
    e.preventDefault();
    window.dispatchEvent(new CustomEvent<OpenInStudioDetail>(OPEN_IN_STUDIO, { detail: { need: active === "original" ? "dyslexia" : active } }));
  };

  // Measured lazily, for the version on screen only, so the first paint does no extra work.
  const readout = useMemo(() => {
    if (active === "original") return null;
    const fidelity = checkFidelity(SAMPLE.text, SCIENCE[active]);
    return {
      before: computeMetrics(originalReadingText(SAMPLE.text)),
      after: computeMetrics(readingText(SCIENCE[active])),
      kept: fidelity.matchedQuestions,
      total: fidelity.originalQuestions,
    };
  }, [active]);

  const caption = (
    <div aria-live="polite" className="max-w-[30rem] lg:min-h-[10.5rem]">
      <p className="font-bold">The key words stay. The way in changes.</p>
      {readout && active !== "original" ? (
        <p className={cn(`need-${active}`, "mt-2 text-ink-2")}>
          <span className="font-bold text-[color:var(--need)]">{NEEDS[active].label}:</span> reading level <Change from={readout.before.gradeLevel} to={readout.after.gradeLevel} />, words per sentence <Change from={readout.before.avgSentenceLength} to={readout.after.avgSentenceLength} />,{" "}
          <span className="tnum font-bold text-ink">
            {readout.kept} of {readout.total}
          </span>{" "}
          questions kept.
        </p>
      ) : (
        <p className="mt-2 text-ink-2">
          A grade {SAMPLE.grade} science worksheet, as written. <span className="mark font-semibold">Highlighted</span>: {barriers.length} things that could get in the way.
        </p>
      )}
      <a href="#studio" onClick={openInStudio} className="btn btn-ghost btn-sm mt-5">
        {active === "original" ? "Try it on this worksheet" : `Open the ${label(active)} version`} <ArrowRight className="size-4" aria-hidden />
      </a>
    </div>
  );

  return (
    <section id="top" aria-labelledby="hero-heading" className="relative overflow-hidden">
      <div className="container-page grid lg:min-h-[max(46rem,calc(100svh-4rem))] lg:grid-cols-[minmax(0,38fr)_minmax(0,62fr)] lg:grid-rows-[auto_1fr] lg:gap-x-10">
        {/* Words rise out of their lines on first paint (pure CSS, so no flash before hydration); calm mode shows them still. */}
        <div className="pt-12 sm:pt-16 lg:col-span-2 lg:pt-20">
          <h1 id="hero-heading" className="t-display">
            <span className="hl-line">
              <Word i={0}>One</Word> <Word i={1}>lesson.</Word>
            </span>{" "}
            <span className="hl-line">
              <Word i={2}>Every</Word> <Word i={3}>learner.</Word>
            </span>
          </h1>
        </div>

        <div className="pt-8 pb-10 lg:pb-16">
          <p className="hero-rise t-lead max-w-[34ch]">Paste in any assignment. Get a version your student can use, with the same goals and every change explained.</p>
          <div className="hero-rise mt-8" style={{ "--i": 1 } as React.CSSProperties}>
            <a href="#studio" className="btn btn-brand">
              Try it now <ArrowRight className="size-4" aria-hidden />
            </a>
          </div>
          <div className="mt-14 hidden lg:block">{caption}</div>
        </div>

        {/* The stage: a flat yellow field cut on the chisel slant, bleeding off the right and bottom edges. */}
        <div className="stage-wipe bleed-x relative mt-2 overflow-hidden lg:bleed-right lg:mt-8">
          <div aria-hidden className="chisel-start absolute inset-0 bg-yellow [--cut:4.5rem] lg:[--cut:9rem]" />
          {/* On large screens the worksheet is cropped by the section's bottom edge instead of setting its height. */}
          <div className="stage-settle relative px-4 pt-4 sm:px-8 sm:pt-8 lg:absolute lg:inset-0 lg:pt-14 lg:pr-0 lg:pl-14">
            {/* A dark app frame: the version tabs, with the selected one joined to the paper below it. */}
            <div data-ui className="relative flex h-[30rem] w-full flex-col overflow-hidden rounded-t-xl bg-surface sm:h-[34rem] lg:h-[40rem] lg:max-w-[42rem]">
              <div className="px-2 pt-2">
                <div role="tablist" aria-label="Version of the worksheet" className="flex min-w-0 gap-1 overflow-x-auto">
                  {VERSIONS.map((v) => {
                    const on = v === active;
                    return (
                      <button
                        key={v}
                        role="tab"
                        id={`hero-tab-${v}`}
                        aria-selected={on}
                        aria-controls="hero-sheet"
                        tabIndex={on ? 0 : -1}
                        onClick={() => choose(v)}
                        onKeyDown={(e) => {
                          const i = VERSIONS.indexOf(active);
                          if (["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(e.key)) {
                            e.preventDefault();
                            const d = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1;
                            const next = VERSIONS[(i + d + VERSIONS.length) % VERSIONS.length];
                            choose(next);
                            document.getElementById(`hero-tab-${next}`)?.focus();
                          }
                        }}
                        className={cn(
                          v !== "original" && `need-${v}`,
                          "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-t-lg px-3.5 text-sm font-semibold transition-colors duration-200",
                          on ? "bg-sheet text-sheet-ink" : "text-ink-2 hover:text-ink",
                        )}
                      >
                        <span aria-hidden className={cn("size-2 shrink-0 rounded-full", v === "original" ? "bg-yellow" : "bg-[color:var(--need)]")} />
                        {label(v)}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div id="hero-sheet" ref={sheetRef} role="tabpanel" aria-labelledby={`hero-tab-${active}`} className="sheet relative min-h-0 flex-1 overflow-hidden rounded-none" tabIndex={0}>
                <div data-version key={active}>
                  {active === "original" ? (
                    <div className="px-6 py-6 sm:px-9 sm:py-8">
                      <p className="label !text-ink-3">Original assignment · grade {SAMPLE.grade} science</p>
                      <OriginalDocument text={SAMPLE.text} barriers={barriers} className="mt-3 text-[0.98rem] text-ink-2" />
                    </div>
                  ) : (
                    <AdaptedDocument assignment={SCIENCE[active]} need={active} headingLevel={3} />
                  )}
                </div>
                <div ref={overlayRef} aria-hidden className="pointer-events-none absolute inset-0" />
              </div>
            </div>
          </div>
        </div>

        <div className="py-10 lg:hidden">{caption}</div>
      </div>
    </section>
  );
}
