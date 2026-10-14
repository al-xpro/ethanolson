"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Float, Lightformer, useProgress } from "@react-three/drei";
import AnimatedHeaderSection from "@/components/ui/AnimatedHeaderSection";
import { heroHeader } from "@/content/sections";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";
import { ObjectIllusionHero } from "../ui/ObjectIllustionHero";

const Hero = () => {
  const figureRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(true);
  const reduceMotion = usePrefersReducedMotion();
  const { active, progress } = useProgress();
  const modelReady = !active && progress === 100;

  // Stop rendering the scene once it scrolls out of view
  useEffect(() => {
    const figure = figureRef.current;
    if (!figure) return;

    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(figure);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="home"
      className="relative flex flex-col h-screen w-full justify-start min-h-[700px] overflow-hidden pt-14 md:pt-20 xl:pt-[4.5vw]"
    >
      <AnimatedHeaderSection
        subTitle={heroHeader.subTitle}
        title={heroHeader.title}
        text={heroHeader.text}
        textColor={"text-white"}
        as="h1"
      />
      <figure
        ref={figureRef}
        aria-hidden
        className={`absolute inset-0 -z-50 min-h-[700px] transition-opacity duration-1000 ${
          modelReady ? "opacity-100" : "opacity-0"
        }`}
      >
        <Canvas
          frameloop={inView ? "always" : "never"}
          camera={{ position: [0, 0, -10], fov: 17.5, near: 1, far: 20 }}
        >
          <ambientLight intensity={1} />
          <Suspense fallback={null}>
            <Float
              speed={reduceMotion ? 0 : 1}
              rotationIntensity={reduceMotion ? 0 : 1}
              floatIntensity={reduceMotion ? 0 : 1}
            >
              <ObjectIllusionHero reduceMotion={reduceMotion} />
            </Float>
          </Suspense>
          <Environment resolution={512}>
            <group rotation={[0, 0, 0]}>
              {/* Top strip light */}
              <Lightformer form="rect" intensity={10} position={[0, 5, 0]} scale={[10, 2, 0]} />

              {/* Left vertical strip */}
              <Lightformer
                form="rect"
                intensity={6}
                position={[-5, 0, 0]}
                rotation={[0, Math.PI / 2, 0]}
                scale={[10, 2, 0]}
              />

              {/* Right vertical strip */}
              <Lightformer
                form="rect"
                intensity={6}
                position={[5, 0, 0]}
                rotation={[0, -Math.PI / 2, 0]}
                scale={[10, 2, 0]}
              />

              {/* Back kicker */}
              <Lightformer form="circle" intensity={4} position={[0, 0, -2]} scale={5} />
            </group>
          </Environment>
        </Canvas>
      </figure>
    </section>
  );
};

export default Hero;
