import { z } from "zod";

// The content model is written once, with these builders. Each field is a zod schema (the
// validation and the TypeScript type) carrying metadata for Storyblok (its field type,
// label, limits and help text). scripts/storyblok-setup.ts turns the metadata into
// Storyblok components; lib/cms/normalize.ts reads it to convert what Storyblok sends.
//
// Relative imports only: the setup script runs this file directly in Node.

type Common = { label: string; description?: string };

export type FieldMeta = Common &
  (
    | { kind: "text" | "textarea"; min: number; max: number }
    | { kind: "lines"; minItems: number; maxItems: number; maxLength: number }
    | { kind: "number"; min: number; max: number; decimals: boolean }
    | { kind: "image"; maxKB: number }
    | { kind: "images"; minItems: number; maxItems: number; maxKB: number }
    | { kind: "video"; maxMB: number }
    | { kind: "bloks"; components: string[]; minItems: number; maxItems: number }
    | { kind: "section"; component: string }
    | { kind: "option"; options: { name: string; value: string }[] }
    | { kind: "date" }
    | { kind: "work" }
  );

export const fields = z.registry<FieldMeta>();

export const kb = (bytes: number) => `${Math.round(bytes / 1024)} KB`;
const mb = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;
const required = { error: "Required" };

// Media keep their real size and weight, so limits can be checked and <img> gets dimensions
export const mediaSchema = z.object({
  src: z.string().min(1),
  width: z.number(),
  height: z.number(),
  alt: z.string(),
  bytes: z.number(),
  blurDataURL: z.string().optional(),
});
export const videoSchema = z.object({ src: z.string().min(1), bytes: z.number() });
export type Media = z.infer<typeof mediaSchema>;
export type Video = z.infer<typeof videoSchema>;

const withLimits = (description: string | undefined, limits: string) =>
  description ? `${description} ${limits}` : limits;

/** A single line of text, between min and max characters */
export function text(label: string, min: number, max: number, description?: string) {
  return z
    .string(required)
    .trim()
    .min(min, `At least ${min} characters`)
    .max(max, `At most ${max} characters`)
    .register(fields, { kind: "text", label, min, max, description: withLimits(description, `${min}–${max} characters.`) });
}

/** Several lines of text (line breaks are kept), between min and max characters */
export function textarea(label: string, min: number, max: number, description?: string) {
  return z
    .string(required)
    .trim()
    .min(min, `At least ${min} characters`)
    .max(max, `At most ${max} characters`)
    .register(fields, { kind: "textarea", label, min, max, description: withLimits(description, `${min}–${max} characters.`) });
}

/** A list typed one item per line */
export function lines(label: string, minItems: number, maxItems: number, maxLength: number, description?: string) {
  return z
    .array(z.string().max(maxLength, `Each line: at most ${maxLength} characters`))
    .min(minItems, `At least ${minItems} lines`)
    .max(maxItems, `At most ${maxItems} lines`)
    .register(fields, {
      kind: "lines",
      label,
      minItems,
      maxItems,
      maxLength,
      description: withLimits(description, `One per line: ${minItems}–${maxItems} lines, ${maxLength} characters each.`),
    });
}

export function number(label: string, min: number, max: number, options: { decimals?: boolean; description?: string } = {}) {
  const base = z.number(required).min(min, `At least ${min}`).max(max, `At most ${max}`);
  return (options.decimals ? base : base.int("A whole number")).register(fields, {
    kind: "number",
    label,
    min,
    max,
    decimals: Boolean(options.decimals),
    description: withLimits(options.description, `From ${min} to ${max}.`),
  });
}

const sizeCheck = (maxKB: number) => (value: { bytes: number }, ctx: z.RefinementCtx) => {
  if (value.bytes > maxKB * 1024) {
    ctx.addIssue({ code: "custom", message: `Up to ${maxKB} KB: this file is ${kb(value.bytes)}` });
  }
};

/** An image (JPG, PNG, WebP, AVIF or SVG) up to maxKB */
export function image(label: string, maxKB: number, description?: string) {
  return mediaSchema
    .superRefine(sizeCheck(maxKB))
    .register(fields, {
      kind: "image",
      label,
      maxKB,
      description: withLimits(description, `An image up to ${maxKB} KB.`),
    });
}

/** A fixed or bounded number of images, each up to maxKB */
export function images(label: string, minItems: number, maxItems: number, maxKB: number, description?: string) {
  const count = minItems === maxItems ? `Exactly ${minItems} images` : `${minItems}–${maxItems} images`;
  return z
    .array(mediaSchema.superRefine(sizeCheck(maxKB)))
    .min(minItems, `${count}, please`)
    .max(maxItems, `${count}, please`)
    .register(fields, {
      kind: "images",
      label,
      minItems,
      maxItems,
      maxKB,
      description: withLimits(description, `${count}, each up to ${maxKB} KB.`),
    });
}

