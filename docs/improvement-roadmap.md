# Roadmap

What's left, in order. Day-to-day progress is tracked on GitHub (issues, the
`v2.0 — Full stack` milestone and the project board). This file is the overview.

## 1. `v1.0` ✅ and `v1.1 — Polish` ← now

- [x] `v1.0` published (2026-10-16).
- [ ] `v1.1`: the impossible cube (#11), community standards (#12), planning docs (#13),
      the menu focus fix (#17). Then release it.
- [ ] Buy `ethanolson.dev` and create the accounts in [planning.md §5](./planning.md#5-accounts-to-create-before-iteration-2).

## 2. Build `v2.0 — Full stack`

Planned in [planning.md §4](./planning.md#4-the-plan-for-v11-and-v20), with specs in
[issue-drafts.md](./issue-drafts.md). Tracked on the project board.

- [ ] Foundations: tests (S1, #14) and the Neon database (S2)
- [ ] Content: Storyblok, Works gallery, project pages, revalidation (S3–S6)
- [ ] Contact: form, rate limit, private storage, Resend, BotID (S7–S11)
- [ ] Insights: Umami, Web Vitals, dashboard (S12–S14)
- [ ] Booking: Cal.com (S15)

## 3. Launch

- [ ] Turn deployments on: remove `git.deploymentEnabled: false` from `vercel.json`, connect
      `ethanolson.dev` and set `NEXT_PUBLIC_SITE_URL`.
- [ ] Manual checks on the live site: Lighthouse, axe DevTools, and the whole page with the
      keyboard only.
- [ ] Measure LCP, INP and CLS (PageSpeed Insights, mobile, median of 3).
- [ ] Add the website and social preview on GitHub ([playbook, "At launch"](./github-workflow.md#at-launch)).
- [ ] Release `v2.0`.

## 4. Case study

- [ ] Write it with [case-study-plan.md](./case-study-plan.md) and publish it on alxpro.com.

## Already in `v1.0`

Everything from the October 2026 clean-up is listed in [CHANGELOG.md](../CHANGELOG.md).
Measured on the local production build:

| Metric | Before | After |
| --- | --- | --- |
| ESLint | 19 errors, 30 warnings | 0 |
| Client JS, gzipped | ≈ 615 KB | ≈ 487 KB |
| 3D models | 15.3 MB | 0 (the figure is built in code) |
| Animation libraries | GSAP + Motion + Leva | GSAP only |
| `<h1>` per page | 6 | 1 |
| Content hidden behind a loader | Whole page | None |
