import "server-only";

// Content Delivery API, read on the server only, so neither token reaches the browser.
// Published content uses the public token; drafts (Visual Editor, draft mode) use the
// preview token. EU spaces use the default host.
const CDN = "https://api.storyblok.com/v2/cdn";

export type Story<Content> = {
  id: number;
  name: string;
  slug: string;
  full_slug: string;
  content: Content;
};

export async function getStory<Content>(slug: string, { draft }: { draft: boolean }) {
  const token = draft ? process.env.STORYBLOK_PREVIEW_TOKEN : process.env.STORYBLOK_PUBLIC_TOKEN;
  if (!token) return null;

  const params = new URLSearchParams({ token, version: draft ? "draft" : "published" });
  // Drafts are never cached; published stories are tagged for on-demand revalidation (#24)
  if (draft) params.set("cv", String(Date.now()));
  const response = await fetch(`${CDN}/stories/${slug}?${params}`, {
    ...(draft ? { cache: "no-store" } : { next: { tags: ["works"] } }),
  });
  if (!response.ok) return null;
  const { story } = (await response.json()) as { story: Story<Content> };
  return story;
}
