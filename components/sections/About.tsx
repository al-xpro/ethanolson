import { useRef } from "react";
import AnimatedHeaderSection from "@/components/ui/AnimatedHeaderSection";
import { AnimatedTextLines } from "@/components/ui/AnimatedTextLines";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const About = () => {
  const text = `I love designing and coding for the web,
    and I'm obsessed with minimalist,
    pixel-perfect user interfaces.`;
  const aboutText = `- Team Player
  - Problem Solver
    - Detail-oriented
    - Passionate about design
    - Adaptable and quick learner`;
  const imgRef = useRef(null);
  useGSAP(() => {
    gsap.to("#about", {
      scale: 0.95,
      scrollTrigger: {
        trigger: "#about",
        start: "bottom 80%",
        end: "bottom 20%",
        scrub: true,
        markers: false,
      },
      ease: "power1.inOut",
    });

    gsap.set(imgRef.current, {
      clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)",
    });
    gsap.to(imgRef.current, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 2,
      ease: "power4.out",
      scrollTrigger: { trigger: imgRef.current },
    });
  });
  return (
    <section id="about" className="min-h-screen bg-black rounded-b-4xl">
      <AnimatedHeaderSection
        subTitle={"Who I Am"}
        title={"About"}
        text={text}
        textColor={"text-white"}
        withScrollTrigger={true}
      />
      <div className="flex flex-col w-full h-full items-center justify-between gap-16 px-10 pb-16 text-xl font-light tracking-wide lg:flex-row md:text-2xl lg:text-3xl text-white/60">
        <div className="flex items-center justify-center w-full md:w-1/2 h-full">
          <img ref={imgRef} src="images/man.png" alt="man" className="w-full rounded-3xl" />
        </div>
        <div className="flex w-full md:w-1/2 items-center justify-center h-full">
          <AnimatedTextLines text={aboutText} className={"w-full"} />
        </div>
      </div>
    </section>
  );
};

export default About;
