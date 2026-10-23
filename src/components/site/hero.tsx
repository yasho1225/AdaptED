"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowRight, BookOpen, Check, MessagesSquare, PencilLine, Timer } from "lucide-react";
import { useMotion } from "@/components/motion/motion-provider";
import { SplitText } from "@/components/motion/split-text";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function M({ children }: { children: React.ReactNode }) {
  return (
    <mark className="hero-mark rounded-[0.2em] bg-[linear-gradient(104deg,transparent_2px,var(--mark)_4px,var(--mark)_calc(100%-4px),transparent_calc(100%-2px))] bg-no-repeat px-0.5 text-inherit [box-decoration-break:clone]" style={{ backgroundSize: "var(--mark-size, 100%) 100%" }}>
      {children}
    </mark>
  );
}

const CARD_POS = [
  "lg:left-0 lg:top-2 lg:-rotate-[4deg]",
  "lg:right-0 lg:top-0 lg:rotate-[3deg]",
  "lg:left-3 lg:bottom-0 lg:rotate-[2.5deg]",
  "lg:right-2 lg:bottom-3 lg:-rotate-[3.5deg]",
];

function MiniCard({ need, label, children, i }: { need: string; label: string; children: React.ReactNode; i: number }) {
  return (
    <div className={cn(`need-${need}`, "hero-card sheet w-full overflow-hidden lg:absolute lg:z-20 lg:w-[15.5rem]", CARD_POS[i])} data-i={i}>
      <p className="bg-[color:var(--need-soft)] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[color:var(--need)]">{label}</p>
      <div className="space-y-1.5 px-3 py-2.5 text-[0.78rem] leading-snug">{children}</div>
    </div>
  );
}

