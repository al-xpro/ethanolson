"use client";

import { useRef } from "react";
import { SocialLinks, activeSocials } from "@/components/ui/SocialLinks";
import { ContactForm } from "@/components/ui/ContactForm";
import { contactPage } from "@/content/sections";
import { site } from "@/content/site";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

export function ContactView() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        // Two lines of outlined words slide in opposite directions as the page scrolls
        const scrub = { trigger: ".contact-marquee", start: "top bottom", end: "bottom top", scrub: true };
        gsap.fromTo(".marquee-left", { xPercent: 0 }, { xPercent: -30, ease: "none", scrollTrigger: scrub });
        gsap.fromTo(".marquee-right", { xPercent: -30 }, { xPercent: 0, ease: "none", scrollTrigger: scrub });

        // Form fields and details rise in, one after the other
        gsap.from(".contact-reveal", {
          y: 60,
          opacity: 0,
          stagger: 0.1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".contact-grid", start: "top 80%" },
        });
      });
    },
    { scope: container }
  );

  const words = `${contactPage.marquee} · `.repeat(4);

  return (
    <div ref={container} className="text-white">
      <div aria-hidden className="contact-marquee overflow-hidden py-6 xl:py-[2vw] uppercase leading-none whitespace-nowrap">
        <p className="marquee-left text-outline text-[14vw]">{words}</p>
        <p className="marquee-right text-[14vw]">{words}</p>
      </div>

      <div className="contact-grid grid lg:grid-cols-[3fr_2fr] gap-16 xl:gap-[4vw] px-5 sm:px-10 xl:px-[1.5vw] pt-16 xl:pt-[4vw] pb-24 xl:pb-[6vw] font-light uppercase lg:text-[32px] text-[26px] leading-none">
        <div className="contact-reveal">
          <ContactForm />
        </div>

        <div className="flex flex-col w-full gap-10 xl:gap-[1.5vw]">
          <div className="contact-reveal">
            <h2 className="xl:text-[2vw]">{contactPage.emailLabel}</h2>
            <div className="w-full h-px xl:h-[0.1vw] my-2 bg-white/30" />
            <a
              href={`mailto:${site.email}`}
              className="text-xl tracking-wider lowercase md:text-2xl lg:text-3xl xl:text-[2vw] hover:text-white/60 transition-colors duration-300"
            >
              {site.email}
            </a>
          </div>

          <div className="contact-reveal">
            <h2 className="xl:text-[2vw]">{contactPage.replyLabel}</h2>
            <div className="w-full h-px xl:h-[0.1vw] my-2 bg-white/30" />
            <p className="normal-case text-lg xl:text-[1.2vw] leading-relaxed text-white/70">
              {contactPage.replyText}
            </p>
          </div>

          {activeSocials.length > 0 && (
            <div className="contact-reveal">
              <h2 className="xl:text-[2vw]">{contactPage.socialLabel}</h2>
              <div className="w-full h-px xl:h-[0.1vw] my-2 bg-white/30" />
              <SocialLinks
                className="flex flex-wrap gap-2 xl:gap-[0.5vw]"
                linkClassName="text-sm xl:text-[2vw] tracking-widest uppercase hover:text-white/60 transition-colors duration-300"
                iconClassName="relative pt-0.5 xl:pt-[0.5vw]"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
