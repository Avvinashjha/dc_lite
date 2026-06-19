# Request Parsing and Validation

## Why It Matters

Every request body is untrusted input. Parsing turns bytes into JavaScript values; validation decides whether those values are acceptable for your use case. Without a clear validation boundary, bad data reaches services, databases, logs, and downstream APIs.

## Core Concepts

- `express.json()` parses JSON request bodies and enforces a size limit.
- `express.urlencoded()` parses HTML form bodies.
- Validation should check type, required fields, ranges, formats, and unknown fields.
- Normalization can trim strings or coerce safe values, but it should be explicit.
- Return stable client errors instead of leaking parser or validation internals.

## Flow to Remember

Node receives request bytes, body parser middleware reads the stream, Express sets `req.body`, validation middleware checks the parsed value, then the route handler can trust the validated shape.

## Syntax and Examples

```js
import express from 'express';

const app = express();
app.use(express.json({ limit: '100kb' }));

function validateCreateUser(req, res, next) {
  const { email, name } = req.body ?? {};
  const errors = [];

  if (typeof email !== 'string' || !email.includes('@')) errors.push('email must be valid');
  if (typeof name !== 'string' || name.trim().length < 2) errors.push('name is too short');

  if (errors.length > 0) {
    return res.status(400).json({ error: { code: 'VALIDATION_FAILED', details: errors } });
  }

  req.body = { email: email.toLowerCase(), name: name.trim() };
  next();
}

app.post('/users', validateCreateUser, (req, res) => {
  res.status(201).json({ data: req.body });
});

app.listen(3000);
```

## Use Cases and Tradeoffs

- Validate at API boundaries before calling services.
- Use schema libraries such as Zod, Valibot, Joi, or Ajv when validation rules grow.
- Use different schemas for create, update, query filters, and path parameters.
- Limit body size to reduce memory pressure and abuse.

## Common Mistakes

- Trusting TypeScript types for runtime input.
- Accepting unknown fields and accidentally enabling mass assignment.
- Parsing JSON globally for routes that do not need request bodies.
- Returning many inconsistent validation response shapes.

## Practical Challenge

Add validation for `POST /products` with `name`, `price`, and optional `tags`. Reject unknown fields and return all validation errors at once.

## Recap

- Parsing is not validation.
- Validation belongs near the edge of the app.
- Stable validation errors improve client integration and debugging.

