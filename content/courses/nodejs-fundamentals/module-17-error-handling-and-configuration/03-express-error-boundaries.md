# Express Error Boundaries

## Why It Matters

An Express error boundary is the point where route failures become HTTP error responses. Without one, async failures may hang requests or leak implementation details.

## Core Concepts

- In Express 5, rejected promises from async route handlers are forwarded to error middleware.
- In Express 4, async handlers often need a wrapper that calls `next(error)`.
- Error middleware belongs after all routes.
- Controllers should throw meaningful errors and let the boundary format responses.
- The boundary should log server errors and hide sensitive details.

## Flow to Remember

The route throws, Express forwards the error, the boundary maps it to status and response shape, and the client receives a safe JSON error.

## Syntax and Examples

```js
import express from 'express';

const app = express();

const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

app.get('/reports/:id', asyncHandler(async (req, res) => {
  const report = await loadReport(req.params.id);
  if (!report) {
    const error = new Error('Report not found');
    error.status = 404;
    throw error;
  }
  res.json({ data: report });
}));

app.use((err, req, res, next) => {
  const status = err.status ?? 500;
  res.status(status).json({ error: { message: status >= 500 ? 'Unexpected error' : err.message } });
});

async function loadReport(id) {
  return id === '1' ? { id, status: 'ready' } : null;
}
```

## Use Cases and Tradeoffs

- Use one boundary per app or router to keep error responses consistent.
- Use typed domain errors for not found, conflict, validation, and authorization failures.
- Include request IDs in logs and responses.
- Test both successful routes and thrown errors.

## Common Mistakes

- Wrapping every controller in repetitive `try/catch` and returning inconsistent responses.
- Forgetting to pass stream errors or callback errors into `next`.
- Sending a response, then throwing later in detached async work.
- Assuming the error boundary can fix corrupted process state.

## Practical Challenge

Add an Express error boundary to a products API and test that thrown `NotFoundError` becomes `404` while unexpected errors become `500`.

## Recap

- Express error boundaries format route failures.
- Async errors must reach the boundary.
- The boundary is for HTTP translation, not silent recovery.

