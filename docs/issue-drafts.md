# Issue drafts: v2.0 — Full stack

Specs for the full-stack features, in the issue format from
[project-workflow.md](./agents/project-workflow.md) §3. They're numbered S1–S15 because
GitHub assigns its own issue numbers. When you create an issue, replace every "S" reference
in it with the real `#number`. The agent creates them on GitHub ([github-workflow.md](./github-workflow.md)).

Delete this file once every spec exists as an issue.

**Stack** (see [full-stack-options.md](./full-stack-options.md)): Storyblok · plain
`/works/[slug]` pages · Neon Postgres + Drizzle · Zod · Resend on `ethanolson.dev` ·
honeypot + Vercel BotID · counter-table rate limiting · enquiries in a private Storyblok
space · Umami · self-built Web Vitals · Cal.com.

## Decisions

All settled (see [full-stack-options.md](./full-stack-options.md)): Umami Cloud, Storyblok
EU, a 30-minute "Project intro" event on Cal.com, Cloudflare Email Routing for
`hello@ethanolson.dev`. The accounts to create first are in
[planning.md §5](./planning.md#5-accounts-to-create-before-iteration-2).

## Status

- **S1** is issue #14 (pull request #18).
- Create the five epics and **S2, S3, S7** next. The plan is in
  [planning.md §4](./planning.md#4-the-plan-for-v11-and-v20).

## Order

```text
S1 tests ─┬─ S2 database ─┬─ S8 rate limit ──┐
          │               └─ S13 vitals API ── S14 dashboard
          ├─ S3 Storyblok ── S4 works gallery ── S5 project pages ── S6 revalidation
          ├─ S7 contact form ── S8 ── S9 store enquiries ── S10 e-mail ── S11 BotID
          ├─ S12 Umami
          └─ S15 Cal.com
```

---

## S1 chore(test): add Vitest and Playwright, and run them in CI

**Label:** `chore`

### Context
Every later issue has "tests cover the new behavior" as a criterion, but the project has
no test setup. CI runs typecheck, lint and build only.

### Goal
Unit tests (Vitest) and end-to-end tests (Playwright) run locally and in CI.

### Acceptance criteria
- [ ] `npm test` runs Vitest. One example test covers `lib/useMediaQuery.ts`.
- [ ] `npm run test:e2e` runs Playwright against a production build. One test loads `/`,
      opens the menu with the keyboard and closes it with Escape.
- [ ] A second e2e test emulates `prefers-reduced-motion: reduce` and checks that the
      services stack vertically.
- [ ] `.github/workflows/ci.yml` runs both. The required check name stays
      `Typecheck, lint and build`, or the ruleset is updated in the same PR.

### Constraints
No component refactors. Chromium only in CI to keep it fast.

---

## S2 chore(db): add Postgres with Drizzle and a rate-limit counter table

**Label:** `chore` · **Needs:** the Neon project (planning §5)

### Context
Rate limiting (S8) and Web Vitals (S13) need a database. There's none today.

### Goal
A typed database client and migrations, with a `rate_limits` table ready to use.

### Acceptance criteria
- [ ] Drizzle ORM and drizzle-kit set up in `lib/db/`, reading `DATABASE_URL`.
- [ ] Migration creates `rate_limits(key text, window_start timestamptz, count int,
      primary key (key, window_start))`.
- [ ] `npm run db:migrate` applies migrations. The README lists `DATABASE_URL`
      (name only).
- [ ] A test covers the client against a local or test database.

### Constraints
Server-only code (`import "server-only"`). No raw IP addresses stored anywhere.

---

## S3 feat(cms): connect Storyblok

**Label:** `feature` · **Needs:** the Storyblok spaces (planning §5)

### Context
All copy and media paths live in `content/`. The plan is to edit Works and site settings in
Storyblok without a deploy.

### Goal
The site reads content from a Storyblok space, with the Visual Editor working in draft mode.

### Acceptance criteria
- [ ] Space created with components `work` (title, slug, summary, cover, gallery, stack,
      year, body), `site_settings` (a single story) and the folder `works/`.
- [ ] `@storyblok/react` set up for the App Router, with typed component schemas.
- [ ] Published content is fetched with the **public** token. The preview token is only
      used server-side, inside Next.js draft mode.
- [ ] A `/api/draft` route enables draft mode for the Visual Editor, protected by a secret.
- [ ] Env var names in the README: `STORYBLOK_PUBLIC_TOKEN`, `STORYBLOK_PREVIEW_TOKEN`,
      `STORYBLOK_DRAFT_SECRET`.

### Constraints
Don't migrate the copy in `content/sections.ts` yet. This issue is the connection only.

---

## S4 feat(works): load the Works gallery from Storyblok

**Label:** `feature` · **Needs:** S3

### Context
`WorkParallax` shows 12 placeholder SVGs from `content/sections.ts`.

### Goal
The gallery shows the published `works/` stories, newest first.

### Acceptance criteria
- [ ] Gallery tiles come from Storyblok covers (via `next/image` with the Storyblok image
      service), with real alt text.
- [ ] Each tile links to `/works/[slug]` (S5).
- [ ] The parallax still works with fewer than 12 works (columns fill evenly).
- [ ] Data is fetched with the cache tag `works`.
- [ ] Tests cover the mapping from Storyblok stories to tiles.

### Constraints
Keep the placeholders as the fallback when the space has no works.

---

## S5 feat(works): add project pages at `/works/[slug]`

**Label:** `feature` · **Needs:** S4

### Context
Works tiles lead nowhere. The case study needs a page per project.

### Goal
Each published work has its own statically generated page.

### Acceptance criteria
- [ ] `app/works/[slug]/page.tsx` with `generateStaticParams` and `generateMetadata`.
- [ ] Unknown slugs return the 404 page.
- [ ] A per-project `opengraph-image.tsx`, and JSON-LD `CreativeWork` with Alex Prostamo as
      `creator`.
- [ ] Every work is listed in `sitemap.ts`.
- [ ] The page follows the site's design and reduced-motion rules.
- [ ] An e2e test opens a work from the gallery and checks the title and the back link.

### Constraints
A plain route, no modal. Every work is labeled as part of the concept.

---

## S6 feat(cms): revalidate pages when content is published

**Label:** `feature` · **Needs:** S5

### Context
Static pages need to refresh when content changes in Storyblok.

### Goal
Publishing or unpublishing in Storyblok updates the site within seconds, without a deploy.

### Acceptance criteria
- [ ] `app/api/revalidate/route.ts` receives Storyblok webhooks.
- [ ] The `webhook-signature` header is verified (HMAC with `STORYBLOK_WEBHOOK_SECRET`).
      Invalid requests get 401.
- [ ] Story events invalidate the `works` tag. `site_settings` invalidates its own tag.
- [ ] Tests cover a valid signature, an invalid one and an unknown event.

### Constraints
No time-based revalidation as a workaround.

---

## S7 feat(contact): add the contact form with a server action and Zod

**Label:** `feature`

### Context
Contact only shows an e-mail address. "Start a project" should lead to a real form.

### Goal
A validated, progressively enhanced form that returns clear states. Storage and e-mail
come in S9 and S10.

### Acceptance criteria
- [ ] Fields: name, e-mail, budget (select), message. One Zod schema in
      `lib/contact/schema.ts`, shared by client and server.
- [ ] A server action validates with the schema and returns field errors.
- [ ] The form works without JavaScript. With JavaScript, `useActionState` shows pending,
      success and error states, animated within the motion rules.
- [ ] A visually hidden **honeypot** field. Filled → the action returns success and does
      nothing else.
- [ ] Accessible: labels, `aria-invalid`, errors linked with `aria-describedby`, focus moves
      to the first error.
- [ ] Unit tests for the schema and the action. An e2e test for a valid and an invalid
      submission.

### Constraints
The e-mail address stays visible as an alternative to the form.

---

## S8 feat(contact): rate-limit submissions with the counter table

**Label:** `feature` · **Needs:** S2, S7

### Context
The form must not be usable for flooding.

### Goal
At most 5 submissions per visitor per hour.

### Acceptance criteria
- [ ] `lib/rate-limit.ts` with `limit(key, max, windowSeconds)`, using one atomic upsert:
      `insert … on conflict do update set count = count + 1 returning count`.
- [ ] The key is a salted hash of the IP plus the route. Never the raw IP.
- [ ] Over the limit → a friendly error state, no storage, no e-mail.
- [ ] Old windows are deleted (on write, or by a scheduled job).
- [ ] Tests cover under the limit, at the limit and a new window.

### Constraints
Reusable by the Web Vitals endpoint (S13).

---

## S9 feat(contact): store enquiries in a private Storyblok space

**Label:** `feature` · **Needs:** S7, S8

### Context
Enquiries are stored as a CMS collection, so nothing is lost if e-mail fails.

### Goal
Every accepted submission becomes a story in a private enquiries space.

### Acceptance criteria
- [ ] A **separate Storyblok space** ("Ethan Olson enquiries") with an `enquiry` component
      and an `enquiries/` folder. The site's public and preview tokens have no access to it.
- [ ] The server action creates the story with the Storyblok Management API
      (`STORYBLOK_MANAGEMENT_TOKEN`, `STORYBLOK_ENQUIRIES_SPACE_ID`), never published.
- [ ] Stored before e-mail is sent (S10).
- [ ] A failed write shows an error state asking the visitor to e-mail instead.
- [ ] Tests mock the Management API (success and failure).

### Constraints
*Why a separate space:* the preview token can read draft stories, and Visual Editor setups
often expose it to the browser. Enquiries in the main space would leak personal data.

---

## S10 feat(contact): send enquiry e-mails with Resend

**Label:** `feature` · **Needs:** S9, the domain and Email Routing (planning §5)

### Context
Stored enquiries should also reach Alex's inbox.

### Goal
Each stored enquiry sends a notification to Alex, and the visitor gets a confirmation.

### Acceptance criteria
- [ ] Resend with `RESEND_API_KEY`, sending from the verified domain.
- [ ] Two templates (React Email): a notification to Alex, a confirmation to the visitor.
      Both say that Ethan Olson is a concept and the message reaches AlxPro.
- [ ] `reply-to` is the visitor's address.
- [ ] If e-mail fails after storage, the visitor still sees success and the error is logged.
- [ ] Tests mock Resend.

### Constraints
No marketing e-mails, no newsletter opt-in.

---

## S11 feat(contact): add Vercel BotID to the contact form

**Label:** `feature` · **Needs:** S7

### Context
The honeypot stops simple bots. BotID adds invisible bot detection.

### Goal
Submissions classified as bots are rejected before rate limiting and storage.

### Acceptance criteria
- [ ] `botid` installed, `withBotId` in `next.config.ts`, and `initBotId` in
      `instrumentation-client.ts`, protecting the page's POST requests (server actions).
- [ ] The server action calls `checkBotId()` first. Bots get a generic error.
- [ ] Verified on a Vercel preview deployment (BotID doesn't classify locally). Manual
      steps in the PR.

### Constraints
`vercel.json` keeps Git deployments off. Use `vercel deploy` (preview) to test.

---

## S12 feat(analytics): add Umami

**Label:** `feature` · **Needs:** the Umami Cloud website (planning §5)

### Context
No analytics today.

### Goal
Cookie-free page views and a few key events.

### Acceptance criteria
- [ ] The Umami script is loaded with `next/script` only when
      `NEXT_PUBLIC_UMAMI_WEBSITE_ID` (and `NEXT_PUBLIC_UMAMI_SCRIPT_URL`) are set.
- [ ] Events: "Start a project" click, contact submit (success / error), Cal.com open,
      work page view.
- [ ] No cookies, no consent banner needed. Stated in `llms.txt` and the README.
- [ ] An e2e test checks that no script loads without the env vars.

---

## S13 feat(vitals): collect Core Web Vitals in Postgres

**Label:** `feature` · **Needs:** S2, S8

### Context
The case study needs real-user performance numbers, built in-house.

### Goal
Every page view reports LCP, INP, CLS, FCP and TTFB to our own endpoint.

### Acceptance criteria
- [ ] A client component uses `useReportWebVitals` and sends batches with
      `navigator.sendBeacon` to `/api/vitals`.
- [ ] The route handler validates with Zod, rate-limits with S8, and inserts into
      `web_vitals(id, name, value, rating, path, navigation_type, created_at)`.
- [ ] No IPs, no user agents, no cookies stored.
- [ ] Tests cover validation and the insert.

---

## S14 feat(vitals): add a protected Web Vitals dashboard

**Label:** `feature` · **Needs:** S13

### Goal
`/admin/vitals` shows p75 per metric and per page for the last 7 and 28 days.

### Acceptance criteria
- [ ] Protected with HTTP Basic auth in `proxy.ts` (`ADMIN_USER`, `ADMIN_PASSWORD`,
      constant-time comparison). `noindex`, and excluded from the sitemap.
- [ ] p75 computed in SQL (`percentile_cont(0.75)`), with good / needs improvement / poor
      colors from the official thresholds.
- [ ] Empty state when there's no data yet.
- [ ] An e2e test: 401 without credentials, 200 with them.

---

## S15 feat(booking): embed Cal.com in the contact section

**Label:** `feature` · **Needs:** the Cal.com event (planning §5)

### Goal
Visitors can book a call next to the form.

### Acceptance criteria
- [ ] `@calcom/embed-react`, loaded **only after** a "Book a call" click, so it doesn't
      slow the page.
- [ ] The link comes from `NEXT_PUBLIC_CALCOM_LINK`. Without it, the button is hidden.
- [ ] Clearly labeled: "Concept site: bookings reach the AlxPro studio".
- [ ] Keyboard accessible, with focus returning to the button on close.
