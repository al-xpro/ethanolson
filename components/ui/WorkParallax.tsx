"use client";

import { useRef } from "react";
import Image from "next/image";
import { workImages, type Picture } from "@/content/sections";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

// Each column travels a different multiple of the viewport height while the gallery scrolls past
const columns = [
  { images: workImages.slice(0, 3), speed: 2, className: "block" },
  { images: workImages.slice(3, 6), speed: 3.3, className: "hidden md:block" },
  { images: workImages.slice(6, 9), speed: 1.25, className: "block" },
  { images: workImages.slice(9, 12), speed: 3, className: "hidden lg:block" },
];

export const WorkParallax = () => {
  const gallery = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: gallery.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        gsap.utils.toArray<HTMLElement>(".work-column").forEach((column, index) => {
          tl.to(column, { y: () => window.innerHeight * columns[index].speed, ease: "none" }, 0);
        });
      });
    },
    { scope: gallery }
  );

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

        {columns.map((column, index) => (
          <div key={index} className={`${column.className} flex-1 min-w-0`}>
            <Column images={column.images} />
          </div>
        ))}
      </div>
    </div>
  );
};

const Column = ({ images }: { images: Picture[] }) => {
  return (
    <div className="work-column relative -top-[45%] flex h-full min-h-[500px] w-full flex-col gap-[2vw] first:top-[-45%] [&:nth-child(2)]:top-[-95%] [&:nth-child(3)]:top-[-45%] [&:nth-child(4)]:top-[-75%]">
      {images.map((image) => (
        <div key={image.src} className="relative w-full h-full overflow-hidden rounded-xl xl:rounded-[1.5vw]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="pointer-events-none object-cover"
          />
        </div>
      ))}
    </div>
  );
};
