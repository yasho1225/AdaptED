"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotion } from "./motion-provider";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Children marked [data-reveal] fade up once as they enter the viewport. */
export function Reveal({ children, className, as: Tag = "div" }: { children: React.ReactNode; className?: string; as?: "div" | "section" }) {
  const ref = useRef<HTMLDivElement>(null);
  const { calm } = useMotion();
  useGSAP(
    () => {
      if (calm) return;
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", ref.current);
      ScrollTrigger.batch(items, {
        start: "top 88%",
        once: true,
        onEnter: (batch) => gsap.fromTo(batch, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.08, overwrite: true }),
      });
    },
    { scope: ref, dependencies: [calm] },
  );
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
