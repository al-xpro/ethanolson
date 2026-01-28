"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

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

  const linearGradients = [
    "linear-gradient(to bottom right, #06b6d4, #10b981)",
    "linear-gradient(to bottom right, #ec4899, #6366f1)",
    "linear-gradient(to bottom right, #f97316, #eab308)",
  ];

  const [backgroundGradient, setBackgroundGradient] = useState(linearGradients[0]);

  useEffect(() => {
    setBackgroundGradient(linearGradients[activeCard % linearGradients.length]);
  }, [activeCard]);

  return (
    <div className="relative mx-auto max-w-7xl px-6 py-20">
      <div className="grid grid-cols-2 gap-10">
        {/* TEXT COLUMN */}
        <div ref={ref} className="relative">
          {content.map((item, index) => (
            <div key={item.title + index} className="min-h-[80vh] flex flex-col justify-center py-10">
              <motion.h2
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                className="text-4xl font-semibold text-white"
              >
                {item.title}
              </motion.h2>

              <motion.p
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                className="mt-6 max-w-md text-lg text-slate-300 leading-relaxed"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
        </div>

        {/* STICKY MEDIA */}
        <div className="relative">
          <div
            style={{ background: backgroundGradient }}
            className={cn(
              "sticky top-32 h-[320px] w-full rounded-xl transition-colors duration-500 overflow-hidden",
              contentClassName
            )}
          >
            <Image src="/avatar.png" fill className="object-cover" alt="avatar" />
          </div>
        </div>
      </div>
    </div>
  );
};