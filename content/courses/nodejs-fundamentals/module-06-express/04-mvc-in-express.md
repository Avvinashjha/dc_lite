# MVC in Express

## Why It Matters

Express lets you put everything in one file, but production APIs need boundaries. MVC is a simple mental model: routes map HTTP to controllers, controllers coordinate use cases, models or repositories handle data, and views render HTML when needed.

## Core Concepts

- Routes should describe URL shape and middleware, not contain all business logic.
- Controllers translate HTTP input into service calls and translate results into HTTP responses.
- Services hold business rules that should be testable without Express.
- Repositories or models isolate database details.
- Views are optional in API-only apps but useful for server-rendered pages.

## Flow to Remember

Request data is parsed by middleware, route parameters reach a controller, the controller calls a service, the service uses a repository, and the controller sends a response.

## Syntax and Examples

```js
// routes/users.routes.js
import { Router } from 'express';
import { createUser } from '../controllers/users.controller.js';

export const usersRouter = Router();
usersRouter.post('/users', createUser);

// controllers/users.controller.js
import { registerUser } from '../services/users.service.js';

export async function createUser(req, res, next) {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ data: user });
  } catch (error) {
    next(error);
  }
}
```

## Use Cases and Tradeoffs

- Use MVC-style separation when route handlers start mixing validation, business rules, SQL, and response formatting.
- Keep pure business decisions in services so unit tests do not need HTTP setup.
- Use controllers as thin adapters; they are allowed to know Express exists.
- For small apps, use fewer folders, but keep the same separation of responsibilities.

## Common Mistakes

- Creating huge controller classes that become a second application layer.
- Letting services depend on `req` and `res`, which makes them hard to reuse.
- Adding abstractions before the app has more than one real use case.
- Returning database rows directly when public API fields need a stable contract.

## Practical Challenge

Refactor a single-file `/orders` API into `routes`, `controllers`, and `services`. Unit test the service without importing Express.

## Recap

- MVC is a boundary pattern, not a folder-count requirement.
- Controllers adapt HTTP to application logic.
- Services become easier to test when they do not depend on Express.

