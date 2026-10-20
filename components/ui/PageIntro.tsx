import AnimatedHeaderSection from "@/components/ui/AnimatedHeaderSection";
import type { Header } from "@/lib/cms/model";
import { editable } from "@/lib/cms/editable";

// The page-level version of the section headers: an h1, clear of the fixed navbar
export function PageIntro({ header }: { header: Header }) {
  return (
    <div className="pt-14 md:pt-20 xl:pt-[4.5vw]">
      <AnimatedHeaderSection
        subTitle={header.subtitle}
        title={header.title}
        text={header.text}
        textColor="text-white"
        as="h1"
        attrs={editable(header)}
      />
    </div>
  );
}
