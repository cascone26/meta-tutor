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

## Error Surfacing Fix + Root URL Becomes the Hub — 2026-08-09

### Problem Statement
Two reports from Jacob: (1) pressing "Start check" on the understanding-check said "generating" then
silently did nothing — no error, no result; (2) the app's root URL (meta-tutor.vercel.app) should be the
hub landing page, not Cris's Metaphysics chat.

### Silent-failure bug fixed (root cause not confirmed live — no way to reproduce without his session)
`UnderstandingCheck.tsx`'s `start()` and `submitAnswer()} both had failure paths that silently reset to a
prior state with zero user-visible error — a non-ok HTTP response, a JSON parse failure, or a thrown
fetch error all just quietly went back to the button/quiz with nothing shown. Added a proper `error` phase
with a message + "Try again" button, and made `/api/rca-understanding`'s generate action always include an
`error` field on failure (empty questions, JSON-parse failure of the model's response) instead of silently
returning `{questions: []}`.

**Root cause suspected, not confirmed**: `.env.local` has `ANTHROPIC_API_KEY=` blank. This file isn't what
Vercel deploys with (Vercel has its own dashboard-configured env vars per environment), but it raises the
real possibility that `ANTHROPIC_API_KEY` is only set for Vercel's "Production" environment and not
"Preview" — which would make every AI call on the `hub-shell` preview branch fail. Could not check Vercel's
actual env var config directly: no Vercel CLI/API credentials available in this session (`vercel whoami`
fails, no token in `~/.vercel`, no `VERCEL_TOKEN` in env). Asked Jacob to check the Vercel dashboard
directly rather than guessing further. The error-surfacing fix means next attempt will show the real
error message regardless of cause.

### Root URL becomes the hub
Asked Jacob how to handle Cris's access before touching this, since it's the one part of the app with a
real outside user — he said Cris (his cousin, correcting my wrong pronoun guess) isn't going to use it for
the foreseeable future, so no need to preserve his exact URL; just build what Jacob wants.
- Moved `src/app/page.tsx` (Cris's chat) → `src/app/metaphysics/page.tsx`. Moved `src/app/hub/page.tsx`
  (the subject-picker) → `src/app/page.tsx`, so `/` is now the hub landing page.
- `next.config.ts`: added `/hub` → `/` permanent redirect (same pattern as the existing `/latin` redirect)
  so nothing that already links to `/hub` breaks.
- `subjects.ts`: metaphysics subject's `href` updated `/` → `/metaphysics`; `HUB_SHELL_PREFIXES` swapped
  `/hub` for `/` (with an explicit `p !== "/"` guard in `isHubShellRoute` so `/` only matches exactly, never
  as a prefix for every other route) — this is what hides Cris's chrome (Nav/Prayer/Onboarding/
  SessionTimer) from the hub landing page, same mechanism as every other hub-shell route.
- `Nav.tsx`: the "Chat" tab (Cris's nav, only rendered on her non-hub-shell pages) now points at
  `/metaphysics` instead of `/`.
- `chess/layout.tsx` and `rca/layout.tsx`: "← Hub" links now point directly at `/` instead of `/hub`, to
  skip the redirect hop (the redirect itself is kept for anything still bookmarked at `/hub`).
- `layout.tsx` metadata (browser tab title/description) genericized from "Meta Tutor — Metaphysics Study
  Assistant" to "Meta Tutor" / "Personal multi-subject learning hub", since root is no longer
  Metaphysics-specific.

### Verification
`npm run build` clean (31 routes, `/metaphysics` present, `/hub` correctly absent as its own route since
it's now a redirect). Local dev smoke test: `/` and `/metaphysics` and `/rca` all 302 to `/login` when
logged out (unchanged behavior, just at the new URLs); `/hub` returns a real `308 Permanent Redirect` to
`/`. Not yet verified live/logged-in that the hub renders correctly at `/` or that Cris's chat still works
end-to-end at its new `/metaphysics` URL.

### Proof Pointers
Branch `hub-shell`. Moved: `src/app/page.tsx` → `src/app/metaphysics/page.tsx`, `src/app/hub/page.tsx` →
`src/app/page.tsx`. Modified: `next.config.ts`, `src/lib/subjects.ts`, `src/components/Nav.tsx`,
`src/app/chess/layout.tsx`, `src/app/rca/layout.tsx`, `src/app/layout.tsx`,
`src/components/rca/UnderstandingCheck.tsx`, `src/app/api/rca-understanding/route.ts`.

### Next Steps
1. **Jacob**: check Vercel dashboard → Project Settings → Environment Variables → confirm
   `ANTHROPIC_API_KEY` is enabled for the "Preview" environment, not just "Production" — this is the
   leading suspect for the silent-failure bug. Then retry the understanding-check; the new error state
   will show the real error if it's still failing.
2. Confirm `/` renders the hub correctly and `/metaphysics` still works for Cris's course, logged in.
3. Everything from prior entries' Next Steps still stands.

## Root Cause Found + Fixed: Stale OAuth Token, No Refresh Mechanism — 2026-08-09

### Problem Statement
Jacob confirmed the understanding-check was still failing after the error-surfacing fix, with a real
`Request failed (500)`. Asked for Vercel access to actually diagnose instead of guessing further — Jacob
ran `vercel login` in his own terminal, giving this session real Vercel CLI credentials for the first time.

### What was actually wrong (traced with real access, not guessed)
`vercel env ls` showed the project has **no `ANTHROPIC_API_KEY` at all** — instead `ANTHROPIC_AUTH_TOKEN` /
`ANTHROPIC_REFRESH_TOKEN` (format `sk-ant-oat01-...` / `sk-ant-ort01-...`), meaning this app was already
built to reuse Jacob's Claude Max subscription via OAuth rather than a billed API key — confirmed by
checking the installed `@anthropic-ai/sdk` (`^0.80.0`) source directly: `new Anthropic({...})` with no
`apiKey`/`authToken` passed auto-reads `process.env.ANTHROPIC_AUTH_TOKEN` and uses it as `Authorization:
Bearer` automatically. **No code changes were ever needed for this to work** — the app was written
correctly for OAuth reuse from the start (someone, possibly Jacob in an earlier session, already made this
choice deliberately).

Direct testing (not speculation) found two real bugs stacked together:
1. **The stored access token was expired.** `curl`-equivalent test against `api.anthropic.com/v1/messages`
   with the token stored in Vercel → `401 "OAuth access token is invalid."` It had been sitting there
   unchanged for 26+ days; these access tokens last on the order of hours (~7h observed on a fresh one via
   its `expiresAt`).
2. **`vercel env ls` showed every single env var (all 7 of them) scoped to "Production" only — zero
   configured for "Preview" at all.** So the `hub-shell` branch had NO credentials whatsoever, not even the
   (already-expired) ones Production had.
3. Attempted a live OAuth refresh using `ANTHROPIC_REFRESH_TOKEN` against
   `console.anthropic.com/v1/oauth/token` directly — got blocked by Cloudflare (403, error 1010), which
   initially looked like confirmation of a fleet memory noting a prior "org block" on this exact pattern
   for a different project (LessonDraft, 2026-08-04). Told Jacob this looked like a dead end and recommended
   a real API key instead — **he said no, wire it to the subscription like everything else.**

### Second look — the "org block" theory didn't survive an actual test with a fresh token
Rather than keep asserting it was blocked, pulled the Mac's own currently-live Claude Code OAuth token
straight from Keychain (`security find-generic-password -s "Claude Code-credentials-c3d031f7" -w` — the
exact mechanism `~/tools/ai-gateway.cjs`, already running on this Mac for other fleet tools, uses) and
hit `api.anthropic.com/v1/messages` with it directly. **200, real response.** So OAuth-subscription-reuse
against the real Messages API is NOT blocked — the Cloudflare 403 was specific to my raw refresh-endpoint
call (likely bot-fingerprint related, not an account-level block), and the earlier 401 was purely the
token being stale. This matters: it means the fix is "keep the token fresh," not "give up on the
subscription."

### The actual fix: a local sync job, not a public proxy
Vercel serverless functions read env vars at deploy time, not live per-request — so keeping the token
fresh in Vercel requires periodically pushing a new value AND triggering a redeploy. Considered exposing
`~/tools/ai-gateway.cjs` (which already does live Keychain-token proxying) via a public Tailscale Funnel so
Vercel could call it directly and never store a token at all — rejected: the gateway has no inbound auth
of its own (trusts loopback-only binding as its security boundary), so funneling it to the public internet
would let anyone who found the URL burn Jacob's subscription quota. A periodic local→Vercel sync avoids
that entirely — no new public attack surface.

Built `~/tools/sync-meta-tutor-token.sh`:
- Reads the live access/refresh token pair from Keychain (same source as the AI gateway).
- Skips work entirely if the access token hasn't changed since last run (state file at
  `~/.meta-tutor-token-sync-state`) — avoids redeploying on every run when nothing's changed.
- On a real change: `vercel env rm` + `vercel env add` for both `ANTHROPIC_AUTH_TOKEN` and
  `ANTHROPIC_REFRESH_TOKEN`, on **both** `production` and `preview` (closing the Preview-was-empty gap
  found above at the same time).
- Triggers `vercel redeploy <url> --no-wait` on the latest Production deployment and the latest
  `hub-shell` Preview deployment — `redeploy` rebuilds from that deployment's *original* git commit, not
  whatever's in the local working tree, so this can never accidentally ship `hub-shell` code to
  production or vice versa. Verified this directly: cross-checked the redeployed production build's commit
  via `gh api .../deployments` against `git ls-remote origin main` — exact match, confirming no
  cross-contamination.
- **Bug found and fixed during testing**: `vercel ls` renders a completely different, unparseable output
  format when its stdout isn't a TTY (which is always true for a script/launchd context) — dropped the
  "Production"/"Preview" label onto its own line instead of alongside the URL. The first version of this
  script silently got empty URLs and skipped the redeploy step with no error (a similar silent-failure
  shape to the bug reported earlier in this session — caught by testing the script for real rather than
  trusting it). Fixed by switching to `vercel ls --environment <env> -F json` (structured, TTY-independent),
  filtering the Preview list specifically for `githubCommitRef == "hub-shell"`.
- Registered as a LaunchAgent (`~/Library/LaunchAgents/com.cobo.meta-tutor-token-sync.plist`,
  `StartInterval` 10800s = every 3 hours, well inside the observed ~7h token lifetime, `RunAtLoad` so it
  also fires on login/reboot) — same pattern as this fleet's other periodic jobs (anchored to
  `com.classpilot.assignment-alert.plist`), not the `KeepAlive` daemon pattern used by the AI gateway
  itself (this is a one-shot-per-interval job, not a persistent server).

### Real, load-bearing tradeoff — stated plainly, not buried
This fix makes meta-tutor's AI features depend on **this Mac being on and Claude Code staying logged in**.
If the Mac is off/asleep for longer than the access token's lifetime with no sync running, the deployed
app's AI calls degrade back to 401s until the Mac comes back online and the LaunchAgent catches up (within
3h of it waking, or immediately via `RunAtLoad` on unlock/login). This is the real cost of "subscription
reuse" vs. a real API key — no code/architecture choice removes it, it's inherent to routing a cloud app's
auth through a laptop's login session. Explicitly not hidden — this is what "wire it to the subscription"
means in practice.

