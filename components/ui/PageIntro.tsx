import AnimatedHeaderSection from "@/components/ui/AnimatedHeaderSection";
import type { SectionHeader } from "@/content/sections";

// The page-level version of the section headers: an h1, clear of the fixed navbar
export function PageIntro({ header }: { header: SectionHeader }) {
  return (
    <div className="pt-14 md:pt-20 xl:pt-[4.5vw]">
      <AnimatedHeaderSection
        subTitle={header.subTitle}
        title={header.title}
        text={header.text}
        textColor="text-white"
        as="h1"
      />
    </div>
  );
}
