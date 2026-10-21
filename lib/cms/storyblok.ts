import "server-only";
import { cache } from "react";

// Storyblok's Content Delivery API, read on the server only, so neither token reaches the
// browser. Published content uses the public token and is cached under the "storyblok" tag
// (the publish webhook revalidates it); drafts use the preview token and are never cached.
const CDN = "https://api.storyblok.com/v2/cdn";
export const CMS_TAG = "storyblok";

// Storyblok's CDN caches each response by its cache version (cv), so published content is
// read with the space's current version. That version is itself cached under the tag: the
// publish webhook refreshes both, and the next render reads the new version, then the new
// content. Next.js keeps fetched data between builds (Vercel restores it), so the version
// request carries the server process's start time: every build and server start re-reads it.
const processVersion = String(Date.now());

const publishedVersion = cache(async (token: string): Promise<string> => {
  const query = new URLSearchParams({ token, process: processVersion });
  const data = await fetch(`${CDN}/spaces/me?${query}`, { cache: "force-cache", next: { tags: [CMS_TAG] } })
    .then((response) => (response.ok ? response.json() : null))
    .catch(() => null);
  return data?.space?.version ? String(data.space.version) : processVersion;
});

export type Story = {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  full_slug: string;
  content: Record<string, unknown> & { component: string };
};

async function request(path: string, params: Record<string, string>, draft: boolean) {
  const token = draft ? process.env.STORYBLOK_PREVIEW_TOKEN : process.env.STORYBLOK_PUBLIC_TOKEN;
  if (!token) return null;
  const query = new URLSearchParams({ ...params, token, version: draft ? "draft" : "published" });
  query.set("cv", draft ? String(Date.now()) : await publishedVersion(token));
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
