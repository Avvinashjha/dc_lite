# Database Migrations

## Why It Matters

Database schema changes are code changes. Migrations make them repeatable, reviewable, and deployable across developer machines, CI, staging, and production.

## Core Concepts

- A migration is an ordered change to database structure or seed/reference data.
- Migrations are usually tracked in a table so each runs once.
- Forward migrations are more important than perfect down migrations in production.
- Large table changes may need expand-and-contract deployment.
- Data backfills should be batched and observable.

## Flow to Remember

A developer writes a migration, tests it locally, CI runs it against a test database, deployment applies it before or alongside application code, and the migration history records success.

## Syntax and Examples

```js
-- 202606160001_create_tasks.sql
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX tasks_created_at_idx ON tasks (created_at DESC);

-- Later application code can safely query tasks after this migration runs.
```

## Use Cases and Tradeoffs

- Use migrations for tables, columns, indexes, constraints, enums, and reference data.
- Use expand-and-contract when removing or renaming fields used by running application versions.
- Use separate backfill jobs for huge data updates.
- Review migrations for locks, table rewrites, and index build strategy.

## Common Mistakes

- Manually changing production schema without recording it.
- Combining risky data backfills with unrelated schema changes.
- Dropping a column before all deployed code stops reading it.
- Running slow migrations during peak traffic without testing lock impact.

## Practical Challenge

Plan a safe migration to rename `users.full_name` to `users.display_name` while old and new application versions may run during deployment.

## Recap

- Migrations are version control for database shape.
- Deployment order matters.
- Large production changes need compatibility and observability.

