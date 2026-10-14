"use client";

import ReactLenis from "lenis/react";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";
import "@/lib/gsap";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <ReactLenis root options={{ smoothWheel: !reduceMotion }}>
      {children}
    </ReactLenis>
  );
}
