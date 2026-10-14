import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

if (typeof window !== "undefined") {
  // Prevents jumps when the mobile address bar shows or hides
  ScrollTrigger.config({ ignoreMobileResize: true });
}

// Wrap scroll-driven animations in gsap.matchMedia().add(MOTION_OK, ...) so they
// are skipped (and reverted) when the visitor prefers reduced motion.
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export { gsap, ScrollTrigger, useGSAP };
