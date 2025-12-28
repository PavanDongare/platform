#!/bin/bash
# =============================================================================
# Reset Database from Declarative Schemas
# =============================================================================
#
# This script applies all SQL files from supabase/schemas/ to the database.
# Use this instead of `supabase db reset` since we use declarative schemas
# without migrations.
#
# WHEN TO USE:
#   - Fresh clone of the repo (first-time setup)
#   - After dropping/recreating the database
#   - Setting up a new development environment
#
# USAGE:
#   ./supabase/reset-db.sh
#
# PREREQUISITES:
#   - Supabase must be running: `supabase start`
#   - Docker must be running
#
# NOTE: This does NOT drop existing tables. If schemas already exist,
#       you'll see harmless "already exists" notices.
#       To start fresh: drop schemas first, then run this script.
#
# =============================================================================

set -e
cd "$(dirname "$0")"

echo "Resetting database from declarative schemas..."
echo ""

# Apply each schema in order
for schema_dir in schemas/01_dms schemas/02_onenote schemas/03_metaflow; do
  for sql_file in "$schema_dir"/*.sql; do
    if [ -f "$sql_file" ]; then
      echo "  Applying: $sql_file"
      docker exec -i supabase_db_platform psql -U postgres < "$sql_file"
    fi
  done
done

echo ""
echo "Done! All schemas applied."
echo ""
echo "If you see permission errors, restart supabase:"
echo "  supabase stop && supabase start"
