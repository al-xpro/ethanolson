"use client";

import { useRef } from "react";
import Image from "next/image";
import AnimatedHeaderSection from "@/components/ui/AnimatedHeaderSection";
import { PillLink } from "@/components/ui/PillLink";
import { aboutHome, aboutHomePortrait } from "@/content/about";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

export default function About() {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from(".about-stat", {
          y: 40,
          opacity: 0,
          stagger: 0.12,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: ".about-stats", start: "top 85%" },
        });
      });
    },
    { scope: container }
  );

  return (
    <section ref={container} id="about" className="relative bg-black rounded-t-4xl xl:rounded-t-[3vw]">
      <AnimatedHeaderSection
        subTitle={aboutHome.subTitle}
        title={aboutHome.title}
        text={aboutHome.text}
        textColor="text-white"
        withScrollTrigger
      />

      <div className="grid gap-12 lg:grid-cols-2 xl:gap-[4vw] px-5 sm:px-10 xl:px-[1.5vw] pb-24 xl:pb-[6vw] text-white">
        <div className="relative aspect-square overflow-hidden rounded-3xl xl:rounded-[2vw]">
          <Image
            src={aboutHomePortrait.src}
            alt={aboutHomePortrait.alt}
            placeholder="blur"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="h-full w-full object-cover grayscale contrast-125 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        <div className="flex flex-col justify-end gap-10 xl:gap-[2.5vw]">
          <p className="text-xl sm:text-2xl xl:text-[1.9vw] leading-snug text-white/85 text-pretty">
            {aboutHome.bio}
          </p>
          <dl className="about-stats grid grid-cols-3 gap-4 xl:gap-[1.5vw] border-t border-white/20 pt-8 xl:pt-[2vw]">
            {aboutHome.stats.map((stat) => (
              <div key={stat.label} className="about-stat flex flex-col gap-2">
                <dt className="order-2 text-xs sm:text-sm xl:text-[0.95vw] text-white/60 leading-snug">
                  {stat.label}
                </dt>
                <dd className="text-4xl sm:text-5xl xl:text-[4vw] leading-none">{stat.value}</dd>
              </div>
            ))}
          </dl>
          <PillLink href="/about" className="self-start">
            {aboutHome.link} →
          </PillLink>
        </div>
      </div>
    </section>
  );
}
