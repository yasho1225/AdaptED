"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowDown, ArrowRight, Pause, Play } from "lucide-react";
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
 * First viewport: the product working, not a picture of it. One real worksheet, switchable in
 * place between the original and each adapted version. On every switch the key science words
 * lift off and land in their new places: the vocabulary is kept, only the way in changes.
 */
export function Hero() {
  const { calm } = useMotion();
  const [active, setActive] = useState<Version>("original");
  const [playing, setPlaying] = useState(false);
  const root = useRef<HTMLElement>(null);
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

  const changes = active === "original" ? [] : SCIENCE[active].changes.slice(0, 4);

  return (
    <section ref={root} id="top" data-mood="trust" aria-labelledby="hero-heading" className="relative">
      <div className="container-page pt-10 pb-16 sm:pt-14 lg:pt-16">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          {/* Words rise out of their lines on first paint (pure CSS, so no flash before hydration); calm mode shows them still. */}
          <h1 id="hero-heading" className="text-[3.9rem] sm:text-8xl lg:col-span-7 lg:text-[7.5rem] xl:text-[9rem]">
            <span className="hl-line">
              <Word i={0}>One</Word> <Word i={1}>lesson.</Word>
            </span>{" "}
            <span className="hl-line">
              <span className="relative isolate inline-block">
                <Word i={2}>Every</Word> <Word i={3}>learner.</Word>
                <span aria-hidden className="hero-underline absolute inset-x-[0.02em] -bottom-[0.1em] -z-10 h-[0.11em] rounded-full bg-brand" />
              </span>
            </span>
          </h1>
          <div className="lg:col-span-5 lg:pb-4">
            <p className="hero-rise max-w-[44ch] text-lg leading-relaxed text-ink-2 sm:text-xl">
              Paste in any assignment. AdaptED makes a version your student can use. They still learn the <strong className="font-bold text-ink">same things</strong>, and you see every change and why.
            </p>
            <div className="hero-rise mt-7 flex flex-wrap gap-3" style={{ "--i": 1 } as React.CSSProperties}>
              <CalmMagnet>
                <a href="#studio" className="btn btn-brand min-h-12 px-6 text-base">
                  Try it now <ArrowRight className="size-4" aria-hidden />
                </a>
              </CalmMagnet>
              <a href="#research" className="btn btn-ghost min-h-12 px-6 text-base">
                See the research
              </a>
            </div>
          </div>
        </div>

        {/* Live specimen */}
        {/* Small screens: tabs, then the sheet, then the reasons. Large: tabs and reasons beside the sheet. */}
        <div className="mt-12 grid grid-cols-1 gap-6 border-t border-rule pt-8 lg:mt-16 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-10 lg:gap-y-0">
          <div className="min-w-0 lg:col-span-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl">One worksheet, five versions</h2>
              {!calm && (
                <button type="button" onClick={() => setPlaying((p) => !p)} className="btn btn-ghost btn-sm size-11 !p-0" aria-label={playing ? "Pause the tour" : "Play the tour"}>
                  {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
                </button>
              )}
            </div>
            <p className="mt-2 text-ink-2">
              <span className="mark font-bold text-sheet-ink">The key words stay.</span> The way in changes.
            </p>
            <p className="mt-1 text-sm text-ink-3">
              Grade {SAMPLE.grade} {SAMPLE.subject.toLowerCase()} · pre-made example
            </p>

            <div role="tablist" aria-label="Version of the worksheet" aria-orientation="vertical" className="mt-5 -mx-4 flex gap-1 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
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
                      "group flex min-h-11 shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-left font-bold transition-colors lg:w-full",
                      on ? "bg-sheet text-sheet-ink" : "text-ink-2 hover:bg-white/10 hover:text-ink",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn("size-2.5 shrink-0 rounded-full", v === "original" ? "bg-brand" : "bg-[color:var(--need)]", on && v !== "original" && "outline outline-2 outline-offset-1 outline-sheet-ink/30")}
                    />
                    <span className="whitespace-nowrap">{label(v)}</span>
                    {playing && on && (
                      <span aria-hidden className="ml-auto hidden h-0.5 w-10 overflow-hidden rounded bg-sheet-ink/15 lg:block">
                        <span key={active} className="block h-full origin-left animate-[grow_linear_forwards] bg-sheet-ink/60" style={{ animationDuration: `${CYCLE_MS}ms` }} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="min-w-0 lg:col-span-8 lg:col-start-5 lg:row-span-2 lg:row-start-1">
            <div
              id="hero-sheet"
              ref={sheetRef}
              role="tabpanel"
              aria-labelledby={`hero-tab-${active}`}
              className="sheet relative h-[30rem] overflow-hidden sm:h-[36rem]"
              tabIndex={0}
            >
              <div data-version key={active} className="h-full">
                {active === "original" ? (
                  <div className="h-full px-6 py-6 sm:px-9 sm:py-8">
                    <p className="label !text-ink-3">Original assignment</p>
                    <OriginalDocument text={SAMPLE.text} barriers={barriers} className="mt-3 text-[0.98rem] text-ink-2" />
                  </div>
                ) : (
                  <AdaptedDocument assignment={SCIENCE[active]} need={active} headingLevel={3} />
                )}
              </div>
              <div ref={overlayRef} aria-hidden className="pointer-events-none absolute inset-0" />
              <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-28 bg-gradient-to-t from-sheet via-sheet/90 to-transparent" />
              <a
                href="#studio"
                onClick={openInStudio}
                className="absolute bottom-4 left-1/2 z-[3] inline-flex min-h-11 -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-md bg-sheet-ink px-4 text-sm font-bold text-white shadow-[var(--shadow-lift)]"
              >
                {active === "original" ? "Try it on this worksheet" : `Open the ${label(active)} version`} <ArrowDown className="size-4" aria-hidden />
              </a>
            </div>
          </div>
          <div className="min-w-0 lg:col-span-4 lg:col-start-1">
            <div className="border-t border-rule pt-5 lg:mt-6" aria-live="polite">
              {active === "original" ? (
                <>
                  <p className="font-bold">{barriers.length} things that could get in the way</p>
                  <ul className="mt-3 space-y-2.5 text-[0.95rem] text-ink-2">
                    {barriers.slice(0, 4).map((b, i) => (
                      <li key={i} className="flex gap-2.5">
                        <span aria-hidden className="mt-2 h-1 w-3 shrink-0 rounded-full bg-brand" />
                        {b.issue}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <p className="font-bold">{NEEDS[active].tagline}</p>
                  <ul className="mt-3 space-y-3 text-[0.95rem]">
                    {changes.map((c, i) => (
                      <li key={i}>
                        <span className="font-bold text-ink">{c.title}</span>
                        <span className="block text-sm text-ink-3">{getResearch(c.evidence)?.label}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
