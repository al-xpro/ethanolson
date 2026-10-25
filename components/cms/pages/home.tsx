import Hero from "@/components/sections/Hero";
import ZoomParallax from "@/components/sections/ZoomParallax";
import { IntroParallax } from "@/components/sections/IntroParallax";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Works from "@/components/sections/Works";
import { MiddleParallax } from "@/components/sections/MiddleParallax";
import Testimonials from "@/components/sections/Testimonials";
import OutroParallax from "@/components/sections/OutroParallax";
import type { Home } from "@/lib/cms/model";
import type { WorkEntry } from "@/lib/cms/types";

export function HomePage({ content, works }: { content: Home; works: WorkEntry[] }) {
  return (
    <>
      <Hero content={content.hero} />
      <ZoomParallax content={content.zoom} />
      <IntroParallax content={content.intro} />
      <About content={content.about} />
      <Services content={content.services} />
      <Works content={content.works} works={works} />
      <MiddleParallax content={content.middle} />
      <Testimonials content={content.testimonials} />
      <OutroParallax content={content.outro} />
    </>
  );
}
