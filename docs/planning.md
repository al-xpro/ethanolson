# Planning with GitHub

How to plan this project like a small team: what each GitHub tool is for, how to set up
the project board once, the weekly routine, and the concrete plan for `v2.0`.

## 1. The building blocks

| Tool | Answers | In this project |
| --- | --- | --- |
| **Issue** | *What* needs doing, and when is it done? | One spec, written in the template (Context, Goal, Acceptance criteria, Constraints) |
| **Sub-issue** | What are the pieces of a big piece of work? | Specs grouped under an "epic" issue per area |
| **Label** | What *kind* of work is it? | `feature`, `fix`, `docs`, `refactor`, `chore` |
| **Milestone** | What ships *together*, in which release? | `v1.1 — Polish`, `v2.0 — Full stack` |
| **Project** | Where is everything, and what's next? | The `Ethan Olson portfolio` board, which spans every issue and pull request |
| **Fields** | Extra facts about each item | Status, Priority, Size, Iteration |
| **Views** | Different ways of looking at the same items | Board, Backlog, This week, Roadmap |
| **Iteration** | *When* will it be worked on? | One-week time boxes |

One sentence to remember: **the milestone says *what* ships, the iteration says *when* you
work on it, the status says *where* it is now, the priority says *what comes first*, and the
size says *how big* it is.**

## 2. Set up the project (once, about 15 minutes)

Open your project: profile picture → **Your projects** → `Ethan Olson portfolio`.

### 2.1 Fields

Click **⋯ (top right) → Settings → Custom fields → + New field**:

| Field | Type | Options |
| --- | --- | --- |
| **Priority** | Single select | `P0 · Now`, `P1 · Next`, `P2 · Later` |
| **Size** | Single select | `XS` (< 1 h), `S` (half a day), `M` (1 day), `L` (2–3 days), `XL` (split it) |
| **Iteration** | Iteration | Duration **1 week**, starting next Monday |

**Status** already exists. In **Settings → Status**, make sure the options are `Todo`,
`In Progress`, `In review` and `Done`, in that order.

### 2.2 Views

A view is a saved way of looking at the items. Each tab at the top is one. Click
**+ New view**, pick a layout, set the filter and grouping, then **Save changes**
(the button appears when the view has unsaved edits). Double-click a tab to rename it.

| View | Layout | Filter | Group / sort | Use it for |
| --- | --- | --- | --- | --- |
| **Board** | Board | `-status:Done` or none | Columns: Status | Daily: what's moving |
| **Backlog** | Table | `-status:Done` | Group by **Milestone**, sort by **Priority** | Planning: everything not done, in order |
| **This week** | Board | `iteration:@current` | Columns: Status | Focus: only this week's items |
| **Roadmap** | Roadmap | none | Dates: **Iteration**, group by **Milestone** | The big picture across weeks |

In table views, click **+** at the right end of the header row to show more columns
(Labels, Milestone, Assignees, Linked pull requests, Size).

### 2.3 Workflows

**⋯ → Workflows**: you've already set up auto-add, **Item closed → Done** and
**Pull request merged → Done**. Also turn on:

- **Item added to project** → Status `Todo`
- **Code changes requested** → Status `In Progress` (the agent has work to do)
- **Code review approved** → Status `In review` (approved and ready for you to merge)

### 2.4 Epics with sub-issues

A big area of work becomes one **epic** issue, with each spec as a **sub-issue**. The epic
then shows a progress bar (for example "2 of 5").

1. Create the epic, for example `Contact flow`, label `feature`, milestone `v2.0`.
2. On the epic's page: **Create sub-issue** (new) or the arrow next to it → **Add existing
   issue**.
3. In the project, show the **Parent issue** and **Sub-issues progress** fields in the
   Backlog view.

For order between specs, use **Relationships → Mark as blocked by** in the issue sidebar.
A blocked issue shows a "Blocked" icon on the board.

## 3. The weekly routine

| When | What | Time |
| --- | --- | --- |
| **Monday: plan** | Open **Backlog**. Move the top `P0`/`P1` items whose blockers are done into this week's **Iteration**, until the sizes add up to what you can review (start with about 3 `M` or 6 `S`). Hand each one to the agent. | 20 min |
| **Every day: flow** | Open **This week**. Review whatever is **In review** first: reviews unblock the most work. Keep at most 2 items **In Progress** at once. | 10 min |
| **Friday: review** | Look at what moved to **Done**. Move unfinished items to next week: in the **This week** view, select them (Shift-click), then set **Iteration** for all of them at once. If a milestone is complete: changelog PR, then the release (playbook C7). Note one thing to do better. | 15 min |

