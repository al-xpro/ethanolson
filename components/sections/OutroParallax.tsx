"use client";

import { useRef } from "react";
import { getImageProps } from "next/image";
import { outroParallax } from "@/content/sections";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

export default function OutroParallax() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.fromTo(
          ".outro-image",
          { y: () => window.innerHeight * -0.1 },
          {
            y: () => window.innerHeight * 0.1,
            ease: "none",
            scrollTrigger: {
              trigger: container.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
      });
    },
    { scope: container }
  );

  // Art direction: a landscape crop for desktop, a portrait crop for phones
  const common = { alt: "", sizes: "100vw", quality: 75 };
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, ...outroParallax.desktop });
  const {
    props: { srcSet: mobileSrcSet, ...imageProps },
  } = getImageProps({ ...common, ...outroParallax.mobile });

  return (
    <div
      ref={container}
      className="relative flex items-center justify-center h-screen overflow-hidden top-7 md:top-5 xl:top-[5vh]"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="flex justify-center my-40 z-20">
        <p className="text-[5vw] text-white uppercase text-center max-w-[50vw] leading-none">
          {outroParallax.text}
        </p>
      </div>

      <div className="fixed top-[-10vh] left-0 h-[120vh] w-full">
        <div className="outro-image relative w-full h-full">
          <picture>
            <source media="(min-width: 769px)" srcSet={desktopSrcSet} />
            <source media="(max-width: 768px)" srcSet={mobileSrcSet} />
            <img
              {...imageProps}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          </picture>
        </div>
      </div>
    </div>
  );
}
