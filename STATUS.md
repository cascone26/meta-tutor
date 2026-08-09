# Meta Tutor — Status

## Last Updated
2026-08-09 (RCA teacher umbrella added, still on hub-shell branch)

## Current State
- Live at `https://meta-tutor.vercel.app` (production, main branch — this is Cris's course, unaffected by the work below)
- GitHub: `https://github.com/cascone26/meta-tutor.git`
- Built for Cris's Thomistic Metaphysics course
- Google login required for all routes
- Uses Claude Haiku (via `CLAUDE_MODEL` env var) with rate limiting (75/day) and prompt caching

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
- Latin: still the placeholder stub from before — real content needs Jacob's actual syllabus/textbook,
  couldn't build that unattended.
- **RCA teacher umbrella — new, 2026-08-09**: `/rca` is Jacob's personal teaching-prep hub for his
  Regina Caeli Academy job (6th Grade Lead + Music 3-4/PE 3-4/PE 5-6, Mon/Thu 9am-3:30pm, KSC center).
  Added the `Umbrella` concept to `subjects.ts` (a station-group with its own sub-landing page, distinct
  from a single-station `Subject`) — `/hub` now shows the RCA umbrella card above the regular station
  list. `/rca` lists all 10 classes with weekly schedule up top; `/rca/[slug]` is per-class detail +
  resource links + a subject-aware AI lesson-prep chat (`/api/rca-chat`, same auth/rate-limit/streaming
  pattern as `/api/chat`). Only Music 3-4 has real transcribed lesson content (all 32 weekly lessons,
  `src/lib/rca-content/music-3-4.ts`) with a working prev/next lesson viewer that auto-picks the current
  week; the other 9 classes link out to their master lesson plan Google Docs (most are access-restricted
  to Jacob's RCA staff account, not yet pulled in). PE 3-4/5-6 curriculum genuinely doesn't exist yet
  (RCA hasn't sent it either year) — flagged as missing, not stubbed. See `PROCESS.md` "RCA Teacher
  Umbrella — 2026-08-09" for the full research trail and next steps.
- Not yet done: run `supabase-schema-hub.sql`, merge to main / deploy, real Latin content, generalizing
  the AI chat/evaluate routes to be subject-aware instead of metaphysics-hardcoded, pulling the remaining
  9 RCA classes' full lesson content (blocked on doc access), RCA roster/weak-area tracking (blocked on
  enrollment finalizing near Aug 17).

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
- Shares TeacherKit API key with LessonDraft (consider separating)

## Stack
Next.js 16, NextAuth (Google OAuth), Anthropic API (Claude Haiku), Tailwind CSS, TypeScript
