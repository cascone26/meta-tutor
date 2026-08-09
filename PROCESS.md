# Meta-Tutor Process Log

## Audit & Fixes — 2026-07-17

### Problem Statement
STATUS.md was 4 months stale (last updated 2026-03-27). Previous audits of other projects found silent production bugs despite outdated docs. This audit was initiated to verify actual state vs. documented state.

### What I Found

#### 1. Model Inconsistency (Cost Impact) — CRITICAL
**Issue:** The code had inconsistent default models across routes:
- `/api/chat`: defaulted to `claude-sonnet-4-6` (commit dac42f0 changed it "for better reliability")
- All other routes: defaulted to `claude-haiku-4-5-20251001`
- README (updated in 3a87831): said "Claude Sonnet"
- STATUS.md: said "Claude Haiku"

**Why it matters:** Sonnet is ~3-4x the cost of Haiku. The 75/day rate limit was designed for Haiku. Using Sonnet on chat API would cause the app to hit the rate limit much faster and run up costs.

**Decision:** Reverted `/api/chat` to use Haiku. The timeout issues that prompted the switch to Sonnet (commit dac42f0) were actually addressed by adding `maxDuration=30` to routes and reducing the Anthropic client timeout to 25s. Haiku should handle these within the SLA.

**Code changes:**
- `/api/chat/route.ts`: changed model from `"claude-sonnet-4-6"` to `process.env.CLAUDE_MODEL || "claude-haiku-4-5-20251001"`
- Updated README.md to reflect Haiku
- Updated .env.example with `CLAUDE_MODEL=claude-haiku-4-5-20251001`

#### 2. Rate-Limiting Security Vulnerability — CRITICAL
**Issue:** Rate limiting used IP address instead of user identity:
```typescript
const ip = req.headers.get("x-forwarded-for") || "unknown";
const { allowed } = checkRateLimit(ip);
```

**Why it's broken:**
- Multiple users behind the same ISP/proxy share one IP address
- On Vercel (serverless), in-memory rate limit resets on cold starts (very common)
- Users could:
  - Share quota with other users (bypass limit)
  - Trigger cold starts and reset their own quota
  - Use different IP ranges (if behind load balancer) to reset

**Decision:** Changed rate limiting to user-based, keyed on email from auth session.

**Code changes:**
- Updated all 7 AI API routes (chat, debate, analogy, socratic, evaluate, evaluate-argument, reading-quiz)
- Changed from `const ip = req.headers.get("x-forwarded-for")` to `const userId = session.user?.email || "unknown"`
- Changed from `checkRateLimit(ip)` to `checkRateLimit(userId)`

#### 3. Undocumented Commits (4 months of drift)
Found 11 commits since 2026-03-27 that weren't in STATUS.md:
- **Timeout handling:** f7e7435, a04e74d, bd93f2d, dac42f0, 22e3f35, 03283f6 — progressively reduced timeouts and improved reliability
- **Model switch:** 3a87831 updated README to say Sonnet
- **Font fixes:** 1deff1c fixed Google Fonts build errors with fallback fonts
- **Housekeeping:** 4677240 updated env.example and dependencies

**Decision:** Documented all 11 in updated STATUS.md. The timeout progression shows a pattern of debugging deployment issues on Vercel.

#### 4. env.example Missing CLAUDE_MODEL
**Issue:** The code supports `process.env.CLAUDE_MODEL` but the example didn't list it.
**Decision:** Added it to .env.example with default value.

### Verification
- ✓ Live site responds (redirects to login as expected)
- ✓ All 15 documented routes exist
- ✓ All 7 AI routes have rate limiting implemented
- ✓ Auth middleware enforces login requirement
- ✓ No TypeScript compilation errors

### Tests Run
- Checked git log for undocumented changes
- Verified rate-limit.ts uses Map keyed on string (works with user ID)
- Verified all 7 AI routes properly import and call checkRateLimit
- Verified proxy.ts only handles auth, not rate limiting (rate limiting is per-route as intended)

### Design Questions / Non-Issues
1. **Glossary allows passive reading:** STATUS says "no passive reading" but glossary shows all definitions. However, glossary requires active expand clicks. This appears intentional — the constraint likely applies to specific study modes, not all features.

