# Ethan Olson concept portfolio

Follow the publishing and agent workflow in @docs/project-workflow.md for every change:
issues are specs, one branch and one pull request per issue, Conventional Commits with a
`Co-Authored-By` trailer, and only Alex merges. Never force-push or rewrite `main`.

## Project rules

- Ethan Olson is a **fictional** design engineer. Never present the persona, works or
  copy as real, and never add invented testimonials or reviews.
- Never commit licensed videos (Artgrid). They're loaded from `NEXT_PUBLIC_*_VIDEO_URL`.
  Every other third-party asset must be listed in `CREDITS.md`.
- Copy and media paths live in `content/`. Components don't hardcode copy.
- Scroll animation goes through `lib/gsap.ts` and runs inside
  `gsap.matchMedia().add(MOTION_OK, …)`, with a static fallback for reduced motion.
- Keep one `<h1>` per page (`AnimatedHeaderSection` defaults to `h2`).

## Commands

```bash
npm run dev
npm run typecheck   # next typegen && tsc --noEmit
npm run lint
npm run build
```

Run all three checks before opening a pull request.

## Plans

- Feature specs waiting to become issues: `docs/issue-drafts.md`
- Chosen stack and architecture: `docs/full-stack-options.md`
- Case study: `docs/case-study-plan.md` and `docs/case-study-guide.md`
