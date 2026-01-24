import { Canvas } from "@react-three/fiber";
import { Environment, Float, Lightformer } from "@react-three/drei";
import AnimatedHeaderSection from "@/components/ui/AnimatedHeaderSection";
import { heroData } from "@/lib/data";
import { ObjectIllusion } from "../ui/ObjectIllustion";

const Hero = () => {
  return (
    <section id="home" className="flex flex-col justify-start min-h-screen">
      <AnimatedHeaderSection
        subTitle={heroData.subTitle}
        title={heroData.title}
        text={heroData.text}
        textColor={"text-white"}
      />
      <figure className="absolute inset-0 -z-50 min-h-[700px]">
        <Canvas shadows camera={{ position: [0, 0, -10], fov: 17.5, near: 1, far: 20 }}>
          <ambientLight intensity={1} />
          <Float speed={1} rotationIntensity={1} floatIntensity={1}>
            <ObjectIllusion />
          </Float>
          <Environment resolution={512}>
            <group rotation={[0, 0, 0]}>
              {/* Top strip light */}
              <Lightformer form="rect" intensity={10} position={[0, 5, 0]} scale={[10, 2, 0]} />

              {/* Left vertical strip */}
              <Lightformer
                form="rect"
                intensity={6}
                position={[-5, 0, 0]}
                rotation={[0, Math.PI / 2, 0]}
                scale={[10, 2, 0]}
              />

              {/* Right vertical strip */}
              <Lightformer
                form="rect"
                intensity={6}
                position={[5, 0, 0]}
                rotation={[0, -Math.PI / 2, 0]}
                scale={[10, 2, 0]}
              />

              {/* Back kicker */}
              <Lightformer form="circle" intensity={4} position={[0, 0, -5]} scale={5} />
            </group>
          </Environment>
        </Canvas>
      </figure>
    </section>
  );
};

export default Hero;
