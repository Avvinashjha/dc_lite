# Logging Errors Safely

## Why It Matters

Logs help operators debug failures, but they can also leak tokens, passwords, personal data, SQL, or internal network details. Safe logging captures enough context to investigate without creating a second security incident.

## Core Concepts

- Log structured fields instead of only prose strings.
- Include request IDs, route, status, user or tenant IDs when safe, and error stack for server-side diagnostics.
- Redact secrets and sensitive payload fields.
- Do not log full authorization headers, cookies, passwords, or payment details.
- Client error responses and server logs can have different levels of detail.

## Flow to Remember

An error reaches the boundary, the logger records safe context with a correlation ID, and the response returns a generic or client-correctable message.

## Syntax and Examples

```js
import express from 'express';
import { randomUUID } from 'node:crypto';

const app = express();

app.use((req, res, next) => {
  res.locals.requestId = req.get('x-request-id') ?? randomUUID();
  next();
});

app.use((err, req, res, next) => {
  const status = err.status ?? 500;
  console.error(JSON.stringify({
    level: status >= 500 ? 'error' : 'warn',
    requestId: res.locals.requestId,
    method: req.method,
    path: req.path,
    status,
    message: err.message,
    stack: status >= 500 ? err.stack : undefined
  }));
  res.status(status).json({ error: { requestId: res.locals.requestId, message: status >= 500 ? 'Unexpected error' : err.message } });
});
```

## Use Cases and Tradeoffs

- Use structured logging for APIs and workers.
- Add request IDs at the edge and propagate them to downstream calls.
- Use log levels to separate expected client problems from system failures.
- Keep audit logs separate from debug logs when compliance matters.

## Common Mistakes

- Logging entire `req.body` for login, payment, or profile endpoints.
- Returning log-only details to clients.
- Logging the same error many times at multiple layers.
- Ignoring log volume and cost during incident spikes.

## Practical Challenge

Create a redaction helper that replaces `password`, `token`, `authorization`, and `cookie` fields with `[REDACTED]` before logging an object.

## Recap

- Logs are operational data and security-sensitive data.
- Use request IDs and structured context.
- Redact secrets by default.

