# Routing

## Why It Matters

Routes are the public contract of a web application. A good route makes the resource, action, input, and output obvious. A messy route leaks internal implementation details and becomes hard to version, secure, and test.

## Core Concepts

- A route is selected by HTTP method, path pattern, and registration order.
- `req.params` holds path variables, `req.query` holds URL query parameters, and `req.body` holds parsed request payloads.
- Route handlers can be chained for authentication, validation, and controller logic.
- `express.Router()` lets you group related endpoints and mount them under a prefix.
- Specific routes should be registered before broad dynamic routes.

## Flow to Remember

Express walks middleware and route layers in order. When the method and path match, it calls the handler. A handler ends the response or calls `next()` to continue.

## Syntax and Examples

```js
import express from 'express';

const app = express();
const users = express.Router();

users.get('/', (req, res) => {
  const limit = Number(req.query.limit ?? 20);
  res.json({ limit, data: [] });
});

users.get('/:userId', (req, res) => {
  res.json({ id: req.params.userId, name: 'Asha' });
});

users.patch('/:userId', express.json(), (req, res) => {
  res.json({ id: req.params.userId, changes: req.body });
});

app.use('/api/users', users);
app.listen(3000);
```

## Use Cases and Tradeoffs

- Use nested routers for resources such as users, orders, projects, and admin features.
- Use query parameters for filtering, searching, sorting, pagination, and optional modifiers.
- Use path parameters for resource identity, not for arbitrary command names.
- Prefer HTTP methods over action words: `POST /orders` instead of `GET /createOrder`.

## Common Mistakes

- Defining `/users/:id` before `/users/me`, causing `me` to be treated as an ID.
- Putting secrets or large payloads in query strings.
- Letting route files reach directly into database drivers everywhere.
- Using `GET` for state-changing actions, which breaks caching and crawler safety.

## Practical Challenge

Build a `projects` router with list, create, read, update, and delete endpoints. Include one route-level middleware function that rejects missing `x-request-id` headers.

## Recap

- Routes define the API shape.
- Routers keep related endpoints together.
- Correct method and path choices make APIs easier to learn and safer to operate.

