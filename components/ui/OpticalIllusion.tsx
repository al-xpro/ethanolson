"use client";

import { JSX, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";

// Modified version of "Optical Illusions" by Johannes R. (CC BY 4.0), see CREDITS.md
const MODEL = "/models/optical-illusion.glb";

const START_ROTATION = { x: -1.2, y: 0.8, z: 0.4 };
const FINAL_ROTATION = { x: -0.6, y: 2.5, z: 0.05 };

export function OpticalIllusion({
  reduceMotion = false,
  onReady,
  ...props
}: JSX.IntrinsicElements["group"] & { reduceMotion?: boolean; onReady?: () => void }) {
  const container = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL);

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

  // The original iron: near-black, polished, so the studio strips draw sharp white
  // reflections on the edges (the material of the first version of the hero)
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#2B2B2B",
        metalness: 1,
        roughness: 0.2,
        clearcoat: 0.1,
        clearcoatRoughness: 0.1,
        envMapIntensity: 2.2,
      }),
    []
  );

  useEffect(() => () => material.dispose(), [material]);

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
      return;
    }

    const tween = gsap.fromTo(group.rotation, START_ROTATION, {
      ...FINAL_ROTATION,
      duration: 2.2,
      ease: "expo.out",
    });
    return () => {
      tween.kill();
    };
  }, [reduceMotion, onReady]);

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

useGLTF.preload(MODEL);
