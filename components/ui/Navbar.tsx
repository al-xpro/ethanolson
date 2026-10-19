"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLenis } from "lenis/react";
import { gsap, useGSAP } from "@/lib/gsap";
import { site } from "@/content/site";
import { SocialLinks, activeSocials } from "@/components/ui/SocialLinks";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

const Navbar = ({ ctaLabel }: { ctaLabel: string }) => {
  const lenis = useLenis();
  const router = useRouter();
  const pathname = usePathname();
  const reduceMotion = usePrefersReducedMotion();
  const menuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const linksRef = useRef<(HTMLLIElement | null)[]>([]);
  const contactRef = useRef<HTMLDivElement>(null);
  const topLineRef = useRef<HTMLSpanElement>(null);
  const bottomLineRef = useRef<HTMLSpanElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const iconTl = useRef<gsap.core.Timeline | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [scrolledDown, setScrolledDown] = useState(false);
  const showHeader = isOpen || !scrolledDown;

  useGSAP(() => {
    gsap.set(navRef.current, { xPercent: 100 });
    gsap.set([linksRef.current, contactRef.current], {
      autoAlpha: 0,
      x: -20,
    });

    tl.current = gsap
      .timeline({ paused: true })
      .set(navRef.current, { visibility: "visible" })
      .to(navRef.current, {
        xPercent: 0,
        duration: 1,
        ease: "power3.out",
      })
      .to(
        linksRef.current,
        {
          autoAlpha: 1,
          x: 0,
          stagger: 0.1,
          duration: 0.5,
          ease: "power2.out",
        },
        "<"
      )
      .to(
        contactRef.current,
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "<+0.2"
      );

    // The lines meet halfway between their resting positions, measured on screen,
    // so the cross stays centered at every button size
    const halfway = () => {
      const top = topLineRef.current?.getBoundingClientRect();
      const bottom = bottomLineRef.current?.getBoundingClientRect();
      return top && bottom ? (bottom.top - top.top) / 2 : 0;
    };

    iconTl.current = gsap
      .timeline({ paused: true })
      .to(topLineRef.current, {
        rotate: 45,
        y: halfway,
        duration: 0.3,
        ease: "power2.inOut",
      })
      .to(
        bottomLineRef.current,
        {
          rotate: -45,
          y: () => -halfway(),
          duration: 0.3,
          ease: "power2.inOut",
        },
        "<"
      );

    const remeasure = () => {
      if (iconTl.current?.progress() === 0) iconTl.current.invalidate();
    };
    window.addEventListener("resize", remeasure);
    return () => window.removeEventListener("resize", remeasure);
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolledDown(currentScrollY > lastScrollY && currentScrollY >= 10);
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // In-page links stop below the header when it reappears (see lib/useSmoothAnchor.ts)
  useEffect(() => {
    const publish = () => {
      const bottom = (burgerRef.current?.getBoundingClientRect().bottom ?? 0) + 8;
      document.documentElement.style.setProperty("--header-height", `${bottom}px`);
    };
    publish();
    window.addEventListener("resize", publish);
    return () => window.removeEventListener("resize", publish);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav || !isOpen) return;

    const stopScroll = (e: Event) => {
      e.stopPropagation();
    };

    nav.addEventListener("wheel", stopScroll, { passive: false });
    nav.addEventListener("touchmove", stopScroll, { passive: false });

    return () => {
      nav.removeEventListener("wheel", stopScroll);
      nav.removeEventListener("touchmove", stopScroll);
    };
  }, [isOpen]);

  const goTo = (href: string) => {
    if (href === pathname) {
      lenis?.scrollTo(0, { immediate: reduceMotion });
      return;
    }
    router.push(href);
  };

  const openMenu = () => {
    lenis?.stop();
    setIsOpen(true);
    tl.current?.play();
    iconTl.current?.play();
  };

  const closeMenu = (onClosed?: () => void) => {
    lenis?.start();
    iconTl.current?.reverse();

    const finish = () => {
      setIsOpen(false);
      onClosed?.();
    };
    const timeline = tl.current;

    // Closed before the opening animation rendered a frame: nothing to reverse
    if (!timeline || timeline.time() === 0) {
      timeline?.pause(0);
      finish();
      return;
    }

    timeline.eventCallback("onReverseComplete", finish);
    timeline.reverse();
  };

  const toggleMenu = () => (isOpen ? closeMenu() : openMenu());

  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Let the browser handle new-tab clicks
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    if (isOpen) {
      closeMenu(() => goTo(href));
    } else {
      goTo(href);
    }
  };

  // Keyboard support while the menu is open: Escape closes it, Tab stays inside it
  useEffect(() => {
    if (!isOpen) return;

    const menu = menuRef.current;
    const getFocusable = () =>
      Array.from(menu?.querySelectorAll<HTMLElement>("a[href], button") ?? []).filter(
        (el) => el.offsetParent !== null
      );

    // The links fade in on GSAP's next frames, and hidden elements can't take focus
    const focusFirstLink = gsap.delayedCall(0.1, () =>
      linksRef.current[0]?.querySelector("a")?.focus()
    );

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu(() => burgerRef.current?.focus());
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = getFocusable();
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      focusFirstLink.kill();
      document.removeEventListener("keydown", onKeyDown);
    };
    // closeMenu only touches refs and stable setters
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <div ref={menuRef}>
      <nav
        id="site-menu"
        ref={navRef}
        aria-label="Main"
        inert={!isOpen}
        data-surface="light"
        style={{ visibility: "hidden" }}
        className="fixed inset-0 z-200 bg-white text-black/70 uppercase md:left-1/2 md:w-1/2 overflow-y-auto overscroll-contain touch-pan-y"
      >
        <div className="mx-auto flex h-full flex-col justify-between px-10 xl:px-[2vw] py-28 xl:py-[4vw] gap-y-10">
          <ul className="flex flex-col gap-y-2 text-5xl sm:text-6xl xl:text-[3.5vw]">
            {site.navigation.map((item, index) => {
              const current = item.href === pathname;
              return (
                <li
                  key={item.href}
                  ref={(el) => {
                    linksRef.current[index] = el;
                  }}
                >
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={`group inline-flex items-center gap-4 xl:gap-[1vw] transition-colors duration-300 hover:text-black focus-visible:text-black ${
                      current ? "text-black" : ""
                    }`}
                    onClick={(e) => handleNavClick(e, item.href)}
                  >
                    <span
                      aria-hidden
                      className={`h-2 w-2 xl:h-[0.5vw] xl:w-[0.5vw] rounded-full bg-black transition-transform duration-300 ${
                        current ? "scale-100" : "scale-0 group-hover:scale-100"
                      }`}
                    />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div
            ref={contactRef}
            className="flex flex-col flex-wrap justify-between gap-8 xl:gap-[1vw] lg:flex-row"
          >
            <div className="font-light">
              <p className="tracking-wider xl:text-[1vw] text-black">E-mail</p>
              <a
                href={`mailto:${site.email}`}
                className="text-xl xl:text-[1vw] tracking-widest lowercase hover:text-black"
              >
                {site.email}
              </a>
            </div>

            {activeSocials.length > 0 && (
              <div className="font-light">
                <p className="tracking-wider xl:text-[1vw] text-black">Social Media</p>
                <SocialLinks
                  className="flex flex-col lg:flex-row gap-x-2 xl:gap-x-[0.5vw]"
                  linkClassName="text-sm tracking-widest xl:text-[1vw] uppercase hover:text-black transition-colors duration-300"
                  iconClassName="relative pt-0.5 xl:pt-[0.3vw]"
                />
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="fixed z-200 top-4 xl:top-[0.5vw] inset-x-0 pointer-events-none min-w-[320px]">
        <div className="mx-auto w-full px-6 xl:px-[2.5vw] flex items-center justify-end gap-4">
          <div className="flex items-center gap-3 xl:gap-[1vw]">
            <Link
              href="/contact"
              onClick={(e) => handleNavClick(e, "/contact")}
              className={`hidden sm:inline-flex items-center h-14 md:h-20 xl:h-[5vw] px-6 md:px-8 xl:px-[2vw] rounded-full border border-white xl:border-[0.1vw] text-white text-sm xl:text-[0.9vw] uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 ${
                showHeader && !isOpen ? "pointer-events-auto opacity-100" : "opacity-0 invisible"
              }`}
            >
              {ctaLabel}
            </Link>

            <button
              ref={burgerRef}
              type="button"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="site-menu"
              className="
                pointer-events-auto
                flex flex-col items-center justify-center
                gap-[6px] xl:gap-[max(8px,round(0.45vw,1px))]
                bg-white rounded-full cursor-pointer
                transition-all duration-300
                w-14 h-14 md:w-20 md:h-20 xl:w-[5vw] xl:h-[5vw]
                focus-visible:outline-none focus-visible:shadow-[inset_0_0_0_3px_#111]
              "
              onClick={toggleMenu}
              style={
                showHeader
                  ? { clipPath: "circle(50% at 50% 50%)" }
                  : { clipPath: "circle(0% at 50% 50%)" }
              }
            >
              {/* Whole-pixel heights and gap: fractional sizes render the lines unevenly */}
              <span
                ref={topLineRef}
                className="block w-8 xl:w-[2.5vw] h-[2px] xl:h-[max(2px,round(0.14vw,1px))] bg-black rounded-full"
              />
              <span
                ref={bottomLineRef}
                className="block w-8 xl:w-[2.5vw] h-[2px] xl:h-[max(2px,round(0.14vw,1px))] bg-black rounded-full"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
