// Sets up the Storyblok content space from the content model (lib/cms/model.ts) and fills
// it with the default content (content/defaults): components with their limits and help
// text, the media, and every story. Safe to run again: it updates what already exists.
//
//   npm run storyblok:setup
//
// Needs STORYBLOK_MANAGEMENT_TOKEN and STORYBLOK_SPACE_ID (the content space, not the
// enquiries one) in .env.local.
import { readFileSync } from "node:fs";
import { basename, dirname, extname } from "node:path";
import { randomUUID } from "node:crypto";
import type { z } from "zod";
import { components, fields, unwrap, type ComponentDef, type FieldMeta, type Media, type Video } from "../lib/cms/fields.ts";
import * as model from "../lib/cms/model.ts";
import { defaultHome } from "../content/defaults/home.ts";
import { defaultAboutPage } from "../content/defaults/about.ts";
import { defaultServicesPage } from "../content/defaults/services.ts";
import { defaultWorks } from "../content/defaults/works.ts";
import { defaultWorksPage } from "../content/defaults/works-page.ts";
import { defaultContactPage } from "../content/defaults/contact.ts";
import { defaultPrivacy, defaultTerms } from "../content/defaults/legal.ts";
import { defaultSettings } from "../content/defaults/settings.ts";

const token = process.env.STORYBLOK_MANAGEMENT_TOKEN;
const space = process.env.STORYBLOK_SPACE_ID;
if (!token || !space) {
  console.error("Set STORYBLOK_MANAGEMENT_TOKEN and STORYBLOK_SPACE_ID in .env.local first.");
  process.exit(1);
}

// EU spaces use the EU Management API. The free plan allows about 3 requests a second.
const base = `https://mapi.storyblok.com/v1/spaces/${space}`;
const pause = () => new Promise((resolve) => setTimeout(resolve, 350));

// One request at a time, retried when Storyblok says to slow down
let queue: Promise<unknown> = Promise.resolve();
function api(method: string, path: string, body?: unknown) {
  const run = async () => {
    for (let attempt = 0; ; attempt++) {
      await pause();
      const response = await fetch(`${base}${path}`, {
        method,
        headers: { Authorization: token!, "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      if ((response.status === 429 || response.status >= 500) && attempt < 5) {
        await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1)));
        continue;
      }
      if (!response.ok) throw new Error(`${method} ${path}: ${response.status} ${await response.text()}`);
      return response.status === 204 ? null : response.json();
    }
  };
  const result = queue.then(run, run);
  queue = result.catch(() => undefined);
  return result;
}

// 1. Components -----------------------------------------------------------------------------

function storyblokField(meta: FieldMeta, pos: number, optional: boolean) {
  const common = { pos, display_name: meta.label, description: meta.description ?? "" };
  switch (meta.kind) {
    case "text":
    case "textarea":
      return {
        ...common,
        type: meta.kind,
        required: !optional && meta.min > 0,
        max_length: meta.max,
        // Storyblok checks the minimum length too, before saving
        ...(meta.min > 1 ? { regex: `^[\\s\\S]{${meta.min},}$` } : {}),
      };
    case "lines":
      return { ...common, type: "textarea", required: meta.minItems > 0 };
    case "number":
      return { ...common, type: "number", required: true, min_value: meta.min, max_value: meta.max, decimal_value: meta.decimals ? 2 : 0 };
    case "image":
      return { ...common, type: "asset", filetypes: ["images"], required: !optional };
    case "images":
      return { ...common, type: "multiasset", filetypes: ["images"], required: meta.minItems > 0 };
    case "video":
      return { ...common, type: "asset", filetypes: ["videos"], required: !optional };
    case "bloks":
      return {
        ...common,
        type: "bloks",
        restrict_components: true,
        component_whitelist: meta.components,
        minimum: meta.minItems,
        maximum: meta.maxItems,
      };
    case "section":
      return { ...common, type: "bloks", restrict_components: true, component_whitelist: [meta.component], minimum: 1, maximum: 1 };
    case "option":
      return { ...common, type: "option", options: meta.options, exclude_empty_option: true, required: true };
    case "date":
      return { ...common, type: "datetime", disable_time: true, required: true };
    case "work":
      return { ...common, type: "option", source: "internal_stories", folder_slug: "works/", filter_content_type: ["work"], required: true };
  }
}

