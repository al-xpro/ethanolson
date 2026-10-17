"use client";

import { useRef } from "react";
import Link from "next/link";
import AnimatedHeaderSection from "@/components/ui/AnimatedHeaderSection";
import { testimonials, testimonialsHeader } from "@/content/testimonials";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("");

export default function Testimonials() {
  const deck = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const cards = gsap.utils.toArray<HTMLElement>(".testimonial-card");

        // Fanned like a hand of cards: each one behind is smaller and turned
        cards.forEach((card, index) => {
          gsap.set(card, {
            zIndex: cards.length - index,
            scale: 1 - index * 0.05,
            y: index * 28,
            rotate: index % 2 ? 2.5 * index : -2.5 * index,
          });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: deck.current,
            start: "top top",
            end: () => `+=${window.innerHeight * (cards.length - 1)}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        // The top card peels away with a twist, and the rest of the deck steps forward
        cards.slice(0, -1).forEach((card, index) => {
          tl.to(card, {
            // Stays opaque: a fading card would let the next quote show through it
            yPercent: -160,
            rotate: index % 2 ? 14 : -14,
            ease: "power2.in",
            duration: 1,
          });
          cards.slice(index + 1).forEach((next, offset) => {
            tl.to(
              next,
              {
                scale: 1 - offset * 0.05,
                y: offset * 28,
                rotate: offset === 0 ? 0 : offset % 2 ? 2.5 * offset : -2.5 * offset,
                ease: "power2.out",
                duration: 1,
              },
              "<"
            );
          });
        });
      });
    },
    { scope: deck }
  );

  return (
    <section id="testimonials" className="relative">
      <AnimatedHeaderSection
        subTitle={testimonialsHeader.subTitle}
        title={testimonialsHeader.title}
        text={testimonialsHeader.text}
        textColor="text-white"
        withScrollTrigger
      />
      <p className="px-5 sm:px-10 xl:px-[1.5vw] -mt-4 xl:-mt-[1vw] mb-10 text-xs sm:text-sm xl:text-[0.9vw] tracking-widest uppercase text-white/50">
        {testimonialsHeader.note}
      </p>

      <div
        ref={deck}
        className="relative flex h-screen items-center justify-center overflow-hidden px-5 motion-reduce:h-auto motion-reduce:flex-col motion-reduce:gap-6 motion-reduce:py-10"
      >
        {testimonials.map((item) => (
          <figure
            key={item.name}
            className="testimonial-card absolute flex w-[calc(100%-2.5rem)] max-w-3xl xl:max-w-[50vw] flex-col gap-8 xl:gap-[2vw] rounded-3xl xl:rounded-[2vw] border border-white/10 bg-[#161616] p-8 sm:p-12 xl:p-[3vw] text-white shadow-2xl motion-reduce:relative"
          >
            <span aria-hidden className="text-6xl xl:text-[5vw] leading-[0.5] text-white/30">
              “
            </span>
            <blockquote className="text-xl sm:text-3xl xl:text-[2vw] leading-snug text-pretty">
              {item.quote}
            </blockquote>
            <figcaption className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 xl:gap-[1vw]">
                <span
                  aria-hidden
                  className="flex h-12 w-12 xl:h-[3.2vw] xl:w-[3.2vw] items-center justify-center rounded-full border border-white/30 text-sm xl:text-[0.9vw] tracking-widest"
                >
                  {initials(item.name)}
                </span>
                <div className="flex flex-col">
                  <span className="text-base xl:text-[1.1vw]">{item.name}</span>
                  <span className="text-sm xl:text-[0.9vw] text-white/60">
                    {item.role}, {item.company}
                  </span>
                </div>
              </div>
              <Link
                href={`/works/${item.work}`}
                className="text-xs xl:text-[0.8vw] uppercase tracking-[0.25rem] text-white/70 hover:text-white transition-colors duration-300"
              >
                See the project →
              </Link>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
