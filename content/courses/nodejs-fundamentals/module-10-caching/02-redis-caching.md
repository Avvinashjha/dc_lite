# Caching with Redis

## Why It Matters

Redis is an in-memory data store commonly used as a shared cache for Node.js applications. Unlike an in-process cache, Redis can be shared by many app instances. If your Express API runs in several containers, each container can read and write the same cached values through Redis.

Redis is fast because it keeps data in memory and offers simple data structures such as strings, hashes, lists, sets, and sorted sets. It is often used for caching database queries, session storage, rate limiting, queues, distributed locks, and pub/sub messages.

Redis is not magic. It adds another service to operate, monitor, secure, and pay for. Good Redis usage starts with a clear reason: shared low-latency data with acceptable staleness.

## Core Concepts

### Redis Keys and Values

Redis stores data under string keys. Values can be strings, JSON strings, numbers, hashes, sets, and other structures.

Example keys:

```text
user:123:profile
products:category:books:page:2
session:9f832b9a
rate-limit:login:203.0.113.10
```

Consistent namespacing helps debugging and bulk invalidation.

### Expiration

Redis can expire keys automatically.

```text
SET products:featured "[...json...]" EX 60
```

This stores a value for 60 seconds. Expiration is a major reason Redis works well as a cache.

### Serialization

Redis does not store JavaScript objects directly. You usually serialize objects to JSON before storing them and parse them after reading.

```js
await redis.set('user:123', JSON.stringify(user), { EX: 60 });
const cached = JSON.parse(await redis.get('user:123'));
```

Only parse values you control. Always handle missing or malformed data gracefully.

### Cache Aside Pattern

The most common pattern is cache aside:

1. Try to read from Redis.
2. If found, return cached data.
3. If missing, load from the source of truth.
4. Store the result in Redis with a TTL.
5. Return the fresh data.

The database remains the source of truth. Redis stores a temporary copy.

## Syntax and Examples

### Running Redis Locally

With Docker:

```bash
docker run --name node-redis -p 6379:6379 redis:7-alpine
```

### Installing the Node Client

```bash
npm install redis
```

### Creating a Redis Client

```js
import { createClient } from 'redis';

export const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redis.on('error', (error) => {
  console.error('Redis client error', error);
});

await redis.connect();
```

Connect during app startup. If Redis is required for the app to run, fail startup when the connection fails. If Redis is optional for a best-effort cache, design a fallback path.

### Cache Aside for an Express Route

```js
import express from 'express';
import { redis } from './redis.js';
import { productRepository } from './products.js';

const app = express();

app.get('/products/:id', async (req, res, next) => {
  try {
    const cacheKey = `product:${req.params.id}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return res.json({
        product: JSON.parse(cached),
        cache: 'hit'
      });
    }

    const product = await productRepository.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await redis.set(cacheKey, JSON.stringify(product), {
      EX: 60
    });

    res.json({ product, cache: 'miss' });
  } catch (error) {
    next(error);
  }
});
```

This endpoint may serve product data up to 60 seconds old. That is acceptable for many catalogs, but not for every domain.

### Invalidating After Writes

```js
app.patch('/products/:id', async (req, res, next) => {
  try {
    const product = await productRepository.update(req.params.id, req.body);

    await redis.del(`product:${req.params.id}`);

    res.json({ product });
  } catch (error) {
    next(error);
  }
});
```

Deleting the cache key after a write forces the next read to load fresh data from the database.

### Caching Collections

Collection caches need careful keys because filters and pagination affect results.

```js
function productListKey({ category, page, sort }) {
  return `products:list:category=${category}:page=${page}:sort=${sort}`;
}

app.get('/products', async (req, res, next) => {
  try {
    const params = {
      category: String(req.query.category || 'all'),
      page: Number(req.query.page || 1),
      sort: String(req.query.sort || 'newest')
    };

    const key = productListKey(params);
    const cached = await redis.get(key);

    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const result = await productRepository.list(params);

    await redis.set(key, JSON.stringify(result), {
      EX: 30
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});
```

Invalidating collection caches can be harder than invalidating a single item. Many teams use short TTLs for list endpoints, versioned keys, or targeted deletes for known affected lists.

### Rate Limiting with Redis

Redis can count actions across all app instances.

```js
export function createLoginRateLimiter({ redis, limit, windowSeconds }) {
  return async function loginRateLimiter(req, res, next) {
    try {
      const key = `rate-limit:login:${req.ip}`;
      const count = await redis.incr(key);

      if (count === 1) {
        await redis.expire(key, windowSeconds);
      }

      if (count > limit) {
        return res.status(429).json({ error: 'Too many login attempts' });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
```

For high-risk production systems, use a tested rate limiting package or a gateway-level solution. Rate limiting has edge cases around proxies, IPv6, shared networks, and account-specific attacks.

## Use Cases

Redis works well for:

- Shared response and query caching.
- Session storage for horizontally scaled apps.
- Rate limiting counters.
- Short-lived verification codes.
- Distributed locks for occasional coordination.
- Pub/sub notifications between app instances.
- Queue backing stores, usually through libraries such as BullMQ.

Redis may be the wrong tool for:

- Long-term source-of-truth data.
- Large binary files.
- Data sets too large for memory.
- Complex relational queries.
- Caches where stale data is unacceptable and invalidation is hard.

## Security and Production Implications

### Network Access

Do not expose Redis directly to the public internet. Put it on a private network, require authentication where supported, and use TLS for managed services when data crosses networks.

### Sensitive Data

Redis often contains sessions, tokens, or cached private data. Treat it as sensitive infrastructure. Avoid storing secrets longer than needed, set TTLs, and restrict access.

### Failure Modes

Decide what happens when Redis is down:

- Hard dependency: return errors or fail startup.
- Soft dependency: skip cache and read from the database.

For most read-through caches, Redis should be a performance layer, not the source of truth. If Redis fails, the app can still serve requests more slowly. For sessions or rate limits, Redis may be a hard dependency.

### Eviction Policy

Redis has memory limits and eviction policies. If Redis evicts keys unexpectedly, your cache hit rate drops. If it stores sessions and evicts them, users may be logged out. Configure memory and eviction policy based on what Redis stores.

### Observability

Monitor latency, memory usage, connected clients, evicted keys, hit rate, command errors, and slow commands. Redis is fast, so a small increase in Redis latency can affect every request that depends on it.

## Common Mistakes

- Using Redis as the only copy of important business data.
- Forgetting TTLs on cache keys.
- Caching authenticated responses without user-specific keys.
- Not handling Redis connection errors.
- Exposing Redis to untrusted networks.
- Storing huge JSON documents and retrieving them on every request.
- Invalidating single records but forgetting related list caches.
- Assuming Redis makes slow database queries unnecessary to optimize.
- Sharing one Redis instance for unrelated workloads without key namespaces.

## Practical Challenge

Add Redis caching to a product API:

1. Cache `GET /products/:id` for 60 seconds.
2. Delete `product:{id}` after product updates and deletes.
3. Cache `GET /products` for 30 seconds using keys that include filters and page number.
4. Add simple hit/miss logging.
5. Decide and document whether the app should keep working when Redis is unavailable.

Then add a Redis-backed login rate limiter that allows 5 failed attempts per IP per 15 minutes.

## Recap

Redis is a fast shared cache that helps Node.js apps scale across multiple processes and containers. Use it with clear key design, TTLs, invalidation rules, error handling, and monitoring. Keep the database as the source of truth unless you are intentionally using Redis as part of a specialized architecture. A Redis cache should improve performance without quietly breaking correctness or security.