function storyblokComponent(def: ComponentDef) {
  const shape = def.schema.shape as unknown as Record<string, z.ZodType>;
  const keys = Object.keys(shape).filter((key) => fields.get(unwrap(shape[key]).schema));
  const schema: Record<string, unknown> = {};
  keys.forEach((key, index) => {
    const { schema: inner, optional } = unwrap(shape[key]);
    schema[key] = storyblokField(fields.get(inner)!, index, optional);
  });
  Object.entries(def.tabs ?? {}).forEach(([name, tabKeys], index) => {
    schema[`tab-${name.toLowerCase()}`] = { type: "tab", display_name: name, keys: tabKeys, pos: keys.length + index };
  });
  const preview = keys.find((key) => ["title", "label", "name", "heading", "text", "caption"].includes(key));
  return {
    name: def.name,
    display_name: def.displayName,
    is_root: def.root,
    is_nestable: !def.root,
    schema,
    ...(preview ? { preview_field: preview } : {}),
  };
}

const existing: { id: number; name: string }[] = (await api("GET", "/components/")).components;
for (const def of components.values()) {
  const component = storyblokComponent(def);
  const match = existing.find((item) => item.name === def.name);
  if (match) await api("PUT", `/components/${match.id}`, { component });
  else await api("POST", "/components/", { component });
}
console.log(`components: ${components.size} created or updated`);

// 2. Media ----------------------------------------------------------------------------------

type Asset = { id: number; filename: string };
const uploaded = new Map<string, Asset>();
const assets: { id: number; filename: string }[] = [];
for (let page = 1; ; page++) {
  const batch = (await api("GET", `/assets/?per_page=100&page=${page}`)).assets as { id: number; filename: string }[];
  assets.push(...batch);
  if (batch.length < 100) break;
}

// public/works/quarrow/cover.svg → quarrow-cover.svg, so names stay unique
const assetName = (src: string) => (src.startsWith("/works/") ? `${basename(dirname(src))}-${basename(src)}` : basename(src));
const contentTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
};

