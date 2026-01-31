"use client";
import React, { useRef } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { CaseStudiesContent } from "@/lib/data";

export const StickyScrollRevealLarge = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode | any;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce((acc, breakpoint, index) => {
      const distance = Math.abs(latest - breakpoint);
      if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
        return index;
      }
      return acc;
    }, 0);
    setActiveCard(closestBreakpointIndex);
  });


  return (
    <div className="relative mx-auto px-6 xl:px-[3vw] py-20 xl:py-[5vw]">
      <div className="relative grid grid-cols-[300px_auto] lg:grid-cols-2 gap-10 xl:gap-[5vw]">
        <div ref={ref} className="relative">
          {content.map((item, index) => (
            <div
              key={item.title + index}
              className="relative h-[80vh] min-h-[500px] flex flex-col justify-center py-10 xl:py-[5vw]"
            >
              <motion.h2
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                className="text-4xl xl:text-[3vw] font-semibold text-white"
              >
                {item.title}
              </motion.h2>

              <motion.p
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                className="mt-6 xl:mt-[2vw] text-lg xl:text-[2vw] text-white/80 leading-relaxed"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
        </div>

        <div className="relative">
          <div
            className={cn(
              "sticky top-20 xl:top-[5vw] h-[30vh] lg:h-[40vh] min-h-[250px] aspect-square w-full rounded-4xl xl:rounded-[3vw] transition-colors duration-500 overflow-hidden",
              contentClassName
            )}
          >
            <div className="relative w-full h-full">
              {CaseStudiesContent.map((item, index) => (
                <motion.div
                  key={item.image.src}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{
                    opacity: activeCard === index ? 1 : 0,
                    scale: activeCard === index ? 1 : 1.05,
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    priority={index === 0}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
