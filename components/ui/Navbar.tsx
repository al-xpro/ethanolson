"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useLenis } from "lenis/react";
import { FaGithub, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

const socials = [
  { name: "Instagram", href: "/", icon: <FaInstagram /> },
  {
    name: "Youtube",
    href: "/",
    icon: <FaYoutube />,
  },
  { name: "LinkedIn", href: "/", icon: <FaLinkedin /> },
  { name: "GitHub", href: "", icon: <FaGithub /> },
];

const Navbar = () => {
  const lenis = useLenis();
  const navRef = useRef<HTMLElement>(null);
  const linksRef = useRef<(HTMLDivElement | null)[]>([]);
  const contactRef = useRef<HTMLDivElement>(null);
  const topLineRef = useRef<HTMLSpanElement>(null);
  const bottomLineRef = useRef<HTMLSpanElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const iconTl = useRef<gsap.core.Timeline | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [showBurger, setShowBurger] = useState(true);

  useGSAP(() => {
    gsap.set(navRef.current, { xPercent: 100 });
    gsap.set([linksRef.current, contactRef.current], {
      autoAlpha: 0,
      x: -20,
    });

    tl.current = gsap
      .timeline({ paused: true })
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
    if (isOpen) {
      setShowBurger(true);
      return;
    }

    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowBurger(currentScrollY <= lastScrollY || currentScrollY < 10);
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  const toggleMenu = () => {
    if (isOpen) {
      // CLOSE
      lenis?.start();

      iconTl.current?.reverse();
      tl.current?.reverse();

      tl.current?.eventCallback("onReverseComplete", () => {
        setIsOpen(false);
      });
    } else {
      // OPEN
      lenis?.stop();

      setIsOpen(true);
      tl.current?.play();
      iconTl.current?.play();
    }
  };

  const handleNavClick = (section: string) => {
    // Resume scrolling
    lenis?.start();

    iconTl.current?.reverse();
    tl.current?.reverse();

    tl.current?.eventCallback("onReverseComplete", () => {
      setIsOpen(false);

      lenis?.scrollTo(`#${section}`, {
        offset: 0,
        duration: 15,
        lock: false,
      });
    });
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed inset-0 z-200 bg-white text-black/70 uppercase overflow-hidden md:left-1/2 md:w-1/2"
      >
        <div className="mx-auto flex h-full flex-col justify-between px-10 py-28 gap-y-10">
          <div className="flex flex-col gap-y-2 text-5xl sm:text-6xl lg:text-8xl">
            {["home", "services", "about", "works", "stories", "contact"].map((section, index) => (
              <div key={index} ref={(el: any) => (linksRef.current[index] = el)}>
                <span
                  className="transition-all duration-300 cursor-pointer hover:text-black"
                  onClick={() => handleNavClick(section)}
                >
                  {section}
                </span>
              </div>
            ))}
          </div>

          <div
            ref={contactRef}
            className="flex flex-col flex-wrap justify-between gap-8 lg:flex-row"
          >
            <div className="font-light">
              <p className="tracking-wider text-black">E-mail</p>
              <p className="text-xl tracking-widest lowercase">JohnDoe@gmail.com</p>
            </div>

            <div className="font-light">
              <p className="tracking-wider text-black">Social Media</p>
              <div className="flex flex-col lg:flex-row gap-x-2">
                {socials.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="text-sm tracking-widest uppercase hover:text-black transition-colors duration-300"
                  >
                    <div className="flex gap-2">
                    <span className="relative pt-0.5">{social.icon}</span>
                    {social.name}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Burger Button Container */}
      <div className="fixed z-200 top-4 inset-x-0 pointer-events-none min-w-[320px]">
        {/* Important: Ensure this wrapper matches the Navbar wrapper width so the button doesn't jump */}
        <div className="mx-auto w-full px-10">
          <div
            className="
              ml-auto pointer-events-auto
              flex flex-col items-center justify-center gap-1
              bg-white rounded-full cursor-pointer
              transition-all duration-300
              w-14 h-14 md:w-20 md:h-20
            "
            onClick={toggleMenu}
            style={
              showBurger
                ? { clipPath: "circle(50% at 50% 50%)" }
                : { clipPath: "circle(0% at 50% 50%)" }
            }
          >
            <span ref={topLineRef} className="block w-8 h-0.5 bg-black rounded-full" />
            <span ref={bottomLineRef} className="block w-8 h-0.5 bg-black rounded-full" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
