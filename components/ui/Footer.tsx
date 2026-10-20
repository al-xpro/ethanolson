"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { site } from "@/content/site";
import { SocialLinks, activeSocials } from "@/components/ui/SocialLinks";
import { AgentView } from "@/components/ui/AgentView";
import { gsap, useGSAP, MOTION_OK, SplitText } from "@/lib/gsap";

const columnTitle = "text-xs xl:text-[0.8vw] tracking-[0.3rem] uppercase text-white/50";
const footerLink =
  "text-lg xl:text-[1.3vw] text-white/80 hover:text-white transition-colors duration-300";

// Sticky reveal: the page scrolls away and uncovers a fixed footer underneath. The
// wrapper's clip-path keeps the fixed layer hidden until the wrapper reaches the viewport.
// The wrapper takes the footer's own height, measured live; if the footer is taller than
// the screen (phones in landscape), it falls back to a normal footer so nothing is cut.
export default function Footer() {
  const wrapper = useRef<HTMLElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const [height, setHeight] = useState<number | null>(null);
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    const element = inner.current;
    if (!element) return;
    // ResizeObserver also fires once when it starts observing
    const measure = () => {
      const footerHeight = element.offsetHeight;
      setHeight(footerHeight);
      setReveal(footerHeight <= window.innerHeight);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // The links sit in a fixed layer that only shows at the end of the page. Focusing one
  // doesn't scroll, so keyboard users are taken to the end first.
  const revealOnFocus = () => {
    if (!reveal) return;
    const end = document.documentElement.scrollHeight;
    if (lenis) lenis.scrollTo(end, { immediate: true, force: true });
    else window.scrollTo(0, end);
  };

  useGSAP(
    () => {
      if (!reveal) return;
      gsap.matchMedia().add(MOTION_OK, () => {
        const scroll = { trigger: wrapper.current, start: "top bottom", end: "bottom bottom", scrub: true };

        // The content rises slower than the page, so it feels like it's underneath
        gsap.fromTo(".footer-content", { yPercent: -35 }, { yPercent: 0, ease: "none", scrollTrigger: scroll });

        const split = SplitText.create(".footer-wordmark", { type: "chars", mask: "chars", aria: "none" }) // decorative, already hidden;
        gsap.from(split.chars, {
          yPercent: 110,
          stagger: 0.04,
          ease: "power3.out",
          scrollTrigger: { ...scroll, start: "top 70%" },
        });
      });
    },
    { scope: wrapper, dependencies: [reveal], revertOnUpdate: true }
  );

  return (
    <footer
      ref={wrapper}
      onFocus={revealOnFocus}
      className="relative min-w-[320px]"
      style={{
        clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)",
        height: reveal && height ? height : undefined,
      }}
    >
      <div
        ref={inner}
        className={`${reveal ? "fixed bottom-0 left-0" : "relative"} w-full min-w-[320px] bg-black text-white`}
      >
        <div className="footer-content flex flex-col gap-16 xl:gap-[5vw] px-5 sm:px-10 xl:px-[1.5vw] pt-20 xl:pt-[6vw] pb-6 xl:pb-[1.5vw] [@media(max-height:560px)]:pt-12 [@media(max-height:560px)]:gap-10">
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
              <a href={`mailto:${site.email}`} className={`${footerLink} break-all`}>
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

          <div>
            {/* Never smaller than at 320px, so it can't break on narrower screens */}
            <p
              aria-hidden
              className="footer-wordmark text-center uppercase leading-[0.8] whitespace-nowrap text-[max(13.5vw,2.7rem)] xl:text-[15.5vw] tracking-tight"
            >
              {site.name}
            </p>
            <div className="mt-6 xl:mt-[1.5vw] flex flex-col sm:flex-row gap-2 justify-between border-t border-white/20 pt-4 xl:pt-[1vw] text-xs sm:text-sm xl:text-[0.9vw] text-white/60">
              <p suppressHydrationWarning>
                © {new Date().getFullYear()} {site.name}. A concept project: {site.name} is a
                fictional designer.
              </p>
              <AgentView className="cursor-pointer self-start text-left text-white underline underline-offset-4 hover:text-white/70" />
              <p>
                Designed and developed by{" "}
                <a
                  href={site.creator.url}
                  target="_blank"
                  rel="noopener"
                  className="text-white underline underline-offset-4 hover:text-white/70"
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
