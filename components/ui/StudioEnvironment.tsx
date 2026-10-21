"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

// With reduced motion, the lights hold still at this angle: one of the best lit, and the
// pose the favicon is rendered from
const STILL_ANGLE = 5.4;

// The grey of the room the figure reflects, lit from the start
const ROOM = 0.3;
// Once the figure has turned, the white strips wait this long, then fade in over FADE
const WAIT = 1.5;
const FADE = 1.5;

const strips = Array.from({ length: 10 }, (_, index) => ({
  angle: (index / 10) * Math.PI * 2,
  height: [1, -1.5, 2.5, 0, -2.5, 1.5, -0.5, 3, -2, 0.5][index],
  tilt: [0.5, -0.3, 0.2, -0.6, 0.35, -0.15, 0.7, -0.45, 0.1, -0.25][index],
  width: index % 2 ? 0.45 : 0.75,
  intensity: index % 2 ? 6 : 11,
}));

// The strips' brightness, then the overhead strip's
const intensities = [...strips.map((strip) => strip.intensity), 12];

/*
 * The lights, turning. The figure is black, so it only shows what it reflects: narrow
 * strips circle it slowly and their reflections sweep across one face after another,
 * which is what makes the black read as metal. Narrow strips rather than broad cards:
 * through a long lens each face sees only a sliver of the room, and a broad card would
 * flood it white in one go, where a strip draws a band that travels across it.
 */
function Rig({ moving, lit }: { moving: boolean; lit: boolean }) {
  const rig = useRef<THREE.Group>(null);
  const lights = useRef<THREE.Mesh[]>([]);
  const sinceLit = useRef(0);
  useFrame(({ clock }, delta) => {
    if (!rig.current) return;
    const time = clock.elapsedTime;
    rig.current.rotation.y = moving ? time * 0.3 : STILL_ANGLE;
    // A slow nod, so the strips also pass over the tops and undersides
    rig.current.rotation.x = moving ? Math.sin(time * 0.21) * 0.45 : 0;

    // The strips are hidden until they're due, then rise from the room's grey to white
    // (eased in and out, so they swell instead of switching on). Starting from the grey
    // rather than black, they never show as dark bands.
    sinceLit.current = lit ? sinceLit.current + delta : 0;
    const level = THREE.MathUtils.clamp((sinceLit.current - WAIT) / FADE, 0, 1);
    const eased = level * level * (3 - 2 * level);
    lights.current.forEach((light, index) => {
      light.visible = level > 0;
      (light.material as THREE.MeshBasicMaterial).color.setScalar(
        ROOM + (intensities[index] - ROOM) * eased,
      );
    });
  });
  return (
    <group ref={rig}>
      {/* Ten tilted strips spread around the room, alternately bright and dim, so a band
          is always crossing some face, whichever way the rig has turned */}
      {strips.map((strip, index) => (
        <Lightformer
          key={index}
          ref={(light: THREE.Mesh | null) => {
            if (light) lights.current[index] = light;
          }}
          form="rect"
          intensity={0}
          visible={false}
          position={[
            Math.sin(strip.angle) * 4.5,
            strip.height,
            Math.cos(strip.angle) * 4.5,
          ]}
          rotation={[0, strip.angle + Math.PI, strip.tilt]}
          scale={[strip.width, 9, 1]}
        />
      ))}
      {/* A horizontal strip overhead, which lights the top edges to white */}
      <Lightformer
        ref={(light: THREE.Mesh | null) => {
          if (light) lights.current[strips.length] = light;
        }}
        form="rect"
        intensity={0}
        visible={false}
        position={[0, 4, -3]}
        rotation-x={-Math.PI / 4}
        scale={[8, 0.7, 1]}
      />
    </group>
  );
}

/**
 * The studio the black metal reflects, re-rendered every frame to follow the turning
 * lights. A faint, even room surrounds it, so no face goes completely dead between the
 * bands. The white strips stay off until `lit`, then fade in.
 */
export function StudioEnvironment({
  moving = true,
  lit = true,
}: {
  moving?: boolean;
  lit?: boolean;
}) {
  return (
    <Environment resolution={128} frames={Infinity}>
      <mesh scale={20}>
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshBasicMaterial
          color={[ROOM, ROOM, ROOM]}
          toneMapped={false}
          side={THREE.BackSide}
        />
      </mesh>
      <mesh scale={20}>
        <sphereGeometry
          args={[1, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]}
        />
        <meshBasicMaterial
          color={[ROOM, ROOM, ROOM]}
          toneMapped={false}
          side={THREE.BackSide}
        />
      </mesh>
      <Rig moving={moving} lit={lit} />
    </Environment>
  );
}
