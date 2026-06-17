# Rate Limiting and Throttling

## Why It Matters

APIs need protection from accidental overload, abusive clients, credential stuffing, scraping, and expensive request patterns. Rate limiting and throttling control how much traffic a caller can send over time.

For Node.js backends, these controls help keep the event loop and shared dependencies healthy. They also make API usage fair across users and tenants.

## Core Concepts

### Rate Limiting

Rate limiting rejects requests that exceed a configured limit, such as 100 requests per minute per API key.

### Throttling

Throttling slows requests down instead of immediately rejecting them. It can smooth bursts but may tie up resources if implemented poorly in the application process.

### Identity

A limit needs an identity key. Common keys include:

- IP address.
- User ID.
- API key ID.
- Tenant ID.
- Route plus user or route plus IP.

IP-only limits are easy but imperfect because many users can share one NAT IP, and attackers can use many IPs.

### Algorithms

Common algorithms include:

- Fixed window: simple counter reset every interval.
- Sliding window: smoother counting across time boundaries.
- Token bucket: allows bursts up to bucket capacity while refilling steadily.
- Leaky bucket: processes at a steady rate.

## Syntax/Examples

### Simple Fixed Window Middleware

```js
export function createFixedWindowRateLimit({ limit, windowMs }) {
  const counters = new Map();

  return (req, res, next) => {
    const key = req.user?.id ?? req.ip;
    const now = Date.now();
    const current = counters.get(key);

    if (!current || now > current.resetAt) {
      counters.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    current.count += 1;

    if (current.count > limit) {
      res.setHeader('Retry-After', Math.ceil((current.resetAt - now) / 1000));
      return res.status(429).json({ error: 'Too many requests' });
    }

    next();
  };
}
```

This demonstrates the idea, but production systems should use a shared store such as Redis when multiple Node instances are running.

### Route-Specific Limits

```js
app.post('/login', createFixedWindowRateLimit({ limit: 5, windowMs: 60_000 }), loginHandler);
app.get('/products', createFixedWindowRateLimit({ limit: 300, windowMs: 60_000 }), listProductsHandler);
```

Login should usually have stricter limits than public read endpoints because it is security-sensitive.

### Token Bucket Sketch

```js
export function createTokenBucket({ capacity, refillPerSecond }) {
  const buckets = new Map();

  return function consume(key) {
    const now = Date.now() / 1000;
    const bucket = buckets.get(key) ?? { tokens: capacity, updatedAt: now };
    const elapsed = now - bucket.updatedAt;

    bucket.tokens = Math.min(capacity, bucket.tokens + elapsed * refillPerSecond);
    bucket.updatedAt = now;

    if (bucket.tokens < 1) {
      buckets.set(key, bucket);
      return false;
    }

    bucket.tokens -= 1;
    buckets.set(key, bucket);
    return true;
  };
}
```

Token bucket allows short bursts while preserving a long-term average.

## Use Cases

Use rate limits for:

- Login and password reset endpoints.
- Public API keys.
- Expensive search endpoints.
- Webhook ingestion.
- Per-tenant fairness in SaaS apps.

Use throttling when:

- You control clients and want backpressure instead of hard failure.
- Background jobs can be slowed safely.
- Downstream APIs require controlled request rates.

## Tradeoffs

Strict limits protect systems but can block legitimate users during spikes. Loose limits may not stop abuse. Good limits often vary by endpoint, authentication state, customer plan, and risk level.

Distributed rate limiting requires atomic counters. Redis operations or purpose-built gateways are common. In-memory counters are acceptable for local development and simple demos, not for horizontally scaled enforcement.

## Common Mistakes

- Using only in-memory limits in a multi-instance deployment.
- Applying the same limit to every route.
- Trusting `X-Forwarded-For` without trusted proxy configuration.
- Not returning `429` and `Retry-After` for rejected requests.
- Blocking legitimate shared IPs with aggressive IP-only limits.

## Practical Challenge

Add rate limiting to `/login` by IP and email combination. Add a separate per-user limit to an authenticated `/reports/export` endpoint. Explain why the identity key differs for each route.

## Recap

Rate limiting rejects excess traffic. Throttling slows traffic. Both protect Node APIs and shared dependencies. Choose keys and algorithms carefully, use shared storage in scaled systems, and tune limits by route risk and cost.

