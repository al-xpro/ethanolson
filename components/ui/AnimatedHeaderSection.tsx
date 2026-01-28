"use client"

import { useRef } from "react";
import { AnimatedTextLines } from "@/components/ui/AnimatedTextLines";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const AnimatedHeaderSection = ({
  subTitle,
  title,
  text,
  textColor,
  withScrollTrigger = false,
}: {
  subTitle: string;
  title: string;
  text: string;
  textColor: string;
  withScrollTrigger?: boolean;
}) => {
  const contextRef = useRef(null);
  const headerRef = useRef(null);
  const shouldSplitTitle = title.includes(" ");
  const titleParts = shouldSplitTitle ? title.split(" ") : [title];
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: withScrollTrigger
        ? {
            trigger: contextRef.current,
          }
        : undefined,
    });
    tl.from(contextRef.current, {
      y: "50vh",
      duration: 1,
      ease: "circ.out",
    });
    tl.from(
      headerRef.current,
      {
        opacity: 0,
        y: "200",
        duration: 1,
        ease: "circ.out",
      },
      "<+0.2"
    );
  }, []);
  return (
    <div ref={contextRef} className="relative z-10">
      <div style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}>
        <div
          ref={headerRef}
          className="flex flex-col justify-center pt-10 sm:pt-12 md:pt-16 gap-10"
        >
          <p
            className={`text-xs md:text-sm font-light tracking-[0.5rem] uppercase px-5 sm:px-10 ${textColor}`}
          >
            {subTitle}
          </p>
          <div className="px-5 sm:px-10">
            <h1
              className={`flex flex-col gap-4 text-5xl sm:text-7xl md:text-9xl max-w-md uppercase md:gap-16 md:block ${textColor}`}
            >
              {titleParts.map((part, index) => (
                <span key={index}>{part} </span>
              ))}
            </h1>
          </div>
        </div>
      </div>
      <div className={`relative px-5 sm:px-10 ${textColor}`}>
        <div className="absolute inset-x-0 border-t-2" />
        <div className="py-10 sm:py-12 md:py-16 text-start">
          <AnimatedTextLines
            text={text}
            className={`font-light text-white/80 value-text-responsive text-md sm:text-xl md:text-3xl ${textColor}`}
          />
        </div>
      </div>
    </div>
  );
};

export default AnimatedHeaderSection;
