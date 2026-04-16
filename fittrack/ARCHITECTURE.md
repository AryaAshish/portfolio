# FitTrack — Architecture & Build Plan

## What This Is

FitTrack is a personal fitness visualization PWA for Ashish.

**V1 (shipped):** Claude.ai + Supabase MCP = persistent AI coach that reads/writes fitness data via conversation. Works on iPhone and Mac. No code.

**V2 (this):** A visualization layer on the same Supabase instance. Structured logging (Motra paste, meal library/templates), charts, calendar. Claude.ai handles coaching. This app handles data entry + visualization.

---

## Architecture

### Monorepo placement
FitTrack lives inside the portfolio repo as a **Next.js route group** — not a separate app.

```
portfolio/
├── app/
│   └── (fittrack)/          ← route group, own layout + design
│       ├── layout.tsx
│       ├── page.tsx          → /fittrack
│       ├── calendar/         → /fittrack/calendar
│       ├── progress/         → /fittrack/progress
│       ├── workouts/         → /fittrack/workouts
│       ├── meals/            → /fittrack/meals
│       └── health/           → /fittrack/health
├── fittrack/
│   └── supabase/
│       ├── schema.sql              ← original schema
│       ├── migration_phase0.sql    ← phase 0 additions
│       └── ARCHITECTURE.md         ← this file
└── package.json              ← shared (no separate package.json)
```

**Why route group not separate app:** Portfolio already has Next.js 14, Tailwind, TypeScript, Supabase client, date-fns. Zero new infrastructure. Ships together automatically on every push.

**Deployment:** Separate Vercel project pointed at the same repo, root directory set to `/`, domain `fit.ashisharyan.dev`. Portfolio links out to it.

### Data flow
```
Motra text paste ──→ /api/fittrack/log-workout ──→ workouts + exercise_logs
Meal template      ──→ /api/fittrack/log-meal   ──→ meals
All reads          ──→ Supabase direct (client-side)
AI coaching        ──→ Claude.ai + MCP (separate, not in this app)
```

---

## Design System

**Theme:** Light (matches the 3-month plan HTML artifact)

| Token | Value |
|-------|-------|
| Background | `#f7f7f5` |
| Card | `#ffffff` |
| Border | `#e8e8e4` |
| Text primary | `#1a1a1a` |
| Text muted | `#999999` |

**Fonts:** Space Grotesk (headings) + Inter (body)

**Workout type colour coding:**

| Type | Background | Text |
|------|-----------|------|
| Push | `#dbeafe` | `#1d4ed8` |
| Pull | `#dcfce7` | `#15803d` |
| Legs | `#fef3c7` | `#b45309` |
| Rest | `#f3f4f6` | `#6b7280` |
| Auxiliary | `#f3e8ff` | `#7c3aed` |
| Cardio | `#ffe4e6` | `#be123c` |

**Health status colours:**

| Status | Colour |
|--------|--------|
| critical / high | `#dc2626` |
| borderline / low | `#d97706` |
| normal | `#16a34a` |

---

## Supabase Schema (Live — as of Phase 0)

Project: `xqrbguwakhuvtpajxbqz`
URL: `https://xqrbguwakhuvtpajxbqz.supabase.co`
RLS: disabled (single-user personal app)

### user_profile (1 row)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| name | text | default 'Ashish' |
| age | int | default 27 |
| height_cm | int | default 178 |
| current_weight_kg | numeric | |
| target_weight_kg | numeric | default 72 |
| goal | text | default 'fat_loss' |
| daily_protein_target | int | default 145 |
| daily_calorie_target | int | default 1900 |
| notes | text | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### weight_logs (2 rows)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| date | date UNIQUE | |
| weight_kg | numeric | |
| body_fat_pct | numeric | nullable |
| notes | text | nullable |
| created_at | timestamptz | |

### meals (14 rows)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| date | date | |
| meal_type | text | breakfast/lunch/dinner/snack/pre_workout |
| items | text | free-text description |
| protein_g | numeric | |
| calories | int | |
| carbs_g | numeric | |
| fat_g | numeric | |
| image_url | text | nullable |
| notes | text | nullable |
| created_at | timestamptz | |

### workouts (8 rows)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| date | date | |
| type | text | push/pull/legs/auxiliary/cardio/rest |
| duration_mins | int | |
| volume_kg | numeric | |
| calories_burned | int | |
| exercises | jsonb | nullable — populated by Motra parser |
| notes | text | nullable |
| motra_raw | jsonb | nullable — raw Motra text stored as json |
| created_at | timestamptz | |

### health_markers (9 rows — Apr 11 bloodwork)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| date | date | |
| marker_name | text | ALT, AST, GGT, LDL, etc. |
| value | numeric | |
| unit | text | U/L, mg/dL, ng/dL, etc. |
| status | text | normal/borderline/low/high/critical |
| notes | text | clinical context |
| created_at | timestamptz | |

### daily_summaries (4 rows)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| date | date UNIQUE | |
| summary_text | text | written by Claude.ai |
| total_protein_g | numeric | |
| total_calories | int | |
| workout_done | boolean | default false |
| workout_type | text | |
| weight_kg | numeric | |
| created_at | timestamptz | |

