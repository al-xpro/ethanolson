# Improvement roadmap

An ordered checklist that turns the findings in [project-audit.md](./project-audit.md) into
work. Effort: **S** < 1 h · **M** half a day · **L** 1–2 days.

**Status, 2026-10-12:** every S and M item in Phases 0–5 and 7 is done, except where it
needs your input (marked 👤) or a deployed site (marked 🌐). Phase 6 (L) hasn't started.
Choose its tools in [full-stack-options.md](./full-stack-options.md).

> **Update 2026-10-14:** the removed files are deleted, the history is cleaned and the code
> is on GitHub (see [github-workflow.md](./github-workflow.md)). Phase 6 is specified in
> [issue-drafts.md](./issue-drafts.md).

## Measured after this pass (local production build)

| Metric | Before | After |
| --- | --- | --- |
| ESLint | 19 errors, 30 warnings | **0 errors, 0 warnings** |
| Client JS, gzipped | ≈ 615 KB | **≈ 508 KB** (−17 %) |
| 3D models | 15.3 MB | **16 KB** (laptop removed) |
| `public/` folder | ≈ 22 MB | **≈ 4.1 MB** |
| Animation libraries | GSAP + Motion + Leva | **GSAP only** |
| `<h1>` per page | 6 | **1** |
| Content hidden behind a loader | Whole page, until 3D loaded | **None** |
| Dependencies removed | | 9 (`framer-motion`, `leva`, `maath`, `react-scroll`, `@types/react-scroll`, `react-responsive`, `@iconify/react`, `clsx`, `tailwind-merge`) |

---

## Phase 0: Decide the positioning ✅

- [x] **Concept build.** Ethan Olson is a fictional design engineer, labeled as such in
      the footer, `llms.txt`, metadata and README.
- [x] Keep the Ethan Olson persona as the site's brand. AlxPro stays your brand, credited
      as the creator.
- [x] Make it a **full-stack** case study. Features and tools: see
      [full-stack-options.md](./full-stack-options.md). 👤 Pick one combination.

## Phase 1: Clean up and make it publishable

- [x] Replace the 16 third-party screenshots with original placeholders.
- [x] Remove the case studies section (titles, copy, sticky reveal components).
- [x] Remove the testimonials (Stories section, 20 avatars).
- [x] Remove the About section and `man.png`.
- [x] **S** `CREDITS.md`: Lummi photos, Artgrid videos (now hosted outside the repo),
      and the Sketchfab model. 👤 Add the model's URL and license.
- [x] **S** Contact details live in `content/site.ts`, the email is a `mailto:` link, and
      empty social links are hidden. 👤 Replace `EthanOlson@gmail.com`: it may belong to a
      real person. Use an address on the domain you buy, which forwards to you.
- [x] **S** Delete dead code: `FLoating1…20`, `animateWithGsapTimeline`, the SVG path code,
      unused imports, `landscape.jpg`, create-next-app SVGs, `Planet.jsx` in `tsconfig.json`.
- [x] **S** Remove unused dependencies (9 packages, see above).
- [x] **S** Fix typos, the `id="case studies"` and the relative image path.
- [x] **M** ESLint at 0 errors and 0 warnings.

## Phase 2: Performance

- [x] ~~Compress `mac.glb`~~. The laptop was removed instead (15.3 MB saved).
- [x] **M** No global loader: content renders right away, and the 3D canvas fades in when
      its model is ready.
- [x] **S** The hero canvas stops rendering when it's off-screen (`frameloop` toggled by an
      `IntersectionObserver`).
- [x] **S** The material is memoized and disposed. `reflectivity: 20` dropped.
- [x] **S** The second Lenis instance is gone. `scroll-behavior: smooth` removed.
- [x] **S** `priority` removed from off-screen images.
- [x] **S** Landscape images resized to 2560 px (`landscape-desktop.jpg`,
      `landscape-mobile.jpg`) and served with art direction (`<picture>` via `getImageProps`).
- [x] **S** Posters for both videos. `preload="metadata"` on the intro video.
- [x] **M** One animation engine: Motion (framer-motion) replaced by GSAP in the zoom grid,
      works gallery and outro.
- [x] **S** GSAP is set up once in `lib/gsap.ts` (`gsap/ScrollTrigger`, not `gsap/all`).
- [ ] 🌐 Measure LCP, INP and CLS on the deployed site (PageSpeed Insights, mobile) for the
      case study's "after" numbers.

## Phase 3: Refactor