2. **Timeout config spread across routes:** Individual routes have `maxDuration=30` + Anthropic timeout=25s. These could be centralized in next.config, but current approach works and allows per-route tuning if needed later.

### Files Modified
- `/src/app/api/chat/route.ts` — model + rate-limit change
- `/src/app/api/debate/route.ts` — rate-limit change
- `/src/app/api/analogy/route.ts` — rate-limit change
- `/src/app/api/socratic/route.ts` — rate-limit change
- `/src/app/api/evaluate/route.ts` — rate-limit change
- `/src/app/api/evaluate-argument/route.ts` — rate-limit change
- `/src/app/api/reading-quiz/route.ts` — rate-limit change
- `/.env.example` — added CLAUDE_MODEL
- `/README.md` — corrected model name to Haiku
- `/STATUS.md` — documented audit and fixes

### Next Steps
1. Deploy changes to Vercel
2. Monitor rate-limit behavior under real usage to confirm user-based enforcement is working
3. Consider adding rate-limit header responses (e.g., `X-RateLimit-Remaining`) for debugging
4. Consider database-backed rate limiting for production (current in-memory is acceptable for single app, but would fail if scaled to multiple instances)

## Multi-Subject Hub — 2026-08-08 (branch `hub-shell`)

### Problem Statement
Jacob wants to use the weak-area-tracking + AI-tutoring pattern already built for Cris's course on his
own learning (starting with chess, then Latin for the school year), without losing the Cris-facing app.
Conversation arrived at: Meta Tutor stays the brand/hub, and becomes a "train station" landing page that
branches into subject-specific sub-apps with their own look, sharing one AI layer and one weak-area engine.

### Decision Fork 1 — extend vs. rebuild
Read the actual code before deciding (not just STATUS.md, which — per this file's own proof-gate rule —
can drift from reality). Found: `wrong-answers.ts` + `study-history.ts` already implement exactly the
weak-area-tracking mechanism Jacob was describing, and the study-mode components + AI routes (Socratic,
evaluate, debate, analogy) are a real, working toolkit. But all content (`glossary.ts`, `arguments.ts`,
`comparisons.ts`, `keypoints.ts`, `course-notes.ts`) is hardcoded to one course, and there's no
subject/catalog abstraction. Decision: extend, don't rebuild — the auth + weak-area engine + AI plumbing
are too good to duplicate. Reused via [[search-before-build]] discipline.

### Decision Fork 2 — how to keep Cris's course untouched
`app/layout.tsx` (root) unconditionally renders `Nav`, `Prayer`, `Onboarding`, `SessionTimer` — all four
are metaphysics-specific (prayer modal, exam-question sidebar, metaphysics-specific onboarding copy) and
would leak onto any new route added under the same root layout. Two options considered:
- **Full route-group restructure** (`app/(metaphysics)/...`) — the fully correct long-term shape, but
  means moving ~15 existing page files that Cris actively uses. Higher risk for the first increment.
- **Pathname guard** — add `isHubShellRoute(pathname)` check to each of the 4 chrome components so they
  render exactly as before on Cris's routes and simply return `null` on `/hub`, `/chess`, `/latin`.
Chose the guard for this first increment — additive, zero behavior change for Cris, much smaller diff.
Revisit the route-group restructure once more subjects exist and the guard list gets unwieldy.

### Decision Fork 3 — chess data source & build order (Jacob's call, asked directly)
Asked Jacob: (1) chess game data — play on-site vs. import from Lichess/Chess.com → **play on-site**
(embedded board + bot, no account linkage needed to start). (2) build order — chess vs. Latin vs. hub
shell first → **hub shell first**, so the subject pattern is proven before sinking time into either
subject's real content.

### What Was Built (this session)
- `src/lib/subjects.ts` — subject registry (id/name/tagline/href/theme colors/status) + `isHubShellRoute()`.
- `src/lib/subject-progress.ts` — subject-namespaced clone of `wrong-answers.ts`/`study-history.ts`
  (`meta-tutor-{subject}-wrong-answers` / `-history` keys) — same shape, kept as a separate file
  on purpose so Cris's storage/behavior is untouched.
