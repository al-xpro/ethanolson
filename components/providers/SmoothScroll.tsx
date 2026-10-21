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

// Scroll animations measure the page when they start. When its height changes later (the
// contact form turning into its thank-you message, errors appearing), they're measured
// again, or the ones tied to the end of the page (the footer's parallax) stop short of it.
function RefreshOnResize() {
  useEffect(() => {
    let measured = document.body.scrollHeight;
    let timer: number | undefined;
    const onRefresh = () => {
      measured = document.body.scrollHeight;
    };
    ScrollTrigger.addEventListener("refresh", onRefresh);
    const observer = new ResizeObserver(() => {
      window.clearTimeout(timer);
      // Only for a real change in height: refreshing also resizes pin spacers, which would
      // otherwise trigger the observer again
      timer = window.setTimeout(() => {
        if (document.body.scrollHeight !== measured) ScrollTrigger.refresh();
      }, 150);
    });
    observer.observe(document.body);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
    };
  }, []);

  return null;
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <ReactLenis root options={{ smoothWheel: !reduceMotion }}>
      <ResetOnNavigation />
      <RefreshOnResize />
      {children}
    </ReactLenis>
  );
}
