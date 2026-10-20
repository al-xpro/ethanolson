"use client";

import { useRef } from "react";
import Link from "next/link";
import { useLenis } from "lenis/react";
import AnimatedHeaderSection from "@/components/ui/AnimatedHeaderSection";
import { PillLink } from "@/components/ui/PillLink";
import type { Home } from "@/lib/cms/model";
import { editable } from "@/lib/cms/editable";
import { testimonialLabels } from "@/content/ui";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("");

export default function Testimonials({ content }: { content: Home["testimonials"] }) {
  const deck = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const cards = gsap.utils.toArray<HTMLElement>(".testimonial-card");
        const fan = (offset: number) => ({
          scale: 1 - offset * 0.05,
          y: offset * 24,
          rotate: offset === 0 ? 0 : offset % 2 ? 2.5 * offset : -2.5 * offset,
        });

        // Fanned like a hand of cards: each one behind is smaller and turned
        cards.forEach((card, index) =>
          gsap.set(card, { zIndex: cards.length - index, ...fan(index) }),
        );
        gsap.set(".testimonials-closing", { opacity: 0, scale: 0.92 });

        const tl = (timeline.current = gsap.timeline({
          scrollTrigger: {
            trigger: deck.current,
            start: "top top",
            end: () => `+=${window.innerHeight * cards.length * 0.85}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        }));

        // Every card peels away with a twist, the deck steps forward, and the last one
        // uncovers the closing line behind it
        cards.forEach((card, index) => {
          // The moment this card is at the front, for keyboard focus
          tl.addLabel(`card-${index}`);
          // Half the viewport plus the card's own height takes it fully off screen, at any size
          tl.to(card, {
            y: () => -window.innerHeight / 2,
            yPercent: -125,
            rotate: index % 2 ? 14 : -14,
            ease: "power2.in",
            duration: 1,
          });
          cards.slice(index + 1).forEach((next, offset) => {
            tl.to(
              next,
              { ...fan(offset), ease: "power2.out", duration: 1 },
              "<",
            );
          });
        });
        tl.to(
          ".testimonials-closing",
          { opacity: 1, scale: 1, ease: "power2.out", duration: 0.8 },
          "-=0.6",
        );
        tl.addLabel("closing");

        return () => {
          timeline.current = null;
        };
      });
    },
    { scope: deck },
  );

  // Cards behind the first one are covered, so focusing a link scrolls the deck to the
  // moment its card is at the front (or to the closing line)
  const showFocusedCard = (event: React.FocusEvent<HTMLDivElement>) => {
    const trigger = timeline.current?.scrollTrigger;
    if (!trigger) return;
    const card = (event.target as HTMLElement).closest(".testimonial-card");
    const cards = Array.from(deck.current?.querySelectorAll(".testimonial-card") ?? []);
    const top = trigger.labelToScroll(card ? `card-${cards.indexOf(card)}` : "closing");
    if (lenis) lenis.scrollTo(top, { immediate: true, force: true });
    else window.scrollTo(0, top);
  };

  return (
    <section id="testimonials" {...editable(content)} className="relative">
      <AnimatedHeaderSection
        subTitle={content.header.subtitle}
        title={content.header.title}
        text={content.header.text}
        textColor="text-white"
        withScrollTrigger
        attrs={editable(content.header)}
      />

      <div
        ref={deck}
        onFocus={showFocusedCard}
        className="relative flex h-[100svh] min-h-[320px] items-center justify-center overflow-clip px-5 motion-reduce:h-auto motion-reduce:flex-col motion-reduce:gap-6 motion-reduce:py-10"
      >
        {/* Short screens (phones in landscape) get a compact card, so the whole quote fits */}
        {content.testimonials.map((item, index) => (
          <figure
            key={index}
            {...editable(item)}
            className="testimonial-card absolute flex w-[calc(100%-2.5rem)] max-w-3xl xl:max-w-[50vw] flex-col gap-8 xl:gap-[2vw] rounded-3xl xl:rounded-[2vw] border border-white/10 bg-[#161616] p-8 sm:p-12 xl:p-[3vw] text-white shadow-2xl motion-reduce:relative [@media(max-height:560px)]:gap-4 [@media(max-height:560px)]:p-6 [@media(max-height:560px)]:max-w-2xl"
          >
            <span
              aria-hidden
              className="text-6xl xl:text-[5vw] leading-[0.5] text-white/30 [@media(max-height:560px)]:hidden"
            >
              “
            </span>
            <blockquote className="text-xl sm:text-3xl xl:text-[2vw] leading-snug text-pretty [@media(max-height:560px)]:text-lg">
              {item.quote}
            </blockquote>
            <figcaption className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 xl:gap-[1vw]">
                <span
                  aria-hidden
                  className="flex h-12 w-12 shrink-0 xl:h-[3.2vw] xl:w-[3.2vw] items-center justify-center rounded-full border border-white/30 text-sm xl:text-[0.9vw] tracking-widest [@media(max-height:560px)]:h-9 [@media(max-height:560px)]:w-9 [@media(max-height:560px)]:text-xs"
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
                {testimonialLabels.link}
              </Link>
            </figcaption>
          </figure>
        ))}

        {/* After the cards, so it's last in the tab order; the cards' z-index keeps it behind */}
        <div className="testimonials-closing absolute inset-0 flex flex-col items-center justify-center gap-6 xl:gap-[2vw] px-5 text-center text-white motion-reduce:relative motion-reduce:order-last motion-reduce:py-10">
          <p className="text-4xl sm:text-6xl xl:text-[5vw] uppercase leading-none text-balance max-w-4xl xl:max-w-[60vw]">
            {content.ctaTitle}
          </p>
          <PillLink href="/contact">{content.ctaLabel}</PillLink>
        </div>
      </div>
    </section>
  );
}
