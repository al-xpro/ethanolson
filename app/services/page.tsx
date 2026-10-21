import type { Metadata } from "next";
import { ServicesPageView } from "@/components/cms/pages";
import { StoryblokStory } from "@/lib/cms/live";
import { isDraft, loadServices } from "@/lib/cms/load";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Product design, interactive front ends, back ends and APIs, and performance: what Ethan Olson offers, and how he works.",
  alternates: { canonical: "/services", types: { "text/markdown": "/services.md" } },
};

export default async function ServicesPage() {
  const [{ content, story }, draft] = await Promise.all([loadServices(), isDraft()]);
  if (draft && story) return <StoryblokStory story={story as never} />;
  return <ServicesPageView content={content} />;
}
