@AGENTS.md

# Meta Tutor — Working Conventions

Two people build on this repo: Jacob (owner/admin) and Cristian ("Cris"). This file is auto-loaded by
Claude Code for anyone working in this directory — read it before making changes.

## Staying in sync
Claude's own memory (the thing that remembers context across sessions) is private per machine — it
does NOT travel between Jacob's and Cris's computers. The only durable, shared memory between the two
of you is what's committed to this repo: `CLAUDE.md` (this file), `STATUS.md`, `PROCESS.md`, and the
code itself. **Pull `main` at the start of every session** (`git pull origin main`) before starting
work — otherwise you're building against a stale picture of what the other person already did.

## Lane separation — stay in your own area
Every subject is its own top-level route under `src/app/`, with matching `src/components/<subject>/`
and `src/lib/<subject>-content/` folders (see `rca/`, `latin-lab/`, `praxis/`, `metaphysics/` as
examples). This keeps contributors from physically colliding in the same files.

- **Jacob's areas** (his own RCA teaching content, personal tools): `/rca`, `/hub`, `/chess`,
  `/latin-lab`, `/praxis`, `/riemann`, `/trivia`, plus their API routes (full list in
  `src/lib/access.ts` → `JACOB_ONLY_PREFIXES`).
- **Cris's area**: `/cris/*` (`src/app/cris/`), with his own `src/components/cris/` and
  `src/lib/cris-content/` as he builds those out. `/metaphysics` is also his (pre-existing).
- Building something new? Give it its own top-level route rather than nesting inside someone else's
  subject folder, even if it feels related.

## Access control — don't touch without coordinating
`src/lib/access.ts` is a hard two-person allowlist (`JACOB_EMAIL`, `CRISTIAN_EMAIL`) — only those two
accounts can sign in at all (`src/auth.ts`'s `signIn` callback). It's a **deny-list** model:
`JACOB_ONLY_PREFIXES` blocks Cristian from Jacob's routes; anything NOT on that list is open to him by
default. Practically: a brand-new route under `/cris/*` needs zero `access.ts` changes to work. Only
touch `access.ts` if you're deliberately changing who can reach what, and say so in the PR.

## Git workflow — main is protected
`main` requires a PR for anyone who isn't a repo admin (GitHub ruleset `protect-main`). Flow:
1. Branch: `git checkout -b <name>/<short-description>`
2. Build, commit, push
3. Open a PR — CI (`.github/workflows/ci.yml`) automatically runs `tsc --noEmit` + `npm run build`
   against the real production env vars (stored as repo secrets) and **must pass before the PR can
   be merged** — this is a required status check, enforced for everyone including admins' own PRs.
4. Merge it. The PR requirement is a safety rail (audit trail, no force-push, CI gate), not a
   human-approval gate — you don't need to wait on the other person to merge your own PR, especially
   for work inside your own lane. Merging to `main` is what ships to production.

Never force-push or delete `main`. Local `npm run dev` works fine for anything that doesn't need live
secrets (plain pages/UI). For auth-gated features (AI chat, DB reads, anything behind login), test
against **`https://meta-tutor-six.vercel.app`** — the one deployment with Git connected and real
Preview/Production secrets wired up (fixed 2026-10-07, see `STATUS.md`). There's a messier,
multi-account Vercel history behind this repo (`meta-tutor.vercel.app` itself lives on a different,
not-currently-accessible account) — `meta-tutor-six.vercel.app` is the one that's actually guaranteed
to work end to end, so use it over a one-off PR preview URL, since per-PR preview URLs get a random
hostname each time and Google OAuth won't recognize an unregistered redirect URI.

## Shared code — duplicate, don't import
If you're building something that resembles an existing feature (e.g. Cris building his own
RCA-style class tracker), **copy the relevant files into your own lane and modify the copy** — don't
import from or edit `src/components/rca/`, `src/lib/rca-content/`, or any other file under someone
else's subject folder. Route-level lane separation only stops you from editing the same *file*; it
doesn't stop you from importing a shared helper and changing its behavior out from under the other
person's live feature. A little duplication here is the point, not a smell — it's what guarantees
your changes can never break the other person's working tool, even by accident.

## Database changes — schema edits need a reviewed file, not live DDL
All tables are `mt_`-prefixed in a Supabase project shared between both of you (see
`supabase-schema-hub.sql`, `supabase-schema-trivia.sql`). The existing RCA tables (`mt_rca_roster`,
`mt_rca_attendance`, `mt_rca_pacing_override`, `mt_rca_grading_checklist`) are already safely
multi-tenant — every one is keyed by `user_email` in its primary key/index, so two people's data in
the same table never collides, *as long as new tables follow that same pattern*.
- **New table?** Add the `CREATE TABLE` to a new or existing `supabase-schema-*.sql` file in a PR,
  keyed by `user_email` (and whatever else distinguishes rows) in the primary key, same as the
  existing tables. Get it applied by whoever has Supabase dashboard access — don't run ad hoc DDL
  directly against the shared database. A bad migration there has no undo.
- **Changing an existing table** (`ALTER`/`DROP`) is higher-risk than adding a new one — flag it
  explicitly in the PR description, since it can affect the other person's live data even if the
  table is nominally "yours."

## API quota — AI features share one account
AI calls in this app run on Jacob's own Anthropic account (Max subscription quota / API key,
configured as env vars, not something either of you should hardcode or share outside this repo's
secrets). Adding AI-chat-heavy features (like `/rca-chat`) adds load to that same shared quota —
not a breakage risk, but worth knowing before building something quota-heavy.

## Verification — don't call it done on a type-check alone
Established standard in this repo (see `STATUS.md` history): `npx tsc --noEmit` clean is the floor,
not the finish line. Before marking something done, actually look at it — run `npm run dev`, navigate
to the real page (or use the preview URL), and confirm it renders and behaves as expected. A clean
build is necessary but not sufficient.

## Process log — write back what you did
`STATUS.md` is the running log of real work sessions: what was built, how it was verified, what's
still open. Prepend an entry (don't overwrite prior ones) when you finish something non-trivial, and
tag it with who did it (`(Jacob)` / `(Cris)`) since two people now write to the same log — future
sessions (yours or the other person's) rely on it to know what's actually been done vs. just planned,
and by whom. `PROCESS.md` is for deeper incident/decision writeups when something broke or a design
choice needs the reasoning preserved.
