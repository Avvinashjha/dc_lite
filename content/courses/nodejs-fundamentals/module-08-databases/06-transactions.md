# Transactions

## Why It Matters

Transactions let a group of database changes succeed or fail together. They protect money movement, inventory updates, account creation, and any workflow where partial completion would corrupt business state.

## Core Concepts

- ACID means atomicity, consistency, isolation, and durability.
- `BEGIN` starts a transaction; `COMMIT` makes changes durable; `ROLLBACK` undoes them.
- A transaction must use the same database connection for all statements.
- Isolation controls what concurrent transactions can observe.
- Keep transactions short to reduce locks and contention.

## Flow to Remember

Borrow a client, begin, run all related statements, commit on success, roll back on error, then release the client.

## Syntax and Examples

```js
import { pool } from './db.js';

export async function transferFunds({ fromAccountId, toAccountId, cents }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('UPDATE accounts SET balance_cents = balance_cents - $1 WHERE id = $2', [cents, fromAccountId]);
    await client.query('UPDATE accounts SET balance_cents = balance_cents + $1 WHERE id = $2', [cents, toAccountId]);
    await client.query(
      'INSERT INTO transfers (from_account_id, to_account_id, cents) VALUES ($1, $2, $3)',
      [fromAccountId, toAccountId, cents]
    );
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
```

## Use Cases and Tradeoffs

- Use transactions for multi-table writes, audit records, inventory reservation, and state transitions.
- Use row locks or optimistic concurrency for competing updates.
- Use idempotency keys with transactions for retry-safe payment or order creation.
- Use constraints inside transactions to let the database enforce invariants.

## Common Mistakes

- Running transaction statements through different pooled connections.
- Doing network calls inside an open transaction.
- Ignoring isolation anomalies such as lost updates.
- Catching an error but still committing.

## Practical Challenge

Implement `placeOrder` that inserts an order, inserts order items, decrements inventory, and rolls back if any item is unavailable.

## Recap

- Transactions protect groups of related changes.
- They require one connection from begin to commit.
- Short, well-scoped transactions improve correctness and performance.

