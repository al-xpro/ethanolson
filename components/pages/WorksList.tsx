"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { works, workCover } from "@/content/works";
import { gsap, useGSAP, MOTION_OK, SplitText } from "@/lib/gsap";

export function WorksList() {
  const container = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const moveTo = useRef<{
    x: gsap.QuickToFunc;
    y: gsap.QuickToFunc;
    rotate: gsap.QuickToFunc;
  } | null>(null);
  const lastX = useRef(0);

  useGSAP(
    () => {
      // The preview trails the cursor and leans into the direction of travel
      moveTo.current = {
        x: gsap.quickTo(preview.current, "x", { duration: 0.6, ease: "power3" }),
        y: gsap.quickTo(preview.current, "y", { duration: 0.6, ease: "power3" }),
        rotate: gsap.quickTo(preview.current, "rotate", { duration: 0.8, ease: "power3" }),
      };

      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>(".work-row").forEach((row) => {
          const split = SplitText.create(row.querySelector(".work-title"), {
            type: "chars",
            mask: "chars",
          });
          gsap
            .timeline({ scrollTrigger: { trigger: row, start: "top 88%" } })
            .from(row.querySelector(".work-rule"), {
              scaleX: 0,
              transformOrigin: "left center",
              duration: 1,
              ease: "power3.inOut",
            })
            .from(split.chars, { yPercent: 105, stagger: 0.025, duration: 0.7, ease: "power4.out" }, "<+0.2")
            .from(row.querySelectorAll(".work-meta"), { opacity: 0, y: 12, duration: 0.5 }, "<+0.2");
        });
      });
    },
    { scope: container }
  );

  const showPreview = (visible: boolean) =>
    gsap.to(preview.current, {
      scale: visible ? 1 : 0,
      opacity: visible ? 1 : 0,
      duration: 0.45,
      ease: visible ? "back.out(1.6)" : "power2.in",
      overwrite: "auto",
    });

  const onMouseMove = (event: React.MouseEvent) => {
    if (!moveTo.current || !preview.current) return;
    const { clientX, clientY } = event;
    const { width, height } = preview.current.getBoundingClientRect();
    moveTo.current.x(clientX - width / 2);
    moveTo.current.y(clientY - height / 2);
    moveTo.current.rotate(gsap.utils.clamp(-10, 10, (clientX - lastX.current) * 0.6));
    lastX.current = clientX;
  };

  return (
    <div
      ref={container}
      className="relative px-5 sm:px-10 xl:px-[1.5vw] pb-24 xl:pb-[6vw] text-white"
      onMouseMove={onMouseMove}
    >
      <ul onMouseLeave={() => showPreview(false)}>
        {works.map((work, index) => (
          <li key={work.slug} className="work-row relative">
            <div className="work-rule absolute inset-x-0 top-0 h-px bg-white/25" />
            <Link
              href={`/works/${work.slug}`}
              onMouseEnter={() => {
                setActive(index);
                showPreview(true);
              }}
              onFocus={() => setActive(index)}
              className="group grid grid-cols-[auto_1fr] lg:grid-cols-[6vw_1fr_auto] items-baseline gap-x-6 gap-y-4 py-8 xl:py-[2.2vw]"
            >
              <span className="work-meta text-sm xl:text-[1vw] text-white/50 tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="work-title text-4xl sm:text-6xl xl:text-[6vw] uppercase leading-[0.9] transition-[transform,color] duration-500 group-hover:translate-x-3 xl:group-hover:translate-x-[1.5vw] lg:[ul:hover_&]:text-white/35 lg:group-hover:text-white!">
                {work.title}
              </span>
              <span className="work-meta col-start-2 lg:col-start-3 flex flex-col lg:items-end gap-1 text-sm xl:text-[1vw] text-white/60">
                <span>{work.category}</span>
                <span className="tabular-nums">{work.year}</span>
              </span>
              {/* Phones get the cover inline instead of the cursor preview */}
              <span className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-2xl lg:hidden">
                <Image
                  src={workCover(work.slug)}
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="absolute inset-x-0 bottom-24 xl:bottom-[6vw] h-px bg-white/25" />

      {/* Cursor preview: the covers sit in a column, and the column slides to the hovered one */}
      <div
        ref={preview}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-40 hidden lg:block w-[30vw] aspect-[16/10] overflow-hidden rounded-[1.5vw] border border-white/15 shadow-2xl opacity-0 scale-0"
      >
        <div
          className="h-full transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]"
          style={{ transform: `translateY(-${active * 100}%)` }}
        >
          {works.map((work) => (
            <div key={work.slug} className="relative h-full w-full">
              <Image src={workCover(work.slug)} alt="" fill sizes="30vw" className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
