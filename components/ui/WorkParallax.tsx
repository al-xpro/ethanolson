"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { works, workScreens, type Work } from "@/content/works";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

type Tile = { work: Work; src: string };

// Twelve tiles from the five projects' screens, mixed so each column shows different projects
const tile = (index: number, screen: number): Tile => ({
  work: works[index % works.length],
  src: workScreens(works[index % works.length].slug)[screen],
});

// Each column travels a different multiple of the viewport height while the gallery scrolls past
const columns = [
  { tiles: [tile(0, 0), tile(2, 1), tile(4, 2)], speed: 2, className: "block" },
  { tiles: [tile(1, 0), tile(3, 1), tile(0, 2)], speed: 3.3, className: "hidden md:block" },
  { tiles: [tile(2, 0), tile(4, 1), tile(1, 2)], speed: 1.25, className: "block" },
  { tiles: [tile(3, 0), tile(0, 1), tile(2, 2)], speed: 3, className: "hidden lg:block" },
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
        className="relative box-border flex h-[175vh] min-h-[500px] gap-[2vw] overflow-hidden p-[2vw]"
      >
        <div className="parallax-shade parallax-shade--top" />
        <div className="parallax-shade parallax-shade--bottom" />

        {columns.map((column, index) => (
          <div key={index} className={`${column.className} flex-1 min-w-0`}>
            <Column tiles={column.tiles} />
          </div>
        ))}
      </div>
    </div>
  );
};

const Column = ({ tiles }: { tiles: Tile[] }) => {
  return (
    <div className="work-column relative -top-[45%] flex h-full min-h-[500px] w-full flex-col gap-[2vw] first:top-[-45%] [&:nth-child(2)]:top-[-95%] [&:nth-child(3)]:top-[-45%] [&:nth-child(4)]:top-[-75%]">
      {tiles.map(({ work, src }) => (
        <Link
          key={src}
          href={`/works/${work.slug}`}
          aria-label={`${work.title}, ${work.category}`}
          className="group relative block w-full h-full overflow-hidden rounded-xl xl:rounded-[1.5vw]"
        >
          <Image
            src={src}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
          />
          <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/80 to-transparent p-4 xl:p-[1.2vw] pt-16 text-white opacity-0 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0">
            <span className="text-base xl:text-[1.2vw] uppercase leading-none">{work.title}</span>
            <span aria-hidden>→</span>
          </span>
        </Link>
      ))}
    </div>
  );
};
