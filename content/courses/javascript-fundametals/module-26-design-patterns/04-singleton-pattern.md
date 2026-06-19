# Singleton Pattern

The singleton pattern ensures there is only one shared instance of something.

In JavaScript, this often happens naturally through modules.

A singleton can be useful for shared services such as:

- app configuration
- logging
- analytics clients
- feature flag clients
- in-memory caches

But it should be used carefully because it can create hidden global state.

## Simple Module Singleton

ES modules are evaluated once, then reused by importers.

```js
// logger.js
function log(message) {
  console.log(`[app] ${message}`);
}

export const logger = {
  log,
};
```

Every file that imports `logger` receives the same object.

```js
import { logger } from "./logger.js";

logger.log("Application started");
```

This is often the simplest singleton style in JavaScript.

## Singleton With Private State

```js
// settingsStore.js
const settings = {
  theme: "light",
  language: "en",
};

export const settingsStore = {
  get(key) {
    return settings[key];
  },
  set(key, value) {
    settings[key] = value;
  },
};
```

The `settings` object is private to the module.

The exported `settingsStore` is shared.

## Class-Based Singleton

You may also see this pattern with classes.

```js
class ApiClient {
  static instance = null;

  constructor(baseUrl) {
    if (ApiClient.instance) {
      return ApiClient.instance;
    }

    this.baseUrl = baseUrl;
    ApiClient.instance = this;
  }

  get(path) {
    return fetch(`${this.baseUrl}${path}`);
  }
}

const clientA = new ApiClient("https://api.example.com");
const clientB = new ApiClient("https://api.example.com");

console.log(clientA === clientB); // true
```

This works, but it can be surprising because `new ApiClient()` may return an existing object.

In JavaScript, a module export is usually clearer.

## Lazy Initialization

Sometimes you want to create the shared instance only when it is first needed.

```js
let client = null;

export function getApiClient() {
  if (!client) {
    client = createApiClient({ baseUrl: "/api" });
  }

  return client;
}
```

This is useful when setup is expensive or depends on runtime configuration.

## The Main Risk: Hidden State

Singletons are convenient because any file can import the same instance.

That is also the danger.

```js
import { settingsStore } from "./settingsStore.js";

settingsStore.set("theme", "dark");
```

Another part of the app may observe that change without knowing where it came from.

This can make bugs harder to trace.

## Testing Problems

Singleton state can leak between tests.

```js
settingsStore.set("theme", "dark");

// A later test may still see "dark" unless the store is reset.
```

If a singleton holds mutable state, provide a controlled reset for tests or avoid singleton state entirely.

```js
export function resetSettingsForTest() {
  settings.theme = "light";
  settings.language = "en";
}
```

Only expose test helpers when your project has a clear convention for them.

## Prefer Dependency Injection for Replaceable Services

If code imports a singleton directly, it is tightly coupled to that implementation.

```js
import { logger } from "./logger.js";

export function saveUser(user) {
  logger.log(`Saving ${user.name}`);
}
```

Passing the dependency can make the function easier to test.

```js
export function saveUser(user, logger) {
  logger.log(`Saving ${user.name}`);
}
```

Now tests can pass a fake logger.

## When a Singleton Is Reasonable

A singleton can be reasonable when:

- there should truly be one shared instance
- the instance has little or no mutable state
- setup is expensive and should not be repeated
- the object represents app-wide infrastructure
- tests can reset or replace it cleanly

## When to Avoid a Singleton

Avoid a singleton when:

- it stores business data that changes often
- many unrelated files write to it
- tests become order-dependent
- it hides required inputs
- separate app instances need separate state

## Common Mistakes

### Using Singletons for Everything

Do not use a singleton just to avoid passing arguments.

Arguments make dependencies visible.

### Mixing Configuration and Runtime State

Configuration like `apiBaseUrl` is different from changing data like `currentUser`.

Be more careful with runtime state.

### Assuming One Instance Is Always Correct

In server-side JavaScript, one process may handle many users.

A singleton that stores the current user can leak data between requests.

## Best Practices

- Prefer module exports over complex singleton classes.
- Keep singleton state minimal.
- Avoid storing per-user or per-request data in a singleton.
- Make testing and resetting explicit.
- Consider dependency injection for services you may replace.
- Use singletons for infrastructure, not as a general state management shortcut.

## Summary

The singleton pattern provides one shared instance.

JavaScript modules make singleton-like values easy to create.

Use the pattern carefully because shared mutable state can make code harder to test, debug, and reason about.

