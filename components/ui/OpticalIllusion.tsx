"use client";

import { JSX, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";

// Modified version of "Optical Illusions" by Johannes R. (CC BY 4.0), see CREDITS.md
const MODEL = "/models/optical-illusion.glb";

// Fine speckle for the roughness: a few very smooth flecks catch the light, the rest stays
// rough and swallows it
function glitterMap() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const context = canvas.getContext("2d")!;
  context.fillStyle = "#6b6b6b";
  context.fillRect(0, 0, size, size);
  for (let index = 0; index < 9000; index++) {
    const bright = Math.random();
    const dot = bright > 0.94 ? 2 : 1;
    context.fillStyle = bright > 0.94 ? "#0d0d0d" : bright > 0.7 ? "#3a3a3a" : "#8a8a8a";
    context.fillRect(Math.random() * size, Math.random() * size, dot, dot);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}

const START_ROTATION = { x: -1.2, y: 0.8, z: 0.4 };
const FINAL_ROTATION = { x: -0.6, y: 2.5, z: 0.05 };

export function OpticalIllusion({
  reduceMotion = false,
  onReady,
  onTurned,
  ...props
}: JSX.IntrinsicElements["group"] & { reduceMotion?: boolean; onReady?: () => void; onTurned?: () => void }) {
  const container = useRef<THREE.Group>(null);
  // The model isn't compressed: no Draco or meshopt decoders (meshopt compiles WebAssembly)
  const { scene } = useGLTF(MODEL, false, false);

  const { viewport } = useThree();
  // At full size the figure spans about 2.6 × 3 scene units, float and rotation included.
  // It's fitted into the area left for it: the lower 55% of portrait screens (under the
  // hero text), or 86% of the height elsewhere, so it never touches the edges.
  const portrait = viewport.aspect < 1;
  const area = portrait
    ? { width: viewport.width * 0.92, height: viewport.height * 0.55 }
    : { width: viewport.width * 0.9, height: viewport.height * 0.86 };
  const fit = Math.min(1, area.width / 2.6, area.height / 3);
  const offsetY = portrait ? -viewport.height * 0.2 : 0;

  const glitter = useMemo(() => glitterMap(), []);

  // Black epoxy with a fine glitter: a black base, slightly metallic, whose roughness map
  // breaks the reflections into points, so the turning studio lights catch along the edges
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#000000",
        metalness: 0.55,
        roughness: 0.3,
        roughnessMap: glitter,
      }),
    [glitter]
  );

  useEffect(
    () => () => {
      material.dispose();
      glitter.dispose();
    },
    [material, glitter]
  );

  useLayoutEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) (child as THREE.Mesh).material = material;
    });
    scene.scale.setScalar(0.5);
    scene.position.set(0, -1.23, 0.6);
  }, [scene, material]);

  // Turn into place once the model is ready
  useEffect(() => {
    const group = container.current;
    if (!group) return;
    onReady?.();

    if (reduceMotion) {
      group.rotation.set(FINAL_ROTATION.x, FINAL_ROTATION.y, FINAL_ROTATION.z);
      onTurned?.();
      return;
    }

    const tween = gsap.fromTo(group.rotation, START_ROTATION, {
      ...FINAL_ROTATION,
      duration: 2.2,
      ease: "expo.out",
      // The studio lights come up once the figure has settled
      onComplete: () => onTurned?.(),
    });
    return () => {
      tween.kill();
    };
  }, [reduceMotion, onReady, onTurned]);

  return (
    <group
      ref={container}
      scale={fit}
      position={[0, offsetY, 0]}
      {...props}
      dispose={null}
      rotation={[START_ROTATION.x, START_ROTATION.y, START_ROTATION.z]}
    >
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(MODEL, false, false);
