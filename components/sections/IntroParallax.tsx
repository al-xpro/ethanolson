"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const IntroParallax = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isMobile: "(max-width: 768px)",
          isDesktop: "(min-width: 769px)",
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
              end: "bottom top", // Removed the +=200 to keep scrub tight
              scrub: 1,
              pin: true,
              invalidateOnRefresh: true, // Crucial for resizing
              refreshPriority: 1,
            },
          });

          // 1. MASK & INTRO TEXT (Use fromTo for resize safety)
          tl.fromTo(
            ".mask img",
            { scale: startScale, transformOrigin: "center center" }, // Force Start
            { scale: 1, ease: "power2.inOut", duration: 2 },         // End
            0
          )
          .fromTo(
            ".intro-text",
            { y: 0, autoAlpha: 1 },  // Force Start
            { y: -150, autoAlpha: 0, ease: "power2.in", duration: 1.5 }, // End
            0
          );

          // 2. FLOW TEXT REVEAL (Sequential)
          tl.to(".flow-text-top", {
              autoAlpha: 1,
              y: 0,
              ease: "power2.out",
              duration: 1,
            }, "+=0.2") // Small delay after mask settles
            
            .to(".flow-text-bottom", {
              autoAlpha: 1,
              y: 0,
              ease: "power2.out",
              duration: 1,
            }, "<+0.2"); // Start shortly after the top text
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      id="showcase"
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden text-white bg-black"
    >
      <div className="media relative w-full h-full z-0">
        <video
          src="/videos/design.mp4"
          loop
          muted
          autoPlay
          playsInline
          className="w-full h-full object-cover opacity-80"
        />

        {/* Intro Text (Visible at start) */}
        <div className="intro-text absolute bottom-20 inset-x-0 z-20 flex flex-col items-center justify-end text-center pb-10 pointer-events-none">
          <h3 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Shaped by vision
          </h3>
          <p className="mt-4 text-lg md:text-xl text-white/80 uppercase tracking-widest">
            Powered by Precision
          </p>
        </div>

        {/* Mask */}
        <div className="mask absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <img src="/images/flow.svg" alt="Mask" className="w-full h-full object-cover" />
        </div>

        {/* Flow Text (Appears after mask closes) */}
        {/* Added z-40 to ensure it sits on top of the mask layer */}
        <div className="flow-text pointer-events-none absolute inset-0 z-40 flex flex-col items-center justify-center h-full w-full">
            <div className="w-full max-w-7xl flex flex-col h-full justify-between py-32 md:py-40">
                {/* Top Text */}
                <div className="flow-text-top text-center opacity-0">
                    <h3 className="text-4xl md:text-6xl lg:text-8xl font-bold text-white/90 tracking-[0.2rem] uppercase">
                    Where Ideas
                    </h3>
                </div>

                {/* Bottom Text */}
                <div className="flow-text-bottom text-center opacity-0">
                    <h3 className="text-4xl md:text-6xl lg:text-8xl font-bold text-white/90 tracking-[0.2rem] uppercase">
                    Take Shape
                    </h3>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};