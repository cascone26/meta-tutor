# Meta Tutor — Status

## Tutor Core Phase 1: unified progress interface (2026-08-30)
Start of the 10-phase platform plan (`~/.claude-cobo/plans/linked-churning-rainbow.md`) turning Meta
Tutor from 5 separately-built subject apps into one shared-intelligence platform, per Jacob's explicit
direction: Meta Tutor should be "the best personal tutor" for anything, with one intelligence layer that
knows him across every subject rather than 5 silos. Full context in the plan file.

Phase 1 is additive-only, zero live-route changes: `src/lib/tutor-core/types.ts` (`WeakArea`, `DueItem`,
`SubjectSnapshot`, `LearnerProfile`), `src/lib/tutor-core/progress-interface.ts` (`SubjectProgressAdapter`
— deliberately loose, summary outputs only, no shared algorithm state so Latin's FSRS/Trivia's SM-2/RCA's
quiz-history all stay untouched underneath), and a new `mt_learner_profile` table in
`supabase-schema-hub.sql` (not yet run live — same manual SQL-Editor step as always). Nothing reads or
writes this table yet — that's Phase 3 (learner-profile API) and Phase 5/6 (first two subject adapters).
`tsc --noEmit` clean. Report-tier: no live behavior to verify yet, this phase is pure scaffolding.

## Latin Lab: live-verified, silent-failure bug fixed (2026-08-30, same day)
Drove the actual built app with the headless Viewer (Playwright over CDP, dev server +
proxy.ts's existing `x-dev-preview` bypass — no OAuth needed) and read real screenshots
of every tab with my own vision, per the fleet's own-eyes-only rule, instead of trusting
`tsc`/`next build` passing as proof anything actually renders right (Report vs Handle:
the previous entry below was Report-tier only — nobody had looked at it running).

Found and fixed a real bug this surfaced: `ProgressPanel.tsx` and `VocabReview.tsx` both
called `r.json()` on the `/api/latin-progress` response without checking `r.ok` — the
route's 401 body is plain text ("Unauthorized"), so `r.json()` throws, and the empty
`.catch(() => {})` swallowed it. Effect: `ProgressPanel` got stuck on "Loading…" forever
(no `data` ever set), `VocabReview` showed "Nothing due for review right now — nice work"
on a genuine fetch failure (false reassurance). This isn't dev-preview-specific — the same
silent failure would hit real usage on any transient error (network blip, expired session,
Supabase hiccup). Both now track a real `error` state with a Retry button. Verified fixed
via the same screenshot method (committed proof: `~/estate/data/renders/latin-lab-verify/`
screenshots taken before cleanup, not kept — see this entry as the record instead).
Committed `7a10aed`, pushed to `main`. Vercel CLI auth had expired (`vercel login` needed —
flagged to Jacob, not something to force), but the project is GitHub-linked so the push
almost certainly auto-deployed; confirmed production is up and routes respond correctly
post-push via curl (`/latin-lab` 302, `/hub` 308, `/api/latin-progress` 302, all
unauthenticated-redirect as expected, no crash).

Still Report-tier/unverified: the Supabase SQL for `mt_latin_vocab_state` and
`mt_latin_comprehension` still hasn't been run (no DB URL, no Supabase CLI token, no
stored dashboard session anywhere on this machine — checked, not assumed), so real
FSRS/comprehension data still can't persist yet. Real human login test on either account:
still not done.

## Latin Lab: research-based, adaptive standalone Latin course (2026-08-30)
Jacob wants to test-drive what a genuinely "individualized learning station" version of
Meta Tutor looks like (the pivot from Cristian's voicemail, see the entry below) — using
Latin as the guinea-pig subject since he can personally judge whether it's actually good,
and separate from RCA's First Form Latin 6 (which stays locked to the kids' actual
curriculum for lesson-preview tracking). Explicit ask: "research base," "top of the line,"
individualized, tracks what he's good/bad at, adapts.