/** An MP4 video up to maxMB */
export function video(label: string, maxMB: number, description?: string) {
  return videoSchema
    .superRefine((value, ctx) => {
      if (value.bytes > maxMB * 1024 * 1024) {
        ctx.addIssue({ code: "custom", message: `Up to ${maxMB} MB: this file is ${mb(value.bytes)}` });
      }
    })
    .register(fields, { kind: "video", label, maxMB, description: withLimits(description, `An MP4 up to ${maxMB} MB.`) });
}

export function option<const T extends readonly [string, ...string[]]>(
  label: string,
  options: { [K in keyof T]: { name: string; value: T[K] } },
  description?: string
) {
  return z
    .enum(options.map((item) => item.value) as unknown as T, { error: "Choose one of the options" })
    .register(fields, { kind: "option", label, options: [...options], description });
}

/** A date, kept as YYYY-MM-DD */
export function date(label: string, description?: string) {
  return z
    .string(required)
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date")
    .register(fields, { kind: "date", label, description });
}

/** A link to one of the works (its slug) */
export function workRef(label: string, description?: string) {
  return z.string(required).min(1, "Choose a work").register(fields, { kind: "work", label, description });
}

// Components ---------------------------------------------------------------------------

export type ComponentDef<Shape extends z.ZodRawShape = z.ZodRawShape, Name extends string = string> = {
  name: Name;
  displayName: string;
  root: boolean;
  /** Field order and tabs in Storyblok: each tab lists its field keys */
  tabs?: Record<string, string[]>;
  schema: z.ZodObject<
    Shape & {
      component: z.ZodOptional<z.ZodLiteral<Name>>;
      _uid: z.ZodOptional<z.ZodString>;
      _editable: z.ZodOptional<z.ZodString>;
    }
  >;
};

export const components = new Map<string, ComponentDef>();

/** A Storyblok component: nestable (used inside others) or root (a page) */
export function component<const Name extends string, Shape extends z.ZodRawShape>(
  name: Name,
  displayName: string,
  shape: Shape,
  options: { root?: boolean; tabs?: Record<string, string[]> } = {}
) {
  const schema = z.object({
    ...shape,
    component: z.literal(name).optional(),
    // Storyblok's ids: _editable lets the Visual Editor select the block on the page
    _uid: z.string().optional(),
    _editable: z.string().optional(),
  });
  const def = { name, displayName, root: Boolean(options.root), tabs: options.tabs, schema } as unknown as ComponentDef<Shape, Name>;
  components.set(name, def as unknown as ComponentDef);
  return def;
}

/** A list of nested blocks, of one component or a choice of several */
export function bloks<C extends ComponentDef>(label: string, defs: C | C[], minItems: number, maxItems: number, description?: string) {
  const list = Array.isArray(defs) ? defs : [defs];
  const item =
    list.length === 1
      ? list[0].schema
      : z.discriminatedUnion(
          "component",
          list.map((def) => def.schema.extend({ component: z.literal(def.name) })) as unknown as [
            z.ZodObject<{ component: z.ZodLiteral<string> }>,
            ...z.ZodObject<{ component: z.ZodLiteral<string> }>[],
          ]
        );
  const count = minItems === maxItems ? `exactly ${minItems}` : `${minItems}–${maxItems}`;
  return z
    .array(item as C["schema"])
    .min(minItems, `Add ${count}`)
    .max(maxItems, `Add ${count}`)
    .register(fields, {
      kind: "bloks",
      label,
      components: list.map((def) => def.name),
      minItems,
      maxItems,
      description: withLimits(description, `${count[0].toUpperCase()}${count.slice(1)}.`),
    });
}

/** Exactly one nested block: a section of a page, selectable in the Visual Editor */
export function section<C extends ComponentDef>(label: string, def: C, description?: string) {
  return def.schema.register(fields, { kind: "section", label, component: def.name, description }) as C["schema"];
}

/** Unwraps .optional() to reach the registered field */
export function unwrap(schema: z.ZodType): { schema: z.ZodType; optional: boolean } {
  const def = (schema as unknown as { _zod: { def: { type: string; innerType?: z.ZodType } } })._zod.def;
  if (def.type === "optional" && def.innerType) return { schema: unwrap(def.innerType).schema, optional: true };
  return { schema, optional: false };
}

export const metaOf = (schema: z.ZodType) => fields.get(unwrap(schema).schema);
