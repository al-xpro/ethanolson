"use client";

import { useRef } from "react";
import Link from "next/link";
import AnimatedHeaderSection from "@/components/ui/AnimatedHeaderSection";
import { SocialLinks, activeSocials } from "@/components/ui/SocialLinks";
import { ContactForm } from "@/components/ui/ContactForm";
import { contactHeader } from "@/content/sections";
import { site } from "@/content/site";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from(".social-link", {
          y: 100,
          opacity: 0,
          delay: 0.5,
          duration: 1,
          stagger: 0.3,
          ease: "back.out",
          scrollTrigger: {
            trigger: ".social-link",
          },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative flex flex-col justify-between min-h-screen bg-black rounded-t-4xl xl:rounded-t-[3vw] overflow-hidden"
    >
      <div>
        <AnimatedHeaderSection
          subTitle={contactHeader.subTitle}
          title={contactHeader.title}
          text={contactHeader.text}
          textColor={"text-white"}
          withScrollTrigger={true}
        />

        <div className="grid lg:grid-cols-[3fr_2fr] gap-16 xl:gap-[4vw] px-5 sm:px-10 xl:px-[1.5vw] font-light text-white uppercase lg:text-[32px] text-[26px] leading-none mb-10">
          <ContactForm />

          <div className="relative flex flex-col w-full gap-10 xl:gap-[1.5vw]">
            <div className="social-link">
              <h3 className="xl:text-[2vw]">E-mail</h3>
              <div className="w-full h-px xl:h-[0.1vw] my-2 bg-white/30" />
              <a
                href={`mailto:${site.email}`}
                className="text-xl tracking-wider lowercase md:text-2xl lg:text-3xl xl:text-[2vw] hover:text-white/60 transition-colors duration-300"
              >
                {site.email}
              </a>
            </div>

            {activeSocials.length > 0 && (
              <div className="social-link">
                <h3 className="xl:text-[2vw]">Social Media</h3>
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

      <footer className="relative flex w-full h-full px-4 sm:px-10 xl:px-[1.5vw] py-10 xl:py-[1.5vw]">
        <div className="flex flex-col sm:flex-row w-full items-center sm:justify-between gap-2 text-center sm:text-left text-sm md:text-md lg:text-lg xl:text-[1.3vw] leading-normal text-white">
          <p suppressHydrationWarning>
            © {new Date().getFullYear()} {site.name}. A concept project: {site.name} is a
            fictional designer.
          </p>
          <p>
            Designed and developed by&nbsp;
            <Link
              href={site.creator.url}
              target="_blank"
              className="text-white font-bold hover:underline"
            >
              {site.creator.brand}
            </Link>
          </p>
        </div>
      </footer>
    </section>
  );
};

export default Contact;
