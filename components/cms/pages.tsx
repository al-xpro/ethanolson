import Hero from "@/components/sections/Hero";
import ZoomParallax from "@/components/sections/ZoomParallax";
import { IntroParallax } from "@/components/sections/IntroParallax";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Works from "@/components/sections/Works";
import { MiddleParallax } from "@/components/sections/MiddleParallax";
import Testimonials from "@/components/sections/Testimonials";
import OutroParallax from "@/components/sections/OutroParallax";
import { PageIntro } from "@/components/ui/PageIntro";
import { AboutView } from "@/components/pages/AboutView";
import { ServicesDetails } from "@/components/pages/ServicesDetails";
import { WorksList } from "@/components/pages/WorksList";
import { WorkDetail } from "@/components/pages/WorkDetail";
import { ContactView } from "@/components/pages/ContactView";
import { LegalView } from "@/components/pages/LegalView";
import type { AboutPage, ContactPage, Home, LegalPage, ServicesPage, WorksPage } from "@/lib/cms/model";
import type { WorkEntry } from "@/lib/cms/types";

// Each page, from its content. The routes in app/ render these with published content; the
// Visual Editor renders them with the draft (lib/cms/live.tsx).

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

export function AboutPageView({ content }: { content: AboutPage }) {
  return (
    <>
      <PageIntro header={content.header} />
      <AboutView content={content} />
    </>
  );
}

export function ServicesPageView({ content }: { content: ServicesPage }) {
  return (
    <>
      <PageIntro header={content.header} />
      <ServicesDetails content={content} />
    </>
  );
}

export function WorksPageView({ content, works }: { content: WorksPage; works: WorkEntry[] }) {
  return (
    <>
      <PageIntro header={content.header} />
      <WorksList works={works} />
    </>
  );
}

export function WorkPage({ work, next }: { work: WorkEntry; next: WorkEntry }) {
  return <WorkDetail work={work} next={next} />;
}

export function ContactPageView({ content }: { content: ContactPage }) {
  return (
    <>
      <PageIntro header={content.header} />
      <ContactView content={content} />
    </>
  );
}

export function LegalPageView({ content }: { content: LegalPage }) {
  return (
    <>
      <PageIntro header={content.header} />
      <LegalView page={content} />
    </>
  );
}
