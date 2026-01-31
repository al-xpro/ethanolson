"use client";

import { JSX, useEffect, useRef } from "react";
import { useGLTF, useProgress } from "@react-three/drei";
import gsap from "gsap";
import * as THREE from "three";

export function ObjectIllusionContact(props: JSX.IntrinsicElements["group"]) {
  const container = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/mac.glb");
  const { progress } = useProgress();

  // Create the sleek dark material
  const ironMaterial = new THREE.MeshPhysicalMaterial({
    color: "#2B2B2B",
    metalness: 1,
    roughness: 0.5,
    reflectivity: 20,
    clearcoat: 0.1,
    clearcoatRoughness: 0.1,
    envMapIntensity: 2.2,
  });

  // Apply material
  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      mesh.material = ironMaterial;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
  });

  // Initial positioning
  scene.scale.setScalar(20.5);
  scene.position.set(0, -5.0, 0.6);

  // --- Animate ONLY when fully loaded ---
  useEffect(() => {
    if (!container.current || progress < 100) return;

    gsap.fromTo(
      container.current.rotation,
      {
        x: -1.2,
        y: 0.8,
        z: 0.4,
      },
      {
        x: -0.1,
        y: 0, 
        z: 0,
        duration: 2.2,
        ease: "expo.out",
      }
    );
  }, [progress]);

  return (
    <group
      ref={container}
      {...props}
      dispose={null}
      rotation={[-1.2, 0.8, 0.4]} 
    >
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/mac.glb");