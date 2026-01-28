"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

export const StickyScrollRevealSmall = ({
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
  const [isOverlapping, setIsOverlapping] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [wasOverlapping, setWasOverlapping] = useState(false);
  const [lastOverlappingIndex, setLastOverlappingIndex] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const firstContentRef = useRef<HTMLDivElement>(null);
  const lastContentRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const cardLength = content.length;

  // Desktop: use scroll progress for active card
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Only use this for desktop - mobile uses the overlap-based detection
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      const cardsBreakpoints = content.map((_, index) => index / cardLength);
      const closestBreakpointIndex = cardsBreakpoints.reduce((acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      }, 0);
      setActiveCard(closestBreakpointIndex);
    }
  });

  // Check visibility, overlap, and active card for mobile sticky element
  useEffect(() => {
    const checkStickyState = () => {
      if (!stickyRef.current || !firstContentRef.current || !lastContentRef.current) return;
      
      // Detect scroll direction
      const currentScrollY = window.scrollY;
      const direction = currentScrollY > lastScrollY ? 'down' : 'up';
      setScrollDirection(direction);
      setLastScrollY(currentScrollY);
      
      const firstContentRect = firstContentRef.current.getBoundingClientRect();
      const lastContentRect = lastContentRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Sticky should be visible when first content starts entering viewport
      // and hidden when last content leaves viewport
      const shouldBeVisible = 
        firstContentRect.top < viewportHeight * 0.8 && 
        lastContentRect.bottom > viewportHeight * 0.2;
      
      setStickyVisible(shouldBeVisible);

      // Check overlap with actual text elements (h2 and p tags)
      if (!shouldBeVisible) {
        setIsOverlapping(false);
        return;
      }

      const stickyRect = stickyRef.current.getBoundingClientRect();
      let overlapping = false;
      let overlappingIndex: number | null = null;

      contentRefs.current.forEach((contentEl, index) => {
        if (!contentEl) return;
        
        // Get the actual text elements inside the content div
        const textElements = contentEl.querySelectorAll('h2, p');
        
        textElements.forEach((textEl) => {
          const textRect = textEl.getBoundingClientRect();
          
          // Check if sticky overlaps with text (with some padding)
          const isOverlap = !(
            stickyRect.bottom < textRect.top + 10 ||
            stickyRect.top > textRect.bottom - 10
          );
          
          if (isOverlap) {
            overlapping = true;
            // Track which section is currently being overlapped
            overlappingIndex = index;
          }
        });
      });

      // Update active card based on overlap and scroll direction
      if (direction === 'down') {
        // Scrolling down: update when we START overlapping with a new section
        if (overlapping && overlappingIndex !== null) {
          setActiveCard(overlappingIndex);
        }
      } else {
        // Scrolling up: update when we STOP overlapping with the current section
        // This means we've scrolled past it and should go to the previous one
        if (wasOverlapping && !overlapping && lastOverlappingIndex !== null) {
          // We just stopped overlapping while scrolling up, go to previous section
          const prevIndex = Math.max(0, lastOverlappingIndex - 1);
          setActiveCard(prevIndex);
        } else if (overlapping && overlappingIndex !== null && overlappingIndex < activeCard) {
          // We're overlapping with a section that's before our current active card
          setActiveCard(overlappingIndex);
        }
      }
      
      // Track overlap state for next frame
      setWasOverlapping(overlapping);
      if (overlapping && overlappingIndex !== null) {
        setLastOverlappingIndex(overlappingIndex);
      }
      
      setIsOverlapping(overlapping);
    };

    window.addEventListener("scroll", checkStickyState);
    window.addEventListener("resize", checkStickyState);
    checkStickyState();

    return () => {
      window.removeEventListener("scroll", checkStickyState);
      window.removeEventListener("resize", checkStickyState);
    };
  }, [content.length, lastScrollY, wasOverlapping, lastOverlappingIndex, activeCard]);

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
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10 md:py-20">
      {/* Desktop Layout - Side by side */}
      <div className="hidden md:grid md:grid-cols-2 gap-10">
        {/* TEXT COLUMN */}
        <div ref={ref} className="">
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
        <div>
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

      {/* Mobile Layout - Stacked with sticky overlay */}
      <div className="md:hidden relative" ref={ref}>
        {/* Content sections */}
        <div className="relative z-10">
          {content.map((item, index) => {
            const isFirst = index === 0;
            const isLast = index === content.length - 1;
            
            return (
              <div
                key={item.title + index}
                ref={(el) => {
                  contentRefs.current[index] = el;
                  if (isFirst) firstContentRef.current = el;
                  if (isLast) lastContentRef.current = el;
                }}
                className="min-h-[60vh] flex flex-col justify-center py-8"
              >
                <motion.h2
                  animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                  className="text-2xl sm:text-3xl font-semibold text-white"
                >
                  {item.title}
                </motion.h2>

                <motion.p
                  animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                  className="mt-4 text-base text-slate-300 leading-relaxed"
                >
                  {item.description}
                </motion.p>
              </div>
            );
          })}
        </div>

        {/* Sticky Media - positioned at bottom of viewport, only visible during scroll range */}
        <motion.div
          ref={stickyRef}
          animate={{ 
            opacity: stickyVisible ? (isOverlapping ? 0.3 : 1) : 0,
            y: stickyVisible ? 0 : 20
          }}
          transition={{ duration: 0.3 }}
          style={{ background: backgroundGradient }}
          className={cn(
            "sticky bottom-4 left-0 right-0 h-[180px] w-full rounded-xl transition-colors duration-500 overflow-hidden z-0",
            contentClassName
          )}
        >
          <Image src="/avatar.png" fill className="object-cover" alt="avatar" />
        </motion.div>
      </div>
    </div>
  );
};
