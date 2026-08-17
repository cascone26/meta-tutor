-- Trivia station Supabase schema. Run in the Supabase SQL Editor after pulling the main meta-tutor schema.
-- Tables prefixed mt_trivia_ so they never collide with other tables in the same project.

create table mt_trivia_progress (
  user_email text primary key,
  total_answered int not null default 0,
  total_correct int not null default 0,
  streak int not null default 0,
  longest_streak int not null default 0,
  last_played_date text,
  level int not null default 1,
  xp int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table mt_trivia_srs_cards (
  id text primary key,
  user_email text not null,
  question text not null,
  answer text not null,
  category text not null,
  explanation text,
  interval int not null default 0,
  repetition int not null default 0,
  ease_factor numeric not null default 2.5,
  next_review text not null,
  last_review text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table mt_trivia_category_stats (
  id uuid default gen_random_uuid() primary key,
  user_email text not null,
  category text not null,
  answered int not null default 0,
  correct int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_email, category)
);

create table mt_trivia_daily_stats (
  id uuid default gen_random_uuid() primary key,
  user_email text not null,
  date text not null,
  answered int not null default 0,
  correct int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_email, date)
);

create table mt_trivia_sessions (
  id uuid default gen_random_uuid() primary key,
  user_email text not null,
  quiz_type text not null,
  category text not null,
  questions_count int not null,
  correct_count int not null,
  created_at timestamptz not null default now()
);

create table mt_trivia_ai_questions (
  id text primary key,
  user_email text not null,
  question text not null,
  answer text not null,
  options text[],
  category text not null,
  difficulty text not null,
  explanation text,
  created_at timestamptz not null default now()
);

create index idx_mt_trivia_progress_user on mt_trivia_progress(user_email);
create index idx_mt_trivia_srs_cards_user on mt_trivia_srs_cards(user_email);
create index idx_mt_trivia_srs_cards_next_review on mt_trivia_srs_cards(next_review);
create index idx_mt_trivia_category_stats_user on mt_trivia_category_stats(user_email, category);
create index idx_mt_trivia_daily_stats_user on mt_trivia_daily_stats(user_email, date);
create index idx_mt_trivia_sessions_user on mt_trivia_sessions(user_email);
create index idx_mt_trivia_ai_questions_user on mt_trivia_ai_questions(user_email);

alter table mt_trivia_progress enable row level security;
alter table mt_trivia_srs_cards enable row level security;
alter table mt_trivia_category_stats enable row level security;
alter table mt_trivia_daily_stats enable row level security;
alter table mt_trivia_sessions enable row level security;
alter table mt_trivia_ai_questions enable row level security;

create policy "Service role full access" on mt_trivia_progress for all using (true);
create policy "Service role full access" on mt_trivia_srs_cards for all using (true);
create policy "Service role full access" on mt_trivia_category_stats for all using (true);
create policy "Service role full access" on mt_trivia_daily_stats for all using (true);
create policy "Service role full access" on mt_trivia_sessions for all using (true);
create policy "Service role full access" on mt_trivia_ai_questions for all using (true);
