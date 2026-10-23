"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useMotion } from "./motion-provider";

/** Animated number (React Bits "CountUp" pattern, built on GSAP). Static in calm mode. */
export function CountUp({ value, decimals = 0, className }: { value: number; decimals?: number; className?: string }) {
  const { calm } = useMotion();
  const [shown, setShown] = useState(value);
  const obj = useRef({ v: value });

  useEffect(() => {
    if (calm) {
      obj.current.v = value;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShown(value);
      return;
    }
    const tween = gsap.to(obj.current, { v: value, duration: 1.1, ease: "power3.out", onUpdate: () => setShown(obj.current.v) });
    return () => {
      tween.kill();
    };
  }, [value, calm]);

  return <span className={className}>{shown.toFixed(decimals)}</span>;
}
