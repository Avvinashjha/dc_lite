# Integration and E2E Testing

## Why It Matters

Unit and API tests can still miss broken migrations, driver behavior, serialization, auth wiring, queues, and deployment assumptions. Integration and E2E tests provide confidence that real pieces work together.

## Core Concepts

- Integration tests verify multiple components, often with a real database or service emulator.
- E2E tests verify a complete user or client workflow through deployed or deploy-like systems.
- Use isolated test data and cleanup strategies.
- Run expensive tests less often or in dedicated CI stages.
- Failures should identify the broken boundary quickly.

## Flow to Remember

The test environment starts dependencies, applies migrations, creates the app, performs real operations, asserts persisted outcomes, then cleans up resources.

## Syntax and Examples

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import pg from 'pg';

const { Pool } = pg;

test('user insert can be read back from PostgreSQL', async () => {
  const pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
  try {
    await pool.query('BEGIN');
    const inserted = await pool.query(
      'INSERT INTO users (email, name) VALUES ($1, $2) RETURNING id, email',
      ['integration@example.com', 'Integration Test']
    );
    const loaded = await pool.query('SELECT email FROM users WHERE id = $1', [inserted.rows[0].id]);
    assert.equal(loaded.rows[0].email, 'integration@example.com');
    await pool.query('ROLLBACK');
  } finally {
    await pool.end();
  }
});
```

## Use Cases and Tradeoffs

- Use integration tests for repositories, migrations, transactions, serialization, and auth middleware with real dependencies.
- Use E2E tests for signup, login, checkout, payment callback, and other critical journeys.
- Use containers, local emulators, or disposable databases to keep tests repeatable.
- Collect logs and request IDs when E2E tests fail.

## Common Mistakes

- Running E2E tests against shared state without isolation.
- Skipping migration setup and testing against a manually prepared database.
- Making E2E tests responsible for every edge case.
- Leaving test servers, pools, or timers open after tests finish.

## Practical Challenge

Design an integration test for order creation that uses a real test database and verifies order rows, item rows, and inventory changes inside one workflow.

## Recap

- Integration tests prove boundaries work together.
- E2E tests protect critical user journeys.
- Isolation and cleanup make higher-level tests trustworthy.

