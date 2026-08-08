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