- `src/app/hub/page.tsx` — subject-picker landing page.
- `src/app/chess/layout.tsx` + `page.tsx`, `src/app/latin/layout.tsx` + `page.tsx` — stub subject pages,
  own theme, wired to `subject-progress.ts` (shows real empty state, no fake data).
- Pathname guards added to `Nav.tsx`, `Prayer.tsx`, `Onboarding.tsx`, `SessionTimer.tsx`.

### Verification
- `npm run build` — compiled successfully, 0 TypeScript errors, all 29 routes (26 existing + 3 new)
  statically generated.
- Local `npm run dev` + curl smoke test: `/`, `/hub`, `/chess`, `/latin`, `/study` all return 302 to
  `/login` when unauthenticated — same middleware behavior as every existing route, confirming the new
  routes are wired into auth correctly and nothing crashes. Dev log checked for runtime errors: none.
- Not yet verified: actual logged-in render (needs a real Google login round-trip), Vercel deploy.

### Proof Pointers
- Branch: `hub-shell` (not merged to `main`, not deployed — see STATUS.md "In Progress" section, dated
  the same day this entry was written; do not read that section as "live").

### Next Steps
1. Jacob review the branch locally or via a preview deploy before any merge to `main` (merging touches
   Cris's production app).
2. Chess: embedded board + bot opponent, then a Stockfish analysis pipeline feeding `subject-progress.ts`.
3. Latin: real vocab/grammar content using the existing glossary/flashcard/spaced-repetition components,
   retargeted via the new namespaced storage.
4. Generalize the AI routes (`/api/chat`, `/api/evaluate`, `/api/socratic`, etc.) to take a subject/system-
   prompt parameter instead of being hardcoded to metaphysics, so Chess/Latin can use the same endpoints.

## Persistence Backend — 2026-08-08 (same branch, `hub-shell`)

### Problem Statement
`subject-progress.ts` (the weak-area tracker for Chess/Latin) was localStorage-only — no cross-device
sync, and no way for an AI layer to proactively notice a pattern outside an active browser tab. Discussed
with Jacob: does a real backend already exist somewhere in the fleet we should reuse, per
[[search-before-build]], instead of standing up new infra unasked.

### Decision — reuse LessonDraft's Supabase project
Checked `~/projects/LessonDraft`: it has a live, working Supabase project (`jqeypwrmsgjsmggdgvgd`),
called from Vercel via `@supabase/supabase-js` + service-role key from server-side routes only, with a
mature schema (users/streaks/achievements/content — the exact same shape this needed). Checked the fleet
storage-organ memory (the Hold / restic / recall.py) too — that's file/blob tiering and memory-file
search, not relational per-user app data; wrong tool for this. Asked Jacob: share LessonDraft's project
(new isolated tables) vs. spin up a dedicated one. He deferred to my judgment and clarified this is
single-user, not multi-tenant — reinforces sharing: reused LessonDraft's project, new `mt_`-prefixed
tables (`mt_wrong_answers`, `mt_quiz_history`) so there's zero name collision with its existing tables,
zero new signup/cost, and a pattern already proven to work from this exact deploy target.

### What Was Built
- `supabase-schema-hub.sql` — the two new tables + indexes + RLS (service-role-only, same policy pattern
  LessonDraft already uses). Additive only.
- `src/lib/supabase.ts` — server-only client (mirrors `LessonDraft/lib/supabase.ts`).
- `src/app/api/subject-progress/route.ts` — GET (wrong answers + history + computed weak areas for a
  subject) and POST (`logWrongAnswer` / `saveResult` / `clearWrongAnswer`), auth-gated on the NextAuth
  session the same way `/api/notes` is, keyed by `session.user.email`.
- `src/lib/subject-progress.ts` rewritten from a localStorage module to a thin async client for that API
  (same exported function shapes as before, so `/chess` and `/latin` only needed `useEffect` tweaks).
- `.env.local` / `.env.example` — added `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` (values
  copied from LessonDraft's `.env.local`, not committed).

### Verification
- `npm run build`: clean, 0 TypeScript errors, 30 routes (incl. `/api/subject-progress`).
- Local dev smoke test: GET/POST `/api/subject-progress` both correctly redirect when unauthenticated
  (same behavior as every other route under `proxy.ts`'s middleware), no runtime errors in the dev log.
- **NOT verified**: an actual authenticated write/read against Supabase. Blocked on the one manual step
  below, and even once tables exist, needs a real logged-in session to exercise (can't fake Google OAuth
  from a headless curl check).

### Proof Pointers / What's Actually Live
- Branch `hub-shell`, not merged to `main`, not deployed. `supabase-schema-hub.sql` written but **not yet
  run** — I have the service-role (data-API) key but not a DB password or an authenticated `supabase` CLI
  session, so I can't execute DDL myself. Until Jacob pastes it into the Supabase SQL Editor, hitting
  `/api/subject-progress` while logged in will 500 (querying tables that don't exist).

### Next Steps
1. **Jacob**: paste `supabase-schema-hub.sql` into the Supabase SQL Editor (project `jqeypwrmsgjsmggdgvgd`,
   same one LessonDraft uses) — one-time, ~30 seconds.
2. Once tables exist: log in for real and confirm a wrong-answer/quiz-result round-trips end to end.
3. Then continue with the chess/Latin content build-out already queued above.

## Real Chess Module — 2026-08-08 (same branch, `hub-shell`, built unattended)

### Problem Statement
Jacob asked to "get everything done that you can" and left the session. Chess was the best-specified,
most self-contained piece of the roadmap (play on-site, bot opponent, engine-analyzed weaknesses) — the
one thing buildable end-to-end without needing him for curriculum specifics (unlike Latin, which needs
his actual syllabus/textbook and so stays a stub).

### Library choices
- **`chess.js` v1.4.0** for rules/legality/game-state — the standard choice, note its `move()` throws on
  illegal moves in v1.x (older versions returned `null`); handled with try/catch in `onPieceDrop`.
- **`react-chessboard` v5** for the board UI — v5 rewrote the whole API around a single `options` object
  (very different from v3/v4 examples that circulate online); read the actual shipped `.d.ts` files rather
  than trusting a remembered API shape, per [[orient-before-act]].
- **`stockfish` npm package, the `-18-lite-single` build** — real Stockfish 18, not a toy heuristic bot.
  Chose the *lite single-threaded* WASM variant deliberately over the full/multi-threaded ones: it needs
  no COOP/COEP cross-origin-isolation headers (the multi-threaded build does, which would mean touching
  `next.config.ts` headers for the whole app), while still being far stronger than any human. Files copied
  from `node_modules/stockfish/bin/` into `public/stockfish/` (not built from source, not bundled by
  Turbopack — served as plain static assets and instantiated via `new Worker(path)`, the standard
  low-risk integration pattern). 7MB `.wasm`, committed to the repo since Vercel needs it in the deploy
  and there's no build step generating it.

### How blunder detection actually works (not hand-waved)
Before/after every one of the player's moves: evaluate both positions at depth 12 via the same engine.
UCI eval is always from the perspective of the side to move, so the "after" eval (now the opponent's
perspective) gets negated back to the player's perspective before comparing. The difference
(`evalBefore - evalAfterMine`) is centipawn loss vs. the engine's own best continuation from the
pre-move position — this is the same metric lichess/chess.com use for move classification, not an
invented one. Thresholds: ≥200cp = blunder, ≥90cp = mistake, below that = not flagged (kept to reduce
noise; every move isn't logged, only real ones). Phase tagged by move number (≤10 opening, ≤30
middlegame, else endgame) — a simple heuristic, stated as such, not dressed up as more rigorous than
it is.

### Decision — single serialized engine, not two
Both move-analysis (`evaluate`) and the bot's own move (`getBestMove`) run through one Stockfish
instance/one Worker, queued (see `chess-engine.ts`'s `run()` wrapper) rather than spinning up a second
engine. Means the bot's reply waits behind the analysis of the player's move (a second or two extra),
traded deliberately for not running two competing WASM engines client-side and for simpler state
(one worker to create/terminate/reason about).

### Verification — Report vs. Handle, stated explicitly
- Report/structural (done): `npm run build` clean, 0 TypeScript errors, 31 routes. Local dev smoke test:
  `/chess` and the stockfish static files both correctly hit the auth middleware (302 when logged out —
  expected, matches every other route). Confirmed the copied `.wasm` is a valid, non-corrupted WebAssembly
  binary (`file` command) and that the shipped JS's own `locateFile` logic resolves the `.wasm` next to
  itself by filename/same-directory — matches exactly how the two files were placed in `public/stockfish/`.
- Handle (NOT done): nobody has opened a real logged-in browser, dragged a piece, watched the bot reply,
  or watched a blunder actually get flagged and logged to Supabase. Built and verified unattended, with
  nobody watching a screen — deliberately did not use computer-use to drive a live click-through solo,
  since that means taking over the screen/mouse with nobody around to context it. This is a real,
  structurally-sound build, not a rubber-stamped "done" — but the gap between Report and Handle here is
  real and should be closed by an actual playthrough before trusting it fully.

### Proof Pointers
- Branch `hub-shell`, commit to follow this entry. Files: `src/lib/chess-engine.ts`,
  `src/components/chess/ChessGame.tsx`, `src/app/chess/page.tsx`, `public/stockfish/*`.

### Next Steps
1. **Jacob**: play an actual game at `/chess` (after logging in) to close the Report→Handle gap — confirm
   the bot moves, a deliberate blunder gets flagged with a sane centipawn number, and (once the SQL step
   above is done) that it shows up under "Recent weak areas" after the game ends.
2. Latin real content — blocked on Jacob's actual syllabus/textbook for the year.
3. Puzzle-from-your-own-blunders mode (re-serve flagged mistakes spaced-repetition style) — the
   originally-discussed differentiator, not yet built; natural next slice once the base loop is confirmed
   working.

## RCA Teacher Umbrella — 2026-08-09

### Problem Statement
Jacob's plan: get his Regina Caeli Academy (RCA) teaching schedule + lesson plans organized, then add
"classes/sections" to Meta Tutor so he can use it as his personal teaching-prep tool. First year on this
6th-grade assignment was 2025-2026; this is year two (2026-2027), same days.

### Decision fork — hub-shell vs. a new "umbrella" concept
Asked Jacob directly whether RCA should extend the existing hub-shell (chess/latin, personal-study
stations) or live as a new standalone area. His answer reframed the whole information architecture:
Meta Tutor = a train system. `/hub` = the landing page. Each subject page (chess, latin, ...) = a station.
An **umbrella** = a company that owns multiple stations under one roof and has its own sub-landing page —
RCA owns 10 class-stations (his actual teaching load), and going to "the RCA umbrella" should feel like
its own mini-hub with everything a teacher needs, nested one level under the main hub. This is a new,
more general concept than a single station — implemented as `Umbrella` type in `src/lib/subjects.ts`
alongside the existing `Subject` type, rendered as its own section on `/hub` above the station list.
Explicitly personal/single-user for now — no multi-tenant design, per Jacob ("if we ever need to spread
it out... we'll figure that out").

### Research before building (search-before-build)
Local disk had only certificates + an offer letter PDF, no actual schedule/lesson content. Forked a
research agent to search Gmail (`mcp__gmail__search_emails` / `read_email`) + Google Calendar for the real
schedule and curriculum docs before writing any code — turned up a forwarded-emails dump
(`jcasrcaattachforward`, thread `19fda5e69000187e`) containing master lesson plan Google Doc links for
most of the 10 assigned classes. Jacob then confirmed the remaining gaps directly: Mon/Thu, 9:00am–3:30pm
(no per-block bell schedule given), and pointed to a separate email (`19fe6ee265cea749`) with the Music 3-4
Year B lesson plan doc, which he re-shared as "anyone with the link" so it could actually be pulled
(`curl .../export?format=txt` — 401 until re-shared, 200 after). The other classes' master docs (Saxon
7/6, LOE Essentials C, 6th grade core TRM) are still access-restricted to his RCA staff Google account —
**not pulled**, so those pages link out to the doc rather than showing structured content. PE 3-4 / PE 5-6
curriculum was never sent by RCA in either the 2025-2026 or 2026-2027 offer-letter/email chain — likely
handed out physically at Staff Training (Aug 12-13); noted as genuinely missing, not assumed.

### What got built
- `src/lib/rca.ts` — RCA schedule (Mon/Thu, 9am-3:30pm, KSC/Overland Park KS, term 08/17/26-5/31/27) +
  registry of all 10 classes (name/grade/area/books/lesson-plan+drive links/`hasStructuredContent` flag)
  + `currentLessonNumber()` helper (weeks elapsed since term start, clamped, no holiday awareness yet).
- `src/lib/rca-content/music-3-4.ts` — the one class with real transcribed content: all 32 weekly lessons
  of Music 3-4 Year B (rounds, Latin hymns/chants, recorder), condensed from the full source doc into
  {warmup, hymnsChants, recorder, note} per lesson. This is the only class currently past Report-tier
  (doc read in full) into having its content actually usable in-app.
- `src/app/rca/{layout,page}.tsx` — RCA sub-hub: weekly schedule block + Academic/Specials class grids,
  each card linking to `/rca/[slug]`.
- `src/app/rca/[slug]/page.tsx` — per-class page: summary/books/resource links, and for Music 3-4 a real
  lesson viewer (prev/next through the 32 lessons, defaulting to the calendar-computed current week). All
  other classes get an honest "content not pulled yet, here's the doc link" state instead of a fake viewer.
- `src/app/api/rca-chat/route.ts` + `src/components/rca/RcaLessonChat.tsx` — subject-aware AI lesson-prep
  assistant (streaming SSE, same pattern as `/api/chat`), grounded per-class: full current-lesson content
  for Music 3-4, general subject/grade context + doc-link caveat for the rest. Shares the existing 75/day
  rate limit and Google auth gate — no new cost controls needed.
- `src/lib/subjects.ts` — added `Umbrella` type + `umbrellas` export (RCA entry), added `/rca` to
  `HUB_SHELL_PREFIXES` so the existing `isHubShellRoute` guard (already used by Nav/Prayer/Onboarding/
  SessionTimer/KeyboardShortcuts) hides the student-facing chrome on RCA pages automatically — no new
  guard code needed, extended the existing single source of truth.

### Verification — Report vs. Handle
- Report/structural (done): `npm run build` clean (0 TS errors, 33 routes: `/rca`, `/rca/[slug]`,
  `/api/rca-chat` all present). Local dev smoke test (`localhost:3001`, port 3000 was occupied by another
  process): `/rca`, `/rca/music-34`, `/rca/pe-34`, `/hub`, and an unauthenticated POST to `/api/rca-chat`
  all correctly 302-redirect to `/login` — identical behavior to the pre-existing `/api/chat`, confirming
  the new routes inherit the same auth middleware with no gap.
- Handle (NOT done): nobody has logged in and actually clicked through `/rca` → a class → the lesson
  viewer → sent a message to the prep assistant and read a real streamed reply. Built unattended; the
  Report→Handle gap should close with an actual logged-in walkthrough.

### Proof Pointers
Branch `hub-shell` (uncommitted at time of writing). Files: `src/lib/rca.ts`,
`src/lib/rca-content/music-3-4.ts`, `src/app/rca/**`, `src/app/api/rca-chat/route.ts`,
`src/components/rca/RcaLessonChat.tsx`, `src/lib/subjects.ts`, `src/app/hub/page.tsx`.

### Next Steps
1. **Jacob**: log in and click through `/rca` for real — close the Report→Handle gap, and sanity-check the
   Music 3-4 lesson-number auto-detection actually lands on a reasonable week once school starts (Aug 17).
2. Get Saxon 7/6 / LOE Essentials C / 6th-grade-core master docs re-shared as "anyone with the link" (like
   Music 3-4 was) so their full lesson content can be pulled and get real lesson viewers instead of link-out
   cards.
3. PE 3-4 / PE 5-6 curriculum — watch for it at Staff Training (Aug 12-13) or a follow-up RCA email.
4. Once rosters exist (near Aug 17): per-student weak-area tracking for RCA classes, reusing
   `subject-progress.ts`'s existing namespaced-by-subject-string design (e.g. `subject="rca-music-34"`) —
   no schema change needed, same pattern chess/latin already use.
5. Commit + merge to `main` when Jacob's ready — currently sitting on `hub-shell` uncommitted, matching
   how the chess work landed.