export function Hero() {
  const { calm } = useMotion();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (calm) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=110%", scrub: 0.7, pin: true, anticipatePin: 1 },
        });
        tl.fromTo(".hero-mark", { "--mark-size": "0%" }, { "--mark-size": "100%", stagger: 0.12, duration: 0.5, ease: "none" })
          .fromTo(".hero-barriers", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3 }, "<0.3")
          .from(
            ".hero-card",
            {
              // Start every card stacked under the original worksheet, then deal them out.
              x: (_i: number, el: HTMLElement) => {
                const s = el.parentElement!.getBoundingClientRect();
                const r = el.getBoundingClientRect();
                return s.left + s.width / 2 - (r.left + r.width / 2);
              },
              y: (_i: number, el: HTMLElement) => {
                const s = el.parentElement!.getBoundingClientRect();
                const r = el.getBoundingClientRect();
                return s.top + s.height / 2 - (r.top + r.height / 2);
              },
              scale: 0.6,
              opacity: 0,
              duration: 1,
              stagger: 0.06,
              ease: "power2.out",
            },
            ">0.1",
          )
          .to(".hero-original", { scale: 0.84, filter: "brightness(0.92)", duration: 1, ease: "power2.out" }, "<");
      });
      // Gentle intro on load (all sizes)
      gsap.from(".hero-copy > *", { y: 20, opacity: 0, duration: 0.8, stagger: 0.08, ease: "power3.out", delay: 0.35 });
      return () => mm.revert();
    },
    { scope: root, dependencies: [calm] },
  );

  return (
    <section id="top" ref={root} className="relative overflow-hidden" aria-labelledby="hero-heading">
      <div className="container-page grid min-h-[calc(100svh-4rem)] items-center gap-12 py-14 lg:grid-cols-[1fr_1.05fr] lg:py-10">
        <div>
          <p className="eyebrow">For teachers · Dyslexia · ADHD · Auditory processing · Autism</p>
          <h1 id="hero-heading" className="mt-5 text-[3.1rem] font-semibold leading-[0.98] sm:text-7xl xl:text-[5.4rem]">
            <SplitText text="One lesson." className="block" />
            <SplitText text="Every learner." className="block italic text-brand-ink [font-variation-settings:'SOFT'_100]" delay={0.18} />
          </h1>
          <div className="hero-copy">
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-2 sm:text-xl">
              Give AdaptED the assignment you already have. It finds what could block a specific student, rebuilds the <strong className="text-ink">access</strong> — not the learning goals — and shows you every change and the research behind it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#studio" className="btn btn-brand min-h-12 px-6 text-base">
                Adapt an assignment <ArrowRight className="size-4" aria-hidden />
              </a>
              <a href="#how" className="btn btn-ghost min-h-12 px-6 text-base">
                How it decides
              </a>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-ink-3">
              {["Every question kept", "No answers given away", "No student data stored"].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <Check className="size-4 text-ok" aria-hidden /> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative" aria-label="Illustration: one worksheet becomes four adapted versions" role="img">
          <div className="relative grid gap-3 sm:grid-cols-2 lg:block lg:h-[36rem]" aria-hidden>
            <div className="hero-original sheet ruled relative z-10 p-5 sm:col-span-2 lg:absolute lg:left-1/2 lg:top-1/2 lg:w-[23rem] lg:-translate-x-1/2 lg:-translate-y-1/2">
              <p className="eyebrow">Grade 7 · Science</p>
              <p className="mt-1 font-display text-lg font-semibold">Photosynthesis and Ecosystems</p>
              <p className="mt-2 text-[0.8rem] leading-6 text-ink-2">
                <M>Inside the chloroplasts of leaf cells, the pigment chlorophyll absorbs sunlight; the plant then uses that energy to combine carbon dioxide…</M> <M>In a nutshell</M>, photosynthesis is the engine that keeps the whole ecosystem running.
              </p>
              <p className="mt-2 text-[0.8rem] leading-6 text-ink-2">
                5. <M>Discuss with a partner</M>: predict what would happen… <M>Briefly explain</M> your reasoning.
              </p>
              <p className="hero-barriers mt-3 inline-flex items-center gap-1.5 rounded-full bg-mark-strong px-2.5 py-0.5 text-xs font-bold text-[oklch(0.22_0.03_265)]">4 barriers found</p>
            </div>

            <MiniCard need="dyslexia" label="Dyslexia" i={0}>
              <p className="font-bold">photosynthesis</p>
              <p className="font-mono text-[color:var(--need)]">pho·to·syn·the·sis</p>
              <p className="text-ink-2">Leaf cells have tiny parts called <strong>chloroplasts</strong>. Inside them, chlorophyll absorbs sunlight.</p>
            </MiniCard>
            <MiniCard need="adhd" label="ADHD" i={1}>
              <p className="flex items-center gap-1 font-bold"><Timer className="size-3.5" /> Start here · 1 min</p>
              <p className="text-ink-2">Circle the word photosynthesis each time you see it (there are 3).</p>
              <p className="flex items-center gap-1.5"><span className="size-3.5 rounded border-2 border-[color:var(--need)]" /> Read part 1 · 3 min</p>
              <p className="flex items-center gap-1.5"><span className="size-3.5 rounded border-2 border-[color:var(--need)]" /> Questions 1 & 2 · 4 min</p>
            </MiniCard>
            <MiniCard need="apd" label="Auditory processing" i={2}>
              <p className="flex items-center gap-1.5"><BookOpen className="size-3.5 text-[color:var(--need)]" /> 1. Read the two paragraphs.</p>
              <p className="flex items-center gap-1.5"><PencilLine className="size-3.5 text-[color:var(--need)]" /> 2. Fill in the guided notes.</p>
              <p className="flex items-center gap-1.5"><MessagesSquare className="size-3.5 text-[color:var(--need)]" /> 5. Partner talk — or the written option.</p>
            </MiniCard>
            <MiniCard need="autism" label="Autism" i={3}>
              <p><strong className="text-[color:var(--need)]">How much:</strong> Q1 — 2 sentences. Q4 — circle 1 letter.</p>
              <p><strong className="text-[color:var(--need)]">Finished when:</strong> all 5 questions have answers.</p>
              <p className="text-ink-2">“In a nutshell” → “In summary”</p>
            </MiniCard>
          </div>
          <p className="mt-4 hidden items-center justify-center gap-2 text-sm text-ink-3 lg:flex">
            {calm ? (
              "One worksheet, four versions — each built for a different barrier."
            ) : (
              <>
                <ArrowDown className="size-4" aria-hidden /> Scroll to see one worksheet become four
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
