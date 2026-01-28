"use client"

import Image from "next/image";
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

export default function ImageParallax() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10vh", "10vh"]);

  return (
    <div
      ref={container}
      className="relative flex items-center justify-center h-screen overflow-hidden"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="flex justify-center my-40 border border-red-500 z-20">
        <p className="text-[7.5vw] uppercase text-center max-w-[50vw] leading-none">
          The quick brown fox jumps over the lazy dog
        </p>
      </div>

      <div className="fixed top-[-10vh] left-0 h-[120vh] w-full">
        <motion.div style={{ y }} className="relative w-full h-full">
          <Image src="/images/sea.avif" fill alt="image" style={{ objectFit: "cover" }} />
        </motion.div>
      </div>
    </div>
  );
}
