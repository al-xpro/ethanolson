# Ethan Olson | Concept Portfolio

> **Work in progress.** The full-stack features are being built in the open. See the
> [roadmap](#roadmap).

[![CI](https://github.com/al-xpro/ethanolson/actions/workflows/ci.yml/badge.svg)](https://github.com/al-xpro/ethanolson/actions/workflows/ci.yml)

A portfolio for **Ethan Olson, a fictional design engineer**, designed and
developed by [AlxPro](https://alxpro.com). It's a concept build: the persona, works and
copy are invented to show how a motion-rich, full-stack portfolio is made.

**Live:** not deployed yet. It will be published at `ethanolson.alxpro.com`.

![The hero section: "Design Engineer" next to a 3D optical illusion](.github/assets/hero.jpg)

## What it does

- Pages: home, about, services, works with a page per project, contact, privacy, terms
  and a 404 page
- A real-time 3D optical illusion in the hero, in black metal, that turns into place on load
- Original GSAP scroll scenes on every page: a zoom grid, a mask reveal over video, a
  testimonials deck, a sticky services timeline with diagrams built in code, a cursor
  preview for the works, a framed cover parallax per project, and a sticky reveal footer
- A contact form with a shared Zod schema, live validation and a server action that works
  without JavaScript, next to an availability calendar that shows different free days
  every month (generated from the month, no booking service)
- Full `prefers-reduced-motion` support: every scene has a static fallback
- Accessible navigation: real links and buttons, a focus trap, Escape to close, visible
  focus on every control
- SEO: metadata, canonical URL, generated Open Graph image and icons, JSON-LD,
  `robots.txt`, `sitemap.xml` and `llms.txt`

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, statically prerendered) and React 19
- TypeScript and Tailwind CSS 4
- GSAP + ScrollTrigger for scroll scenes, Lenis for smooth scrolling
- React Three Fiber, drei and three.js for the 3D hero
- Zod for validation, Vitest and Playwright for tests

- Storyblok as the CMS, with the Visual Editor: every page's text, images and videos, the
  works (including new ones) and their animated blocks, checked against a content model

Coming next (see the roadmap): Neon Postgres with Drizzle, rate limiting and Resend e-mails
for the contact flow, Umami and self-built Web Vitals.

## Architecture

```text
app/                  routes, metadata, icons, OG image, robots, sitemap
components/sections/  the home page sections
components/pages/     one view per page (services, works, about, contact, legal, 404)
components/ui/        shared UI (header animation, navbar, footer, diagrams, 3D figure)
components/providers/ smooth scrolling (Lenis)
components/cms/       pages composed from content, CMS image, Visual Editor helpers
content/defaults/     the default content (used without Storyblok, and to fill it)
content/ui.ts         interface copy that stays in code (labels, the form, the 404 page)
lib/cms/              content model, Storyblok fetching, validation, live editing
lib/                  GSAP setup, animation helpers, media-query hooks
scripts/              Storyblok setup and preview, media manifest
```

Pages are Server Components that load their content and render client sections. All
scroll animation runs through `lib/gsap.ts`, inside `gsap.matchMedia()`, so it's skipped
when the visitor prefers reduced motion.

**Content.** `lib/cms/model.ts` describes everything editable once, with zod: each field's
type, limits (characters, number of items, file weight) and help text. The same model
generates the Storyblok components, types the content, and validates what Storyblok sends.
A field that breaks a rule falls back to its default (the published site never shows
broken content), and the Visual Editor lists the problem on the page. Without Storyblok
(CI, a fresh clone), the site renders `content/defaults`.

## Getting started

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run lint
npm run build
npm test           # unit tests (Vitest)
npm run test:e2e   # end-to-end tests (Playwright, builds the site first)
```

### Environment variables

Put them in `.env.local`. Names only here. Never commit values.

| Name | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata, sitemap and robots. Defaults to `https://ethanolson.alxpro.com`. |
| `STORYBLOK_PUBLIC_TOKEN` | Storyblok public token, for published content (server only). |
| `STORYBLOK_PREVIEW_TOKEN` | Storyblok preview token, for drafts in draft mode (server only). |
| `STORYBLOK_DRAFT_SECRET` | Protects `/api/draft`, the Visual Editor's entry point. |
| `STORYBLOK_WEBHOOK_SECRET` | Checks that publish webhooks (`/api/revalidate`) come from Storyblok. |
| `STORYBLOK_SPACE_ID` | The content space, for `npm run storyblok:setup`. |
| `STORYBLOK_MANAGEMENT_TOKEN` | Personal access token, for `npm run storyblok:setup`. |

### Storyblok

- `npm run storyblok:setup` creates the components from the content model and fills the
  space with the default content and media. Run it again after changing the model.
- `npm run preview:storyblok` serves the production build on `https://localhost:3010` for
  the Visual Editor (draft mode needs HTTPS and a production server; run `mkcert -install`
  once). The space's preview location is
  `https://localhost:3010/api/draft?secret=<STORYBLOK_DRAFT_SECRET>&slug=`.
- Publishing calls `/api/revalidate` (a signed webhook), which refreshes the site.
- `npm run media` updates `content/media.ts` after a file in `public/` changes.

## How this was built

I'm the developer on this project, working with AI coding agents
([Claude Code](https://claude.com/claude-code)) the way a lead works with a pair
programmer. I own the architecture, the specs and the code that ships. Agents draft
implementations; I read every diff, run it, and change the code myself until it's right.

Every change goes through the same loop:

1. **Spec.** Each change starts as an issue with context, a goal and acceptance criteria.
   Example: [#82](https://github.com/al-xpro/ethanolson/issues/82), the home page freezes
   in Safari.
2. **Implement on a branch.** The first draft runs typecheck, lint, tests and the build
   before I see it.
3. **Review and change it locally.** I read the diff, run the site in Safari and Chrome, on
   a phone and with reduced motion, and edit the code directly where it needs it: the
   lighting values of the 3D hero, layouts, copy. Nothing is pushed before I've used it.
4. **Pull request.** What, Why and How to test, linked to its issue. CI has to pass, and I
   merge.
5. **Ship.** A merge into `main` deploys to production.

Small, safe changes (docs, chores, patch updates) take a **fast lane**: no issue, and the
pull request merges itself when CI is green. Features, data, security and CI take the
**review lane** above. The [project board](https://github.com/users/al-xpro/projects/5)
shows both.

Commits drafted with an agent carry a `Co-Authored-By` trailer, so the history is honest
about how the work was done. The first version was built from January to March 2026,
published as `v1.0` in October 2026, and developed in the open since.

## Roadmap

[Open issues](https://github.com/al-xpro/ethanolson/issues) and the
[`v2.0 — Full stack` milestone](https://github.com/al-xpro/ethanolson/milestones).

## Contributing

Issues are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md), the
[code of conduct](CODE_OF_CONDUCT.md) and the [security policy](SECURITY.md).

## Credits and license

Media sources are listed in [CREDITS.md](CREDITS.md).

© AlxPro. All rights reserved. The code is public so it can be read and reviewed.
It is not licensed for reuse or redistribution. See [LICENSE](LICENSE).
