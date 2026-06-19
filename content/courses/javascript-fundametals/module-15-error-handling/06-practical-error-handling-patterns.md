# Practical Error Handling Patterns

Knowing `try`, `catch`, `throw`, and custom errors is important.

The next step is knowing where to handle errors in real code.

Good error handling is not about wrapping everything in `try...catch`.

It is about handling errors at the right boundary.

## Handle Errors Where You Can Respond

Do not catch an error unless you can do something useful.

Useful responses include:

- show a message to the user
- return a safe fallback
- retry an operation
- log useful debugging information
- add context and rethrow
- clean up resources

Bad pattern:

```js
try {
  saveUser(user);
} catch (error) {
  // ignored
}
```

Better:

```js
try {
  saveUser(user);
} catch (error) {
  console.log("Could not save user:", error.message);
  showMessage("Could not save user. Please try again.");
}
```

## Validate at Boundaries

Boundaries are places where uncertain data enters your code.

Examples:

- user input
- API responses
- URL parameters
- local storage
- JSON files
- third-party libraries

Validate data at boundaries.

```js
function parseUser(json) {
  const data = JSON.parse(json);

  if (!data.name) {
    throw new Error("User name is required");
  }

  return data;
}
```

This keeps invalid data from spreading through the application.

## Return Fallbacks for Recoverable Problems

Some failures can be handled with a default value.

```js
function loadSettings(json) {
  try {
    return JSON.parse(json);
  } catch (error) {
    return {
      theme: "light",
      notifications: true,
    };
  }
}
```

This makes sense if default settings are acceptable.

But do not use fallbacks when they hide important problems.

## Add Context Before Rethrowing

Low-level errors may not have enough context.

```js
function loadConfig(json) {
  try {
    return JSON.parse(json);
  } catch (error) {
    throw new Error(`Could not load config: ${error.message}`);
  }
}
```

The new error explains what operation failed.

In advanced code, you may preserve the original error using the `cause` option:

```js
throw new Error("Could not load config", { cause: error });
```

This lets debugging tools keep the original cause.

## Error Boundaries in Functions

Small helper functions often should throw errors instead of handling everything themselves.

```js
function parseJson(json) {
  return JSON.parse(json);
}
```

The calling function may know what fallback or message is appropriate.

```js
function loadProfile(json) {
  try {
    return parseJson(json);
  } catch (error) {
    return null;
  }
}
```

Handle errors at the level that understands the user impact.

## Logging Errors

Logging is useful for developers.

User messages are useful for users.

They are not the same thing.

```js
try {
  processPayment(order);
} catch (error) {
  console.error(error);
  showMessage("Payment failed. Please try again.");
}
```

Do not show raw technical error messages to users if they reveal internal details.

## Synchronous vs Asynchronous Errors

This module focuses mostly on synchronous errors.

```js
try {
  JSON.parse("{ bad json }");
} catch (error) {
  console.log("Caught");
}
```

Asynchronous errors require different patterns.

With promises:

```js
fetch("/api/user")
  .then((response) => response.json())
  .catch((error) => {
    console.log("Request failed");
  });
```

With `async/await`:

```js
async function loadUser() {
  try {
    const response = await fetch("/api/user");
    return await response.json();
  } catch (error) {
    console.log("Request failed");
    return null;
  }
}
```

You will study this in depth in the asynchronous modules.

## Avoid Over-Handling

Too many catch blocks can make errors harder to trace.

```js
function a() {
  try {
    b();
  } catch (error) {
    return null;
  }
}
```

If every layer catches and replaces errors with `null`, debugging becomes difficult.

Let errors travel upward until they reach a place that can respond meaningfully.

## Best Practices

Catch errors where you can respond meaningfully.

Validate data at boundaries.

Use fallbacks only when safe.

Add context before rethrowing.

Log technical details for developers.

Show friendly messages to users.

Do not silently ignore errors.

Understand that async errors need async handling patterns.

## Common Mistakes

### Mistake 1: Wrapping Everything in One Giant `try`

```js
try {
  // entire application
} catch (error) {
  console.log("Something went wrong");
}
```

This hides where the problem happened.

### Mistake 2: Returning `null` for Every Error

```js
catch (error) {
  return null;
}
```

Sometimes this is fine.

But if used everywhere, it hides serious bugs.

### Mistake 3: Showing Raw Error Messages to Users

```js
showMessage(error.stack);
```

Stack traces are for developers, not users.

## Summary

Practical error handling is about choosing the right boundary.

- Catch errors where you can respond.
- Validate uncertain data at boundaries.
- Use fallbacks only when they are safe.
- Add context before rethrowing.
- Log technical details separately from user messages.
- Avoid silently ignoring errors.
- Async errors require promise or `async/await` patterns.
