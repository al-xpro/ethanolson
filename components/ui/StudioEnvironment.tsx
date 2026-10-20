"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// The studio the chrome reflects, painted once on a canvas: a dark room, a ceiling that
// fades into it, and soft lights of different sizes and strengths. Soft edges everywhere,
// so each face of the figure catches a gradient instead of a flat block of white or black.
// With reduced motion, the studio and the lights hold still at this moment (in seconds):
// one of the best lit, and the pose the favicon is rendered from
const STILL_TIME = 9;

function paintStudio() {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d")!;

  // The room: bright ceiling, dark grey walls at eye level, near black floor
  const room = context.createLinearGradient(0, 0, 0, height);
  room.addColorStop(0, "#6e6e6e");
  room.addColorStop(0.25, "#2c2c2c");
  room.addColorStop(0.5, "#141414");
  room.addColorStop(0.75, "#070707");
  room.addColorStop(1, "#020202");
  context.fillStyle = room;
  context.fillRect(0, 0, width, height);

  // A soft light: an ellipse that fades to nothing (x and y in 0–1 of the panorama)
  const light = (x: number, y: number, radiusX: number, radiusY: number, strength: number) => {
    // Drawn three times so lights near the seam wrap around the panorama
    for (const shift of [-1, 0, 1]) {
      context.save();
      context.translate((x + shift) * width, y * height);
      context.scale(radiusX / radiusY, 1);
      const glow = context.createRadialGradient(0, 0, 0, 0, 0, radiusY * height);
      glow.addColorStop(0, `rgba(255,255,255,${strength})`);
      glow.addColorStop(0.35, `rgba(255,255,255,${strength * 0.55})`);
      glow.addColorStop(0.7, `rgba(255,255,255,${strength * 0.15})`);
      glow.addColorStop(1, "rgba(255,255,255,0)");
      context.fillStyle = glow;
      context.beginPath();
      context.arc(0, 0, radiusY * height, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }
  };

  // Tall soft strips around the room, each a different strength: as the studio turns,
  // bright bands sweep across the sides of the figure
  light(0.06, 0.5, 0.035, 0.32, 1);
  light(0.31, 0.47, 0.06, 0.28, 0.5);
  light(0.55, 0.52, 0.025, 0.3, 0.85);
  light(0.78, 0.48, 0.09, 0.26, 0.35);
  // Smaller lights overhead, so the tops get gradients too
  light(0.2, 0.18, 0.14, 0.1, 0.8);
  light(0.62, 0.12, 0.2, 0.08, 0.6);
  light(0.9, 0.24, 0.07, 0.07, 0.7);

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Lights the scene with the painted studio, and turns it slowly, so the reflections keep
 * travelling across every face of the figure. Turning the environment (not re-rendering
 * it) costs nothing per frame.
 */
export function StudioEnvironment({ intensity = 1.3, moving = true }: { intensity?: number; moving?: boolean }) {
  const get = useThree((state) => state.get);
  const texture = useMemo(() => paintStudio(), []);

  useEffect(() => {
    const { scene } = get();
    scene.environment = texture;
    scene.environmentIntensity = intensity;
    return () => {
      scene.environment = null;
      texture.dispose();
    };
  }, [get, texture, intensity]);

  useFrame(({ clock, scene }) => {
    const time = moving ? clock.elapsedTime : STILL_TIME;
    // One turn every ~40 s, with a slow nod, so no two moments light the figure the same way
    scene.environmentRotation.set(Math.sin(time * 0.11) * 0.35, time * 0.16, Math.sin(time * 0.07) * 0.12);
  });

  return null;
}

// Lights close to the figure, unlike the studio (which counts as infinitely far away): their
// reflections fade across each flat face instead of filling it, and as they orbit at their
// own speeds and heights, the highlights keep travelling over the whole figure
const orbits = [
  { radius: 2.6, height: 2.2, speed: 0.23, phase: 0, intensity: 30 },
  { radius: 3, height: 0.4, speed: -0.17, phase: 2.1, intensity: 24 },
  { radius: 2.4, height: -1.4, speed: 0.13, phase: 4.2, intensity: 14 },
];

export function OrbitingLights({ moving = true }: { moving?: boolean }) {
  const lights = useRef<(THREE.PointLight | null)[]>([]);

  useFrame(({ clock }) => {
    const time = moving ? clock.elapsedTime : STILL_TIME;
    orbits.forEach((orbit, index) => {
      const light = lights.current[index];
      if (!light) return;
      const angle = orbit.phase + time * orbit.speed;
      light.position.set(
        Math.cos(angle) * orbit.radius,
        orbit.height + Math.sin(time * 0.31 + orbit.phase) * 0.6,
        Math.sin(angle) * orbit.radius
      );
    });
  });

  return (
    <>
      {orbits.map((orbit, index) => (
        <pointLight
          key={index}
          ref={(light) => {
            lights.current[index] = light;
          }}
          intensity={orbit.intensity}
          decay={2}
          color="#ffffff"
        />
      ))}
    </>
  );
}
