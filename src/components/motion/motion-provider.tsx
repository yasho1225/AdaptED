"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

interface MotionContextValue {
  /** Calm mode: no smooth scrolling, no scroll-driven or decorative motion. */
  calm: boolean;
  setCalm: (v: boolean) => void;
  /** Scrolls an element to just below the sticky nav, through Lenis when it is running. */
  scrollToEl: (el: HTMLElement) => void;
}

const NAV_OFFSET = 88;

const MotionContext = createContext<MotionContextValue>({ calm: true, setCalm: () => {}, scrollToEl: () => {} });

export function useMotion() {
  return useContext(MotionContext);
}

function readAttr(name: "calm"): string | undefined {
  if (typeof document === "undefined") return undefined;
  return document.documentElement.dataset[name];
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
  // Start calm on the server; the boot script has already set the real value on <html>.
  const [calm, setCalmState] = useState(true);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Sync React state with what the pre-paint boot script decided.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCalmState(readAttr("calm") === "true");
  }, []);

  const setCalm = useCallback((v: boolean) => {
    setCalmState(v);
    document.documentElement.dataset.calm = String(v);
    try {
      localStorage.setItem("adapted-calm", String(v));
    } catch {
      /* storage unavailable */
    }
    ScrollTrigger.refresh();
  }, []);


  useEffect(() => {
    if (calm) return;
    const lenis = new Lenis({ lerp: 0.12, anchors: { offset: -72 }, autoRaf: false });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // Lenis ignores native scrolls while its own glide runs, so a scrollbar drag, a keyboard jump or
    // find-in-page during a glide would be pulled back. Hand the scroll back to the browser instead.
    const onScroll = () => {
      if (lenis.isScrolling === "smooth" && Math.abs(window.scrollY - lenis.animatedScroll) > 4) lenis.scrollTo(window.scrollY, { immediate: true });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [calm]);

  const scrollToEl = useCallback((el: HTMLElement) => {
    // Measured from the real scroll position: Lenis's own can lag behind a native scroll (e.g. focus moves).
    const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    if (lenisRef.current) lenisRef.current.scrollTo(top);
    else window.scrollTo({ top });
  }, []);

  return <MotionContext.Provider value={{ calm, setCalm, scrollToEl }}>{children}</MotionContext.Provider>;
}
