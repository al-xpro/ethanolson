"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import mask from "@/public/images/mask.svg";
import type { Home } from "@/lib/cms/model";
import { editable } from "@/lib/cms/editable";
import { mediaSrc } from "@/components/cms/CmsImage";
import { introText } from "@/content/ui";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

export const IntroParallax = ({ content }: { content: Home["intro"] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // The video (1.6 MB) loads once the section is half a screen away, so it doesn't compete
  // with the first screen; the poster shows until then, and instead of it with reduced motion
  const [near, setNear] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  // Started by hand: the pin moves the section into a wrapper, which cancels autoplay
  useEffect(() => {
    if (near && !reduceMotion) videoRef.current?.play().catch(() => {});
  }, [near, reduceMotion]);

  useEffect(() => {
    const section = containerRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px 50% 0px" }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isMobile: "(max-width: 768px) and (prefers-reduced-motion: no-preference)",
          isDesktop: "(min-width: 769px) and (prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { isMobile } = context.conditions as { isMobile: boolean };
          const startScale = isMobile ? 40 : 80;

          // Initialize hidden states for upcoming text
          gsap.set(".flow-text-top", { autoAlpha: 0, y: -60 });
          gsap.set(".flow-text-bottom", { autoAlpha: 0, y: 60 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1,
              pin: true,
              invalidateOnRefresh: true,
              refreshPriority: 1,
            },
          });

          // 1. MASK & INTRO TEXT (fromTo keeps the start state stable on resize)
          tl.fromTo(
            ".mask img",
            { scale: startScale, transformOrigin: "center center" },
            { scale: 1, ease: "power2.inOut", duration: 2 },
            0
          ).fromTo(
            ".intro-text",
            { y: 0, autoAlpha: 1 },
            { y: -150, autoAlpha: 0, ease: "power2.in", duration: 1.5 },
            0
          );

          // 2. FLOW TEXT REVEAL (sequential)
          tl.to(
            ".flow-text-top",
            {
              autoAlpha: 1,
              y: 0,
              ease: "power2.out",
              duration: 1,
            },
            "+=0.1"
          ).to(
            ".flow-text-bottom",
            {
              autoAlpha: 1,
              y: 0,
              ease: "power2.out",
              duration: 1,
            },
            "<+0.8"
          );
        }
      );
    },
    { scope: containerRef }
  );

  // With reduced motion the scene shows its final frame: mask closed, flow text visible
  return (
    <section
      id="showcase"
      {...editable(content)}
      ref={containerRef}
      className="relative w-full h-screen min-h-[320px] overflow-hidden text-white bg-black"
    >
      <div className="media relative w-full h-full z-0">
        <video
          // A new file restarts the element
          key={content.video.src}
          ref={videoRef}
          src={near && !reduceMotion ? content.video.src : undefined}
          poster={mediaSrc(content.poster, 1280)}
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden
          className="w-full h-full object-cover opacity-80"
        />

        {/* Intro Text (Visible at start) */}
        <div className="intro-text absolute bottom-20 inset-x-0 z-20 flex flex-col items-center justify-end text-center pb-10 pointer-events-none motion-reduce:hidden">
          <h2 className="text-4xl md:text-6xl lg:text-7xl xl:text-[5vw] font-bold tracking-tight">
            {introText.title}
          </h2>
          <p className="mt-4 text-lg md:text-xl xl:text-[2vw] text-white/80 uppercase tracking-widest">
            {introText.subtitle}
          </p>
        </div>

        {/* Mask */}
        <div className="mask absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <Image src={mask} alt="" className="h-full w-full object-cover" />
        </div>

        {/* Flow Text (appears after the mask closes, above the mask layer) */}
        {/* Anchored to the word in the mask: the 1920px-square mask covers the section, so
            "Flow" spans y = 880–1160 of it, scaled by max(100vw, 100vh) / 1920 */}
        <div className="flow-text pointer-events-none absolute inset-0 z-40">
          <div className="flow-text-top absolute inset-x-0 bottom-[calc(50%+max(100vw,100vh)*0.0417+1.5rem)] text-center opacity-0 motion-reduce:opacity-100">
            <p className="text-4xl md:text-6xl lg:text-7xl xl:text-[5vw] [@media(max-height:560px)]:text-3xl font-bold text-white/90 tracking-[0.2rem]">
              {introText.top}
            </p>
          </div>

          <div className="flow-text-bottom absolute inset-x-0 top-[calc(50%+max(100vw,100vh)*0.1042+1.5rem)] text-center opacity-0 motion-reduce:opacity-100">
            <p className="text-4xl md:text-6xl lg:text-7xl xl:text-[5vw] [@media(max-height:560px)]:text-3xl font-bold text-white/90 tracking-[0.2rem]">
              {introText.bottom}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
