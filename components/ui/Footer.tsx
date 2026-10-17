"use client";

import { useRef } from "react";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { site } from "@/content/site";
import { SocialLinks, activeSocials } from "@/components/ui/SocialLinks";
import { PillLink } from "@/components/ui/PillLink";
import { gsap, useGSAP, MOTION_OK, SplitText } from "@/lib/gsap";

const columnTitle = "text-xs xl:text-[0.8vw] tracking-[0.3rem] uppercase text-white/50";
const footerLink =
  "text-lg xl:text-[1.3vw] text-white/80 hover:text-white transition-colors duration-300";

// Sticky reveal: the page scrolls away and uncovers a fixed footer underneath. The
// wrapper's clip-path keeps the fixed layer hidden until the wrapper reaches the viewport.
export default function Footer() {
  const wrapper = useRef<HTMLElement>(null);
  const lenis = useLenis();

  // The links sit in a fixed layer that only shows at the end of the page. Focusing one
  // doesn't scroll, so keyboard users are taken to the end first.
  const revealOnFocus = () => {
    const end = document.documentElement.scrollHeight;
    if (lenis) lenis.scrollTo(end, { immediate: true, force: true });
    else window.scrollTo(0, end);
  };

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const reveal = {
          trigger: wrapper.current,
          start: "top bottom",
          end: "bottom bottom",
          scrub: true,
        };

        // The content rises slower than the page, so it feels like it's underneath
        gsap.fromTo(".footer-inner", { yPercent: -35 }, { yPercent: 0, ease: "none", scrollTrigger: reveal });

        const split = SplitText.create(".footer-wordmark", { type: "chars", mask: "chars" });
        gsap.from(split.chars, {
          yPercent: 110,
          stagger: 0.04,
          ease: "power3.out",
          scrollTrigger: { ...reveal, start: "top 60%" },
        });
      });
    },
    { scope: wrapper }
  );

  return (
    <footer
      ref={wrapper}
      onFocus={revealOnFocus}
      className="relative h-[100svh] min-h-[640px] max-h-[960px]"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="fixed bottom-0 left-0 w-full h-[100svh] min-h-[640px] max-h-[960px] bg-black text-white">
        <div className="footer-inner flex h-full flex-col justify-between px-5 sm:px-10 xl:px-[1.5vw] pt-24 md:pt-28 xl:pt-[7vw] pb-6 xl:pb-[1.5vw]">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-6 xl:gap-[1.5vw] max-w-xl xl:max-w-[36vw]">
              <p className="text-3xl sm:text-5xl xl:text-[3.5vw] uppercase leading-none">
                Have a product in mind?
              </p>
              <PillLink href="/contact" className="self-start">
                Start a project
              </PillLink>
            </div>

            <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 xl:gap-[4vw]">
              <nav aria-label="Footer" className="flex flex-col gap-3 xl:gap-[0.6vw]">
                <p className={columnTitle}>Pages</p>
                {site.navigation.map((item) => (
                  <Link key={item.href} href={item.href} className={footerLink}>
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="flex flex-col gap-3 xl:gap-[0.6vw]">
                <p className={columnTitle}>Legal</p>
                {site.legal.map((item) => (
                  <Link key={item.href} href={item.href} className={footerLink}>
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="col-span-2 sm:col-span-1 flex flex-col gap-3 xl:gap-[0.6vw]">
                <p className={columnTitle}>Contact</p>
                <a href={`mailto:${site.email}`} className={footerLink}>
                  {site.email}
                </a>
                {activeSocials.length > 0 && (
                  <SocialLinks
                    className="flex flex-col gap-3 xl:gap-[0.6vw]"
                    linkClassName={footerLink}
                    iconClassName="relative top-1"
                  />
                )}
              </div>
            </div>
          </div>

          <div>
            <p
              aria-hidden
              className="footer-wordmark text-center uppercase leading-[0.8] whitespace-nowrap text-[13.5vw] xl:text-[15.5vw] tracking-tight"
            >
              {site.name}
            </p>
            <div className="mt-6 xl:mt-[1.5vw] flex flex-col sm:flex-row gap-2 justify-between border-t border-white/20 pt-4 xl:pt-[1vw] text-xs sm:text-sm xl:text-[0.9vw] text-white/60">
              <p suppressHydrationWarning>
                © {new Date().getFullYear()} {site.name}. A concept project: {site.name} is a
                fictional designer.
              </p>
              <p>
                Designed and developed by{" "}
                <a
                  href={site.creator.url}
                  target="_blank"
                  rel="noopener"
                  className="text-white hover:underline"
                >
                  {site.creator.brand}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
