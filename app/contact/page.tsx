import type { Metadata } from "next";
import { ContactPageView } from "@/components/cms/pages";
import { StoryblokStory } from "@/lib/cms/live";
import { isDraft, loadContact } from "@/lib/cms/load";

export const metadata: Metadata = {
  title: "Contact",
  description: "Tell Ethan Olson about your product: a short form, or an e-mail.",
  alternates: { canonical: "/contact", types: { "text/markdown": "/contact.md" } },
};

export default async function ContactPage() {
  const [{ content, story }, draft] = await Promise.all([loadContact(), isDraft()]);
  if (draft && story) return <StoryblokStory story={story as never} />;
  return <ContactPageView content={content} />;
}