**Research first** (fork, WebSearch — see PROCESS.md-style trail in this entry since
there's no separate research doc): compared Ørberg's comprehensible-input method (LLPSI)
vs. Wheelock's grammar-translation vs. Cambridge's reading method for evidence behind real
reading fluency/retention — CI wins on that specific claim (peer-reviewed Cambridge Journal
of Classics Teaching research), so that's the pedagogy. Separately researched what's
realistic for a single-learner adaptive system: FSRS beats the app's existing SM-2 for
per-item forgetting-curve modeling (Anki's default since 2024, ~20-30% fewer reviews for
same retention); Bloom's 2-sigma / mastery learning supports a corrective re-review loop
on missed items; explicitly ruled out as NOT realistic for one user — collaborative
filtering, neural embeddings, anything needing cohort-scale data (Duolingo-style).

**What's built**: 3 original units (`src/lib/latin-lab/units.ts`) — Unit 1 nominative
case/sum-esse, Unit 2 adjective agreement, Unit 3 genitive singular — original Latin
narrative (not a transcription of Ørberg's copyrighted text, only the CI pedagogical
structure is reused, which nobody owns), classical pronunciation. 7 more units roadmapped,
not written. Adaptive engine: `ts-fsrs` (real npm package, not hand-rolled) schedules
vocab review; comprehension questions are generated per-attempt by Claude Haiku from the
unit's actual narrative at a difficulty tier chosen by the learner's rolling accuracy
(`src/lib/latin-lab/server-progress.ts`) — never hand-written, can't be memorized; missed
questions get a Socratic explanation grounded in the specific wrong answer; weak-grammar-
concept tracking is plain SQL aggregation over comprehension misses, not ML. New Supabase
tables `mt_latin_vocab_state`/`mt_latin_comprehension` added to `supabase-schema-hub.sql`
— **not yet run live** (same manual-SQL-Editor step as `mt_rca_pacing_override`/
`mt_rca_grading_checklist` below, which also still haven't been run — this repo has no DB
credentials to run DDL programmatically). New route `/latin-lab`, Jacob-only (added to
`JACOB_ONLY_PREFIXES`, `CODEOWNERS`), tile added to the hub landing page.

**Real bug found and fixed while wiring this up**: `/api/subject-progress` was in
`JACOB_ONLY_PREFIXES` from before the two-account split (2026-08-29), but the entry below
(Cristian's quiz-history/wrong-answers migration) made his account call that same shared
route — `proxy.ts`'s matcher covers `/api/*` (only `/api/auth` excluded), so this was
silently redirecting his calls to `/metaphysics` HTML instead of returning JSON. Would
have broken his progress tracking on first real use. Removed from the Jacob-only list; the
route was already safely scoped server-side by session email, so nothing else changes.

`tsc --noEmit` and `npm run build` clean, deployed, post-deploy curl confirms `/latin-lab`
and both new API routes correctly 302 to `/login` when unauthenticated (no server crash).
**Report-tier only** — nobody has logged in and actually read a unit, taken a comprehension
check, or reviewed a vocab card yet. And genuinely important to be honest about: "perfectly
adaptive" isn't a day-one property of any real system — the difficulty-selection and
weak-concept tracking need real usage (the code explicitly treats <15 comprehension checks
and <3 samples as "not enough signal yet") before they're actually calibrated to how Jacob
specifically learns, not just structurally capable of it.

## Cristian's quiz history/wrong-answers migrated off localStorage (2026-08-30)
Cristian called about a real product gap: he wants Meta Tutor to help him retain metaphysics
long-term (he's now in an Ethics course and wants to hold onto old material), not just cram for
one exam — "talk to your AI," "see how everything connects." Investigated first: the retention-
focused modes he was describing already exist and are live (`/study`'s SocraticDialogue/TeachBack/
Debate/AnalogyGenerator, `/map` concept map, `/compare`) — nothing needed building there, he just
hadn't logged in in a while. But auditing that area surfaced a real, concrete gap: his entire
progress/retention data (`src/lib/study-history.ts`, `src/lib/wrong-answers.ts`) was 100%
localStorage — device-bound, gone if he clears browser data or switches devices, which directly
undercuts "retention." RCA already had the exact backend needed (`mt_quiz_history`/
`mt_wrong_answers` Supabase tables via `subject-progress.ts`/`/api/subject-progress`, scoped by
`user_email`+`subject`) — ported Cristian's side onto the same tables under `subject="metaphysics"`,
no new schema. Both lib files became thin async wrappers with the same function names, so most of
the ~15 call sites (5 study components doing fire-and-forget `saveResult`/`logWrongAnswer`) needed
no changes; the 4 pages that read the data synchronously (`countdown`, `dashboard`, `review`,
`journal`) were updated to the async pattern. `tsc --noEmit` and `npm run build` clean, live Supabase
tables confirmed reachable (200 via REST) before shipping, deployed to production (commit `49d3b10`),
post-deploy curl confirms `/` and `/journal` still 302-redirect to `/login` (no server crash).
Report-tier only — nobody has logged in as Cristian and actually taken a quiz to watch a row land
in `mt_quiz_history`. Not touched this session (still localStorage, lower priority, no ready-made
backend to reuse): `streaks.ts` (daily streak/badges) and `spaced-repetition.ts` (term mastery). Also
still open: `/metaphysics`'s exam-question bank (`src/lib/questions.ts`) is a static hardcoded list
from when Cristian first built the app — doesn't reflect his current Ethics course. RCA's own
`/api/rca-understanding` already solved this exact problem (generates questions dynamically from
current lesson content); porting that pattern to Cristian's area is the natural next move if he
wants fresh material without hand-editing the array.

## Two-account access control + git workflow separation (2026-08-29)
Cristian is back from college and using Meta Tutor again; needed (1) separate accounts so he
and Jacob aren't in each other's areas, and (2) a way for both to touch the codebase (Cristian
possibly via his own Claude Code, staying with Jacob part-time) without repeat merge chaos —
see the 2026-08-24 entry below where a 13-commit concurrent push had to be hand-reconciled.

**Security gap closed first**: the repo is public and the app rides Jacob's own Claude Max
OAuth token — `src/auth.ts` had **zero email allowlist**, anyone with a Google account could
sign in and burn the 75/day AI quota. Fixed via a `signIn` callback.

**Two-account model** — `src/lib/access.ts` (new):
- `JACOB_EMAIL`/`CRISTIAN_EMAIL` (env-overridable, default to the two real accounts) map to
  roles `"jacob"` | `"cristian"`. `roleForEmail()`/`isAllowedEmail()` are the only functions
  that read them.
- `src/auth.ts` — `signIn` callback rejects any email not in the allowlist (NextAuth's default
  AccessDenied page).
- `src/proxy.ts` — after the existing login-redirect check, a new block redirects Cristian's
  role away from any `isJacobOnlyPath()` (the pre-existing hub-shell prefix list — `/`, `/hub`,
  `/rca`, `/chess`, `/trivia`, `/riemann`, `/latin`, plus their `/api/rca-*`, `/api/chess-coach`,
  `/api/riemann-*`, `/api/trivia-*`, `/api/subject-progress` routes) back to `/metaphysics`.
  Jacob's role has no restriction — per his call, he keeps full visibility into Cristian's
  Metaphysics-suite pages, only Cristian is scoped down. The dev-preview bypass
  (`x-dev-preview` header, non-prod only) is hardcoded to role `"jacob"` so the existing
  playwright scripts (`scripts/mt-shot.mjs` etc.) keep working unauthenticated.
- Landing-page redirect is a side effect of the above (root `/` is in `JACOB_ONLY_PREFIXES`) —
  no change needed to `src/app/login/page.tsx`'s hardcoded `redirectTo: "/"`.
- **Verified**: `npx tsc --noEmit` and `npm run build` both clean. Role/path logic
  unit-verified standalone (node script, all cases pass — real emails, case-insensitivity,
  unknown email, every jacob-only vs. shared path). **Not yet Handle-tier**: nobody has done a
  real Google OAuth round-trip as either account yet — that needs a real login from each Gmail,
  flagged for Jacob to confirm live.

**Git workflow** — `CODEOWNERS` (new, repo root) + `CONTRIBUTING.md` (new): Jacob owns (requires
his review to merge) the RCA/chess/trivia/riemann/hub paths plus core plumbing (auth/proxy/
access/next.config/package.json/Supabase schemas); everything under Cristian's existing
Metaphysics-suite paths has no owner entry, so he can merge those freely once he has write
access. **Not yet enabled** — Jacob chose to prep-only this session (branch protection + adding
Cristian as a GitHub collaborator stay off until his GitHub username is known); exact `gh api`
commands to flip it on live in `CONTRIBUTING.md`. Also documented a `git worktree` pattern for
when both are running Claude Code against this repo on the same Mac at the same time, so
simultaneous sessions don't collide on uncommitted files in one shared directory.

**Not done this session**: adding Cristian as a GitHub collaborator, turning on branch
protection (both blocked on his GitHub username), and migrating `/metaphysics`'s
localStorage-only chat/confidence state (`meta-tutor-chat`, `meta-tutor-confidence` keys,
`src/app/metaphysics/page.tsx`) to Supabase — it's device-local today, which only matters if
Cristian and Jacob ever share one literal browser profile; flagged, not fixed, since it
predates this session's ask and out of scope for it.

## RCA class-page fixes + real content grounding + widget drawer (2026-08-24)
Jacob's list: Baltimore Catechism quiz content wrong, Latin "needs to be better," flashcard
count/index bug switching categories, learning not matching the current week, "too HTML-y" look,
phonogram audio voice/accuracy, a real audio phonogram quiz, redundant "< Hub" button,
calendar/dark-toggle collision, a Baltimore Catechism teacher's guide, and a K2C-style
widget-customize drawer. Worked on HP against a local `next dev` using `src/proxy.ts`'s existing
dev-preview auth bypass + a new Windows-adapted `scripts/mt-shot.mjs` (playwright) to actually
screenshot/click through the real app.

**Mid-session merge conflict, handled non-destructively**: another session pushed 13 commits of
substantial, overlapping RCA work (real recorded audio for phonograms/Latin via Sound Studio, a
full public-domain Baltimore Catechism reference + Gospel of Mark/Luke, a pacing self-correction
feature, grading checklist, substitute page, dim mode, and more) to `origin/main` while this
session was mid-flight on the same files. Reconciled by hand rather than force-pushing over it:
saved this session's original work on branch `hp-rca-fixes-2026-08-24`, reset to their `origin/main`,
then re-applied only what was still genuinely additive on top of their (often better) work. See
PROCESS.md for the full reconciliation account, including a real content-accuracy bug found in
THEIR work in the process (see below).

**Content grounding, not guessed** — `buildSubjectReferenceBlock()` in `rca-grounding.ts`, wired
into `/api/rca-understanding`'s system prompts, so AI-generated quiz/flashcard content grounds in
real material instead of a bare pacing line:
- Religion 6: `src/lib/rca-content/baltimore-catechism-guide.ts` (topic-accurate paraphrase of the
  real Baltimore Catechism No. 3, 1949 Fr. Connell/Confraternity edition — confirmed against a real
  hosted copy at drbo.org). **Deliberately NOT** the other session's `baltimore-catechism.ts`
  ("No. 2," verbatim, public domain) — found live that its numbering doesn't match RCA's own
  citations (RCA says "Lesson 15 #195 — The Ten Commandments"; No. 2's real Q195 is about
  contrition, a different edition). Using it under RCA's citations would have relocated the exact
  bug Jacob reported, not fixed it. No. 2 stays a good general full-book reference
  (`/rca/religion-6/catechism`), just not the source for precise weekly cross-referencing.
  `getCatechismLessonsForWeekText()` also fixes a real drift: RCA's `religion-6.ts` lesson `n` is
  the teaching-WEEK index, not the real catechism lesson number — they diverge after week ~16
  (week 22 references real catechism Lesson 27, not 22). Verified live both ways.
- Latin/LOE: wired to the other session's real `latin-core.ts` (ecclesiastical pronunciation,
  Whisper-verified audio) and `phonogram-sounds.ts` — these already existed for Sound Studio but
  were never fed to the AI generator until now.

**Bug fixes (live-verified via playwright against real `next dev`):**
- `Flashcards.tsx` (generic Study system) — hardened the category-switch reset + added a
  render-time index clamp as defense-in-depth. Live-tested the literal reported scenario (67-card
  "All" deck at index 14, switch to a 10-card "Numbers" category) — correctly shows 1/10, both on
  a fresh restore and a live in-session switch.
- `LessonViewer.tsx` + `PacedLesson.tsx` — fixed a real React duplicate-key console error (lesson
  sections sharing one `label` as their key) + a redundant repeated "Week N (...)" line per
  section; now shows the week once, "Monday —"/"Thursday —" per line.
- Header "< Hub" vs "All RCA classes" — new `HeaderBackLink.tsx` makes the header's back button
  pathname-aware: "Hub" only on the bare `/rca` hub, "All RCA classes" everywhere deeper. Removed
  the now-redundant body-level "Back to RCA"/"All RCA classes" pills on `[slug]`, `/today`,
  `/week`, `/substitute`, `/changelog`, `/pacing-explainer`, `/progress` that used to double up
  with it.
- Calendar/dim-mode collision — the other session's new dim-mode toggle lived inside
  `RcaThemeShell`'s header, in-flow at the far right — landing in roughly the same on-screen spot
  as `CalendarPopup`'s own fixed `right-4` button. Extracted it to `DimModeToggle.tsx`, a
  coordinated fixed sibling (`right-[60px]`), state lifted to a new `RcaChrome.tsx` wrapper so both
  stay in sync. Verified via real bounding-rect measurement, no overlap.
- `LayoutDrawer.tsx`'s button was found live rendering ~400px off from its intended `left-5` —
  trapped inside an ancestor's CSS animation (a `transform`-bearing keyframe creates a new
  containing block for `position: fixed` descendants, the same class of bug `CalendarPopup`'s own
  code comment documents). Fixed by portaling to `document.body`.

**New:**
- `LayoutDrawer.tsx` + `rca-layout-prefs.ts` + `RcaClassBody.tsx` — per-class widget customize
  drawer (drag or up/down arrows to reorder, checkbox to hide, persisted) covering
  Books/Links/Reference Materials/Year B link/Lesson pacing/Grading checklist/Practice/Teacher's
  guide.
- `TeacherGuide.tsx` — Baltimore Catechism discussion questions + True/False (answers hidden until
  tapped), religion-6 only for now (other subjects show an honest "not built yet").
- `SoundStudio.tsx` gained a third tab, "Audio quiz (guess the phonogram)" (`ReverseQuizMode`) —
  the actual audio self-test Jacob asked for: hear a phonogram/Latin word's real sound, type a
  guess, reveal to self-check. Built on the same real pre-generated audio as the existing
  Study/Class-quiz tabs, not a separate lower-quality TTS system.
- `tts-voice.ts` + `AudioReview.tsx` voice picker — generic Study-page audio (unrelated to RCA, not
  touched by the other session) now lets Jacob pick/persist a real system voice instead of
  whatever the browser defaults to.
- `Flashcards.tsx` visual pass — real 3D flip (perspective+rotateY), gradient card face,
  deck-progress bar. This generic Study/Flashcards system (built for Cris's Metaphysics course,
  repurposed by Jacob for his own Latin/Religion custom deck) is what "too HTML-y" was actually
  pointing at — never restyled for the RCA nature theme because it predates it.

**Verification:** `npm run build` clean (0 TS errors, 56 routes) after full reconciliation.
Playwright scripts (`scripts/mt-shot.mjs`, `scripts/mt-test-*.mjs`) screenshot/click through the
real dev server via the dev-preview bypass — kept in the repo as reusable regression checks.
**Not done this session:** a live end-to-end AI-generation response (no Anthropic key in this HP
session's local env) — the routes are build-clean and correctly auth-gated, but whether the model
actually produces correct catechism/Latin/phonogram content from the new grounding blocks is
Report-tier until Jacob runs a real Speed Drill/Match session on the live app.


## Known gap — Trivia progress not persisted from Play Quiz or Daily 5 (found 2026-08-19)
`/trivia/play` (main quiz mode) has **zero network calls** — no fetch, no localStorage, fully
ephemeral, resets on navigation. `/trivia/daily` persists completion to **localStorage only**
(`mt_trivia_daily` key), never calls `/api/trivia-progress`. Only `/trivia/review` (the SRS deck)
actually POSTs to Supabase. Live-verified: played a real Daily 5 (2/5 correct), reloaded `/trivia`,
stats still read 0 answered / 0% / streak 0. This directly contradicts the 2026-08-17 Trivia Phase 1
entry below ("XP/level system... difficulty-weighted XP per scone-zone's original formula") — no XP/
leveling calculation exists anywhere in `src/lib/trivia-*.ts`; the stats page only *displays* whatever
`level`/`xp` values are already in the DB, nothing ever writes them. Doc got ahead of code again (same
failure mode as the chess phase-tagging gap above). The backend (`/api/trivia-progress` POST actions:
`updateProgress`, `updateCategoryStats`, `updateDailyStats`, `logSession`, `upsertSRSCard`) is fully
built and working — this is purely a missing client-side wiring gap in two of three quiz-flow pages.
**Not yet fixed** — flagged for Jacob to scope (needs an XP formula decision, not just plumbing).

## Last Updated
2026-08-19 (Chess station overhaul: fixed weak-area tracking (was severity-only, no phase
tagging despite STATUS claiming it — added src/lib/chess-phase.ts, wired into move analysis +
the /chess weak-areas panel), added per-panel display toggles (advantage bar/material/move
list/weak-areas/auto-coach in SettingsPanel "What to show while playing"), and built a real
Socratic coach (/api/chess-coach + CoachChat.tsx, RcaAssistant-style floating panel) to replace
"Hint" (which just draws the engine's best-move arrow) as the primary help path — grounded in
real engine eval/best-move/phase, asks guiding questions before stating the answer. Also added
chess.com-parity board interactions: right-click highlights + arrow annotations, legal-move
dots while dragging (previously click-only), flip board, takeback. Build clean (0 TS errors,
all routes incl. new /api/chess-coach), pushed to main. See commit 92de23b.

**UPDATE same day, later session**: used the Filament Viewer (headless Chrome + CDP, real screenshots
read directly into context, no third-party vision proxy) to actually click through the deployed site —
found and fixed TWO real, pre-existing, silent production bugs in the process, not just verified the
chess work:
1. **`NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` had a literal stray pair of quote
   characters baked into the stored Vercel env var VALUE itself** (confirmed via raw byte dump — every
   other env var had exactly one quote-wrap from `vercel env pull`'s own formatting; these two had
   two). Been broken since they were set (~10 days ago). Silently broke EVERY Supabase-backed feature
   app-wide (weak-area tracking, rate limiting, notes, trivia, RCA progress) because the client code
   fails-open/catches-and-returns-empty everywhere — nothing ever looked broken, it just quietly never
   persisted. Fixed by re-adding both vars (prod+preview) with clean values.
2. **The Anthropic OAuth token synced to Vercel was stale** — `~/tools/sync-meta-tutor-token.sh` runs
   every 3h and only pushes when the Keychain token differs from its last-synced state; the local token
   had rotated since the last successful run and the next scheduled run hadn't fired yet. Manually ran
   the sync script to push the current valid token + redeploy. Affects ALL AI routes (chat, rca-chat,
   socratic, chess-coach, riemann-chat, debate, trivia-generate) — same known dependency already
   documented above, just caught it actually broken in the wild for the first time.
Also fixed: coach responses used markdown (`**bold**`) the plain-text chat UI can't render, and the
client was swallowing the real SSE error text behind a generic message — exactly what made bugs #1/#2
opaque to diagnose from the UI alone (commit 88909fc). Live-verified end-to-end after both fixes: sent
a real question through the actual coach button on the live site, got a real grounded, Socratic (not
answer-dumping) response back. Screenshots in `~/estate/data/renders/mt-coach-final.png` etc.
Prior: 2026-08-17 Trivia station Phase 1 built — 5 pages, 2 API routes, 6 Supabase tables for
persisted progress/SRS, all 12 question categories ported from scone-zone with full feature
parity, spaced-repetition system, daily 5 challenge, XP/level system. See PROCESS.md "Trivia
Station Phase 1" entry for full architecture + proof pointers.
Prior: 2026-08-16 RCA term-ended schedule gap fixed.)

**`hub-shell`/`main` divergence from the 2026-08-09 entry below is RESOLVED**: `main` was fast-forwarded
to match `hub-shell` (2026-08-13) and pushed — Production's Git branch and what's actually live are no
longer silently diverged. Root is now genuinely the hub landing page on `main`, not just on the
manually-deployed Production build.

## Current State
- Live at `https://meta-tutor.vercel.app` (production, `main` — hub landing page at root, Cris's course
  at `/metaphysics`. `main` and `hub-shell` are in sync as of 2026-08-13; keep deploying from `hub-shell`
  as before and fast-forward `main` periodically so they don't silently diverge again.)
- GitHub: `https://github.com/cascone26/meta-tutor.git`
- Originally built for Cris's Thomistic Metaphysics course; now a multi-subject personal hub — Jacob's RCA
  teaching umbrella (the primary, actively-used section) + chess + Cris's course
- Google login required for all routes
- Uses Claude Haiku (via `CLAUDE_MODEL` env var) with rate limiting (75/day) and prompt caching
- **AI auth: reuses Jacob's Claude Max subscription via OAuth (`ANTHROPIC_AUTH_TOKEN`/`ANTHROPIC_REFRESH_TOKEN`),
  not a billed API key** — deliberate choice, confirmed with Jacob twice. Kept alive by
  `~/tools/sync-meta-tutor-token.sh`, a LaunchAgent on Jacob's Mac (`com.cobo.meta-tutor-token-sync`, every
  3h) that pulls the live token from this Mac's Keychain (same source `~/tools/ai-gateway.cjs` uses) and
  pushes it to both Vercel environments + triggers redeploys. **Real dependency**: this Mac needs to stay
  on / Claude Code needs to stay logged in for AI features to keep working — if they break again, check
  `~/logs/meta-tutor-token-sync.log` before assuming a code bug. See PROCESS.md "Root Cause Found + Fixed"
  (2026-08-09) for the full diagnostic trail.

## In Progress (branch `hub-shell`, NOT merged/deployed — claimed status only, not live)
Turning Meta Tutor into a multi-subject hub: one login/app, subject-specific sub-apps branching off a
landing page ("train station"), each with its own look, sharing one AI + weak-area-tracking engine
underneath. Jacob's own learning (chess, Latin, trivia, ...), not Cris's course — additive only.
- `/hub` — subject picker landing page. Built, builds clean, routes locally (verified via `npm run build`
  and local dev server route checks 2026-08-08).
- `/chess`, `/latin` — stub subject pages with their own layout/theme, wired to a new namespaced
  weak-area engine (`src/lib/subject-progress.ts`). Content is placeholder ("coming next" + empty
  weak-areas state) — no real study content yet.
- `/trivia` — full-featured trivia station, Phase 1 complete (2026-08-17). 5 pages: landing page with
  quick stats + category picker, `/play` quiz flow with category/size/timer options, `/review` SRS deck
  review with SM-2 spaced repetition, `/daily` deterministic 5-question daily challenge, `/stats` charts +
  category breakdown. All 12 question categories (geography, history, science, movies-tv, music, sports,
  literature, food-drink, art, pop-culture, mythology, presidents) ported from scone-zone with full content.
  Supabase-backed persistence: 6 tables (mt_trivia_progress, mt_trivia_srs_cards, mt_trivia_category_stats,
  mt_trivia_daily_stats, mt_trivia_sessions, mt_trivia_ai_questions). 2 API routes: `/api/trivia-progress`
  (GET/POST for all CRUD), `/api/trivia-generate` (Claude Haiku AI question generation w/ rate limiting).
  XP/level system, streak tracking, difficulty-weighted XP per scone-zone's original formula. Verification:
  `npm run build` clean (0 TS errors, 38 routes total), all 5 trivia routes + 2 API routes listed in build
  output. **Not yet verified**: authenticated real user round-trip (needs Google login + Supabase tables to
  exist in prod — SQL schema at `supabase-schema-trivia.sql` awaits manual paste). Blocked on: table
  creation (no DB CLI). See PROCESS.md for architecture research trail + next steps.
- Cris's existing routes (`/`, `/study`, `/glossary`, etc.) and `Nav.tsx`/`Prayer.tsx`/`Onboarding.tsx`/
  `SessionTimer.tsx` are unchanged in behavior — those components got a pathname guard
  (`isHubShellRoute`) so they simply don't render on the new `/hub|/chess|/latin` routes; nothing about
  her experience changes. Verified via `npm run build` (all 29 routes compile) + local route smoke test.
- **Persistence**: `subject-progress.ts` now backed by Supabase, not localStorage — reuses LessonDraft's
  existing Supabase project (`jqeypwrmsgjsmggdgvgd`), isolated via `mt_`-prefixed tables
  (`mt_wrong_answers`, `mt_quiz_history`), keyed by NextAuth session email. New `/api/subject-progress`
  route (GET/POST, auth-gated same pattern as `/api/notes`). Client lib (`src/lib/subject-progress.ts`)
  and `/chess`, `/latin` pages updated to call it. Chose to share LessonDraft's project rather than spin
  up a new one — personal single-user use, zero new infra/cost, already proven working from Vercel.
  **Tables not created yet** — `supabase-schema-hub.sql` is written (additive only, doesn't touch any
  existing table) but needs to be pasted into the Supabase SQL Editor by hand; no DB password/CLI session
  available to run DDL directly. Until that's run, `/api/subject-progress` will 500 once authenticated
  (build compiles fine, route is wired, just no tables to query yet).
- Verified 2026-08-08: `npm run build` clean (30 routes, 0 TS errors), local dev smoke test — `/`, `/hub`,
  `/chess`, `/latin`, `/api/subject-progress` (GET+POST) all correctly redirect/401 when unauthenticated,
  no runtime errors in dev log. **Not yet verified**: authenticated round-trip (needs a real Google login)
  and the actual Supabase writes (blocked on the SQL Editor step above).
- **Chess module — real, playable**: `/chess` now has an actual board (`react-chessboard` + `chess.js`)
  against a real Stockfish 18 engine (lite/single-threaded WASM build, runs client-side in a Web Worker,
  files in `public/stockfish/`, zero server cost). Pick a color + bot strength (Beginner/Intermediate/
  Strong via Stockfish's Skill Level option), play a full game. Every one of your moves is analyzed
  (centipawn-loss vs. the engine's best line at depth 12) and flagged blunder/mistake if it crosses a
  threshold (≥200cp / ≥90cp), tagged by phase (opening/middlegame/endgame) and logged into the same
  `subject-progress` weak-area system as everything else. Game summary saved on game end/resign.
  `src/lib/chess-engine.ts` (engine wrapper), `src/components/chess/ChessGame.tsx` (the board + game loop).
- **Latin — consolidated into RCA, no longer a standalone station.** `/latin` 308-redirects to
  `/rca/first-form-latin-6` (`next.config.ts`). Old dark-brown stub page deleted.
- **RCA teacher umbrella — new, 2026-08-09, nature-themed pass same day**: `/rca` is Jacob's personal
  teaching-prep hub for his Regina Caeli Academy job (6th Grade Lead + Music 3-4/PE 3-4/PE 5-6, Mon/Thu
  9am-3:30pm, KSC center). Added the `Umbrella` concept to `subjects.ts` (a station-group with its own
  sub-landing page, distinct from a single-station `Subject`) — `/hub` shows the RCA umbrella card
  (sky-blue accent) above the regular station list. `/rca` lists all 10 classes (Latin now folded in as
  First Form Latin 6) with weekly schedule up top, styled with a light sky-to-earth gradient and simple
  hand-drawn nature icons (`src/components/rca/NatureIcons.tsx` — bird/butterfly/leaf/sky, not emoji).
  `/rca/[slug]` is per-class detail + resource links. Only Music 3-4 has real transcribed lesson content
  (all 32 weekly lessons, `src/lib/rca-content/music-3-4.ts`) with a working prev/next lesson viewer that
  auto-picks the current week; the other 9 classes link out to their master lesson plan Google Docs (most
  are access-restricted to Jacob's RCA staff account, not yet pulled in). PE 3-4/5-6 curriculum genuinely
  doesn't exist yet (RCA hasn't sent it either year) — flagged as missing, not stubbed. A single
  **persistent floating assistant** (`RcaAssistant.tsx`, bird-icon button bottom-right) lives across the
  whole umbrella instead of a per-page chat box — stays open/available while navigating between classes,
  re-grounds itself per current page on each message (`/api/rca-chat`, same auth/rate-limit/streaming
  pattern as `/api/chat`). See `PROCESS.md` "RCA Teacher Umbrella" + "RCA Nature Theme + Latin
  Consolidation + Persistent Assistant" entries (both 2026-08-09) for the full research trail and next steps.
- **7 of 8 RCA classes now have real lesson-by-lesson content** (Saxon 7/6, LOE Essentials C, Classical
  Language Arts 6, Religion 6, History 6, Science 6, First Form Latin 6, plus Music 3-4 from the prior
  pass) — only... wait, that's all 8. Every RCA class Jacob actually teaches has a working lesson viewer
  now. Content is transcribed/condensed from RCA's 2025-2026 master docs (2026-2027's not sent yet) via
  `src/lib/rca-content/*.ts`, all sharing one generic schema (`types.ts`) + one `LessonViewer` component +
  one `rcaContent` registry (`index.ts`) — no more per-subject special-casing. **PE 3-4/PE 5-6 removed
  entirely** per direct instruction, not stubbed.
- **"Test my understanding" comprehension check — new, 2026-08-09**: every class page with real lesson
  content now has a real active-recall feature, not just a reader. `/api/rca-understanding` generates 4
  subject-tailored questions from the CURRENT lesson (actual computable math problems for Saxon, grammar
  items for Latin/LOE, content questions for Religion/History/Science/Music) and grades free-text answers
  via a second AI call (correct/partial/incorrect + feedback), reusing the existing `subject-progress.ts`
  Supabase-backed tracking (namespaced `rca-<classId>`) for wrong-answer/history logging — same
  infrastructure Cris's course and the old Latin station already used, not rebuilt.
- Monday & Thursday now read as the real deadlines (bolded, "next teaching day" computed live) instead of
  a plain day list, and every RCA page has a visible banner stating content is from 2025-2026 docs
  (2026-2027 not sent yet) — previously that caveat only lived in code comments Jacob never saw.
- Not yet done: run `supabase-schema-hub.sql` (blocks the understanding-check's gap-tracking from
  persisting across sessions — the check itself still works live either way), merge to main / deploy,
  generalizing the AI chat/evaluate routes to be subject-aware instead of metaphysics-hardcoded, RCA
  roster/weak-area tracking (blocked on enrollment finalizing near Aug 17), refreshing content once RCA
  sends actual 2026-2027 docs. The understanding-check feature is Report-tier only — nobody's run one
  live yet. See `PROCESS.md`'s two 2026-08-09 entries for the fork pipeline / bugs fixed / this feature's
  design.

## Report vs. Handle (honesty check on everything above, 2026-08-08)
Per the Charisma discipline — Report (built, reasoned about, compiles) is not the same as Handle (actually
watched it work). Being explicit about which is which for this session's chess work, since it was built
fully unattended with nobody watching a browser:
- **Report-tier**: the whole chess feature — engine wrapper, board UI, blunder-detection math, Supabase
  wiring. `npm run build` is clean (0 TS errors, 31 routes), local dev smoke tests confirm every route is
  correctly auth-gated with no server-side crashes, and the WASM file itself was verified as a valid,
  uncorrupted WebAssembly binary that the worker's own `locateFile` logic will find (same directory,
  matching filename — checked directly in the built JS).
- **NOT Handle-tier yet**: nobody has actually dragged a piece in a real browser and watched the bot
  reply, watched a blunder get flagged, or confirmed the Supabase round-trip. That needs a real Google
  login + a real click-through, which requires either Jacob or an explicit ask to drive it via
  computer-use — deliberately not done unattended/unsupervised. Treat "it plays chess" as a strong,
  structurally-verified claim, not a proven one, until someone actually plays a game on it.

## What It Is
Study app with a strict no-cheat constraint — all features force active recall. No passive reading or answer lookup.

## Pages (15 routes)
- `/` — Landing/home
- `/login` — Google OAuth login
- `/dashboard` — Main hub
- `/study` — Active recall study mode
- `/review` — Review past material
- `/glossary` — Term glossary with CRUD editor and fuzzy answer matching
- `/compare` — Compare/contrast concepts
- `/notes` — Personal notes
- `/journal` — Study journal
- `/faith` — Faith page (Aquinas prayer modal)
- `/timeline` — Historical timeline
- `/map` — Concept map
- `/schedule` — Study schedule
- `/countdown` — Exam countdown
- `/sources` — Source materials

## AI API Routes (9 endpoints)
- `/api/analogy` — Generate analogies for concepts
- `/api/chat` — General Socratic chat
- `/api/debate` — Philosophical debate mode
- `/api/evaluate` — Evaluate student explanations
- `/api/evaluate-argument` — Evaluate philosophical arguments
- `/api/notes` — AI-assisted note features
- `/api/reading-quiz` — Generate quizzes from readings
- `/api/socratic` — Socratic questioning mode
- `/api/auth/[...nextauth]` — NextAuth Google OAuth

## Recent Work
- 2026-07-17 Comprehensive audit and security fixes:
  - Fixed model inconsistency: /api/chat was using claude-sonnet-4-6 (3-4x cost of Haiku). Reverted to claude-haiku-4-5-20251001 across all routes for consistency with 75/day rate limit.
  - Fixed rate-limiting security issue: was IP-based (vulnerable to bypass via shared ISPs/proxies, and resets on Vercel cold starts). Changed to user-based using email from auth session.
  - Added CLAUDE_MODEL to .env.example so users can discover the override option.
  - Updated README to accurately reflect Haiku model (not Sonnet).
  - Documented 11 undocumented commits since 2026-03-27 (timeout fixes, Google Fonts fixes, etc.).
  
- 2026-03-27 Full audit: /api/notes missing auth check fixed (was relying on middleware 307 redirect instead of 401); removed dead files faith-connections.ts and notes.txt from lib/. 0 TS errors, 0 npm vulnerabilities. Latest Vercel deploy healthy (build succeeded, all 26 pages/routes compiled).
- 2026-03-27 Security audit: Next.js 16.1.6→16.2.1 (5 CVEs fixed), picomatch ReDoS/injection, brace-expansion DoS; 0 vulnerabilities. middleware.ts→proxy.ts per Next.js 16.2 convention.
- Unit filter for study modes, Glossary CRUD editor with fuzzy answer matching
- Model moved to env var (`CLAUDE_MODEL`), Google login (NextAuth) — auth required for all routes
- Dark/light mode toggle, Aquinas prayer modal on Faith page, Timed exam duration

## Cost Controls
- Model: Claude Haiku (cheapest)
- Rate limit: 75 requests/day
- Prompt caching enabled
- $0 marginal API cost — runs on Jacob's Claude Max subscription via OAuth, not a billed key (see "AI auth"
  above). The old "shares TeacherKit API key with LessonDraft" note was stale; there's no API key at all now.

## Stack
Next.js 16, NextAuth (Google OAuth), Anthropic API (Claude Haiku), Tailwind CSS, TypeScript
