import type { Metadata } from "next";
import { WorksPageView } from "@/components/cms/pages";
import { StoryblokStory } from "@/lib/cms/live";
import { isDraft, loadWorksPage, loadWorks } from "@/lib/cms/load";

export const metadata: Metadata = {
  title: "Works",
  description:
    "Five projects by Ethan Olson: a logistics dashboard, healthcare booking, headless e-commerce, an editorial platform and fintech onboarding.",
  alternates: { canonical: "/works", types: { "text/markdown": "/works.md" } },
};

export default async function WorksPage() {
  const [{ content, story }, draft, { works }] = await Promise.all([loadWorksPage(), isDraft(), loadWorks()]);
  if (draft && story) return <StoryblokStory story={story as never} />;
  return <WorksPageView content={content} works={works} />;
}
