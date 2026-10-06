@AGENTS.md

# Meta Tutor — Working Conventions

Two people build on this repo: Jacob (owner/admin) and Cristian ("Cris"). This file is auto-loaded by
Claude Code for anyone working in this directory — read it before making changes.

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
3. Open a PR — Vercel auto-builds a preview deployment with the real server-side env vars already
   configured (Anthropic key, Google OAuth, Supabase). Log into the preview with your own
   already-whitelisted account to test for real; no local secrets needed.
4. Get it reviewed/merged. Merging to `main` is what ships to production
   (`meta-tutor.vercel.app`).

Never force-push or delete `main`. Local `npm run dev` works fine for anything that doesn't need live
secrets (plain pages/UI); for AI calls, auth, or DB reads, test via the preview URL instead of copying
production secrets to your own machine.

## Verification — don't call it done on a type-check alone
Established standard in this repo (see `STATUS.md` history): `npx tsc --noEmit` clean is the floor,
not the finish line. Before marking something done, actually look at it — run `npm run dev`, navigate
to the real page (or use the preview URL), and confirm it renders and behaves as expected. A clean
build is necessary but not sufficient.

## Process log — write back what you did
`STATUS.md` is the running log of real work sessions: what was built, how it was verified, what's
still open. Append an entry (don't overwrite prior ones) when you finish something non-trivial —
future sessions (yours or anyone else's) rely on it to know what's actually been done vs. just
planned. `PROCESS.md` is for deeper incident/decision writeups when something broke or a design
choice needs the reasoning preserved.
