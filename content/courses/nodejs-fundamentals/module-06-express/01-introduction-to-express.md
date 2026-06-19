# Introduction to Express

## Why It Matters

Express is the smallest useful layer most Node.js teams put between raw HTTP and an application. It gives you routing, middleware, request parsing hooks, response helpers, and a predictable way to compose web/API behavior without hiding Node's request and response model.

## Core Concepts

- Express applications are functions that receive requests and produce responses.
- Routes match an HTTP method plus a path, then run one or more handlers.
- Middleware is code that runs before, after, or around route handlers.
- Express does not enforce architecture; your project structure must keep handlers, services, and data access readable.
- The underlying server is still Node's `node:http` server, so timeouts, sockets, streaming, and process lifecycle still matter.

## Flow to Remember

A client opens a TCP connection, sends an HTTP request, Node parses it, Express matches middleware and routes in registration order, your handler writes a response, then Node flushes bytes back to the client.

## Syntax and Examples

```js
import express from 'express';
import { createServer } from 'node:http';

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptimeSeconds: process.uptime() });
});

app.post('/echo', (req, res) => {
  res.status(201).json({ received: req.body });
});

const server = createServer(app);
server.listen(3000, () => {
  console.log('API listening on http://localhost:3000');
});
```

## Use Cases and Tradeoffs

- Build JSON APIs, server-rendered sites, webhooks, internal tools, and backend-for-frontend services.
- Choose Express when you want control and a large ecosystem. Choose a more opinionated framework when you need conventions for dependency injection, validation, or modules.
- Because Express is minimal, production readiness comes from deliberate choices around validation, logging, security headers, and shutdown.

## Common Mistakes

- Putting all logic inside route handlers until the app becomes impossible to test.
- Assuming Express catches every async error without checking the Express version and handler style.
- Registering middleware after routes that need it.
- Returning stack traces or raw database errors to clients.

## Practical Challenge

Create an Express app with `/health`, `/api/time`, and `/api/echo` routes. Add JSON parsing only for routes under `/api`, then test invalid JSON and observe the response.

## Recap

- Express wraps Node HTTP with routing and middleware, not with magic.
- Registration order is behavior.
- A maintainable Express app separates transport concerns from business logic.

