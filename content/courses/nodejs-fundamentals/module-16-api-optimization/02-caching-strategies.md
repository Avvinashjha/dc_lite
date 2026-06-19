# API Caching Strategies

## Why It Matters

Caching stores the result of expensive work so future requests can be served faster. For Node.js APIs, caching can reduce database load, improve latency, absorb traffic spikes, and protect downstream services.

Caching also introduces correctness problems. Stale data, invalidation bugs, user-specific leaks, and cache stampedes are common. A cache should be designed around how fresh the data must be and who is allowed to see it.

## Core Concepts

### Cache Layers

Common cache layers include:

- Browser cache controlled by HTTP headers.
- CDN or edge cache for public responses.
- Reverse proxy cache such as Nginx.
- Application memory cache inside a Node process.
- Shared cache such as Redis.
- Database query cache or materialized views.

Each layer has different visibility and invalidation behavior.

### TTL

Time to live, or TTL, defines how long cached data may be reused. Short TTLs reduce staleness. Long TTLs improve hit rate. Some data can be cached for seconds, some for hours, and some not at all.

### Cache Keys

A cache key must include everything that changes the response:

- Route and query parameters.
- Tenant ID.
- User ID or authorization scope for private data.
- Language, currency, or feature flags if they affect output.

Bad keys cause data leaks and incorrect responses.

## Syntax/Examples

### Simple In-Memory Cache

```js
export function createMemoryCache() {
  const values = new Map();

  return {
    get(key) {
      const entry = values.get(key);
      if (!entry) return null;
      if (Date.now() > entry.expiresAt) {
        values.delete(key);
        return null;
      }
      return entry.value;
    },

    set(key, value, { ttlMs }) {
      values.set(key, { value, expiresAt: Date.now() + ttlMs });
    },

    delete(key) {
      values.delete(key);
    }
  };
}
```

This is useful for a single process. It is not shared across clustered workers or multiple servers.

### Cache-Aside Pattern

```js
export function createProductService({ productRepository, cache }) {
  return {
    async getProduct(id) {
      const cacheKey = `product:${id}`;
      const cached = cache.get(cacheKey);
      if (cached) return cached;

      const product = await productRepository.findById(id);
      if (product) cache.set(cacheKey, product, { ttlMs: 60_000 });
      return product;
    },

    async updateProduct(id, patch) {
      const product = await productRepository.update(id, patch);
      cache.delete(`product:${id}`);
      return product;
    }
  };
}
```

Cache-aside means the app checks the cache, loads from the source on miss, and invalidates or updates the cache after writes.

### HTTP Cache Headers

```js
app.get('/public/articles/:id', async (req, res) => {
  const article = await articleRepository.findPublishedById(req.params.id);
  if (!article) return res.status(404).json({ error: 'Not found' });

  res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  res.json(article);
});

app.get('/me', async (req, res) => {
  res.setHeader('Cache-Control', 'private, no-store');
  res.json({ user: req.user });
});
```

Public content can be cached by shared caches. Private user data should not be stored by shared caches.

## Use Cases

Cache good candidates:

- Public product catalogs.
- Feature flags.
- Configuration loaded from remote services.
- Expensive aggregate counts.
- Slow external API responses.

Avoid caching or use extreme care for:

- Highly sensitive user data.
- Rapidly changing financial state.
- Permission-dependent responses.
- Results of non-idempotent operations.

## Tradeoffs

Caching improves read performance but makes write paths more complex. Invalidation is usually the hardest part. TTL-based caching is simple but allows stale data. Explicit invalidation is fresher but can miss related keys.

Cache stampedes happen when many requests miss at once and all rebuild the same value. Use short locks, request coalescing, stale-while-revalidate, or background refresh for expensive keys.

## Common Mistakes

- Caching authenticated responses without user or tenant in the key.
- Forgetting to invalidate cache after writes.
- Using local memory cache and expecting all instances to see updates.
- Caching errors for too long.
- Choosing a long TTL before understanding freshness requirements.

## Practical Challenge

Add cache-aside to a `getProduct(id)` service. Include `delete` on update. Write down the cache key and why it cannot leak data between tenants or users.

## Recap

Caching is a performance and resilience tool, not just a speed trick. Choose the right layer, design safe keys, set TTLs based on freshness needs, and plan invalidation before relying on cached responses in production.

