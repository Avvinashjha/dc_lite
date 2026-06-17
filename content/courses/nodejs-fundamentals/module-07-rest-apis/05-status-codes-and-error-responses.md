# Status Codes and Error Responses

## Why It Matters

Status codes are a compact contract between server and client. Good error responses let clients recover, show useful messages, retry safely, or stop retrying when a request is invalid.

## Core Concepts

- 2xx means success, 3xx means redirection, 4xx means client-correctable problem, 5xx means server-side failure.
- `400` is malformed or invalid input; `401` needs authentication; `403` is authenticated but not allowed; `404` is missing or hidden; `409` is conflict.
- `422` is often used for semantically invalid data, though some APIs use `400` consistently.
- `429` signals rate limiting and should include retry information when possible.
- Error bodies should be stable, machine-readable, and safe.

## Flow to Remember

A route detects a domain or validation outcome, maps it to an HTTP status, includes a stable error code, and optionally adds details useful to the client.

## Syntax and Examples

```js
import express from 'express';

const app = express();

function sendError(res, status, code, message, details = undefined) {
  res.status(status).json({ error: { code, message, details } });
}

app.get('/api/invoices/:id', (req, res) => {
  if (!req.get('authorization')) {
    return sendError(res, 401, 'AUTH_REQUIRED', 'Authentication is required');
  }
  if (req.params.id === 'paid') {
    return sendError(res, 409, 'INVOICE_LOCKED', 'Paid invoices cannot be edited');
  }
  res.json({ data: { id: req.params.id } });
});

app.listen(3000);
```

## Use Cases and Tradeoffs

- Use consistent error codes so clients do not parse prose messages.
- Include validation details for fields clients can fix.
- Hide whether a resource exists when revealing it would leak private information.
- Use `Retry-After` for temporary throttling or planned downtime.

## Common Mistakes

- Returning `500` for expected validation or not-found cases.
- Using `401` and `403` interchangeably.
- Changing error response shape by route.
- Leaking stack traces, SQL errors, tokens, or internal hostnames.

## Practical Challenge

Define an error response format for a todo API. Add examples for validation failure, missing auth, forbidden access, not found, conflict, and rate limit.

## Recap

- Status codes describe classes of outcomes.
- Error codes should be stable and machine-readable.
- Safe detail helps clients recover without exposing internals.