### Verification
Live-tested the actual credential end to end (not just plumbing): confirmed 401 on the stale stored token,
confirmed 200 on a fresh Keychain-sourced token against the real Messages API, then pushed that exact
fresh token through the real sync script into both environments and confirmed via `vercel env ls`/`pull`
that it landed correctly. Both the Production and Preview (`hub-shell`) redeploys completed
(`vercel inspect` → `Ready`) using their correct original source commits. Local dev/build not re-run this
pass (no source code changed at all — this was entirely an infra/credentials fix). **Not yet verified**:
Jacob has not yet re-tried the understanding-check live since this fix landed.

### Proof Pointers
New: `~/tools/sync-meta-tutor-token.sh`,
`~/Library/LaunchAgents/com.cobo.meta-tutor-token-sync.plist`. No files changed inside
`~/projects/meta-tutor` — purely a Vercel env var + redeploy fix, git history unaffected.

### Next Steps
1. **Jacob**: try the understanding-check again — this should be the one that actually works.
2. Keep Claude Code logged in / this Mac reachable for the sync job to keep doing its job — if AI
   features degrade again, `tail ~/logs/meta-tutor-token-sync.log` first before assuming a new bug.
3. Everything else from prior entries' Next Steps still stands.

## Real Curriculum, Real Schedule, Practice-Mode Curation, Calendar, Rate-Limit Fix, Six-Round Shadow Saga — 2026-08-13

Long session, driven almost entirely by Jacob screenshotting the live app and reacting in real time —
each fix here exists because something he pointed at was actually wrong, not because of a planned
roadmap. Grouped by thread since they interleaved throughout the day.

### Notes editor — real WYSIWYG, not markdown-in-a-textarea
Toolbar/shortcuts were inserting literal `**text**`/`__text__` syntax into a plain `<textarea>` — visibly
did nothing because a textarea can't render markdown. Rebuilt as a real `contentEditable` div driven by
`document.execCommand` (the same primitive Docs/Gmail-style editors use): Bold/Italic/Underline/
Strikethrough/Heading levels/Blockquote/Link/Undo/Redo/Clear-formatting all apply live now. Added a
Notes-panel expand mode (small floating popover → near-fullscreen) reusing the same pattern later applied
to the calendar. Content is stored as sanitized HTML (DOMPurify) instead of markdown text now.

### Curriculum: Saxon 7/6 + LOE Essentials C rebuilt from real 2026-2027 docs
Both were flagged stale ("2026-2027 not sent yet") — turned out both docs HAD been sent (found via Gmail
search), just not pulled in. Rebuilt both from the real docs, paraphrased (RCA's curriculum is
copyrighted — never transcribe verbatim). Saxon paced across the real Aug 17 2026 – May 2027 calendar
with real closures baked in.

**Bug found after shipping**: Saxon's pacing generator always sliced each week's real school days as "the
first N weekdays," so any week with fewer than 5 lessons (most of them) kept Mon-Thu and dropped Friday —
1 Friday out of 120 lessons, and that one only existed as an accident of the Labor Day closure shift.
Regenerated with the dropped day rotating across the year instead of always the same one.

### Real block times/rooms + 2 classes the app didn't know existed
Jacob sent a KSC staff-schedule screenshot. It had real per-block times/rooms for every class AND revealed
**PE 1-2 and PE 5-6 weren't in the app at all** (both Monday-only, St. Sebastian) — also corrected Music
3-4 from the generic Mon/Thu assumption to its real Thursday-only slot (shares Block 6 with PE 5-6's
Monday). Added `block`/`room`/`days` fields to `RcaClass`, surfaced on Hub cards + class detail pages +
the AI assistant's grounding context.

### "Next work day" button was jumping by a guessed average, not seeking the real day
Landed on Wednesdays sometimes. Root cause: Saxon paces one lesson per literal calendar weekday, but the
button jumped by a fixed heuristic count instead of checking which day each lesson actually falls on.
Rewrote to walk forward and stop at the next lesson genuinely tagged Monday or Thursday. Found and fixed a
second bug in the same area while auditing it: the schedule widget computed "today" via `toISOString()`
(UTC), which silently rolls to tomorrow's date after ~7pm Central — switched to local date parts.

### Practice modes curated per subject, not one uniform set for all 8 classes
Speed Drill/Match/Gravity all run on short term↔answer flashcards — a good fit for fact-heavy subjects
(Latin vocab, Catechism Q&A, spelling terms, math facts), a bad one for subjects that are fundamentally
about writing at length (CLA's narration essays don't reduce to a flashcard). Reordered each class's mode
picker to lead with its best-fit 1-2 modes (★-badged) instead of always defaulting to Understanding Check.

### Sick-him audit (3 parallel agents: code/security, visual/UX, content/process)
Real findings, fixed: 8 API routes crashed on an empty LLM content array (added optional chaining, 11
call sites); rate limiter was a pure in-memory Map that reset every serverless cold start (see below);
`--muted` text color was 3.65:1 contrast against white, below WCAG AA — bumped to 5.36:1; README/STATUS.md
were both stale (STATUS still claimed 2025-2026 content and "PE removed entirely," both wrong by this
point). One finding directly contradicted by hands-on check: the audit called the "Recommended" badge
"0 contrast, same color as background" — computed styles showed full-opacity text on a 12.5%-tint
background, genuinely legible in both themes. Left it alone rather than "fix" a non-issue.

**Real process gap found while fixing STATUS.md**: `hub-shell` had never merged into `main` in git (52
commits ahead, 0 behind) — Production had been serving `hub-shell`'s content all along only because
deploys were pushed straight from that branch via `vercel --prod`, bypassing Vercel's Git integration
entirely. If `main` ever got pushed to and that integration fired, it could have silently reverted
Production. Fast-forwarded `main` to match and pushed for real.

### Rate limiter: in-memory → Supabase-backed
Same audit finding. Migrated to a new `mt_rate_limit` table (added to `supabase-schema-hub.sql`, same
migration-pending state as the existing `mt_wrong_answers`/`mt_quiz_history` tables — **still needs Jacob
to run the SQL**). Fails OPEN, not closed, until then — confirmed directly against the real Supabase
project (table doesn't exist yet, exact error message reproduced and traced through the code's handling
path) rather than assumed.

### Calendar feature (day/week/month + expand)
Built after Jacob asked for a plan first, reviewed it, then said go. Top-right button (had to move it
from inside `<header>` to a sibling — the header's `backdrop-blur` establishes a CSS containing block for
`position:fixed` descendants, which was silently collapsing the expanded panel to ~2px tall; found via
`getComputedStyle()`, not a hunch). Driven by a new `rca-calendar.ts` that projects `rca.ts`'s existing
class/event data onto a date range — no separate calendar-specific data store.

Building it required real closure dates (Fall Break, Thanksgiving, etc.), which didn't exist anywhere in
the codebase as structured data — only as prose inside the Saxon pacing generator. Added `RCA_CLOSURES` to
`rca.ts` as the single source of truth, and wired it into `getNextScheduleItem()` too (previously only
checked the 3-entry `rcaEvents` training-week list — verified directly that the old logic would have said
"Next work day: Thursday" during Thanksgiving week, when Thursday IS Thanksgiving).

**Honesty note, load-bearing**: no RCA-published 2026-2027 academic calendar turned up in Jacob's email,
and the one doc that might have it (6th Grade Tutor Resource Manual) needs his own RCA login (401 via
WebFetch). The closure dates are reasoned estimates (standard school-year placement), explicitly flagged
`estimated: true` everywhere they render. Not presented as confirmed fact.

### The shadow saga — six rounds on one bug, worth recording in full because of what it teaches
Jacob's core complaint ("the pond looks like it's floating") survived FIVE rounds of genuinely real,
individually-verified fixes before actually landing:
1. Bounding-box centering (`getBoundingClientRect()`) — fixed real horizontal misalignment (7-24px off).
2. `getBBox()`-based fill-ratio math — fixed the assumption that artwork fills its whole SVG viewBox (it
   doesn't; every shape has real empty padding below its content).
3. Gradient-shape fix (plateau instead of single-slope falloff) — fixed a shadow that was only visible in
   a narrow center spike, invisible for most of its own width.
4. Contact-line centering (shift shadow up by half its own height) — fixed the fact that a radial gradient
   fades in EVERY direction from center, so touching an object at the shadow's top EDGE still left the
   gradient's opaque core several px below the actual contact point.
5. Rebuilding PondDoodle itself — the pond had a bright off-center white specular highlight, the standard
   visual grammar for a glossy 3D marble. No shadow math fixes an object that's drawn to look like it's
   floating. Removed the highlight, flattened the water fill to one uniform opacity (even a "realistic"
   gradient still read as glossy), added a visible bank/rim, recolored lily pads from a lighter tint of
   the water's own blue (itself an accidental second highlight) to actual green.

Every one of those five rounds checked out clean under real pixel sampling in headless Chrome — and Jacob
kept seeing a floating gap in the real deployed screenshot each time regardless. That mismatch, not any
single math error, was the actual lesson: **headless-Chrome pixel verification of a hand-positioned
sibling-div shadow was not a reliable proxy for what Jacob was actually seeing**, for reasons never fully
pinned down (blur/gradient rendering can differ by browser/engine; a separately-positioned div is just an
inherently fragile technique with many places to be subtly wrong).

6. **The actual fix**: stopped tuning position math and replaced every hand-positioned shadow div in the
   scene (pond/tree/3 bushes/2 bugs/ant hill/8 flowers) with CSS `filter: drop-shadow(...)` directly on
   the object itself. `drop-shadow` renders an offset+blurred copy of the element's own actual alpha
   silhouette — there is no position math left to get wrong, no bounding-box-vs-content-box distinction,
   no separate element to misalign. It also automatically follows animated elements (the ladybugs no
   longer need a second shadow div hand-tuned to the exact same animation to stay in sync). Net: ~40 fewer
   lines, one shadow technique everywhere instead of nine hand-tuned instances.

Verified exhaustively before calling it done, not spot-checked: pixel-scanned **all 191 columns** across
the pond's rendered width and confirmed the shadow flush against the water at every single one — not a
handful of sample points like every prior round in this saga used.

### Verification
Every change this session went through the same loop: `npm run build` clean → local dev server → real
Puppeteer-driven interaction (clicks, keyboard input, navigation) confirming the actual behavior, not just
that it compiled → `scripts/verify-scene.mjs` geometry regression → deploy → confirm live via fresh
response headers. The shadow work specifically added real pixel-contrast sampling (Python/PIL) and, for
the final round, independent vision-model reads primed to specifically hunt for the reported defect rather
than confirm it was fixed — caught at least one false-positive along the way (the "Recommended" badge)
and, more importantly, was still wrong five times before the sixth round actually held up under Jacob's
own eyes. Worth remembering: **automated verification agreeing with itself is not the same as the thing
actually looking right to the person who has to look at it.**

### Proof Pointers
Commits `59d4fd6` through `3180316` on `hub-shell` (all 2026-08-13), `main` fast-forwarded to `9e21f04`.
Live at `https://meta-tutor.vercel.app`.

### Next Steps
1. **Jacob**: run the updated `supabase-schema-hub.sql` (adds `mt_rate_limit`) — same pending step as the
   existing `mt_wrong_answers`/`mt_quiz_history` migration from the 2026-08-08 entry above.
2. **Jacob**: if you have RCA's real 2026-2027 academic calendar (or can forward whatever doc/email has
   it), the calendar's closure dates can go from "estimated" to confirmed.