- [x] **M** Navbar: `<button aria-expanded aria-controls>`, real `<a href="#…">` links, focus
      trap, Escape to close, menu `inert` while closed, no flash before hydration. Visible
      name on the left, "Start a project" button on the right.
- [x] ~~Case Studies refactor~~. Section removed.
- [x] ~~Stories refactor~~. Section removed.
- [x] **S** MiddleParallax kills only its own ScrollTrigger.
- [x] **S** `useMediaQuery` rewritten with `useSyncExternalStore`, plus
      `usePrefersReducedMotion`.
- [x] **S** No `any` left in `lib/animation.ts`, `AnimatedTextLines` or the navbar.
- [x] **M** `app/page.tsx` is a Server Component. Lenis lives in
      `components/providers/SmoothScroll.tsx`.
- [x] **S** Content split into `content/site.ts` and `content/sections.ts`.

## Phase 4: Accessibility and motion safety

- [x] **M** `prefers-reduced-motion`: every scroll animation runs inside
      `gsap.matchMedia()`. With reduced motion, pinned scenes become static (the services
      stack vertically, the mask shows its final frame), Lenis smooth wheel is off, the 3D
      figure stops floating, and CSS transitions are shortened.
- [x] **S** One `<h1>` (Hero). `AnimatedHeaderSection` takes `as="h1" | "h2"`.
- [x] **S** Decorative media has `alt=""` or `aria-hidden`. Work tiles have descriptive alt.
- [x] **S** Contrast raised (service counters, link hover states).
- [ ] 👤 Manual pass: Lighthouse, axe DevTools, and the whole page with keyboard only. I
      checked the page in headless Chrome, with and without reduced motion, at desktop and
      phone widths.

## Phase 5: Content and conversion

- [x] **M** Hero, services, works and contact copy rewritten for a design engineer who
      builds full-stack products.
- [x] **S** Zoom grid shortened from 300vh to 250vh. Services now appear after the hero,
      zoom grid and mask reveal (about 4 screens). Moving them higher means reordering
      sections, which is a design decision. 👤
- [x] **S** "Start a project" button in the header that scrolls to Contact.

## Phase 6: Full-stack features (milestone `v2.0 — Full stack`)

Tools chosen on 2026-10-14. Sixteen issues are drafted in [issue-drafts.md](./issue-drafts.md):

- [ ] Tests (Vitest, Playwright) and a Postgres database (#1, #2)
- [ ] Storyblok, the Works gallery, `/works/[slug]` pages and revalidation (#3–#6)
- [ ] Contact flow: Zod, honeypot, counter-table rate limit, private Storyblok storage,
      Resend, Vercel BotID (#7–#11)
- [ ] Umami, self-built Web Vitals and their dashboard (#12–#14)
- [ ] Cal.com embed (#15) and the videos from Vimeo (#16)

## Phase 7: SEO, GEO and monitoring

- [x] **S** `metadataBase`, canonical URL, Open Graph and Twitter cards,
      `app/opengraph-image.tsx`.
- [x] **S** JSON-LD: a `WebSite` with Alex Prostamo as `creator`. A `Person` schema for
      a fictional person would mislead search engines.
- [x] **S** `public/llms.txt`.
- [x] **S** Generated `app/icon.tsx` and `app/apple-icon.tsx` ("EO" monogram).
- [x] **S** `app/error.tsx` boundary.
- [ ] **S** Analytics: Umami, issue draft #12.
- [x] **S** README rewritten.

## Phase 8: Repository and domain

- [x] Removed files deleted, history cleaned once, code pushed to GitHub (2026-10-14).
- [ ] 👤 Tag `v1.0` and publish the release ([github-workflow.md §3](./github-workflow.md#3-tag-v10-and-publish-the-release-alex)).
- [ ] 👤 At the end: About, social preview, pull request settings, ruleset, labels,
      milestone, project board ([github-workflow.md §4](./github-workflow.md#4-repository-setup-at-the-end-of-the-project)).
- [ ] 👤 Domain. Recommended: a free subdomain of your own site, for example
      `ethanolson.alxpro.com`, so the concept builds authority for AlxPro. If you want a
      standalone name, `ethanolson.dev` was available on 2026-10-12 ($9.99 first year,
      $13/year renewal on Vercel). `ethanolson.com` is taken. Set `NEXT_PUBLIC_SITE_URL`
      once it's live.

## Phase 9: Write the case study

Follow [case-study-plan.md](./case-study-plan.md).
