"use client";

import { useRef } from "react";
import Image from "next/image";
import { introVideo } from "@/content/sections";
import { gsap, useGSAP } from "@/lib/gsap";

export const IntroParallax = () => {
  const containerRef = useRef<HTMLDivElement>(null);

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
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden text-white bg-black"
    >
      <div className="media relative w-full h-full z-0">
        {introVideo.src ? (
          <video
            src={introVideo.src}
            poster={introVideo.poster}
            loop
            muted
            autoPlay
            playsInline
            preload="metadata"
            aria-hidden
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <Image
            src={introVideo.poster}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-80"
          />
        )}

        {/* Intro Text (Visible at start) */}
        <div className="intro-text absolute bottom-20 inset-x-0 z-20 flex flex-col items-center justify-end text-center pb-10 pointer-events-none motion-reduce:hidden">
          <h2 className="text-4xl md:text-6xl lg:text-7xl xl:text-[5vw] font-bold tracking-tight">
            Shaped by vision
          </h2>
          <p className="mt-4 text-lg md:text-xl xl:text-[2vw] text-white/80 uppercase tracking-widest">
            Powered by Precision
          </p>
        </div>

        {/* Mask */}
        <div className="mask absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <Image src="/images/mask.svg" alt="" fill className="object-cover" />
        </div>

        {/* Flow Text (appears after the mask closes, above the mask layer) */}
        <div className="flow-text pointer-events-none absolute inset-0 z-40 flex flex-col items-center justify-center h-full w-full">
          <div className="w-full flex flex-col h-full justify-between py-36 md:py-44">
            {/* Top Text */}
            <div className="flow-text-top text-center opacity-0 motion-reduce:opacity-100">
              <p className="text-4xl md:text-6xl lg:text-7xl xl:text-[5vw] font-bold text-white/90 tracking-[0.2rem]">
                Where Ideas
              </p>
            </div>

            {/* Bottom Text */}
            <div className="flow-text-bottom text-center opacity-0 motion-reduce:opacity-100">
              <p className="text-4xl md:text-6xl lg:text-7xl xl:text-[5vw] font-bold text-white/90 tracking-[0.2rem]">
                Into Reality
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