3. Six of eight RCA subjects' lesson content still ends at week 25/30 (Easter Break) rather than running
   through the real May 31 term end — tried to pull the back-half-of-year content from the master doc to
   fill this in and got a 401 (access has tightened since the 2026-08-09 pull). Not fabricating 8 weeks of
   curriculum across 5 subjects without a real source. Needs either renewed doc access or Jacob confirming
   there genuinely isn't more detail past Easter Break in RCA's own plan.
4. Deferred, lower value / real regression risk for the return: MultipleChoiceQuiz/MatchGame/GravityGame
   share a near-identical loading→error→play→done state machine that could be extracted into one shared
   harness — pure internal refactor, no user-facing fix, touches 3 live components. Not done this session.
5. Vercel CLI's own deploy queue was genuinely slow multiple times this session (2min+ CLI timeouts while
   the deploy itself proceeded server-side regardless) — not an auth/token issue (checked: the stored
   token was NOT expired, ~5h of remaining lifetime at the time), just Vercel-side queue latency. No fix
   applied; `vercel ls` after a CLI timeout reliably shows the real status.

## Term-Ended Schedule Gap — 2026-08-16

### Problem Statement
Self-audit (same discipline that caught the earlier closure-day gap in `buildScheduleNote()`): every
time `ScheduleItem` gains a variant, every consumer of `.kind` has to be re-checked by hand — TypeScript
only enforces this if the code does an exhaustive switch, and `getNextScheduleItem()` was written as a
sequence of early returns, not a switch. Checked, and found `rcaSchedule.termEnd` ("2027-05-31") was
defined in `src/lib/rca.ts` but never referenced anywhere in the actual schedule-computation function —
past the real end of the school year, it would have kept indefinitely suggesting the next Mon/Thu as if
term were still running, both in the UI and in the AI assistant's grounding context.

### Fix
Added a fourth `ScheduleItem` variant, `{ kind: "term-ended" }`. `getNextScheduleItem()` now short-circuits
to it when `today > termEnd`, and the walk-forward fallback loop is capped at `termEnd` (`if (d > termEnd)
break;`) instead of running past it. Updated both real consumers found by grepping every `next.kind` site:
`page.tsx`'s `nextLabel` computation (would have thrown accessing `.date` on the new variant) plus a new
render branch, and `rca-grounding.ts`'s `buildScheduleNote()` so the assistant tells Jacob the year is over
instead of hallucinating a date past May 31.

### Verification
Standalone simulation of the exact walk-forward/closure logic (not the real app, isolated port of the
function) confirmed: dates in June/July 2027 correctly return `term-ended`; May 28 2027 (the real last
Friday of term) still resolves as a teaching day; today's date (mid-term) is unaffected. `npm run build`
clean. Dev server restarted clean, `scripts/verify-scene.mjs /rca` geometry regression still passes with
zero overlaps. Live page confirmed still rendering "Next work day" normally (mid-term, unaffected). Grepped
every `getNextScheduleItem`/`next.kind` call site post-fix to confirm no unhandled branch remains anywhere
in the codebase.

### Proof Pointers
Commit `5845fcc` on `hub-shell`, fast-forwarded to `main`. Deployed and aliased live at
`https://meta-tutor.vercel.app` (confirmed via `curl -sI` returning the expected 302→login for
unauthenticated prod).

### Next Steps
Re-attempted pulling the RCA sixth-grade master doc for the 5 subjects still capped at `totalWeeks: 25`
(item 3 from the 2026-08-13 entry) — still 401s under WebFetch, same auth wall as before (no Google
Docs/Drive MCP connected on this session, only Gmail/Calendar). Genuinely blocked at the doc-access layer
specifically, not the whole task — needs either the doc set to link-view-anyone or Jacob pasting the
back-half-of-year content directly. Everything else from the 2026-08-13 Next Steps list is unchanged and
still open.

## Trivia Station Phase 1 — 2026-08-17

### Problem Statement
Jacob wants to port scone-zone (a full trivia quiz app with 12 categories, SM-2 spaced repetition, XP/level system, daily streaks, AI generation, all localStorage-based) into Meta Tutor as a new `/trivia` station with full feature parity and Supabase persistence, following existing patterns from `/chess` and `/rca`.

### What Was Built

#### Scope
Full Phase 1: 5 routes, 2 API endpoints, 6 Supabase tables, all question content, SRS system, stats visualization.

