-- ============================================================
-- FitTrack Phase 0 Migration — Minimal
-- Run this in Supabase SQL Editor AFTER schema.sql
--
-- What already exists (created by Claude.ai via MCP):
--   food_library      — 86 items, columns: serving_size_g, serving_unit, category
--   meal_templates    — 15 templates, items stored as jsonb [{qty, food, unit}]
--   meals, workouts, weight_logs, health_markers, user_profile — all seeded
--
-- What this migration adds:
--   exercise_logs     — per-set data from Motra (needed for progression charts)
--   performance indexes on existing tables
-- ============================================================

-- ── Exercise Logs ─────────────────────────────────────────────
-- Populated by the Motra parser. One row per set per exercise.
create table if not exists exercise_logs (
  id            uuid primary key default gen_random_uuid(),
  workout_id    uuid references workouts(id) on delete cascade,
  date          date not null,
  exercise_name text not null,
  set_number    int,
  set_type      text check (set_type in ('warmup','working','dropset','cardio')),
  reps          int,
  weight_kg     decimal(8,2),
  duration_secs int,       -- for cardio sets (e.g. treadmill 05:24 → 324 secs)
  created_at    timestamptz default now()
);

create index if not exists exercise_logs_name_date_idx
  on exercise_logs (exercise_name, date desc);
create index if not exists exercise_logs_workout_idx
  on exercise_logs (workout_id);
create index if not exists exercise_logs_date_idx
  on exercise_logs (date desc);

-- ── Performance indexes on existing tables ────────────────────
create index if not exists meals_date_macros_idx
  on meals (date desc, calories, protein_g);

create index if not exists workouts_date_type_idx
  on workouts (date desc, type);

-- GIN index on workouts.exercises for jsonb queries
create index if not exists workouts_exercises_gin
  on workouts using gin(exercises)
  where exercises is not null;


-- ============================================================
-- Verify
-- ============================================================
-- select count(*) from exercise_logs;  -- expect 0 (empty until Motra import)
-- select count(*) from food_library;   -- expect 86
-- select count(*) from meal_templates; -- expect 15
