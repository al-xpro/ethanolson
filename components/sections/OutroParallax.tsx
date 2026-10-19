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
        // The section scrolls 2 screens past the viewport; moving the image 2.2 screens the
        // other way keeps it nearly still on screen, as if fixed, with a slight drift
        gsap.fromTo(
          ".outro-image",
          { y: () => window.innerHeight * -1.1 },
          {
            y: () => window.innerHeight * 1.1,
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
  const common = { alt: "", sizes: "100vw", quality: 75, placeholder: "blur" as const };
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, src: outroParallax.desktop });
  const {
    props: { srcSet: mobileSrcSet, ...imageProps },
  } = getImageProps({ ...common, src: outroParallax.mobile });

  return (
    // A transformed layer, not position: fixed inside a clip-path: Safari repainted the
    // fixed full-screen photo on every scroll frame, which froze the home page there
    <div ref={container} className="relative flex items-center justify-center h-screen overflow-hidden">
      <div className="flex justify-center my-40 z-20">
        <p className="text-4xl sm:text-6xl xl:text-[5vw] text-white uppercase text-center text-balance max-w-[88vw] sm:max-w-[70vw] xl:max-w-[50vw] leading-none">
          {outroParallax.text}
        </p>
      </div>

      <div className="absolute top-[-10vh] left-0 h-[120vh] w-full">
        <div className="outro-image relative w-full h-full will-change-transform">
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
