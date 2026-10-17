"use client";

import { useRef } from "react";
import { notFoundPage } from "@/content/sections";
import { PillLink } from "@/components/ui/PillLink";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

export function NotFoundView() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const digits = gsap.utils.toArray<HTMLElement>(".digit");

        // The digits drop in and bounce, one after the other
        gsap.from(digits, {
          yPercent: -160,
          rotate: (index) => [-18, 12, -8][index],
          opacity: 0,
          stagger: 0.15,
          duration: 1.4,
          ease: "bounce.out",
        });

        // Then each one follows the pointer at its own depth
        const movers = digits.map((digit) => ({
          x: gsap.quickTo(digit, "x", { duration: 0.8, ease: "power3" }),
          y: gsap.quickTo(digit, "y", { duration: 0.8, ease: "power3" }),
        }));
        const depth = [30, -45, 60];

        const onMove = (event: PointerEvent) => {
          const dx = event.clientX / window.innerWidth - 0.5;
          const dy = event.clientY / window.innerHeight - 0.5;
          movers.forEach((mover, index) => {
            mover.x(dx * depth[index]);
            mover.y(dy * depth[index]);
          });
        };
        window.addEventListener("pointermove", onMove);
        return () => window.removeEventListener("pointermove", onMove);
      });
    },
    { scope: container }
  );

  return (
    <section
      ref={container}
      className="flex min-h-screen flex-col items-center justify-center gap-8 xl:gap-[2vw] px-5 pt-24 pb-16 text-center text-white"
    >
      <p className="text-xs md:text-sm xl:text-[1vw] font-light tracking-[0.5rem] uppercase">
        {notFoundPage.subTitle}
      </p>
      <p aria-hidden className="flex text-[34vw] sm:text-[26vw] leading-[0.8]">
        {["4", "0", "4"].map((digit, index) => (
          <span key={index} className={`digit inline-block ${index === 1 ? "text-outline" : ""}`}>
            {digit}
          </span>
        ))}
      </p>
      <h1 className="text-4xl sm:text-6xl xl:text-[4vw] uppercase leading-none">{notFoundPage.title}</h1>
      <p className="max-w-md xl:max-w-[30vw] text-lg xl:text-[1.3vw] text-white/70">{notFoundPage.text}</p>
      <div className="flex flex-wrap justify-center gap-4">
        <PillLink href={notFoundPage.primary.href}>{notFoundPage.primary.label}</PillLink>
        <PillLink href={notFoundPage.secondary.href} className="border-white/40 text-white/80">
          {notFoundPage.secondary.label}
        </PillLink>
      </div>
    </section>
  );
}
