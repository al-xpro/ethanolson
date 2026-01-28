"use client";

import AnimatedHeaderSection from "@/components/ui/AnimatedHeaderSection";
import { WorkParallax } from "./WorkParallax";

const Works = () => {
  return (
    <section id="works" className="h-full">
      {/* this is for the navbar */}
      <AnimatedHeaderSection
        subTitle={"My recent works"}
        title={"Works"}
        text={`Projects that I've worked on over the years, 
        showcasing my skills and expertise
        in design and development.

`}
        textColor={"text-white"}
        withScrollTrigger={true}
      />
      <WorkParallax />
    </section>
  );
};

export default Works;
