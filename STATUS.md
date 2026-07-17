# Meta Tutor — Status

## Last Updated
2026-07-17 (comprehensive audit + fixes)

## Current State
- Live at `https://meta-tutor.vercel.app`
- GitHub: `https://github.com/cascone26/meta-tutor.git`
- Built for Cris's Thomistic Metaphysics course
- Google login required for all routes
- Uses Claude Haiku (via `CLAUDE_MODEL` env var) with rate limiting (75/day) and prompt caching

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
