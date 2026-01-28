"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import ReactLenis from "lenis/react";
import About from "@/components/sections/About";
import Works from "@/components/sections/Works";
import { IntroParallax } from "@/components/sections/IntroParallax";
import Contact from "@/components/sections/Contact";
import { useProgress } from "@react-three/drei";
import CaseStudies from "@/components/sections/CaseStudies";
import ImageParallax from "@/components/sections/ImageParallax";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ZoomParallax from "@/components/sections/ZoomParallax";
import MiddleParallax from "@/components/sections/MiddleParallax";
import Testimonials from "@/components/sections/Testimonials";

export default function Home() {
  const { progress } = useProgress();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (progress === 100) {
      setIsReady(true);
    }
  }, [progress]);

  ScrollTrigger.config({
    ignoreMobileResize: true, // Prevents jumps when mobile address bar shows/hides
  });

  return (
    <ReactLenis root className="relative w-screen min-h-screen overflow-x-auto">
      {!isReady && (
        <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black text-white transition-opacity duration-700 font-light">
          <p className="mb-4 text-4xl tracking-widest animate-pulse">
            Loading {Math.floor(progress)}%
          </p>
        </div>
      )}
      <div className={`${isReady ? "opacity-100" : "opacity-0"} transition-opacity duration-1000`}>
        <Navbar />
        <Hero />
        <ZoomParallax />
        <IntroParallax />
        <Services />
        <About />
        <Works />
        <CaseStudies />
        <MiddleParallax />
        <Testimonials />
        <ImageParallax />
        <Contact />
      </div>
    </ReactLenis>
  );
}
