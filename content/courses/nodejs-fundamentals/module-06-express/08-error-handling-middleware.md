# Error Handling Middleware

## Why It Matters

Users need clear failures and operators need useful diagnostics. Error handling middleware is the place where application errors become consistent HTTP responses and unexpected failures become logs instead of crashes or leaked stack traces.

## Core Concepts

- Error middleware has four arguments: `(err, req, res, next)`.
- Register error middleware after routes.
- Operational errors, such as validation failures or missing records, can map to expected status codes.
- Programmer errors are bugs and should be logged with enough context to fix them.
- If headers are already sent, pass the error to Express with `next(err)`.

## Flow to Remember

A route throws or calls `next(error)`, Express skips normal middleware, error middleware classifies the error, logs it, and sends a safe response if possible.

## Syntax and Examples

```js
import express from 'express';

class HttpError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const app = express();

app.get('/users/:id', async (req, res) => {
  if (req.params.id === 'missing') {
    throw new HttpError(404, 'USER_NOT_FOUND', 'User was not found');
  }
  res.json({ id: req.params.id });
});

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err.status ?? 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ error: { code: err.code ?? 'INTERNAL_ERROR', message: status >= 500 ? 'Unexpected error' : err.message } });
});

app.listen(3000);
```

## Use Cases and Tradeoffs

- Centralize response shape for errors.
- Map domain errors to HTTP status codes in controllers or error middleware.
- Log internal details server-side while returning safe client messages.
- Use request IDs so logs and client reports can be correlated.

## Common Mistakes

- Registering error middleware before routes.
- Sending `err.stack` to production clients.
- Catching errors in every route and returning different response formats.
- Swallowing errors and leaving requests hanging.

## Practical Challenge

Create a `NotFoundError` and `ValidationError`, throw them from routes, and format both through one error middleware function.

## Recap

- Error middleware is the final HTTP translation boundary.
- Expected errors should be explicit.
- Unexpected errors should be logged safely and hidden from clients.

