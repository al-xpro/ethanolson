import type { Work } from "./model.ts";

/** A work and its URL: the story's slug in Storyblok, or the default's */
export type WorkEntry = Work & { slug: string; uuid?: string };
