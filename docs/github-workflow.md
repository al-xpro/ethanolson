# GitHub: publishing and repository setup

How this repository was published, and what's left to set up. The rules for everyday work
(issues, branches, commits, pull requests, reviews, releases) are in
[project-workflow.md](./project-workflow.md). This file only covers what's specific to this
repository.

---

## 1. Publishing record (project-workflow §1)

| Step | Status |
| --- | --- |
| 1. Scan the whole history for secrets | ✅ 2026-10-14, `gitleaks git .`: 10 commits, no leaks |
| 2. Remove private data | ✅ No `.env` file was ever committed (`.env*` is gitignored) |
| 3. Decide on the history | ✅ Kept, with the real dates, after a one-time clean-up (§2) |
| 4. Commit email | ✅ Kept as is. The address is private in GitHub settings. |
| 5. Tag the baseline `v1.0` and publish a release | ☐ Alex, see §3 |
| 6. The basics | ✅ README and CHANGELOG. No `LICENSE` by choice (all rights reserved). ☐ About, website and topics at the end (§4.1) |
| 7. Protect `main` with a ruleset | ☐ At the end (§4.3) |
| 8. Unfinished project | ✅ README says "Work in progress" and links the roadmap |

Deployments are off: `vercel.json` sets `git.deploymentEnabled: false`, so pushes don't
deploy, even if the Vercel project is still connected to this repository. Remove that
setting (or the file) when the site should go live.

---

## 2. History clean-up (2026-10-14, one time only)

Before the public baseline, these files were removed from **every** commit with
`git filter-repo --invert-paths`, then `main` was force-pushed once:

| Path | Why |
| --- | --- |
| `public/projects/*.jpg`, `public/projects/*.png` | Screenshots of other people's designs |
| `public/assets/projects/*` | Screenshots of third-party e-commerce designs |
| `public/avatars/*` | Faces used for invented testimonials |
| `public/fonts/*` (Amiamie) | Font files, which can't be redistributed |
| `public/videos/*.mp4` | Artgrid footage, which can't be redistributed |

What this did and didn't change:

- **Dates and authors are unchanged.** Only the commit hashes changed, because the content
  of the old commits changed.
