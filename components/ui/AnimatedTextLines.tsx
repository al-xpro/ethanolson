"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

export const AnimatedTextLines = ({ text, className }: { text: string; className: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lines = text.split("\n").filter((line) => line.trim() !== "");
  useGSAP(() => {
    if (lineRefs.current.length === 0) return;
    gsap.matchMedia().add(MOTION_OK, () => {
      gsap.from(lineRefs.current, {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.3,
        ease: "back.out",
        scrollTrigger: {
          trigger: containerRef.current,
        },
      });
    });
  });

  return (
    <div ref={containerRef} className={className}>
      {lines.map((line, index) => (
        <span
          key={index}
          ref={(el) => {
            lineRefs.current[index] = el;
          }}
          className="block leading-relaxed tracking-wide text-left text-pretty text-md sm:text-xl md:text-3xl xl:text-[2vw]"
        >
          {line}
        </span>
      ))}
    </div>
  );
};
