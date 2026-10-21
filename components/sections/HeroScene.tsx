"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { OpticalIllusion } from "../ui/OpticalIllusion";
import { StudioEnvironment } from "../ui/StudioEnvironment";

/**
 * The hero's 3D figure. It lives in its own file so three.js loads after the page is up
 * (see Hero): the heading and the rest of the page don't wait for it.
 */
export default function HeroScene({
  inView,
  reduceMotion,
  lit,
  onReady,
  onTurned,
}: {
  inView: boolean;
  reduceMotion: boolean;
  lit: boolean;
  onReady: () => void;
  onTurned: () => void;
}) {
  return (
    <Canvas
      frameloop={inView ? "always" : "never"}
      // Retina screens would render 4× the pixels at full density; 1.5× still looks sharp
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, -10], fov: 17.5, near: 1, far: 20 }}
    >
      <ambientLight intensity={1} />
      {/* The black metal is lit by what it reflects: a studio whose lights keep turning */}
      <StudioEnvironment moving={!reduceMotion} lit={lit} />
      <Suspense fallback={null}>
        <Float
          speed={reduceMotion ? 0 : 1}
          rotationIntensity={reduceMotion ? 0 : 0.3}
          floatIntensity={reduceMotion ? 0 : 1}
        >
          <OpticalIllusion reduceMotion={reduceMotion} onReady={onReady} onTurned={onTurned} />
        </Float>
      </Suspense>
    </Canvas>
  );
}
