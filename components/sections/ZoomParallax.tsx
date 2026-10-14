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
          },
        });

        gsap.utils.toArray<HTMLElement>(".zoom-layer").forEach((layer, index) => {
          tl.to(layer, { scale: zoomPictures[index].scale, ease: "none" }, 0);
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
            key={src}
            className="zoom-layer size-full top-0 absolute flex items-center justify-center"
          >
            <div className={`${className} relative`}>
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(min-width: 768px) 35vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
