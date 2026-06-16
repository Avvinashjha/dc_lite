# Project Structure for Express APIs

## Why It Matters

A project structure should make change easy. When files are grouped around responsibilities, adding validation, tests, database changes, and new endpoints does not require hunting through a single large server file.

## Core Concepts

- Entry files start the server and handle process concerns.
- App files create Express middleware and routes without listening on a port.
- Routes define HTTP paths and middleware.
- Controllers adapt HTTP to services.
- Services implement business behavior.
- Repositories or database modules isolate persistence.

## Flow to Remember

`server.js` loads config and starts listening, `app.js` builds the Express app, routers call controllers, controllers call services, and services call repositories or external clients.

## Syntax and Examples

```js
src/
  app.js
  server.js
  config/env.js
  routes/users.routes.js
  controllers/users.controller.js
  services/users.service.js
  repositories/users.repository.js
  middleware/error-handler.js
  tests/users.test.js

// src/app.js
import express from 'express';
import { usersRouter } from './routes/users.routes.js';
import { errorHandler } from './middleware/error-handler.js';

export function createApp() {
  const app = express();
  app.use(express.json({ limit: '100kb' }));
  app.use('/api', usersRouter);
  app.use(errorHandler);
  return app;
}
```

## Use Cases and Tradeoffs

- Separate `createApp()` from `listen()` so API tests can import the app without opening a port.
- Group by feature when the codebase grows beyond a few resources.
- Keep shared middleware and utilities small and documented.
- Use dependency injection for services that need replaceable database or HTTP clients in tests.

## Common Mistakes

- Starting the server as a side effect of importing `app.js`.
- Creating folders named by architecture but filling them with unrelated code.
- Sharing mutable globals for request-specific data.
- Letting database modules import Express response objects.

## Practical Challenge

Create a minimal API skeleton using `createApp()` and `startServer()`. Add one feature folder for `tasks` with route, controller, service, and repository files.

## Recap

- Structure should reduce coupling, not satisfy a template.
- `app` creation and server startup should be separate.
- Good boundaries make tests and future features simpler.

