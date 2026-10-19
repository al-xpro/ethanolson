import type { Metadata } from "next";
import { LegalPageView } from "@/components/cms/pages";
import { StoryblokStory } from "@/lib/cms/live";
import { isDraft, loadPrivacy } from "@/lib/cms/load";

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await loadPrivacy();
  return {
    title: content.header.title,
    description:
      "What personal data this website collects, why, and your rights.",
    alternates: {
      canonical: "/privacy",
      types: { "text/markdown": "/privacy.md" },
    },
  };
}

export default async function PrivacyPage() {
  const [{ content, story }, draft] = await Promise.all([
    loadPrivacy(),
    isDraft(),
  ]);
  if (draft && story)
    return <StoryblokStory story={story as never} slug="privacy" />;
  return <LegalPageView content={content} />;
}
