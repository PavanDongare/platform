# Supabase Database Setup

This project uses **declarative schemas** as the source of truth for database structure.

## Directory Structure

```
supabase/
├── config.toml          # Supabase configuration
├── reset-db.sh          # Apply schemas to fresh database
└── schemas/
    ├── 01_dms/          # Document Management System
    ├── 02_onenote/      # Notes app
    └── 03_metaflow/     # Ontology platform
```

## First-Time Setup

```bash
# Start Supabase
supabase start

# Apply all schemas
./supabase/reset-db.sh
```

## Making Schema Changes

### 1. Edit the declarative schema

Edit the relevant file in `schemas/`:
```bash
# Example: Add a column to metaflow
vim supabase/schemas/03_metaflow/02_tables.sql
```

### 2. Preview the diff (recommended)

See what SQL would be generated:
```bash
supabase db diff
```

### 3. Apply the change

**Option A: Generate and apply migration (official Supabase way)**
```bash
# Generate migration from diff
supabase db diff -f descriptive_name

# Apply the migration
supabase migration up
```

**Option B: Run SQL directly (quick changes)**
```bash
# Run specific ALTER statement
docker exec supabase_db_platform psql -U postgres -c \
  "ALTER TABLE metaflow.objects ADD COLUMN status TEXT;"

# Or re-run the entire schema file (safe - uses IF NOT EXISTS)
docker exec -i supabase_db_platform psql -U postgres \
  < supabase/schemas/03_metaflow/02_tables.sql
```

### 4. Commit the schema change

Always commit the updated declarative schema file, not just the migration.

## Workflow Summary

| Action | Command |
|--------|---------|
| Start Supabase | `supabase start` |
| Stop Supabase | `supabase stop` |
| Fresh setup | `./supabase/reset-db.sh` |
| Preview changes | `supabase db diff` |
| Generate migration | `supabase db diff -f name` |
| Apply migration | `supabase migration up` |
| Direct SQL | `docker exec supabase_db_platform psql -U postgres -c "SQL"` |
| Interactive psql | `docker exec -it supabase_db_platform psql -U postgres` |

## Why Declarative Schemas?

- **Single source of truth**: Schema files define the complete database structure
- **Readable**: Organized by app (dms, onenote, metaflow)
- **Diffable**: `supabase db diff` generates migrations automatically
- **Idempotent**: Uses `IF NOT EXISTS` so re-running is safe

## Official Supabase Docs

- [Local Development](https://supabase.com/docs/guides/local-development)
- [Database Migrations](https://supabase.com/docs/guides/local-development/overview#database-migrations)
- [Declarative Schema](https://supabase.com/docs/guides/local-development/declarative-database-schemas)
