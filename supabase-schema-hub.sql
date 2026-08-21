-- Run this in your Supabase SQL Editor (same project as LessonDraft — supabase.com > jqeypwrmsgjsmggdgvgd > SQL Editor)
-- Tables for Meta Tutor's multi-subject hub (Chess, Latin, ...). Prefixed mt_ so they
-- never collide with LessonDraft's tables in the same project. Additive only — does not
-- touch any existing table.

create table if not exists mt_wrong_answers (
  id uuid default gen_random_uuid() primary key,
  user_email text not null,
  subject text not null,
  term text not null,
  definition text,
  category text,
  count int not null default 1,
  last_wrong timestamptz not null default now(),
  modes text[] not null default '{}',
  unique (user_email, subject, term)
);

create index if not exists idx_mt_wrong_answers_user_subject on mt_wrong_answers(user_email, subject);

create table if not exists mt_quiz_history (
  id uuid default gen_random_uuid() primary key,
  user_email text not null,
  subject text not null,
  mode text not null,
  score int not null,
  total int not null,
  percentage int not null,
  weak_terms jsonb not null default '[]',
  weak_categories jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create index if not exists idx_mt_quiz_history_user_subject on mt_quiz_history(user_email, subject, created_at desc);

-- RLS: same pattern as LessonDraft's existing tables — service role (server-side only,
-- via API routes, never exposed to the browser) gets full access.
alter table mt_wrong_answers enable row level security;
alter table mt_quiz_history enable row level security;

drop policy if exists "Service role full access" on mt_wrong_answers;
create policy "Service role full access" on mt_wrong_answers for all using (true);
drop policy if exists "Service role full access" on mt_quiz_history;
create policy "Service role full access" on mt_quiz_history for all using (true);

-- Added 2026-08-13 (sick-him audit): rate-limit.ts was in-memory before this, which
-- reset on every serverless cold start — a different Vercel instance meant a fresh
-- counter, so the 75/day cap didn't actually hold across a real day of traffic.
create table if not exists mt_rate_limit (
  user_key text primary key,
  count int not null default 1,
  reset_at timestamptz not null
);

alter table mt_rate_limit enable row level security;
drop policy if exists "Service role full access" on mt_rate_limit;
create policy "Service role full access" on mt_rate_limit for all using (true);

-- Added 2026-08-21: RCA lesson pacing is pure date math (weeksElapsed from term
-- start) with no way to correct it against reality — a snow day, a lesson running
-- long, or just falling behind silently drifts every subject's "what lesson am I
-- on" estimate for the rest of the year with zero feedback loop. This stores a
-- per-subject offset Jacob can nudge from the app; the offset is added to the raw
-- date-based estimate going forward until he nudges it again.
create table if not exists mt_rca_pacing_override (
  user_email text not null,
  subject_id text not null,
  lesson_offset int not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_email, subject_id)
);

alter table mt_rca_pacing_override enable row level security;
drop policy if exists "Service role full access" on mt_rca_pacing_override;
create policy "Service role full access" on mt_rca_pacing_override for all using (true);
