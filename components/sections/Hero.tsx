"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Float, Lightformer } from "@react-three/drei";
import AnimatedHeaderSection from "@/components/ui/AnimatedHeaderSection";
import type { Home } from "@/lib/cms/model";
import { editable } from "@/lib/cms/editable";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";
import { useFastWebGL } from "@/lib/useFastWebGL";
import { OpticalIllusion } from "../ui/OpticalIllusion";

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
            shadows="soft"
            camera={{ position: [0, 0, -10], fov: 17.5, near: 1, far: 20 }}
          >
            {/* Almost no fill: the faces turned away from the light stay deep charcoal */}
            <ambientLight intensity={0.05} />
            {/* Hard key light from above: bright silver tops and a shadow sweeping across the joints */}
            <directionalLight
              position={[1.5, 9, -3]}
              intensity={3.2}
              castShadow
              shadow-mapSize={[2048, 2048]}
              shadow-bias={-0.0004}
              shadow-normalBias={0.02}
              shadow-radius={6}
              shadow-camera-left={-3}
              shadow-camera-right={3}
              shadow-camera-top={3}
              shadow-camera-bottom={-3}
            />
            <Suspense fallback={null}>
              <Float
                speed={reduceMotion ? 0 : 1}
                rotationIntensity={reduceMotion ? 0 : 0.3}
                floatIntensity={reduceMotion ? 0 : 1}
              >
                <OpticalIllusion reduceMotion={reduceMotion} onReady={onFigureReady} />
              </Float>
            </Suspense>
            {/* The studio the chrome mirrors: a dark room, one big softbox overhead, and thin
                strips behind for the crisp highlights that trace the edges */}
            <Environment resolution={512}>
              <color attach="background" args={["#050505"]} />
              {/* Overhead softbox: the bright silver on every face turned up */}
              <Lightformer form="rect" intensity={5} position={[0, 6, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[10, 4, 1]} />
              {/* A ring of tall strips, alternately bright and dim: whichever way a face turns,
                  it mirrors a band of light fading into the dark room, and the edges catch a line */}
              {Array.from({ length: 8 }, (_, index) => {
                const angle = (index / 8) * Math.PI * 2;
                return (
                  <Lightformer
                    key={index}
                    form="rect"
                    intensity={index % 2 ? 0.5 : 1.9}
                    position={[Math.sin(angle) * 6, 1.5, Math.cos(angle) * 6]}
                    rotation={[0, angle + Math.PI, 0]}
                    scale={[0.9, 9, 1]}
                  />
                );
              })}
            </Environment>
          </Canvas>
        </figure>
      )}
    </section>
  );
};

export default Hero;
