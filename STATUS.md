# Meta Tutor — Status

## Last Updated
2026-08-13 (full-day RCA session: real curriculum/schedule fixes, per-subject practice-mode curation, a
new calendar view, a Supabase-backed rate limiter, a sick-him audit pass, and — after six real rounds —
the garden scene's shadows. See PROCESS.md's "Real Curriculum, Real Schedule, Practice-Mode Curation,
Calendar, Rate-Limit Fix, Six-Round Shadow Saga — 2026-08-13" entry for the full trail; this section is
just the current-state summary.)

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
underneath. Jacob's own learning (chess, Latin, ...), not Cris's course — additive only.
- `/hub` — subject picker landing page. Built, builds clean, routes locally (verified via `npm run build`
  and local dev server route checks 2026-08-08).
- `/chess`, `/latin` — stub subject pages with their own layout/theme, wired to a new namespaced
  weak-area engine (`src/lib/subject-progress.ts`). Content is placeholder ("coming next" + empty
  weak-areas state) — no real study content yet.
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
