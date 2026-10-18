"use client";

import { useRef, useState } from "react";
import { services, servicesPage } from "@/content/services";
import { PillLink } from "@/components/ui/PillLink";
import { SectionStripe } from "@/components/ui/SectionStripe";
import { ServiceSchema } from "@/components/ui/ServiceSchema";
import { useSmoothAnchor } from "@/lib/useSmoothAnchor";
import { gsap, useGSAP, MOTION_OK, ScrollTrigger, SplitText } from "@/lib/gsap";

const label = "text-xs xl:text-[0.8vw] tracking-[0.3rem] uppercase text-white/50";
const number = (index: number) => String(index + 1).padStart(2, "0");

export function ServicesDetails() {
  const container = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const goTo = useSmoothAnchor();

  useGSAP(
    () => {
      // The current step follows the reader (no motion involved, so always on)
      gsap.utils.toArray<HTMLElement>(".service-step").forEach((step, index) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setCurrent(index),
        });
      });

      gsap.matchMedia().add(MOTION_OK, () => {
        // The timeline fills as the four steps scroll past
        gsap.fromTo(
          ".timeline-fill",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: ".services-body", start: "top 55%", end: "bottom 55%", scrub: true },
          }
        );

        gsap.utils.toArray<HTMLElement>(".service-step").forEach((step) => {
          const title = SplitText.create(step.querySelector(".service-title"), {
            type: "chars,words",
            mask: "words",
          });
          const enter = { trigger: step, start: "top 70%" };

          gsap.from(title.chars, { yPercent: 100, stagger: 0.015, duration: 0.8, ease: "power4.out", scrollTrigger: enter });

          // Each diagram assembles itself: parts rise, bars grow, lines draw
          const schema = step.querySelector(".service-schema");
          const tl = gsap.timeline({ scrollTrigger: { trigger: schema, start: "top 80%" } });
          tl.from(step.querySelectorAll(".schema-pop"), {
            y: 24,
            opacity: 0,
            stagger: 0.07,
            duration: 0.6,
            ease: "power3.out",
          });
          tl.from(step.querySelectorAll(".schema-bar"), { scaleX: 0, stagger: 0.1, duration: 0.9, ease: "power3.inOut" }, 0.2);
          step.querySelectorAll<SVGGeometryElement>(".schema-draw").forEach((path) => {
            const length = path.getTotalLength();
            tl.fromTo(
              path,
              { strokeDasharray: length, strokeDashoffset: length },
              { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" },
              0.2
            );
          });

          gsap.from(step.querySelectorAll(".process-step"), {
            x: -24,
            opacity: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: { trigger: step.querySelector(".process"), start: "top 85%" },
          });
        });
      });
    },
    { scope: container }
  );

  return (
    <div ref={container} className="px-5 sm:px-10 xl:px-[1.5vw] text-white">
      <SectionStripe
        items={services.map((service) => ({ id: service.slug, label: service.title }))}
        current={services[current].slug}
        label={servicesPage.timelineLabel}
      />

      <div className="grid lg:grid-cols-[minmax(240px,0.75fr)_2.25fr] lg:gap-[4vw]">
        {/* Sticky four-step timeline (large screens) */}
        <aside className="hidden lg:block">
          <nav aria-label={servicesPage.timelineLabel} className="sticky top-[22vh]">
            <div className="relative pl-10 xl:pl-[2.6vw]">
              <span aria-hidden className="absolute left-[11px] xl:left-[0.75vw] top-2 bottom-2 w-px bg-white/15" />
              <span
                aria-hidden
                className="timeline-fill absolute left-[11px] xl:left-[0.75vw] top-2 bottom-2 w-px origin-top bg-white"
              />
              <ol className="flex flex-col gap-10 xl:gap-[2.6vw]">
                {services.map((service, index) => {
                  const active = index === current;
                  const done = index < current;
                  return (
                    <li key={service.slug} className="relative">
                      <span
                        aria-hidden
                        className={`absolute -left-10 xl:-left-[2.6vw] top-0.5 flex h-6 w-6 xl:h-[1.6vw] xl:w-[1.6vw] items-center justify-center rounded-full border text-[10px] xl:text-[0.65vw] transition-colors duration-500 ${
                          active
                            ? "border-white bg-white text-black"
                            : done
                              ? "border-white bg-[#111] text-white"
                              : "border-white/30 bg-[#111] text-white/40"
                        }`}
                      >
                        {number(index)}
                      </span>
                      <a
                        href={`#${service.slug}`}
                        onClick={(event) => goTo(event, service.slug)}
                        aria-current={active ? "step" : undefined}
                        className={`block text-lg xl:text-[1.3vw] leading-tight transition-colors duration-500 ${
                          active ? "text-white" : "text-white/45 hover:text-white"
                        }`}
                      >
                        {service.title}
                      </a>
                      <span
                        className={`mt-1 block text-sm xl:text-[0.9vw] text-white/50 transition-opacity duration-500 ${
                          active ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        {service.summary}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </nav>
        </aside>

        <div className="services-body flex min-w-0 flex-col">
          {services.map((service, index) => (
            <article
              key={service.slug}
              id={service.slug}
              aria-labelledby={`${service.slug}-title`}
              className="service-step scroll-mt-20 flex flex-col gap-8 xl:gap-[2vw] border-t border-white/15 py-16 xl:py-[5vw] first:border-t-0 first:pt-10"
            >
              <span className={label}>
                {servicesPage.stepLabel} {number(index)} — {number(services.length - 1)}
              </span>
              <h2
                id={`${service.slug}-title`}
                className="service-title text-4xl sm:text-6xl xl:text-[4.2vw] uppercase leading-[0.95]"
              >
                {service.title}
              </h2>
              <p className="text-lg xl:text-[1.35vw] leading-relaxed text-white/75 text-pretty max-w-3xl xl:max-w-[46vw]">
                {service.intro}
              </p>

              <ServiceSchema kind={service.schema} />

              <div className="grid gap-10 md:grid-cols-2 xl:gap-[3vw]">
                <div>
                  <p className={`${label} mb-4 xl:mb-[1vw]`}>{servicesPage.deliverablesLabel}</p>
                  <ul className="flex flex-col gap-2 text-base xl:text-[1.1vw] text-white/80">
                    {service.deliverables.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span aria-hidden className="text-white/40">
                          —
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="process">
                  <p className={`${label} mb-4 xl:mb-[1vw]`}>{servicesPage.processLabel}</p>
                  <ol className="flex flex-col gap-4">
                    {service.process.map((step, stepIndex) => (
                      <li key={step.title} className="process-step grid grid-cols-[2rem_1fr] xl:grid-cols-[2.4vw_1fr]">
                        <span className="text-white/40 tabular-nums xl:text-[1vw]">{stepIndex + 1}.</span>
                        <span className="flex flex-col gap-1">
                          <span className="text-base xl:text-[1.15vw]">{step.title}</span>
                          <span className="text-sm xl:text-[0.95vw] leading-relaxed text-white/60">{step.text}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 xl:gap-[0.5vw]">
                <span className="rounded-full bg-white px-4 py-1.5 xl:px-[1vw] xl:py-[0.35vw] text-xs xl:text-[0.8vw] uppercase tracking-widest text-black">
                  {servicesPage.durationLabel}: {service.timeline}
                </span>
                {service.stack.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full border border-white/25 px-4 py-1.5 xl:px-[1vw] xl:py-[0.35vw] text-xs xl:text-[0.8vw] tracking-wide text-white/80"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 py-24 xl:py-[6vw] text-center">
        <p className="text-3xl sm:text-5xl xl:text-[3.5vw] uppercase text-balance leading-none">{servicesPage.cta.title}</p>
        <PillLink href="/contact">{servicesPage.cta.link}</PillLink>
      </div>
    </div>
  );
}
