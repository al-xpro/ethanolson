# Full-stack decisions

What the `v2.0 — Full stack` milestone is built with, what else was considered, and why.
Decided on 2026-10-14 and 2026-10-15. Each feature is specified in
[issue-drafts.md](./issue-drafts.md). The case study can reuse these as `decision` blocks.

## Summary

| Feature | Chosen | Considered |
| --- | --- | --- |
| Content (CMS) | **Storyblok** | Sanity, Payload, Keystatic, Contentful, Strapi |
| Project pages | **Plain `/works/[slug]` route**, statically generated | MDX files in the repo, a modal over the gallery |
| Database | **Neon Postgres + Drizzle ORM** | Supabase, Prisma, no database |
| Validation | **Zod** | Valibot, ArkType |
| E-mail | **Resend**, sending from `ethanolson.dev` | Postmark, Amazon SES, Nodemailer |
| Spam protection | **Honeypot field + Vercel BotID** | Cloudflare Turnstile, hCaptcha |
| Rate limiting | **Counter table in Postgres** | Upstash Ratelimit (Redis) |
| Enquiry storage | **A private Storyblok space** | A Postgres table |
| Traffic analytics | **Umami** | Plausible, PostHog, Fathom, Google Analytics 4 |
| Real-user performance | **Self-built Web Vitals** (endpoint, table, dashboard) | Vercel Speed Insights, Sentry, DebugBear |
| Booking | **Cal.com embed** | Calendly, a custom booking system |
| Domain | **ethanolson.dev** | A subdomain of alxpro.com |

## Why

**Storyblok.** A hosted CMS with a visual editor: content changes go live without a
deploy, and clients recognize the "edit your own site" story. It's hosted, so there's no
CMS server to run.

**Plain project pages.** One URL per project, each with its own metadata and Open Graph
image, is the best for sharing and SEO. A modal would add routing complexity without
helping the case study.

**Neon + Drizzle.** Storyblok can't count reliably, and a rate-limit counter needs an
atomic increment (`insert … on conflict do update`). Web Vitals also need a table. Neon has
a free tier and branches for previews. Drizzle keeps the schema in TypeScript, with
readable SQL migrations.

**Zod.** One schema, shared by the form and the server action, so client and server
validation can't drift apart.

**Resend.** A simple API, and e-mail templates written as React components. It needs a
verified sending domain, which `ethanolson.dev` provides.

**Honeypot + BotID.** The honeypot costs nothing and stops simple bots. BotID adds
invisible checks with no puzzle for visitors. It only classifies traffic on Vercel
deployments, so it's tested on a preview deployment.

**A counter table instead of Redis.** One less service. The volume of a portfolio contact
form doesn't need Redis.

**Enquiries in a separate, private Storyblok space.** Storing them in the CMS keeps every
enquiry in one place for Alex. A **separate** space matters: Storyblok's preview token can
read unpublished stories, and Visual Editor setups often expose it to the browser.
Enquiries in the site's own space could leak personal data.

**Umami.** Cookie-free, so no consent banner, and open source. Umami Cloud's free tier
avoids hosting it.

**Self-built Web Vitals.** The most back-end work of the options: an ingestion endpoint,
validation, rate limiting, a table, SQL percentiles and a protected dashboard. It also
gives the case study its own measured numbers.

**Cal.com.** Open source, with a React embed. It's loaded only on click, so it doesn't slow
the page. It's clearly labeled: Ethan is fictional, so bookings reach the AlxPro studio.

**ethanolson.dev.** A short, standalone name for the concept. `.dev` domains are HTTPS-only,
which suits a site that's always served over TLS. The footer, `llms.txt` and README say
the persona is fictional.

## Settled on 2026-10-16

- **Umami Cloud**, free tier.
- **Storyblok region: EU.** It can't be changed after the space is created.
- **Cal.com:** a 30-minute "Project intro" event.
- **E-mail:** `hello@ethanolson.dev` forwards to Alex's inbox with **Cloudflare Email
  Routing**. Buying the domain through Cloudflare Registrar keeps its DNS on Cloudflare,
  which Email Routing needs.

The accounts to create, and their environment variable names, are in
[planning.md §5](./planning.md#5-accounts-to-create-before-iteration-2).
