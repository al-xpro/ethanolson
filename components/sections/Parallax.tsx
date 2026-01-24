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
          
          // Mobile needs a smaller starting scale to save GPU memory
          const startScale = isMobile ? 40 : 80; 

          // 1. Set Initial States
          gsap.set(".mask img", {
            scale: startScale,
            transformOrigin: "center center",
          });

          // Main content hidden initially
          gsap.set(".content", { autoAlpha: 0, y: 100 });
          
          // Intro text (bottom text) visible initially
          gsap.set(".intro-text", { autoAlpha: 1, y: 0 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1,
              pin: true,
              invalidateOnRefresh: true,
            },
          });

          // 2. The Animation Sequence
          tl
            // --- STEP A: PARALLEL START ---
            // The text moves UP and fades OUT immediately as user starts scrolling
            .to(".intro-text", {
              y: -150,        // Move up by 150px
              autoAlpha: 0,   // Fade to invisible
              ease: "power2.in",
              duration: 1.5,
            }, 0) // The '0' absolute position forces this to start at the beginning
            
            // The mask shrinks simultaneously
            .to(".mask img", {
              scale: 1,
              ease: "power2.inOut",
              duration: 2, // Lasts a bit longer than the text fade
            }, 0) // Start at the same time as the text

            // --- STEP B: NEXT CONTENT ---
            // Reveal the main text content after mask is mostly closed
            .to(
              ".content",
              {
                autoAlpha: 1,
                y: 0,
                ease: "power2.out",
                duration: 1,
              },
              "-=0.5" // Start slightly before the mask animation completely finishes
            );
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section id="showcase" ref={containerRef} className="relative w-full h-screen overflow-hidden text-white">
      {/* ─── MEDIA LAYER ────────────────────────────────────────────────── */}
      <div className="media relative w-full h-full z-0">
        <video 
          src="/videos/design.mp4" 
          loop 
          muted 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover opacity-80"
        />

        {/* 1. INTRO TEXT (The text you wanted at the bottom) 
          Placed inside media so it's pinned with the video. 
          z-20 ensures it's above the video but can interact with mask if needed.
        */}
        <div className="intro-text absolute bottom-20 inset-x-0 z-20 flex flex-col items-center justify-end text-center pb-10 pointer-events-none">
           <h3 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
             Shaped by vision
           </h3>
           <p className="mt-4 text-lg md:text-xl text-white/80 uppercase tracking-widest">
             Powered by Precision
           </p>
        </div>

        {/* The Mask - SVG with a hole in the center */}
        {/* z-30 ensures the mask (the black parts) covers the intro text when it shrinks if needed */}
        <div className="mask absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <img src="/images/ultimate.svg" alt="Mask" className="w-full h-full object-cover" />
        </div>
      </div>
    </section>
  );
};