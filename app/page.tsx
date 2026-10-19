import { HomePage } from "@/components/cms/pages";
import { StoryblokStory } from "@/lib/cms/live";
import { isDraft, loadHome, loadWorks } from "@/lib/cms/load";
import { site } from "@/content/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.title,
  url: site.url,
  description: site.description,
  creator: {
    "@type": "Person",
    name: site.creator.name,
    url: site.creator.url,
  },
};

export default async function Home() {
  const [{ content, story }, { works }, draft] = await Promise.all([loadHome(), loadWorks(), isDraft()]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      {/* In the Visual Editor, the draft renders through Storyblok and updates live */}
      {draft && story ? <StoryblokStory story={story as never} /> : <HomePage content={content} works={works} />}
    </>
  );
}
