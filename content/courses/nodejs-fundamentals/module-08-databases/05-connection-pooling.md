# Connection Pooling

## Why It Matters

Database connections are expensive and limited. A connection pool reuses a small number of open connections so requests do not repeatedly connect, authenticate, allocate memory, and overload the database.

## Core Concepts

- A pool owns reusable connections.
- Queries borrow a connection and release it when done.
- Pool size must fit the database, app instances, workers, and background jobs.
- Leaked connections eventually starve the app.
- Transactions require a dedicated client until commit or rollback.

## Flow to Remember

The request starts, the repository borrows a connection, runs work, releases the connection in `finally`, and the next request can reuse it.

## Syntax and Examples

```js
import pg from 'pg';

const { Pool } = pg;
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: Number(process.env.DB_POOL_MAX ?? 10),
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 2_000
});

export async function withClient(work) {
  const client = await pool.connect();
  try {
    return await work(client);
  } finally {
    client.release();
  }
}
```

## Use Cases and Tradeoffs

- Use pools for APIs, workers, and scripts that make repeated database calls.
- Use a single pool per process.
- Tune pool sizes by total connections: app instances times pool max plus workers.
- Add timeouts so saturation fails fast instead of hanging forever.

## Common Mistakes

- Creating a new pool inside every request handler.
- Forgetting `client.release()` when an error happens.
- Setting pool max to a huge number and overwhelming the database.
- Using `pool.query` for multi-step transactions that must share one connection.

## Practical Challenge

Calculate the maximum database connections for 6 app instances with pool size 12 and 3 workers with pool size 4. Decide whether a database limit of 80 is safe.

## Recap

- Pools reuse scarce database connections.
- Pool sizing is a system-level decision.
- Always release borrowed clients.

