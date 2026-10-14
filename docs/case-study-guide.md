# Writing a case study for alxpro.com

You are working in the codebase of a project that Alex Prostamo built. Alex wants it on
their portfolio site (alxpro.com/portfolio/<slug>) as a case study. Your job is to read
this codebase and write that case study's content in the format below, then hand back
the files listed under [What to hand back](#what-to-hand-back).

The portfolio sells web work by **showing it working**. A case study is not a summary
with screenshots. It is a guided tour of the project's main features, where the reader
can run, edit and poke at each one.

## The page at a glance

Each project page has these parts, top to bottom:

1. **Hero:** title, one-line description, live link, technologies.
2. **Highlights:** cover images and videos.
3. **Process:** a switch between two versions of the story.
   - **Short:** a row of figures and the story in a few short steps, for readers in a hurry.
   - **Long:** the full case study, in chapters. A minimap on the right lists the
     chapters, and readers jump between them from there.
4. **Results:** short sentences in a chess grid (alternating cells).
5. **Related projects.**

You write parts 3 and 4. Part 1 already exists or is filled in by hand.

## Short process

The short process is the story at a glance: a row of figures, then a few short steps.
Neither is a fixed template. Use as many figures and steps as the story needs, and name
the steps after this project's story, not a generic outline.

- **Steps:** usually 3–5. Each has a short title (1–2 words) and a body of one or two
  plain sentences (about 20–40 words), with no lists, markdown or jargon a client wouldn't
  know. Pick the titles the project calls for: "Challenge · Approach · Outcome" for one,
  "Brief · Motion · Outcome" for another, "Challenge · Architecture · Security · Outcome"
  for a platform. Don't repeat what the hero already shows, such as the tech stack.
- **Chapter links:** a step can name a long-process chapter. It then gets a
  "Read “Chapter title”" button that opens the long process at that chapter.
- **Figures:** any number. They default to the _last_ `stats` block of the long process,
  all of its items, so make that block the outcome numbers. Set `figures` only when the
  short process needs different ones.

```ts
caseStudies: {
  context: string;   // One line: who it is for. Shown on the home page.
  goals: string;     // One line: what success meant. Shown on the home page.
  approach: string;  // One line: the shape of the solution. Shown on the home page.
  focus: string;     // One line: what got the most care. Shown on the home page.
  steps: { title: string; body: string; chapter?: string }[];
  figures?: { label: string; value: string; note?: string }[];
  results: string[]; // See "Results" below.
}
```

## Long process

The long process is an ordered array of blocks. A `chapter` block starts a new chapter;
every block after it belongs to that chapter until the next `chapter`.

### Rules

- **8–15 chapters and subchapters in total.** A `chapter` opens a part of the story; a
  `subchapter` opens a section inside the chapter above it. A chapter can have no
  subchapters or as many as it needs: give a part subchapters when it has more than
  one thing to show, such as each decision in a log, or each step of a pipeline.
- **Numbering is automatic.** Chapters are numbered 01, 02…; subchapters after their
  chapter, 1.01, 1.02… The minimap shows subchapters as shorter bars, and its menu
  indents them under their chapter.
- **Titles are 1–3 words**, because they appear in a compact menu, for example
  "Scene graph", "Checkout" or "Incident".
- **Ids** are kebab-case and unique across all chapters and subchapters of the case
  study (`"water-shader"`).
- **Open with one `text` block before the first chapter.** It is the hook: what the
  project is, in two sentences, with the key idea in **bold**.
- **Every main feature gets something the reader can use.** That can be a sandbox, a
  playground, a video of the real thing, or a set of figures. A chapter that is only
  prose is a missed chance.
- **No two case studies share a structure.** Pick the blocks the story needs: a decision
  log, a build log, a render pipeline, an incident report. See [Recipes](#recipes).
- Inline formatting in `body`, `items`, `why` and `caption` is limited to `**bold**`,
  `*italic*` and `` `code` ``. No other markdown is rendered.
- Write in American English (color, optimize), with short sentences and active verbs.
  Never invent a number. If a figure isn't measured yet, write `TODO: measure` and list
  it in your hand-back.

### Blocks

```ts
type CaseStudyBlock =
  | { type: "chapter"; id: string; title: string }
  | { type: "subchapter"; id: string; title: string }
  | { type: "text"; body: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "table"; columns?: string[]; rows: string[][]; caption?: string }
  | { type: "quote"; body: string }
  | { type: "code"; filename: string; language: string; code: string; caption?: string }
  | { type: "playground"; filename: string; language: string; code: string; caption?: string }
  | { type: "sandbox"; id: string; title: string; file?: string; caption?: string }
  | { type: "media"; kind: "image" | "video"; src: string; caption: string }
  | { type: "stats"; items: { label: string; value: string; note?: string }[] }
  | { type: "steps"; items: { label: string; title: string; body: string }[] }
  | { type: "decision"; title: string; chosen: string; over: string[]; why: string }
  | { type: "callout"; tone: "note" | "incident"; title: string; body: string };
```

| Block        | Use it for                                                                                                                                                                                                                                                                                           |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sandbox`    | **The main way to show a feature.** A CodeSandbox project with several files and a live preview. See [Sandboxes](#sandboxes).                                                                                                                                                                        |
| `playground` | One editable file, 10–30 lines, highlighted with the site's theme. Use it for a config, a shader uniform or a server action, where changing a value teaches something.                                                                                                                               |
| `code`       | Read-only code: the key 10–25 lines, never a whole file. Use `language: "bash"` with a `filename` such as `terminal` for commands and their output.                                                                                                                                                  |
| `media`      | Real screenshots (`image`) and screen recordings (`video`, autoplayed muted on a loop).                                                                                                                                                                                                              |
| `stats`      | 3 or 4 figures: Core Web Vitals, bundle size, frame budget, uptime, conversion.                                                                                                                                                                                                                      |
| `steps`      | Things in order: build weeks, an incident's timeline, scenes, a pipeline.                                                                                                                                                                                                                            |
| `decision`   | One choice: what was picked, over which alternatives, and why.                                                                                                                                                                                                                                       |
| `callout`    | `incident` for what broke (amber); `note` for an aside worth boxing.                                                                                                                                                                                                                                 |
| `list`       | 2–5 short points: architecture layers, lessons, next steps. Set `ordered: true` for numbered steps, where the order matters: a checkout flow, a setup, a request's path.                                                                                                                             |
| `table`      | Comparisons and specs. With `columns`, it has a header row: a breakdown per pass, options against criteria, before and after. Without `columns`, the first column names each row, like a spec sheet: camera settings, constraints, limits. Keep cells short; wide tables scroll sideways on a phone. |
| `quote`      | One line from the client or a user. Use it at most once.                                                                                                                                                                                                                                             |
| `text`       | Prose between the parts above. Keep it to 2–4 sentences per block.                                                                                                                                                                                                                                   |

### What a long process should cover

Not every project needs every item, but go through the list and include each one that
was real work:

- **Interactive UI:** the components, animations and sections worth showing, each in a
  sandbox or playground.
- **Data:** the schema, queries, caching, and server functions or actions.
- **Design:** the system, tokens, typography and motion principles.
- **Architecture:** the layers and services, and how a request travels through them.
- **Build:** how the work was sequenced, plus tooling and CI.
- **Performance:** measured Core Web Vitals (LCP, INP, CLS), bundle size, image and font
  strategy, rendering choices (static, dynamic, streaming).
- **Security:** auth, input validation, headers (CSP), secrets handling, rate limits.
- **SEO and GEO:** metadata, structured data, sitemap, and llms.txt or other ways the site
  is made readable for AI answers.
- **Monitoring:** error tracking, analytics, alerts, uptime.
- **Requirements:** what the client asked for, and what was agreed to leave out.
- **Incidents and struggles:** what broke or was hard, from symptom to root cause to fix
  to prevention. Readers trust a case study more when it admits difficulty.
- **Outcome:** the measured result.

## Sandboxes

The interactive heart of a case study. Feature them generously.

- **One feature, 2–3 sandboxes.** Explain a component, animation or section in steps:
  1. The bare idea (minimal, around 30 lines).
  2. The real behavior (state, data, edge cases).
  3. The production version (accessibility, performance, the polish that shipped).
- **Multi-file and real.** Split code the way the project does: components, hooks,
  styles, mock data. A sandbox should feel like a slice of the product, not a snippet.
- **Self-contained.** Mock the APIs, databases and env vars with local data. **Never put
  secrets, private URLs, client data or proprietary code into a public sandbox.** If the
  code can't be shared, rebuild the idea from scratch.
- **Light on dependencies.** Use the project's real libraries where they matter
  (Motion, GSAP, three.js), but skip anything the feature doesn't need.
- **Setup:** create the sandbox on codesandbox.io (React + TypeScript template, or Vite),
  make it public, and copy the id from its URL. Set `file` to the file that should open
  first, for example `"/src/Carousel.tsx"`.
- The embed loads only when the reader presses "Run the sandbox", so three or more per
  case study are fine.

```ts
{
  type: "sandbox",
  id: "carousel-step-2-x7k2p9",
  title: "Carousel — snapping and keyboard",
  file: "/src/Carousel.tsx",
  caption: "Arrow keys move between slides; focus follows the active one.",
}
```

## Media

- Paths: `/portfolio/case-studies/<slug>/<name>.webp` or `.mp4`. List each one in your
  hand-back and describe what it must show; Alex records them.
- Videos: 5–15 s screen recordings of one interaction, no audio, under 4 MB, 16:9.
- Images: real UI at 2× resolution, 16:9 or the device's own ratio, in WebP.
- A missing asset shows a "coming soon" placeholder, so it's safe to list one before it
  exists.

## Results

Short sentences for the chess grid: **3–6 words each, no full stop, 6 or 9 of them** (the
grid is 2 or 3 columns wide). Mix outcomes with qualities:

```ts
results: [
  "LCP 1.6 s on product pages",
  "Catalog edited without developers",
  "Two-step checkout",
  "48 components from scratch",
  "Zero card data on our servers",
  "Accessible sign-in out of the box",
];
```

## Recipes

Starting points, not templates. Change the chapters to fit the project. Each recipe lists
chapters only: split them into subchapters to reach 8–15 entries in total. For example,
"Scroll scenes" might become 2.01 Pinning, 2.02 Parallax and 2.03 Reduced motion.

**Portfolio with animations**

- Chapters: Intro sequence · Scroll scenes · Motion system · Performance · Lessons.
- Two or three sandboxes for the signature animation: the timeline alone, then with
  scroll, then reduced-motion and mobile.
- A `stats` block for frame budget and LCP, and a video of the real thing.

**Platform with a database**

- Chapters: Data model · Auth and roles · Core flow · Real-time · Security · Monitoring.
- A `code` block with the schema, and a sandbox of the core flow running on mock data.
- `decision` blocks for the database, the ORM and the auth provider.
- An incident, if one happened.

**3D scene**

- Chapters: Scene graph · Shaders · Interaction · Frame budget · Loading.
- A `playground` for shader uniforms, and sandboxes for the scene and the interaction.
- A `stats` block for draw calls, shader cost and first frame.

**Blog with caching and server functions**

- Chapters: Content model · Rendering · Caching · Search · SEO and GEO · Outcome.
- `steps` for the request lifecycle, and a `code` block with the cache tags and their
  revalidation.
- A terminal-style `code` block showing build output, and `stats` for TTFB and LCP.

**E-commerce**

- Chapters: Catalog · Product page · Cart · Checkout · Admin · Outcome.
- Sandboxes for the cart drawer and the product gallery, and a `playground` for the
  server checkout action.

**AI product**

- Chapters: Prompting · Streaming UI · Tools · Guardrails · Costs · Evals.
- A sandbox of the streaming chat on a mocked stream, and `stats` for latency and cost
  per request.

## What to hand back

1. `lib/data/case-studies/<slug>.ts`:

   ```ts
   import type { CaseStudyBlock } from "@/lib/data/data";

   /** <Project> — told as <the structure you chose>. */
   export const <camelSlug>CaseStudyBlocks: CaseStudyBlock[] = [ /* … */ ];
   ```

2. The `caseStudies` object: the home-page lines, the `steps`, any `figures`, and `results`.
3. **Sandboxes to create:** for each one, the files, what it demonstrates, and the
   placeholder id you used.
4. **Media to record:** for each item, the path and what it must show.
5. **TODOs:** every figure still to measure, and anything you weren't sure is public.
