# In-Memory Caching

## Why It Matters

Caching stores the result of expensive work so future requests can reuse it. In Node.js apps, caching can reduce database load, shorten response times, protect third-party APIs from repeated calls, and smooth traffic spikes.

In-memory caching is the simplest cache you can add because it stores data inside the Node.js process. There is no separate service to run, no network call, and no serialization requirement beyond what your code chooses. That simplicity makes it excellent for small apps, computed configuration, hot lookup data, and learning cache behavior.

The tradeoff is that memory belongs to one process. If your app runs on four containers, each container has its own cache. If the process restarts, the cache is empty. If the cache grows without limits, it can crash the app.

## Core Concepts

### Cache Hit and Cache Miss

A cache hit means the requested value exists in the cache and can be returned immediately. A cache miss means the app must compute or fetch the value, then optionally store it for next time.

```text
request -> check cache -> hit -> return value
                         -> miss -> load value -> store value -> return value
```

### Keys and Values

A cache key uniquely identifies a cached value. Keys should include every input that affects the result.

Good keys:

- `user:123`
- `product-list:category=books:page=2`
- `exchange-rate:USD:INR`

Bad keys:

- `data`
- `latest`
- `user` for every user

If the key is too broad, users may receive the wrong data. If it is too specific, the cache may never be reused.

### TTL

TTL means time to live. A cached item expires after a configured duration.

Short TTLs reduce staleness but increase misses. Long TTLs increase cache hits but may serve outdated data.

### Invalidation

Invalidation removes or updates cached data when the source of truth changes. This is often harder than storing the value. Common approaches:

- TTL-only: let cached data expire naturally.
- Write-through invalidation: delete or update the cache when the database changes.
- Versioned keys: include a version or timestamp in the key.
- Manual purge: provide admin or operational tools to clear entries.

### Bounded Memory

An in-memory cache must have limits. Without limits, a busy API can keep storing values until the Node.js process runs out of memory.

Common controls:

- Maximum number of items.
- Maximum size by bytes.
- TTL expiration.
- Least recently used eviction.

## Syntax and Examples

### A Tiny TTL Cache

This example is intentionally small so the moving parts are visible.

```js
export class TtlCache {
  #items = new Map();

  constructor({ ttlMs, maxItems = 1000 }) {
    this.ttlMs = ttlMs;
    this.maxItems = maxItems;
  }

  get(key) {
    const item = this.#items.get(key);

    if (!item) {
      return undefined;
    }

    if (Date.now() > item.expiresAt) {
      this.#items.delete(key);
      return undefined;
    }

    return item.value;
  }

  set(key, value) {
    if (this.#items.size >= this.maxItems) {
      const oldestKey = this.#items.keys().next().value;
      this.#items.delete(oldestKey);
    }

    this.#items.set(key, {
      value,
      expiresAt: Date.now() + this.ttlMs
    });
  }

  delete(key) {
    this.#items.delete(key);
  }

  clear() {
    this.#items.clear();
  }
}
```

This cache is not a full LRU cache. It simply removes the oldest inserted key when full. For production, use a battle-tested package such as `lru-cache` if you need robust eviction.

### Caching an Expensive Service Call

```js
import { TtlCache } from './ttl-cache.js';

const profileCache = new TtlCache({
  ttlMs: 1000 * 60,
  maxItems: 5000
});

export async function getUserProfile(userId) {
  const cacheKey = `user-profile:${userId}`;
  const cached = profileCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const profile = await users.findProfileById(userId);
  profileCache.set(cacheKey, profile);

  return profile;
}
```

This works well when profiles can be up to one minute stale. If profile changes must appear immediately, delete the cache key after updates.

```js
export async function updateUserProfile(userId, changes) {
  const profile = await users.updateProfile(userId, changes);
  profileCache.delete(`user-profile:${userId}`);
  return profile;
}
```

### Caching Express Responses

You can cache data before formatting a response:

```js
const productsCache = new TtlCache({
  ttlMs: 1000 * 30,
  maxItems: 200
});

app.get('/products', async (req, res, next) => {
  try {
    const category = String(req.query.category || 'all');
    const page = Number(req.query.page || 1);
    const cacheKey = `products:${category}:page:${page}`;

    let products = productsCache.get(cacheKey);

    if (!products) {
      products = await productRepository.list({ category, page });
      productsCache.set(cacheKey, products);
    }

    res.json({ products });
  } catch (error) {
    next(error);
  }
});
```

Include query parameters, user identity, locale, feature flags, or permissions in the cache key if they affect the output.

### Preventing Cache Stampedes

A cache stampede happens when many requests miss the same key at the same time and all perform the expensive work. One local mitigation is to cache the in-flight promise.

```js
const pendingLoads = new Map();

async function getOrLoad(key, load) {
  const cached = cache.get(key);

  if (cached) {
    return cached;
  }

  if (pendingLoads.has(key)) {
    return pendingLoads.get(key);
  }

  const promise = load()
    .then((value) => {
      cache.set(key, value);
      return value;
    })
    .finally(() => {
      pendingLoads.delete(key);
    });

  pendingLoads.set(key, promise);
  return promise;
}
```

This only coordinates requests inside one Node.js process. For multiple processes, use Redis locks or another distributed coordination strategy when the cost justifies it.

## Use Cases

In-memory caching is useful for:

- Feature flags or app configuration loaded from a database.
- Expensive computed values that can be briefly stale.
- Public catalog pages.
- Reference data such as countries, currencies, or permissions.
- Short-term third-party API responses.
- Per-process memoization of parsed templates or schemas.

Avoid in-memory caching for:

- Large unbounded data sets.
- Values that must be shared across many app instances.
- Data that must survive restarts.
- User-specific sensitive data unless keys and invalidation are very carefully designed.

## Security and Production Implications

### User Data Leakage

The most dangerous cache bug is returning one user's data to another user. If the response depends on the current user, include the user ID or authorization scope in the key.

```js
const key = `dashboard:${req.user.id}:${req.query.period}`;
```

Do not cache authenticated responses behind a key that only includes the URL if different users see different data.

### Memory Pressure

Node.js has a finite heap. Monitor memory usage and cache size. A cache that improves latency during normal traffic can cause outages under unusual traffic if the key space grows without bounds.

### Stale Data

All caches introduce the possibility of stale data. Make the staleness acceptable to the product behavior. A one-minute stale product list may be fine. A stale account balance may not be.

### Observability

Track cache hit rate, miss rate, eviction count, and load errors. Without metrics, it is hard to know whether a cache is helping or hiding a performance problem.

## Common Mistakes

- Creating cache keys that omit user ID, tenant ID, query params, or locale.
- Caching errors forever.
- Letting the cache grow without a maximum size.
- Using in-memory cache for data that must be shared across processes.
- Forgetting to invalidate after writes.
- Caching sensitive user data and exposing it through broad keys.
- Setting TTLs so long that users see confusing stale data.
- Adding caching before measuring where time is actually spent.

## Practical Challenge

Add an in-memory cache to a product listing route:

1. Cache by category and page.
2. Use a TTL of 30 seconds.
3. Limit the cache to 100 entries.
4. Delete related keys when a product is created, updated, or deleted.
5. Log cache hits and misses during development.

Then test the route by calling it repeatedly and confirming that the database load function runs only after a miss or expiration.

## Recap

In-memory caching is fast, simple, and useful for local short-lived values. It is limited to one Node.js process and disappears on restart. Design keys carefully, set TTLs, bound memory usage, and invalidate when data changes. Caching is a performance tool, but it also changes correctness, security, and operational behavior.
