"use client";

import { useRef } from "react";
import Image from "next/image";
import { zoomPictures } from "@/content/sections";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

export default function ZoomParallax() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        // Each picture grows around the center of the screen. Scaling the picture itself (not
        // a full-screen layer around it) keeps the scaled surface small: Safari rasterizes the
        // whole transformed layer, and full-screen layers at 9× froze the page there.
        gsap.utils.toArray<HTMLElement>(".zoom-picture").forEach((picture, index) => {
          tl.fromTo(
            picture,
            {
              scale: 1,
              transformOrigin: () => {
                const layer = picture.parentElement!;
                return `${layer.clientWidth / 2 - picture.offsetLeft}px ${layer.clientHeight / 2 - picture.offsetTop}px`;
              },
            },
            { scale: zoomPictures[index].scale, ease: "none", immediateRender: true },
            0
          );
        });
      });
    },
    { scope: container }
  );

  return (
    <div ref={container} className="h-[250vh] motion-reduce:h-screen relative">
      <div className="sticky overflow-hidden top-0 h-screen">
        {zoomPictures.map(({ src, alt, className }) => (
          <div
            key={src.src}
            className="zoom-layer size-full top-0 absolute flex items-center justify-center"
          >
            <div className={`zoom-picture ${className} relative`}>
              <Image
                src={src}
                alt={alt}
                placeholder="blur"
                sizes="(min-width: 768px) 35vw, 50vw"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
