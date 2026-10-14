import { gsap, ScrollTrigger } from "@/lib/gsap";

export const animateWithGsap = (
  target: gsap.DOMTarget,
  animationProps: gsap.TweenVars,
  scrollProps?: Partial<ScrollTrigger.Vars>
) => {
  return gsap.to(target, {
    ...animationProps,
    scrollTrigger: {
      trigger: target,
      start: "top 85%",
      toggleActions: "restart reverse restart reverse",
      ...scrollProps,
    },
  });
};
