"use client";

import { useRef, useState } from "react";
import { legalLabels, type LegalPage } from "@/content/legal";
import { gsap, useGSAP, MOTION_OK, ScrollTrigger } from "@/lib/gsap";

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export function LegalView({ page }: { page: LegalPage }) {
  const container = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(slugify(page.sections[0].heading));

  useGSAP(
    () => {
      // The table of contents follows the reader (no motion involved, so always on)
      gsap.utils.toArray<HTMLElement>(".legal-section").forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 40%",
          end: "bottom 40%",
          onToggle: (self) => self.isActive && setCurrent(section.id),
        });
      });

      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.fromTo(
          ".legal-progress",
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { trigger: ".legal-body", start: "top 30%", end: "bottom bottom", scrub: true },
          }
        );

        gsap.utils.toArray<HTMLElement>(".legal-heading").forEach((heading) => {
          gsap.from(heading, {
            x: -40,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: heading, start: "top 85%" },
          });
        });
      });
    },
    { scope: container }
  );

  return (
    <div ref={container} className="text-white">
      <div
        aria-hidden
        className="legal-progress fixed left-0 top-0 z-150 h-[3px] w-full origin-left scale-x-0 bg-white motion-reduce:hidden"
      />

      <div className="px-5 sm:px-10 xl:px-[1.5vw] pb-24 xl:pb-[6vw] grid gap-12 lg:grid-cols-[1fr_2.4fr] xl:gap-[5vw]">
        <aside className="lg:sticky lg:top-32 xl:top-[8vw] self-start">
          <p className="text-xs xl:text-[0.8vw] tracking-[0.3rem] uppercase text-white/50">
            {legalLabels.updated} {page.updated}
          </p>
          <nav aria-label={legalLabels.onThisPage} className="mt-8 hidden lg:block">
            <ol className="flex flex-col gap-3 xl:gap-[0.7vw] border-l border-white/15">
              {page.sections.map((section) => {
                const id = slugify(section.heading);
                const active = id === current;
                return (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      aria-current={active ? "location" : undefined}
                      className={`-ml-px block border-l pl-4 xl:pl-[1vw] text-sm xl:text-[0.95vw] transition-colors duration-300 ${
                        active ? "border-white text-white" : "border-transparent text-white/50 hover:text-white"
                      }`}
                    >
                      {section.heading}
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>
        </aside>

        <div className="legal-body flex flex-col gap-14 xl:gap-[3.5vw] max-w-3xl xl:max-w-[48vw]">
          <p className="text-xl sm:text-2xl xl:text-[1.8vw] leading-snug text-white/85 text-pretty">
            {page.intro}
          </p>
          {page.sections.map((section) => (
            <section
              key={section.heading}
              id={slugify(section.heading)}
              className="legal-section scroll-mt-32 flex flex-col gap-4 xl:gap-[1vw]"
            >
              <h2 className="legal-heading text-2xl sm:text-3xl xl:text-[2.2vw] uppercase leading-none">
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-base xl:text-[1.15vw] leading-relaxed text-white/70">
                  {paragraph}
                </p>
              ))}
              {section.list && (
                <ul className="flex flex-col gap-3 text-base xl:text-[1.15vw] leading-relaxed text-white/70">
                  {section.list.map((item) => (
                    <li key={item} className="grid grid-cols-[1.5rem_1fr]">
                      <span aria-hidden className="text-white/40">
                        —
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
