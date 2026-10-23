"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useMotion } from "./motion-provider";

gsap.registerPlugin(useGSAP);

/**
 * Word-by-word rise-in (React Bits "SplitText" pattern on GSAP).
 * Screen readers get the plain sentence; the animated spans are hidden from them.
 */
export function SplitText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { calm } = useMotion();
  useGSAP(
    () => {
      if (calm) return;
      gsap.from(".split-word > span", { yPercent: 110, opacity: 0, duration: 0.9, ease: "power4.out", stagger: 0.06, delay });
    },
    { scope: ref, dependencies: [calm] },
  );
  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {text.split(" ").map((w, i) => (
          <span key={i} className="split-word inline-block overflow-hidden pb-[0.08em] align-bottom">
            <span className="inline-block">{w}&nbsp;</span>
          </span>
        ))}
      </span>
    </span>
  );
}
