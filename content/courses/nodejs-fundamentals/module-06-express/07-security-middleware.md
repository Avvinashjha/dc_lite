# Security Middleware: CORS, Helmet, and Rate Limits

## Why It Matters

Express starts permissive. Browsers, proxies, bots, and attackers will all interact with your API differently. Security middleware helps set safer defaults for headers, cross-origin access, and abusive traffic.

## Core Concepts

- CORS controls which browser origins can read responses from your API.
- Helmet sets HTTP headers that reduce common browser attack surfaces.
- Rate limiting slows repeated requests from the same identity or IP.
- Security middleware is not a replacement for authentication, authorization, validation, or secure storage.
- Policies should differ between public APIs, browser apps, admin tools, and internal services.

## Flow to Remember

Security middleware should run before routes. It evaluates origin, headers, request identity, and response headers before application code returns data.

## Syntax and Examples

```js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();

app.use(helmet());
app.use(cors({
  origin: ['https://app.example.com'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['content-type', 'authorization']
}));
app.use('/api', rateLimit({ windowMs: 60_000, limit: 120 }));

app.get('/api/profile', (req, res) => {
  res.json({ id: 'user_123' });
});

app.listen(3000);
```

## Use Cases and Tradeoffs

- Use CORS when a browser frontend calls an API from a different origin.
- Use Helmet for public web apps unless a specific header conflicts with a known requirement.
- Rate limit login, password reset, expensive search, and public write endpoints more strictly.
- Use reverse-proxy or gateway limits as well as app-level limits in production.

## Common Mistakes

- Using `origin: "*"` with credentialed browser requests.
- Believing CORS protects APIs from non-browser clients.
- Rate limiting only by IP behind a proxy without configuring trusted proxy behavior.
- Blocking legitimate traffic because health checks and internal systems share a limit bucket.

## Practical Challenge

Configure CORS for a local frontend and production frontend, then add a stricter limiter for `POST /login` than for read-only routes.

## Recap

- Security middleware sets safer HTTP defaults.
- CORS is a browser policy, not authentication.
- Rate limits should match endpoint risk and infrastructure topology.

