"use client";

import { useEffect } from "react";
import { useMotion } from "./motion-provider";

/**
 * Section entrances. Elements marked [data-rise] (and the .shutter plate) arrive once, in reading
 * order within their [data-rise-group], when they are about 88% of the way up the viewport.
 *
 * The hidden state only applies after this runs (html[data-reveals="on"]), so a failed script
 * never leaves content invisible. Anything already on screen is shown at once, without motion,
 * so nothing visible disappears and comes back. Calm mode: everything is simply there.
 */
export function Reveals() {
  const { calm } = useMotion();

  useEffect(() => {
    const root = document.documentElement;
    if (calm) {
      root.removeAttribute("data-reveals");
      return;
    }
    const els = [...document.querySelectorAll<HTMLElement>("[data-rise], .shutter")];
    const order = new Map<Element, number>();
    for (const el of els) {
      const group = el.closest("[data-rise-group]") ?? el.parentElement ?? root;
      const i = order.get(group) ?? 0;
      order.set(group, i + 1);
      el.style.setProperty("--rise-i", String(Math.min(i, 4)));
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-in", "");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    const vh = window.innerHeight;
    for (const el of els) {
      if (el.hasAttribute("data-in")) continue;
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.88 && r.bottom > 0) {
        el.setAttribute("data-instant", "");
        el.setAttribute("data-in", "");
      } else {
        io.observe(el);
      }
    }
    root.setAttribute("data-reveals", "on");
    return () => io.disconnect();
  }, [calm]);

  return null;
}
