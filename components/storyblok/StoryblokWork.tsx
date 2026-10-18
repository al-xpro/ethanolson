import { storyblokEditable, type SbBlokData } from "@storyblok/react/rsc";
import { WorkDetail } from "@/components/pages/WorkDetail";
import { works, type Work } from "@/content/works";
import { toWork, type WorkBlok } from "@/lib/storyblok/work";

// A quick, stable fingerprint of the content
const fingerprint = (value: unknown) => {
  let hash = 0;
  for (const char of JSON.stringify(value)) hash = (Math.imul(31, hash) + char.charCodeAt(0)) | 0;
  return String(hash);
};

// The `work` story in the Visual Editor: the real project page, marked as editable, so a
// click anywhere opens its fields. Every edit remounts the page: the title animation splits
// the heading into spans, which React can't update in place.
export function StoryblokWork({ blok, slug, next }: { blok: WorkBlok; slug: string; next: Work }) {
  const base = works.find((work) => work.slug === slug);
  if (!base) return null;
  return (
    <div {...storyblokEditable(blok as unknown as SbBlokData)}>
      <WorkDetail key={fingerprint(blok)} work={toWork(blok, base)} next={next} />
    </div>
  );
}
