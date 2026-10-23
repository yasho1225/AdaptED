"use client";

import Magnet from "@/components/vendor/magnet";
import { useMotion } from "./motion-provider";

/**
 * A gentle pull toward the pointer for the page's main buttons. Off in calm mode, on touch
 * screens, and for reduced-motion users (Magnet checks that itself).
 */
export function CalmMagnet({ children, className }: { children: React.ReactNode; className?: string }) {
  const { calm } = useMotion();
  return (
    <Magnet disabled={calm} padding={70} magnetStrength={5} maxOffset={10} wrapperClassName={className}>
      {children}
    </Magnet>
  );
}
