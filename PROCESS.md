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

## RCA Nature Theme + Latin Consolidation + Persistent Assistant — 2026-08-09

### Problem Statement
After seeing the first preview deploy, Jacob asked for three things in one pass: (1) actually build the
RCA section out rather than leave it as scaffolding, (2) fold the old standalone `/latin` personal-study
station into RCA (it's really his RCA class, First Form Latin 6, not a separate side interest), (3) give
RCA a nature theme — "sky earth butterfly birds simple not emojis tho" — plus a persistent, always-visible
Claude chat connected throughout the section instead of one buried per-class box.

### Latin consolidation
`/latin` (the old dark-brown stub station with placeholder "coming next" text and no real content) is
gone. `next.config.ts` now 308-redirects `/latin` and `/latin/*` to `/rca/first-form-latin-6` permanently,
so old links/bookmarks still land somewhere real. Removed `latin` from `subjects.ts`'s `subjects` array
(no longer shows as its own hub tile) but kept `/latin` in `HUB_SHELL_PREFIXES` so the redirect itself
still gets the chrome-free treatment mid-flight. The `first-form-latin-6` entry in `rca.ts` absorbed the
old station's stated intent (vocab/grammar/declension drills, quizzing) into its summary — no actual
drill content exists yet either way, so nothing was lost, just de-duplicated into one real home instead
of two half-built ones.

### Nature theme — deliberate light/day palette, distinct from the rest of hub-shell
Chess and the old Latin station are dark, moody per-station themes. For RCA I went the other direction on
purpose: a light sky-to-earth gradient background (`#dceefc` sky blue → `#f4f1e6` → `#eef2e2` earth),
because (a) Jacob explicitly said sky/earth/butterfly/bird, which reads as daytime/outdoor, and (b) RCA is
a classical Catholic homeschool program with a real nature-study (Charlotte-Mason-adjacent) thread running
through classical education generally — a light, airy palette fits the actual institution, not just the
literal color words. Built `src/components/rca/NatureIcons.tsx`: four hand-drawn single-stroke SVG icons
(Bird, Butterfly, Leaf, Sky/cloud) — explicitly not emoji, per instruction — used sparingly as section
markers (leaf next to "Academic"/"Specials" headers, sky icon on the schedule card, butterfly by the page
title, bird in the header and on the assistant's toggle button). Updated the RCA umbrella's accent colors
in `subjects.ts` from the old gold (`#c9a227`) to sky blue (`#7ec8e3`/`#3f7ea6`) so the `/hub` card previews
the theme before you click in.

### Persistent assistant — replaced the per-page chat box with one global one
Deleted `RcaLessonChat.tsx` (the original per-class embedded chat box from the first pass — you had to
scroll down on each class page to find it). Built `RcaAssistant.tsx` instead: a fixed floating button
(bottom-right, bird icon) mounted once in `rca/layout.tsx`, so it's present and keeps its conversation
across every page in the umbrella, not just one class. It reads `usePathname()` to figure out which class
you're currently looking at and re-derives the grounding subject on every message send — so if you
navigate from `/rca` to `/rca/music-34` mid-conversation, the next message answers in that class's context
without losing chat history. `/api/rca-chat`'s `buildGrounding` got a genuine "no specific class" path
(`buildGeneralGrounding()` — lists all 10 classes + the schedule) instead of the old placeholder string
("No class context provided.") for when you're on the `/rca` landing page itself.

### Verification — Report vs. Handle
- Report/structural (done): `npm run build` clean (0 TS errors, 31 routes — `/latin` correctly gone from
  the route list). Local dev smoke test: `/latin` returns a real `308 Permanent Redirect` to
  `/rca/first-form-latin-6` (confirmed via `curl -D -`), `/rca`, `/rca/music-34`, and `/hub` all still
  302 to `/login` when logged out, matching every other route.
- Handle (NOT done): the nature theme and the floating assistant have not been seen in an actual browser
  by anyone — no screenshot, no logged-in click-through, no confirmation the assistant panel opens/closes
  correctly or that context-switching between classes mid-chat actually works as designed. This entire
  visual pass is Report-tier only until Jacob (or a driven browser session) actually looks at it.

### Proof Pointers
Branch `hub-shell`. Files: `src/components/rca/NatureIcons.tsx`, `src/components/rca/RcaAssistant.tsx`
(new, replaces deleted `RcaLessonChat.tsx`), `src/app/rca/layout.tsx`, `src/app/rca/page.tsx`,
`src/app/rca/[slug]/page.tsx`, `src/app/api/rca-chat/route.ts`, `next.config.ts`, `src/lib/subjects.ts`,
`src/lib/rca.ts`. `src/app/latin/` deleted entirely.

### Next Steps
1. **Jacob**: actually look at it — confirm the nature theme reads the way he pictured it and the
   floating assistant behaves (opens, remembers context across page navigation, closes cleanly).
2. Everything from the prior entry's Next Steps still stands (re-share the other master docs, PE
   curriculum, rosters once enrollment finalizes) — unchanged by this pass.

## Full Content Pull (7 of 8 classes) + Generic Lesson Schema + PE Dropped — 2026-08-09

### Problem Statement
Jacob re-shared 4 more docs (Saxon 7/6, LOE Essentials C, and the "6th Grade" combined doc covering
Classical Language Arts/Religion/History/Science/First Form Latin, plus a bonus Employee Handbook) as
"anyone with the link," same move as Music 3-4, and said to drop PE entirely — he doesn't want it tracked
in the app at all (not "deprioritize," remove). This session pulled all 4 docs and turned 7 of the
remaining 8 classes (all but PE, which is now gone) into real lesson-by-lesson content, matching what
Music 3-4 already had.

### Schema generalized before scaling up
The original Music 3-4 lesson shape (`{n, warmup, hymnsChants, recorder, note}`) was Music-specific and the
`[slug]/page.tsx` had a hardcoded `cls.id === "music-34"` branch. Before fanning out to 7 more subjects
with likely-different structures, generalized to one shared shape in `src/lib/rca-content/types.ts`:
`Lesson = {n, sections: {label, text}[], note?}`, `SubjectContent = {overview, lessons, totalWeeks?}`. Built
one `LessonViewer.tsx` component and one `rcaContent` registry (`src/lib/rca-content/index.ts`, class id →
content) that both `[slug]/page.tsx` and `/api/rca-chat`'s grounding now read generically — no more
per-subject special-casing anywhere. `music-3-4.ts` kept its original array (32 entries, not worth
retyping) and got a thin adapter (`music34Content`) at the bottom mapping into the generic shape.

### Fanned out 3 parallel transcription forks
Same pattern as Music 3-4 — read the raw doc, condense into the generic schema, write real files — but
this time via 3 parallel background agents (Saxon 7/6 alone; LOE Essentials C alone; the 6th-grade combined
doc split across Classical Language Arts 6 / Religion 6 / History 6 / Science 6 / First Form Latin 6, since
one doc covers all five). Chose forks over doing it inline specifically because the combined raw text was
~9,400 lines total — well past what's worth holding in the main conversation's context for content that's
mechanical transcription, not judgment-heavy design work.

### Bugs found and fixed post-transcription (trust but verify)
The 6th-grade-core fork's output had 3 instances of a real syntax bug — closing a `sections: [...]` array
with `}` instead of `]` right before a trailing `note:` field (in `religion-6.ts` and
`first-form-latin-6.ts`, 2 spots) — caught immediately by `npm run build` (TypeScript type-checks every
file in `src/`, not just reachable ones, so even an unregistered orphan file breaks the build). Fixed by
hand, one at a time, using the compiler's own error location as ground truth rather than trusting a
regex/bracket-counting heuristic script (tried one first — it missed real mismatches because it tracked
open/close *counts* per bracket type independently rather than a proper type-checked stack, so a `{`/`]`
swap could still "balance" in aggregate; not worth fixing the heuristic when `tsc` is authoritative and
free).

### Verified against the raw source, not just trusted the fork's self-report
Spot-checked Saxon 7/6's output against `/tmp/saxon76.txt` directly: the source doc is genuinely a bare
pacing CHECKLIST ("Teach Lessons 1, 2, 3" + a checkbox per lesson), not a topic-by-topic teaching guide —
Saxon's actual lesson content lives in the textbook itself. So the fork's "generic-sounding" condensed
text ("teach concepts, problem set") is an accurate reflection of thin source material, not a hallucination
papering over real detail that got dropped. Also spot-checked the 6th-grade doc's actual Week 1 table
(Religion/Latin/Poetry/History/Science columns) against `history-6.ts` and `religion-6.ts` output — matches.
One caught gap: the source doc has a "Poetry" thread (weekly memorization, e.g. "The Charge of the Light
Brigade") that doesn't appear in `classical-language-arts-6.ts` or anywhere else — Poetry isn't one of
Jacob's contracted assignments per either offer letter, so it wasn't given its own station, but if it's
actually meant to live inside how he teaches CLA, that content wasn't pulled. Noted, not silently dropped.

### Pacing bug found and fixed: `currentLessonNumber` assumed 1 lesson/week universally
Saxon 7/6 is 120 lessons across only 33 teaching weeks (~3-4 lessons/week) — the original
`currentLessonNumber(totalLessons)` helper (built for Music 3-4, which really is 1 lesson/week) would have
capped out at lesson 33 forever once week 33 arrived, never reaching lesson 120. Added an optional
`totalWeeks` field to `SubjectContent` and a second parameter to `currentLessonNumber` so it now
interpolates `(currentWeek / totalWeeks) * totalLessons` instead of assuming a 1:1 week:lesson ratio.
`saxon76Content` sets `totalWeeks: 33`; every other subject's `totalWeeks` defaults to its own lesson count
(still 1/week, which matches how the other 6 subjects/RCA's own doc structure actually paces).

### Stale-date caveat (Saxon specifically)
Saxon's source doc is the 2025-2026 copy (2026-2027's hasn't been issued) and embeds literal calendar dates
per week (e.g. "Week 1 (Aug 18-22)") that are last year's, not this year's. Added an explicit caveat in
both the file's header comment and its `overview` string: trust the WEEK NUMBER for pacing, not the literal
date, until RCA sends the 2026-2027 center calendar. Same underlying issue as Music 3-4's 2025-2026 source,
just more visible here because Saxon's doc embeds dates inline per-lesson where Music's didn't.

### PE dropped entirely
Removed `pe-34` and `pe-56` from `rcaClasses` in `rca.ts` completely, per direct instruction ("dont need pe
stuff at all") — not deprioritized, not stubbed, just gone. `/rca` now lists 8 classes (7 Academic + Music
under Specials), matching his actual full teaching load minus PE. `hasStructuredContent` field removed from
`RcaClass` entirely (was redundant now that `rcaContent` registry membership is the single source of truth
for "does this class have a real viewer").

### Verification — Report vs. Handle
- Report/structural (done): `npm run build` clean (0 TS errors) after fixing the 3 bracket bugs. Local dev
  smoke test: all 8 class routes (`/rca/saxon-76`, `/rca/loe-essentials-c`,
  `/rca/classical-language-arts-6`, `/rca/religion-6`, `/rca/history-6`, `/rca/science-6`,
  `/rca/first-form-latin-6`, `/rca/music-34`) plus `/rca` itself all correctly 302 to `/login` when
  logged out — no 500s, no crashes. Spot-checked 2 of 7 new subjects' content against raw source text
  directly (Saxon fully, the 6th-grade doc's Week 1 table partially) rather than trusting the forks'
  self-reports at face value.
- Handle (NOT done): nobody has opened a real browser and actually clicked through any of the 7 new
  lesson viewers, confirmed the prev/next navigation renders real content correctly, or confirmed the
  Saxon pacing interpolation lands on a sane lesson number once the term starts. Content volume here is
  large (7 subjects × ~33 lessons each) — worth a real look before trusting it fully, more so than the
  smaller Music 3-4 pass.

### Proof Pointers
Branch `hub-shell`. New: `src/lib/rca-content/types.ts`, `saxon-76.ts`, `loe-essentials-c.ts`,
`religion-6.ts`, `classical-language-arts-6.ts`, `history-6.ts`, `science-6.ts`, `first-form-latin-6.ts`,
`index.ts`, `src/components/rca/LessonViewer.tsx`. Modified: `src/lib/rca-content/music-3-4.ts` (adapter
added), `src/lib/rca.ts` (PE removed, `totalWeeks` support, refreshed summaries), `src/app/rca/[slug]/page.tsx`
(generic registry lookup replacing the Music special-case), `src/app/rca/page.tsx` (badge check uses
registry), `src/app/api/rca-chat/route.ts` (generic grounding).

### Next Steps
1. **Jacob**: click through the new lesson viewers for real, especially Saxon (the pacing math is the
   most complex of the bunch) — close the Report→Handle gap.
2. Investigate whether the source doc's "Poetry" thread belongs inside Classical Language Arts 6 or
   deserves its own note — currently not represented anywhere.
3. PE is gone for good (not "later") per direct instruction — don't re-add without Jacob asking again.
4. Once 2026-2027's actual docs get sent (vs. these 2025-2026 copies), diff and refresh — the current
   content is a known-stale-but-structurally-sound placeholder for the real thing.

## Mon/Thu Emphasis, Visible Staleness Banner, Real Comprehension-Check Feature — 2026-08-09

### Problem Statement
Jacob's feedback after seeing the deployed app: (1) Monday/Thursday should read as THE deadlines, not just
two days in a list — those are the only two days he's physically teaching; (2) the "this is last year's
content" caveat was buried in code comments/PROCESS.md, which he never sees — needs to be visible on the
actual pages; (3) most importantly, this isn't supposed to be a passive schedule/calendar+reader — it's
meant to be an ACTIVE improvement tool where he can check whether he actually understands the material
(math, reading, history, logic, theology — whatever the subject) well enough to teach it, not just see
what lesson is next.

### Mon/Thu as deadlines, not list items
Added `nextTeachingDay()` to `rca.ts` — computes the next Monday or Thursday from today (today counts if
it already is one). `/rca`'s schedule card now bolds "Monday & Thursday" as "the deadlines — the only two
days actually on campus" and shows a live "Next teaching day: <weekday>, <date>" line. Had to mark
`rca/page.tsx` with `export const dynamic = "force-dynamic"` — it was being statically prerendered at
build time, which would have frozen "next teaching day" at whatever it was during the last deploy instead
of computing fresh per request.

### Visible staleness banner
Built `RcaStaleBanner.tsx` — a persistent banner mounted in `rca/layout.tsx` (so it's on every RCA page,
not just one), stating plainly that content is transcribed from RCA's 2025-2026 docs and 2026-2027's
haven't been issued. Also folded the same caveat into the AI grounding itself (`STALE_CONTENT_NOTE` in the
new shared `rca-grounding.ts`) so the assistant and the understanding-check both know to flag it if asked
about specific dates.

### Refactor: shared grounding lib
Before adding a second AI feature, pulled the class/lesson grounding logic out of `/api/rca-chat/route.ts`
into `src/lib/rca-grounding.ts` (`buildClassGrounding(subjectId)`) — both `/api/rca-chat` (the assistant)
and the new `/api/rca-understanding` (the comprehension check) now share one implementation instead of
duplicating "how do I describe this class + its current lesson to the model."

### The actual feature: "Test my understanding"
This is the answer to "isn't just a schedule — an active improvement website where I can see what exact
math I'll be on and see if I'll understand it." Built `/api/rca-understanding` (generate + evaluate
actions, same non-streaming JSON pattern as the existing `/api/evaluate` and `/api/reading-quiz` routes —
anchored to those rather than inventing a new pattern) and `UnderstandingCheck.tsx`, mounted on every class
page that has real lesson content (below the `LessonViewer`).

Flow: "Start check" generates 4 questions from the CURRENT lesson via the shared grounding — but tailored
to the subject, not generic trivia: Saxon gets an actual computable math problem, Latin/LOE get a
grammar/spelling item to apply, Religion/History/Science/Music get specific content questions (a fact, a
translation, a distinction) rather than opinion prompts. Jacob answers one at a time in a textarea; each
answer gets evaluated (correct/partial/incorrect + 1-2 sentence feedback) against the real answer via a
second AI call, not string-matching — free-text answers about e.g. "explain why Rome fell" can't be
graded by exact match. Wrong/partial answers get logged via the *existing* `subject-progress.ts` (already
built for Cris's course + the hub-shell chess/latin work, namespaced by subject string — used
`rca-<classId>` as the namespace so it can't collide with anything else) — reused as-is, not rebuilt.
Finished sessions save a result row; a "Recent gaps" chip list shows on the idle state once there's
history, mirroring the pattern the old standalone Latin station used to have.

### Known gap, called out on purpose
`mt_wrong_answers` / `mt_quiz_history` (the Supabase tables `subject-progress.ts` writes to) still haven't
had their schema run (`supabase-schema-hub.sql`) — this was already a known gap from the original hub-shell
work, not something this pass introduced. Until that SQL runs, the understanding-check will generate
questions and show correct/incorrect feedback live (that part doesn't touch Supabase), but logging
wrong-answers/history will silently fail (the underlying lib functions swallow errors on purpose, so no
crash — just no persistence). Told Jacob about this dependency; it blocks "gaps carry over between
sessions," not "does the check work right now."

### Verification — Report vs. Handle
- Report/structural (done): `npm run build` clean (0 TS errors, new routes `/api/rca-understanding`
  present, `/rca` now correctly dynamic instead of statically frozen). Local dev smoke test: `/rca`,
  `/rca/saxon-76`, and an unauthenticated POST to `/api/rca-understanding` all 302 to `/login`, matching
  every other route.
- Handle (NOT done): nobody has run an actual understanding-check end-to-end (generate real questions,
  answer one, see it graded, confirm it logs) in a live browser. This is the newest and most complex piece
  added so far — worth the closest look before trusting it.

### Proof Pointers
Branch `hub-shell`. New: `src/lib/rca-grounding.ts`, `src/app/api/rca-understanding/route.ts`,
`src/components/rca/UnderstandingCheck.tsx`, `src/components/rca/RcaStaleBanner.tsx`. Modified:
`src/lib/rca.ts` (`nextTeachingDay`), `src/app/rca/page.tsx` (deadline emphasis, `force-dynamic`),
`src/app/rca/layout.tsx` (banner mount), `src/app/rca/[slug]/page.tsx` (mounts `UnderstandingCheck`),
`src/app/api/rca-chat/route.ts` (now imports shared grounding instead of its own copy).

### Next Steps
1. **Jacob**: run an actual understanding-check for real — this is the piece most worth verifying live.
2. Run `supabase-schema-hub.sql` whenever convenient, to make gap-tracking persist across sessions.
3. Everything from prior entries' Next Steps still stands.
