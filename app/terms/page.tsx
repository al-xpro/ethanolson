import type { Metadata } from "next";
import { LegalPageView } from "@/components/cms/pages";
import { StoryblokStory } from "@/lib/cms/live";
import { isDraft, loadTerms } from "@/lib/cms/load";

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await loadTerms();
  return {
    title: content.header.title,
    description: "The terms for using this website.",
    alternates: {
      canonical: "/terms",
      types: { "text/markdown": "/terms.md" },
    },
  };
}

export default async function TermsPage() {
  const [{ content, story }, draft] = await Promise.all([
    loadTerms(),
    isDraft(),
  ]);
  if (draft && story)
    return <StoryblokStory story={story as never} slug="terms" />;
  return <LegalPageView content={content} />;
}
