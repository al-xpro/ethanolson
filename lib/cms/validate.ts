import type { z } from "zod";
import { components, fields, unwrap, type ComponentDef } from "./fields.ts";

// Content from Storyblok is checked against the content model before it's shown. A field
// that breaks a rule (too long, too heavy, missing) falls back to its default, so the
// published site never shows broken content; the problems are listed in the Visual Editor.

export type ContentIssue = { field: string; message: string };

type Path = (string | number)[];

const get = (value: unknown, path: Path): unknown =>
  path.reduce<unknown>((current, key) => (current == null ? undefined : (current as Record<string | number, unknown>)[key]), value);

const REMOVE = Symbol("remove");

function set(target: unknown, path: Path, value: unknown) {
  const parent = get(target, path.slice(0, -1)) as Record<string | number, unknown> | undefined;
  if (parent != null) parent[path[path.length - 1]] = value;
}

function compact(value: unknown): unknown {
  if (Array.isArray(value)) return value.filter((item) => item !== REMOVE).map(compact);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, compact(item)]));
  }
  return value;
}

/** "Services › 2 › Title": the labels a client sees in Storyblok */
export function fieldLabel(def: ComponentDef, path: Path, data: unknown): string {
  const labels: string[] = [];
  let schema: z.ZodType | undefined = def.schema;
  for (let index = 0; index < path.length; index++) {
    const key = path[index];
    if (typeof key === "number") {
      labels.push(String(key + 1));
      const item = get(data, path.slice(0, index + 1)) as { component?: string } | undefined;
      const element: z.ZodType | undefined = schema
        ? (schema as unknown as { _zod: { def: { element?: z.ZodType } } })._zod.def.element
        : undefined;
      schema = (item?.component && components.get(item.component)?.schema) || element;
      continue;
    }
    const shape = (schema as z.ZodObject | undefined)?.shape as unknown as Record<string, z.ZodType> | undefined;
    const field = shape?.[key];
    const meta = field ? fields.get(unwrap(field).schema) : undefined;
    if (!meta) break;
    labels.push(meta.label);
    schema = unwrap(field!).schema;
  }
  return labels.join(" › ");
}

/**
 * Validates normalized content. Fields that fail fall back to the same field in `fallback`;
 * list items without a fallback are dropped. Returns null when nothing usable is left.
 */
export function validate<T>(def: ComponentDef, data: unknown, fallback?: T): { value: T | null; issues: ContentIssue[] } {
  const first = def.schema.safeParse(data);
  if (first.success) return { value: first.data as T, issues: [] };

  const issues = first.error.issues.map((issue) => ({
    field: fieldLabel(def, issue.path as Path, data) || "Content",
    message: issue.message,
  }));

  const repaired = structuredClone(data);
  // Deepest first, so replacing a list doesn't hide the items inside it
  const paths = first.error.issues.map((issue) => issue.path as Path).sort((a, b) => b.length - a.length);
  for (const path of paths) {
    for (let length = path.length; length > 0; length--) {
      const at = path.slice(0, length);
      const replacement = get(fallback, at);
      if (replacement !== undefined) {
        set(repaired, at, structuredClone(replacement));
        break;
      }
      if (typeof at[at.length - 1] === "number") {
        set(repaired, at, REMOVE);
        break;
      }
    }
  }

  const second = def.schema.safeParse(compact(repaired));
  if (second.success) return { value: second.data as T, issues };
  const whole = fallback === undefined ? null : def.schema.safeParse(fallback);
  return { value: whole?.success ? (whole.data as T) : null, issues };
}
