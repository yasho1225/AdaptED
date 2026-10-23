"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useMotion } from "./motion-provider";

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * Section headlines ([data-reveal]) rise out of their lines once, as they scroll into view.
 * Headlines already on screen are left alone, so nothing visible ever disappears and comes back.
 * Calm mode: no reveal.
 */
export function HeadingReveal() {
  const { calm } = useMotion();

  useEffect(() => {
    if (calm) return;
    const splits = gsap.utils
      .toArray<HTMLElement>("[data-reveal]")
      .filter((el) => el.getBoundingClientRect().top > window.innerHeight)
      .map((el) =>
        SplitText.create(el, {
          type: "lines,words",
          mask: "lines",
          linesClass: "rv-line",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.words, {
              yPercent: 110,
              duration: 0.9,
              ease: "expo.out",
              stagger: 0.04,
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            }),
        }),
      );
    return () => splits.forEach((s) => s.revert());
  }, [calm]);

  return null;
}
