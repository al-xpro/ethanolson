"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface MaskEntryProps {
  imageSrc?: string;
  leftText?: string;
  rightText?: string;
}

export function MaskEntry({
  imageSrc = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
  leftText = "EXPLORE",
  rightText = "BEYOND",
}: MaskEntryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, {
    once: false,
    amount: 0.3,
  });
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    if (isInView && !hasEntered) {
      setHasEntered(true);
    }
  }, [isInView, hasEntered]);

  // Diamond polygon clip-path animation
  // Starts as a small centered diamond, expands to cover entire image
  const clipPathVariants = {
    hidden: {
      clipPath: "polygon(50% 45%, 55% 50%, 50% 55%, 45% 50%)",
    },
    visible: {
      clipPath: "polygon(50% -50%, 150% 50%, 50% 150%, -50% 50%)",
      transition: {
        duration: 1.4,
        ease: [0.65, 0, 0.35, 1],
      },
    },
  };

  const imageScaleVariants = {
    hidden: {
      scale: 1.3,
    },
    visible: {
      scale: 1,
      transition: {
        duration: 1.6,
        ease: [0.65, 0, 0.35, 1],
      },
    },
  };

  // Left text moves to the left
  const leftTextVariants = {
    hidden: {
      x: 0,
      opacity: 0,
    },
    visible: {
      x: "-50%",
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: [0.65, 0, 0.35, 1],
      },
    },
  };

  // Right text moves to the right
  const rightTextVariants = {
    hidden: {
      x: 0,
      opacity: 0,
    },
    visible: {
      x: "50%",
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: [0.65, 0, 0.35, 1],
      },
    },
  };

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-neutral-950">
      {/* Text Layer - Behind the image */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="flex items-center gap-4 md:gap-8 lg:gap-12">
          {/* Left Text - Moves Left */}
          <motion.span
            variants={leftTextVariants as any}
            initial="hidden"
            animate={hasEntered ? "visible" : "hidden"}
            className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-tighter"
          >
            {leftText}
          </motion.span>

          {/* Right Text - Moves Right */}
          <motion.span
            variants={rightTextVariants as any}
            initial="hidden"
            animate={hasEntered ? "visible" : "hidden"}
            className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-tighter"
          >
            {rightText}
          </motion.span>
        </div>
      </div>

      {/* Masked Image Container - Full Viewport */}
      <motion.div
        variants={clipPathVariants as any}
        initial="hidden"
        animate={hasEntered ? "visible" : "hidden"}
        className="absolute inset-0"
      >
        {/* Image with Scale Animation */}
        <motion.div
          variants={imageScaleVariants as any}
          initial="hidden"
          animate={hasEntered ? "visible" : "hidden"}
          className="absolute inset-0"
        >
          <img
            src={imageSrc || "/placeholder.svg"}
            alt="Featured visual"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
