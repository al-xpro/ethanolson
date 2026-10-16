# Ethan Olson concept portfolio

Follow the publishing and agent workflow in @docs/agents/project-workflow.md for every
change: issues are specs, one branch and one pull request per issue, Conventional Commits
with a `Co-Authored-By` trailer, and only Alex merges. Never force-push or rewrite `main`.

## Project rules

- Ethan Olson is a **fictional** design engineer. Never present the persona, works or
  copy as real, and never add invented testimonials or reviews.
- Only add media whose license allows it to live in a public repository, and list every
  third-party asset in `CREDITS.md`. No 3D models that require attribution: the hero
  figure is built in code (`components/ui/OpticalIllusion.tsx`).
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
npm test            # Vitest unit tests (*.test.ts next to the code, or in __tests__)
npm run test:e2e    # Playwright end-to-end tests in tests/e2e (first time: npx playwright install chromium)
```

Run all of them before opening a pull request, and add tests for new behavior.

## Plans

- Feature specs waiting to become issues: `docs/issue-drafts.md`
- Stack decisions and why: `docs/full-stack-options.md`
- Case study: `docs/case-study-plan.md` and `docs/agents/case-study-guide.md`