- **The three open Dependabot pull requests (#1–#3) were closed** by deleting their
  branches, because those branches still held the old commits. Dependabot opens fresh
  ones against the new `main`, using `.github/dependabot.yml`.
- **GitHub still keeps `refs/pull/1…3/head`** and may serve old commits by their hash
  until garbage collection. Only GitHub Support can remove those: open a request at
  <https://support.github.com/request> ("Remove sensitive data from a repository"), list
  the paths above, and mention the closed pull requests #1–#3.

From here on, [project-workflow.md](./project-workflow.md) applies: no force-pushes to
`main`, no history rewrites.

---

## 3. Tag `v1.0` and publish the release (Alex)

```bash
git switch main && git pull
git tag -a v1.0 -m "v1.0: initial public release"
git push origin v1.0
```

On GitHub: **Releases → Draft a new release → Choose a tag: `v1.0`**, title
`v1.0: initial public release`, and paste the `v1.0` section of `CHANGELOG.md` as the
notes. Publish.

---

## 4. Repository setup (at the end of the project)

### 4.1 About and social preview

- [ ] Repository page → ⚙️ next to **About**: description "Concept portfolio for a
      fictional design engineer. Next.js 16, GSAP, React Three Fiber.", **Website** = the
      live URL (replace `john-doe-portfolio-mocha.vercel.app`), topics `nextjs`, `react`,
      `gsap`, `threejs`, `tailwindcss`, `storyblok`, `portfolio`.
- [ ] **Settings → General → Social preview → Edit → Upload an image**: the OG image,
      saved from `/opengraph-image` on the live site (1200 × 630 works; GitHub recommends
      at least 640 × 320).
- [ ] Pin the repository on your profile.

### 4.2 Pull request settings

**Settings → General → Pull Requests:**

- [ ] Uncheck **Allow merge commits** (they break linear history).
- [ ] Keep **Allow squash merging** checked. Set its default message to **Pull request
      title and description**.
- [ ] Rebase merging: optional. Squash alone is simplest.
- [ ] Check **Always suggest updating pull request branches**.
- [ ] Check **Automatically delete head branches**.

### 4.3 Ruleset for `main`

This matches project-workflow §5. **Settings → Rules → Rulesets → New ruleset → New branch
ruleset**:

1. **Ruleset name:** `Protect main`
2. **Enforcement status:** `Active`
3. **Bypass list → Add bypass → Repository admin**, then set its mode to
   **For pull requests only**.
   *Why:* GitHub never lets an author approve their own pull request. Agent PRs (opened by
   the Claude GitHub App as a `[bot]` user) get your approval as normal. When *you* open a
   PR yourself, this bypass lets you merge it through the PR without an approval, but you
   still can't push to `main` directly.
4. **Target branches → Add target → Include default branch.**
5. **Branch rules**, check exactly these:
   - **Restrict deletions** (on by default)
   - **Require linear history**
   - **Require a pull request before merging**, expand it and set:
     - **Required approvals:** `1`
     - **Dismiss stale pull request approvals when new commits are pushed:** on
     - **Require conversation resolution before merging:** on
     - **Allowed merge methods:** `Squash` only
   - **Require status checks to pass**, expand it and set:
     - **Require branches to be up to date before merging:** on
     - **Add checks** → type `Typecheck, lint and build` → pick it (source: GitHub
       Actions). It's listed only after CI has run at least once on GitHub, which the
       push of 2026-10-14 did.
   - **Block force pushes** (on by default)
   - Leave everything else off (signed commits, deployments, code scanning…).
6. **Create.**

Test it: `git push origin main` from a local commit should now be rejected with
"Changes must be made through a pull request".

### 4.4 Issues, labels and milestones

Issues are already **on** for this repository. To check or change it: **Settings →
General → Features → Issues**.

**Labels** (project-workflow §5). **Issues → Labels**:

- Rename the defaults: `bug` → `fix`, `documentation` → `docs`, `enhancement` → `feature`.
- **New label** for each missing one: `refactor`, `chore`. Keep `good first issue`.
- Delete the defaults you won't use (`duplicate`, `invalid`, `question`, `wontfix`,
  `help wanted`), or keep them. Your choice.

**Milestone.** **Issues → Milestones → New milestone**: title `v2.0 — Full stack`,
description "Storyblok, project pages, contact flow, analytics, Web Vitals, booking". Add
the issues from [issue-drafts.md](./issue-drafts.md) to it as you create them.

Or with the GitHub CLI (`brew install gh && gh auth login`):

```bash
gh label edit bug --name fix
gh label edit documentation --name docs
gh label edit enhancement --name feature
gh label create refactor --color 5319E7
gh label create chore --color C5DEF5
gh api repos/al-xpro/portfolio-project/milestones -f title="v2.0 — Full stack"
```

### 4.5 Project board (optional)

Only if you'll actually plan with it (project-workflow §5).

1. Your profile → **Projects** tab → **New project** → template **Kanban** → name
   `Ethan Olson portfolio` → **Create project**.
2. In this repository: **Projects** tab → **Link a project** → pick it. Issues and PRs now
   show the board in their sidebar.
3. In the project: **⋯ → Workflows**. Turn on **Item closed** and **Pull request merged**
   (both move the card to Done), and **Auto-add to project** with the filter
   `is:issue,pr is:open` so new issues land on the board automatically.
4. Add existing issues: **+ Add item** at the bottom of a column, type `#` and pick the
   repository, then the issue.

### 4.6 Dependabot

- `.github/dependabot.yml` is in place: monthly npm and GitHub Actions updates, grouped
  minor and patch bumps, labeled `chore`, with `chore(deps): …` commit messages.
- **Settings → Advanced Security** (called "Code security" on some accounts): turn on
  **Dependabot alerts** and **Dependabot security updates**. The YAML file only covers
  version updates. Security updates are this switch.

---

## 5. Everyday work

Follow [project-workflow.md](./project-workflow.md) §3–§4. The next issues are drafted in
[issue-drafts.md](./issue-drafts.md). Create them on GitHub (or approve them for an agent
to create), then work one branch and one pull request per issue.
