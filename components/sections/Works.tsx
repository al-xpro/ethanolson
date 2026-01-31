"use client";

import AnimatedHeaderSection from "@/components/ui/AnimatedHeaderSection";
import { WorkParallax } from "../ui/WorkParallax";
import { worksHeader } from "@/lib/data";

const Works = () => {
  return (
    <section id="works" className="relative h-full">
      <AnimatedHeaderSection
        subTitle={worksHeader.subTitle}
        title={worksHeader.title}
        text={worksHeader.text}
        textColor={"text-white"}
        withScrollTrigger={true}
      />
      <WorkParallax />
    </section>
  );
};

export default Works;
