import Hero from "@/components/sections/Hero";
import ZoomParallax from "@/components/sections/ZoomParallax";
import { IntroParallax } from "@/components/sections/IntroParallax";
import Services from "@/components/sections/Services";
import Works from "@/components/sections/Works";
import { MiddleParallax } from "@/components/sections/MiddleParallax";
import OutroParallax from "@/components/sections/OutroParallax";
import Testimonials from "@/components/sections/Testimonials";
import About from "@/components/sections/About";
import { site } from "@/content/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.title,
  url: site.url,
  description: site.description,
  creator: {
    "@type": "Person",
    name: site.creator.name,
    url: site.creator.url,
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero />
      <ZoomParallax />
      <IntroParallax />
      <About />
      <Services />
      <Works />
      <MiddleParallax />
      <Testimonials />
      <OutroParallax />
    </>
  );
}
