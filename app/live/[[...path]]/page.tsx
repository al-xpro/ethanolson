import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
  AboutPageView,
  ContactPageView,
  HomePage,
  LegalPageView,
  ServicesPageView,
  WorkPage,
  WorksPageView,
} from "@/components/cms/pages";
import { StoryblokStory } from "@/lib/cms/live";
import {
  isDraft,
  loadAbout,
  loadContact,
  loadHome,
  loadPrivacy,
  loadServices,
  loadTerms,
  loadWorks,
  loadWorksPage,
} from "@/lib/cms/load";
import type { Story } from "@/lib/cms/storyblok";

// The Visual Editor's pages. While draft mode is on, next.config.ts rewrites every page here
// (the address stays the same), and the draft renders through Storyblok's SDK, which updates
// it as it's edited. Only this route imports the SDK and every page's scenes: a published
// page ships its own code only.

export const metadata: Metadata = { robots: { index: false, follow: false } };

type Page = { story: Story | null | undefined; slug?: string; published: () => ReactNode };

async function page(path: string): Promise<Page | null> {
  switch (path) {
    case "": {
      const [{ content, story }, { works }] = await Promise.all([loadHome(), loadWorks()]);
      return { story, published: () => <HomePage content={content} works={works} /> };
    }
    case "about": {
      const { content, story } = await loadAbout();
      return { story, published: () => <AboutPageView content={content} /> };
    }
    case "services": {
      const { content, story } = await loadServices();
      return { story, published: () => <ServicesPageView content={content} /> };
    }
    case "works": {
      const [{ content, story }, { works }] = await Promise.all([loadWorksPage(), loadWorks()]);
      return { story, published: () => <WorksPageView content={content} works={works} /> };
    }
    case "contact": {
      const { content, story } = await loadContact();
      return { story, published: () => <ContactPageView content={content} /> };
    }
    case "privacy":
    case "terms": {
      const { content, story } = await (path === "privacy" ? loadPrivacy() : loadTerms());
      return { story, slug: path, published: () => <LegalPageView content={content} /> };
    }
  }
  const slug = path.match(/^works\/([^/]+)$/)?.[1];
  if (!slug) return null;
  const { works, stories } = await loadWorks();
  const index = works.findIndex((item) => item.slug === slug);
  return {
    story: stories.get(slug),
    slug,
    published: () => (index === -1 ? notFound() : <WorkPage work={works[index]} next={works[(index + 1) % works.length]} />),
  };
}

export default async function LivePage({ params }: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await params;
  const [found, draft] = await Promise.all([page(path.join("/")), isDraft()]);
  if (!found) notFound();
  // A draft-mode cookie that's no longer valid still lands here: show the published page
  if (draft && found.story) return <StoryblokStory story={found.story as never} slug={found.slug} />;
  return found.published();
}
