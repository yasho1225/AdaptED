"use client";

import { useEffect, useRef, useState } from "react";
import { useMotion } from "@/components/motion/motion-provider";
import { cn } from "@/lib/utils";
import { CheckVisual, FindVisual, StudentVisual, WriteVisual } from "./how-visuals";

/** Each stage, how long it really takes, and its colour in the bar. Widths follow the durations (12% minimum). */
const STAGES = [
  { time: "Under a second", clause: "First, AdaptED finds what could get in the way.", grow: 12, tone: "bg-yellow" },
  { time: "About a minute", clause: "Then you choose the help your student needs.", grow: 57, tone: "bg-white" },
  { time: "About 20 seconds", clause: "Next, AI writes the new version under strict rules.", grow: 19, tone: "bg-[#a9d4ff]" },
  { time: "Under a second", clause: "Last, AdaptED checks every question and key word.", grow: 12, tone: "bg-[#9eebc8]" },
];

const STEPS = [
  {
    title: "Find what's hard",
    body: "AdaptED reads the assignment. It marks the parts that could get in the way, like long sentences, too many steps at once, or sayings.",
    Visual: FindVisual,
  },
  {
    title: "Learn about the student",
    body: "You pick what the student needs and which kinds of help to include. You never type names or medical details.",
    Visual: StudentVisual,
  },
  {
    title: "Write the new version",
    body: "AI rewrites the assignment with strict rules. It keeps every question and never gives away answers. It keeps important words, and it never changes a text students are studying.",
    note: "No AI available? AdaptED still builds a simpler version on its own, and says so clearly.",
    Visual: WriteVisual,
  },
  {
    title: "Check the work",
    body: "AdaptED counts every question, answer choice, and key word. If something is missing, it puts it back.",
    Visual: CheckVisual,
  },
];

/** Plays once when the element scrolls into view. */
function useSeen<T extends HTMLElement>(margin = "0px 0px -20% 0px") {
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

function InlineVisual({ index, near }: { index: number; near: boolean }) {
  const [ref, seen] = useSeen<HTMLDivElement>();
  const { Visual } = STEPS[index];
  return (
    <div ref={ref} aria-hidden className="mt-6 min-h-[20rem]">
      {near && <Visual play={seen} />}
    </div>
  );
}

/**
 * Large screens: the steps scroll past while the picture beside them stays put and changes
 * with each step. Small screens and calm mode: each picture sits under its step.
 */
export function HowItWorks() {
  const { calm } = useMotion();
  const [active, setActive] = useState(0);
  const [reached, setReached] = useState(0);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  // The pictures run real analysis code; build them only when the section is about a screen away,
  // so it doesn't add to the work done while the page first loads.
  const [sectionRef, near] = useSeen<HTMLElement>("100% 0px 100% 0px");

  useEffect(() => {
    if (calm) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = stepRefs.current.indexOf(e.target as HTMLLIElement);
          setActive(i);
          setReached((r) => Math.max(r, i));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [calm]);

  return (
    <section ref={sectionRef} id="how" aria-labelledby="how-heading" className="field-navy scroll-mt-16 overflow-x-clip py-28 sm:py-40">
      <div className="container-page">
        <div className="grid gap-x-10 gap-y-6 lg:grid-cols-12 lg:items-end">
          <h2 id="how-heading" data-reveal className="t-head lg:col-span-7">
            AI writes. AdaptED checks.
          </h2>
          <p className="max-w-[44ch] text-ink-2 lg:col-span-5">
            And you decide. AdaptED doesn&apos;t just ask AI to &ldquo;make it easier.&rdquo; It follows research, sets strict rules, and checks the work before you see it.
          </p>
        </div>

        {/* The stages as one bar: each segment as wide as that stage really takes. */}
        <div data-rise-group className="mt-16">
          <div data-ui className="flex flex-col gap-1.5 lg:h-[22vh] lg:min-h-[10rem] lg:flex-row">
            {STAGES.map((st, i) => (
              <div key={i} data-rise className={cn("flex min-h-[4.5rem] flex-col justify-between p-4 text-[#0a1b52] lg:min-h-0 lg:p-5", st.tone)} style={{ flexGrow: st.grow, flexBasis: 0 }}>
                <span className="text-[1.25rem] leading-tight font-bold lg:text-[clamp(1.1rem,1.6vw,1.75rem)]">{st.time}</span>
                <span className="text-[0.95rem] font-bold lg:hidden">{st.clause}</span>
              </div>
            ))}
          </div>
          <div aria-hidden className="mt-4 hidden gap-1.5 lg:flex">
            {STAGES.map((st, i) => (
              <p key={i} className="max-w-[22ch] pr-3 text-lg leading-snug text-ink-2" style={{ flexGrow: st.grow, flexBasis: 0 }}>
                {st.clause}
              </p>
            ))}
          </div>
          <ol className="sr-only">
            {STAGES.map((st, i) => (
              <li key={i}>
                {st.clause} {st.time}.
              </li>
            ))}
          </ol>
        </div>

        <div className={cn("mt-24 grid gap-10", !calm && "lg:grid-cols-12")}>
          <ol className={cn(!calm && "lg:col-span-5")}>
            {STEPS.map((s, i) => (
              <li
                key={s.title}
                data-step={i}
                data-dim={!calm && i !== active ? "" : undefined}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                className={cn("group pb-16", !calm && "lg:flex lg:min-h-[58vh] lg:flex-col lg:justify-center lg:py-0")}
              >
                <span aria-hidden className={cn("chisel block h-3 w-14 transition-opacity duration-500 [--cut:0.4rem] lg:group-data-dim:opacity-40", STAGES[i].tone)} />
                <h3 className="mt-5 text-2xl transition-colors duration-500 sm:text-[2rem] lg:group-data-dim:text-ink-3">
                  <span className="sr-only">Step {i + 1}: </span>
                  {s.title}
                </h3>
                <p className="mt-3 max-w-[44ch] text-lg leading-relaxed text-ink-2 transition-colors duration-500 lg:group-data-dim:text-ink-3">{s.body}</p>
                {"note" in s && <p className="mt-3 max-w-[44ch] text-ink-3">{s.note}</p>}
                <div className={cn(!calm && "lg:hidden")}>
                  <InlineVisual index={i} near={near} />
                </div>
              </li>
            ))}
          </ol>

          {!calm && (
            <div aria-hidden className="hidden lg:col-span-7 lg:block">
              <div className="sticky top-[calc(50vh-15rem)] grid h-[30rem] place-items-center">
                {STEPS.map(({ Visual, title }, i) => (
                  <div
                    key={title}
                    className={cn(
                      "col-start-1 row-start-1 w-full transition-[opacity,transform,visibility] duration-500 ease-out",
                      i === active ? "visible translate-y-0 opacity-100" : "invisible translate-y-6 opacity-0",
                    )}
                  >
                    {near && <Visual play={reached >= i && i === active} />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
