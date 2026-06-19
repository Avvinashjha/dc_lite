# Creational Patterns (Singleton, Factory)

## Why It Matters

Backend applications create many objects: database clients, loggers, API clients, services, repositories, jobs, validators, and request-scoped context. Creational patterns help control how those objects are built and shared.

In Node.js, object creation has extra importance because modules are cached after the first import. A value created at module scope can behave like a singleton even if you never write a `Singleton` class. That can be helpful for shared database pools and dangerous for request-specific state.

## Core Concepts

### Singleton

A singleton ensures there is one shared instance of something. In Node, the most common form is a module-level export:

```js
// logger.js
import { inspect } from 'node:util';

export const logger = {
  info(message, meta = {}) {
    console.log(message, inspect(meta, { depth: 4 }));
  }
};
```

Every file that imports `logger` receives the same object because Node caches ESM modules.

Good singleton candidates:

- Logger instances.
- Configuration objects loaded at process startup.
- Database connection pools.
- Metrics clients.
- Feature flag clients that manage their own connection lifecycle.

Bad singleton candidates:

- Current user.
- Request body.
- Transaction object.
- Per-request authorization decisions.
- Mutable state that differs by tenant or request.

### Factory

A factory centralizes object creation. It can hide construction details, validate configuration, choose an implementation, or assemble dependencies.

```js
export function createEmailClient({ provider, apiKey }) {
  if (provider === 'console') {
    return {
      async send(message) {
        console.log('email', message);
      }
    };
  }

  if (provider === 'vendor') {
    return {
      async send(message) {
        const response = await fetch('https://email.example/send', {
          method: 'POST',
          headers: { authorization: `Bearer ${apiKey}` },
          body: JSON.stringify(message)
        });

        if (!response.ok) {
          throw new Error(`Email provider failed: ${response.status}`);
        }
      }
    };
  }

  throw new Error(`Unsupported email provider: ${provider}`);
}
```

The rest of the app asks for an email client without knowing provider-specific setup.

## Syntax/Examples

### Singleton Database Pool

A database pool should usually be created once per process and reused. Creating a new pool for every request can exhaust database connections.

```js
// db.js
import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000
});
```

```js
// users.repository.js
import { pool } from './db.js';

export async function findUserById(id) {
  const result = await pool.query('select id, email from users where id = $1', [id]);
  return result.rows[0] ?? null;
}
```

This is practical, but it couples the repository to the real pool. For tests, a factory can provide cleaner injection.

### Factory for Services

```js
export function createUserRepository({ pool }) {
  return {
    async findByEmail(email) {
      const result = await pool.query('select * from users where email = $1', [email]);
      return result.rows[0] ?? null;
    }
  };
}

export function createUserService({ userRepository, passwordHasher }) {
  return {
    async authenticate({ email, password }) {
      const user = await userRepository.findByEmail(email);
      if (!user) return null;

      const valid = await passwordHasher.verify(password, user.password_hash);
      return valid ? user : null;
    }
  };
}
```

This lets tests create the service with fakes:

```js
const userService = createUserService({
  userRepository: {
    async findByEmail() {
      return { id: 'u1', email: 'a@example.com', password_hash: 'hash' };
    }
  },
  passwordHasher: {
    async verify() {
      return true;
    }
  }
});
```

### Request-Scoped Factory

Some objects must be created per request. A common example is request context.

```js
import { randomUUID } from 'node:crypto';

export function createRequestContext(req) {
  return {
    requestId: req.headers['x-request-id'] ?? randomUUID(),
    userId: req.user?.id ?? null,
    startedAt: Date.now()
  };
}
```

Do not store this in a global singleton. Pass it through the call chain or use a carefully managed context API.

## Use Cases

Use Singleton when an object is expensive, process-wide, and safe to share. Use Factory when construction logic is complex or when the app must choose between implementations.

Common Node examples:

- `createApp(config)` builds an Express app for tests and production.
- `createPaymentClient(config)` chooses Stripe sandbox or live mode.
- `createRepository({ pool })` avoids hard-coding database clients.
- `createCache({ url })` returns Redis in production and memory cache in local development.

## Tradeoffs

Singletons are convenient but can hide dependencies. Hidden dependencies make tests brittle and make startup order harder to reason about. Factories are explicit but can add boilerplate if every tiny object gets a factory.

A balanced approach is to use singletons for true infrastructure clients and factories for business services that you want to test independently.

## Common Mistakes

- Creating database clients inside route handlers.
- Storing request data in module-level variables.
- Exporting a mutable singleton and changing it from many places.
- Writing a Java-style singleton class when a module export is enough.
- Using factories that only call `new SomeClass()` with no extra value.

## Practical Challenge

Create a `createAuditLogger({ writer, clock })` factory. The logger should write `actorId`, `action`, `resource`, and `createdAt`. In production, pass a database writer. In tests, pass an in-memory array writer and a fake clock.

## Recap

Creational patterns control object lifecycle. In Node.js, module caching makes singleton behavior common, so use it intentionally. Factories are especially useful for assembling services, choosing implementations, and keeping tests independent from real infrastructure.

