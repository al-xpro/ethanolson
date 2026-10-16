# Ethan Olson | Concept Portfolio

> **Work in progress.** The full-stack features are being built in the open. See the
> [roadmap](#roadmap).

[![CI](https://github.com/al-xpro/portfolio-project/actions/workflows/ci.yml/badge.svg)](https://github.com/al-xpro/portfolio-project/actions/workflows/ci.yml)

A one-page portfolio for **Ethan Olson, a fictional design engineer**, designed and
developed by [AlxPro](https://alxpro.com). It's a concept build: the persona, works and
copy are invented to show how a motion-rich, full-stack portfolio is made.

**Live:** not deployed yet. It will be published at `ethanolson.dev`.

![The hero section: "Design Engineer" next to a 3D Penrose triangle](.github/assets/hero.jpg)

## What it does

- A real-time 3D Penrose triangle in the hero: three straight beams that only look like a
  closed, impossible triangle from one angle, which the intro animation rotates into
- Pinned scroll scenes: a zoom grid, an SVG mask reveal over video, a horizontal services
  track and a column parallax gallery
- Full `prefers-reduced-motion` support: every scene has a static fallback
- An accessible menu: real links and buttons, a focus trap, Escape to close
- SEO: metadata, canonical URL, generated Open Graph image and icons, JSON-LD,
  `robots.txt`, `sitemap.xml` and `llms.txt`

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, statically prerendered) and React 19
- TypeScript and Tailwind CSS 4
- GSAP + ScrollTrigger for scroll scenes, Lenis for smooth scrolling
- React Three Fiber, drei and three.js for the 3D hero

Coming next (see the roadmap): Storyblok, project pages, Neon Postgres with Drizzle, a
contact flow with Zod, Resend and Vercel BotID, Umami, self-built Web Vitals and Cal.com.

## Architecture

```text
app/                  routes, metadata, icons, OG image, robots, sitemap
components/sections/  one component per page section
components/ui/        shared UI (header animation, navbar, gallery, Penrose triangle)
components/providers/ smooth scrolling (Lenis)
content/              all copy and media paths (site.ts, sections.ts)
lib/                  GSAP setup, animation helpers, media-query hooks
```

The page is a Server Component that renders client sections. All scroll animation runs
through `lib/gsap.ts`, inside `gsap.matchMedia()`, so it's skipped when the visitor
prefers reduced motion. Copy and media paths live in `content/`, so the planned CMS
replaces one layer.

## Getting started

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run lint
npm run build
```

### Environment variables

Put them in `.env.local`. Names only here. Never commit values.

| Name | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata, sitemap and robots. Defaults to `https://ethanolson.dev`. |

## How this was built

First version built from January to March 2026; cleaned up and published as `v1.0` in
October 2026 (the clean-up was done with Claude Code); new features developed in the open
since. Built with an agentic workflow: I write issues as specs, agents open the pull
requests, and I review and merge every change.

## Roadmap

[Open issues](https://github.com/al-xpro/portfolio-project/issues) and the
[`v2.0 — Full stack` milestone](https://github.com/al-xpro/portfolio-project/milestones).

## Contributing

Issues are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md), the
[code of conduct](CODE_OF_CONDUCT.md) and the [security policy](SECURITY.md).

## Credits and license

Media sources are listed in [CREDITS.md](CREDITS.md).

© Alex Prostamo. All rights reserved. The code is public so it can be read and reviewed.
It is not licensed for reuse or redistribution. See [LICENSE](LICENSE).
