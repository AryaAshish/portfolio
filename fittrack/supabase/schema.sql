-- ============================================================
-- FitTrack Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- ── User Profile ─────────────────────────────────────────────
create table if not exists user_profile (
  id                   uuid primary key default gen_random_uuid(),
  name                 text not null default 'Ashish',
  age                  int default 27,
  height_cm            int default 178,
  current_weight_kg    decimal(5,2),
  target_weight_kg     decimal(5,2) default 72,
  goal                 text default 'fat_loss',
  daily_protein_target int default 145,
  daily_calorie_target int default 1900,
  notes                text,
  created_at           timestamptz default now(),
  updated_at           timestamptz default now()
);

-- ── Weight Logs ───────────────────────────────────────────────
create table if not exists weight_logs (
  id            uuid primary key default gen_random_uuid(),
  date          date not null unique,
  weight_kg     decimal(5,2) not null,
  body_fat_pct  decimal(4,2),
  notes         text,
  created_at    timestamptz default now()
);

create index if not exists weight_logs_date_idx on weight_logs (date desc);

-- ── Meals ─────────────────────────────────────────────────────
create table if not exists meals (
  id          uuid primary key default gen_random_uuid(),
  date        date not null,
  meal_type   text check (meal_type in ('breakfast','lunch','dinner','snack','pre_workout')),
  items       text not null,
  protein_g   decimal(6,2),
  calories    int,
  carbs_g     decimal(6,2),
  fat_g       decimal(6,2),
  image_url   text,
  notes       text,
  created_at  timestamptz default now()
);

create index if not exists meals_date_idx on meals (date desc);

-- ── Workouts ──────────────────────────────────────────────────
create table if not exists workouts (
  id              uuid primary key default gen_random_uuid(),
  date            date not null,
  type            text check (type in ('push','pull','legs','auxiliary','cardio','rest')),
  duration_mins   int,
  volume_kg       decimal(8,2),
  calories_burned int,
  exercises       jsonb,
  notes           text,
  motra_raw       jsonb,
  created_at      timestamptz default now()
);

create index if not exists workouts_date_idx on workouts (date desc);
create index if not exists workouts_type_idx on workouts (type, date desc);

-- ── Health Markers ────────────────────────────────────────────
create table if not exists health_markers (
  id           uuid primary key default gen_random_uuid(),
  date         date not null,
  marker_name  text not null,
  value        decimal(10,3) not null,
  unit         text not null,
  status       text check (status in ('normal','borderline','low','high','critical')),
  notes        text,
  created_at   timestamptz default now()
);

create index if not exists health_markers_date_idx on health_markers (date desc);
create index if not exists health_markers_name_idx on health_markers (marker_name, date desc);

-- ── Daily Summaries ───────────────────────────────────────────
-- Claude writes a summary each day — useful for quick context retrieval
create table if not exists daily_summaries (
  id               uuid primary key default gen_random_uuid(),
  date             date not null unique,
  summary_text     text,
  total_protein_g  decimal(6,2),
  total_calories   int,
  workout_done     boolean default false,
  workout_type     text,
  weight_kg        decimal(5,2),
  created_at       timestamptz default now()
);

create index if not exists daily_summaries_date_idx on daily_summaries (date desc);


-- ============================================================
-- Seed Data
-- ============================================================

-- ── User Profile ─────────────────────────────────────────────
insert into user_profile (
  name, age, height_cm, current_weight_kg, target_weight_kg,
  goal, daily_protein_target, daily_calorie_target,
  notes
) values (
  'Ashish', 27, 178, 77.2, 72,
  'fat_loss', 145, 1900,
  'PPL + Auxiliary split. Gym at ~8:45pm. Health flags: ALT critical, LDL high, Testosterone low for age.'
);

-- ── Starting Weight ───────────────────────────────────────────
insert into weight_logs (date, weight_kg, notes)
values ('2026-04-15', 77.2, 'Starting weight');

-- ── Bloodwork — Apr 11 2026 ───────────────────────────────────
insert into health_markers (date, marker_name, value, unit, status, notes) values
  ('2026-04-11', 'ALT',               109,    'U/L',             'critical',   'Liver enzyme. Normal <40. Significantly elevated — avoid alcohol, hepatotoxic supplements.'),
  ('2026-04-11', 'AST',               86,     'U/L',             'critical',   'Liver enzyme. Normal <40. Elevated alongside ALT — monitor closely.'),
  ('2026-04-11', 'GGT',               68,     'U/L',             'high',       'Normal <55. Mildly elevated. Related to liver/bile duct stress.'),
  ('2026-04-11', 'LDL',               170.6,  'mg/dL',           'high',       'Bad cholesterol. Optimal <100, borderline 130-159, high 160+. Dietary intervention needed.'),
  ('2026-04-11', 'Total Cholesterol', 246,    'mg/dL',           'high',       'Desirable <200. High. Consistent with elevated LDL.'),
  ('2026-04-11', 'Testosterone',      314,    'ng/dL',           'low',        'Low for age 27. Normal range 400-700 ng/dL. Track with lifestyle changes.'),
  ('2026-04-11', 'TSH',               2.47,   'mIU/L',           'normal',     'Thyroid function normal. Range 0.4-4.0.'),
  ('2026-04-11', 'eGFR',              100,    'mL/min/1.73m²',   'normal',     'Kidney function excellent.'),
  ('2026-04-11', 'Fasting Glucose',   100,    'mg/dL',           'borderline', 'Upper limit of normal (<100 mg/dL). Pre-diabetic threshold is 100-125.');