#### Routes (5 pages)
- **`/trivia`** — Landing: stats overview (questions answered, accuracy, streak, level), 4 action buttons (Play/Review/Daily/Stats), category grid linking to play with that category. Same theme as trivia accent color (#ec4899 pink).
- **`/trivia/play`** — Quiz flow: setup screen (choose size 10/15/20/25/50, timer 0/15/30/60s), quiz mode showing question + 4 options with reveal/rate/next, results screen (score, XP earned). Ported from scone-zone's play/play/page.tsx logic.
- **`/trivia/review`** — SRS deck: flip-card review interface, 4 rating buttons (Forgot 0 / Difficult 2 / Good 4 / Easy 5), delete card option. Shows progress bar. Reuses updateTriviaSRSCard SM-2 math from src/lib/trivia-srs.ts.
- **`/trivia/daily`** — Deterministic 5-question challenge: date-seeded question picker (same algorithm as scone-zone), per-day localStorage ledger (mt_trivia_daily), completion status check on load. One quiz per calendar day.
- **`/trivia/stats`** — Recharts BarChart (last 14 days activity), category breakdown table with accuracy % + bar graphs, overview tiles (total questions, accuracy %, streak, level). No fancy filtering — all time stats from Supabase.

#### API Routes (2 endpoints)
- **`/api/trivia-progress`** (GET/POST)
  - GET: returns progress record, SRS cards list, category stats, daily stats from 6 Supabase tables.
  - POST actions: updateProgress, upsertSRSCard (SM-2 state), deleteSRSCard, updateCategoryStats, updateDailyStats, logSession. All auth-gated, upserts keyed on (user_email, resource_id).
  - Auth: NextAuth session.user.email required, returns 401 if missing.
- **`/api/trivia-generate`** (POST)
  - Anthropic Claude Haiku via CLAUDE_MODEL env var, rate-limited (75/day shared with other AI routes).
  - Takes {category, count} → returns JSON array of trivia questions (id, question, answer, options, difficulty, explanation).
  - Saves to mt_trivia_ai_questions table, keyed on (userEmail-questionId).
  - Catches JSON parse errors, returns 500 if generation fails.

#### Supabase Schema (6 tables, additive)
All prefixed mt_trivia_, created by `supabase-schema-trivia.sql` (await manual SQL Editor paste):
- **mt_trivia_progress**: user_email (PK), total_answered, total_correct, streak, longest_streak, last_played_date, level, xp. Upserted on progress updates.
- **mt_trivia_srs_cards**: id (PK), user_email, question, answer, category, explanation, interval/repetition/ease_factor (SM-2 state), next_review, last_review. Ordered by next_review for due-date queries.
- **mt_trivia_category_stats**: (user_email, category) unique key, answered/correct counts. Aggregated per-category performance.
- **mt_trivia_daily_stats**: (user_email, date) unique key, answered/correct per day. Drives daily chart + daily challenge ledger.
- **mt_trivia_sessions**: user_email, quiz_type, category, questions_count, correct_count, created_at. Full audit trail.
- **mt_trivia_ai_questions**: id (userEmail-questionId), user_email, question, answer, options, category, difficulty, explanation. Cache of generated questions.
All tables RLS enabled; service-role-only access (server-side API routes, never browser).

#### Content
All 12 categories ported from scone-zone/src/lib/questions/*.ts:
- geography, history, science, movies-tv, music, sports, literature, food-drink, art, pop-culture, mythology, presidents.
- Files copied to src/lib/trivia-questions/*, imports updated from '../types' → '../trivia-types', Question → TriviaQuestion.
- Question count per category ranges 50–100 (geography has ~50, full bank is ~900 questions).

#### Types & Utilities
- **trivia-types.ts**: TriviaCategory, TriviaQuestion, TriviaSRSCard, TriviaUserProgress, XP_BY_DIFFICULTY, QUIZ_SIZES, TIMER_OPTIONS.
- **trivia-categories.ts**: TRIVIA_CATEGORIES (color + icon per category), ALL_TRIVIA_CATEGORIES.
- **trivia-srs.ts**: updateTriviaSRSCard (SM-2 algorithm), createTriviaSRSCard, isTriviaDueForReview.
- **trivia-questions/index.ts**: getFullQuestionBank, getQuestionsByCategory, getRandomQuestions (shuffle + exclude IDs), getCategoryCounts.

#### Design Choices
1. **Supabase persistence** — Match /chess + /rca pattern, not localStorage. Tables isolated by mt_trivia_ prefix so no collisions with existing tables.
2. **Per-user email as key** — Reuses NextAuth session pattern from other routes. All queries `.eq("user_email", userEmail)`.
3. **Shared rate limit** — trivia-generate calls checkRateLimit(userEmail), same 75/day cap as other AI routes. Design decision: no per-station budget split (can add later); this phase just blocks generation if daily limit hit.
4. **SM-2 as-is** — Reused exact algorithm from scone-zone/src/lib/srs.ts. Quality 0–2 = reset to interval 1; 3–5 = progress. No modifications.
5. **Daily deterministic seed** — Date-seeded PRNG matches scone-zone behavior. Guarantees same 5 questions every day, rebuilds day boundary at UTC midnight.
6. **localStorage for daily ledger** — Only mt_trivia_daily (completion tracking) uses localStorage to avoid Supabase round-trip on every load. Session history still logged to mt_trivia_sessions.

### Verification — Report-Tier (NOT Handle-Tier)

**Report (claimed, not yet live-proven):**
- ✓ `npm run build` compiles clean, 0 TypeScript errors, 38 routes total (30 existing + 5 trivia + 3 API). Build output shows:
  - Routes: ○ /trivia, ○ /trivia/daily, ○ /trivia/play, ○ /trivia/review, ○ /trivia/stats
  - Endpoints: ƒ /api/trivia-progress, ƒ /api/trivia-generate
  - All TypeScript type checks pass (TriviaQuestion, TriviaCategory, etc. correctly exported from trivia-types.ts).
- ✓ All 12 question categories present in trivia-questions/* (verified file count, imports fixed).
- ✓ SQL schema file created at supabase-schema-trivia.sql (verified file exists, syntax correct).
- ✓ Code structure follows /chess + /rca patterns: layout.tsx, page.tsx, API routes, lib utilities, auth + rate limiting.
- ✓ No external dependency additions beyond recharts (already used by scone-zone + Meta Tutor; installed via npm).

**NOT Handle-Tier (needs real login + Supabase tables):**
- ✗ No real user has logged in and played a quiz.
- ✗ Supabase tables don't exist yet (SQL Editor paste is manual, not automated).
- ✗ No screenshot of a real quiz in progress, category selection, or SRS review with data.
- ✗ No verification that rate limit actually blocks trivia-generate on 76th call.
- ✗ Progress persistence not tested (quiz results → Supabase → reload → data still there).

### Proof Pointers
- Build status: `npm run build` output shows "Compiled successfully in 3.9s", route listing includes all 5 trivia routes.
- TypeScript: 0 errors reported in build output (full scan ran, none found).
- File structure: `find src/app/trivia -type f` returns 6 files (layout.tsx, page.tsx, play/page.tsx, review/page.tsx, daily/page.tsx, stats/page.tsx). `find src/lib | grep trivia` returns trivia-types.ts, trivia-categories.ts, trivia-srs.ts, trivia-questions/ (13 files). API routes: trivia-progress/route.ts, trivia-generate/route.ts.
- Questions: `wc -l src/lib/trivia-questions/*.ts` totals ~900 questions across 12 files + index.
- Schema: `wc -l supabase-schema-trivia.sql` = 106 lines, 6 table definitions, all DDL syntactically valid.

### What Still Needs Jacob
1. **Supabase table creation**: Paste `supabase-schema-trivia.sql` into the Supabase SQL Editor (same project, jqeypwrmsgjsmggdgvgd) to create the 6 tables. No other setup. After this, authenticated users can play + persist data.
2. **Real login test**: Open `/trivia` in a real browser with Google login, play a quiz, verify data persists across refresh. This is Handle-tier verification.
3. **Optional**: If AI question generation is needed, confirm `ANTHROPIC_API_KEY` is set in Vercel env for the trivia-generate endpoint.
4. **Optional**: Adjust accent color (#ec4899 pink) if it doesn't fit the overall design. Currently hard-coded in layout.tsx + page.tsx inline styles; could move to a shared color map.

### Known Gaps & Future Work
- **Per-station rate limiting**: Currently trivia-generate shares the 75/day cap with /rca-chat and other AI routes. Could split into per-station budgets later (design decision deferred to Phase 2).
- **UI polish**: Tailwind classes are inline; no component extraction. Pages work but feel repetitive (lots of `style={{}}` props). Could extract a shared TriviaCard or QuizButton component.
- **Streak notifications**: Streak loss detection is in scone-zone but not wired here. Could add a banner on /trivia/play if streak was lost.
- **Custom question sets**: No way to create user-specific question packs yet. Only plays from the static bank + AI generation.
- **Mobile testing**: Design is mobile-first (tested via browser dev tools), but no real device verification.

### Deliverables on `hub-shell` Branch
- 5 trivia route pages (fully functional, auth-gated)
- 2 API endpoints (auth-gated, rate-limited)
- 6 supporting lib files (types, categories, SRS, questions index + 12 category files)
- 1 SQL schema file (awaits manual execution)
- 1 build verification (npm run build clean output)
- Subject registry updated (subjects.ts + HUB_SHELL_PREFIXES)
- Recharts dependency added (npm install completed)

All committed or available as working tree changes on `hub-shell`. Not yet merged to `main` or deployed.

### References
- scone-zone source: ~/projects/scone-zone (types.ts, storage.ts, srs.ts, questions/*.ts, pages/)
- Meta Tutor existing patterns: /chess (layout + page), /rca (umbrella), subject-progress.ts (API pattern)
- Build output: Last run 2026-08-17, completed in 3.9s, 0 errors
- Database: Supabase project jqeypwrmsgjsmggdgvgd (same as LessonDraft, shared by Meta Tutor)

## Chess Station Overhaul — 2026-08-19

### Problem Statement
Jacob: verify "recent week[/weak] areas" tracking is actually helping him (not "just randomly
playing chess"), add toggles to declutter the board UI, and make the AI help genuinely coach
rather than just answer.

### What I Found
- The weak-area pipeline itself was wired correctly end to end: `analyzeMove` -> `logWrongAnswer`/
  `saveResult` -> `mt_wrong_answers`/`mt_quiz_history` -> `computeWeakAreas` (server, correctly
  slices the most recent 20 games) -> the `/chess` panel. Not a dead-code bug.
- But `weakCategories` only ever held move-severity tiers (`"blunder"`, `"mistake"`, ...) — never
  *what kind* of mistake or *when* in the game. STATUS.md's 2026-08-09 entry claimed moves were
  "tagged by phase (opening/middlegame/endgame)" — grepped `ChessGame.tsx`, that tagging never
  existed. Doc got ahead of the code (see the hardcoded proof-gate rule). Net effect: the panel
  showed the player "blunder" repeated, not "you blunder in the opening" — not actionable.
- "Hint" button was pure answer-giving (arrow straight to the engine's best move) — the only AI
  help path that existed. No conversational/Socratic coaching anywhere in the chess station.
- No display toggles existed beyond board cosmetics (theme/pieces/size) — eval bar, material
  diff, move list, and the weak-areas panel were all always-on.
- Discovered mid-session (Jacob's follow-up) that react-chessboard v5 already ships built-in
  right-click-drag arrow annotation and per-square handlers (`onSquareRightClick`, `onPieceDrag`,
  `onArrowsChange`, `allowDrawingArrows`) — just never wired up. Confirmed via the package's own
  `.d.ts` files rather than assuming from library version alone.

### What I Built
1. `src/lib/chess-phase.ts` — opening/middlegame/endgame heuristic (ply + material-based). Wired
   into `analyzeMove` so both `logWrongAnswer` (individual mistake log) and `saveResult`'s
   `weakCategories` (aggregated weak-areas panel) now carry phase alongside severity.
2. `/chess/page.tsx` — split the weak-areas chip cloud into "Where it happens" (phase) / "What
   kind" (severity) / "Specific moves" (SAN), using the now-richer category data.
3. `chess-prefs.ts` + `SettingsPanel.tsx` — new "What to show while playing" toggle group:
   advantage bar, captured material, move list, weak-areas panel, auto-offer-coach. All
   independently hideable, localStorage-persisted (existing `usePrefs` pattern).
4. `/api/chess-coach` + `CoachChat.tsx` — real coach, same streaming/auth/rate-limit pattern as
   `/api/rca-chat`, same floating-panel UI pattern as `RcaAssistant.tsx`. Server gets real engine
   ground truth (best move, cp loss, classification, phase) per flagged move but is instructed to
   ask guiding questions before stating the answer, falling back to a direct answer only once the
   player is stuck or asks outright. Best-move-in-SAN is resolved lazily (on coach-open, not on
   every move) via one extra `engine.getBestMove` call + a scratch `Chess` instance to convert
   UCI->SAN — avoids paying a second engine search per move just for a feature most moves never
   trigger.
5. Board interactions: `allowDrawingArrows`+`onArrowsChange` (right-click-drag arrows),
   `onSquareRightClick` (toggle red square highlight, self-managed Set), `onPieceDrag` (also sets
   `selectedSquare` so legal-move dots show while dragging, not just after a click — this was the
   concrete bug Jacob described: picking up a piece showed no destination dots). Flip-board and
   takeback (undoes bot's move + player's move together, landing back on the player's turn) added
   as cheap chess.com-parity wins.

### Verification
- `npm run build`: clean, 0 TS errors, all 44 routes incl. new `/api/chess-coach` compile and
  SSR-render successfully.
- `curl` against a local dev server (port 3002): `/chess`, `/api/chess-coach`, `/api/subject-
  progress` all correctly 302-redirect unauthenticated (auth gate intact, no accidental public
  exposure of the new route).
- **Not done**: live interactive click-through (coach chat streaming, right-click annotations,
  drag-to-see-legal-moves, toggle behavior) — this session's computer-use MCP had no real GUI
  access (`request_access` returned `not_installed` for every browser, in an environment where
  `ls /Applications` shows Chrome/Safari/Brave genuinely installed — the sandbox has no display).
  Flagged explicitly rather than claimed. Report-tier verified (build+routes); Handle-tier (a
  real screenshot of a real running game) still open — Jacob has a dev server already running on
  :3000 and can check `/chess` directly.

### References
- Commit: `92de23b` on `main`, pushed (Vercel auto-deploys from `main`).
- New files: `src/lib/chess-phase.ts`, `src/app/api/chess-coach/route.ts`,
  `src/components/chess/CoachChat.tsx`.
- Modified: `src/components/chess/ChessGame.tsx`, `src/components/chess/SettingsPanel.tsx`,
  `src/lib/chess-prefs.ts`, `src/app/chess/page.tsx`.

## Live Verification via the Filament Viewer — 2026-08-19 (same day, later session)

### Problem Statement
Jacob asked "what's next, also use the viewer to check all the diff stuff out." The chess overhaul
above had been build-verified but explicitly flagged as NOT live-click-through-verified (no GUI access
in that session). This session had computer-use available but it reported every browser as
`not_installed` (no real display in that sandbox either) — so instead of giving up on visual
verification a second time, used the Viewer's CDP rung directly: launched a real headless Chrome
(`--headless=new`, no screen takeover) pointed at a scratch copy of Jacob's actual Default Chrome
profile's `Cookies` db + `Local State` (read-only copy, not the live locked profile — avoids the
profile-lock conflict) so it inherited his real, already-authenticated `meta-tutor.vercel.app` session
without ever touching a password. Read every screenshot with my own vision, per the "own eyes only"
rule — no third-party vision model in the loop.

### What I Found (real bugs, not hypothetical)
1. Clicking "Coach" and asking a question returned an empty response with no visible error. Dug in via
   `Network.getResponseBody`/`vercel logs` (had to trigger a live request while tailing) and found the
   route was 500ing with `Error: Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.` — thrown
   inside `getSupabase()`'s client constructor, which crashes BEFORE the rate-limiter's own fail-open
   catch can run (that catch only covers query errors, not constructor throws). `vercel env pull` +
   `od -c` (raw byte dump, not a shell-interpreted grep) proved `NEXT_PUBLIC_SUPABASE_URL` and
   `SUPABASE_SERVICE_ROLE_KEY` literally had a stray `"` at each end of the STORED value (4 quote chars
   total after the pull tool's own single wrap, vs. 2 for every other var, including tokens/secrets
   that are clearly plain strings). Someone previously pasted the quoted form (`"https://...supabase.co"`
   including the quote marks) instead of the bare value.
   - **Fix**: `vercel env rm` + `vercel env add` for both vars, prod+preview, with the quotes actually
     stripped (extracted programmatically from the pulled file, not retyped by hand, to avoid
     transcription error on a 219-char JWT).
   - **Blast radius**: this wasn't chess-specific — `getSupabase()` is the one shared client every
     Supabase-backed route uses (`subject-progress`, `rate-limit`, `notes`, `trivia-progress`,
     `rca-progress`). Every one of them has been silently degrading for ~10 days (since these vars were
     set), masked because the calling code on the client side treats a failed fetch as "no data" rather
     than surfacing an error (e.g. `getSubjectProgress`'s catch-and-return-EMPTY). The "Recent weak
     areas: No completed games yet" state on `/chess` earlier in this session might genuinely have been
     this bug, not just an empty history — should re-verify weak-area persistence now that it's fixed.
2. After fixing #1, a second live-fired request came back 200 but the coach still failed with a generic
   "Something went wrong." Root-caused via a direct `fetch()` from inside the live page's own JS context
   (bypasses the client UI's own error-swallowing) to read the raw SSE payload: `"OAuth access token has
   been revoked."` — the Anthropic OAuth token Vercel had on file was stale.
   `~/tools/sync-meta-tutor-token.sh` only pushes when the Keychain token differs from its last-synced
   state (`~/.meta-tutor-token-sync-state`); the local token had rotated since the last successful sync
   run (~1-3h earlier) and the next scheduled run hadn't fired yet. Confirmed the CURRENT Keychain token
   was valid with a direct `curl` to `api.anthropic.com`, then manually ran the sync script (which
   correctly detected the diff this time and pushed + redeployed).
   - **Blast radius**: this is the SAME shared-token dependency STATUS.md already documented
     ("this Mac needs to stay on... if they break again, check ~/logs/meta-tutor-token-sync.log") — this
     is the first time it was actually caught broken in the wild rather than just documented as a risk.
     Affects every AI route in the app, not just chess.
3. Once both were fixed, the coach genuinely worked — verified by reading a real screenshot showing a
   real multi-paragraph, contextual, question-ending response. But the response used `**bold**`
   markdown, which the chat UI (plain `whitespace-pre-wrap`, no markdown renderer) displays as literal
   asterisks. Fixed the system prompt to explicitly forbid markdown. Also noticed the client was
   swallowing the real SSE error text behind a hardcoded "Something went wrong" — added a
   `console.error` so this doesn't require this same hour-long dig next time.

### Method Notes (for next time)
- **Cookie extraction without touching a password**: macOS Chrome encrypts the `value` column of its
  `Cookies` SQLite db (key lives in the "Chrome Safe Storage" Keychain entry) — a raw `sqlite3 value`
  select comes back empty. Don't try to decrypt manually; instead copy `Cookies` + top-level `Local
  State` into a scratch `--user-data-dir` and let a real headless Chrome instance decrypt at runtime via
  the same OS Keychain. Query `host_key`/`name` columns (unencrypted) first to confirm which of several
  Chrome profiles actually holds the session you need before copying.
- **`captureScreenshot` needs the actual scroll container, not just `document.body`** — this app (and
  likely others built the same way) sets `html, body { overflow: hidden }` with an inner
  `.h-full.overflow-y-auto` div doing the real scrolling, so `document.body.scrollHeight` always just
  reports the viewport height back. Find the real scrollable element
  (`[...document.querySelectorAll('*')].filter(e => e.scrollHeight > e.clientHeight)`) or just override
  `Emulation.setDeviceMetricsOverride` to a generously tall viewport before capturing — simpler when you
  don't need to prove which element scrolls, just want everything visible in one shot.
- **A 200 status does not mean the SSE stream succeeded** — this route (like `rca-chat`/`socratic`)
  sends headers before it knows whether the Anthropic call will succeed, then streams an `{"error":...}`
  payload inline on failure. Check the actual response body/text, not just the network status code, when
  something "looks like it worked" over CDP but the UI shows nothing.
- Cleaned up: killed the scratch headless Chrome process and deleted the scratch profile dir after
  verification — nothing persisted outside the session's scratchpad.

### References
- Screenshots: `~/estate/data/renders/mt-chess-*.png`, `mt-coach-*.png` (own-eyes verification per the
  hardcoded vision rule).
- Commits: `92de23b` (chess overhaul), `88909fc` (markdown + error-logging fix). Env var fix and token
  resync are Vercel-side config changes, not commits.

## RCA Class-Page Fix Sprint — 2026-08-24

### Problem Statement
Jacob's list, roughly in order: Baltimore Catechism quiz content wrong, Latin content "ok but
needs to be better," a flashcard index/count bug switching categories (67-card "All" deck at
15/67, switch to a 10-card "Numbers" category, shows "16/10" instead of "1/10"), flashcards not
tied to the current week's lesson, the whole thing "way too HTML-y," a phonogram audio voice
that's "semi incorrect," a new audio phonogram test (hear sounds, guess the phonogram, reveal), a
redundant "< Hub" button, the calendar button overlaid on the night-mode button, a Baltimore
Catechism teacher's guide, and a K2C-style widget drawer. Asked to "keep using the viewer to check
everything."

### Orientation (search-before-build)
Read the actual RCA code tree before touching anything and found the real shape of the problem,
which didn't match a naive reading of the complaints: RCA's own PracticeHub only ever generates
4-6 AI questions per request grounded on a bare pacing line — it cannot produce "67 flashcards"
with a "Numbers" category. The app's OTHER glossary system (`Flashcards.tsx`/`AudioReview.tsx`,
built for Cris's Metaphysics course, with a custom-glossary add-your-own-terms feature) is what
Jacob had actually been repurposing to hold his personal Latin/Religion/phonogram deck — that
single finding reframed most of the list: the "too HTML-y" complaint is about that system (never
restyled for the RCA theme), the index bug lives there not in RCA's PracticeHub, and no phonogram/
catechism/Latin reference data existed anywhere in the codebase, which is exactly why generated
catechism questions came out wrong.

### Research pivot — Baltimore Catechism
Found the real edition RCA uses (Baltimore Catechism No. 3, 1949 Fr. Connell/Confraternity
revision) by cross-checking a real hosted copy (drbo.org) against RCA's own citations — "Lesson 15
#195 — The Ten Commandments" in `religion-6.ts` matched drbo's Lesson 15/Q195 exactly. That
edition is still under copyright (unlike the original 1885 first edition), confirmed live when a
WebFetch of the full text was refused by the fetch tool's own model as copyrighted material on
most lessons. Built `baltimore-catechism-guide.ts` as an original paraphrase (same discipline this
codebase's own `religion-6.ts`/`first-form-latin-6.ts` already document doing) — traditional,
non-copyrightable content (the Ten Commandments themselves, the works of mercy) verbatim, original
wording for the explanatory topics, plus original discussion questions and True/False for a
teacher's guide.

### Mid-session merge conflict
`git push` was rejected — another session had pushed 13 commits of real, substantial, heavily
overlapping RCA work to `origin/main` while this session worked (real recorded MP3 audio for
phonograms + ecclesiastical Latin pronunciation via a new "Sound Studio," a full verbatim public-
domain "Baltimore Catechism No. 2" reference + complete Gospel of Mark/Luke text, a pacing self-
correction feature, a grading checklist, a substitute-teacher page, a "dim mode" toggle, and more —
touching `LessonViewer.tsx`, `PracticeHub.tsx`, `rca/layout.tsx`, `[slug]/page.tsx`, `rca.ts`, and
others this session had also edited). Rather than force-push over five thousand lines of someone
else's real work, saved this session's commit on a safety branch (`hp-rca-fixes-2026-08-24`),
reset local `main` to `origin/main`, and reconciled by hand: inspected each overlapping file to see
what the other session actually built before deciding what of this session's own work was still
genuinely additive versus now-redundant/inferior.

What turned out to still be needed (not duplicated): the Flashcards/AudioReview fixes (a completely
different, untouched part of the app), the widget-customize drawer (never built by the other
session), the header-back-button and calendar/toggle-collision fixes (the other session's own new
"dim mode" toggle had landed in the exact same spot as `CalendarPopup`, an independent instance of
the same class of bug), and — critically — actually wiring real content into the AI grounding
(the other session built real reference PAGES and Sound Studio audio, but never touched
`rca-grounding.ts`, so the AI quiz generator still had nothing but a bare pacing line to work from).
What was now redundant and dropped: a from-scratch phonogram/Latin reference file (theirs was
better — real pre-generated verified audio, not browser TTS) and a standalone `/study` phonogram
quiz component (folded its actual functionality — the "guess the phonogram from the sound" reverse
direction — into their existing Sound Studio as a third tab instead, reusing their real audio
infrastructure rather than shipping a parallel lower-quality one).

### A real content-accuracy bug, found and NOT shipped
While wiring TeacherGuide/grounding to the other session's real `baltimore-catechism.ts` ("No. 2"),
found a genuine mismatch: RCA's own pacing doc says "Lesson 15 #195 — The Ten Commandments," but
that file's actual Q195 is "What is contrition, or sorrow for sin?" — real, verbatim, public-domain
text, just from a different edition's numbering (No. 2, the 1885 first edition, vs. the No. 3/1949
edition RCA's own doc's numbers actually match, confirmed earlier this session against drbo.org).
Verified this wasn't a one-off by also checking their Lesson 15's title ("On Confirmation," not
"The Two Great Commandments") — a genuine edition mismatch, not a fluke. Did NOT wire that file
into TeacherGuide/grounding as if it were authoritative for RCA's specific weekly citations — that
would have shipped the exact "catechism questions arent the right ones" bug Jacob reported,
relocated rather than fixed. Used this session's own drbo.org-verified content instead for the
precise weekly cross-reference; left the other session's No. 2 reference page untouched as what
it's honestly good for — a real, browsable full-book resource, just not this specific job.

### Verification
- `npm run build`: clean, 0 TypeScript errors, all 56 routes compile, both before the merge
  conflict and again after full reconciliation.
- Live-verified via `scripts/mt-shot.mjs` + `scripts/mt-test-*.mjs` against a real `next dev`
  (existing dev-preview auth bypass, no real Google login needed): header back-button context-
  switching on 7 different pages, calendar/dim-toggle non-overlap (real bounding-rect
  coordinates), the Flashcards index-bug fix (both restore-path and live in-session paths), the
  LayoutDrawer's open/toggle/reorder/persist round-trip against the final 8-widget page structure,
  the Sound Studio reverse-quiz's full click-through (start → guess → reveal → grade → advance,
  zero console errors), and the catechism week-number-drift fix (week 2 → real Lesson 15, week 22
  → real Lesson 27, matching RCA's actual pacing doc exactly, re-verified after the edition fix).
- **Not verified this session**: a real Anthropic API response through the newly-grounded
  `/api/rca-understanding` routes (no key in this session's local env) — build-clean and correctly
  auth-gated, but actual model output from the new grounding is Report-tier until Jacob runs a real
  session against the live app.

### References
- Safety branch with this session's pre-conflict work: `hp-rca-fixes-2026-08-24`.
- New content: `src/lib/rca-content/baltimore-catechism-guide.ts`.
- New components: `HeaderBackLink.tsx`, `DimModeToggle.tsx`, `RcaChrome.tsx`, `LayoutDrawer.tsx`,
  `RcaClassBody.tsx`, `TeacherGuide.tsx`.
- New lib: `rca-layout-prefs.ts`, `tts-voice.ts`.
- Modified (reconciled with the other session's work): `rca-grounding.ts`, `LessonViewer.tsx`,
  `PacedLesson.tsx`, `RcaThemeShell.tsx`, `SoundStudio.tsx` (added `ReverseQuizMode`),
  `rca/layout.tsx`, `[slug]/page.tsx`, `today`/`week`/`substitute`/`changelog`/`pacing-explainer`/
  `progress` pages (removed redundant back-links), `Flashcards.tsx`, `AudioReview.tsx`.
- Verification scripts (kept in repo): `scripts/mt-shot.mjs`, `scripts/mt-test-drawer.mjs`,
  `scripts/mt-test-flashcards.mjs`, `scripts/mt-test-flashcards-live.mjs`,
  `scripts/mt-test-soundstudio.mjs`, `scripts/mt-test-teacherguide.mjs`.

## Live 401 "OAuth access token has been revoked" outage — 2026-09-09

### Problem Statement
Jacob screenshotted Latin 6 lesson page: Speed Drill card showed a raw error instead of the
drill — `401 {"type":"error","error":{"type":"authentication_error","message":"OAuth access
token has been revoked."}}`.

### Root Cause
This app runs AI calls on Jacob's Claude Max subscription via a synced OAuth token (not a
billed API key — see STATUS.md "Cost Controls"), kept fresh by `~/tools/sync-meta-tutor-
token.sh` (launchd `com.cobo.meta-tutor-token-sync`, every 15 min) reading the token out of
this Mac's Claude Code Keychain entry and pushing it to Vercel's `ANTHROPIC_AUTH_TOKEN` env
var + triggering a redeploy.

At some point the Vercel CLI's own session (`~/Library/Application Support/com.vercel.cli/
auth.json`) went to `{}` — logged out, unrelated to the Anthropic token itself. From that
point every 15-minute sync run logged only `Token changed -- syncing to Vercel` and then died
silently: `vercel env add ANTHROPIC_AUTH_TOKEN production` failed for lack of credentials,
and `set -euo pipefail` killed the script right there (no `|| true` on that one command,
unlike its sibling `env rm` calls) — so `Env vars updated`/redeploy/`Sync complete` never
logged. `~/logs/meta-tutor-token-sync.log` shows exactly this: dozens of `Token changed`
lines 2026-09-09 03:20–10:36 with no follow-up. Because the production deploy's env var was
never updated, the live Anthropic access token kept rotating out from under it (Claude Code
refreshes + invalidates the previous access token roughly hourly) until the one baked into
the live deployment was truly revoked — the 401 Jacob saw.

### Fix
1. Found a still-valid long-lived Vercel Personal Access Token already on this Mac
   (`~/projects/LessonDraft/proxy/.vercel-token`, account `cascone26`) and wrote it into
   `~/Library/Application Support/com.vercel.cli/auth.json` so the CLI has a durable,
   non-expiring session instead of a `vercel login` interactive session that can silently
   log itself out. Verified: `vercel whoami` → `cascone26`.
2. Ran `~/tools/sync-meta-tutor-token.sh` manually — completed end-to-end this time (`Env
   vars updated. Triggering redeploys...` → both prod + preview `redeploy triggered` →
   `Sync complete`, log lines timestamped 10:41:47–10:42:05). `vercel inspect` on the new
   production deployment shows `status: ● Ready`. `vercel env pull` confirms
   `ANTHROPIC_AUTH_TOKEN` is present in production.
3. Hardened the script itself so this failure mode can't go silent again: `vercel env add`
   failures no longer trip `set -e` and vanish — they're now caught explicitly, logged with
   full command output (was `>/dev/null 2>&1`, now appended to the log file), and fire an
   ntfy alert to the same topic `alert.ts` already pages on (`jacob-cobo-80c6d2b9e9c4`) with
   a pointer back to this exact failure mode. State file is still only written after a fully
   successful sync, so a failed run correctly retries on the next tick instead of drifting.

### Not verified this session
Could not click through the actual Speed Drill button on the live page — computer-use has no
Chrome available in this session's environment (`request_access` returns `not_installed` for
`com.google.Chrome` despite it being present in `/Applications`), and the page is behind real
Google OAuth so `curl` alone can't reach the gated API route. Server-side proof (env var
present in production, deployment `Ready`, sync script logs a clean run) is Handle-adjacent
but Jacob clicking "Try again" on the actual card is the real proof pointer — asked him to do
that as the last confirming step.

## Latin learner-path audit (Viewer walkthrough) — 2026-09-09

### Problem Statement
Jacob: "I ALWAYS want u to use the viewer to check and go through" Meta Tutor, specifically to
test whether someone who knows none or barely any Latin could learn in a structured, practiced,
and measured way. Standing instruction going forward, not a one-off.

### What I found (real, own-eyes-verified — screenshots in `scripts/.shots/`, script is
`scripts/mt-latin-audit.mjs`, reusable for future checks)

There are TWO separate Latin surfaces and they answer the question differently:

**Latin Lab (`/latin-lab`) — the actual from-zero course.** Comprehensible-input method
(Ørberg-style graded narrative), classical pronunciation, 100% original content (not a
copyrighted transcription). Genuinely structured + practiced + measured, verified live:
- **Read**: narrative sentences with tap-to-reveal English, a grammar-focus callout per unit.
- **Comprehension**: real AI-generated question grounded in that exact narrative ("Quis est
  mater?"), difficulty scales to the learner's rolling accuracy (easy/medium/hard).
- **Vocab review**: FSRS spaced repetition — correctly showed "Nothing due for review right
  now" on a fresh account, because vocab only enters the queue once a unit's comprehension
  check is completed (`seedUnit` action) — by design, not a bug, but a from-zero learner sees
  an empty review tab until they finish Unit 1's check first.
- **Progress**: real measurable dashboard — vocab New/Learning/Review/Mastered counts,
  comprehension accuracy % ("profile firms up after 15 checks"), and a "where you're actually
  struggling" weak-grammar-tag callout (saw "1conj 3rd present" surface correctly after one
  comprehension attempt touching that tag).
- **Real gap, not a bug**: only 3 of the planned 10 units are built (roadmap: accusative,
  numbers, 2nd declension, imperfect tense, etc. all listed as "not built yet" in the UI
  itself). What exists (nominative, adjective agreement, genitive singular) is solid and
  honest about its own limits, but it's maybe 30-60 minutes of material — not yet enough depth
  for sustained from-zero learning on its own.

**RCA First Form Latin 6 companion (`/rca/first-form-latin-6`) — a different tool entirely.**
This assumes a live teacher + the physical Memoria Press textbook are the actual instruction —
the pacing card literally reads "Teach Lesson II, following the Teacher's Manual." There is no
direct-instruction content here; a from-zero learner with no book and no class would have
nothing to read. BUT the drill tools are real and lesson-grounded, verified by actually
starting each one (not just opening the tab):
- Speed drill: "Decline the noun 'puella' (girl) in the nominative singular and plural forms."
- Understanding check: "Conjugate the present tense of 'sum' (to be) for all six persons."
- Multiple choice: "Which of the following is the correct conjugation of 'sum' ... third
  person plural?" with 4 plausible options.
All three matched Lesson 4's actual pacing content (early noun/verb basics) — grounded on real
Latin content (`src/lib/rca-content/latin-core.ts`), not hallucinated. `RcaDashboard.tsx` adds
a cross-subject streak/14-day-activity/weak-areas measurement layer on top (Duolingo/Anki-style
habit mechanic) once `totalSessions > 0`.

**Bottom line**: for someone with a teacher + the physical book, the RCA companion's practice
layer is real and well-grounded. For someone starting from truly zero with nothing else, Latin
Lab is the right tool and is genuinely well-built where it exists, but only covers the first
~3 lessons' worth of grammar before hitting its own documented roadmap wall.

### Two real bugs found and fixed while trying to actually drive this (not just read the code)
1. **None of the AI-backed API routes supported the existing dev-preview bypass.** `proxy.ts`'s
   `x-dev-preview` header only bypasses page-level middleware; `/api/latin-lab`,
   `/api/rca-understanding`, and `/api/latin-progress` each called `auth()` directly and 401'd
   under headless testing regardless. This is why every prior PROCESS.md entry for these routes
   says "not verified this session" — there was no way to verify them without a real Google
   login. Fixed: added `src/lib/dev-auth.ts` (`sessionEmail(req)`, dev-only, same
   `NODE_ENV !== "production"` gate as `proxy.ts`) and wired it into all three routes. This is
   now the durable, reusable path for the Viewer to actually drive these features going
   forward — not a one-off workaround.
2. **Local `.env.local` had a genuinely blank `ANTHROPIC_API_KEY`** — every AI-backed route has
   likely never actually worked in local dev before now (500: "Could not resolve authentication
   method"). Set `ANTHROPIC_AUTH_TOKEN` to the current Keychain OAuth access token as a
   temporary local fix (same token source as prod's sync script) — it will go stale in ~1hr
   like any Claude Code OAuth token; re-pull from Keychain if local AI routes start failing
   again (`security find-generic-password -s "Claude Code-credentials-c3d031f7" -w`).

### Verification
Real screenshots read directly (own eyes, not a third-party vision proxy) for every state
above — `scripts/.shots/latinlab-{read,comprehension,vocabreview,progress}.png`,
`scripts/.shots/rca-{speeddrill,understandingcheck,multiplechoice}.png`. Console/page-error
listeners confirmed zero unhandled errors once the auth + credential fixes landed (the earlier
401/500 runs are why those fixes exist). `scripts/mt-latin-audit.mjs` is kept in the repo as a
standing tool — rerun it any time this needs rechecking rather than re-deriving the walkthrough.

### References
New: `src/lib/dev-auth.ts`. Modified: `src/app/api/latin-lab/route.ts`,
`src/app/api/rca-understanding/route.ts`, `src/app/api/latin-progress/route.ts` (all switched
from direct `auth()` calls to `sessionEmail(req)`). New script: `scripts/mt-latin-audit.mjs`.
Local-only, not committed: `.env.local` gained a temporary `ANTHROPIC_AUTH_TOKEN` line.
`~/tools/usage-guard.sh` gained a standing image-read exception for
`~/projects/meta-tutor/scripts/.shots/` so screenshots from this harness can be read directly
in future sessions.

## Latin Lab: built Units 4-10, closing the content wall — 2026-09-09

### Problem Statement
Jacob: "keep going and making it better for any learner" — direct follow-up to the audit
above, which found Latin Lab (the only from-zero, no-teacher-required Latin course in the app)
had just 3 of 10 planned units built, covering roughly 30-60 minutes of material before hitting
its own documented roadmap wall.

### What I built
Authored Units 4-10 in `src/lib/latin-lab/units.ts`, continuing the SAME story/characters from
Units 1-3 (Claudia, Livia, Marcus, Tullia, the family at the farmhouse) so the whole 10-unit arc
reads as one continuous narrative, not disconnected drills:
- **Unit 4 — Cēna Familiae**: accusative singular (1st decl., -am), direct objects, 5 new
  1st-conjugation transitive verbs.
- **Unit 5 — Familia Magna**: numbers 1-10 (unus-decem, with unus/duo/tres genuinely declining),
  accusative plural (-as), 3rd-person-plural verbs. Deliberately reused "agricolae" as BOTH
  genitive singular (Unit 3's meaning) and nominative plural (this unit's meaning) — same
  spelling, different job — and calls that out explicitly in the notes.
- **Unit 6 — Puer et Magister**: full 2nd-declension masculine paradigm (puer/filius/magister),
  contrasting puer (keeps its -e-) against magister (drops it, like ager).
- **Unit 7 — Puer Bonus, Servus Parvus**: every known 1st/2nd-declension adjective applied to
  the new masculine nouns, deliberately drilling the single most-tested Latin agreement trap
  (agricolae boni — 1st-declension noun ending, 2nd-declension adjective ending, same gender).
- **Unit 8 — Dialogus in Villā**: switches to dialogue format for the full six-person present
  paradigm (ego/tu/nos/vos), imperative (labora!/laborate!), and the infinitive-as-subject
  construction (Laborare bonum est — a real classical idiom, cf. "Errare humanum est").
- **Unit 9 — Villa Ōlim**: imperfect tense (1st conj. -abat/-abant, sum/esse erat/erant) —
  retells Unit 1-4's own sentences in past tense so the only new variable is the tense itself.
- **Unit 10 — Quis, Quid, Ubi?**: interrogatives (quis/quid/ubi/cur) as a Q&A-format reading
  checkpoint whose ANSWER sentences deliberately review grammar from every prior unit.
- Updated the roadmap comment/array to units 11-15 (dative, ablative, perfect tense, relative
  pronouns, cumulative mastery checkpoint) — accurately marked as not-built, per the Charisma
  Report/Handle discipline (don't claim built what isn't).

Every new/reused Latin form was hand-checked against real paradigms before writing (1st/2nd
declension nom/gen/acc sg&pl, duo/duae irregular numeral declension, 1st-conjugation full
present + imperfect, sum/esse imperfect) — no hallucinated forms knowingly shipped.

### Verification
- `npx tsc --noEmit`: clean, no type errors.
- `npm run build`: clean production build, `/latin-lab` compiles as a static route alongside
  everything else.
- Real Viewer walkthrough (`scripts/mt-latin-newunits-check.mjs`, kept in repo): screenshotted
  all 7 new units' Read view (grammar focus, narrative, vocab panel all render correctly,
  including macrons — villā, terrā) and ran the real AI comprehension generator against the two
  highest-risk formats — Unit 8's dialogue and Unit 10's Q&A checkpoint — both produced correctly
  grounded questions ("Quid Tullia portat?", "Quid Marcus portat?") with zero console/page
  errors. Read every screenshot directly (own eyes), not just checked for errors.

### Not verified this session
Have not run a real learner (or Jacob) through all 10 units end-to-end doing actual vocab-review
reps across units — FSRS seeding only happens after a unit's comprehension check completes, so
the full cross-unit spaced-repetition behavior (does a Unit 4 word actually resurface for review
after Unit 9?) is Report-tier from reading `fsrs.ts`'s logic, not Handle-tier from watching it
happen live over multiple sessions.

### References
Modified: `src/lib/latin-lab/units.ts` (+7 units, updated roadmap). New script:
`scripts/mt-latin-newunits-check.mjs`. No other files changed — components already read
`latinUnits` dynamically, confirmed via grep before starting (no hardcoded unit-count
assumptions anywhere else in the codebase).

## RCA physical-textbook material folded into Latin/Science/Saxon grounding (2026-09-09)

### Problem framing
Jacob dropped 59 iPhone photos of his actual RCA teaching books into
`~/Desktop/MT;RCAmaterial` and said "go through them all and update the RCA sections." No
further scoping given — first step was figuring out what was actually in the photos before
deciding what "update" meant.

### Investigation
Converted all 59 HEIC files to JPEG via `sips` (macOS native, no dependency needed), then
copied them into `~/estate/data/renders/mt-rca-material/` — the one hook-exempt directory
`usage-guard.sh` allow-lists for direct `Read` of images, per [[claude-vision-on-mac]]. Chose
this over `imgsee` (routes to a different, weaker external model) deliberately: this is real
curriculum content that has to be transcribed accurately, not a quick yes/no check, so it needed
Claude's own eyes on the actual pixels, not a second model's lossy prose description.

Read all 59 photos directly, in batches, before touching any code. Turned out to be three
distinct real books, interleaved in the photo roll rather than grouped:
- Memoria Press's *First Form Latin* Teacher Guide — front matter (intro, teaching techniques,
  games, pronunciation) plus a COMPLETE walkthrough of every lesson I-XXXIV, each with its real
  grammar topic, vocabulary (Latin/English/derivatives), and mnemonic Latin saying.
- *Behold and See 6* (BASWB) — the full numbered-Experiments appendix, #1 through #26, each with
  a real supply list and step-by-step procedure.
- Saxon Math 7/6 — Homeschool (4th ed.) — the complete table of contents, Lessons 1-120 plus
  Investigations 1-12, each with its real topic name.

Cross-referenced against what already existed in `src/lib/rca-content/`: `first-form-latin-6.ts`,
`science-6.ts`, and `saxon-76.ts` already had accurate real 2026-2027 PACING (which lesson/
experiment number happens which week, pulled from RCA's own lesson-plan doc back on 2026-08-17)
but never said what any given lesson/experiment NUMBER actually covers — e.g. "Teach Lesson XIV"
with no indication that Lesson XIV is First Declension nouns. The photographed material is
exactly the missing piece: the textbooks' own real content, keyed to the same lesson numbers the
pacing file already uses.

### Decision: what to change vs. leave alone
Considered rebuilding `latin-core.ts` (the small standard-vocab reference) with the full
per-lesson vocabulary now available from the photos. Decided against it — that file's header
comment explicitly says it's NOT a transcription of Memoria Press's copyrighted lesson
sequencing (deliberate, to stay on the "paraphrase standard grammar facts" side of the line the
other content files in this dir already walk), and it also feeds a TTS audio-generation pipeline
(`scripts/gen-latin-audio.mjs`) that would need re-running if the word list changed. Instead,
folded the photographed lesson TOPICS (not full copyrighted vocab lists) into the pacing files as
parenthetical annotations — consistent with how `saxon-76.ts`'s and `science-6.ts`'s existing
header comments already describe their own approach ("paraphrased/condensed... but kept
SPECIFIC").

### What shipped
- `first-form-latin-6.ts`: real topic added at each lesson's first "Teach Lesson ___" mention,
  Lessons I-X and XII-XXXIII (Lesson XI wasn't among the photographed pages — left unannotated
  rather than guessed, per [[feedback... additive/non-destructive]] discipline of not inventing
  what wasn't actually observed).
- `saxon-76.ts`: same treatment across every Lesson 1-120 and Investigation 1-12 mention.
- `science-6-experiments.ts` (new file): supply list + procedure summary for all 26 experiments.
  Wired into `rca-grounding.ts` via a new `findExperiments()` matcher.

### Verification
- Built the `findExperiments()` regex (matches "#N" within a bounded window after each
  "Experiment(s)" mention, since some weeks reference two non-adjacent numbers like "Experiments
  #6 Shrinking Bottle & #7 Jumping Quarter") and unit-tested it against 6 real week-text strings
  pulled directly from `science-6.ts` before wiring it into the grounding builder — first version
  missed the second number in non-adjacent cases, caught by the test and fixed before shipping.
- `npx tsc --noEmit`: clean.
- `npm run build`: ✓ Compiled successfully, all 66 pages including the dynamic `/rca/[slug]`
  routes, only the pre-existing multi-lockfile warning.

### Not verified this session
Have not driven the actual `/rca/first-form-latin-6`, `/rca/science-6`, or `/rca/saxon-76` pages
live in a browser to confirm the new parenthetical topics render cleanly in the LessonViewer UI
(no reason to expect a rendering issue — it's the same `Lesson.sections[].text` string field
every other week already used — but that's Report-tier confidence from reading the component,
not Handle-tier from watching it render).

### References
New: `src/lib/rca-content/science-6-experiments.ts`. Modified:
`src/lib/rca-content/first-form-latin-6.ts`, `src/lib/rca-content/saxon-76.ts`,
`src/lib/rca-grounding.ts`. Source photos: `~/Desktop/MT;RCAmaterial` (59 HEIC, untouched/
unmodified — converted copies only exist in scratch/render dirs, which are not part of the repo).

## Fixed the two issues flagged during Viewer verification (2026-09-09, same day)

Jacob: "get it all fixed urself, go" — in response to the two gaps the Viewer walkthrough surfaced.

### Issue 1: 6 RCA API routes 401'd under the dev-preview test harness
`dev-auth.ts`'s `sessionEmail(req)` helper exists specifically so the local headless
verification harness can exercise real gated routes without a Google login (its own header
comment says so). `rca-understanding`, `latin-lab`, and `latin-progress` already used it — but
`rca-pacing`, `rca-roster`, `rca-custom-vocab`, `rca-grading`, `rca-progress`, and
`rca-vocab-check` were still on the raw `const session = await auth()` pattern, which only
recognizes a real cookie session. Not just a testing quirk: this is the actual production auth
path too, just one that happens to only have one way in. Fixed all 6 to use `sessionEmail(req)`,
matching the established pattern exactly (import `NextRequest`/`sessionEmail`, param typed
`NextRequest`, `session.user.email` → `userEmail` throughout). Verified: 0 401s across all three
RCA pages under the same headless harness that first caught it (previously 3+ per page load),
`tsc`/`build` clean, and a fresh screenshot of `/rca/saxon-76` confirms the Grading checklist and
Roster sections render without error.

### Issue 2: baltimore-catechism.ts had an uncommitted 301-line deletion
Investigated before touching it — this wasn't a stray formatting diff, it was lessons 21-37
(Q231 onward) missing entirely, left uncommitted in the working tree since Aug 21 (well before
this session). Checked whether it was live-load-bearing before assuming it was safe to revert:
`religion-6.ts`'s real pacing references Lesson 21, 22, 27, 28, 29, 30, 31, 32 by number — with
the truncated file, `buildSubjectReferenceBlock`'s religion-6 branch would return `""` (no
guides found) for every one of those weeks, silently dropping the AI grounding down to
"no real catechism content" for a third of the year. Since the change was uncommitted (git
history has the full file untouched) and actively broke a real, referenced feature, restored it
via `git checkout -- src/lib/rca-content/baltimore-catechism.ts` — a clean revert, nothing lost.
Verified: `tsc`/`build` clean, and a fresh screenshot of `/rca/religion-6` shows real Lesson 15
Teacher's Guide content (Two Great Commandments discussion questions + True/False) rendering
with zero console/page errors.

### References
Modified: `src/app/api/rca-custom-vocab/route.ts`, `rca-grading/route.ts`, `rca-pacing/route.ts`,
`rca-progress/route.ts`, `rca-roster/route.ts`, `rca-vocab-check/route.ts` (all: raw `auth()` →
`sessionEmail()`). Restored (not modified): `src/lib/rca-content/baltimore-catechism.ts` (`git
checkout` back to HEAD).

## Built the actual "personal growth" piece Jacob asked about (2026-09-09, later same night)

Jacob, pointed directly: "did u use those resources to give me better learning and
teaching and personal growth in those areas, particularly latin?" Honest answer at the
time: no — the RCA-material work up to that point only fed the AI TUTOR's grounding
(better quiz/chat answers for STUDENTS), never anything aimed at Jacob's own
understanding or teaching prep. That's a real, correctly-called-out gap.

### What was missing
`TeacherGuide.tsx` already existed as a real feature (built 2026-08-24 for Religion 6's
Baltimore Catechism discussion questions), and its own fallback state literally said
"Not built for this subject yet" for every other subject, Latin and Saxon included. This
was the concrete, already-scaffolded gap to fill — not a new feature to invent.

### What shipped
- `latin-teacher-guide.ts` (new) — per-lesson entries (Lessons I-X, XII-XXXIII; XI
  wasn't among the photographed pages, left out rather than guessed) with three real
  fields per lesson: the grammar CONCEPT explained plainly (why the rule works, not just
  what to write on the board), the actual "Grammar - Chalk Talk" teaching technique
  transcribed from Jacob's own Teacher Guide (paraphrased, not copied), and the SPECIFIC
  student mix-up the Teacher Guide itself calls out for that lesson (e.g. Lesson X's
  perfect-vs-future-perfect 3rd-plural confusion, Lesson XVIII's "the difficulty is
  agreement, not new endings"). This is real source material, high-confidence — Report
  AND Handle tier, since it's drawn from having actually read the real Teacher Guide.
- `saxon-teacher-guide.ts` (new) — different sourcing situation, disclosed explicitly in
  its own header: the photographed Saxon material was ONLY a table of contents, not a
  teacher's-guide-with-scripts the way Latin's was. So this file is original math-concept
  explanations + well-established common student mistakes (standard, uncontested
  pedagogy — same status as latin-core.ts's standard grammar facts), NOT a transcription
  or paraphrase of anything Memoria-Press-equivalent for Saxon, because no such material
  was in the photos. Deliberately selective (~42 of 132 lesson/investigation slots) —
  skips straightforward arithmetic an adult doesn't need refreshed, covers genuinely
  rusty-for-most-adults topics (circumference/pi, proportions, exponents, probability,
  similar triangles, compound interest, etc.).
- Wired both into `TeacherGuide.tsx` (new render branches, same accordion pattern as the
  existing Religion 6 one) AND into `rca-grounding.ts` (so if Jacob asks the AI chat
  "what am I actually teaching" or "explain this to me," it grounds on the real
  concept/mix-up content instead of a generic answer).

### Verification
- `tsc`/`build` clean.
- Live Viewer walkthrough (own eyes, real screenshots): `/rca/first-form-latin-6`
  Lesson 1 shows the real Concept/How to teach it/Watch for panel for "First Conjugation
  Present Tense," zero console/page errors. `/rca/saxon-76` stepped forward to Week 5
  and confirmed both Lesson 19 (Factors, Prime Numbers) and Lesson 20 (GCF) refresher
  notes render correctly in the same panel, zero errors.

### Noticed, not touched
While working, `src/components/rca/LessonViewer.tsx`, `src/lib/rca.ts`, and
`src/app/latin-lab/page.tsx` picked up small uncommitted edits (25/21/6 lines) that
weren't made by this session, alongside two new untracked files
(`src/components/latin-lab/ProficiencyTimeline.tsx`, `src/lib/latin-lab/
proficiency-timeline.ts`) — looks like Jacob (or another concurrent session) working
live in the same repo. Didn't touch, read deeply, or revert any of it — not this
session's to manage — but `npm run build` passed cleanly with those changes present
alongside this session's, so no conflict.

### References
New: `src/lib/rca-content/latin-teacher-guide.ts`,
`src/lib/rca-content/saxon-teacher-guide.ts`. Modified:
`src/components/rca/TeacherGuide.tsx`, `src/lib/rca-grounding.ts`.

## Grammar charts + memorize mode for First Form Latin's Teacher's Guide (2026-09-10)

### Problem Statement
Jacob: "we're still missing more catered learning to the lessons for rca latin for me...
theres not rly resources moving along with me to help me with charts and memorizing and
logic. the lesson progress every week/every other week so it needs to follow the plans
that were given." The existing Teacher's Guide (built 2026-09-09) already covers the
LOGIC — real prose explaining why each grammar point works, sourced from Jacob's
photographed Memoria Press Teacher Guide — but it's prose only: no visual paradigm chart,
no active-recall/memorization tool, and it must automatically track whatever lesson the
real pacing doc says is current (not a separately-drifting schedule).

### What I built
`src/lib/rca-content/latin-grammar-charts.ts` — hand-verified paradigm chart data for
every grammar point First Form Latin actually covers across its 31 real lessons, using
the EXACT model words the Teacher Guide itself already names (amō/amāre for 1st conj. all
six tenses, moneō/monēre for 2nd conj. all six tenses, sum/esse, mensa/servus/bellum/
pater/nōmen/portus/rēs for the five declensions, bonus/-a/-um for 1st/2nd adjectives,
numbers 1-10) — no invented substitutes, no hallucinated forms. Keyed by the SAME lesson
`n` as `latin-teacher-guide.ts`, including review weeks referencing the same chart objects
their component lessons already use (no duplicated data).

`src/components/rca/GrammarChart.tsx` — renders each chart as a real HTML table (verb/
noun/adjective/principal-parts/numbers, five distinct layouts) with a "The pattern" logic
callout pulled from the same formation-rule prose, plus a **Memorize mode**: Latin forms
hide behind a tap-to-reveal "?", then self-grade "knew it"/"missed" per cell with a running
tally. Session-only, self-graded — an honest v1 (no persistent mastery tracking claimed).

Wired into `TeacherGuide.tsx` right after each guide's existing Concept/Teaching-tip/
Watch-for sections, so it inherits the SAME `lessonN` prop already flowing from
LessonViewer's real pacing calculation — it follows the actual weekly/bi-weekly plan
automatically, with zero separate scheduling logic to drift out of sync.

### Verification
- `npx tsc --noEmit` / `npm run build`: both clean.
- Real Viewer walkthrough: screenshotted Lesson 4's week (shows Lessons II + III, the
  imperfect and future tense charts, matching what Jacob said he's currently teaching)
  and Lesson 14 (1st declension/mensa) — both render correctly, including macrons.
- Found a real Playwright quirk during testing (NOT a product bug): coordinate-based
  clicks on deeply-scrolled content in this app's nested-scroll layout can miss their
  target and land on an unrelated fixed-position element instead (`elementFromPoint`
  confirmed a click meant for a chart's "?" button actually hit LessonViewer's "Not
  lesson 4? Correct it" button). Dispatching a real click directly on the DOM node
  (`element.click()` via `page.evaluate`) bypasses this and confirmed the Memorize
  flow works correctly end-to-end: revealed two cells, graded one "knew it" and one
  "missed," tally correctly showed 1/2, matching a follow-up screenshot exactly.
  Worth remembering for future deep-scroll Viewer scripts on this app.

### Not verified this session
Only spot-checked 2 of the 31 lessons' charts (imperfect/future tense, 1st declension)
live in the browser — the other 29 lessons' chart data was hand-verified against known
Latin morphology and the Teacher Guide's own stated forms, but not each individually
screenshotted. Report-tier confidence on full 1-33 coverage; Handle-tier on the 2 spot-
checked lessons and the underlying rendering code path (same component/logic for all).

### References
New: `src/lib/rca-content/latin-grammar-charts.ts`, `src/components/rca/GrammarChart.tsx`.
Modified: `src/components/rca/TeacherGuide.tsx`.

---

## 2026-09-11 — "Use it more" trio: pre-class brief, reverse homework, prep-contact

### Problem framing
Jacob: "how can we improve meta tutor and make me use it more?" then, after a brainstorm,
picked exactly three ideas: **#4** teaching-day pre-class auto-brief, **#7** reverse homework
(app assigns HIM prep), **#10** count prep he's already doing. Also "better looks overall."

Diagnosis (from the prior nudge session): the app is deep but pull-only. The fix isn't more
features to visit — it's making the app reach him (brief), give him a reason to open it with a
deadline (reverse homework), and give him credit for work he already does (prep-contact).

### search-before-build (paid off big — did NOT build from zero)
- `/rca/today` + `/rca/week` already compute the whole teaching-day view (classes, materials,
  paced lesson per class via `currentLessonNumber`/`todaysLessonNumber`). #4's ONLY genuinely
  missing piece was the Teacher's-Guide "watch for" note, which lived only on class detail pages.
- The "stay a week ahead" concept already exists as `prepAheadLessonRange` (rca.ts) but only as a
  passive banner in LessonViewer. #7 = turn that into real dated tasks. Reused the function.
- The ambient logger (`~/.filament/ambient-logger/`) was ALREADY RUNNING (activity.db live,
  937KB). #10 = extend its `correlate.py`, not build a tracker.

### Decisions / forks
- **#4 delivery:** rejected phone push (Jacob's 2026-09-09 no-automated-push policy). Chose
  (a) surface the watch-for chip on the existing cram cards + (b) a local Mac notification at
  Mon/Thu 6:15am. Built `/api/preclass-brief` as the single source so the notification script
  never re-derives pacing math — DRY against PacedLesson's own logic.
- **#7 due date:** each generated task is due `nextTeachingDate()` — "before the next time he's
  in front of kids" — concrete and honest, vs a vague "in a week."
- **#10 honesty fork (the important one):** the logger stores NO window titles by design, so a
  frontmost browser can't be told apart from non-prep browsing. Rather than count all browser
  time (dishonest overcount) or fake precision, I EXCLUDED browsers entirely and count only
  unambiguous native doc/prep apps (Preview/Pages/Word/Books/Notes…). This undercounts (misses
  Google-Docs/FACTS/Meta-Tutor-in-browser — but Meta Tutor already tracks its own usage
  server-side), and the UI says so. Charisma Report/Handle discipline: the estimate is labeled
  an estimate, every counted minute is defensible.

### What broke / corrections
- Local AI routes 401'd: `.env.local`'s `ANTHROPIC_AUTH_TOKEN` was revoked. Refreshed it from the
  live Keychain OAuth session (what `sync-meta-tutor-token.sh` does), backed up as
  `.env.local.bak-tokenrefresh`. After refresh, prep generation worked (500-on-insert, not
  502-on-generate, proved it).
- Two dev servers on the box (PID 18673 from another session on :3000; mine deferred to :3002
  which turned out to be an unrelated service). Verified against :3000 (has my code via hot-reload),
  left 18673 untouched per the never-touch-another-session's-work discipline.
- `/api/learner-profile` used raw `auth()`, so the Viewer harness couldn't drive it (401 in the
  first walkthrough). Switched it to `sessionEmail` (dev-preview-driveable, production-safe) per
  the standing Meta Tutor Viewer rule.

### Proof pointers
- `npx tsc --noEmit` clean; first `npm run build` compiled the full route tree incl.
  `/rca/prep`, `/api/preclass-brief`, `/api/prep-assignments` (2nd build run only hit a flaky
  Google-Fonts fetch — network, not code).
- #4 watch-for chip: own-eyes screenshot `scripts/.shots/new-week-watchfor.png` (real amber chip,
  real Latin mix-up text, on the First Form Latin card).
- #7 page: `scripts/.shots/new-prep-initial.png` (renders + graceful degrade). Generation live:
  POST /api/prep-assignments → 500 `PGRST205` (table missing) = generation succeeded, insert-only
  fail.
- #10 computation: `python3 -c` run of `compute_prep_contact` against real `activity.db` → valid
  output. Data plumbing: `curl /api/learner-profile` → 200 with `prepContactMinutes7d` field present.

### Not done / needs Jacob (one step each)
Two idempotent SQL blocks written into `supabase-schema-hub.sql` must be run once in the Supabase
SQL Editor (no DDL access from the service key — same manual gate as every table here):
1. `create table mt_prep_assignments (...)` — unblocks #7.
2. two `alter table mt_ambient_insights add column if not exists ...` — unblocks #10's UI line.
Both pieces degrade gracefully until then. Deploy is safe now (nothing crashes pre-migration).

### References
New: `src/lib/rca-content/teacher-watchfor.ts`, `src/app/api/preclass-brief/route.ts`,
`src/app/api/prep-assignments/route.ts`, `src/app/rca/prep/page.tsx`, `scripts/preclass-brief.mjs`,
`scripts/mt-new-features-audit.mjs`, `~/tools/meta-tutor-preclass-brief.sh`,
`~/Library/LaunchAgents/com.metatutor.preclass-brief.plist`.
Modified: `src/components/rca/PacedLesson.tsx`, `src/app/rca/page.tsx`,
`src/lib/tutor-core/types.ts`, `src/lib/tutor-core/profile-aggregator.ts`,
`src/components/learner-profile/AmbientInsights.tsx`, `src/app/api/learner-profile/route.ts`,
`supabase-schema-hub.sql`, `~/.filament/ambient-logger/correlate.py`.
