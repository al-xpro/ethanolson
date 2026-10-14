# Case study plan: from this repo to alxpro.com

How to turn this project into a **full-stack** case study at
`alxpro.com/portfolio/<slug>`, following [case-study-guide.md](./case-study-guide.md). The
final hand-back is a `lib/data/case-studies/<slug>.ts` file in the alxpro.com repo.

> **Rule zero: the case study only claims what the live site does.** The outline below
> follows the stack chosen on 2026-10-14 (Storyblok, project pages, contact flow, Umami,
> self-built Web Vitals, Cal.com). The features are specified in
> [issue-drafts.md](./issue-drafts.md). Never invent a number:
> write `TODO: measure` until you have one.

**Positioning:** a concept build. Ethan Olson is a fictional design engineer, and the case
study says so in its first two sentences. The story is "how I'd build a real client's
portfolio end to end", told through a persona.

---

## 1. Workflow

| # | Step | Output |
|---|------|--------|
| 1 | Merge today's cleanup PR and deploy | A clean baseline |
| 2 | Measure the deployed site: LCP, INP, CLS (PageSpeed Insights, mobile, median of 3) | "Before full stack" numbers |
| 3 | Build the Phase 6 features, one PR each | Working back end |
| 4 | Measure again, plus the back-end numbers (form round trip, revalidation time) | `stats` blocks |
| 5 | Build the sandboxes (§5) on codesandbox.io, public, React + TS | Sandbox ids |
| 6 | Record the media (§6) | `.webp` / `.mp4` in `/portfolio/case-studies/<slug>/` |
| 7 | Write the blocks file and the `caseStudies` object | `<slug>.ts` |
| 8 | Self-review with §8, then publish | Live page |

---

## 2. Hero and short process (draft)

- **Slug:** `ethan-olson-portfolio`
- **Title:** Ethan Olson Portfolio
- **One-liner:** A concept portfolio for a fictional design engineer, built end to end:
  CMS, project pages, a protected contact pipeline and motion that respects every visitor.
- **Live link:** the domain you choose (`NEXT_PUBLIC_SITE_URL`)
- **Technologies:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, GSAP, Lenis, React
  Three Fiber, Storyblok, Postgres + Drizzle, Zod, Resend, Vercel BotID, Umami, Cal.com

```ts
caseStudies: {
  context: "A concept portfolio for a fictional design engineer, built like client work.",
  goals: "Turn a motion-heavy one-pager into a fast, editable, full-stack product.",
  approach: "Next.js on Storyblok for content, with a small Postgres for the counters.",
  focus: "Data model, caching, the contact pipeline and real-user performance.",
  steps: [
    { title: "Brief", body: "A design engineer's portfolio had to feel cinematic, but also be editable, measurable and able to take real enquiries.", chapter: "Brief" },
    { title: "Data", body: "Works, settings and enquiries live in one Postgres database behind a CMS, so content changes never need a deploy.", chapter: "Data model" },
    { title: "Contact", body: "Every enquiry is validated on the server, checked for spam, stored and then e-mailed, so nothing gets lost.", chapter: "Contact flow" },
    { title: "Outcome", body: "TODO: one or two sentences with measured results." },
  ],
  results: [ /* see §4 */ ],
}
```

---

## 3. Long process outline (draft, 15 entries)

**Opening `text` block:**
> Ethan Olson is a fictional design engineer, and this is the portfolio I built for him as
> if he were a client. **A cinematic one-pager became a full-stack product: editable,
> measurable and fast.**

| # | Type | id | Title | Blocks | Interactive part |
|---|------|----|-------|--------|------------------|
| 01 | chapter | `brief` | Brief | `text`, `table` (in scope vs left out), `decision` (concept persona over a template) | |
| 02 | chapter | `architecture` | Architecture | `list` (layers), `steps` (a request's path), `decision` (hosted CMS + small Postgres, over one database for everything) | |
| 2.01 | subchapter | `data-model` | Data model | `code` (Storyblok components, Postgres tables), `table` (who can read what: why enquiries live in a private space) | |
| 03 | chapter | `project-pages` | Project pages | `text`, `media` video | |
| 3.01 | subchapter | `caching` | Caching | `steps` (publish → hook → `revalidateTag` → fresh page), `code` (the hook) | |
| 3.02 | subchapter | `gallery-to-page` | Gallery to page | `sandbox` (mock stories to tiles and pages) | Sandbox 1 |
| 04 | chapter | `contact-flow` | Contact flow | `steps` (form → server action → validation → rate limit → store → e-mail) | |
| 4.01 | subchapter | `validation` | Validation | `sandbox` (form states), `playground` (the server action and its schema) | Sandbox 2, playground |
| 4.02 | subchapter | `spam-defense` | Spam defense | `list` (honeypot, BotID, counter-table rate limit), `code` (the atomic upsert) | |
| 05 | chapter | `booking` | Booking | `decision` (Cal.com embed loaded on click), `media` video | |
| 06 | chapter | `motion-layer` | Motion layer | `sandbox` (mask reveal), `decision` (GSAP only, Motion removed) | Sandbox 3 |
| 6.01 | subchapter | `reduced-motion` | Reduced motion | `sandbox` (the same scene with `prefers-reduced-motion`) | Sandbox 4 |
| 07 | chapter | `performance` | Performance | `callout` **incident** (§7), `stats` (before → after) | Figures |
| 08 | chapter | `observability` | Observability | `steps` (vitals → endpoint → Postgres → dashboard), `media` (dashboard screenshot) | |
| 09 | chapter | `outcome` | Outcome | `text`, `list` (lessons), final `stats` (feeds the short process) | Figures |

Drop or merge chapters for features you don't build (for example, without the booking
widget, chapter 05 goes). Below 8 entries, split Contact flow or Performance further.

