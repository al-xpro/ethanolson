import type { Metadata } from "next";
import { AboutPageView } from "@/components/cms/pages";
import { StoryblokStory } from "@/lib/cms/live";
import { isDraft, loadAbout } from "@/lib/cms/load";

export const metadata: Metadata = {
  title: "About",
  description:
    "Ethan Olson, design engineer: ten years of design and full-stack development, his experience, skills and what he does away from the screen.",
  alternates: { canonical: "/about", types: { "text/markdown": "/about.md" } },
};

export default async function AboutPage() {
  const [{ content, story }, draft] = await Promise.all([loadAbout(), isDraft()]);
  if (draft && story) return <StoryblokStory story={story as never} />;
  return <AboutPageView content={content} />;
}
