"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowDown, ArrowRight, Pause, Play } from "lucide-react";
import { AdaptedDocument } from "@/components/doc/adapted-document";
import { OriginalDocument, barrierRanges } from "@/components/doc/original-document";
import { useMotion } from "@/components/motion/motion-provider";
import { detectBarriers, normalize } from "@/lib/adapt/analyze";
import { CURATED } from "@/lib/adapt/curated";
import { NEEDS } from "@/lib/adapt/profile";
import { getResearch } from "@/lib/adapt/research";
import { SAMPLES } from "@/lib/adapt/samples";
import { NEED_IDS, type NeedId } from "@/lib/adapt/types";
import { cn } from "@/lib/utils";

type Version = "original" | NeedId;
const VERSIONS: Version[] = ["original", ...NEED_IDS];
const SAMPLE = SAMPLES[0];
const CYCLE_MS = 4200;

function label(v: Version) {
  return v === "original" ? "Original" : NEEDS[v].label;
}

/**
 * First viewport: the product working, not a picture of it. One real worksheet,
 * switchable in place between the original and each adapted version, with the
 * reasons for the changes beside it.
 */
export function Hero() {
  const { calm } = useMotion();
  const [active, setActive] = useState<Version>("original");
  const [playing, setPlaying] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const barriers = useMemo(() => {
    const all = detectBarriers(SAMPLE.text);
    return barrierRanges(normalize(SAMPLE.text).trim(), all).map((r) => all[r.index]);
  }, []);

  // Auto-advance once through every version (WCAG 2.2.2: visible pause, stops on interaction, off in calm mode).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlaying(!calm);
  }, [calm]);
  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => {
      const i = VERSIONS.indexOf(active);
      if (i === VERSIONS.length - 1) setPlaying(false);
      else setActive(VERSIONS[i + 1]);
    }, CYCLE_MS);
    return () => window.clearTimeout(t);
  }, [playing, active]);

  // The one authored motion: each version is wiped onto the sheet like a highlighter stroke.
  useEffect(() => {
    if (calm || !sheetRef.current) return;
    const el = sheetRef.current.querySelector("[data-version]");
    if (!el) return;
    const tween = gsap.fromTo(el, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.7, ease: "expo.out", clearProps: "clipPath" });
    return () => {
      tween.kill();
    };
  }, [active, calm]);

  const choose = (v: Version) => {
    setPlaying(false);
    setActive(v);
  };

  const changes = active === "original" ? [] : CURATED.science[active].changes.slice(0, 4);

  return (
    <section id="top" aria-labelledby="hero-heading" className="relative">
      <div className="container-page pt-10 pb-16 sm:pt-14 lg:pt-14">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <h1 id="hero-heading" className="text-[3.25rem] leading-[0.95] tracking-[-0.035em] sm:text-7xl lg:col-span-7 xl:text-[6rem]">
            One lesson.
            <br />
            <span className="relative isolate inline-block">
              Every learner.
              <span aria-hidden className="absolute inset-x-[0.02em] -bottom-[0.14em] -z-10 h-[0.12em] rounded-full bg-brand" />
            </span>
          </h1>
          <div className="lg:col-span-5 lg:pb-3">
            <p className="max-w-[46ch] text-lg leading-relaxed text-ink-2 sm:text-xl">
              Give AdaptED the assignment you already teach. It finds what would block a specific student and rebuilds the <strong className="font-bold text-ink">access</strong>, not the learning goals, with every change explained.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#studio" className="btn btn-brand min-h-12 px-6 text-base">
                Adapt an assignment <ArrowRight className="size-4" aria-hidden />
              </a>
              <a href="#research" className="btn btn-ghost min-h-12 px-6 text-base">
                See the research
              </a>
            </div>
          </div>
        </div>

        {/* Live specimen */}
        <div className="mt-12 grid grid-cols-1 gap-6 border-t border-rule pt-8 lg:mt-14 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 lg:col-span-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl tracking-[-0.015em]">The same worksheet, five ways</h2>
              {!calm && (
                <button type="button" onClick={() => setPlaying((p) => !p)} className="btn btn-ghost btn-sm !px-2.5" aria-label={playing ? "Pause the tour" : "Play the tour"}>
                  {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
                </button>
              )}
            </div>
            <p className="mt-1 text-sm text-ink-3">
              Grade {SAMPLE.grade} {SAMPLE.subject.toLowerCase()} · pre-built example
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
                      "group flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-left font-bold transition-colors lg:w-full",
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
                        <span key={active} className="block h-full origin-left animate-[grow_4.2s_linear_forwards] bg-sheet-ink/60" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 border-t border-rule pt-5" aria-live="polite">
              {active === "original" ? (
                <>
                  <p className="font-bold">{barriers.length} barriers marked in the original</p>
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

          <div className="min-w-0 lg:col-span-8">
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
                  <AdaptedDocument assignment={CURATED.science[active]} need={active} headingLevel={3} />
                )}
              </div>
              <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-sheet via-sheet/90 to-transparent" />
              <a href="#studio" className="absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-md bg-sheet-ink px-4 py-2 text-sm font-bold text-white shadow-[var(--shadow-lift)]">
                Open the full version <ArrowDown className="size-4" aria-hidden />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
