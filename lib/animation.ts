import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);

type GSAPTarget = gsap.DOMTarget;
type GSAPVars = gsap.TweenVars;
type ScrollVars = Partial<ScrollTrigger.Vars>;

export const animateWithGsap = (
  target: GSAPTarget,
  animationProps: GSAPVars,
  scrollProps?: ScrollVars
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

export const animateWithGsapTimeline = ({
  timeline,
  rotationRef,
  rotationState,
  firstTarget,
  secondTarget,
  animationProps,
}: {
  timeline: any;
  rotationRef: any;
  rotationState: any;
  firstTarget: any;
  secondTarget: any;
  animationProps: any;
}) => {
  timeline.to(rotationRef.current.rotation, {
    y: rotationState,
    duration: 1,
    ease: "power2.inOut",
  });

  timeline.to(
    firstTarget,
    {
      ...animationProps,
      ease: "power2.inOut",
    },
    "<"
  );

  timeline.to(
    secondTarget,
    {
      ...animationProps,
      ease: "power2.inOut",
    },
    "<"
  );
};
