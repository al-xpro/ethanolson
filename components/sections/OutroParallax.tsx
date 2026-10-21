"use client";

import { useRef } from "react";
import { getImageProps } from "next/image";
import type { Home } from "@/lib/cms/model";
import type { Media } from "@/lib/cms/fields";
import { editable } from "@/lib/cms/editable";

// Storyblok images are resized by Storyblok, local ones by Next.js
const storyblok = (media: Media, width: number) => `${media.src}/m/${width}x0/filters:quality(75)`;
const srcSet = (media: Media) =>
  media.src.startsWith("https://a.storyblok.com/") && !media.src.endsWith(".svg")
    ? [640, 1080, 1920, 2560].map((width) => `${storyblok(media, width)} ${width}w`).join(", ")
    : undefined;
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

export default function OutroParallax({ content }: { content: Home["outro"] }) {
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
  } = getImageProps({ ...common, src: content.desktopImage.src, width: content.desktopImage.width, height: content.desktopImage.height, blurDataURL: content.desktopImage.blurDataURL });
  const {
    props: { srcSet: mobileSrcSet, ...imageProps },
  } = getImageProps({ ...common, src: content.mobileImage.src, width: content.mobileImage.width, height: content.mobileImage.height, blurDataURL: content.mobileImage.blurDataURL });

  return (
    // A transformed layer, not position: fixed inside a clip-path: Safari repainted the
    // fixed full-screen photo on every scroll frame, which froze the home page there
    <div ref={container} {...editable(content)} className="relative flex items-center justify-center h-screen overflow-hidden">
      <div className="flex justify-center my-40 z-20">
        <p className="text-4xl sm:text-6xl xl:text-[5vw] text-white uppercase text-center text-balance max-w-[88vw] sm:max-w-[70vw] xl:max-w-[50vw] leading-none">
          {content.text}
        </p>
      </div>

      <div className="absolute top-[-10vh] left-0 h-[120vh] w-full">
        <div className="outro-image relative w-full h-full will-change-transform">
          <picture>
            <source media="(min-width: 769px)" srcSet={srcSet(content.desktopImage) ?? desktopSrcSet} />
            <source media="(max-width: 768px)" srcSet={srcSet(content.mobileImage) ?? mobileSrcSet} />
            <img
              {...imageProps}
              alt=""
              // On high-density screens the photo is painted at half size and scaled up 2×:
              // a quarter of the pixels to rasterize when it first scrolls in, which Safari
              // did in one frame and stalled on (a background photo behind text stays sharp
              // enough at 1×)
              className="absolute inset-0 w-full h-full object-cover [@media(min-resolution:2dppx)]:h-1/2 [@media(min-resolution:2dppx)]:w-1/2 [@media(min-resolution:2dppx)]:origin-top-left [@media(min-resolution:2dppx)]:scale-200"
            />
          </picture>
        </div>
      </div>
    </div>
  );
}
