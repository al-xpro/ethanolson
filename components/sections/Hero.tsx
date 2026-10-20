"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import AnimatedHeaderSection from "@/components/ui/AnimatedHeaderSection";
import type { Home } from "@/lib/cms/model";
import { editable } from "@/lib/cms/editable";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";
import { useFastWebGL } from "@/lib/useFastWebGL";
import { OpticalIllusion } from "../ui/OpticalIllusion";
import { OrbitingLights, StudioEnvironment } from "../ui/StudioEnvironment";

const Hero = ({ content }: { content: Home["hero"] }) => {
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
      {...editable(content)}
      className="relative flex flex-col min-h-[max(100svh,320px)] w-full justify-start overflow-hidden pt-14 md:pt-20 xl:pt-[4.5vw]"
    >
      <AnimatedHeaderSection
        subTitle={content.header.subtitle}
        title={content.header.title}
        text={content.header.text}
        textColor={"text-white"}
        as="h1"
        attrs={editable(content.header)}
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
            // Retina screens would render 4× the pixels at full density; 1.5× still looks sharp
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, -10], fov: 17.5, near: 1, far: 20 }}
          >
            {/* The chrome is lit by what it reflects: a dark studio that keeps turning, and
                lights that orbit close to it */}
            <StudioEnvironment moving={!reduceMotion} />
            <OrbitingLights moving={!reduceMotion} />
            <Suspense fallback={null}>
              <Float
                speed={reduceMotion ? 0 : 1}
                rotationIntensity={reduceMotion ? 0 : 0.3}
                floatIntensity={reduceMotion ? 0 : 1}
              >
                <OpticalIllusion reduceMotion={reduceMotion} onReady={onFigureReady} />
              </Float>
            </Suspense>
          </Canvas>
        </figure>
      )}
    </section>
  );
};

export default Hero;
