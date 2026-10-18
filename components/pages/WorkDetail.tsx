"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  type Work,
  workCover,
  workLabels,
  coverSize,
  darkBlur,
} from "@/content/works";
import { WorkFeature } from "@/components/ui/WorkFeature";
import { ProjectTemplates } from "@/components/ui/ProjectTemplates";
import { gsap, useGSAP, MOTION_OK, SplitText } from "@/lib/gsap";

const label =
  "text-xs xl:text-[0.8vw] tracking-[0.3rem] uppercase text-white/50";

const formatResult = (value: number, decimals: number) =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

export function WorkDetail({ work, next }: { work: Work; next: Work }) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        // Title: letters rise from a mask on load
        const title = SplitText.create(".work-heading", {
          type: "chars,words",
          mask: "words",
        });
        gsap
          .timeline({ delay: 0.15 })
          .from(title.chars, {
            yPercent: 100,
            stagger: 0.03,
            duration: 0.9,
            ease: "power4.out",
          })
          .from(
            ".work-intro > *",
            {
              y: 30,
              opacity: 0,
              stagger: 0.08,
              duration: 0.7,
              ease: "power2.out",
            },
            "<+0.3",
          );

        // Cover: the artwork drifts slowly inside its frame while the page scrolls
        gsap.fromTo(
          ".work-cover-image",
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: ".work-cover",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );

        // Challenge: each word lights up as it's read
        const words = SplitText.create(".work-challenge", { type: "words" });
        gsap.fromTo(
          words.words,
          { opacity: 0.15 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: {
              trigger: ".work-challenge",
              start: "top 80%",
              end: "bottom 45%",
              scrub: true,
            },
          },
        );

        // Results count up once
        gsap.utils.toArray<HTMLElement>(".result-value").forEach((element) => {
          const target = Number(element.dataset.value);
          const decimals = Number(element.dataset.decimals);
          const counter = { value: 0 };
          gsap.to(counter, {
            value: target,
            duration: 1.6,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 85%" },
            onUpdate: () => {
              element.textContent = formatResult(counter.value, decimals);
            },
          });
        });

        // Project feature: items rise in, strike lines draw, old steps shrink away
        const feature = { trigger: ".work-feature", start: "top 75%" };
        gsap.from(".feature-item", {
          y: 40,
          opacity: 0,
          stagger: 0.08,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: feature,
        });
        gsap.from(".feature-strike", {
          scaleX: 0,
          stagger: 0.12,
          duration: 0.8,
          delay: 0.5,
          ease: "power3.inOut",
          scrollTrigger: feature,
        });
        gsap.to(".feature-dot", {
          scale: 0.6,
          opacity: 0.35,
          stagger: 0.04,
          duration: 0.5,
          delay: 0.3,
          ease: "power2.out",
          scrollTrigger: feature,
        });

        // Templates drift at three different speeds, side by side (stacked on phones, they stay put)
        if (window.matchMedia("(min-width: 640px)").matches) {
          gsap.utils
            .toArray<HTMLElement>(".work-template")
            .forEach((template, index) => {
              gsap.fromTo(
                template,
                { y: () => window.innerHeight * [0.1, 0.22, 0.04][index] },
                {
                  y: () => window.innerHeight * [-0.06, -0.14, -0.1][index],
                  ease: "none",
                  scrollTrigger: {
                    trigger: ".work-templates",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                  },
                },
              );
            });
        }

        // Next project slides in from the right
        gsap.from(".next-title", {
          xPercent: 25,
          ease: "none",
          scrollTrigger: {
            trigger: ".next-project",
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
        });
      });
    },
    { scope: container, dependencies: [work.slug], revertOnUpdate: true },
  );

  return (
    <article ref={container} className="text-white">
      <header className="px-5 sm:px-10 xl:px-[1.5vw] pt-32 md:pt-40 xl:pt-[10vw] pb-16 xl:pb-[4vw]">
        <Link
          href="/works"
          className="text-xs xl:text-[0.8vw] uppercase tracking-[0.3rem] text-white/60 hover:text-white transition-colors duration-300"
        >
          ← {workLabels.back}
        </Link>
        <p className={`${label} mt-10 xl:mt-[2.5vw]`}>
          {work.category} · {work.year}
        </p>
        <h1 className="work-heading mt-4 text-6xl sm:text-8xl xl:text-[9vw] uppercase leading-[0.85]">
          {work.title}
        </h1>
        <div className="work-intro mt-10 xl:mt-[2.5vw] grid gap-10 lg:grid-cols-[1.4fr_1fr] xl:gap-[5vw]">
          <p className="text-2xl sm:text-3xl xl:text-[2.2vw] leading-snug text-white/85 text-pretty">
            {work.summary}
          </p>
          <dl className="grid grid-cols-2 gap-6 xl:gap-[1.5vw] text-sm xl:text-[1vw]">
            <div>
              <dt className={label}>{workLabels.client}</dt>
              <dd className="mt-2">{work.client}</dd>
            </div>
            <div>
              <dt className={label}>{workLabels.duration}</dt>
              <dd className="mt-2">{work.duration}</dd>
            </div>
            <div className="col-span-2">
              <dt className={label}>{workLabels.role}</dt>
              <dd className="mt-2">{work.role}</dd>
            </div>
            <div className="col-span-2">
              <dt className={label}>{workLabels.stack}</dt>
              <dd className="mt-3 flex flex-wrap gap-2">
                {work.stack.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full border border-white/25 px-3 py-1 xl:px-[0.8vw] xl:py-[0.3vw] text-xs xl:text-[0.8vw]"
                  >
                    {tool}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="px-5 sm:px-10 xl:px-[1.5vw]">
        <div className="work-cover relative aspect-[16/10] overflow-hidden rounded-3xl xl:rounded-[2vw] border border-white/10">
          <Image
            src={workCover(work.slug)}
            alt={`${work.title}, cover`}
            {...coverSize}
            placeholder="blur"
            blurDataURL={darkBlur}
            priority
            sizes="100vw"
            className="work-cover-image absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover"
          />
        </div>
      </div>

      <section className="px-5 sm:px-10 xl:px-[1.5vw] py-24 xl:py-[7vw] grid gap-12 lg:grid-cols-[1fr_2.2fr] xl:gap-[5vw]">
        <h2 className={label}>{workLabels.challenge}</h2>
        <p className="work-challenge text-2xl sm:text-4xl xl:text-[3vw] leading-tight text-pretty">
          {work.challenge}
        </p>
      </section>

      <section className="px-5 sm:px-10 xl:px-[1.5vw] pb-24 xl:pb-[7vw] grid gap-12 lg:grid-cols-[1fr_2.2fr] xl:gap-[5vw]">
        <h2 className={label}>{workLabels.solution}</h2>
        <ol className="flex flex-col">
          {work.solution.map((step, index) => (
            <li
              key={step}
              className="grid grid-cols-[3rem_1fr] xl:grid-cols-[4vw_1fr] gap-4 border-t border-white/20 py-6 xl:py-[1.6vw] text-lg xl:text-[1.4vw] leading-relaxed text-white/80"
            >
              <span className="text-white/40 tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section className="work-feature px-5 sm:px-10 xl:px-[1.5vw] pb-24 xl:pb-[7vw]">
        <WorkFeature feature={work.feature} />
      </section>

      <section
        aria-label={workLabels.results}
        className="mx-5 sm:mx-10 xl:mx-[1.5vw] grid gap-px overflow-hidden rounded-3xl xl:rounded-[2vw] border border-white/15 bg-white/15 sm:grid-cols-3"
      >
        {work.results.map((result) => {
          const decimals = Number.isInteger(result.value) ? 0 : 1;
          return (
            <div
              key={result.label}
              className="flex flex-col gap-3 bg-[#111] p-8 xl:p-[2.5vw]"
            >
              <span className="text-6xl xl:text-[5.5vw] leading-none tabular-nums">
                {result.prefix}
                <span
                  className="result-value"
                  data-value={result.value}
                  data-decimals={decimals}
                >
                  {formatResult(result.value, decimals)}
                </span>
                {result.suffix}
              </span>
              <span className="text-base xl:text-[1.1vw] text-white/65">
                {result.label}
              </span>
            </div>
          );
        })}
      </section>

      <section
        aria-label={workLabels.templates}
        className="work-templates grid gap-4 sm:grid-cols-3 sm:gap-6 xl:gap-[2vw] items-start px-5 sm:px-10 xl:px-[1.5vw] py-24 xl:py-[8vw] overflow-hidden"
      >
        <ProjectTemplates slug={work.slug} />
      </section>

      <Link
        href={`/works/${next.slug}`}
        className="relative next-project group block border-t border-white/20 px-5 sm:px-10 xl:px-[1.5vw] py-16 xl:py-[5vw] focus-visible:z-10"
      >
        <span className={label}>{workLabels.next}</span>
        <span className="next-title mt-4 flex items-center gap-6 xl:gap-[2vw] text-5xl sm:text-7xl xl:text-[8vw] uppercase leading-none break-all">
          {next.title}
          <span
            aria-hidden
            className="transition-[translate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-4 xl:group-hover:translate-x-[2vw]"
          >
            →
          </span>
        </span>
      </Link>
    </article>
  );
}
