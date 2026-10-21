import { mediaManifest } from "../../content/media.ts";
import type { Media, Video } from "./fields.ts";

// Media shipped in public/, in the same shape as media from Storyblok. The size, dimensions
// and blur preview come from content/media.ts (npm run media).
export function local(path: string, alt = ""): Media {
  const entry = mediaManifest[path];
  if (!entry) throw new Error(`${path} isn't in content/media.ts: run npm run media`);
  return { src: path, width: entry.width, height: entry.height, bytes: entry.bytes, blurDataURL: entry.blurDataURL, alt };
}

export function localVideo(path: string): Video {
  const entry = mediaManifest[path];
  if (!entry) throw new Error(`${path} isn't in content/media.ts: run npm run media`);
  return { src: path, bytes: entry.bytes };
}

export const isStoryblokAsset = (src: string) => src.startsWith("https://a.storyblok.com/");
