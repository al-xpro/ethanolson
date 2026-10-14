import SmoothScroll from "@/components/providers/SmoothScroll";
import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import ZoomParallax from "@/components/sections/ZoomParallax";
import { IntroParallax } from "@/components/sections/IntroParallax";
import Services from "@/components/sections/Services";
import Works from "@/components/sections/Works";
import { MiddleParallax } from "@/components/sections/MiddleParallax";
import OutroParallax from "@/components/sections/OutroParallax";
import Contact from "@/components/sections/Contact";
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
    <SmoothScroll>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Navbar />
      <main className="relative w-full min-h-screen">
        <Hero />
        <ZoomParallax />
        <IntroParallax />
        <Services />
        <Works />
        <MiddleParallax />
        <OutroParallax />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
