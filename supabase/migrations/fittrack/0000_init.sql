-- ============================================================
-- FitTrack Supabase — baseline snapshot
-- ============================================================
-- Reproduces the live schema of the FitTrack project
-- (the one referenced by FITTRACK_SUPABASE_URL).
--
-- Apply once against a fresh database via the Supabase CLI or psql:
--   psql "$FITTRACK_DB_URL" -f supabase/migrations/fittrack/0000_init.sql
--
-- This snapshot flattens the original fittrack/supabase/schema.sql
-- plus these 7 migrations that were applied via Supabase MCP before
-- the repo tracked migrations:
--
--   20260416131441  create_food_library
--   20260416131653  create_meal_templates
--   20260416140014  phase0_exercise_logs
--   20260416154442  add_title_to_workouts
--   20260416205556  add_weekly_gym_target_to_user_profile
--   20260417112311  add_components_to_meals
--   20260417114044  create_plan_phases
--
-- Every future schema change for the FitTrack project lands as
-- a new timestamped file under supabase/migrations/fittrack/.
-- See supabase/migrations/README.md and fittrack/MIGRATIONS.md
-- for the policy.
--
-- RLS stays OFF on every table — single-user app. The anon role
-- has no INSERT/UPDATE/DELETE grants; all writes go through the
-- service-role key held in FITTRACK_SUPABASE_KEY.
-- ============================================================

-- ── User Profile ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_profile (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                 text NOT NULL DEFAULT 'Ashish',
  age                  int DEFAULT 27,
  height_cm            int DEFAULT 178,
  current_weight_kg    decimal(5,2),
  target_weight_kg     decimal(5,2) DEFAULT 72,
  goal                 text DEFAULT 'fat_loss',
  daily_protein_target int DEFAULT 145,
  daily_calorie_target int DEFAULT 1900,
  notes                text,
  weekly_gym_target    int NOT NULL DEFAULT 3,
  created_at           timestamptz DEFAULT now(),
  updated_at           timestamptz DEFAULT now()
);

-- ── Weight Logs ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS weight_logs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date          date NOT NULL UNIQUE,
  weight_kg     decimal(5,2) NOT NULL,
  body_fat_pct  decimal(4,2),
  notes         text,
  created_at    timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS weight_logs_date_idx ON weight_logs (date DESC);

-- ── Meals ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS meals (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date        date NOT NULL,
  meal_type   text CHECK (meal_type IN ('breakfast','lunch','dinner','snack','pre_workout')),
  items       text NOT NULL,
  protein_g   decimal(6,2),
  calories    int,
  carbs_g     decimal(6,2),
  fat_g       decimal(6,2),
  image_url   text,
  notes       text,
  components  jsonb,
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS meals_date_idx        ON meals (date DESC);
CREATE INDEX IF NOT EXISTS meals_date_macros_idx ON meals (date DESC, calories, protein_g);

-- ── Workouts ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workouts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date            date NOT NULL,
  type            text CHECK (type IN ('push','pull','legs','auxiliary','cardio','rest')),
  duration_mins   int,
  volume_kg       decimal(8,2),
  calories_burned int,
  exercises       jsonb,
  notes           text,
  motra_raw       jsonb,
  title           text,
  created_at      timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS workouts_date_idx       ON workouts (date DESC);
CREATE INDEX IF NOT EXISTS workouts_type_idx       ON workouts (type, date DESC);
CREATE INDEX IF NOT EXISTS workouts_date_type_idx  ON workouts (date DESC, type);
CREATE INDEX IF NOT EXISTS workouts_exercises_gin  ON workouts USING GIN(exercises) WHERE exercises IS NOT NULL;

-- ── Health Markers ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS health_markers (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date         date NOT NULL,
  marker_name  text NOT NULL,
  value        decimal(10,3) NOT NULL,
  unit         text NOT NULL,
  status       text CHECK (status IN ('normal','borderline','low','high','critical')),
  notes        text,
  created_at   timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS health_markers_date_idx ON health_markers (date DESC);
CREATE INDEX IF NOT EXISTS health_markers_name_idx ON health_markers (marker_name, date DESC);

-- ── Daily Summaries ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS daily_summaries (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date             date NOT NULL UNIQUE,
  summary_text     text,
  total_protein_g  decimal(6,2),
  total_calories   int,
  workout_done     boolean DEFAULT false,
  workout_type     text,
  weight_kg        decimal(5,2),
  created_at       timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS daily_summaries_date_idx ON daily_summaries (date DESC);

-- ── Food Library ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS food_library (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL UNIQUE,
  serving_size_g  int,
  serving_unit    text,
  protein_g       decimal,
  calories        int,
  carbs_g         decimal,
  fat_g           decimal,
  category        text,
  notes           text,
  created_at      timestamp DEFAULT now()
);

-- ── Meal Templates ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS meal_templates (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL UNIQUE,
  meal_type       text,
  items           jsonb NOT NULL,
  total_protein_g decimal,
  total_calories  int,
  total_carbs_g   decimal,
  total_fat_g     decimal,
  notes           text,
  created_at      timestamp DEFAULT now()
);

-- ── Exercise Logs (per-set data from Motra parser) ───────────
CREATE TABLE IF NOT EXISTS exercise_logs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id    uuid REFERENCES workouts(id) ON DELETE CASCADE,
  date          date NOT NULL,
  exercise_name text NOT NULL,
  set_number    int,
  set_type      text CHECK (set_type IN ('warmup','working','dropset','cardio')),
  reps          int,
  weight_kg     decimal(8,2),
  duration_secs int,
  created_at    timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS exercise_logs_name_date_idx ON exercise_logs (exercise_name, date DESC);
CREATE INDEX IF NOT EXISTS exercise_logs_workout_idx   ON exercise_logs (workout_id);
CREATE INDEX IF NOT EXISTS exercise_logs_date_idx      ON exercise_logs (date DESC);

-- ── Plan Phases ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS plan_phases (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_number int NOT NULL,
  name         text NOT NULL,
  start_date   date NOT NULL,
  end_date     date NOT NULL,
  focus        text,
  created_at   timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS plan_phases_phase_number_key
  ON plan_phases (phase_number);

INSERT INTO plan_phases (phase_number, name, start_date, end_date, focus) VALUES
  (1, 'Foundation',       '2026-04-14', '2026-05-11', 'Caloric deficit, establish training habit, cut body fat'),
  (2, 'Body Composition', '2026-05-12', '2026-06-08', 'Progressive overload, recheck bloodwork at Week 8'),
  (3, 'Peak Condition',   '2026-06-09', '2026-07-06', 'Lean out final 4 weeks, full bloodwork, strength maintenance')
ON CONFLICT (phase_number) DO NOTHING;
