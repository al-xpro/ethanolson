"use client";

import { useRef } from "react";
import { servicesData, servicesHeader } from "@/lib/data";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedHeaderSection from "../ui/AnimatedHeaderSection";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      const content = contentRef.current;
      if (!track || !content) return;

      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: content, // ✅ pin ONLY the content
          start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          pin: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      tl.to(track, {
        x: getScrollAmount,
        ease: "none",
      });
    },
    { revertOnUpdate: true }
  );

  return (
    <section
      id="services"
      ref={containerRef}
      className="relative bg-black text-white overflow-hidden rounded-t-4xl xl:rounded-t-[2.5vw]"
    >
      {/* HEADER SECTION: shrink-0 prevents it from being crushed by the flex column */}
      <div className="shrink-0">
        <AnimatedHeaderSection
          subTitle={servicesHeader.subTitle}
          title={servicesHeader.title}
          text={servicesHeader.text}
          textColor={"text-white"}
          withScrollTrigger={true}
        />
      </div>

      {/* ─── HORIZONTAL TRACK ─── */}
      {/* flex-1: Fills the remaining vertical space after the header */}
      <div className="relative h-screen w-full overflow-hidden" ref={contentRef}>
        <div ref={trackRef} className="flex h-full w-fit">
          {servicesData.map((service, index) => (
            <div
              key={index}
              className="
                w-screen h-full flex-shrink-0
                flex flex-col lg:flex-row
                items-center justify-center
                gap-4 sm:gap-8 lg:gap-20 xl:gap-[2.5vw]
                p-3 sm:p-6 md:p-12 lg:p-20 xl:p-[7.5vw]
                border-r border-white/5 min-w-[320px] min-h-[300px]
              "
            >
              {/* 1. VISUAL (Image) */}
              {/* Mobile: Top half (h-[40%]), Desktop: Left half (w-1/2) */}
              <div className="relative w-full lg:w-1/2 h-[50vh] lg:h-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <Image
                  src={service.visuals[0].src}
                  alt={service.visuals[0].alt}
                  fill
                  className="object-cover transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />

                {/* Mobile-only overlay gradient for better text contrast if things overlap */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden" />
              </div>

              {/* 2. CONTENT */}
              {/* Mobile: Bottom half, Desktop: Right half */}
              <div className="flex flex-col justify-center w-full lg:w-1/2 space-y-4 lg:space-y-8">
                {/* Counter */}
                <span className="text-xs lg:text-sm xl:text-[1vw] font-mono text-white/40 tracking-widest uppercase">
                  {String(index + 1).padStart(2, "0")} —{" "}
                  {String(servicesData.length).padStart(2, "0")}
                </span>

                {/* Title */}
                <h2 className="text-xl sm:text-4xl lg:text-7xl xl:text-[5vw] font-bold leading-[0.9] tracking-tight">
                  {service.title}
                </h2>

                {/* Description */}
                <p className="text-base sm:text-lg lg:text-xl xl:text-[1.5vw] text-white/60 leading-relaxed text-pretty">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
