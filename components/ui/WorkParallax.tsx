"use client";

import { workImages } from "@/lib/data";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";


export const WorkParallax = () => {
  const gallery = useRef<HTMLDivElement>(null);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ["start end", "end start"],
  });

  const { height } = dimension;
  const y = useTransform(scrollYProgress, [0, 1], [0, height * 2]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, height * 3.3]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, height * 1.25]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, height * 3]);

  useEffect(() => {
    const lenis = new Lenis();

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    const resize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", resize);
    requestAnimationFrame(raf);
    resize();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div
        ref={gallery}
        className="relative box-border flex h-[175vh] min-h-[500px]  gap-[2vw] overflow-hidden p-[2vw]"
      >
        {/* TOP BLUR */}
        <div className="parallax-blur parallax-blur--top" />

        {/* BOTTOM BLUR */}
        <div className="parallax-blur parallax-blur--bottom" />

        <div className="block">
          <Column images={[workImages[0], workImages[1], workImages[2]]} y={y} />
        </div>
        <div className="hidden md:block">
          <Column images={[workImages[3], workImages[4], workImages[5]]} y={y2} />
        </div>
        <div className="block">
          <Column images={[workImages[6], workImages[7], workImages[8]]} y={y3} />
        </div>
        <div className="hidden lg:block">
          <Column images={[workImages[9], workImages[10], workImages[11]]} y={y4} />
        </div>
      </div>
    </div>
  );
};

type ColumnProps = {
  images: string[];
  y: MotionValue<number>;
};

const Column = ({ images, y }: ColumnProps) => {
  return (
    <motion.div
      className="relative -top-[45%] flex h-full min-h-[500px] w-full flex-col gap-[2vw] first:top-[-45%] [&:nth-child(2)]:top-[-95%] [&:nth-child(3)]:top-[-45%] [&:nth-child(4)]:top-[-75%]"
      style={{ y }}
    >
      {images.map((src, i) => (
        <div key={i} className="relative w-full h-full overflow-hidden">
          <img
            src={`${src}`}
            alt="image"
            className="pointer-events-none w-full h-full object-cover rounded-xl xl:rounded-[1.5vw]"
          />
        </div>
      ))}
    </motion.div>
  );
};
