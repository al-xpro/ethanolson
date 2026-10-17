"use client";

import { useRef } from "react";
import Image from "next/image";
import { servicesData, servicesHeader } from "@/content/sections";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import AnimatedHeaderSection from "../ui/AnimatedHeaderSection";
import { PillLink } from "../ui/PillLink";

const Services = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      const content = contentRef.current;
      if (!track || !content) return;

      // With reduced motion the services stack vertically instead (see motion-reduce classes)
      gsap.matchMedia().add(MOTION_OK, () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: content, // pin ONLY the content
            start: "top top",
            end: () => `+=${track.scrollWidth - window.innerWidth}`,
            pin: true,
            scrub: 0.5,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        tl.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: "none",
        });
      });
    },
    { revertOnUpdate: true }
  );

  return (
    <section
      id="services"
      className="relative bg-black text-white overflow-hidden"
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
      <div
        className="relative h-screen motion-reduce:h-auto w-full overflow-hidden"
        ref={contentRef}
      >
        <div
          ref={trackRef}
          className="flex h-full w-fit motion-reduce:w-full motion-reduce:flex-col"
        >
          {servicesData.map((service, index) => (
            <div
              key={service.title}
              className="
                w-screen h-full motion-reduce:h-screen flex-shrink-0
                flex flex-col lg:flex-row
                items-center justify-center
                gap-4 sm:gap-8 lg:gap-20 xl:gap-[2.5vw]
                p-3 sm:p-6 md:p-12 lg:p-20 xl:p-[7.5vw]
                border-r border-white/5 min-w-[320px] min-h-[300px]
              "
            >
              {/* 1. VISUAL (Image) */}
              <div className="relative w-full lg:w-1/2 h-[50vh] lg:h-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <Image
                  src={service.visual.src}
                  alt={service.visual.alt}
                  fill
                  className="object-cover transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />

                {/* Mobile-only overlay gradient for better text contrast if things overlap */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden" />
              </div>

              {/* 2. CONTENT */}
              <div className="flex flex-col justify-center w-full lg:w-1/2 space-y-4 lg:space-y-8">
                {/* Counter */}
                <span className="text-xs lg:text-sm xl:text-[1vw] font-mono text-white/60 tracking-widest uppercase">
                  {String(index + 1).padStart(2, "0")} —{" "}
                  {String(servicesData.length).padStart(2, "0")}
                </span>

                {/* Title */}
                <h3 className="text-xl sm:text-4xl lg:text-7xl xl:text-[5vw] font-bold leading-[0.9] tracking-tight">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-base sm:text-lg lg:text-xl xl:text-[1.5vw] text-white/60 leading-relaxed text-pretty">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center py-16 xl:py-[4vw]">
        <PillLink href="/services">Explore the services →</PillLink>
      </div>
    </section>
  );
};

export default Services;
