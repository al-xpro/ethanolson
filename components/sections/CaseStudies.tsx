import { StickyScrollRevealSmall } from "../ui/StickyScrollRevealSmall";
import { StickyScrollRevealLarge } from "../ui/StickyScrollRevealLarge";
import { CaseStudiesContent } from "@/lib/data";



export default function CaseStudies() {
  return (
    <section id="case studies" className="min-h-screen">
      <div className="block md:hidden">
        <StickyScrollRevealSmall content={CaseStudiesContent} />
      </div>
      <div className="hidden md:block">
        <StickyScrollRevealLarge content={CaseStudiesContent} />
      </div>
    </section>
  );
}
