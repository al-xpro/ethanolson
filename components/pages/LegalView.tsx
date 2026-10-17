"use client";

import { useEffect, useRef, useState } from "react";
import { legalLabels, type LegalPage } from "@/content/legal";
import { SectionStripe } from "@/components/ui/SectionStripe";
import { useSmoothAnchor } from "@/lib/useSmoothAnchor";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export function LegalView({ page }: { page: LegalPage }) {
  const container = useRef<HTMLDivElement>(null);
  const items = page.sections.map((section) => ({ id: slugify(section.heading), label: section.heading }));
  const [visible, setVisible] = useState<string[]>([items[0].id]);
  const goTo = useSmoothAnchor();

  // Every section that's on screen lights up in the table of contents
  useEffect(() => {
    const onScreen = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) =>
          entry.isIntersecting ? onScreen.add(entry.target.id) : onScreen.delete(entry.target.id)
        );
        const ordered = items.map((item) => item.id).filter((id) => onScreen.has(id));
        if (ordered.length) setVisible(ordered);
      },
      // Ignore the strip hidden under the sticky stripe at the top
      { rootMargin: "-72px 0px 0px 0px" }
    );
    container.current?.querySelectorAll(".legal-section").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
    // The sections come from static content
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
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
    <div ref={container} className="px-5 sm:px-10 xl:px-[1.5vw] pb-24 xl:pb-[6vw] text-white">
      <SectionStripe items={items} current={visible[0]} label={legalLabels.onThisPage} />

      <div className="grid gap-12 pt-10 lg:pt-0 lg:grid-cols-[1fr_2.4fr] xl:gap-[5vw]">
        <aside className="lg:sticky lg:top-32 xl:top-[8vw] self-start">
          <p className="text-xs xl:text-[0.8vw] tracking-[0.3rem] uppercase text-white/50">
            {legalLabels.updated} {page.updated}
          </p>
          <nav aria-label={legalLabels.onThisPage} className="mt-8 hidden lg:block">
            {/* No gap between entries: their borders touch, so active ones form one line */}
            <ol className="flex flex-col border-l border-white/15">
              {items.map((item) => {
                const active = visible.includes(item.id);
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(event) => goTo(event, item.id)}
                      aria-current={active ? "location" : undefined}
                      className={`-ml-px block border-l py-1.5 xl:py-[0.35vw] pl-4 xl:pl-[1vw] text-sm xl:text-[0.95vw] transition-colors duration-500 ${
                        active ? "border-white text-white" : "border-transparent text-white/45 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>
        </aside>

        <div className="flex flex-col gap-14 xl:gap-[3.5vw] max-w-3xl xl:max-w-[48vw]">
          <p className="text-xl sm:text-2xl xl:text-[1.8vw] leading-snug text-white/85 text-pretty">
            {page.intro}
          </p>
          {page.sections.map((section) => (
            <section
              key={section.heading}
              id={slugify(section.heading)}
              className="legal-section scroll-mt-24 lg:scroll-mt-32 flex flex-col gap-4 xl:gap-[1vw]"
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
