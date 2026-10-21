import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WorkPage } from "@/components/cms/pages";
import { StoryblokStory } from "@/lib/cms/live";
import { isDraft, loadWorks } from "@/lib/cms/load";
import { site } from "@/content/site";

type Props = { params: Promise<{ slug: string }> };

// Works published after the build are rendered on their first visit, then cached
export const dynamicParams = true;

export async function generateStaticParams() {
  const { works } = await loadWorks();
  return works.map((work) => ({ slug: work.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const work = (await loadWorks()).works.find((item) => item.slug === slug);
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

export default async function WorkRoute({ params }: Props) {
  const { slug } = await params;
  const [{ works, stories }, draft] = await Promise.all([loadWorks(), isDraft()]);
  const index = works.findIndex((item) => item.slug === slug);
  const story = stories.get(slug);
  if (index === -1 && !(draft && story)) notFound();

  const work = works[index];
  const next = works[(index + 1) % works.length];

  const jsonLd = work && {
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
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      )}
      {/* In the Visual Editor, the draft renders through Storyblok and updates live */}
      {draft && story ? <StoryblokStory story={story as never} slug={slug} /> : <WorkPage work={work} next={next} />}
    </>
  );
}
