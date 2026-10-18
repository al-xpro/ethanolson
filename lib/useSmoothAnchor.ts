"use client";

import { useLenis } from "lenis/react";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

// In-page links (tables of contents, minimaps): a smooth Lenis scroll to the section,
// stopping at its scroll margin, and clear of the navbar when scrolling up (it reappears)
export function useSmoothAnchor() {
  const lenis = useLenis();
  const reduceMotion = usePrefersReducedMotion();

  return (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();

    const goingUp = target.getBoundingClientRect().top < 0;
    const rootStyle = getComputedStyle(document.documentElement);
    const headerHeight = goingUp ? parseFloat(rootStyle.getPropertyValue("--header-height")) || 0 : 0;
    const scrollMargin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    const offset = Math.max(scrollMargin, headerHeight ? headerHeight + 16 : 0);

    if (lenis) {
      // Lenis already stops short of the target's scroll-margin, so only the rest is added
      lenis.scrollTo(target, {
        offset: scrollMargin - offset,
        immediate: reduceMotion,
        duration: 1.2,
        easing: easeOutQuart,
      });
    } else {
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset });
    }
    history.replaceState(null, "", `#${id}`);
  };
}
