"use client";

import { JSX, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useGLTF, useProgress } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";

const FINAL_ROTATION = { x: -0.6, y: 2.5, z: 0.05 };

export function ObjectIllusionHero({
  reduceMotion = false,
  ...props
}: JSX.IntrinsicElements["group"] & { reduceMotion?: boolean }) {
  const container = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/Figure.glb");
  const { progress } = useProgress();

  const ironMaterial = useMemo(
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

  useEffect(() => () => ironMaterial.dispose(), [ironMaterial]);

  useLayoutEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = ironMaterial;
      }
    });

    scene.scale.setScalar(0.5);
    scene.position.set(0, -1.23, 0.6);
  }, [scene, ironMaterial]);

  // --- Animate ONLY when fully loaded ---
  useEffect(() => {
    const group = container.current;
    if (!group || progress < 100) return;

    if (reduceMotion) {
      group.rotation.set(FINAL_ROTATION.x, FINAL_ROTATION.y, FINAL_ROTATION.z);
      return;
    }

    const tween = gsap.fromTo(
      group.rotation,
      {
        x: -1.2,
        y: 0.8,
        z: 0.4,
      },
      {
        ...FINAL_ROTATION,
        duration: 2.2,
        ease: "expo.out",
      }
    );
    return () => {
      tween.kill();
    };
  }, [progress, reduceMotion]);

  return (
    <group ref={container} {...props} dispose={null} rotation={[-1.2, 0.8, 0.4]}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/Figure.glb");
