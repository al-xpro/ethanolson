"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

// With reduced motion, the lights hold still at this angle: one of the best lit, and the
// pose the favicon is rendered from
const STILL_ANGLE = 1.8;

const strips = Array.from({ length: 10 }, (_, index) => ({
  angle: (index / 10) * Math.PI * 2,
  height: [1, -1.5, 2.5, 0, -2.5, 1.5, -0.5, 3, -2, 0.5][index],
  tilt: [0.5, -0.3, 0.2, -0.6, 0.35, -0.15, 0.7, -0.45, 0.1, -0.25][index],
  width: index % 2 ? 0.45 : 0.75,
  intensity: index % 2 ? 6 : 11,
}));

/*
 * The lights, turning. The figure is black, so it only shows what it reflects: narrow
 * strips circle it slowly and their reflections sweep across one face after another,
 * which is what makes the black read as metal. Narrow strips rather than broad cards:
 * through a long lens each face sees only a sliver of the room, and a broad card would
 * flood it white in one go, where a strip draws a band that travels across it.
 */
function Rig({ moving }: { moving: boolean }) {
  const rig = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!rig.current) return;
    const time = clock.elapsedTime;
    rig.current.rotation.y = moving ? time * 0.3 : STILL_ANGLE;
    // A slow nod, so the strips also pass over the tops and undersides
    rig.current.rotation.x = moving ? Math.sin(time * 0.21) * 0.45 : 0;
  });
  return (
    <group ref={rig}>
      {/* Ten tilted strips spread around the room, alternately bright and dim, so a band
          is always crossing some face, whichever way the rig has turned */}
      {strips.map((strip, index) => (
        <Lightformer
          key={index}
          form="rect"
          intensity={strip.intensity}
          position={[Math.sin(strip.angle) * 4.5, strip.height, Math.cos(strip.angle) * 4.5]}
          rotation={[0, strip.angle + Math.PI, strip.tilt]}
          scale={[strip.width, 9, 1]}
        />
      ))}
      {/* A horizontal strip overhead, which lights the top edges to white */}
      <Lightformer form="rect" intensity={12} position={[0, 4, -3]} rotation-x={-Math.PI / 4} scale={[8, 0.7, 1]} />
    </group>
  );
}

/**
 * The studio the black metal reflects, re-rendered every frame to follow the turning
 * lights. A faint room surrounds it, lighter overhead than underfoot, so no face goes
 * dead between the bands.
 */
export function StudioEnvironment({ moving = true }: { moving?: boolean }) {
  return (
    <Environment resolution={128} frames={Infinity}>
      <mesh scale={20}>
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        {/* Brighter than white (unclipped): black reflects only a few percent of it */}
        <meshBasicMaterial color={[1.2, 1.2, 1.2]} toneMapped={false} side={THREE.BackSide} />
      </mesh>
      <mesh scale={20}>
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshBasicMaterial color={[0.35, 0.35, 0.35]} toneMapped={false} side={THREE.BackSide} />
      </mesh>
      <Rig moving={moving} />
    </Environment>
  );
}
