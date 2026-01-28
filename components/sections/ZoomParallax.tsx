"use client";

import Image from "next/image";
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";
import { Picture1, Picture2, Picture3, Picture4, Picture5, Picture6 } from "@/lib/data";


export default function ZoomParallax() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 4]);

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale7 = useTransform(scrollYProgress, [0, 1], [1, 7]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

const pictures = [
  { src: Picture1, scale: scale4, className: "w-[25vw] h-[25vh]" },
  { src: Picture2, scale: scale5, className: "top-[-30vh] left-[5vw] w-[35vw] h-[30vh]" },
  { src: Picture3, scale: scale6, className: "top-[-10vh] left-[-25vw] w-[20vw] h-[45vh]" },
  { src: Picture4, scale: scale7, className: "left-[27.5vw] w-[25vw] h-[25vh]" },
  { src: Picture5, scale: scale8, className: "top-[27.5vh] left-[5vw] w-[20vw] h-[25vh]" },
  { src: Picture6, scale: scale9, className: "top-[27.5vh] left-[-22.5vw] w-[30vw] h-[25vh]" },
];

  return (
    <div ref={container} className="h-[300vh] relative">
      <div className="sticky overflow-hidden top-0 h-screen">
        {pictures.map(({ src, scale }, index) => {
          return (
            <motion.div
              key={index}
              style={{ scale }}
              className="size-full top-0 absolute flex items-center justify-center"
            >
              {" "}
              {/* styles.el */}
              <div className={`${pictures[index].className} relative`}>
                <img src={src} alt="image" className="object-cover w-full h-full" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
