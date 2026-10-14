# Project audit: Ethan Olson Portfolio

Audit date: 2026-10-11 · Next.js 16.1.4 · React 19.2 · Tailwind 4 · GSAP 3.14 · Motion 12 · React Three Fiber 9

> **Status, 2026-10-12:** this audit describes the code *before* the cleanup pass.
> Testimonials, About, Case Studies and the 3D laptop have since been removed, and most
> findings are fixed. See [improvement-roadmap.md](./improvement-roadmap.md) for what's done.

This is an honest review of the codebase before it becomes a case study on alxpro.com.
It covers what the project does well, where it is weak, and a verdict for every part:
**keep**, **redesign**, **refactor**, **remove** or **delete**. The ordered to-do list is in
[improvement-roadmap.md](./improvement-roadmap.md).

---

## 1. Measured baseline

These numbers were measured on the current code. Use them as the "before" figures in the
case study's performance chapter.

| Metric                            | Value                                   | Verdict                    |
| --------------------------------- | --------------------------------------- | -------------------------- |
| Production build                  | Passes (`next build`, all routes static) | Good                       |
| ESLint                            | **19 errors, 30 warnings**               | Must fix                   |
| Client JS (all chunks, gzipped)   | **≈ 615 KB**                             | Too heavy                  |
| Largest chunk (three.js + drei + leva) | 1.58 MB raw / **465 KB gzipped**    | Too heavy                  |
| `public/models/mac.glb`           | **15.3 MB**                              | Critical, blocks the page  |
| `public/models/Figure.glb`        | 16 KB                                    | Fine                       |
| `landscape-big.jpg` / `landscape-small.jpg` | 7680×4320 (722 KB) / 4320×7680 (480 KB) | Oversized source files |
| Sections on the home page         | 11 + navbar                              | Long, see §4               |
| Live WebGL canvases               | 2 (Hero, Contact), both always rendering | Wasteful                   |
| Tests                             | None                                     | Acceptable for a portfolio |

Still to measure on the deployed site: LCP, INP, CLS (PageSpeed Insights, mobile), time
until the loader disappears on 4G, and FPS during the Services and Stories scenes.

---

## 2. Media audit

### Done in this pass

The 16 screenshots of third-party designs were removed and replaced with original
wireframe placeholders that match the site's monochrome style:

| Removed (third-party UI)                        | Replaced with                             | Used in                 |
| ----------------------------------------------- | ----------------------------------------- | ----------------------- |
| `public/projects/project-01.jpg` … `project-12.jpg` (Framer templates, AI landing pages, crypto dashboards…) | `public/projects/work-01.svg` … `work-12.svg` (1080×1920) | Works column parallax |
| `public/projects/casestudies-01.jpg` … `casestudies-04.jpg` (marketing agency, Mariven, AI assistant mockups) | `public/projects/case-study-01.svg` … `case-study-04.svg` (1920×1080) | Case Studies sticky reveal |

The paths in [lib/data.ts](../lib/data.ts) were updated, and the case study `alt` texts no
longer name the original designs. Each SVG is 2–3 KB, so the Works and Case Studies
sections are now lighter than before. `next/image` serves `.svg` files unoptimized by
default, so no config change was needed.

### Still to decide

| Asset                                                      | What it is                                         | Risk                                                                 | Recommendation |
| ---------------------------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------- | -------------- |
| `public/avatars/*.jpg` (20 faces)                          | Stock or AI faces next to **invented testimonials** | **High.** Fake reviews with real-looking faces hurt credibility and may break platform or consumer-protection rules. | **Delete** or relabel the section as sample content (see §5). |
| `lib/data.ts` case study **titles and descriptions**       | Copy that describes the removed third-party designs ("Mariven", "Premium Agency"…) | Medium. The images are gone, but the text still claims that work. | **Rewrite** as clearly fictional projects, or replace with your own projects. |
| `public/images/man.png`                                    | Portrait presented as "About" Ethan                 | Medium. Unknown license, and it reads as a real person.              | Replace with your own photo, or with a non-person visual. |
| `public/images/*.jpg` (draw, particles, interior, metro, laptop, pen, services, water, landscape) | Black-and-white stock photography | Low, if licensed (Unsplash or Pexels are fine). | **Keep**, but write each source and license in a `CREDITS.md`. |
| `public/videos/design.mp4`, `water-ripple.mp4`             | Stock footage (stylus on tablet, water)             | Low, if licensed.                                                    | Keep and credit. |
| `public/models/mac.glb`, `Figure.glb`                      | 3D models of unknown origin                         | Medium. A laptop model can carry brand trade dress, and the license is unknown. | Confirm the license (Sketchfab CC-BY needs credit), or model your own. |
| `public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` | create-next-app leftovers                | None                                                                 | **Delete** |
| `public/images/landscape.jpg`                              | Unused                                              | None                                                                 | **Delete** |
| `lib/data.ts` `FLoating1` … `FLoating20`                   | 20 exports that point to `/images/sea.avif`, which doesn't exist | None, it's dead code                                  | **Delete** |

