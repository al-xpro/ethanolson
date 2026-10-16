# GitHub playbook

How changes ship in this repository. The general rules are in
[project-workflow.md](./agents/project-workflow.md). Where this file differs, this file
wins: it's tuned so Alex's only job is reviewing important code.

## Who does what

| Who | Does |
| --- | --- |
| **Alex** | Asks for changes in plain words. Reviews and merges **review-lane** pull requests on GitHub. Owns repository settings and accounts. |
| **Claude Code** (agent) | Turns requests into issues, milestones, branches, commits and pull requests. Merges **fast-lane** pull requests automatically once CI passes. Answers review comments with new commits. |
| **CI** | Runs typecheck, lint, build and tests on every pull request. Nothing reaches `main` without it. |
| **Dependabot** | Opens dependency updates. Minor and patch: fast lane. Majors: review lane. |

## The two lanes

| | Fast lane | Review lane |
| --- | --- | --- |
| **For** | Docs, copy, visual tweaks, refactors, tests, chores, minor and patch dependency updates | Integrations, features, anything touching data, auth, security, secrets, CI or the database schema, and major dependency updates |
| **Issue** | None. The pull request description says what changed. | Yes. The agent writes it from Alex's request, in the spec format. |
| **Pull request** | Yes. Small changes can share one. | One per issue, with `Closes #n` |
| **Merge** | Automatic (`auto-merge`) as soon as CI is green | **Alex** merges after reviewing |
| **Alex's time** | None | The review |

Every change still goes through a pull request, so CI checks it and the history stays
readable. Auto-merge just removes the clicks.

---

## Settings Alex changes (the agent isn't allowed to)

### Now (2 minutes)

These make the fast lane work. Without them, every pull request opened from your account
is blocked, because GitHub never lets authors approve their own pull requests.

1. **Settings → Rules → Rulesets → Protect main**:
   - **Require a pull request before merging → Required approvals: `0`**. Uncheck
     **Dismiss stale pull request approvals when new commits are pushed**.
   - **Require status checks to pass → uncheck "Require branches to be up to date before
     merging"**. Otherwise every merge forces an **Update branch** on all the others.
   - **Save changes.** Keep everything else (pull request required, CI required, linear
     history, no force pushes, no deletions).
2. **Settings → General → Pull Requests → check "Allow auto-merge".**
3. **Issues → Milestones**: delete the empty duplicate `v2.0 - Full Stack` (keep
   `v2.0 — Full stack`).
4. Optional: in a terminal, `gh auth refresh -s project`. That lets the agent add items to
   your project board and move their status.

### After the tests are on `main`

**Protect main → Require status checks to pass → Add checks → `Tests`**, so tests are
required too.

### At launch

- **Website** in the About section: `https://ethanolson.dev`.
- **Social preview**: Settings → General → Social preview → upload
  `docs/images/social-preview.png`.

### Remove the last copies of the old files (GitHub Support)

The agent can't submit support forms. Open <https://support.github.com/request>, choose
**Remove sensitive data from a repository** (or "Removing sensitive data"), and paste:

> Repository: al-xpro/portfolio-project (public). I rewrote the history with
> git-filter-repo on 2026-10-14 and 2026-10-15 to remove third-party files I don't have the
> rights to publish. Please purge the cached views and the read-only pull request refs of
> closed pull requests #1–#9, which still reference the old commits. Paths removed:
> `public/projects/*.jpg`, `public/projects/*.png`, `public/assets/projects/`,
> `public/avatars/`, `public/fonts/`, `public/models/`, and the old versions of
> `public/videos/*.mp4` and `public/videos/*-poster.jpg`.

---

## Reviewing a review-lane pull request

1. **Conversation tab:** read *What*, *Why* and *How to test*. Does it meet the issue's
   acceptance criteria?
2. **Checks:** must be green.
3. **Files changed:** comment on lines with **+**, and batch comments with **Start a
   review**. To propose an exact fix, use the ± (suggestion) button in the comment box.
4. **Try it locally** if it's visible: `gh pr checkout <number> && npm run dev`.
5. **Finish:** if something needs changing, submit your comments. The agent pushes fixes to
   the same branch. If it's good, **Squash and merge**: the branch is deleted and the issue
   closes by itself.

Pull requests opened from your account can't receive your formal "Approve". Merging is the
approval.

## Releases

When a milestone is done, the agent opens a fast-lane pull request with the
`CHANGELOG.md` section, then drafts the release. Alex publishes it in **Releases → Draft a
new release**, as for `v1.0`.

## Optional: the agent on GitHub

The Claude GitHub App (`/install-github-app` in a `claude` terminal session) lets you write
`@claude` on an issue and have the work done in GitHub Actions, as `claude[bot]`. It isn't
needed for the lanes above: Claude Code does the same work locally.

---

## Publishing record

| Step from project-workflow §1 | Status |
| --- | --- |
| Scan the history for secrets | ✅ `gitleaks git .`: no leaks (2026-10-14) |
| Remove private data | ✅ No `.env` file was ever committed |
| Decide on the history | ✅ Kept with real dates, after two clean-ups before `v1.0` |
| Commit e-mail | ✅ Kept. It's private in GitHub settings. |
| Tag `v1.0` and release | ✅ 2026-10-16 |
| README, description, topics | ✅ · website and social preview at launch |
| License | No open-source license: all rights reserved |
| Protect `main` | ✅ Ruleset `Protect main` |

**History clean-ups** (`git filter-repo`, force-pushed, before `v1.0` only). Dates and
authors were kept; only commit hashes changed.

| Date | Removed from every commit | Why |
| --- | --- | --- |
| 2026-10-14 | `public/projects/*.jpg` and `*.png`, `public/assets/projects/` | Screenshots of other people's designs |
| 2026-10-14 | `public/avatars/` | Faces used for invented testimonials |
| 2026-10-14 | `public/fonts/` (Amiamie) | Font files can't be redistributed |
| 2026-10-14 | `public/videos/*.mp4` (old versions) | Unlicensed stock footage |
| 2026-10-15 | The two old `*-poster.jpg` frames | Frames from that footage |
| 2026-10-15 | `public/models/Figure.glb` | A Sketchfab model that requires attribution |

After `v1.0`, `main` is never rewritten again.
