"use client";

import AnimatedHeaderSection from "@/components/ui/AnimatedHeaderSection";
import { WorkParallax } from "../ui/WorkParallax";
import { PillLink } from "@/components/ui/PillLink";
import type { Home } from "@/lib/cms/model";
import type { WorkEntry } from "@/lib/cms/types";
import { editable } from "@/lib/cms/editable";

const Works = ({ content, works }: { content: Home["works"]; works: WorkEntry[] }) => {
  return (
    <section id="works" {...editable(content)} className="relative h-full">
      <AnimatedHeaderSection
        subTitle={content.header.subtitle}
        title={content.header.title}
        text={content.header.text}
        textColor={"text-white"}
        withScrollTrigger={true}
        attrs={editable(content.header)}
      />
      <WorkParallax works={works} />
      <div className="flex justify-center py-16 xl:py-[4vw]">
        <PillLink href="/works">{content.ctaLabel} →</PillLink>
      </div>
    </section>
  );
};

export default Works;
