# Dependency Injection Basics

Dependency injection means giving a function, object, or class the dependencies it needs instead of making it create or import them directly.

A dependency is something code relies on.

Examples:

- a logger
- an API client
- a database connection
- a date provider
- a configuration object
- a storage service

## Hard-Coded Dependency

```js
import { apiClient } from "./apiClient.js";

export async function loadUser(id) {
  return apiClient.get(`/users/${id}`);
}
```

This works, but `loadUser` is tied to that exact `apiClient` module.

Testing it may require mocking imports or making real requests.

## Injected Dependency

```js
export async function loadUser(id, apiClient) {
  return apiClient.get(`/users/${id}`);
}
```

Now the caller provides the dependency.

```js
const user = await loadUser(1, apiClient);
```

A test can pass a fake.

```js
const fakeApiClient = {
  async get(path) {
    return { id: 1, name: "Test User", path };
  },
};

const user = await loadUser(1, fakeApiClient);
```

## Object Configuration

When a function needs several dependencies, use an options object.

```js
function createUserService({ apiClient, logger }) {
  return {
    async loadUser(id) {
      logger.info(`Loading user ${id}`);
      return apiClient.get(`/users/${id}`);
    },
  };
}
```

This is a factory that receives dependencies and returns a service.

## Injecting Time

Time is a dependency too.

```js
function createSession(userId, now = () => Date.now()) {
  return {
    userId,
    createdAt: now(),
  };
}
```

Tests can pass a stable time provider.

```js
const session = createSession("user-1", () => 1000);

console.log(session.createdAt); // 1000
```

This avoids tests that depend on the actual clock.

## Injecting Storage

```js
function createSettingsService(storage) {
  return {
    save(settings) {
      storage.setItem("settings", JSON.stringify(settings));
    },
    load() {
      const value = storage.getItem("settings");
      return value ? JSON.parse(value) : null;
    },
  };
}

const settingsService = createSettingsService(localStorage);
```

In tests, pass a memory storage object instead of `localStorage`.

## Dependency Injection With Classes

```js
class UserService {
  constructor(apiClient, logger) {
    this.apiClient = apiClient;
    this.logger = logger;
  }

  async loadUser(id) {
    this.logger.info(`Loading user ${id}`);
    return this.apiClient.get(`/users/${id}`);
  }
}
```

Constructor injection makes the class dependencies visible.

## Benefits

Dependency injection helps with:

- testing
- replacing implementations
- reducing hidden coupling
- making dependencies visible
- separating business logic from infrastructure

## Tradeoffs

Injection can also add complexity.

This is too much for simple code:

```js
function add(a, b, mathService) {
  return mathService.add(a, b);
}
```

If a dependency is stable and simple, direct use may be fine.

Use injection where replacement or testing matters.

## Dependency Injection vs Singleton

A singleton is imported and shared.

```js
import { logger } from "./logger.js";
```

An injected dependency is passed in.

```js
function saveUser(user, logger) {
  logger.info(`Saving ${user.name}`);
}
```

Singletons are convenient.

Injected dependencies are more explicit and often easier to test.

## Common Mistakes

### Passing Too Many Dependencies

If a function needs many services, it may be doing too much.

Consider splitting responsibilities.

### Injecting Everything

Do not inject simple language features or stable utilities just to follow a pattern.

### Unclear Dependency Shape

Callers need to know what methods a dependency must provide.

Use clear names and keep the expected interface small.

## Best Practices

- Inject dependencies that talk to the outside world.
- Inject dependencies that need to be replaced in tests.
- Use options objects for multiple dependencies.
- Keep dependency interfaces small.
- Use factories to wire services together.
- Do not overuse injection for simple pure functions.

## Summary

Dependency injection makes required services visible by passing them into code.

It reduces hidden coupling and makes tests easier.

Use it for replaceable or external dependencies, and keep the approach simple enough for the problem.

