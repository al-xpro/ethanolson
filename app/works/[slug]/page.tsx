import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WorkPage } from "@/components/cms/pages/work";
import { loadWorks } from "@/lib/cms/load";
import { site } from "@/content/site";
import { TrackView } from "@/lib/analytics";

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
  const { works } = await loadWorks();
  const index = works.findIndex((item) => item.slug === slug);
  if (index === -1) notFound();

  const work = works[index];
  const next = works[(index + 1) % works.length];

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
      <TrackView event="Work view" data={{ work: work.slug }} />
      <WorkPage work={work} next={next} />
    </>
  );
}
