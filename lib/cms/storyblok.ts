import "server-only";

// Storyblok's Content Delivery API, read on the server only, so neither token reaches the
// browser. Published content uses the public token and is cached under the "storyblok" tag
// (the publish webhook revalidates it); drafts use the preview token and are never cached.
const CDN = "https://api.storyblok.com/v2/cdn";
export const CMS_TAG = "storyblok";

// Next.js keeps fetched data between builds (in .next/cache, which Vercel restores). A new
// cache version per server process makes every build and server start read the current
// content; in between, the publish webhook refreshes the tag.
const processVersion = String(Date.now());

export type Story = {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  full_slug: string;
  content: Record<string, unknown> & { component: string };
};

function request(path: string, params: Record<string, string>, draft: boolean) {
  const token = draft ? process.env.STORYBLOK_PREVIEW_TOKEN : process.env.STORYBLOK_PUBLIC_TOKEN;
  if (!token) return null;
  const query = new URLSearchParams({ ...params, token, version: draft ? "draft" : "published" });
  query.set("cv", draft ? String(Date.now()) : processVersion);
  return fetch(`${CDN}/${path}?${query}`, draft ? { cache: "no-store" } : { cache: "force-cache", next: { tags: [CMS_TAG] } })
    .then((response) => (response.ok ? response.json() : null))
    .catch(() => null);
}

export async function getStory(slug: string, draft: boolean): Promise<Story | null> {
  const data = await request(`stories/${slug}`, {}, draft);
  return data?.story ?? null;
}

/** Stories of one content type in a folder, in the order they have in Storyblok */
export async function getStories(folder: string, contentType: string, draft: boolean): Promise<Story[] | null> {
  const data = await request(
    "stories",
    { starts_with: `${folder}/`, content_type: contentType, sort_by: "position:desc", per_page: "100" },
    draft
  );
  return data?.stories ?? null;
}
