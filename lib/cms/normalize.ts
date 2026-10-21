import "server-only";
import type { z } from "zod";
import { components, fields, unwrap, type ComponentDef, type Media, type Video } from "./fields.ts";

// Storyblok sends numbers as strings, lists as text, assets as objects and nested blocks as
// arrays. This turns a story's content into the shape of the content model, so the same
// schema can validate it. Media get their real weight (for the size limits), dimensions and
// a blur preview.

export type NormalizeContext = { workSlug: (uuid: string) => Promise<string | undefined> };

const darkBlur =
  "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2010%2010'%3E%3Crect%20width%3D'10'%20height%3D'10'%20fill%3D'%23161616'%2F%3E%3C%2Fsvg%3E";

type Asset = { filename?: string | null; alt?: string | null };

const https = (url: string) => (url.startsWith("//") ? `https:${url}` : url);

// One request per file and server process: asset URLs change whenever the file does
const sizes = new Map<string, Promise<number>>();
function assetBytes(src: string) {
  if (!sizes.has(src)) {
    sizes.set(
      src,
      fetch(src, { method: "HEAD" })
        .then((response) => Number(response.headers.get("content-length") ?? 0))
        .catch(() => 0)
    );
  }
  return sizes.get(src)!;
}

const blurs = new Map<string, Promise<string | undefined>>();
function blurPreview(src: string) {
  if (!blurs.has(src)) {
    blurs.set(
      src,
      // Storyblok's image service returns a 16px version to stand in while the image loads
      fetch(`${src}/m/16x0/filters:quality(40)`, { cache: "force-cache" })
        .then(async (response) => {
          if (!response.ok) return undefined;
          const type = response.headers.get("content-type") ?? "image/jpeg";
          return `data:${type};base64,${Buffer.from(await response.arrayBuffer()).toString("base64")}`;
        })
        .catch(() => undefined)
    );
  }
  return blurs.get(src)!;
}

async function svgSize(src: string) {
  const text = await fetch(src, { cache: "force-cache" })
    .then((response) => response.text())
    .catch(() => "");
  const width = Number(/\swidth="([\d.]+)"/.exec(text)?.[1]);
  const height = Number(/\sheight="([\d.]+)"/.exec(text)?.[1]);
  if (width && height) return { width, height };
  const box = /viewBox="[\d.\s-]+?([\d.]+)\s+([\d.]+)"/.exec(text);
  return { width: Number(box?.[1] ?? 0), height: Number(box?.[2] ?? 0) };
}

export async function remoteImage(asset: Asset): Promise<Media | undefined> {
  if (!asset?.filename) return undefined;
  const src = https(asset.filename);
  const svg = /\.svg$/i.test(src);
  // Storyblok puts the size in the URL: /f/<space>/<width>x<height>/<hash>/<name>
  const match = /\/(\d+)x(\d+)\//.exec(src);
  const size = match && Number(match[1]) ? { width: Number(match[1]), height: Number(match[2]) } : svg ? await svgSize(src) : { width: 0, height: 0 };
  const [bytes, blurDataURL] = await Promise.all([assetBytes(src), svg ? darkBlur : blurPreview(src)]);
  return { src, ...size, alt: asset.alt ?? "", bytes, blurDataURL };
}

async function remoteVideo(asset: Asset): Promise<Video | undefined> {
  if (!asset?.filename) return undefined;
  const src = https(asset.filename);
  return { src, bytes: await assetBytes(src) };
}

async function value(schema: z.ZodType, raw: unknown, context: NormalizeContext): Promise<unknown> {
  const meta = fields.get(unwrap(schema).schema);
  if (!meta) return raw;
  switch (meta.kind) {
    case "text":
    case "textarea":
      return raw == null ? "" : String(raw);
    case "lines":
      return typeof raw === "string"
        ? raw
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean)
        : [];
    case "number":
      return raw === "" || raw == null ? undefined : Number(raw);
    case "image":
      return remoteImage(raw as Asset);
    case "images":
      return Array.isArray(raw) ? (await Promise.all(raw.map((asset) => remoteImage(asset)))).filter(Boolean) : [];
    case "video":
      return remoteVideo(raw as Asset);
    case "option":
      return raw || undefined;
    case "date":
      return typeof raw === "string" && raw ? raw.slice(0, 10) : undefined;
    case "work":
      return typeof raw === "string" && raw ? ((await context.workSlug(raw)) ?? "") : "";
    case "section": {
      const first = Array.isArray(raw) ? raw[0] : undefined;
      const def = components.get(meta.component);
      return first && def ? normalize(def, first, context) : undefined;
    }
    case "bloks": {
      if (!Array.isArray(raw)) return [];
      const items = await Promise.all(
        raw.map((item) => {
          const def = components.get(item?.component);
          return def && meta.components.includes(def.name) ? normalize(def, item, context) : undefined;
        })
      );
      return items.filter(Boolean);
    }
  }
}

/** A Storyblok block (or a story's content) in the shape of its component */
export async function normalize(def: ComponentDef, raw: Record<string, unknown>, context: NormalizeContext) {
  const shape = def.schema.shape as unknown as Record<string, z.ZodType>;
  const entries = await Promise.all(
    Object.keys(shape)
      .filter((key) => !["component", "_uid", "_editable"].includes(key))
      .map(async (key) => [key, await value(shape[key], raw[key], context)] as const)
  );
  return {
    ...Object.fromEntries(entries),
    component: def.name,
    _uid: typeof raw._uid === "string" ? raw._uid : undefined,
    _editable: typeof raw._editable === "string" ? raw._editable : undefined,
  };
}
