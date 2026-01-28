import { useEffect, useRef, useState } from "react";
import { useGLTF, Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Model({ mouse }: { mouse: { x: number; y: number } }) {
  const [activeShape, setActiveShape] = useState(1);
  const { nodes } = useGLTF("/models/procedural-abstract-shape.glb");

  useEffect(() => {
    const id = setInterval(() => {
      setActiveShape((prev) => (prev === 11 ? 1 : prev + 1));
    }, 2000);

    return () => clearInterval(id);
  }, []);

  return (
    <group>
      {Object.values(nodes)
        .filter((node) => node.type === "Mesh")
        .map((node, index) => (
          <Mesh
            key={node.name}
            node={node}
            multiplier={index + 1}
            mouse={mouse}
            isActive={activeShape === index + 1}
          />
        ))}
    </group>
  );
}

useGLTF.preload("/models/procedural-abstract-shape.glb");

function Mesh({
  node,
  multiplier,
  mouse,
  isActive,
}: {
  node: any;
  multiplier: number;
  mouse: { x: number; y: number };
  isActive: boolean;
}) {
  const mesh = useRef<THREE.Mesh>(null!);

  const basePosition = new THREE.Vector3(...node.position);
  const baseRotation = new THREE.Euler(...node.rotation);

  const strength = multiplier * 2;
  const rotStrength = multiplier / 2;

  useFrame(() => {
    if (!mesh.current) return;

    // Mouse → normalized [-1, 1]
    const mx = (mouse.x.get() - 0.5) * 2;
    const my = (mouse.y.get() - 0.5) * 2;

    // POSITION PARALLAX
    mesh.current.position.x = THREE.MathUtils.lerp(
      mesh.current.position.x,
      basePosition.x + mx * strength,
      0.08
    );

    mesh.current.position.y = THREE.MathUtils.lerp(
      mesh.current.position.y,
      basePosition.y - my * strength,
      0.08
    );

    // ROTATION PARALLAX
    mesh.current.rotation.x = THREE.MathUtils.lerp(
      mesh.current.rotation.x,
      baseRotation.x + my * rotStrength,
      0.08
    );

    mesh.current.rotation.y = THREE.MathUtils.lerp(
      mesh.current.rotation.y,
      baseRotation.y + mx * rotStrength,
      0.08
    );

    // ACTIVE SHAPE PULSE
    if (isActive) {
      mesh.current.rotation.z += 0.01;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh
        ref={mesh}
        geometry={node.geometry}
        material={node.material}
        position={node.position}
        rotation={node.rotation}
        scale={node.scale}
        castShadow
        receiveShadow
      />
    </Float>
  );
}
