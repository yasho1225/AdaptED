"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

interface MotionContextValue {
  /** Calm mode: no smooth scrolling and no decorative motion. */
  calm: boolean;
  setCalm: (v: boolean) => void;
  /** Scrolls an element to just below the sticky nav. */
  scrollToEl: (el: HTMLElement) => void;
}

const NAV_OFFSET = 88;

const MotionContext = createContext<MotionContextValue>({ calm: true, setCalm: () => {}, scrollToEl: () => {} });

export function useMotion() {
  return useContext(MotionContext);
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
  // Start calm on the server; the boot script has already set the real value on <html>.
  const [calm, setCalmState] = useState(true);

  useEffect(() => {
    // Sync React state with what the pre-paint boot script decided.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCalmState(document.documentElement.dataset.calm === "true");
  }, []);

  const setCalm = useCallback((v: boolean) => {
    setCalmState(v);
    document.documentElement.dataset.calm = String(v);
    try {
      localStorage.setItem("adapted-calm", String(v));
    } catch {
      /* storage unavailable */
    }
  }, []);

  const scrollToEl = useCallback((el: HTMLElement) => {
    const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top, behavior: document.documentElement.dataset.calm === "true" ? "auto" : "smooth" });
  }, []);

  return <MotionContext.Provider value={{ calm, setCalm, scrollToEl }}>{children}</MotionContext.Provider>;
}
