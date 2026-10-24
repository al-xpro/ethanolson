import type { Metadata } from "next";
import { AboutPageView } from "@/components/cms/pages/about";
import { loadAbout } from "@/lib/cms/load";

export const metadata: Metadata = {
  title: "About",
  description:
    "Ethan Olson, design engineer: ten years of design and full-stack development, his experience, skills and what he does away from the screen.",
  alternates: { canonical: "/about", types: { "text/markdown": "/about.md" } },
};

export default async function AboutPage() {
  const { content } = await loadAbout();
  return <AboutPageView content={content} />;
}
