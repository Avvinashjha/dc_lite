# Adapter and Facade

Adapter and facade are structural patterns.

They help code work with other code through a cleaner interface.

They are similar, but they solve different problems.

- An adapter makes one interface look like another interface.
- A facade provides a simpler interface over complex code.

## Adapter Pattern

Use an adapter when existing code expects one shape, but a new dependency provides another.

Imagine your app expects a logger with an `info()` method.

```js
function saveUser(user, logger) {
  logger.info(`Saving user ${user.name}`);
}
```

Now suppose a third-party logger uses `log()` instead.

```js
const thirdPartyLogger = {
  log(level, message) {
    console.log(`[${level}] ${message}`);
  },
};
```

You can adapt it.

```js
function createLoggerAdapter(thirdPartyLogger) {
  return {
    info(message) {
      thirdPartyLogger.log("info", message);
    },
    error(message) {
      thirdPartyLogger.log("error", message);
    },
  };
}

const logger = createLoggerAdapter(thirdPartyLogger);

saveUser({ name: "Ada" }, logger);
```

The rest of the app keeps using the interface it already understands.

## Adapter for API Data

Adapters are also useful when server data does not match your app model.

```js
function adaptUserFromApi(apiUser) {
  return {
    id: apiUser.user_id,
    name: apiUser.full_name,
    active: apiUser.status === "active",
  };
}

const user = adaptUserFromApi({
  user_id: 1,
  full_name: "Ada Lovelace",
  status: "active",
});
```

The rest of the app can use `user.id`, `user.name`, and `user.active` consistently.

## Why Adapters Help

Adapters create a boundary.

If the API changes from `full_name` to `display_name`, you update the adapter instead of searching the whole codebase.

```js
function adaptUserFromApi(apiUser) {
  return {
    id: apiUser.user_id,
    name: apiUser.display_name,
    active: apiUser.status === "active",
  };
}
```

## Facade Pattern

A facade hides complex steps behind a simple function.

Imagine saving settings requires validation, serialization, storage, and notification.

```js
function saveSettings(settings) {
  validateSettings(settings);
  const serialized = JSON.stringify(settings);
  localStorage.setItem("settings", serialized);
  publishSettingsChanged(settings);
}
```

Calling code can use one clear operation.

```js
saveSettings({ theme: "dark", language: "en" });
```

The caller does not need to know every internal step.

## Facade Over fetch

```js
async function apiRequest(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

export function getUser(id) {
  return apiRequest(`/users/${id}`);
}

export function updateUser(id, changes) {
  return apiRequest(`/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });
}
```

This facade gives the rest of the app clear API functions.

It also keeps `fetch` details in one place.

## Adapter vs Facade

| Pattern | Main goal | Example |
| --- | --- | --- |
| Adapter | Convert one interface into another | Convert API fields from `user_id` to `id` |
| Facade | Simplify a complex subsystem | Expose `saveSettings()` instead of many steps |

An adapter is about compatibility.

A facade is about simplicity.

## Common Mistakes

### Letting Adapters Leak

If API field names like `user_id` spread through your app, the adapter boundary is not working.

Convert data near the edge.

### Creating a Facade That Does Too Much

A facade should simplify a coherent workflow.

It should not become a giant object that owns unrelated parts of the app.

### Hiding Important Errors

A facade should simplify usage, but not hide failures.

Throw useful errors or return meaningful results.

## Best Practices

- Place adapters near system boundaries, such as API clients or third-party integrations.
- Keep adapted shapes consistent with your app's internal model.
- Use facades to make common workflows easy and readable.
- Keep facade methods focused and named by user intent.
- Do not hide important behavior that callers need to understand.
- Add tests around adapters because external shapes often change.

## Summary

Adapters make incompatible interfaces work together.

Facades provide a simpler interface over complex code.

Both patterns are useful at boundaries: APIs, libraries, storage, browser features, and legacy code.

