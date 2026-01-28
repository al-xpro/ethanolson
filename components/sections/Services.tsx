"use client";

import { useRef } from "react";
import { servicesData } from "@/lib/data";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedHeaderSection from "../ui/AnimatedHeaderSection";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const text = `I specialize in creating custom solutions,
    all designed to deliver unique value, 
    and meet your specific needs.`;

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;

      
      const getScrollAmount = () => {
        // Calculate the exact width the track needs to move left
        // (Full Track Width) - (One Viewport Width)
        return -(track.scrollWidth - window.innerWidth);
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          // dynamically calculate the end point based on how wide the content is
          end: () => `+=${track.scrollWidth - window.innerWidth}`, 
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true, // Crucial: Recalculates all values on resize
          refreshPriority: 0, // Ensure it doesn't try to calculate while the previous one is shifting
          fastScrollEnd: true, // Prevents slight jumps if the user is scrolling fast during a resize event
        },
      });

      tl.to(track, {
        x: getScrollAmount, // Use a function to ensure it's re-read on resize
        ease: "none",
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      id="services"
      ref={containerRef}
      // h-screen is vital for pinning. overflow-hidden prevents horizontal scrollbar.
      className="relative h-screen flex flex-col bg-black text-white overflow-hidden rounded-t-4xl"
    >
      {/* HEADER SECTION: shrink-0 prevents it from being crushed by the flex column */}
      <div className="shrink-0">
        <AnimatedHeaderSection
          subTitle={"What I Offer"}
          title={"Services"}
          text={text}
          textColor={"text-white"}
          withScrollTrigger={true}
        />
      </div>

      {/* ─── HORIZONTAL TRACK ─── */}
      {/* flex-1: Fills the remaining vertical space after the header */}
      <div className="flex-1 w-full relative">
        <div ref={trackRef} className="flex h-full w-fit">
          {servicesData.map((service, index) => (
            <div
              key={index}
              className={`
                service-card 
                relative 
                w-screen          /* Always take full viewport width */
                h-full 
                flex-shrink-0 
                flex flex-col lg:flex-row /* Stack vertically on mobile, row on desktop */
                items-center justify-center 
                gap-8 lg:gap-20
                p-6 md:p-12 lg:p-20
                border-r border-white/5
              `}
            >
              
              {/* 1. VISUAL (Image) */}
              {/* Mobile: Top half (h-[40%]), Desktop: Left half (w-1/2) */}
              <div className="relative w-full lg:w-1/2 h-[35vh] lg:h-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <Image
                  src={service.visuals[0].src}
                  alt={service.visuals[0].alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={index === 0} // Load first image immediately
                />
                
                {/* Mobile-only overlay gradient for better text contrast if things overlap */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden" />
              </div>

              {/* 2. CONTENT */}
              {/* Mobile: Bottom half, Desktop: Right half */}
              <div className="flex flex-col justify-center w-full lg:w-1/2 space-y-4 lg:space-y-8">
                
                {/* Counter */}
                <span className="text-xs lg:text-sm font-mono text-white/40 tracking-widest uppercase">
                  {String(index + 1).padStart(2, '0')} — {String(servicesData.length).padStart(2, '0')}
                </span>

                {/* Title */}
                <h2 className="text-3xl sm:text-4xl lg:text-7xl font-bold leading-[0.9] tracking-tight">
                  {service.title}
                </h2>

                {/* Description */}
                <p className="text-base sm:text-lg lg:text-xl text-white/60 leading-relaxed max-w-lg text-pretty">
                  {service.description}
                </p>

                {/* Optional: 'Explore' link or button to fill space */}
                <div className="pt-4">
                  <button className="text-sm font-semibold uppercase tracking-widest border-b border-white/30 pb-1 hover:border-white transition-colors">
                    View Details
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;