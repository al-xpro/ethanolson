"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { gsap, useGSAP } from "@/lib/gsap";
import { site } from "@/content/site";
import { SocialLinks, activeSocials } from "@/components/ui/SocialLinks";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

const sections = [
  { id: "home", label: "Home" },
  { id: "services", label: "Services" },
  { id: "works", label: "Works" },
  { id: "contact", label: "Contact" },
];

const SCROLL_SPEED = 2000;

const Navbar = () => {
  const lenis = useLenis();
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

    iconTl.current = gsap
      .timeline({ paused: true })
      .to(topLineRef.current, {
        rotate: 45,
        y: 3.3,
        duration: 0.3,
        ease: "power2.inOut",
      })
      .to(
        bottomLineRef.current,
        {
          rotate: -45,
          y: -3.3,
          duration: 0.3,
          ease: "power2.inOut",
        },
        "<"
      );
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

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;

    if (!lenis) {
      target.scrollIntoView();
      return;
    }

    if (reduceMotion) {
      lenis.scrollTo(target, { immediate: true });
      return;
    }

    const distance = Math.abs(target.offsetTop - window.scrollY);
    lenis.scrollTo(target, {
      duration: distance / SCROLL_SPEED,
      easing: (t) => t,
      lock: false,
    });
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
    tl.current?.reverse();
    tl.current?.eventCallback("onReverseComplete", () => {
      setIsOpen(false);
      onClosed?.();
    });
  };

  const toggleMenu = () => (isOpen ? closeMenu() : openMenu());

  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    if (isOpen) {
      closeMenu(() => scrollToSection(id));
    } else {
      scrollToSection(id);
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

    linksRef.current[0]?.querySelector("a")?.focus();

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
    return () => document.removeEventListener("keydown", onKeyDown);
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
        style={{ visibility: "hidden" }}
        className="fixed inset-0 z-200 bg-white text-black/70 uppercase md:left-1/2 md:w-1/2 overflow-y-auto overscroll-contain touch-pan-y"
      >
        <div className="mx-auto flex h-full flex-col justify-between px-10 xl:px-[2vw] py-28 xl:py-[4vw] gap-y-10">
          <ul className="flex flex-col gap-y-2 text-5xl sm:text-6xl xl:text-[3.5vw]">
            {sections.map((section, index) => (
              <li
                key={section.id}
                ref={(el) => {
                  linksRef.current[index] = el;
                }}
              >
                <a
                  href={`#${section.id}`}
                  className="transition-all duration-300 hover:text-black focus-visible:text-black"
                  onClick={(e) => handleNavClick(e, section.id)}
                >
                  {section.label}
                </a>
              </li>
            ))}
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
        <div className="mx-auto w-full px-10 xl:px-[2.5vw] flex items-center justify-between gap-4">
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, "home")}
            className={`uppercase tracking-[0.3rem] text-sm md:text-base xl:text-[1vw] transition-opacity duration-300 ${
              isOpen ? "text-black md:text-white" : "text-white"
            } ${showHeader ? "pointer-events-auto opacity-100" : "opacity-0"}`}
          >
            {site.name}
          </a>

          <div className="flex items-center gap-3 xl:gap-[1vw]">
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "contact")}
              className={`hidden sm:inline-flex items-center h-14 md:h-20 xl:h-[5vw] px-6 md:px-8 xl:px-[2vw] rounded-full border border-white xl:border-[0.1vw] text-white text-sm xl:text-[0.9vw] uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 ${
                showHeader && !isOpen ? "pointer-events-auto opacity-100" : "opacity-0 invisible"
              }`}
            >
              Start a project
            </a>

            <button
              ref={burgerRef}
              type="button"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="site-menu"
              className="
                pointer-events-auto
                flex flex-col items-center justify-center gap-1 xl:gap-2
                bg-white rounded-full cursor-pointer
                transition-all duration-300
                w-14 h-14 md:w-20 md:h-20 xl:w-[5vw] xl:h-[5vw]
              "
              onClick={toggleMenu}
              style={
                showHeader
                  ? { clipPath: "circle(50% at 50% 50%)" }
                  : { clipPath: "circle(0% at 50% 50%)" }
              }
            >
              <span
                ref={topLineRef}
                className="block w-8 h-0.5 xl:w-[2.5vw] xl:h-[0.1vw] bg-black rounded-full"
              />
              <span
                ref={bottomLineRef}
                className="block w-8 h-0.5 xl:w-[2.5vw] xl:h-[0.1vw] bg-black rounded-full"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
