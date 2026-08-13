-- Run this in your Supabase SQL Editor (same project as LessonDraft — supabase.com > jqeypwrmsgjsmggdgvgd > SQL Editor)
-- Tables for Meta Tutor's multi-subject hub (Chess, Latin, ...). Prefixed mt_ so they
-- never collide with LessonDraft's tables in the same project. Additive only — does not
-- touch any existing table.

create table mt_wrong_answers (
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

create index idx_mt_wrong_answers_user_subject on mt_wrong_answers(user_email, subject);

create table mt_quiz_history (
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

create index idx_mt_quiz_history_user_subject on mt_quiz_history(user_email, subject, created_at desc);

-- RLS: same pattern as LessonDraft's existing tables — service role (server-side only,
-- via API routes, never exposed to the browser) gets full access.
alter table mt_wrong_answers enable row level security;
alter table mt_quiz_history enable row level security;

create policy "Service role full access" on mt_wrong_answers for all using (true);
create policy "Service role full access" on mt_quiz_history for all using (true);

-- Added 2026-08-13 (sick-him audit): rate-limit.ts was in-memory before this, which
-- reset on every serverless cold start — a different Vercel instance meant a fresh
-- counter, so the 75/day cap didn't actually hold across a real day of traffic.
create table mt_rate_limit (
  user_key text primary key,
  count int not null default 1,
  reset_at timestamptz not null
);

alter table mt_rate_limit enable row level security;
create policy "Service role full access" on mt_rate_limit for all using (true);
