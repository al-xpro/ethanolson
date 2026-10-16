"use client";

import { JSX, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { gsap } from "@/lib/gsap";

// An impossible cube (after Escher): a cube frame where one back edge appears to pass in
// front of a front edge. Seen from VIEW, the front-right edge crosses the back-bottom edge.
// The part of the front edge around that crossing is pushed straight back along VIEW,
// behind the back edge. In a parallel projection that move is invisible, so the frame
// still looks continuous, but the crossing is now the wrong way round.
const HALF = 2;
const THICKNESS = 0.6;
const VIEW = new THREE.Vector3(0.55, 0.45, 1).normalize();

type Beam = { size: [number, number, number]; position: [number, number, number] };

function impossibleCube(): Beam[] {
  const full = 2 * HALF + THICKNESS;
  const inner = 2 * HALF - THICKNESS;
  const beams: Beam[] = [];

  // Edges along x own the corners, so beams never overlap
  for (const y of [-HALF, HALF])
    for (const z of [-HALF, HALF]) beams.push({ size: [full, THICKNESS, THICKNESS], position: [0, y, z] });
  for (const x of [-HALF, HALF])
    for (const y of [-HALF, HALF]) beams.push({ size: [THICKNESS, THICKNESS, inner], position: [x, y, 0] });
  for (const z of [-HALF, HALF]) beams.push({ size: [THICKNESS, inner, THICKNESS], position: [-HALF, 0, z] });
  beams.push({ size: [THICKNESS, inner, THICKNESS], position: [HALF, 0, -HALF] });

  // Where the front-right edge (x = HALF, z = HALF) crosses the back-bottom edge
  // (y = -HALF, z = -HALF) on screen: the two points differ by exactly `depth` along VIEW.
  const depth = (2 * HALF) / VIEW.z;
  const crossingY = -HALF + depth * VIEW.y;
  const splitY = crossingY + THICKNESS * 1.5;
  const bottom = -HALF + THICKNESS / 2;
  const top = HALF - THICKNESS / 2;

  // Upper part of the front-right edge stays at the front
  beams.push({
    size: [THICKNESS, top - splitY, THICKNESS],
    position: [HALF, (top + splitY) / 2, HALF],
  });

  // Lower part, moved behind the back edge along the line of sight
  const behind = VIEW.clone().multiplyScalar(-(depth + 2 * THICKNESS));
  beams.push({
    size: [THICKNESS, splitY - bottom, THICKNESS],
    position: [HALF + behind.x, (splitY + bottom) / 2 + behind.y, HALF + behind.z],
  });

  return beams;
}

const BEAMS = impossibleCube();

const START_ROTATION = { x: -1.2, y: 0.8, z: 0.4 };

// Turns the figure so VIEW points at a camera on the -z side, with the cube upright.
function illusionQuaternion() {
  const toCamera = new THREE.Quaternion().setFromUnitVectors(VIEW, new THREE.Vector3(0, 0, -1));
  const up = new THREE.Vector3(0, 1, 0).applyQuaternion(toCamera);
  const roll = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 0, 1),
    Math.atan2(up.x, up.y)
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
  const scale = Math.min(viewport.height * 0.085, viewport.width * 0.13);
  const wide = viewport.aspect > 1;
  // The camera looks along +z, so screen-right is world -x
  const offsetX = wide ? -viewport.width * 0.12 : 0;
  const offsetY = wide ? -viewport.height * 0.05 : -viewport.height * 0.2;

  // One tone per face direction (like an Escher drawing), so every crossing reads clearly.
  // Box faces are ordered +x, -x, +y, -y, +z, -z.
  const materials = useMemo(() => {
    const tone = (color: string) =>
      new THREE.MeshStandardMaterial({ color, metalness: 0.35, roughness: 0.45, envMapIntensity: 1.2 });
    const side = tone("#6E6E6E");
    const top = tone("#B4B4B4");
    const front = tone("#2E2E2E");
    return [side, side, top, top, front, front];
  }, []);

  useEffect(() => () => new Set(materials).forEach((material) => material.dispose()), [materials]);

  // Rotate into the one angle where the cube becomes impossible
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
        {BEAMS.map(({ size, position }, index) => (
          <mesh key={index} position={position} material={materials}>
            <boxGeometry args={size} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
