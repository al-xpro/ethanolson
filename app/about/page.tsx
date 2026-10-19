import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { AboutView } from "@/components/pages/AboutView";
import { aboutPage } from "@/content/about";

export const metadata: Metadata = {
  title: "About",
  description:
    "Ethan Olson, design engineer: ten years of design and full-stack development, his experience, skills and what he does away from the screen.",
  alternates: { canonical: "/about", types: { "text/markdown": "/about.md" } },
};

export default function AboutPage() {
  return (
    <>
      <PageIntro header={aboutPage} />
      <AboutView />
    </>
  );
}
