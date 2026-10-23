"use client";

import { useMemo, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RichText } from "@/components/doc/rich-text";
import { useMotion } from "@/components/motion/motion-provider";
import { parseAssignment, words } from "@/lib/adapt/analyze";
import { CURATED } from "@/lib/adapt/curated";
import { SAMPLES } from "@/lib/adapt/samples";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * "Before → after" as a feeling: the real sample passage, crammed into one block,
 * loosens into the real adapted chunks as it scrolls into view.
 * Calm mode shows both versions, one under the other, without motion.
 */
export function ReliefDemo() {
  const { calm } = useMotion();
  const root = useRef<HTMLDivElement>(null);

  const before = useMemo(() => parseAssignment(SAMPLES[0].text).passages.join(" "), []);
  const beforeWords = words(before).length;
  const after = useMemo(
    () =>
      CURATED.science.dyslexia.sections
        .filter((s) => s.heading.startsWith("Read"))
        .slice(0, 2)
        .flatMap((s) => [{ heading: s.heading.replace(/^Read:\s*/, ""), text: "", key: false }, ...s.blocks.map((b) => ({ heading: "", text: b.text ?? "", key: b.type === "keyIdea" }))]),
    [],
  );

  useGSAP(
    () => {
      if (calm) return;
      const build = (scrollTrigger: ScrollTrigger.Vars) => {
        const tl = gsap.timeline({ scrollTrigger });
        tl.to(".relief-before", { opacity: 0, scale: 0.97, filter: "blur(3px)", ease: "power1.in", duration: 0.5 })
        .fromTo(".relief-after", { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.3)
        .from(".relief-line", { y: 16, opacity: 0, stagger: 0.05, ease: "power2.out", duration: 0.4 }, 0.32);
      };
      const mm = gsap.matchMedia();
      // Large screens: hold the section still while the wall of text loosens, so the change is watched, not missed.
      mm.add("(min-width: 1024px) and (min-height: 760px)", () => {
        build({ trigger: root.current?.closest("[data-relief]") ?? root.current, start: "top top+=64", end: "+=80%", scrub: 0.6, pin: true, anticipatePin: 1 });
      });
      mm.add("not ((min-width: 1024px) and (min-height: 760px))", () => {
        build({ trigger: root.current, start: "top 75%", end: "bottom 60%", scrub: 0.6 });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [calm] },
  );

  const beforeBlock = (
    <div className="relief-before">
      <p className="text-sm font-bold text-ink-3">
        Before · one block of {beforeWords} words
      </p>
      <p className="mt-3 text-justify text-[0.82rem] leading-[1.35] tracking-[-0.01em] text-ink-2 [hyphens:auto]">{before}</p>
      <p className="mt-4 text-sm font-bold text-[color:var(--warn)]">Hard to know where to start.</p>
    </div>
  );

  const afterBlock = (
    <div className="relief-after">
      <p className="text-sm font-bold text-ink-3">After · one idea at a time</p>
      <div className="mt-3 space-y-2.5">
        {after.map((line, i) =>
          line.heading ? (
            <p key={i} className="relief-line pt-1 text-lg font-extrabold tracking-[-0.01em]">
              {line.heading.charAt(0).toUpperCase() + line.heading.slice(1)}
            </p>
          ) : (
            <p key={i} className={cn("relief-line leading-relaxed", line.key ? "rounded-md bg-brand-soft px-3 py-2 font-bold" : "text-ink-2")}>
              <RichText text={line.text} />
            </p>
          ),
        )}
      </div>
      <p className="relief-line mt-4 text-sm font-bold text-[color:var(--ok)]">One small piece at a time.</p>
    </div>
  );

  return (
    <div ref={root} data-sample className="rounded-xl border border-rule p-6 sm:p-8">
      {calm ? (
        <div className="space-y-8">
          {beforeBlock}
          <div className="border-t border-rule pt-8">{afterBlock}</div>
        </div>
      ) : (
        // Both versions share one grid cell, so the box keeps the taller height while they swap.
        <div className="grid [&>*]:col-start-1 [&>*]:row-start-1">
          {beforeBlock}
          {afterBlock}
        </div>
      )}
    </div>
  );
}
