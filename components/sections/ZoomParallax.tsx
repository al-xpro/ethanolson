"use client";

import { useRef } from "react";
import { CmsImage } from "@/components/cms/CmsImage";
import type { Home } from "@/lib/cms/model";
import { editable } from "@/lib/cms/editable";

// Where each of the six pictures sits, and how much it grows (layout, not content)
const layers = [
  { scale: 4, className: "w-[25vw] h-[25vh]" },
  { scale: 5, className: "top-[-30vh] left-[5vw] w-[35vw] h-[30vh]" },
  { scale: 6, className: "top-[-10vh] left-[-25vw] w-[20vw] h-[45vh]" },
  { scale: 7, className: "left-[27.5vw] w-[25vw] h-[25vh]" },
  { scale: 8, className: "top-[27.5vh] left-[5vw] w-[20vw] h-[25vh]" },
  { scale: 9, className: "top-[27.5vh] left-[-22.5vw] w-[30vw] h-[25vh]" },
];
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

export default function ZoomParallax({ content }: { content: Home["zoom"] }) {
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
            { scale: layers[index].scale, ease: "none", immediateRender: true },
            0
          );
        });
      });
    },
    { scope: container }
  );

  return (
    <div ref={container} {...editable(content)} className="h-[250vh] motion-reduce:h-screen relative">
      <div className="sticky overflow-hidden top-0 h-screen">
        {content.images.slice(0, layers.length).map((media, index) => (
          <div
            key={`${index}-${media.src}`}
            className="zoom-layer size-full top-0 absolute flex items-center justify-center"
          >
            <div className={`zoom-picture ${layers[index].className} relative`}>
              <CmsImage
                media={media}
                alt=""
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
