# Ethan Olson concept portfolio

General rules: @docs/agents/project-workflow.md. In this repository they're simplified by
the two lanes below, which win where the two differ (details in `docs/github-workflow.md`).

## How changes ship

Alex asks in plain words; the agent handles issues, milestones, branches, commits and pull
requests with the `gh` CLI. Commits use Conventional Commits with a `Co-Authored-By`
trailer.

- **Fast lane:** docs, copy, visual tweaks, refactors, tests, chores, minor and patch
  dependency updates. No issue. Branch → pull request (small changes can share one) →
  `gh pr merge --auto --squash`, so it merges itself when CI is green.
- **Review lane:** integrations, features, anything touching data, auth, security, secrets,
  CI or the database schema, major dependency updates. Create an issue in the spec format
  (label + milestone), then one branch and one pull request with `Closes #n`. **Don't
  merge it**: Alex reviews and merges. Answer review comments with new commits on the same
  branch.
- Never push to `main` directly, never force-push or rewrite `main`, and never change
  repository settings, rulesets or secrets: Alex owns those.

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
```

Run all three checks before opening a pull request.

## Plans

- Feature specs waiting to become issues: `docs/issue-drafts.md`
- Stack decisions and why: `docs/full-stack-options.md`
- Case study: `docs/case-study-plan.md` and `docs/agents/case-study-guide.md`
