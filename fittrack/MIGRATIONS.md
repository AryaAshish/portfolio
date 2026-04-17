# FitTrack migrations policy

This app stores real data. Every schema change has to be backward-compatible with data that is already in the database so a deploy can never brick a meal, a workout log, or a weight entry. The rules below exist to keep that guarantee.

## Where migrations live

All DDL lives in `supabase/migrations/`:

```
supabase/migrations/
├── portfolio/   # portfolio Supabase (blog, content, auth_users)
└── fittrack/    # FitTrack Supabase (workouts, meals, plan_phases, ...)
```

Each folder starts with `0000_init.sql` — a flattened snapshot of everything that was in the project when migrations started being version-controlled. Every change after that lands as its own `YYYYMMDDHHMM_short_description.sql` file.

## Rule 1: additive only

Every migration must satisfy all of:

1. **New columns are nullable or defaulted.** An existing row written before the migration stays readable after it.
2. **New tables are fine.** They can't break old code because old code doesn't query them.
3. **Indexes, constraints, and check clauses that are stricter than before must gate on new data only.** If you need `NOT NULL` on a new column, add a default or backfill in the same transaction.
4. **No renames.** Renaming a column breaks every deploy that's still in the field between the two releases. Add a new column, dual-write, backfill, cut reads, then drop the old column — across separate releases. See Rule 2.
5. **No drops.** Same reasoning as rename.

If a migration needs to be destructive (rename, drop, stricter type), ship it across at least two releases using Rule 2.

## Rule 2: destructive change = deprecation window

1. **Release N:** add the new shape (new column, new table, whatever). Code still reads the old shape but dual-writes into both.
2. **Release N+1:** flip reads to the new shape. Code still writes both.
3. **Release N+2:** drop the old shape. Writes go only to the new shape.

This has to cross at least two deploys so a user on the previous build never hits the removed shape.

## Rule 3: jsonb blobs carry `schema_version`

Columns of type `jsonb` that hold structured data (not free-form blobs) must embed a `schema_version` integer on every row they write. Readers must tolerate missing or older versions — never throw, always fall back to a safe default.

Applied today:

- `meals.components[*].schema_version` — stamped to `1` by `componentFromFood`, `addMealWithComponents`, and `saveMealAsTemplate`. Readers treat missing versions as v0 (backward-compatible with rows written before this policy landed).

When you change the shape of a `jsonb` blob, bump the version and keep the reader capable of parsing every version still present in the database.

## Rule 4: PRs bundle the migration with its consumer

A schema change without the code that uses it is dead weight. A code change without the migration crashes in production. Keep them in one PR so review catches drift.

Check the migration file and its callsites side by side before approving.

## Rule 5: never edit a migration that has already been applied

If you wrote a migration that turned out to be wrong, write a follow-up migration that corrects it. Editing an applied migration means new environments will have a different schema than existing ones, and that drift is the hardest kind of bug to diagnose.

## Applying a migration

Two entry points, depending on which project:

- **FitTrack:** Supabase MCP — `apply_migration` with the migration name and query.
- **Portfolio:** `psql "$PORTFOLIO_DB_URL" -f supabase/migrations/portfolio/<file>.sql`. Credentials live in 1Password under "Supabase portfolio DB".

Both approaches are idempotent against already-applied migrations as long as the file uses `IF NOT EXISTS` / `IF EXISTS` guards.

## Nightly backup

`.github/workflows/fittrack-backup.yml` runs `pg_dump` against both projects every night and uploads the result as a 90-day GitHub artifact. This is the safety net — if a migration ever breaks in a way the policy above failed to prevent, restore the previous night's dump.
