"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Float, Lightformer } from "@react-three/drei";
import AnimatedHeaderSection from "@/components/ui/AnimatedHeaderSection";
import { heroHeader } from "@/content/sections";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";
import { useFastWebGL } from "@/lib/useFastWebGL";
import { OpticalIllusion } from "../ui/OpticalIllusion";

const Hero = () => {
  const figureRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(true);
  const reduceMotion = usePrefersReducedMotion();
  const fastWebGL = useFastWebGL();
  const [sceneReady, setSceneReady] = useState(false);

  // Stop rendering the scene once it scrolls out of view
  useEffect(() => {
    const figure = figureRef.current;
    if (!figure) return;

    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(figure);
    return () => observer.disconnect();
  }, [fastWebGL]);

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
      {/* Without a GPU the scene would stutter, so it's skipped */}
      {fastWebGL && (
        <figure
          ref={figureRef}
          aria-hidden
          className={`absolute inset-0 -z-50 min-h-[700px] transition-opacity duration-1000 ${
            sceneReady ? "opacity-100" : "opacity-0"
          }`}
        >
          <Canvas
            frameloop={inView ? "always" : "never"}
            orthographic
            // No perspective: the illusion only lines up in a parallel projection
            camera={{ position: [0, 0, -10], zoom: 100, near: 0.1, far: 50 }}
            onCreated={() => setSceneReady(true)}
          >
            <ambientLight intensity={1} />
            {/* Low rotation keeps the illusion intact while the figure floats */}
            <Float
              speed={reduceMotion ? 0 : 1}
              rotationIntensity={reduceMotion ? 0 : 0.15}
              floatIntensity={reduceMotion ? 0 : 1}
            >
              <OpticalIllusion reduceMotion={reduceMotion} />
            </Float>
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
      )}
    </section>
  );
};

export default Hero;
