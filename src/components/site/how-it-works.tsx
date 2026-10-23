"use client";

import { useEffect, useRef, useState } from "react";
import { useMotion } from "@/components/motion/motion-provider";
import { cn } from "@/lib/utils";
import { CheckVisual, FindVisual, StudentVisual, WriteVisual } from "./how-visuals";

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
    <section ref={sectionRef} id="how" data-mood="steady" aria-labelledby="how-heading" className="scroll-mt-16 overflow-x-clip py-20 sm:py-28">
      <div className="container-page">
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 id="how-heading" data-reveal className="text-[2.75rem] sm:text-6xl lg:col-span-6 lg:text-7xl">
            AI writes. AdaptED checks. You decide.
          </h2>
          <p className="max-w-[48ch] text-lg leading-relaxed text-ink-2 lg:col-span-6 lg:pt-2">
            AdaptED doesn&apos;t just ask AI to &ldquo;make it easier.&rdquo; It follows research. It sets strict rules. And it checks the work before you see it.
          </p>
        </div>

        <div className={cn("mt-14 grid gap-10", !calm && "lg:grid-cols-12")}>
          <ol className={cn(!calm && "lg:col-span-5")}>
            {STEPS.map((s, i) => (
              <li
                key={s.title}
                data-step={i}
                data-dim={!calm && i !== active ? "" : undefined}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                className={cn(
                  "group border-t-2 border-ink pt-6 pb-12",
                  !calm && "lg:flex lg:min-h-[58vh] lg:flex-col lg:justify-center lg:border-t-0 lg:py-0",
                )}
              >
                <p className="font-display text-7xl leading-none font-extrabold text-brand transition-opacity duration-500 [font-stretch:80%] sm:text-8xl lg:group-data-dim:opacity-35" aria-hidden>
                  {i + 1}
                </p>
                <h3 className="mt-3 text-3xl transition-colors duration-500 sm:text-4xl lg:group-data-dim:text-ink-3">
                  <span className="sr-only">Step {i + 1}: </span>
                  {s.title}
                </h3>
                <p className="mt-3 max-w-[44ch] text-lg leading-relaxed text-ink-2 transition-colors duration-500 lg:group-data-dim:text-ink-3">{s.body}</p>
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

        <p className="mt-4 max-w-[60ch] text-ink-3">
          No AI available? AdaptED still builds a simpler version on its own, and tells you clearly that AI wasn&apos;t used.
        </p>
      </div>
    </section>
  );
}
