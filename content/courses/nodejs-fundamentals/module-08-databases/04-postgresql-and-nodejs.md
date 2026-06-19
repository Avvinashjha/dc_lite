# PostgreSQL and Node.js

## Why It Matters

PostgreSQL is a powerful relational database with strong correctness features, rich SQL, JSON support, transactions, indexes, and extensions. It is a common default for production Node.js APIs.

## Core Concepts

- Use the `pg` package with a `Pool` for most applications.
- Use `$1`, `$2`, and later placeholders for parameterized queries.
- PostgreSQL supports constraints, indexes, transactions, JSONB, full text search, and row-level locking.
- Database errors should be mapped to domain or HTTP errors at the repository/service boundary.
- Connection count is finite; pooling and timeouts matter.

## Flow to Remember

A request reaches a service, the repository checks out a pooled client or uses `pool.query`, PostgreSQL executes SQL, and rows are mapped to API data.

## Syntax and Examples

```js
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 10 });

export async function findAccount(accountId) {
  const result = await pool.query(
    'SELECT id, email, created_at FROM accounts WHERE id = $1',
    [accountId]
  );
  const row = result.rows[0];
  return row ? { id: row.id, email: row.email, createdAt: row.created_at.toISOString() } : null;
}

export async function closeDatabase() {
  await pool.end();
}
```

## Use Cases and Tradeoffs

- Use PostgreSQL for transactional APIs, reporting queries, relational integrity, and systems that benefit from advanced SQL.
- Use JSONB for flexible attributes, but keep core relational fields as columns.
- Use constraints for invariants the app must never violate.
- Use migrations to evolve schema alongside code.

## Common Mistakes

- Keeping all data in JSONB and losing relational guarantees.
- Ignoring unique violation and foreign key errors until clients see raw SQL messages.
- Opening one pool per module or request.
- Running unbounded queries from API filters.

## Practical Challenge

Create a PostgreSQL `accounts` table with unique email, then write `createAccount` and `findAccountByEmail` repository functions using `pg` placeholders.

## Recap

- PostgreSQL gives strong correctness and expressive SQL.
- Use pools, parameters, constraints, and migrations.
- Map rows and errors into application concepts.