async function upload(src: string, size = ""): Promise<Asset> {
  const name = assetName(src);
  if (uploaded.has(name)) return uploaded.get(name)!;
  const found = assets.find((asset) => asset.filename.endsWith(`/${name}`));
  if (found) {
    const asset = { id: found.id, filename: found.filename.replace(/^\/\//, "https://") };
    uploaded.set(name, asset);
    return asset;
  }
  const signed = await api("POST", "/assets/", { filename: name, size, validate_upload: 1 });
  const form = new FormData();
  for (const [key, value] of Object.entries(signed.fields as Record<string, string>)) form.append(key, value);
  const file = readFileSync(`public${src}`);
  form.append("file", new Blob([file], { type: contentTypes[extname(src).toLowerCase()] ?? "application/octet-stream" }), name);
  const response = await fetch(signed.post_url, { method: "POST", body: form });
  if (!response.ok && response.status !== 204) throw new Error(`Upload of ${name} failed: ${response.status} ${await response.text()}`);
  await api("GET", `/assets/${signed.id}/finish_upload`);
  const asset = { id: signed.id as number, filename: String(signed.pretty_url).replace(/^\/\//, "https://") };
  uploaded.set(name, asset);
  console.log(`  uploaded ${name}`);
  return asset;
}

const assetField = (asset: Asset, alt = "") => ({
  id: asset.id,
  alt,
  name: "",
  focus: "",
  title: "",
  filename: asset.filename,
  copyright: "",
  fieldtype: "asset",
  is_external_url: false,
});

// 3. Content --------------------------------------------------------------------------------

const workUuids = new Map<string, string>();

/** A default value in the shape Storyblok stores it */
async function toStoryblok(schema: z.ZodType, value: unknown): Promise<unknown> {
  const meta = fields.get(unwrap(schema).schema);
  if (!meta || value === undefined) return value;
  switch (meta.kind) {
    case "text":
    case "textarea":
    case "option":
      return value;
    case "lines":
      return (value as string[]).join("\n");
    case "number":
      return String(value);
    case "date":
      return `${value} 00:00`;
    case "work":
      return workUuids.get(value as string) ?? "";
    case "image": {
      const media = value as Media;
      return assetField(await upload(media.src, `${media.width}x${media.height}`), media.alt);
    }
    case "images":
      return Promise.all(
        (value as Media[]).map(async (media) => assetField(await upload(media.src, `${media.width}x${media.height}`), media.alt))
      );
    case "video":
      return assetField(await upload((value as Video).src));
    case "section":
      return [await toContent(components.get(meta.component)!, value as Record<string, unknown>)];
    case "bloks":
      return Promise.all(
        (value as Record<string, unknown>[]).map((item) =>
          toContent(components.get((item.component as string) ?? meta.components[0])!, item)
        )
      );
  }
}

async function toContent(def: ComponentDef, value: Record<string, unknown>) {
  const shape = def.schema.shape as unknown as Record<string, z.ZodType>;
  const content: Record<string, unknown> = { component: def.name, _uid: randomUUID() };
  for (const key of Object.keys(shape)) {
    if (["component", "_uid", "_editable"].includes(key)) continue;
    content[key] = await toStoryblok(shape[key], value[key]);
  }
  return content;
}

async function findStory(slug: string) {
  const { stories } = await api("GET", `/stories/?with_slug=${encodeURIComponent(slug)}`);
  return stories[0] as { id: number; uuid: string } | undefined;
}

async function save(
  slug: string,
  name: string,
  def: ComponentDef,
  value: Record<string, unknown>,
  options: { parentId?: number; path?: string; startpage?: boolean; existingId?: number } = {}
) {
  const fullSlug = options.parentId ? undefined : slug;
  const match = options.existingId ? { id: options.existingId, uuid: "" } : fullSlug ? await findStory(fullSlug) : undefined;
  const story = {
    name,
    slug: options.startpage ? "index" : slug,
    content: await toContent(def, value),
    ...(options.parentId ? { parent_id: options.parentId } : {}),
    ...(options.path ? { path: options.path } : {}),
    ...(options.startpage ? { is_startpage: true } : {}),
  };
  const result = match
    ? await api("PUT", `/stories/${match.id}`, { story, publish: 1 })
    : await api("POST", "/stories/", { story, publish: 1 });
  console.log(`story ${result.story.full_slug}: ${match ? "updated" : "created"}`);
  return result.story as { id: number; uuid: string; slug: string };
}

// Works first: testimonials link to them
// New stories in the Works folder start as a work
const folderStory = { name: "Works", slug: "works", is_folder: true, default_root: model.work.name };
let folder = await findStory("works");
if (folder) await api("PUT", `/stories/${folder.id}`, { story: folderStory });
else folder = (await api("POST", "/stories/", { story: folderStory })).story;
const inFolder: { id: number; slug: string; is_startpage: boolean }[] = (await api("GET", `/stories/?with_parent=${folder!.id}&per_page=100`)).stories;

for (const { slug, ...work } of defaultWorks) {
  const existingId = inFolder.find((story) => story.slug === slug && !story.is_startpage)?.id;
  const story = await save(slug, work.title, model.work, work, { parentId: folder!.id, existingId });
  workUuids.set(slug, story.uuid);
}
const startpage = inFolder.find((story) => story.is_startpage);
await save("works", "Works page", model.worksPage, defaultWorksPage, { parentId: folder!.id, startpage: true, existingId: startpage?.id });

await save("settings", "Site settings", model.settings, defaultSettings, { path: "/" });
await save("home", "Home", model.home, defaultHome);
await save("about", "About", model.aboutPage, defaultAboutPage);
await save("services", "Services", model.servicesPage, defaultServicesPage);
await save("contact", "Contact", model.contactPage, defaultContactPage);
await save("privacy", "Privacy policy", model.legalPage, defaultPrivacy);
await save("terms", "Terms & conditions", model.legalPage, defaultTerms);

// 4. Tidy up --------------------------------------------------------------------------------

// Components the site doesn't use: Storyblok's starter blocks and earlier versions of the model
const unused = (await api("GET", "/components/")).components.filter(
  (item: { name: string }) => !components.has(item.name)
) as { id: number; name: string }[];
for (const item of unused) {
  try {
    await api("DELETE", `/components/${item.id}`);
    console.log(`component ${item.name}: removed (not used by the site)`);
  } catch {
    // Storyblok keeps the space's default content type (Settings → General) until it changes
    console.log(`component ${item.name}: kept (Storyblok still uses it, see Settings → General)`);
  }
}
