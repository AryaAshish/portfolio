-- ============================================================
-- FitTrack Public — multi-user baseline schema
-- ============================================================
-- Cloned from supabase/migrations/fittrack/0000_init.sql with
-- these changes for multi-user support:
--
--   1. Every per-user table has user_id uuid NOT NULL FK to auth.users(id)
--      with ON DELETE CASCADE.
--   2. UNIQUE(date) constraints replaced with UNIQUE(user_id, date)
--      where applicable.
--   3. Indexes use (user_id, date DESC) instead of (date DESC).
--   4. RLS enabled on every table with four per-user policies.
--   5. food_library is globally shared: RLS SELECT USING (true)
--      for authenticated users, no write policies (service-role only).
--   6. daily_summaries dropped (unused in the codebase).
--
-- Apply once against a fresh fittrack-public project:
--   psql "$FITTRACK_PUBLIC_DB_URL" -f supabase/migrations/fittrack-public/0000_init.sql
-- ============================================================

-- ── User Profile ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_profile (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name                 text NOT NULL DEFAULT 'User',
  age                  int,
  height_cm            int,
  current_weight_kg    decimal(5,2),
  target_weight_kg     decimal(5,2),
  goal                 text DEFAULT 'fat_loss',
  daily_protein_target int DEFAULT 145,
  daily_calorie_target int DEFAULT 1900,
  notes                text,
  weekly_gym_target    int NOT NULL DEFAULT 3,
  created_at           timestamptz DEFAULT now(),
  updated_at           timestamptz DEFAULT now(),
  UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS user_profile_user_idx ON user_profile (user_id);

ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_profile_select ON user_profile FOR SELECT USING (user_id = auth.uid());
CREATE POLICY user_profile_insert ON user_profile FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY user_profile_update ON user_profile FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY user_profile_delete ON user_profile FOR DELETE USING (user_id = auth.uid());

-- ── Weight Logs ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS weight_logs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date          date NOT NULL,
  weight_kg     decimal(5,2) NOT NULL,
  body_fat_pct  decimal(4,2),
  notes         text,
  created_at    timestamptz DEFAULT now(),
  UNIQUE (user_id, date)
);

CREATE INDEX IF NOT EXISTS weight_logs_user_date_idx ON weight_logs (user_id, date DESC);

ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY weight_logs_select ON weight_logs FOR SELECT USING (user_id = auth.uid());
CREATE POLICY weight_logs_insert ON weight_logs FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY weight_logs_update ON weight_logs FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY weight_logs_delete ON weight_logs FOR DELETE USING (user_id = auth.uid());

-- ── Meals ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS meals (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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

CREATE INDEX IF NOT EXISTS meals_user_date_idx       ON meals (user_id, date DESC);
CREATE INDEX IF NOT EXISTS meals_user_date_macros_idx ON meals (user_id, date DESC, calories, protein_g);

ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY meals_select ON meals FOR SELECT USING (user_id = auth.uid());
CREATE POLICY meals_insert ON meals FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY meals_update ON meals FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY meals_delete ON meals FOR DELETE USING (user_id = auth.uid());

-- ── Workouts ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workouts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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

CREATE INDEX IF NOT EXISTS workouts_user_date_idx      ON workouts (user_id, date DESC);
CREATE INDEX IF NOT EXISTS workouts_user_type_idx      ON workouts (user_id, type, date DESC);
CREATE INDEX IF NOT EXISTS workouts_exercises_gin      ON workouts USING GIN(exercises) WHERE exercises IS NOT NULL;

ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY workouts_select ON workouts FOR SELECT USING (user_id = auth.uid());
CREATE POLICY workouts_insert ON workouts FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY workouts_update ON workouts FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY workouts_delete ON workouts FOR DELETE USING (user_id = auth.uid());

-- ── Health Markers ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS health_markers (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date         date NOT NULL,
  marker_name  text NOT NULL,
  value        decimal(10,3) NOT NULL,
  unit         text NOT NULL,
  status       text CHECK (status IN ('normal','borderline','low','high','critical')),
  notes        text,
  created_at   timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS health_markers_user_date_idx ON health_markers (user_id, date DESC);
CREATE INDEX IF NOT EXISTS health_markers_user_name_idx ON health_markers (user_id, marker_name, date DESC);

ALTER TABLE health_markers ENABLE ROW LEVEL SECURITY;

CREATE POLICY health_markers_select ON health_markers FOR SELECT USING (user_id = auth.uid());
CREATE POLICY health_markers_insert ON health_markers FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY health_markers_update ON health_markers FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY health_markers_delete ON health_markers FOR DELETE USING (user_id = auth.uid());

-- ── Exercise Logs ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exercise_logs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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

CREATE INDEX IF NOT EXISTS exercise_logs_user_name_date_idx ON exercise_logs (user_id, exercise_name, date DESC);
CREATE INDEX IF NOT EXISTS exercise_logs_workout_idx        ON exercise_logs (workout_id);
CREATE INDEX IF NOT EXISTS exercise_logs_user_date_idx      ON exercise_logs (user_id, date DESC);

ALTER TABLE exercise_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY exercise_logs_select ON exercise_logs FOR SELECT USING (user_id = auth.uid());
CREATE POLICY exercise_logs_insert ON exercise_logs FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY exercise_logs_update ON exercise_logs FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY exercise_logs_delete ON exercise_logs FOR DELETE USING (user_id = auth.uid());

-- ── Meal Templates (per-user) ────────────────────────────────
CREATE TABLE IF NOT EXISTS meal_templates (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            text NOT NULL,
  meal_type       text,
  items           jsonb NOT NULL,
  total_protein_g decimal,
  total_calories  int,
  total_carbs_g   decimal,
  total_fat_g     decimal,
  notes           text,
  created_at      timestamp DEFAULT now(),
  UNIQUE (user_id, name)
);

CREATE INDEX IF NOT EXISTS meal_templates_user_idx ON meal_templates (user_id);

ALTER TABLE meal_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY meal_templates_select ON meal_templates FOR SELECT USING (user_id = auth.uid());
CREATE POLICY meal_templates_insert ON meal_templates FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY meal_templates_update ON meal_templates FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY meal_templates_delete ON meal_templates FOR DELETE USING (user_id = auth.uid());

-- ── Plan Phases (per-user) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS plan_phases (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phase_number int NOT NULL,
  name         text NOT NULL,
  start_date   date NOT NULL,
  end_date     date NOT NULL,
  focus        text,
  created_at   timestamptz DEFAULT now(),
  UNIQUE (user_id, phase_number)
);

CREATE INDEX IF NOT EXISTS plan_phases_user_idx ON plan_phases (user_id, phase_number);

ALTER TABLE plan_phases ENABLE ROW LEVEL SECURITY;

CREATE POLICY plan_phases_select ON plan_phases FOR SELECT USING (user_id = auth.uid());
CREATE POLICY plan_phases_insert ON plan_phases FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY plan_phases_update ON plan_phases FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY plan_phases_delete ON plan_phases FOR DELETE USING (user_id = auth.uid());

-- ── Food Library (globally shared, read-only for users) ──────
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

ALTER TABLE food_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY food_library_select ON food_library FOR SELECT TO authenticated USING (true);
