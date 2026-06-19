# API Testing with Supertest

## Why It Matters

API tests verify the actual Express request/response contract: method, route, middleware, parsing, validation, status codes, headers, and response shape. Supertest can exercise an Express app without opening a real network port.

## Core Concepts

- Export `createApp()` so tests can create the app without calling `listen()`.
- Supertest sends requests to the Express app object.
- API tests should assert status code and response body shape.
- Use test-specific dependencies for databases or services.
- Keep fixtures isolated so tests can run in any order.

## Flow to Remember

The test builds an app, sends an HTTP-like request with Supertest, Express runs middleware and routes, and the test asserts the response.

## Syntax and Examples

```js
import express from 'express';
import request from 'supertest';
import test from 'node:test';
import assert from 'node:assert/strict';

function createApp() {
  const app = express();
  app.use(express.json());
  app.post('/api/tasks', (req, res) => {
    if (!req.body?.title) return res.status(400).json({ error: { code: 'TITLE_REQUIRED' } });
    res.status(201).json({ data: { id: 'task_1', title: req.body.title } });
  });
  return app;
}

test('POST /api/tasks creates a task', async () => {
  const response = await request(createApp()).post('/api/tasks').send({ title: 'Ship tests' });
  assert.equal(response.status, 201);
  assert.equal(response.body.data.title, 'Ship tests');
});
```

## Use Cases and Tradeoffs

- Test validation errors, auth middleware, not-found routes, and error boundaries.
- Use Supertest for Express apps before introducing full browser E2E tests.
- Assert headers such as `location`, `content-type`, and rate-limit headers when part of the contract.
- Use factories for test data instead of large static fixtures.

## Common Mistakes

- Starting a listener on a fixed port in tests and causing conflicts.
- Only checking status code and missing broken response fields.
- Sharing app state between tests accidentally.
- Mocking so much middleware that the route contract is no longer tested.

## Practical Challenge

Write Supertest cases for `POST /api/users`: valid create returns `201`, missing email returns `400`, duplicate email returns `409`.

## Recap

- Supertest tests Express at the HTTP boundary.
- Separate app creation from server startup.
- Assert the contract clients depend on.

