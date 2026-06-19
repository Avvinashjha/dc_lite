# Node.js Patterns (Middleware, DI, Repository)

## Why It Matters

Node.js backend systems often succeed or fail based on structure. Express makes it easy to start with route handlers, but production apps need clear places for validation, authorization, business logic, data access, error handling, and infrastructure.

Middleware, dependency injection, and repository are practical patterns that keep this structure understandable without requiring a heavy framework.

## Core Concepts

### Middleware

Middleware is a chain of functions that process a request before a response is sent. Each function can read or modify the request, return a response, or pass control to the next function.

Good middleware responsibilities:

- Parse request bodies.
- Attach request IDs.
- Authenticate users.
- Enforce rate limits.
- Log requests.
- Convert thrown errors into HTTP responses.

Avoid putting business use cases into middleware. Middleware should prepare the request environment, not become the application service layer.

### Dependency Injection

Dependency injection means a module receives the things it depends on instead of importing or constructing them directly. In Node, this can be as simple as passing an object into a factory.

```js
export function createArticleService({ articleRepository, clock }) {
  return {
    async publish({ id, authorId }) {
      const article = await articleRepository.findById(id);
      if (!article || article.authorId !== authorId) {
        const error = new Error('Article not found');
        error.statusCode = 404;
        throw error;
      }

      return articleRepository.update(id, {
        status: 'published',
        publishedAt: clock.now()
      });
    }
  };
}
```

This service can be tested with fake repositories and clocks.

### Repository

A repository hides persistence details behind application-specific methods. It should speak in domain terms, not database table mechanics.

```js
export function createArticleRepository({ pool }) {
  return {
    async findById(id) {
      const result = await pool.query(
        'select id, author_id as "authorId", status from articles where id = $1',
        [id]
      );
      return result.rows[0] ?? null;
    },

    async update(id, patch) {
      const result = await pool.query(
        'update articles set status = $2, published_at = $3 where id = $1 returning *',
        [id, patch.status, patch.publishedAt]
      );
      return result.rows[0];
    }
  };
}
```

## Syntax/Examples

### Express App Composition

```js
import express from 'express';
import { randomUUID } from 'node:crypto';

function requestIdMiddleware(req, res, next) {
  req.requestId = req.headers['x-request-id'] ?? randomUUID();
  res.setHeader('x-request-id', req.requestId);
  next();
}

function requireUser(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Missing credentials' });
  }

  req.user = { id: 'demo-user' };
  next();
}

function createArticleRouter({ articleService }) {
  const router = express.Router();

  router.post('/:id/publish', requireUser, async (req, res, next) => {
    try {
      const article = await articleService.publish({
        id: req.params.id,
        authorId: req.user.id
      });

      res.json(article);
    } catch (error) {
      next(error);
    }
  });

  return router;
}

function errorMiddleware(error, req, res, next) {
  const statusCode = error.statusCode ?? 500;
  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal server error' : error.message,
    requestId: req.requestId
  });
}

export function createApp({ articleService }) {
  const app = express();
  app.use(express.json());
  app.use(requestIdMiddleware);
  app.use('/articles', createArticleRouter({ articleService }));
  app.use(errorMiddleware);
  return app;
}
```

The app composition point wires dependencies once. Route files stay focused on HTTP. Services stay focused on use cases. Repositories stay focused on data access.

## Use Cases

- Middleware: request pipeline concerns that apply to many routes.
- Dependency injection: services that need testable infrastructure boundaries.
- Repository: complex queries, persistence changes, and database-specific logic.

A common production layout is:

```text
src/
  app.js
  server.js
  modules/
    articles/
      articles.router.js
      articles.service.js
      articles.repository.js
```

`server.js` starts sockets and handles shutdown. `app.js` composes Express. Feature modules own route, service, and repository code.

## Tradeoffs

Middleware order matters. A route can fail because authentication runs before parsing, or error middleware is registered too early. Keep app setup readable and test important route behavior.

Dependency injection can become noisy if every function receives a huge dependency object. Inject dependencies at module boundaries and pass normal arguments inside the module.

Repositories can become dumping grounds. Keep them focused on persistence. Business decisions belong in services.

## Common Mistakes

- Putting database calls directly in every route handler.
- Using middleware for business workflows that should be explicit service calls.
- Hiding dependencies through imports, then struggling to mock tests.
- Creating generic repositories with methods like `findAnythingByAnyField`.
- Returning raw database rows with inconsistent field names across the app.

## Practical Challenge

Build a small `tasks` module with `tasks.router.js`, `tasks.service.js`, and `tasks.repository.js`. The route should validate HTTP input, the service should enforce ownership rules, and the repository should handle SQL or in-memory persistence.

## Recap

Node.js patterns are often simple composition patterns. Middleware organizes the request pipeline, dependency injection makes services testable, and repositories protect business logic from persistence details. Together, they create a backend structure that can grow without turning route handlers into the whole application.

