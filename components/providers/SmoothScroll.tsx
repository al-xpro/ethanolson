"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import ReactLenis, { useLenis } from "lenis/react";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";
import { ScrollTrigger } from "@/lib/gsap";

// Every new page starts at the top, with its scroll animations measured afresh
function ResetOnNavigation() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true, force: true });
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [pathname, lenis]);

  return null;
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <ReactLenis root options={{ smoothWheel: !reduceMotion }}>
      <ResetOnNavigation />
      {children}
    </ReactLenis>
  );
}
