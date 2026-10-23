"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

interface MotionContextValue {
  /** Calm mode: no smooth scrolling, no scroll-driven or decorative motion. */
  calm: boolean;
  setCalm: (v: boolean) => void;
}

const MotionContext = createContext<MotionContextValue>({ calm: true, setCalm: () => {} });

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
    const lenis = new Lenis({ duration: 1.05, anchors: { offset: -72 }, autoRaf: false });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [calm]);

  return <MotionContext.Provider value={{ calm, setCalm }}>{children}</MotionContext.Provider>;
}
