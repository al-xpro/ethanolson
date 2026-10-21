"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import AnimatedHeaderSection from "@/components/ui/AnimatedHeaderSection";
import type { Home } from "@/lib/cms/model";
import { editable } from "@/lib/cms/editable";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";
import { useFastWebGL } from "@/lib/useFastWebGL";

// three.js is most of the page's JavaScript: it loads on its own, after the page is up
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

const Hero = ({ content }: { content: Home["hero"] }) => {
  const figureRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(true);
  const reduceMotion = usePrefersReducedMotion();
  const fastWebGL = useFastWebGL();
  const [sceneReady, setSceneReady] = useState(false);
  const onFigureReady = useCallback(() => setSceneReady(true), []);
  // The figure turns into place in the dark; the lights come up once it settles
  const [lit, setLit] = useState(false);
  const onFigureTurned = useCallback(() => setLit(true), []);
  // The scene loads once the page has finished loading and the browser is idle, so the
  // heading (the largest thing on screen) never waits for three.js
  const [loadScene, setLoadScene] = useState(false);

  useEffect(() => {
    if (!fastWebGL) return;
    let cancel = () => {};
    const start = () => {
      const show = () => setLoadScene(true);
      // Safari before 18 has no requestIdleCallback
      if (typeof window.requestIdleCallback === "function") {
        const id = window.requestIdleCallback(show, { timeout: 2000 });
        cancel = () => window.cancelIdleCallback(id);
      } else {
        const id = window.setTimeout(show, 200);
        cancel = () => window.clearTimeout(id);
      }
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      cancel();
    };
  }, [fastWebGL]);

  // Stop rendering the scene once it scrolls out of view
  useEffect(() => {
    const figure = figureRef.current;
    if (!figure) return;

    const observer = new IntersectionObserver(([entry]) =>
      setInView(entry.isIntersecting),
    );
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
          {loadScene && (
            <HeroScene
              inView={inView}
              reduceMotion={reduceMotion}
              lit={lit}
              onReady={onFigureReady}
              onTurned={onFigureTurned}
            />
          )}
        </figure>
      )}
    </section>
  );
};

export default Hero;
