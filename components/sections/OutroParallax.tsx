"use client"

import Image from "next/image";
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";
import { OutroParallaxText } from "@/lib/data";
import { useMediaQuery } from "@/lib/useMediaQuery";

export default function OutroParallax() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10vh", "10vh"]);

  return (
    <div
      ref={container}
      className="relative flex items-center justify-center h-screen overflow-hidden top-5 xl:top-[5vh]"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="flex justify-center my-40 z-20">
        <p className="text-[5vw] text-white uppercase text-center max-w-[50vw] leading-none">
          {OutroParallaxText}
        </p>
      </div>

      <div className="fixed top-[-10vh] left-0 h-[120vh] w-full">
        <motion.div style={{ y }} className="relative w-full h-full">
          <Image src={isMobile ? "/images/landscape-small.jpg" : "/images/landscape-big.jpg"} fill alt="image" style={{ objectFit: "cover" }} />
        </motion.div>
      </div>
    </div>
  );
}
