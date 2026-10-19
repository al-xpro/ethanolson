"use client";

import { useRef } from "react";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { CmsImage } from "@/components/cms/CmsImage";
import type { Media } from "@/lib/cms/fields";
import type { WorkEntry } from "@/lib/cms/types";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

type Tile = { work: WorkEntry; screen: Media; tabStop: boolean };

// Twelve tiles from the works' screens, mixed so each column shows different works. Each
// pair is (work, screen); with fewer works, they repeat.
// Each column travels a different multiple of the viewport height while the gallery scrolls past
const columns = [
  { tiles: [[0, 0], [2, 1], [4, 2]], speed: 2, className: "block" },
  { tiles: [[1, 0], [3, 1], [0, 2]], speed: 3.3, className: "hidden md:block" },
  { tiles: [[2, 0], [4, 1], [1, 2]], speed: 1.25, className: "block" },
  { tiles: [[3, 0], [0, 1], [2, 2]], speed: 3, className: "hidden lg:block" },
];

// Keyboard users reach each work once, on a tile that scrolls fully into view (the columns
// move at different speeds, so some tiles only ever show a sliver): [column, tile]
const visibleTiles = [[0, 0], [0, 1], [2, 1], [2, 2], [3, 0]];

function tilesFor(works: WorkEntry[]): Tile[][] {
  const grid = columns.map((column) =>
    column.tiles.map(([work, screen]) => {
      const entry = works[work % works.length];
      return { work: entry, screen: entry.screens[screen % entry.screens.length], tabStop: false };
    })
  );
  const reached = new Set<string>();
  for (const [column, tile] of visibleTiles) {
    const item = grid[column][tile];
    if (reached.has(item.work.slug)) continue;
    reached.add(item.work.slug);
    item.tabStop = true;
  }
  return grid;
}

export const WorkParallax = ({ works }: { works: WorkEntry[] }) => {
  const grid = tilesFor(works);
  const gallery = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const tl = (timeline.current = gsap.timeline({
          scrollTrigger: {
            trigger: gallery.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }));

        gsap.utils.toArray<HTMLElement>(".work-column").forEach((column, index) => {
          tl.to(column, { y: () => window.innerHeight * columns[index].speed, ease: "none" }, 0);
        });

        return () => {
          timeline.current = null;
        };
      });
    },
    { scope: gallery }
  );

  // The columns move with the scroll, so a focused tile can sit outside the screen or the
  // gallery. Find the scroll position that shows the most of it, as close to the center as
  // possible. It waits a frame: the browser scrolls a focused element into view after the
  // focus event, which would undo this.
  const showFocusedTile = (event: React.FocusEvent<HTMLDivElement>) => {
    const link = (event.target as HTMLElement).closest("a");
    requestAnimationFrame(() => showTile(link));
  };

  const showTile = (link: HTMLAnchorElement | null) => {
    const trigger = timeline.current?.scrollTrigger;
    const column = link?.closest<HTMLElement>(".work-column");
    if (!trigger || !link || !column || !gallery.current) return;

    const viewport = window.innerHeight;
    const travel = viewport * columns[Number(column.dataset.column)].speed;
    // Where the tile would be with the column at rest
    const restTop = link.getBoundingClientRect().top + window.scrollY - Number(gsap.getProperty(column, "y"));
    const galleryTop = gallery.current.getBoundingClientRect().top + window.scrollY;
    const galleryBottom = galleryTop + gallery.current.offsetHeight;

    let best: number | null = null;
    let bestShown = 0;
    let bestDistance = Infinity;
    for (let step = 0; step <= 400; step++) {
      const progress = step / 400;
      const scroll = trigger.start + (trigger.end - trigger.start) * progress;
      const top = restTop + travel * progress;
      const bottom = top + link.offsetHeight;
      const shown = Math.min(bottom, scroll + viewport, galleryBottom) - Math.max(top, scroll, galleryTop);
      const distance = Math.abs((top + bottom) / 2 - (scroll + viewport / 2));
      if (shown > bestShown + 1 || (shown > bestShown - 1 && distance < bestDistance)) {
        best = scroll;
        bestShown = Math.max(shown, bestShown);
        bestDistance = distance;
      }
    }
    if (best === null) return;
    if (lenis) lenis.scrollTo(best, { immediate: true, force: true });
    else window.scrollTo(0, best);
  };

  return (
    <div className="relative w-full h-full">
      <div
        ref={gallery}
        onFocus={showFocusedTile}
        // clip, not hidden: a hidden box scrolls itself to show a focused tile, which drags
        // the shades away from its edges
        className="relative box-border flex h-[175vh] min-h-[500px] gap-[2vw] overflow-clip p-[2vw]"
      >
        <div className="parallax-shade parallax-shade--top" />
        <div className="parallax-shade parallax-shade--bottom" />

        {columns.map((column, index) => (
          <div key={index} className={`${column.className} flex-1 min-w-0`}>
            <Column tiles={grid[index]} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
};

const Column = ({ tiles, index }: { tiles: Tile[]; index: number }) => {
  return (
    <div
      data-column={index}
      className="work-column relative -top-[45%] flex h-full min-h-[500px] w-full flex-col gap-[2vw] first:top-[-45%] [&:nth-child(2)]:top-[-95%] [&:nth-child(3)]:top-[-45%] [&:nth-child(4)]:top-[-75%]"
    >
      {tiles.map(({ work, screen, tabStop }, tileIndex) => (
        <Link
          key={tileIndex}
          href={`/works/${work.slug}`}
          aria-label={`${work.title}, ${work.category}`}
          // Repeated tiles stay clickable but out of the tab order and the accessibility tree
          tabIndex={tabStop ? undefined : -1}
          aria-hidden={tabStop ? undefined : true}
          className="group relative block w-full h-full overflow-hidden rounded-xl xl:rounded-[1.5vw]"
        >
          <CmsImage
            media={screen}
            alt=""
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
          />
          {/* Hover: a black backdrop with the project's name and an arrow in the center */}
          <span className="absolute inset-0 flex items-center justify-center gap-3 bg-black/75 px-4 text-center text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
            <span className="text-lg xl:text-[1.5vw] uppercase leading-none">{work.title}</span>
            <span aria-hidden className="text-lg xl:text-[1.5vw] transition-[translate] duration-500 group-hover:translate-x-1">
              →
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
};
