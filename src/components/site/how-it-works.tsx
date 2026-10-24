"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { CheckVisual, FindVisual, StudentVisual, WriteVisual } from "./how-visuals";

/** Each step, how long it really takes, what happens in it, and its working picture. */
const STEPS = [
  {
    time: "Under a second",
    title: "Find what's hard",
    body: "AdaptED reads the assignment and marks what could get in the way: long sentences, too many steps at once, sayings.",
    Visual: FindVisual,
  },
  {
    time: "About a minute",
    title: "Learn about the student",
    body: "You pick what the student needs and which kinds of help to include. You never type names or medical details.",
    Visual: StudentVisual,
  },
  {
    time: "About 20 seconds",
    title: "Write the new version",
    body: "AI rewrites it under strict rules: every question kept, no answers given away, important words kept, and texts students are studying left alone.",
    note: "No AI available? AdaptED still builds a simpler version on its own, and says so.",
    Visual: WriteVisual,
  },
  {
    time: "Under a second",
    title: "Check the work",
    body: "AdaptED counts every question, answer choice, and key word. If something is missing, it puts it back.",
    Visual: CheckVisual,
  },
];

/** True once the element has come within the given margin of the viewport. */
function useSeen<T extends HTMLElement>(margin: string) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [seen, margin]);
  return [ref, seen] as const;
}

/**
 * The four steps as a list beside one working picture. The open step is the highlighted block and
 * carries its own description; choosing another step opens it and changes the picture. (An accordion
 * that always keeps one step open, so the open step's button is aria-disabled.)
 */
export function HowItWorks() {
  const [active, setActive] = useState(0);
  // The pictures run real analysis code; build them only when the section is about a screen away.
  const [sectionRef, near] = useSeen<HTMLElement>("100% 0px 100% 0px");
  const Visual = STEPS[active].Visual;

  return (
    <section ref={sectionRef} id="how" aria-labelledby="how-heading" className="band overflow-x-clip py-16 sm:py-20">
      <div className="container-page">
        <div className="grid gap-x-10 gap-y-6 lg:grid-cols-12 lg:items-end">
          <h2 id="how-heading" className="t-head lg:col-span-7">
            AI writes. AdaptED checks.
          </h2>
          <p className="max-w-[44ch] text-ink-2 lg:col-span-5">
            And you decide. AdaptED follows research, sets strict rules, and checks the work before you see it.
          </p>
        </div>

        {/* Tall enough for the tallest step (Write, with its note), so choosing a step never moves the page below. */}
        <div className="mt-10 grid gap-8 lg:min-h-[35rem] lg:grid-cols-12 lg:items-start lg:gap-10 xl:min-h-[33rem]">
          <ol aria-label="How AdaptED works, in four steps" className="flex flex-col gap-1.5 lg:col-span-5">
            {STEPS.map((s, i) => {
              const on = i === active;
              return (
                <li key={s.title} className={cn("transition-colors duration-150", on ? "bg-yellow text-on-brand" : "bg-paper")}>
                  <h3 className="font-sans">
                    <button
                      type="button"
                      id={`how-step-${i}`}
                      aria-expanded={on}
                      aria-controls={`how-step-${i}-body`}
                      aria-disabled={on || undefined}
                      onClick={() => setActive(i)}
                      className={cn(
                        "flex w-full flex-col-reverse items-start gap-1 px-5 py-4 text-left transition-colors duration-150",
                        on ? "cursor-default focus-visible:outline-on-brand" : "text-ink-2 hover:bg-paper-2 hover:text-ink",
                      )}
                    >
                      {/* The title comes first for screen readers ("Find what's hard, under a second"); the time shows above it. */}
                      <span className="font-display text-xl leading-tight font-bold sm:text-2xl">{s.title}</span>
                      <span className="sr-only">, </span>
                      <span className="text-sm font-bold">{s.time}</span>
                    </button>
                  </h3>
                  <div id={`how-step-${i}-body`} role="region" aria-labelledby={`how-step-${i}`} hidden={!on} className="px-5 pb-5">
                    <p className="max-w-[46ch] leading-relaxed">{s.body}</p>
                    {s.note && <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-on-brand/80">{s.note}</p>}
                  </div>
                </li>
              );
            })}
          </ol>
          <div aria-hidden className="min-h-[22rem] lg:col-span-7 lg:min-h-[27rem]">
            {near && <Visual />}
          </div>
        </div>
      </div>
    </section>
  );
}
