"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotion } from "./motion-provider";

gsap.registerPlugin(ScrollTrigger);

const BASE = "#1e40af";

/**
 * Emotional color arc: as each [data-mood] section reaches the middle of the
 * screen, the page color fades to that section's mood. Calm mode skips this and
 * lets every section show its own color without movement.
 */
export function MoodController() {
  const { calm } = useMotion();

  useEffect(() => {
    const root = document.documentElement;
    if (calm) {
      gsap.set(root, { "--canvas": BASE });
      return;
    }
    const sections = gsap.utils.toArray<HTMLElement>("[data-mood]");
    const triggers = sections.map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => {
          if (!self.isActive) return;
          const mood = getComputedStyle(el).getPropertyValue("--mood").trim() || BASE;
          gsap.to(root, { "--canvas": mood, duration: 0.9, ease: "power2.out", overwrite: true });
        },
      }),
    );
    // The studio grows when results load; re-measure section positions when the page height changes.
    let raf = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    ro.observe(document.body);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      triggers.forEach((t) => t.kill());
    };
  }, [calm]);

  return null;
}
