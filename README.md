# Meta Tutor

Study app for Thomistic Metaphysics, built for Cris. Live at [meta-tutor.vercel.app](https://meta-tutor.vercel.app).

## Overview

AI-powered study tool with a strict no-cheat constraint. All features force active recall -- no passive reading or answer lookup. Includes Socratic questioning, debate mode, glossary quizzing, reading quizzes, concept mapping, and more.

## Setup

```bash
npm install
cp .env.example .env.local  # Add Google OAuth + Anthropic API keys
npm run dev
```

### Environment Variables
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` -- Google OAuth
- `ANTHROPIC_API_KEY` -- Claude API
- `CLAUDE_MODEL` -- Model ID (default: Haiku)
- `NEXTAUTH_SECRET` -- NextAuth session secret
- `NEXTAUTH_URL` -- App URL

## Deployment

Auto-deploys to Vercel from GitHub. Project: `meta-tutor`.

## Tech

Next.js 16, NextAuth (Google OAuth), Anthropic API (Claude Haiku), Tailwind CSS, TypeScript
