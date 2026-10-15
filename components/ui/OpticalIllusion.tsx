"use client";

import { JSX, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { gsap } from "@/lib/gsap";

// A Penrose triangle: three perpendicular beams that only look like a closed triangle
// when viewed along the (1, 1, 1) diagonal. The third beam is one block short, and from
// that angle the first beam's end fills the gap.
const LENGTH = 5;
const VIEW_DIRECTION = new THREE.Vector3(1, 1, 1).normalize();

const beams: { size: [number, number, number]; center: [number, number, number] }[] = [
  { size: [LENGTH, 1, 1], center: [LENGTH / 2, 0.5, 0.5] },
  { size: [1, LENGTH - 1, 1], center: [LENGTH - 0.5, (LENGTH + 1) / 2, 0.5] },
  { size: [1, 1, LENGTH - 2], center: [LENGTH - 0.5, LENGTH - 0.5, LENGTH / 2] },
];

// Centroid of the three corner blocks, so the visible triangle is centered
const CENTER: [number, number, number] = [-(2 * LENGTH - 0.5) / 3, -(LENGTH + 0.5) / 3, -0.5];

const START_ROTATION = { x: -1.2, y: 0.8, z: 0.4 };

// Turns the figure so its illusion diagonal points at a camera on the -z side,
// with the first beam lying horizontally on screen and the triangle pointing up.
function illusionQuaternion() {
  const toCamera = new THREE.Quaternion().setFromUnitVectors(
    VIEW_DIRECTION,
    new THREE.Vector3(0, 0, -1)
  );
  const firstBeam = new THREE.Vector3(1, 0, 0).applyQuaternion(toCamera);
  const roll = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 0, 1),
    Math.PI - Math.atan2(firstBeam.y, firstBeam.x)
  );
  return roll.multiply(toCamera);
}

const ORIENTATION = illusionQuaternion();

export function OpticalIllusion({
  reduceMotion = false,
  ...props
}: JSX.IntrinsicElements["group"] & { reduceMotion?: boolean }) {
  const container = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  // Sized and placed relative to the viewport, so it works for any camera zoom
  const scale = Math.min(viewport.height * 0.11, viewport.width * 0.15);
  const wide = viewport.aspect > 1;
  // The camera looks along +z, so screen-right is world -x
  const offsetX = wide ? -viewport.width * 0.12 : 0;
  const offsetY = wide ? -viewport.height * 0.05 : -viewport.height * 0.2;

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#2B2B2B",
        metalness: 1,
        roughness: 0.25,
        clearcoat: 0.1,
        clearcoatRoughness: 0.1,
        envMapIntensity: 2.2,
      }),
    []
  );

  useEffect(() => () => material.dispose(), [material]);

  // Rotate into the one angle where the triangle closes
  useEffect(() => {
    const group = container.current;
    if (!group) return;

    if (reduceMotion) {
      group.rotation.set(0, 0, 0);
      return;
    }

    const tween = gsap.fromTo(group.rotation, START_ROTATION, {
      x: 0,
      y: 0,
      z: 0,
      duration: 2.4,
      ease: "expo.out",
    });
    return () => {
      tween.kill();
    };
  }, [reduceMotion]);

  return (
    <group
      ref={container}
      position={[offsetX, offsetY, 0]}
      scale={scale}
      {...props}
      rotation={[START_ROTATION.x, START_ROTATION.y, START_ROTATION.z]}
    >
      <group quaternion={ORIENTATION}>
        <group position={CENTER}>
          {beams.map(({ size, center }, index) => (
            <mesh key={index} position={center} material={material}>
              <boxGeometry args={size} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}