---

## 3. Pros: what this project is good at

1. **A strong visual identity.** The strict monochrome palette, one serif (Playfair), huge
   uppercase titles, rounded "sheet" sections (`rounded-t-4xl` / `rounded-b-[3vw]`) and
   black-and-white photography make it feel like one considered piece. It doesn't look like
   a template.
2. **A wide motion range in one page.** Few portfolios show this many techniques together.
   It's the best raw material for a "motion engineer" case study:
   - a **3D hero** with a physically based metal material and an intro rotation ([Hero.tsx](../components/sections/Hero.tsx), [ObjectIllustionHero.tsx](../components/ui/ObjectIllustionHero.tsx));
   - a **zoom grid** where six images scale from 1× to 4–9× on scroll ([ZoomParallax.tsx](../components/sections/ZoomParallax.tsx));
   - a **pinned SVG mask reveal** over video, with a `gsap.matchMedia` scale for mobile ([IntroParallax.tsx](../components/sections/IntroParallax.tsx));
   - a **pinned horizontal track** for the services ([Services.tsx](../components/sections/Services.tsx));
   - a **four-column speed-offset parallax** gallery ([WorkParallax.tsx](../components/ui/WorkParallax.tsx));
   - a **sticky scroll reveal** with separate mobile and desktop logic ([StickyScrollRevealLarge.tsx](../components/ui/StickyScrollRevealLarge.tsx), [StickyScrollRevealSmall.tsx](../components/ui/StickyScrollRevealSmall.tsx));
   - a **three-plane depth field** with inertial mouse parallax ([Stories.tsx](../components/sections/Stories.tsx));
   - a **pointer-driven 3D camera** with `maath` damping ([CustomCamera.tsx](../components/ui/CustomCamera.tsx)).
3. **A reusable section header.** [AnimatedHeaderSection.tsx](../components/ui/AnimatedHeaderSection.tsx)
   plus [AnimatedTextLines.tsx](../components/ui/AnimatedTextLines.tsx) give six sections
   the same entrance animation. It's a small but real motion system.
4. **Content separated from layout.** Almost all copy lives in [lib/data.ts](../lib/data.ts),
   so rebranding means editing one file.
5. **Mobile is clearly thought about.** `ScrollTrigger.config({ ignoreMobileResize: true })`
   for the Safari address bar, a separate mobile scale in the mask reveal, a dedicated
   mobile sticky reveal, a portrait landscape image for phones, and `min-w-[320px]` guards.
6. **A modern stack.** Next.js 16 App Router, React 19, Tailwind 4, Turbopack, a typed
   `robots.ts` and `sitemap.ts` driven by `NEXT_PUBLIC_SITE_URL`.
7. **Fluid sizing at large widths.** `xl:text-[5vw]`-style values keep the composition
   identical on 1440p and 4K screens. That's rare and it looks premium.

---

## 4. Cons: weak spots

Severity: 🔴 critical · 🟠 important · 🟡 polish.

### Performance

