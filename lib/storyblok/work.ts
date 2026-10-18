import type { Work } from "@/content/works";

// The `work` component in Storyblok (created by scripts/storyblok-setup.ts). Number fields
// arrive as strings, and nested blocks carry Storyblok's own ids and editing markers.
type Blok = { _uid: string; component: string; _editable?: string };

export type WorkBlok = Blok & {
  title: string;
  client?: string;
  category?: string;
  year?: string | number;
  role?: string;
  duration?: string;
  stack?: string;
  summary: string;
  challenge?: string;
  solution?: (Blok & { text: string })[];
  results?: (Blok & { value: string | number; prefix?: string; suffix?: string; label: string })[];
};

const number = (value: string | number | undefined, fallback: number) => {
  const parsed = typeof value === "number" ? value : Number.parseFloat(value ?? "");
  return Number.isFinite(parsed) ? parsed : fallback;
};

/** A Storyblok work on top of the project in code, which keeps what isn't edited there (its spotlight) */
export function toWork(blok: WorkBlok, base: Work): Work {
  return {
    ...base,
    title: blok.title || base.title,
    client: blok.client ?? base.client,
    category: blok.category ?? base.category,
    year: number(blok.year, base.year),
    role: blok.role ?? base.role,
    duration: blok.duration ?? base.duration,
    stack: blok.stack
      ? blok.stack.split("\n").map((item) => item.trim()).filter(Boolean)
      : base.stack,
    summary: blok.summary || base.summary,
    challenge: blok.challenge ?? base.challenge,
    solution: blok.solution ? blok.solution.map((step) => step.text) : base.solution,
    results: blok.results
      ? blok.results.map((result) => ({
          value: number(result.value, 0),
          prefix: result.prefix || undefined,
          suffix: result.suffix || undefined,
          label: result.label,
        }))
      : base.results,
  };
}
