"use client";

import { useGSAP } from "@gsap/react";
import AnimatedHeaderSection from "@/components/ui/AnimatedHeaderSection";
import gsap from "gsap";
import { FaGithub, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { useEffect, useRef } from "react";
import Index from "../ui/Index";
import { Canvas } from "@react-three/fiber";
import { Environment, Float, Lightformer, PerspectiveCamera } from "@react-three/drei";
import { ObjectIllusionContact } from "../ui/ObjectIllusionContact";
import { Leva } from "leva";
import { CustomCamera } from "../ui/CustomCamera";

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

const Contact = () => {
  const path = useRef<SVGPathElement>(null);

  const text = `If you like my work and want to collaborate,
    don't hesitate to reach me out.`;

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

  let progress = 0;
  let x = 0.5;
  let time = Math.PI / 2;
  let reqId: number | null = null;

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

  const lerp = ({ x, y, a }: { x: number; y: number; a: number }) => x * (1 - a) + y * a;

  const manageMouseEnter = () => {
    if (reqId) {
      cancelAnimationFrame(reqId);
      resetAnimation();
    }
  };

  const manageMouseMove = (e: MouseEvent) => {
    const { movementY, clientX } = e;
    const pathBound = path.current?.getBoundingClientRect();
    x = (clientX - pathBound!.left) / pathBound!.width;
    progress += movementY;
    setPath(progress);
  };

  const manageMouseLeave = () => {
    animateOut();
  };

  const animateOut = () => {
    const newProgress = progress * Math.sin(time);
    progress = lerp({ x: progress, y: 0, a: 0.025 });
    time += 0.2;
    setPath(newProgress);
    if (Math.abs(progress) > 0.75) {
      reqId = requestAnimationFrame(animateOut);
    } else {
      resetAnimation();
    }
  };

  const resetAnimation = () => {
    time = Math.PI / 2;
    progress = 0;
  };

  return (
    <section
      id="contact"
      className="relative flex flex-col justify-between min-h-screen bg-black rounded-t-4xl"
    >
      <div>
        <AnimatedHeaderSection
          subTitle={"Get in Touch"}
          title={"Contact"}
          text={text}
          textColor={"text-white"}
          withScrollTrigger={true}
        />
        <div className="flex flex-col px-10 font-light text-white uppercase lg:text-[32px] text-[26px] leading-none mb-10">
          <div className="relative flex flex-col w-full gap-10 z-10">
            <div className="social-link">
              <h2>E-mail</h2>
              <div className="w-full h-px my-2 bg-white/30" />
              <p className="text-xl tracking-wider lowercase md:text-2xl lg:text-3xl">
                JohnDoe@gmail.com
              </p>
            </div>
            <div className="social-link">
              <h2>Social Media</h2>
              <div className="w-full h-px my-2 bg-white/30" />
              <div className="flex flex-wrap gap-2">
                {socials.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="text-sm tracking-widest uppercase hover:text-white/30 transition-colors duration-300"
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
          <figure className="absolute inset-0 z-0 min-h-[700px]">
            <Canvas className="w-full h-full">
              {/* To hide controller */}
              <Leva hidden />
              <PerspectiveCamera makeDefault position={[0, 0, 30]} />

              <CustomCamera>
                <ObjectIllusionContact />
              </CustomCamera>
              <Environment resolution={512}>
                <group rotation={[0, 0, 0]}>
                  {/* Top strip light */}
                  <Lightformer form="rect" intensity={10} position={[0, 5, 0]} scale={[10, 2, 0]} />

                  {/* Left vertical strip */}
                  <Lightformer
                    form="rect"
                    intensity={6}
                    position={[-1, 0, 0]}
                    rotation={[0, Math.PI / 2, 0]}
                    scale={[10, 2, 0]}
                  />

                  {/* Right vertical strip */}
                  <Lightformer
                    form="rect"
                    intensity={6}
                    position={[1, 0, 0]}
                    rotation={[0, -Math.PI / 2, 0]}
                    scale={[10, 2, 0]}
                  />

                  {/* Back kicker */}
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
