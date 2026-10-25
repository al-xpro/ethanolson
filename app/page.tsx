import { HomePage } from "@/components/cms/pages/home";
import { loadHome, loadWorks } from "@/lib/cms/load";
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
  const [{ content }, { works }] = await Promise.all([loadHome(), loadWorks()]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <HomePage content={content} works={works} />
    </>
  );
}
