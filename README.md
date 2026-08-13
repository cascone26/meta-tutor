# Meta Tutor

Personal multi-subject learning hub. Live at [meta-tutor.vercel.app](https://meta-tutor.vercel.app).

## Overview

AI-powered study tool with a strict no-cheat constraint on its core study modes -- active recall over passive reading or answer lookup (Socratic questioning, debate mode, glossary quizzing, reading quizzes, concept mapping, and more).

The primary active section is **RCA** (`/rca`) -- Jacob's real 2026-2027 teaching content for Regina Caeli Academy (KSC): 6th grade Saxon Math, LOE Essentials, Classical Language Arts, Religion, History, Science, First Form Latin, Music 3-4, and PE, each with a real lesson-by-lesson viewer, subject-curated practice modes (flashcards, multiple choice, match, timed recall, AI-graded free response), and a floating notes/assistant pair available on every page.

Other sections (`/study`, `/dashboard`, `/metaphysics`, `/riemann`, etc.) are earlier single-subject study tools that predate the RCA build and are lower-traffic today.

## Setup

```bash
npm install
cp .env.example .env.local  # Add Google OAuth + Anthropic API keys
npm run dev
```

### Environment Variables
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` -- Google OAuth
- `ANTHROPIC_API_KEY` -- Claude API
- `CLAUDE_MODEL` -- Model ID (default: claude-haiku-4-5-20251001)
- `NEXTAUTH_SECRET` -- NextAuth session secret
- `NEXTAUTH_URL` -- App URL

## Deployment

Auto-deploys to Vercel from GitHub. Project: `meta-tutor`.

## Tech

Next.js 16, NextAuth (Google OAuth), Anthropic API (Claude Haiku), Tailwind CSS, TypeScript