Three habits that make planning work:

- **Small issues.** If it's `XL`, split it into sub-issues.
- **Everything is on the board.** If it's not an issue, it isn't planned.
- **Priority is a ranking, not a wish list.** Only a few items are `P0` at once.

## 4. The plan for `v1.1` and `v2.0`

Sizes are estimates. Adjust them as you learn how fast the reviews go.

### Iteration 1: finish `v1.1 — Polish` (this week)

| Item | Size | Notes |
| --- | --- | --- |
| Review and merge #15 (impossible cube) | S | Your first real review |
| Review and merge #16 (community standards) | XS | Then the three manual settings in its description |
| Review and merge #18 (tests in CI) | S | Then add `Tests` to the ruleset's required checks |
| Install the Claude GitHub App ([playbook A8](./github-workflow.md#a8-give-the-agent-its-own-identity)) | XS | |
| #17 focus bug: hand it to `@claude` | XS | The agent's first issue |
| Create the accounts in §5 | S | Needed before Iteration 2 |
| Release `v1.1` | XS | Changelog PR, then playbook Part B |

### Iterations 2–5: `v2.0 — Full stack`

Five epics, with the specs from [issue-drafts.md](./issue-drafts.md) as sub-issues.

| Iteration | Epic | Sub-issues (spec) | Size | Blocked by |
| --- | --- | --- | --- | --- |
| 2 | **Foundations** | S2 Neon + Drizzle | M | Neon account |
| 2 | **Content** | S3 connect Storyblok | M | Storyblok spaces |
| 2 | **Contact flow** | S7 form, server action, Zod, honeypot | M | — |
| 3 | Content | S4 Works gallery from Storyblok | S | S3 |
| 3 | Content | S5 project pages | M | S4 |
| 3 | Content | S6 revalidation webhook | S | S5 |
| 3 | Contact flow | S8 rate limit (counter table) | S | S2, S7 |
| 4 | Contact flow | S9 store enquiries in the private space | M | S8 |
| 4 | Contact flow | S10 Resend e-mails | S | S9, domain + e-mail routing |
| 4 | Contact flow | S11 Vercel BotID | S | S7 |
| 4 | **Insights** | S12 Umami | XS | Umami account |
| 5 | Insights | S13 Web Vitals collection | M | S2, S8 |
| 5 | Insights | S14 Web Vitals dashboard | M | S13 |
| 5 | **Booking** | S15 Cal.com embed | S | Cal.com event |

Then the launch (roadmap §3) and the `v2.0` release.

**Which issues to create now:** the five epics, and the three Iteration 2 specs (S2, S3,
S7) as their sub-issues. Create the rest at the start of the iteration that needs them, so
the backlog stays short and each spec reflects what you've learned. If you'd rather see the
whole roadmap at once, ask the agent to create every spec from the drafts.

## 5. Accounts to create before Iteration 2

Create them yourself. Put the values in `.env.local` (never committed), and later in the
Vercel project's environment variables. The agent only ever sees the **names**.

| Service | What to create | Environment variables |
| --- | --- | --- |
| **Neon** | A project `ethan-olson`, region **EU (Frankfurt)** | `DATABASE_URL` |
| **Storyblok** | Space `Ethan Olson`, region **EU** · a second space `Ethan Olson enquiries` | `STORYBLOK_PUBLIC_TOKEN`, `STORYBLOK_PREVIEW_TOKEN`, `STORYBLOK_DRAFT_SECRET` · `STORYBLOK_MANAGEMENT_TOKEN`, `STORYBLOK_ENQUIRIES_SPACE_ID` |
| **Cloudflare** | Buy `ethanolson.dev` with **Cloudflare Registrar** (Email Routing needs Cloudflare DNS anyway), then **Email Routing** `hello@ethanolson.dev` → your inbox | — |
| **Resend** | Add the domain `ethanolson.dev`, and add its DNS records in Cloudflare | `RESEND_API_KEY` |
| **Umami Cloud** | Free tier, a website `ethanolson.dev` | `NEXT_PUBLIC_UMAMI_WEBSITE_ID`, `NEXT_PUBLIC_UMAMI_SCRIPT_URL` (`https://cloud.umami.is/script.js`) |
| **Cal.com** | A 30-minute event type "Project intro" | `NEXT_PUBLIC_CALCOM_LINK` (for example `alxpro/project-intro`) |
| **Vercel** | Nothing new: BotID is tested on a preview deployment (`vercel deploy`) | — |
