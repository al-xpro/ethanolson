"use client";

import { useRef } from "react";
import Image from "next/image";
import { PillLink } from "@/components/ui/PillLink";
import { aboutPage, aboutPortrait } from "@/content/about";
import { gsap, useGSAP, MOTION_OK, ScrollTrigger, SplitText } from "@/lib/gsap";

const label = "text-xs xl:text-[0.8vw] tracking-[0.3rem] uppercase text-white/50";
const sectionTitle = "text-4xl sm:text-6xl xl:text-[4.5vw] uppercase leading-none";

export function AboutView() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        // Story: each line slides up out of its own mask
        gsap.utils.toArray<HTMLElement>(".about-story p").forEach((paragraph) => {
          const split = SplitText.create(paragraph, { type: "lines", mask: "lines" });
          gsap.from(split.lines, {
            yPercent: 100,
            stagger: 0.08,
            duration: 0.9,
            ease: "power4.out",
            scrollTrigger: { trigger: paragraph, start: "top 85%" },
          });
        });

        // Experience: each row is wiped in from the left
        gsap.utils.toArray<HTMLElement>(".experience-row").forEach((row) => {
          gsap.fromTo(
            row,
            { clipPath: "inset(0% 100% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.1,
              ease: "power3.inOut",
              scrollTrigger: { trigger: row, start: "top 85%" },
            }
          );
        });

        // Skills pop in, group by group
        ScrollTrigger.batch(".skill-chip", {
          start: "top 90%",
          once: true,
          onEnter: (chips) =>
            gsap.from(chips, { scale: 0.6, opacity: 0, stagger: 0.04, duration: 0.5, ease: "back.out(2)" }),
        });

        // Passions flip up from the floor
        gsap.from(".passion-card", {
          rotationX: -70,
          y: 60,
          opacity: 0,
          transformOrigin: "50% 100%",
          stagger: 0.12,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".passions", start: "top 80%" },
        });
      });
    },
    { scope: container }
  );

  // Passion cards lean toward the pointer
  const tilt = (event: React.PointerEvent<HTMLElement>) => {
    const card = event.currentTarget;
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = (event.clientX - left) / width - 0.5;
    const y = (event.clientY - top) / height - 0.5;
    gsap.to(card, { rotationY: x * 14, rotationX: -y * 14, duration: 0.5, ease: "power3.out" });
  };
  const untilt = (event: React.PointerEvent<HTMLElement>) =>
    gsap.to(event.currentTarget, { rotationY: 0, rotationX: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" });

  return (
    <div ref={container} className="text-white">
      <section className="grid gap-12 lg:grid-cols-[1fr_1.15fr] xl:gap-[5vw] px-5 sm:px-10 xl:px-[1.5vw] pb-24 xl:pb-[6vw]">
        {/* 16:9, so the crop keeps Ethan at his desk, coding */}
        <div className="relative aspect-square overflow-hidden rounded-3xl xl:rounded-[2vw] self-start">
          <Image
            src={aboutPortrait.src}
            alt={aboutPortrait.alt}
            placeholder="blur"
            priority
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="h-full w-full object-cover object-[center_55%] grayscale contrast-125 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
        <div className="about-story flex flex-col gap-8 xl:gap-[2vw] text-xl sm:text-2xl xl:text-[1.8vw] leading-snug text-white/85 text-pretty">
          {aboutPage.story.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section aria-labelledby="experience" className="px-5 sm:px-10 xl:px-[1.5vw] pb-24 xl:pb-[6vw]">
        <h2 id="experience" className={`${sectionTitle} mb-10 xl:mb-[3vw]`}>
          {aboutPage.experienceTitle}
        </h2>
        <ol>
          {aboutPage.experience.map((job) => (
            <li
              key={job.period}
              className="experience-row grid gap-3 md:grid-cols-[1fr_1.4fr_2fr] md:gap-8 xl:gap-[3vw] border-t border-white/20 py-8 xl:py-[2vw]"
            >
              <span className="text-sm xl:text-[1vw] text-white/50 tabular-nums">{job.period}</span>
              <span className="flex flex-col gap-1">
                <span className="text-xl xl:text-[1.6vw]">{job.role}</span>
                <span className="text-sm xl:text-[1vw] text-white/60">{job.company}</span>
              </span>
              <span className="text-base xl:text-[1.15vw] leading-relaxed text-white/70">{job.text}</span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="skills" className="px-5 sm:px-10 xl:px-[1.5vw] pb-24 xl:pb-[6vw]">
        <h2 id="skills" className={`${sectionTitle} mb-10 xl:mb-[3vw]`}>
          {aboutPage.skillsTitle}
        </h2>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-[2.5vw]">
          {aboutPage.techSkills.map((group) => (
            <div key={group.group} className="flex flex-col gap-4">
              <h3 className={label}>{group.group}</h3>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="skill-chip rounded-full border border-white/25 px-4 py-2 xl:px-[1vw] xl:py-[0.5vw] text-sm xl:text-[0.95vw]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="how-i-work" className="px-5 sm:px-10 xl:px-[1.5vw] pb-24 xl:pb-[6vw]">
        <h2 id="how-i-work" className={`${sectionTitle} mb-10 xl:mb-[3vw]`}>
          {aboutPage.softSkillsTitle}
        </h2>
        <ol className="grid gap-px overflow-hidden rounded-3xl xl:rounded-[2vw] border border-white/15 bg-white/15 sm:grid-cols-2">
          {aboutPage.softSkills.map((skill, index) => (
            <li key={skill.title} className="flex flex-col gap-3 bg-[#111] p-8 xl:p-[2.5vw]">
              <span className="text-sm xl:text-[1vw] text-white/40 tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-2xl xl:text-[2vw] leading-tight">{skill.title}</span>
              <span className="text-base xl:text-[1.1vw] leading-relaxed text-white/65">{skill.text}</span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="passions" className="passions px-5 sm:px-10 xl:px-[1.5vw] pb-24 xl:pb-[6vw]">
        <h2 id="passions" className={`${sectionTitle} mb-10 xl:mb-[3vw]`}>
          {aboutPage.passionsTitle}
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:gap-[1.5vw] [perspective:1200px]">
          {aboutPage.passions.map((passion) => (
            <li
              key={passion.title}
              onPointerMove={tilt}
              onPointerLeave={untilt}
              className="passion-card flex min-h-64 xl:min-h-[18vw] flex-col justify-between gap-6 rounded-3xl xl:rounded-[1.5vw] border border-white/15 bg-[#161616] p-8 xl:p-[2vw] [transform-style:preserve-3d]"
            >
              <span className="text-2xl xl:text-[1.9vw] uppercase leading-none">{passion.title}</span>
              <span className="text-base xl:text-[1.05vw] leading-relaxed text-white/65">{passion.text}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-col items-center gap-6 pb-24 xl:pb-[6vw] px-5 text-center">
        <p className="text-3xl sm:text-5xl xl:text-[3.5vw] uppercase text-balance leading-none">{aboutPage.cta.title}</p>
        <PillLink href="/contact">{aboutPage.cta.link}</PillLink>
      </div>
    </div>
  );
}