### food_library (86 rows)
> Note: table is named `food_library`, not `meal_library`. Created by Claude.ai via MCP.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| name | text UNIQUE | |
| serving_size_g | int | base serving size in grams |
| serving_unit | text | g, ml, scoop, piece, tbsp, etc. |
| protein_g | numeric | per serving |
| calories | int | per serving |
| carbs_g | numeric | per serving |
| fat_g | numeric | per serving |
| category | text | protein/carbs/vegetable/fat/fruit/dairy/supplement/cooked_dish/other |
| notes | text | |
| created_at | timestamp | |

### meal_templates (15 rows)
> Note: uses JSONB items (not a junction table). Created by Claude.ai via MCP.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| name | text UNIQUE | |
| meal_type | text | breakfast/lunch/dinner/snack/pre_workout |
| items | jsonb | `[{"qty": 70, "food": "Alpino oats", "unit": "g"}, ...]` |
| total_protein_g | numeric | pre-computed |
| total_calories | int | pre-computed |
| total_carbs_g | numeric | pre-computed |
| total_fat_g | numeric | pre-computed |
| notes | text | |
| created_at | timestamp | |

**Template items format:**
```json
[
  { "qty": 70,  "food": "Alpino oats",      "unit": "g"    },
  { "qty": 1,   "food": "MuscleBlaze whey", "unit": "scoop"},
  { "qty": 250, "food": "Amul Taaza milk",  "unit": "ml"   },
  { "qty": 30,  "food": "Walnuts",          "unit": "g"    }
]
```
`food` references `food_library.name` (by name, not ID).

### exercise_logs (0 rows — added Phase 0)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| workout_id | uuid FK → workouts.id | cascade delete |
| date | date | |
| exercise_name | text | e.g. "Smith Machine Bench Press" |
| set_number | int | 1, 2, 3... |
| set_type | text | warmup/working/dropset/cardio |
| reps | int | nullable (null for cardio) |
| weight_kg | numeric | nullable (null for cardio) |
| duration_secs | int | nullable (only for cardio sets) |
| created_at | timestamptz | |

---

## Screens

| Route | Purpose | Primary tables |
|-------|---------|----------------|
| `/fittrack` | Overview — phases, stats, weekly structure | user_profile, weight_logs, workouts, meals |
| `/fittrack/calendar` | Month view — each day colour-coded by workout type, click for detail | workouts, meals |
| `/fittrack/progress` | Charts — weight trend, macro trend, per-exercise progression | weight_logs, meals, exercise_logs |
| `/fittrack/workouts` | Motra paste to log workouts, workout history | workouts, exercise_logs |
| `/fittrack/meals` | Daily meal log, food library browser, template quick-log | meals, food_library, meal_templates |
| `/fittrack/health` | Blood markers, retest countdown, health timeline | health_markers |

---

## Motra Text Format

Motra exports workouts as a share text (not JSON). Parser handles this format:

```
Tuesday Night Full Body Strength with Smith Machine Focus
14 Apr 2026 at 8:39 PM

Duration: 1h 34m
Volume: 4.9K kg
Calories: 533 cal
Exercises: 7

Kettlebell Halo
Warm Up: 11 reps x 10 kg

Smith Machine Bench Press
1: 12 reps x 30 kg
2: 11 reps x 40 kg
3: 11 reps x 40 kg

Smith Machine Shoulder Press
1: 10 reps x 30 kg
Drop Set: 7 reps x 15 kg

Treadmill Walk
1: 05:24

Tracked with Motra.
https://motra.com/share/workout/...
```

**Parser output → exercise_logs rows:**
- `Warm Up: N reps x W kg` → set_type: warmup
- `N: R reps x W kg` → set_type: working, set_number: N
- `Drop Set: R reps x W kg` → set_type: dropset
- `N: MM:SS` → set_type: cardio, duration_secs computed

---

## Build Phases

| Phase | Scope | Status |
|-------|-------|--------|
| 0 | Schema migration — exercise_logs + indexes | ✅ Done |
| 1 | Next.js layout + navigation shell | ✅ Done |
| 2 | Supabase data layer (fittrack-supabase.ts) | ✅ Done |
| 3 | Overview screen | ✅ Done |
| 4 | Calendar screen | ✅ Done |
| 5 | Progress charts | ✅ Done |
| 6 | Motra paste + workout logging | ✅ Done |
| 7 | Meal library + templates | ✅ Done (v1) |
| 8 | Health markers screen | ✅ Done |
| 9 | PWA config + deployment | ✅ Done (manifest + icon) |

Write API: `POST /api/fittrack/log-workout` with `Authorization: Bearer FITTRACK_INGEST_SECRET` (set in Vercel / `.env.local`). Duplicate pastes are allowed unless you add dedupe later.

### Per-phase checklist
Before marking any phase done:
- [ ] `npm run lint` — zero errors
- [ ] `npm run build` — no warnings
- [ ] Manual verify in browser — describe what was tested
- [ ] Committed locally

---

## Key Constraints

- **No auth** — single user app, Supabase RLS disabled
- **No Claude API in this app** — coaching stays in Claude.ai
- **Read + structured write only** — no free-text AI in this interface
- **Mobile-first** — designed for iPhone Safari, installable via PWA manifest
- **Light theme only** — no dark mode toggle
