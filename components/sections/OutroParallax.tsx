"use client";

import { useRef } from "react";
import type { Home } from "@/lib/cms/model";
import type { Media } from "@/lib/cms/fields";
import { editable } from "@/lib/cms/editable";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

// One width per crop: Storyblok resizes its own images, Next.js the local ones
const photoUrl = (media: Media, width: number) =>
  media.src.endsWith(".svg")
    ? media.src
    : media.src.startsWith("https://a.storyblok.com/")
      ? `${media.src}/m/${width}x0/filters:quality(75)`
      : `/_next/image?url=${encodeURIComponent(media.src)}&w=${width}&q=75`;

// The photo, with its blur preview underneath until it loads
const background = (media: Media, width: number) =>
  [`url("${photoUrl(media, width)}")`, media.blurDataURL && `url("${media.blurDataURL}")`].filter(Boolean).join(", ");

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
          {/* Backgrounds, not an <img>: Safari rasterized the full-screen <img> the first time
              it scrolled in (a 60 ms frame), and doesn't for a background. A landscape crop
              for desktop, a portrait one for phones: a hidden element's background isn't
              downloaded, so each screen fetches only its own. */}
          <div
            className="absolute inset-0 hidden min-[769px]:block bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: background(content.desktopImage, 1920) }}
          />
          <div
            className="absolute inset-0 min-[769px]:hidden bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: background(content.mobileImage, 1080) }}
          />
        </div>
      </div>
    </div>
  );
}