### Numbers already measured (local production build, 2026-10-11 → 2026-10-12)

| Metric | Before | After cleanup |
| --- | --- | --- |
| Client JS, gzipped | ≈ 615 KB | ≈ 508 KB |
| 3D models | 15.3 MB | 16 KB |
| `public/` folder | ≈ 22 MB | ≈ 4.1 MB |
| ESLint | 19 errors, 30 warnings | 0 |
| Animation libraries | 3 (GSAP, Motion, Leva) | 1 (GSAP) |

Still to measure on the deployed site: LCP, INP, CLS, contact round trip, revalidation
time after publish.

---

## 4. Results (pick 6 or 9; 3–6 words, no full stop)

**True today:**
- "Content visible before 3D loads"
- "15 MB of 3D cut"
- "Every scene has reduced motion"
- "Keyboard-friendly navigation"
- "One animation engine"
- "Zero lint errors"

**True after Phase 6 (verify first):**
- "Content edited without deploys"
- "Every enquiry stored and e-mailed"
- "Spam blocked before the inbox"
- "Real-user vitals on a dashboard"
- "LCP ⟨X⟩ s on mobile" (TODO: measure)

---

## 5. Sandboxes to create

Self-contained React + TypeScript (Vite), with mock data and no secrets, private URLs or
unlicensed media.

| # | Placeholder id | Title | Files | Demonstrates |
|---|----------------|-------|-------|--------------|
| 1 | `works-gallery` | Works gallery to project page | `/src/App.tsx`, `/src/Gallery.tsx`, `/src/ProjectPage.tsx`, `/src/works.ts` | Mock Storyblok stories mapped to tiles and pages |
| 2 | `contact-form` | Contact form states | `/src/ContactForm.tsx`, `/src/schema.ts`, `/src/mockAction.ts` | Shared Zod schema, field errors, pending and success states on a mocked action |
| 3 | `mask-reveal` | Mask reveal over video | `/src/MaskReveal.tsx`, `/src/mask.svg` | Pinned GSAP timeline, `matchMedia` scale per breakpoint |
| 4 | `reduced-motion` | Same scene, reduced motion | `/src/MaskReveal.tsx`, `/src/motion.ts` | `gsap.matchMedia` with `(prefers-reduced-motion: reduce)` and the static frame |

Playground (one editable file, 10–30 lines): `actions/contact.ts`, a server action with its
schema and error states.

---

## 6. Media to record

Videos are 5–15 s, 16:9, muted, under 4 MB. Images are real UI at 2×, in WebP.

| Path | Kind | Must show |
|------|------|-----------|
| `cover.webp` | image | Hero with the 3D figure, desktop |
| `cover-mobile.webp` | image | The same hero in a phone frame |
| `cms-publish.mp4` | video | Editing a project in the CMS, publishing, then refreshing the live page |
| `project-page.mp4` | video | Clicking a Works tile and landing on its project page |
| `contact-flow.mp4` | video | Filling in the form, the pending state, the success message, the e-mail arriving |
| `mask-reveal.mp4` | video | The mask reveal scene |
| `reduced-motion.mp4` | video | The same scroll with reduced motion turned on |
| `vitals-dashboard.webp` | image | The web vitals dashboard with real data |

---

## 7. Incident worth telling

**The page that waited for a laptop.** *Symptom:* visitors saw "Loading N %" before any
content. *Root cause:* a global `useProgress()` gate waited for every asset, including a
15.3 MB 3D laptop that only appeared at the very bottom. *Fix:* remove the laptop, drop the
global loader, and fade each canvas in on its own. *Prevention:* an asset budget checked in
CI (for example, fail the build if any file in `public/models` exceeds 1 MB).

Add any real incident from building Phase 6 (a webhook firing twice, a cache that didn't
revalidate). Readers trust a case study more when it shows something going wrong.

---

## 8. Pre-publish checklist

- [ ] The first two sentences say the persona is fictional.
- [ ] Every image and video is your own capture of *this* project.
- [ ] Every number is measured, with tool and date noted in your hand-back.
- [ ] 8–15 chapters and subchapters, titles 1–3 words, unique kebab-case ids.
- [ ] Every main feature has a sandbox, playground, video or `stats` block.
- [ ] Results: 6 or 9 items, 3–6 words, no full stops.
- [ ] Only `**bold**`, `*italic*` and `` `code` `` in text fields.
- [ ] American English, short sentences, active verbs.
- [ ] The case study links to the public repository.
