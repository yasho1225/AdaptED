"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { CheckVisual, FindVisual, StudentVisual, WriteVisual } from "./how-visuals";

/** Each step, how long it really takes, and its share of the bar (12% minimum, so every label fits). */
const STEPS = [
  {
    time: "Under a second",
    title: "Find what's hard",
    body: "AdaptED reads the assignment and marks what could get in the way: long sentences, too many steps at once, sayings.",
    grow: 12,
    Visual: FindVisual,
  },
  {
    time: "About a minute",
    title: "Learn about the student",
    body: "You pick what the student needs and which kinds of help to include. You never type names or medical details.",
    grow: 57,
    Visual: StudentVisual,
  },
  {
    time: "About 20 seconds",
    title: "Write the new version",
    body: "AI rewrites it under strict rules: every question kept, no answers given away, important words kept, and texts students are studying left alone.",
    note: "No AI available? AdaptED still builds a simpler version on its own, and says so.",
    grow: 19,
    Visual: WriteVisual,
  },
  {
    time: "Under a second",
    title: "Check the work",
    body: "AdaptED counts every question, answer choice, and key word. If something is missing, it puts it back.",
    grow: 12,
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
 * The four steps as one bar, each segment as wide as that step really takes. The bar is the step
 * picker: choosing a segment shows what happens in it, with a working picture of that step.
 */
export function HowItWorks() {
  const [active, setActive] = useState(0);
  // The pictures run real analysis code; build them only when the section is about a screen away.
  const [sectionRef, near] = useSeen<HTMLElement>("100% 0px 100% 0px");
  const step = STEPS[active];
  const Visual = step.Visual;

  const select = (i: number, focus = false) => {
    setActive(i);
    if (focus) document.getElementById(`how-tab-${i}`)?.focus();
  };

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

        <div className="mt-10">
          <div role="tablist" aria-label="How AdaptED works, in four steps" className="flex flex-col gap-1.5 lg:flex-row">
            {STEPS.map((s, i) => {
              const on = i === active;
              return (
                <button
                  key={s.title}
                  role="tab"
                  id={`how-tab-${i}`}
                  aria-selected={on}
                  aria-controls="how-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => select(i)}
                  onKeyDown={(e) => {
                    const d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
                    if (!d) return;
                    e.preventDefault();
                    select((i + d + STEPS.length) % STEPS.length, true);
                  }}
                  style={{ flexGrow: s.grow, flexBasis: 0 }}
                  className={cn(
                    "flex min-h-[4.5rem] min-w-0 flex-col justify-between gap-2 p-4 text-left transition-colors duration-200 lg:min-h-[8.5rem] lg:p-5",
                    on ? "bg-yellow text-on-brand" : "bg-paper text-ink-2 hover:bg-paper-2 hover:text-ink",
                  )}
                >
                  <span className="text-sm font-bold">{s.time}</span>
                  <span className="text-lg leading-tight font-bold">{s.title}</span>
                </button>
              );
            })}
          </div>

          <div role="tabpanel" id="how-panel" aria-labelledby={`how-tab-${active}`} className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <h3 className="text-2xl sm:text-[2rem]">{step.title}</h3>
              <p className="mt-4 max-w-[44ch] text-lg leading-relaxed text-ink-2">{step.body}</p>
              {step.note && <p className="mt-3 max-w-[44ch] text-ink-3">{step.note}</p>}
            </div>
            <div aria-hidden className="min-h-[22rem] lg:col-span-7 lg:min-h-[27rem]">
              {near && <Visual />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
