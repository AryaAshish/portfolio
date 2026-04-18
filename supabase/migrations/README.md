# Supabase migrations

This folder is the source of truth for every schema change applied to the two Supabase projects backing this repo.

```
supabase/migrations/
├── portfolio/           # musafir.codes portfolio (NEXT_PUBLIC_SUPABASE_URL)
│   └── 0000_init.sql
├── fittrack/            # owner-only FitTrack (FITTRACK_SUPABASE_URL)
│   └── 0000_init.sql
└── fittrack-public/     # multi-user FitTrack (NEXT_PUBLIC_FITTRACK_PUBLIC_SUPABASE_URL)
    └── 0000_init.sql
```

## Policy

Read `fittrack/MIGRATIONS.md` first — it holds the full policy (additive-only, deprecation windows, jsonb `schema_version`).

The short version:

- Every schema change lands here **before** it is applied to any Supabase project.
- Migrations are additive. New columns must be nullable or defaulted. New tables are fine. Never rename or drop in a single release.
- Destructive changes use a ≥2-release deprecation window: add new → dual-write → backfill → cut reads → drop old.
- Migration files are never edited once applied. If you got something wrong, write a new file that corrects it.

## Adding a migration

1. Write a new file under `portfolio/`, `fittrack/`, or `fittrack-public/` with a `YYYYMMDDHHMM_short_description.sql` prefix, for example `202604190900_add_owner_id_to_meals.sql`.
2. Wrap DDL in `IF NOT EXISTS` / `IF EXISTS` so the file is idempotent.
3. Open a PR with the migration and the code that consumes it in the same change.
4. Once merged, apply it to the target project. Two options:
   - Supabase MCP `apply_migration` (FitTrack and FitTrack-Public — both are configured).
   - `psql "$PORTFOLIO_DB_URL" -f supabase/migrations/portfolio/<file>.sql` for portfolio, using the connection string from 1Password.

## Rebuilding a project from scratch

```bash
psql "$PORTFOLIO_DB_URL" -f supabase/migrations/portfolio/0000_init.sql
# then apply every file after 0000_init.sql in lexicographic order

psql "$FITTRACK_DB_URL" -f supabase/migrations/fittrack/0000_init.sql
# same — apply every subsequent file in lexicographic order

psql "$FITTRACK_PUBLIC_DB_URL" -f supabase/migrations/fittrack-public/0000_init.sql
# same — multi-user schema with RLS enabled
```

`0000_init.sql` for `portfolio/` and `fittrack/` is idempotent (`CREATE TABLE IF NOT EXISTS`). The `fittrack-public/` baseline uses `CREATE POLICY` without `IF NOT EXISTS`, so re-running it on a database that already has the policies will fail. To re-apply, drop existing policies first or use `apply_migration` which handles this.
