// Creates the content model in the Storyblok content space and fills it with the five
// projects from content/works.ts. Safe to run again: it updates what already exists.
//
//   node --env-file=.env.local --experimental-strip-types scripts/storyblok-setup.ts
//
// Needs STORYBLOK_MANAGEMENT_TOKEN and STORYBLOK_SPACE_ID (the content space, not the
// enquiries one).
import { works } from "../content/works.ts";

const token = process.env.STORYBLOK_MANAGEMENT_TOKEN;
const space = process.env.STORYBLOK_SPACE_ID;
if (!token || !space) {
  console.error("Set STORYBLOK_MANAGEMENT_TOKEN and STORYBLOK_SPACE_ID first.");
  process.exit(1);
}

// EU spaces use the EU Management API
const base = `https://mapi.storyblok.com/v1/spaces/${space}`;
const pause = () => new Promise((resolve) => setTimeout(resolve, 400)); // free plan rate limit

async function api(method: string, path: string, body?: unknown) {
  await pause();
  const response = await fetch(`${base}${path}`, {
    method,
    headers: { Authorization: token!, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) throw new Error(`${method} ${path}: ${response.status} ${await response.text()}`);
  return response.json();
}

type Field = Record<string, unknown>;
const field = (pos: number, type: string, extra: Field = {}) => ({ pos, type, ...extra });

const components = [
  {
    name: "result",
    display_name: "Result",
    is_root: false,
    is_nestable: true,
    schema: {
      value: field(0, "number", { required: true, decimal_value: 1 }),
      prefix: field(1, "text", { description: "Before the number, for example +" }),
      suffix: field(2, "text", { description: "After the number, for example %" }),
      label: field(3, "text", { required: true }),
    },
  },
  {
    name: "solution_step",
    display_name: "Solution step",
    is_root: false,
    is_nestable: true,
    schema: { text: field(0, "textarea", { required: true }) },
  },
  {
    name: "work",
    display_name: "Work",
    is_root: true,
    is_nestable: false,
    schema: {
      title: field(0, "text", { required: true }),
      client: field(1, "text"),
      category: field(2, "text"),
      year: field(3, "number"),
      role: field(4, "text"),
      duration: field(5, "text"),
      stack: field(6, "textarea", { description: "One technology per line" }),
      summary: field(7, "textarea", { required: true }),
      challenge: field(8, "textarea"),
      solution: field(9, "bloks", { restrict_components: true, component_whitelist: ["solution_step"] }),
      results: field(10, "bloks", {
        restrict_components: true,
        component_whitelist: ["result"],
        maximum: 3,
      }),
    },
  },
  {
    name: "site_settings",
    display_name: "Site settings",
    is_root: true,
    is_nestable: false,
    schema: {
      email: field(0, "text"),
      reply_text: field(1, "textarea"),
    },
  },
];

const existing: { id: number; name: string }[] = (await api("GET", "/components/")).components;
for (const component of components) {
  const match = existing.find((item) => item.name === component.name);
  if (match) await api("PUT", `/components/${match.id}`, { component });
  else await api("POST", "/components/", { component });
  console.log(`component ${component.name}: ${match ? "updated" : "created"}`);
}

async function findStory(slug: string) {
  const { stories } = await api("GET", `/stories/?with_slug=${slug}`);
  return stories[0] as { id: number } | undefined;
}

let folder = await findStory("works");
if (!folder) {
  folder = (await api("POST", "/stories/", { story: { name: "Works", slug: "works", is_folder: true } })).story;
  console.log("folder works: created");
}

for (const work of works) {
  const content = {
    component: "work",
    title: work.title,
    client: work.client,
    category: work.category,
    year: String(work.year),
    role: work.role,
    duration: work.duration,
    stack: work.stack.join("\n"),
    summary: work.summary,
    challenge: work.challenge,
    solution: work.solution.map((text) => ({ component: "solution_step", text })),
    results: work.results.map((result) => ({
      component: "result",
      value: String(result.value),
      prefix: result.prefix ?? "",
      suffix: result.suffix ?? "",
      label: result.label,
    })),
  };
  const story = { name: work.title, slug: work.slug, parent_id: folder!.id, content };
  const match = await findStory(`works/${work.slug}`);
  if (match) await api("PUT", `/stories/${match.id}`, { story, publish: 1 });
  else await api("POST", "/stories/", { story, publish: 1 });
  console.log(`story works/${work.slug}: ${match ? "updated" : "created"} and published`);
}
