# What is Middleware?

## Why It Matters

Middleware is Express's composition model. Logging, authentication, parsing, validation, metrics, static files, and error handling all work because requests pass through a chain of small functions.

## Core Concepts

- Normal middleware has the shape `(req, res, next)`.
- Error middleware has the shape `(err, req, res, next)` and must be registered after routes.
- Middleware can end the response, mutate `req`, attach context to `res.locals`, or call `next()`.
- Order matters because Express executes middleware in the order it was registered.
- Small middleware functions are easier to reuse and test than large route handlers.

## Flow to Remember

A request enters the app, passes each matching middleware layer, reaches a route, and either returns a response or forwards an error to error middleware.

## Syntax and Examples

```js
import express from 'express';
import { randomUUID } from 'node:crypto';

const app = express();

function requestId(req, res, next) {
  res.locals.requestId = req.get('x-request-id') ?? randomUUID();
  res.set('x-request-id', res.locals.requestId);
  next();
}

function requireApiKey(req, res, next) {
  if (req.get('x-api-key') !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

app.use(requestId);
app.get('/private', requireApiKey, (req, res) => {
  res.json({ requestId: res.locals.requestId });
});

app.listen(3000);
```

## Use Cases and Tradeoffs

- Apply cross-cutting behavior once instead of repeating it in every route.
- Use app-level middleware for global concerns and router-level middleware for feature-specific concerns.
- Use `res.locals` for per-request data needed by later handlers.
- Keep middleware focused; authentication and authorization can be separate steps.

## Common Mistakes

- Forgetting to call `next()` when the middleware does not send a response.
- Calling `next()` after sending a response and causing duplicate writes.
- Doing slow blocking work in middleware for every request.
- Hiding important business rules inside global middleware where tests and reviewers miss them.

## Practical Challenge

Write middleware that measures request duration and logs method, path, status code, and elapsed milliseconds after the response finishes.

## Recap

- Middleware is ordered composition.
- A middleware either ends the response or passes control forward.
- Use middleware for transport concerns, not for every piece of business logic.

