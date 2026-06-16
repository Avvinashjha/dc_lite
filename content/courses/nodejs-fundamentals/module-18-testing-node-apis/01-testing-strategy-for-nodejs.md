# Testing Strategy for Node.js

## Why It Matters

A good testing strategy gives confidence without making every change slow. Node APIs need tests at several levels because business rules, HTTP behavior, database queries, and external integrations fail in different ways.

## Core Concepts

- Unit tests check small functions or services without real network or database dependencies.
- API tests exercise Express routes through HTTP-like requests.
- Integration tests use real dependencies such as a test database.
- End-to-end tests verify the system from a user or client perspective.
- Test pyramids are guidance; risk and feedback speed should drive coverage.

## Flow to Remember

Start with fast unit tests for logic, add API tests for route contracts, add integration tests for database behavior, and reserve E2E tests for critical workflows.

## Syntax and Examples

```js
import assert from 'node:assert/strict';
import test from 'node:test';

export function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
}

test('calculateTotal sums line items', () => {
  const total = calculateTotal([
    { priceCents: 500, quantity: 2 },
    { priceCents: 250, quantity: 1 }
  ]);
  assert.equal(total, 1250);
});
```

## Use Cases and Tradeoffs

- Use unit tests for pricing, permissions, validation, and state transitions.
- Use API tests for status codes, response bodies, auth, and validation errors.
- Use integration tests for SQL, migrations, transactions, and driver behavior.
- Keep fixtures small and name tests by behavior, not implementation.

## Common Mistakes

- Testing only controllers while service logic remains untested.
- Mocking the database so heavily that SQL can be broken for weeks.
- Writing E2E tests for every branch and slowing feedback.
- Letting tests depend on run order or shared mutable state.

## Practical Challenge

Choose test levels for a password reset feature: token generation, email sending, request endpoint, database persistence, and complete user flow.

## Recap

- Different risks need different test levels.
- Fast tests give daily feedback; integration tests protect real boundaries.
- A strategy is about confidence per minute.

