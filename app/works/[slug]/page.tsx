import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { StoryblokStory } from "@storyblok/react/rsc";
import { WorkDetail } from "@/components/pages/WorkDetail";
import { works } from "@/content/works";
import { site } from "@/content/site";
import { getStory } from "@/lib/storyblok/client";
import type { WorkBlok } from "@/lib/storyblok/work";
import "@/lib/storyblok/components";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return works.map((work) => ({ slug: work.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const work = works.find((item) => item.slug === slug);
  if (!work) return {};
  return {
    title: work.title,
    description: work.summary,
    alternates: {
      canonical: `/works/${work.slug}`,
      types: { "text/markdown": `/works/${work.slug}.md` },
    },
  };
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params;
  const index = works.findIndex((item) => item.slug === slug);
  if (index === -1) notFound();

  const work = works[index];
  const next = works[(index + 1) % works.length];

  // In draft mode (opened from Storyblok's Visual Editor), the page shows the draft from
  // Storyblok and updates live while it's edited. Published pages still come from
  // content/works.ts until the works are read from Storyblok (#22, #23).
  const { isEnabled: draft } = await draftMode();
  const story = draft ? await getStory<WorkBlok>(`works/${slug}`, { draft: true }) : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: work.title,
    description: work.summary,
    genre: work.category,
    dateCreated: String(work.year),
    url: `${site.url}/works/${work.slug}`,
    creator: { "@type": "Person", name: site.creator.name, url: site.creator.url },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      {story ? (
        <StoryblokStory story={story} slug={slug} next={next} />
      ) : (
        <WorkDetail work={work} next={next} />
      )}
    </>
  );
}
