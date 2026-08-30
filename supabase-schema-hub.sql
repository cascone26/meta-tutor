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

-- Added 2026-08-21: lightweight "did I grade this yet" checklist for the real
-- Test/Investigation/Homework Check items already detected from each subject's
-- content (see getGradableItems in rca-upcoming.ts). item_key is stable
-- (subjectId#lessonN#index) so it survives content re-fetches.
create table if not exists mt_rca_grading_checklist (
  user_email text not null,
  item_key text not null,
  done boolean not null default true,
  updated_at timestamptz not null default now(),
  primary key (user_email, item_key)
);

alter table mt_rca_grading_checklist enable row level security;
drop policy if exists "Service role full access" on mt_rca_grading_checklist;
create policy "Service role full access" on mt_rca_grading_checklist for all using (true);

-- Added 2026-08-30: Latin Lab — a standalone, research-based (comprehensible-input /
-- Ørberg-style) Latin course, separate from RCA's First Form Latin 6 curriculum, built
-- as the individualized-adaptive-learning prototype (Jacob-only for now, testbed for
-- the teaching/retention pivot Cristian asked for on the Metaphysics side). Vocab
-- scheduling uses the FSRS algorithm (ts-fsrs) instead of the app's existing SM-2
-- (spaced-repetition.ts) — FSRS models forgetting curves per-item instead of a fixed
-- schedule, which is the whole point of an "adaptive" course. mt_latin_vocab_state
-- stores one FSRS card per learner per vocab item; mt_latin_comprehension logs every
-- comprehension-check answer (question difficulty + grammar tags + correctness) so the
-- app can compute a rolling accuracy and a weak-grammar-concept list from real SQL
-- aggregation — no ML infra, just the queries a single learner's data can actually support.
create table if not exists mt_latin_vocab_state (
  user_email text not null,
  vocab_item text not null,
  unit_id text not null,
  grammar_tags text[] not null default '{}',
  fsrs_state jsonb not null,
  due timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_email, vocab_item)
);

create index if not exists idx_mt_latin_vocab_due on mt_latin_vocab_state(user_email, due);

alter table mt_latin_vocab_state enable row level security;
drop policy if exists "Service role full access" on mt_latin_vocab_state;
create policy "Service role full access" on mt_latin_vocab_state for all using (true);

create table if not exists mt_latin_comprehension (
  id uuid default gen_random_uuid() primary key,
  user_email text not null,
  unit_id text not null,
  question text not null,
  difficulty text not null, -- 'easy' | 'medium' | 'hard'
  grammar_tags text[] not null default '{}',
  correct boolean not null,
  response_ms int,
  created_at timestamptz not null default now()
);

create index if not exists idx_mt_latin_comprehension_user on mt_latin_comprehension(user_email, created_at desc);

alter table mt_latin_comprehension enable row level security;
drop policy if exists "Service role full access" on mt_latin_comprehension;
create policy "Service role full access" on mt_latin_comprehension for all using (true);
