# Structural Patterns (Adapter, Proxy, Decorator)

## Why It Matters

Structural patterns organize how objects and modules fit together. Backend systems often integrate databases, caches, queues, third-party APIs, and internal services. Each dependency has its own interface, error model, response format, and timeout behavior.

Adapter, Proxy, and Decorator help keep those differences from leaking through the whole application.

## Core Concepts

### Adapter

An adapter converts one interface into another interface your application prefers. It is useful when a third-party API is awkward, unstable, or too specific to expose everywhere.

Instead of letting payment provider details spread across services, define the interface your app wants:

```js
export function createPaymentAdapter({ client }) {
  return {
    async charge({ amountCents, currency, customerId }) {
      const response = await client.createPayment({
        amount: amountCents,
        currencyCode: currency,
        customerReference: customerId
      });

      return {
        id: response.payment_id,
        status: response.state,
        raw: response
      };
    }
  };
}
```

Your service depends on `charge`, not on the provider's naming choices.

### Proxy

A proxy controls access to another object. It can add lazy loading, caching, authorization checks, rate limiting, logging, or remote communication.

```js
export function createCachedUserRepository({ userRepository, cache }) {
  return {
    async findById(id) {
      const cacheKey = `user:${id}`;
      const cached = await cache.get(cacheKey);
      if (cached) return JSON.parse(cached);

      const user = await userRepository.findById(id);
      if (user) await cache.set(cacheKey, JSON.stringify(user), { ttlSeconds: 60 });
      return user;
    }
  };
}
```

The proxy has the same shape as the real repository, so callers do not need to know caching exists.

### Decorator

A decorator adds behavior around an existing object without changing that object's source code. In JavaScript, decorators are often plain wrapper functions.

```js
export function withTiming(service, logger) {
  return {
    async execute(input) {
      const started = performance.now();
      try {
        return await service.execute(input);
      } finally {
        logger.info('service timing', { durationMs: performance.now() - started });
      }
    }
  };
}
```

Decorator and Proxy overlap. A proxy often controls access or represents something else. A decorator usually enhances an existing object while preserving its role.

## Syntax/Examples

### Adapter Around `fetch`

Backend code should avoid scattering raw HTTP details everywhere. Wrap them behind an application-specific client.

```js
export function createInventoryClient({ baseUrl, token }) {
  return {
    async reserveSku({ sku, quantity }) {
      const response = await fetch(`${baseUrl}/reservations`, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token}`,
          'content-type': 'application/json'
        },
        body: JSON.stringify({ sku, quantity })
      });

      if (response.status === 409) {
        return { reserved: false, reason: 'insufficient_stock' };
      }

      if (!response.ok) {
        throw new Error(`Inventory service failed: ${response.status}`);
      }

      const body = await response.json();
      return { reserved: true, reservationId: body.id };
    }
  };
}
```

Now business logic can use a stable response shape:

```js
const result = await inventoryClient.reserveSku({ sku: 'book-1', quantity: 2 });
if (!result.reserved) {
  throw new Error('Item is out of stock');
}
```

### Decorator for Retries

```js
import { setTimeout as delay } from 'node:timers/promises';

export function withRetry(client, { attempts = 3, delayMs = 100 } = {}) {
  return {
    async reserveSku(input) {
      let lastError;

      for (let attempt = 1; attempt <= attempts; attempt += 1) {
        try {
          return await client.reserveSku(input);
        } catch (error) {
          lastError = error;
          if (attempt < attempts) await delay(delayMs * attempt);
        }
      }

      throw lastError;
    }
  };
}
```

Apply it when constructing dependencies:

```js
const inventoryClient = withRetry(
  createInventoryClient({ baseUrl: process.env.INVENTORY_URL, token: process.env.INVENTORY_TOKEN }),
  { attempts: 3, delayMs: 200 }
);
```

## Use Cases

- Adapter: normalize third-party APIs, legacy modules, database libraries, or queue clients.
- Proxy: add cache, access checks, lazy initialization, circuit breakers, or remote service boundaries.
- Decorator: add logging, metrics, retries, tracing, validation, or instrumentation.

These patterns are especially useful near system edges. Keep provider-specific details in infrastructure modules, not in business services.

## Tradeoffs

Structural wrappers can become confusing if there are too many layers. A call stack like `withMetrics(withRetry(withCache(adapter)))` may be valid, but it should be constructed in one obvious place and tested as a unit.

Also watch interface drift. If a proxy claims to behave like a repository but returns different data or errors, callers will eventually depend on those differences.

## Common Mistakes

- Leaking third-party response objects through adapters.
- Retrying non-idempotent operations without idempotency keys.
- Caching user-specific data with keys that do not include user or tenant identity.
- Decorating only some methods and accidentally changing the interface.
- Turning every helper into an adapter even when there is no boundary to protect.

## Practical Challenge

Wrap a raw `fetch` call to an external API in an adapter that returns only application-specific fields. Then add a decorator that logs duration and status. Keep the service using the adapter unaware of HTTP status codes.

## Recap

Structural patterns keep dependencies manageable. Adapters translate, proxies control access, and decorators add behavior. In Node.js backends, they are most useful at boundaries: external APIs, data stores, caches, queues, and shared infrastructure clients.