- 🔴 **A 15.3 MB model gates the whole page.** [app/page.tsx:36](../app/page.tsx#L36)
  hides everything behind a loader until `useProgress()` hits 100. That includes
  `mac.glb`, which only appears in the Contact section at the very bottom. On 4G the
  visitor stares at "Loading 3%" for a long time. LCP and bounce rate both suffer.
  If a model fails to load, the loader never goes away.
- 🔴 **Two Lenis instances.** [app/page.tsx](../app/page.tsx) mounts `<ReactLenis root>`, and
  [WorkParallax.tsx:25](../components/ui/WorkParallax.tsx#L25) creates a second
  `new Lenis()` with its own `requestAnimationFrame` loop. That loop is never cancelled
  and the instance is never destroyed, so two smooth-scroll engines fight over one page
  and leak on unmount.
- 🟠 **Both WebGL canvases render every frame**, even off-screen. Each one also builds an
  `Environment` at 512 px resolution.
- 🟠 **Materials are rebuilt on every render.** `new THREE.MeshPhysicalMaterial` and
  `scene.traverse` run in the render body
  ([ObjectIllusionContact.tsx:14](../components/ui/ObjectIllusionContact.tsx#L14),
  [ObjectIllustionHero.tsx:13](../components/ui/ObjectIllustionHero.tsx#L13)), and the
  old materials are never disposed. `reflectivity: 20` does nothing: three.js clamps it to 0–1.
- 🟠 **Two animation libraries.** GSAP and Motion (framer-motion) both drive scroll
  animation, and Lenis adds a third scroll layer. Leva, a debug GUI, ships to production
  just to render `<Leva hidden />` ([Contact.tsx:118](../components/sections/Contact.tsx#L118)).
- 🟠 **`priority` on off-screen images.** All four service images
  ([Services.tsx:88](../components/sections/Services.tsx#L88)) and the outro landscape
  ([OutroParallax.tsx:32](../components/sections/OutroParallax.tsx#L32)) are preloaded and
  compete with the hero.
- 🟠 **The Case Studies section mounts both variants.** It renders
  `StickyScrollRevealSmall` and `StickyScrollRevealLarge` and hides one with CSS
  ([CaseStudies.tsx:10-15](../components/sections/CaseStudies.tsx#L10-L15)), so both
  scroll listeners always run. The mobile variant also re-subscribes its scroll listener
  on every scroll event, because `lastScrollY` is state and sits in the effect's
  dependencies ([StickyScrollRevealSmall.tsx:141](../components/ui/StickyScrollRevealSmall.tsx#L141)).
- 🟡 Plain `<img>` in About, Works, IntroParallax, MiddleParallax and TweetCard. `gsap/all`
  is imported in three files, which pulls in every plugin.

### Correctness and code quality

- 🔴 **19 ESLint errors.** They include React Compiler rules (`set-state-in-effect`,
  `immutability`) that show real bugs, for example:
  - [Stories.tsx:88-129](../components/sections/Stories.tsx#L88-L129): the mouse
    parallax keeps its state in `let` variables declared in the render body, so every
    re-render resets it. `animate()` schedules new frames without saving the id, so
    `cancelAnimationFrame` cancels the wrong one.
  - [Contact.tsx:30-60](../components/sections/Contact.tsx#L30-L60): the SVG path logic
    is dead code. The `path` ref is never attached to an element, and a pasted comment
    says *"SVG Path Logic remains exactly the same as your original code"*.
- 🔴 **One section can kill every animation.** [MiddleParallax.tsx:65](../components/sections/MiddleParallax.tsx#L65)
  runs `ScrollTrigger.getAll().forEach(t => t.kill())` on unmount, which destroys every
  ScrollTrigger on the page, not only its own.
- 🟠 **The sticky reveal ignores its own props.** Both components accept a `content` prop
  but read images from the global `CaseStudiesContent` import
  ([StickyScrollRevealLarge.tsx:74](../components/ui/StickyScrollRevealLarge.tsx#L74),
  [StickyScrollRevealSmall.tsx:193](../components/ui/StickyScrollRevealSmall.tsx#L193)).
  The small one also carries an unused desktop branch.
- 🟠 **`app/page.tsx` is one big client component.** It calls `ScrollTrigger.config()` on
  every render. Every section is client-side, so nothing streams as server HTML.
- 🟠 `any` types in [lib/animation.ts](../lib/animation.ts), and `animateWithGsapTimeline`
  is unused.
- 🟡 A relative image path, `src="images/man.png"` ([About.tsx:46](../components/sections/About.tsx#L46)),
  breaks on any route other than `/`.
- 🟡 An invalid id, `id="case studies"`, contains a space ([CaseStudies.tsx:9](../components/sections/CaseStudies.tsx#L9)).
- 🟡 [tsconfig.json:32](../tsconfig.json#L32) includes `components/ui/Planet.jsx`, which doesn't exist.
- 🟡 Typos: `firstContet` / `secondContet`, "Etham" ([layout.tsx:14](../app/layout.tsx#L14)),
  "and and" ([data.ts:191](../lib/data.ts#L191)).
- 🟡 `html { scroll-behavior: smooth }` ([globals.css:8](../app/globals.css#L8)) conflicts
  with Lenis. Lenis recommends removing it.
- 🟡 Only Playfair weight 400 is loaded, but `font-bold` and `font-semibold` are used, so
  the browser fakes the bold.
- 🟡 Unused dependencies: `react-scroll`, `@types/react-scroll`, `react-responsive`,
  `@iconify/react`, `leva`.
- 🟡 The README is still the create-next-app boilerplate.

### Accessibility

- 🔴 **The menu can't be used without a mouse.** The burger is a `<div onClick>`
  ([Navbar.tsx:254](../components/ui/Navbar.tsx#L254)) and the menu items are
  `<span onClick>` ([Navbar.tsx:202](../components/ui/Navbar.tsx#L202)): no `button`, no
  `href`, no `aria-expanded`, no focus trap, no Escape to close. Keyboard and
  screen-reader users can't navigate.
- 🔴 **No `prefers-reduced-motion` support** anywhere, on a site built almost entirely
  of scroll-jacking, pinning and parallax.
- 🟠 **Every section header is an `<h1>`** ([AnimatedHeaderSection.tsx:64](../components/ui/AnimatedHeaderSection.tsx#L64)),
  so the page has six `h1`s.
- 🟠 Unhelpful alt texts: `alt="image"` (ZoomParallax, WorkParallax, OutroParallax),
  `alt="man"`, `alt="Mask"` on a decorative element.
- 🟠 Low contrast: `text-white/30` dividers, the `hover:text-white/30` link state, and
  testimonial cards dimmed to `brightness-[0.4]`.
- 🟡 Testimonial cards overlap and can't be read on phones: 20 absolutely positioned
  `w-[90vw]` cards in one `h-screen`.

### Content, SEO and conversion

- 🔴 **Placeholder links and contact details.** Every social link points to `/` or `""`
  ([Navbar.tsx:11-18](../components/ui/Navbar.tsx#L11-L18) and the same list in
  Contact.tsx). The email is plain text, not a `mailto:` link, so a client who wants to
  hire you has no working way to do it.
- 🔴 **Fake testimonials** (see §2). A real portfolio must not publish them.
- 🟠 **No contact form or call to action.** For a freelancer this is the conversion point,
  and it's also where the "full stack" part could show (see §6).
- 🟠 **SEO metadata is thin.** No `metadataBase`, Open Graph or Twitter image, canonical
  URL, JSON-LD (`Person` / `ProfessionalService`), `llms.txt`, or custom favicon.
- 🟠 **Generic copy.** "Team Player · Problem Solver · Detail-oriented…", "The world is a
  canvas, and I paint it with code". It's interchangeable with a thousand portfolios and
  says nothing about outcomes, industries or process.
- 🟡 **Three parallax interludes** (Zoom, Intro, Middle, plus Outro) between real content
  make the page long. A hiring client has to scroll through ~3 screens of mood imagery
  before learning what you offer.
- 🟡 The navbar has no visible name or logo, and has no "Case studies" item.

### Positioning (the big one)

This project presents itself as the portfolio of **"Ethan Olson, Design Engineer"**, with
the footer credit "Designed and Developed by AlxPro". You are a **freelance full-stack
developer**, but the project today is **100% front end**: no API, no database, no form,
no auth, no server action. On alxpro.com it shows motion and 3D skill very well. It shows
nothing about the "full stack" half of your offer. Decide what this project is *for*
before writing the case study:

| Option | What it means | Fits the case study as |
| --- | --- | --- |
| **A. Concept build (recommended)** | Keep "Ethan Olson" as a clearly fictional client or persona. Label the work and testimonials as sample content. | "Motion portfolio concept": an honest showcase of frontend and 3D craft. |
| **B. Template product** | Turn it into a sellable or open-source portfolio template with a typed content file. | "Portfolio template": adds DX, theming, docs and a "make it yours" story. |
| **C. Real client work** | Only if Ethan is a real client. Then you need their approval, their real work and real quotes. | A client case study with results. |

In every option, adding a small **real backend** (contact form, server action,
validation, email delivery, spam protection, maybe a CMS for the Works list) turns this
into a full-stack case study.

---

## 5. Verdict per part

| Part | File(s) | Verdict | Why / what to do |
| --- | --- | --- | --- |
| Visual identity (palette, type, rounded sheets) | `globals.css`, all sections | **Keep** | It's the project's strongest asset. Add a bold Playfair weight. |
| Loader | [app/page.tsx](../app/page.tsx) | **Redesign** | Don't gate the whole page. Show the content right away, fade the 3D in when ready, and add a timeout fallback. |
| Navbar | [Navbar.tsx](../components/ui/Navbar.tsx) | **Refactor** | Use a real `<button>` and `<a href="#…">`, `aria-expanded`, a focus trap and Escape. Add a visible name or logo and a "Hire me" CTA. Move socials into `lib/data.ts`. |
| Hero (3D figure) | [Hero.tsx](../components/sections/Hero.tsx), [ObjectIllustionHero.tsx](../components/ui/ObjectIllustionHero.tsx) | **Keep + refactor** | `useMemo` the material, dispose it, `frameloop="demand"` or pause off-screen, add a static fallback for reduced motion. |
| ZoomParallax | [ZoomParallax.tsx](../components/sections/ZoomParallax.tsx) | **Keep** | Signature effect. Add real alt texts and `sizes`, and shorten it from 300vh to ~200vh. |
| IntroParallax (mask reveal) | [IntroParallax.tsx](../components/sections/IntroParallax.tsx) | **Keep** | Signature effect. Add a poster image for the video and a reduced-motion path. |
| Services horizontal track | [Services.tsx](../components/sections/Services.tsx) | **Keep + rewrite copy** | Good pattern. Rewrite the services for a *full-stack freelancer* (web apps, e-commerce, APIs and integrations, performance and SEO) and drop `priority`. |
| About | [About.tsx](../components/sections/About.tsx) | **Redesign** | Replace the stock portrait and the generic bullet list with your process, tools and a short bio. Fix the relative path. |
| Works column parallax | [WorkParallax.tsx](../components/ui/WorkParallax.tsx) | **Refactor** | Remove the second Lenis instance, and make tiles link to projects. The placeholder SVGs are in place until you have real shots. |
| Case Studies sticky reveal | [CaseStudies.tsx](../components/sections/CaseStudies.tsx), `StickyScrollReveal*.tsx` | **Refactor** | Render one variant chosen by media query, use the `content` prop, and replace the scroll-listener state machine with `IntersectionObserver` or `useScroll`. Rewrite the copy (§2). |
| MiddleParallax (water) | [MiddleParallax.tsx](../components/sections/MiddleParallax.tsx) | **Remove or merge** | Pure mood with no information. Fix the global ScrollTrigger kill if you keep it. |
| Stories (testimonials depth field) | [Stories.tsx](../components/sections/Stories.tsx), [TweetCard.tsx](../components/ui/TweetCard.tsx) | **Redesign** | The depth-field effect is worth keeping. The fake content isn't. Use 3–6 real quotes, or relabel as sample content, and add a readable mobile layout (a marquee or stack). Fix the mouse-parallax state. |
| OutroParallax | [OutroParallax.tsx](../components/sections/OutroParallax.tsx) | **Keep, trim** | Fine as a closing beat. Resize the source images, drop `priority`, and use art direction (`<picture>`) instead of `useMediaQuery`. |
| Contact | [Contact.tsx](../components/sections/Contact.tsx) | **Redesign** | Add a real form with a server action (see §6) and a `mailto:` link. Delete the dead SVG path code and Leva. Load the compressed model lazily. |
| `lib/animation.ts` | | **Refactor** | Type it properly and delete `animateWithGsapTimeline`. Register plugins once. |
| `lib/data.ts` | | **Refactor** | Delete `FLoating*`, fix typos, split into typed modules (`content/hero.ts`…), move socials and email here. |
| `useMediaQuery` | [lib/useMediaQuery.ts](../lib/useMediaQuery.ts) | **Refactor** | Rewrite with `useSyncExternalStore`, which fixes the lint error and the first-render mismatch. |
| SEO files | `robots.ts`, `sitemap.ts`, `layout.tsx` | **Keep + extend** | Add `metadataBase`, OG image (`opengraph-image.tsx`), JSON-LD, `llms.txt` and a favicon. |
| Unused assets and deps | see §2 and §4 | **Delete** | |
| README | [README.md](../README.md) | **Rewrite** | Explain the project, stack, scripts, env vars, credits and the case study link. |

---

## 6. Ideas that would make this a full-stack case study

Pick 2–3. Each gives the case study a chapter with something the reader can try.

1. **Contact flow** (highest value, smallest effort): a form with a Next.js **server
   action**, **Zod** validation shared by client and server, email delivery (for example
   Resend), spam protection (honeypot plus rate limit, or Vercel BotID), and success and
   error states that respect the motion system.
2. **Content from a CMS or database**: works, case studies and testimonials loaded from a
   headless CMS or Postgres, with `revalidateTag` on publish. It shows the data model,
   caching and an editor workflow.
3. **Project detail pages**: `/works/[slug]` with `generateStaticParams`, per-page OG
   images and View Transitions from the grid. This also fixes "tiles that go nowhere".
4. **Analytics and monitoring**: Vercel Analytics and Speed Insights, an error boundary
   with reporting, and a public Core Web Vitals number in the case study.
5. **Availability or booking widget**: a small API route that shows "Booking projects from
   ⟨month⟩", edited without a redeploy.
