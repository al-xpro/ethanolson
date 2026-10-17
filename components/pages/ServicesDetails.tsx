"use client";

import { useRef } from "react";
import Image from "next/image";
import { services, servicesPage } from "@/content/services";
import { PillLink } from "@/components/ui/PillLink";
import { gsap, useGSAP, MOTION_OK, SplitText } from "@/lib/gsap";

const label = "text-xs xl:text-[0.8vw] tracking-[0.3rem] uppercase text-white/50";

export function ServicesDetails() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>(".service-panel").forEach((panel) => {
          // Titles rise letter by letter out of a mask
          const split = SplitText.create(panel.querySelector(".service-title"), {
            type: "chars,words",
            mask: "words",
          });
          gsap.from(split.chars, {
            yPercent: 100,
            stagger: 0.015,
            duration: 0.8,
            ease: "power4.out",
            scrollTrigger: { trigger: panel, start: "top 65%" },
          });

          // The process line draws across, then each step lights up
          gsap
            .timeline({ scrollTrigger: { trigger: panel.querySelector(".process"), start: "top 85%" } })
            .from(panel.querySelector(".process-line"), {
              scaleX: 0,
              transformOrigin: "left center",
              duration: 1.2,
              ease: "power3.inOut",
            })
            .from(
              panel.querySelectorAll(".process-step"),
              { y: 24, opacity: 0, stagger: 0.12, duration: 0.6, ease: "power2.out" },
              "<+0.3"
            );
        });
      });

      // Large screens: each panel sticks, and sinks back as the next one slides over it
      mm.add(`${MOTION_OK} and (min-width: 1024px)`, () => {
        const panels = gsap.utils.toArray<HTMLElement>(".service-panel");
        panels.slice(1).forEach((panel, index) => {
          gsap.to(panels[index].querySelector(".service-inner"), {
            scale: 0.9,
            filter: "brightness(0.35)",
            borderRadius: "2.5vw",
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              start: "top bottom",
              end: "top top",
              scrub: true,
            },
          });
        });
      });
    },
    { scope: container }
  );

  return (
    <div ref={container}>
      <nav aria-label="Services" className="px-5 sm:px-10 xl:px-[1.5vw] pb-16 xl:pb-[4vw]">
        <ol className="grid gap-px border-y border-white/15 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <li key={service.slug}>
              <a
                href={`#${service.slug}`}
                className="group flex h-full flex-col gap-3 py-6 xl:py-[1.5vw] pr-6 text-white"
              >
                <span className={label}>{String(index + 1).padStart(2, "0")}</span>
                <span className="text-xl xl:text-[1.4vw] leading-tight transition-transform duration-300 group-hover:translate-x-2">
                  {service.title} →
                </span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {services.map((service, index) => (
        <article
          key={service.slug}
          id={service.slug}
          aria-labelledby={`${service.slug}-title`}
          className="service-panel relative lg:sticky lg:top-0 lg:h-screen scroll-mt-0"
        >
          <div className="service-inner flex h-full flex-col justify-between gap-10 xl:gap-[2vw] overflow-hidden rounded-t-[2rem] xl:rounded-t-[2.5vw] border-t border-white/10 bg-[#0c0c0c] px-5 sm:px-10 xl:px-[3vw] py-12 lg:py-[max(4.5rem,6vw)] text-white will-change-transform">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] xl:gap-[4vw]">
              <div className="flex flex-col gap-6 xl:gap-[1.5vw]">
                <span className={label}>
                  {String(index + 1).padStart(2, "0")} — {String(services.length).padStart(2, "0")}
                </span>
                <h2
                  id={`${service.slug}-title`}
                  className="service-title text-4xl sm:text-6xl xl:text-[4.2vw] uppercase leading-[0.95]"
                >
                  {service.title}
                </h2>
                <p className="text-lg xl:text-[1.35vw] leading-relaxed text-white/75 text-pretty max-w-2xl xl:max-w-[40vw]">
                  {service.intro}
                </p>
                <div className="flex flex-wrap items-center gap-2 xl:gap-[0.5vw]">
                  <span className="rounded-full bg-white px-4 py-1.5 xl:px-[1vw] xl:py-[0.35vw] text-xs xl:text-[0.8vw] uppercase tracking-widest text-black">
                    {service.timeline}
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
              </div>

              <div className="flex flex-col gap-6 xl:gap-[1.5vw]">
                <div className="relative h-56 sm:h-72 lg:h-[34vh] overflow-hidden rounded-2xl xl:rounded-[1.5vw] border border-white/10">
                  <Image
                    src={service.visual.src}
                    alt={service.visual.alt}
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className={`${label} mb-3 xl:mb-[0.8vw]`}>{servicesPage.deliverablesLabel}</p>
                  <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2 text-base xl:text-[1.05vw] text-white/80">
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
              </div>
            </div>

            <div className="process">
              <p className={`${label} mb-4 xl:mb-[1vw]`}>{servicesPage.processLabel}</p>
              <div className="process-line h-px w-full bg-white/40" />
              <ol className="grid gap-6 pt-6 xl:pt-[1.2vw] sm:grid-cols-2 lg:grid-cols-4 xl:gap-[2vw]">
                {service.process.map((step, stepIndex) => (
                  <li key={step.title} className="process-step flex flex-col gap-2">
                    <span className="text-lg xl:text-[1.3vw]">
                      <span className="text-white/40">{stepIndex + 1}.</span> {step.title}
                    </span>
                    <span className="text-sm xl:text-[0.95vw] leading-relaxed text-white/60">
                      {step.text}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </article>
      ))}

      <div className="flex flex-col items-center gap-6 py-24 xl:py-[6vw] text-center text-white">
        <p className="text-3xl sm:text-5xl xl:text-[3.5vw] uppercase leading-none">
          {servicesPage.cta.title}
        </p>
        <PillLink href="/contact">{servicesPage.cta.link}</PillLink>
      </div>
    </div>
  );
}
