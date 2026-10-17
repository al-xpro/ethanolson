"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
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
  const onFigureReady = useCallback(() => setSceneReady(true), []);

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
      className="relative flex flex-col min-h-[max(100svh,320px)] w-full justify-start overflow-hidden pt-14 md:pt-20 xl:pt-[4.5vw]"
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
          className={`absolute inset-0 -z-50 transition-opacity duration-1000 ${
            sceneReady ? "opacity-100" : "opacity-0"
          }`}
        >
          <Canvas
            frameloop={inView ? "always" : "never"}
            camera={{ position: [0, 0, -10], fov: 17.5, near: 1, far: 20 }}
          >
            <ambientLight intensity={0.4} />
            <Suspense fallback={null}>
              <Float
                speed={reduceMotion ? 0 : 1}
                rotationIntensity={reduceMotion ? 0 : 1}
                floatIntensity={reduceMotion ? 0 : 1}
              >
                <OpticalIllusion reduceMotion={reduceMotion} onReady={onFigureReady} />
              </Float>
            </Suspense>
            {/* Key and rim lights: soft white gradients across the metal faces */}
            <directionalLight position={[-4, 6, -8]} intensity={9} />
            <directionalLight position={[6, -2, -6]} intensity={3} />
            {/* Studio strips: sharp white reflections on the edges */}
            <Environment resolution={512}>
              <group rotation={[0, 0, 0]}>
                <Lightformer form="rect" intensity={16} position={[0, 5, 0]} scale={[10, 2, 0]} />
                <Lightformer
                  form="rect"
                  intensity={6}
                  position={[-5, 0, 0]}
                  rotation={[0, Math.PI / 2, 0]}
                  scale={[10, 2, 0]}
                />
                <Lightformer
                  form="rect"
                  intensity={6}
                  position={[5, 0, 0]}
                  rotation={[0, -Math.PI / 2, 0]}
                  scale={[10, 2, 0]}
                />
                <Lightformer form="circle" intensity={4} position={[0, 0, -2]} scale={5} />
                {/* Front strip, on the camera side */}
                <Lightformer form="rect" intensity={10} position={[1, 2, -6]} scale={[6, 1.2, 1]} />
              </group>
            </Environment>
          </Canvas>
        </figure>
      )}
    </section>
  );
};

export default Hero;
