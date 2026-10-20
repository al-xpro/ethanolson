import "server-only";
import { cache } from "react";
import { draftMode } from "next/headers";
import type { ComponentDef } from "./fields.ts";
import * as model from "./model.ts";
import type { WorkEntry } from "./types.ts";
import { normalize, type NormalizeContext } from "./normalize";
import { validate, type ContentIssue } from "./validate.ts";
import { getStories, getStory, type Story } from "./storyblok";
import { defaultHome } from "@/content/defaults/home";
import { defaultAboutPage } from "@/content/defaults/about";
import { defaultServicesPage } from "@/content/defaults/services";
import { defaultWorks } from "@/content/defaults/works";
import { defaultWorksPage } from "@/content/defaults/works-page";
import { defaultContactPage } from "@/content/defaults/contact";
import { defaultPrivacy, defaultTerms } from "@/content/defaults/legal";
import { defaultSettings } from "@/content/defaults/settings";

// Every page reads its content here: from Storyblok when it's configured and the story
// exists (the draft in the Visual Editor, the published version elsewhere), from the
// defaults in content/defaults otherwise. Either way it has passed the content model.

export type Loaded<T> = { content: T; story: Story | null; issues: ContentIssue[] };

// Outside a request (generateStaticParams, the build) there's no draft mode to read
export const isDraft = cache(async () => {
  try {
    return (await draftMode()).isEnabled;
  } catch {
    return false;
  }
});

/** Works, in their Storyblok order; the defaults when Storyblok has none */
export const loadWorks = cache(async (): Promise<{ works: WorkEntry[]; issues: Map<string, ContentIssue[]>; stories: Map<string, Story> }> => {
  const draft = await isDraft();
  const stories = await getStories("works", model.work.name, draft);
  const issues = new Map<string, ContentIssue[]>();
  const byStory = new Map<string, Story>();
  if (!stories?.length) return { works: defaultWorks, issues, stories: byStory };

  const context = await workContext();
  const works: WorkEntry[] = [];
  for (const story of stories) {
    const fallback = defaultWorks.find((entry) => entry.slug === story.slug);
    const result = validate<model.Work>(model.work, await normalize(model.work, story.content, context), fallback);
    if (result.issues.length) issues.set(story.slug, result.issues);
    report(`Work ${story.slug}`, result.issues);
    byStory.set(story.slug, story);
    if (result.value) works.push({ ...result.value, slug: story.slug, uuid: story.uuid });
  }
  return { works: works.length ? works : defaultWorks, issues, stories: byStory };
});

// Testimonials link to works by their Storyblok id
const workSlugs = cache(async () => {
  const stories = await getStories("works", model.work.name, await isDraft());
  return new Map((stories ?? []).map((story) => [story.uuid, story.slug]));
});

async function workContext(): Promise<NormalizeContext> {
  return { workSlug: async (uuid) => (await workSlugs()).get(uuid) };
}

// Published content that breaks a rule shows its default instead; the build and Vercel's
// logs say what was replaced (the Visual Editor shows it on the page)
function report(name: string, issues: ContentIssue[]) {
  if (issues.length) console.warn(`[content] ${name}: ${issues.map((issue) => `${issue.field}: ${issue.message}`).join("; ")}`);
}

/** Normalizes and validates a story's content (also used by the Visual Editor's live preview) */
export async function fromStory<T>(def: ComponentDef, content: Record<string, unknown>, fallback: T) {
  const result = validate<T>(def, await normalize(def, content, await workContext()), fallback);
  report(def.displayName, result.issues);
  return { content: result.value ?? fallback, issues: result.issues };
}

async function load<T>(slug: string, def: ComponentDef, fallback: T): Promise<Loaded<T>> {
  const story = await getStory(slug, await isDraft());
  if (!story || story.content.component !== def.name) return { content: fallback, story: null, issues: [] };
  return { ...(await fromStory(def, story.content, fallback)), story };
}

export const loadSettings = cache(() => load("settings", model.settings, defaultSettings));
export const loadHome = cache(() => load("home", model.home, defaultHome));
export const loadAbout = cache(() => load("about", model.aboutPage, defaultAboutPage));
export const loadServices = cache(() => load("services", model.servicesPage, defaultServicesPage));
export const loadWorksPage = cache(() => load("works/", model.worksPage, defaultWorksPage));
export const loadContact = cache(() => load("contact", model.contactPage, defaultContactPage));
export const loadPrivacy = cache(() => load("privacy", model.legalPage, defaultPrivacy));
export const loadTerms = cache(() => load("terms", model.legalPage, defaultTerms));

export const defaults = {
  home: defaultHome,
  about: defaultAboutPage,
  services: defaultServicesPage,
  worksPage: defaultWorksPage,
  contact: defaultContactPage,
  privacy: defaultPrivacy,
  terms: defaultTerms,
  settings: defaultSettings,
  works: defaultWorks,
};
