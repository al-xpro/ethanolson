"use client";

import AnimatedHeaderSection from "@/components/ui/AnimatedHeaderSection";
import { WorkParallax } from "../ui/WorkParallax";
import { worksHeader } from "@/content/sections";
import { PillLink } from "@/components/ui/PillLink";

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
      <div className="flex justify-center py-16 xl:py-[4vw]">
        <PillLink href="/works">See all works →</PillLink>
      </div>
    </section>
  );
};

export default Works;
