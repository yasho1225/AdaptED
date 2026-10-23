"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowRight, Pause, Play } from "lucide-react";
import { AdaptedDocument } from "@/components/doc/adapted-document";
import { OriginalDocument, barrierRanges } from "@/components/doc/original-document";
import { CalmMagnet } from "@/components/motion/calm-magnet";
import { useMotion } from "@/components/motion/motion-provider";
import { detectBarriers, normalize } from "@/lib/adapt/analyze";
import { SCIENCE } from "@/lib/adapt/curated/science";
import { NEEDS } from "@/lib/adapt/profile";
import { getResearch } from "@/lib/adapt/research";
import { SAMPLES } from "@/lib/adapt/samples";
import { NEED_IDS, type NeedId } from "@/lib/adapt/types";
import { OPEN_IN_STUDIO, type OpenInStudioDetail } from "@/lib/events";
import { cn } from "@/lib/utils";
import { captureTerms, flyTerms, tagTerms, type TermSnapshot } from "./term-flight";

type Version = "original" | NeedId;
const VERSIONS: Version[] = ["original", ...NEED_IDS];
const SAMPLE = SAMPLES[0];
const CYCLE_MS = 5200;
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

/**
 * First viewport (tasteskill blueprint "Fragment on a shaped stage"): the headline and one action
 * top-left; a flat highlighter-yellow stage, its corner cut on the chisel slant, opens like a pen
 * stroke and carries the real worksheet. Switching versions flies the key science words from where
 * they were to where they land: the vocabulary is kept, only the way in changes.
 */
export function Hero() {
  const { calm } = useMotion();
  const [active, setActive] = useState<Version>("original");
  const [playing, setPlaying] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const before = useRef<Map<string, TermSnapshot> | null>(null);
  const barriers = useMemo(() => {
    const all = detectBarriers(SAMPLE.text);
    return barrierRanges(normalize(SAMPLE.text).trim(), all).map((r) => all[r.index]);
  }, []);

  // Auto-advance once through every version (WCAG 2.2.2: visible pause, stops on interaction, off in calm mode).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlaying(!calm);
  }, [calm]);

  const go = (v: Version) => {
    const doc = sheetRef.current?.querySelector<HTMLElement>("[data-version]");
    // Tag lazily, on the first switch, so hydration never repaints the sheet (it is the LCP element).
    before.current = !calm && doc ? (tagTerms(doc, TITLE), captureTerms(doc)) : null;
    setActive(v);
  };

  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => {
      const i = VERSIONS.indexOf(active);
      if (i === VERSIONS.length - 1) setPlaying(false);
      else go(VERSIONS[i + 1]);
    }, CYCLE_MS);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, active]);

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
    setPlaying(false);
    if (v !== active) go(v);
  };

  const openInStudio = (e: React.MouseEvent) => {
    // The studio scrolls itself to the result; keep Lenis's anchor handler from scrolling to #studio instead.
    e.preventDefault();
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent<OpenInStudioDetail>(OPEN_IN_STUDIO, { detail: { need: active === "original" ? "dyslexia" : active } }));
  };

  const changes = active === "original" ? [] : SCIENCE[active].changes.slice(0, 3);

  const notes = (
    <div aria-live="polite" className="max-w-[26rem] lg:min-h-[19rem]">
      <p className="text-lg font-bold">The key words stay. The way in changes.</p>
      {active === "original" ? (
        <>
          <p className="mt-4 text-ink-2">
            {barriers.length} things in this grade {SAMPLE.grade} worksheet could get in the way:
          </p>
          <ul className="mt-3 space-y-2.5">
            {barriers.slice(0, 3).map((b, i) => (
              <li key={i} className="flex items-baseline gap-3">
                <span aria-hidden className="bullet text-brand" />
                <span>{b.issue}</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <p className={cn(`need-${active}`, "mt-4 text-ink-2")}>
            <span className="font-bold text-[color:var(--need)]">{NEEDS[active].label}:</span> {NEEDS[active].tagline}
          </p>
          <ul className="mt-3 space-y-3">
            {changes.map((c, i) => (
              <li key={i} className={cn(`need-${active}`, "flex items-baseline gap-3")}>
                <span aria-hidden className="bullet text-[color:var(--need)]" />
                <span>
                  <span className="font-bold">{c.title}</span>
                  <span className="block text-sm text-ink-3">{getResearch(c.evidence)?.label}</span>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
      <a href="#studio" onClick={openInStudio} className="btn btn-ghost btn-sm mt-6">
        {active === "original" ? "Try it on this worksheet" : `Open the ${label(active)} version`} <ArrowRight className="size-4" aria-hidden />
      </a>
    </div>
  );

  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="field-blue relative overflow-hidden"
      // Keyboard focus inside the hero ends the tour, so nothing changes under it.
      onFocus={(e) => playing && e.target.matches(":focus-visible") && setPlaying(false)}
    >
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
            <CalmMagnet>
              <a href="#studio" className="btn btn-brand">
                Try it now <ArrowRight className="size-4" aria-hidden />
              </a>
            </CalmMagnet>
          </div>
          <div className="mt-14 hidden lg:block">{notes}</div>
        </div>

        {/* The stage: a flat yellow field cut on the chisel slant, bleeding off the right and bottom edges. */}
        <div className="stage-wipe bleed-x relative mt-2 overflow-hidden lg:bleed-right lg:mt-8">
          <div aria-hidden className="chisel-start absolute inset-0 bg-yellow [--cut:4.5rem] lg:[--cut:9rem]" />
          {/* On large screens the worksheet is cropped by the section's bottom edge instead of setting its height. */}
          <div className="stage-settle relative px-4 pt-4 sm:px-8 sm:pt-8 lg:absolute lg:inset-0 lg:pt-14 lg:pr-0 lg:pl-14">
            <div data-ui className="sheet relative h-[30rem] w-full overflow-hidden rounded-b-none sm:h-[34rem] lg:h-[40rem] lg:max-w-[42rem]">
              <div className="flex items-center gap-2 bg-paper-2 p-1.5">
                <div role="tablist" aria-label="Version of the worksheet" className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
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
                        className={cn(v !== "original" && `need-${v}`, "tab relative inline-flex shrink-0 items-center gap-2 !px-3 text-sm")}
                      >
                        <span aria-hidden className={cn("size-2 shrink-0 rounded-full", v === "original" ? "bg-[#0e2fa3]" : "bg-[color:var(--need)]")} />
                        {label(v)}
                        {playing && on && (
                          <span aria-hidden className="absolute inset-x-3 bottom-1 h-0.5 overflow-hidden rounded bg-sheet-ink/10">
                            <span key={active} className="block h-full origin-left animate-[grow_linear_forwards] bg-sheet-ink/50" style={{ animationDuration: `${CYCLE_MS}ms` }} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {!calm && (
                  <button type="button" onClick={() => setPlaying((p) => !p)} className="grid size-10 shrink-0 place-items-center rounded-md text-ink-2 transition-colors hover:bg-sheet hover:text-ink" aria-label={playing ? "Pause the tour" : "Play the tour"}>
                    {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
                  </button>
                )}
              </div>
              <div id="hero-sheet" ref={sheetRef} role="tabpanel" aria-labelledby={`hero-tab-${active}`} className="relative h-full overflow-hidden" tabIndex={0}>
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

        <div className="py-10 lg:hidden">{notes}</div>
      </div>
    </section>
  );
}
