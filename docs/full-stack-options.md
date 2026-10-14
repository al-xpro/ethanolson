# Full-stack features: ways to build each one

> **Decided 2026-10-14:** Storyblok (headless CMS) · plain `/works/[slug]` route · Zod ·
> Resend · honeypot + Vercel BotID · a counter table for rate limiting · enquiries stored
> as a CMS collection · Umami · self-built Web Vitals · Cal.com embed.
>
> Two consequences: the counter table and the Web Vitals need a **small Postgres
> database** (Storyblok can't do atomic counts), and enquiries go in a **separate private
> Storyblok space** so the site's preview token can never read them. Specs for each
> feature are in [issue-drafts.md](./issue-drafts.md).

The options below are kept for the record.

The goal is a **full-stack case study**, so each option below is judged on two things:
how much real back-end work it shows (data model, server code, auth, caching, security),
and how much effort it takes. Options are ordered from lightest to heaviest. A recommended
combination is at the end.

Legend: 🟢 light · 🟡 medium · 🔴 heavy. "Shows" = what the case study can demonstrate.

---

## 1. Project detail pages (`/works/[slug]`)

Every Works tile links to a page with the project's story, images and stack.

### Where the content comes from

| Option | How | Shows | Effort |
| --- | --- | --- | --- |
| **A. MDX files in the repo** | `content/works/*.mdx` with frontmatter, read at build time with `generateStaticParams`. `@next/mdx` or `next-mdx-remote`. | Static generation, typed content, a component-rich writing format | 🟢 |
| **B. Headless CMS** | Fetch from the CMS (§3) and render with `generateStaticParams`. A publish webhook calls a route handler that runs `revalidateTag("works")`. | On-demand revalidation, webhooks with a shared secret, an editor workflow | 🟡 |
| **C. Your own database** | Postgres table `projects` (+ `project_images`), queried in Server Components with Drizzle or Prisma. Cached with Next 16 Cache Components (`"use cache"` + `cacheTag`) and invalidated from a server action. | Schema design, migrations, caching strategy, an admin form | 🔴 |

### How the page opens

| Option | How | Shows |
| --- | --- | --- |
| **Plain route** | A normal `/works/[slug]` page | SEO, a share URL per project, per-page OG image (`opengraph-image.tsx` in the route folder) |
| **Modal + route** | Intercepting and parallel routes: `@modal/(.)works/[slug]` opens the project over the gallery, while a hard refresh shows the full page | An advanced App Router pattern, rare in portfolios |
| **Shared-element transition** | The tile grows into the page header, with React `<ViewTransition>` (experimental flag in Next 16) or a GSAP Flip animation | Motion carried across navigations |

Whatever the source, add `generateMetadata`, a per-project OG image, JSON-LD
(`CreativeWork`) and the page in `sitemap.ts`.

---

## 2. Analytics and performance monitoring (instead of Vercel Analytics and Speed Insights)

Two different jobs: **traffic analytics** (who visits, from where, which CTA they click)
and **real-user performance** (Core Web Vitals from real visitors).

### Traffic analytics

| Tool | Hosting | Cookie banner in the EU? | Cost | Notes |
| --- | --- | --- | --- | --- |
| **Umami** | Self-host (Postgres) or Umami Cloud | No (no cookies) | Free self-hosted, free cloud tier | Open source. Self-hosting on your own database is a nice back-end detail. |
| **Plausible** | Plausible Cloud or self-hosted Community Edition | No | Paid cloud, free self-hosted | Very clean dashboard, EU-hosted |
| **PostHog** | Cloud (EU or US) or self-host | Depends on config | Generous free tier | Product analytics, funnels, session replay, feature flags. Heavier script. |
| **Fathom** | Cloud | No | Paid | Simple, privacy-first |
| **Cloudflare Web Analytics** | Cloudflare | No | Free | A JS beacon, works without moving DNS to Cloudflare |
| **Google Analytics 4** | Google | **Yes** (cookies and consent) | Free | Powerful, but needs a consent banner in the EU and adds weight |

### Real-user performance and errors

| Tool | What you get | Notes |
| --- | --- | --- |
| **Build it yourself (recommended for the case study)** | Next's `useReportWebVitals` sends LCP, INP, CLS, TTFB to a route handler. It validates with Zod, rate-limits, and stores rows in Postgres. A protected `/admin/vitals` page shows p75 per metric and per page. | Real full-stack work: an ingestion endpoint, schema, aggregation queries, auth for the dashboard. Also gives the case study its own measured numbers. |
| **Sentry** | Error tracking, tracing, web vitals, session replay | Free developer tier. The standard choice for errors. Pairs with `app/error.tsx` and `instrumentation.ts`. |
| **PostHog** | Web vitals inside product analytics | One tool for both jobs |
| **DebugBear / Calibre** | Synthetic lab tests plus RUM, alerts on regressions | Paid. Built for performance budgets. |
| **PageSpeed Insights / CrUX API** | Google's lab and field data | Free. Needs real traffic for field data. Good for a scheduled check (cron) that stores results. |

---

## 3. CMS

| Option | Type | Shows | Effort | Notes |
| --- | --- | --- | --- | --- |
| **Keystatic** or **TinaCMS** | Git-based: content is files in the repo, edited in a UI | Content modeling, a typed reader API | 🟢 | Free, no database. Edits become commits or PRs, which ties in nicely with your GitHub practice. Less "back end". |
| **Sanity** | Hosted content lake with an embeddable Studio (`/studio` inside your Next app) | Schemas in code, GROQ queries, webhooks, image pipeline | 🟡 | Generous free tier. Very common with Next.js, so clients recognize it. |
| **Storyblok** / **Contentful** | Hosted, visual editor (Storyblok) or enterprise (Contentful) | Visual editing, preview mode | 🟡 | Good if you want to sell "clients edit their own site" |
| **Strapi** | Self-hosted Node CMS with its own database | Running a separate service, REST/GraphQL, roles | 🔴 | A second app to host and maintain |
| **Payload 3** | Open-source CMS that installs **inside** your Next.js app, on Postgres (or MongoDB/SQLite) | Data model, auth and access control, admin panel, hooks, local API, migrations | 🟡–🔴 | One codebase, one deploy. You own the database. Strongest full-stack story of the CMS options. |
| **No CMS: own admin** | Postgres + Drizzle + Auth.js (or Better Auth), with a hand-built `/admin` | Everything, written by you | 🔴 | Most impressive and most work. Only worth it if the admin itself is the point. |

---

## 4. Booking or availability widget

From simplest to most custom:

| Option | How | Shows | Effort |
| --- | --- | --- | --- |
| **A. Availability badge** | A "Booking projects from ⟨month⟩" pill. The value lives in the CMS (a global setting) or a config store, and changes without a redeploy. | Runtime config, caching and revalidation | 🟢 |
| **B. Embedded scheduler** | Cal.com or Calendly embed in the Contact section. Cal.com is open source and has an embed SDK, an API and webhooks. | Third-party integration. With a webhook handler that stores bookings, it gains some back end. | 🟢–🟡 |
| **C. Cal.com API + own UI** | Your own slot picker in the site's style, calling the Cal.com API from server actions. Webhooks confirm or cancel bookings. | API integration, webhook signature checks, a UI that matches the design system | 🟡 |
| **D. Fully custom** | An availability table in Postgres (or Google Calendar's free/busy API), a slot picker, a server action that books inside a transaction (no double-booking), and confirmation e-mail with an `.ics` attachment. | Concurrency, time zones, transactions, e-mail. A strong back-end chapter. | 🔴 |

**Concept caveat:** Ethan is fictional, so real bookings must land in *your* calendar or
inbox, and the UI should say it's a demo ("Requests go to the AlxPro studio"). Option A or
B with a clear label avoids anyone booking a call that nobody attends.

---

## 5. Contact flow (the core feature in every plan)

| Part | Options |
| --- | --- |
| Validation | Zod (most common), Valibot (smaller), ArkType. Share the schema between client and server action. |
| E-mail | Resend (+ React Email templates), Postmark (great deliverability), Amazon SES (cheapest at scale), Nodemailer over SMTP (any provider) |
| Spam | Honeypot field (free, invisible), Cloudflare Turnstile (free, privacy-friendly), hCaptcha, Vercel BotID |
| Rate limiting | Upstash Ratelimit (Redis), or a simple counter table in your own Postgres |
| Storage | Save every submission (DB table or CMS collection) so nothing is lost if e-mail fails |

---

## Recommended combinations

| Plan | Pieces | Why |
| --- | --- | --- |
| **Recommended: "One codebase, own data"** | **Payload 3 on Postgres** (works, project pages, site settings, contact submissions, booking requests) · project pages with **modal + route** and per-page OG · **contact flow** with Zod, Resend, Turnstile and a rate limit · **availability badge** from a Payload global, plus a **Cal.com embed** labeled as a demo · **Umami** for traffic and a **self-built web-vitals endpoint** with Sentry for errors | Every feature touches the same database and auth, so the case study can show one data model, one admin and real numbers. Medium effort. |
| **Lighter: "Hosted services"** | Sanity · plain project routes · contact flow with Resend + honeypot · Cal.com embed · Plausible + Sentry | Fastest to ship. Shows integration skill more than back-end depth. |
| **Heaviest: "Everything by hand"** | Postgres + Drizzle + Auth.js admin · custom booking (option D) · custom vitals dashboard | Maximum back-end proof, but weeks of work for a concept site |

Turn each piece you pick into a GitHub issue, then build them one pull request at a time
(see [github-workflow.md](./github-workflow.md)).
