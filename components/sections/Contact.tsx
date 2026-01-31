"use client";

import { useGSAP } from "@gsap/react";
import AnimatedHeaderSection from "@/components/ui/AnimatedHeaderSection";
import gsap from "gsap";
import { FaGithub, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, PerspectiveCamera } from "@react-three/drei";
import { ObjectIllusionContact } from "../ui/ObjectIllusionContact";
import { Leva } from "leva";
import { CustomCamera } from "../ui/CustomCamera";
import { contactHeader } from "@/lib/data";

const socials = [
  { name: "Instagram", href: "/", icon: <FaInstagram /> },
  { name: "Youtube", href: "/", icon: <FaYoutube /> },
  { name: "LinkedIn", href: "/", icon: <FaLinkedin /> },
  { name: "GitHub", href: "", icon: <FaGithub /> },
];

const Contact = () => {
  const path = useRef<SVGPathElement>(null);

  useGSAP(() => {
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
  }, []);

  // ... (SVG Path Logic remains exactly the same as your original code) ...
  let progress = 0;
  let x = 0.5;

  useEffect(() => {
    const update = () => setPath(progress);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const setPath = (progress: number) => {
    const width = window.innerWidth * 0.7;
    path.current?.setAttributeNS(null, "d", `M0 250 Q${width * x} ${250 + progress}, ${width} 250`);
  };

  return (
    <section
      id="contact"
      className="relative flex flex-col justify-between min-h-screen bg-black rounded-t-4xl xl:rounded-t-[3vw] overflow-hidden"
    >
      <div>
        {/* 1. Header Text: Wrapped in pointer-events-auto so you can select text */}
        {/* The parent container needs to be pointer-events-none (handled below) */}
        <div className="relative z-10 pointer-events-none select-text">
          <AnimatedHeaderSection
            subTitle={contactHeader.subTitle}
            title={contactHeader.title}
            text={contactHeader.text}
            textColor={"text-white"}
            withScrollTrigger={true}
          />
        </div>

        <div className="flex flex-col px-5 sm:px-10 xl:px-[1.5vw] font-light text-white uppercase lg:text-[32px] text-[26px] leading-none mb-10">
          {/* 2. Content Wrapper: pointer-events-none passes clicks through empty space to Canvas */}
          <div className="relative flex flex-col w-full gap-10 xl:gap-[1.5vw] z-10 pointer-events-none">
            {/* 3. Links: pointer-events-auto restores clickability for links */}
            <div className="social-link pointer-events-auto">
              <h2 className="xl:text-[2vw]">E-mail</h2>
              <div className="w-full h-px xl:h-[0.1vw] my-2 bg-white/30" />
              <p className="text-xl tracking-wider lowercase md:text-2xl lg:text-3xl xl:text-[2vw]">
                EthanOlson@gmail.com
              </p>
            </div>

            <div className="social-link pointer-events-auto">
              <h2 className="xl:text-[2vw]">Social Media</h2>
              <div className="w-full h-px xl:h-[0.1vw] my-2 bg-white/30" />
              <div className="flex flex-wrap gap-2 xl:gap-[0.5vw]">
                {socials.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="text-sm xl:text-[2vw] tracking-widest uppercase hover:text-white/30 transition-colors duration-300 pointer-events-auto select-text"
                  >
                    <div className="flex gap-2 xl:gap-[0.5vw] xl:pt-[0.2vw]">
                      <span className="relative pt-0.5 xl:pt-[0.5vw]">{social.icon}</span>
                      {social.name}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Canvas: pointer-events-auto allows 3D manipulation */}
          <figure
            className="absolute inset-0 z-0 min-h-[700px] pointer-events-auto"
            style={{ mixBlendMode: "normal" }}
          >
            <Canvas className="w-full h-full" style={{ pointerEvents: "auto" }}>
              <Leva hidden />
              <PerspectiveCamera makeDefault position={[0, 0, 30]} />
              <CustomCamera>
                <ObjectIllusionContact />
              </CustomCamera>
              <Environment resolution={512}>
                {/* [Keep your existing lighting setup] */}
                <group rotation={[0, 0, 0]}>
                  <Lightformer form="rect" intensity={10} position={[0, 5, 0]} scale={[10, 2, 0]} />
                  <Lightformer
                    form="rect"
                    intensity={6}
                    position={[-1, 0, 0]}
                    rotation={[0, Math.PI / 2, 0]}
                    scale={[10, 2, 0]}
                  />
                  <Lightformer
                    form="rect"
                    intensity={6}
                    position={[1, 0, 0]}
                    rotation={[0, -Math.PI / 2, 0]}
                    scale={[10, 2, 0]}
                  />
                  <Lightformer form="circle" intensity={4} position={[0, 0, -5]} scale={5} />
                </group>
              </Environment>
            </Canvas>
          </figure>
        </div>
      </div>
    </section>
  );
};

export default Contact;
