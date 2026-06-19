# Decorator and Wrapper Pattern

A decorator adds behavior to an existing function or object without changing its original code.

In JavaScript, this is often done with wrapper functions.

A wrapper calls the original behavior and adds something before, after, or around it.

## Wrapping a Function

```js
function greet(name) {
  return `Hello, ${name}`;
}

function withLogging(fn) {
  return function wrappedFunction(...args) {
    console.log("Calling function", args);
    const result = fn(...args);
    console.log("Function returned", result);
    return result;
  };
}

const loggedGreet = withLogging(greet);

console.log(loggedGreet("Ada"));
```

`withLogging` decorates `greet` with logging.

The original `greet` function stays simple.

## Timing a Function

```js
function withTiming(fn) {
  return function timedFunction(...args) {
    const start = performance.now();

    try {
      return fn(...args);
    } finally {
      const duration = performance.now() - start;
      console.log(`Took ${duration.toFixed(2)}ms`);
    }
  };
}
```

The `finally` block runs whether the wrapped function succeeds or throws.

## Wrapping Async Functions

Async wrappers should `await` the original function.

```js
function withAsyncTiming(fn) {
  return async function timedAsyncFunction(...args) {
    const start = performance.now();

    try {
      return await fn(...args);
    } finally {
      const duration = performance.now() - start;
      console.log(`Took ${duration.toFixed(2)}ms`);
    }
  };
}
```

Without `await`, the timing might measure only how long it took to create the Promise.

## Authorization Wrapper

```js
function requireRole(fn, requiredRole) {
  return function protectedAction(user, ...args) {
    if (user.role !== requiredRole) {
      throw new Error("Forbidden");
    }

    return fn(user, ...args);
  };
}

function deletePost(user, postId) {
  console.log(`${user.name} deleted post ${postId}`);
}

const deletePostAsAdmin = requireRole(deletePost, "admin");
```

The authorization logic is separate from the action.

## Decorating Objects

You can wrap an object by returning another object with the same methods.

```js
function withCachedGet(apiClient) {
  const cache = new Map();

  return {
    async get(path) {
      if (cache.has(path)) {
        return cache.get(path);
      }

      const result = await apiClient.get(path);
      cache.set(path, result);
      return result;
    },
    post(path, body) {
      return apiClient.post(path, body);
    },
  };
}
```

The wrapped client still has `get()` and `post()`, but `get()` now uses a cache.

## Built-In Examples

JavaScript developers commonly use wrappers for:

- debouncing event handlers
- throttling scroll handlers
- memoizing expensive functions
- logging function calls
- measuring performance
- adding retries to async operations
- validating arguments

For example, a debounce helper decorates a function with timing behavior.

```js
function debounce(fn, delay) {
  let timeoutId;

  return function debounced(...args) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
```

## Preserving `this`

If the original function depends on `this`, use `apply()`.

```js
function withLogging(fn) {
  return function wrappedFunction(...args) {
    console.log("Calling", fn.name);
    return fn.apply(this, args);
  };
}
```

This passes the caller's `this` value to the original function.

## Decorator vs Mutation

A wrapper usually returns a new function or object.

That is safer than directly changing the original.

```js
const loggedSave = withLogging(save);
```

The original `save` is still available.

This makes wrappers easy to compose.

```js
const enhancedSave = withTiming(withLogging(save));
```

## Common Mistakes

### Forgetting to Return the Result

```js
function badWrapper(fn) {
  return function (...args) {
    fn(...args);
  };
}
```

This wrapper always returns `undefined`.

Usually you should return the original result.

### Breaking Async Behavior

If the original function is async, the wrapper should return or await the Promise.

### Changing the Interface

A decorated function should usually accept the same inputs and produce the same kind of output.

If it changes the interface, it may be an adapter instead.

## Best Practices

- Keep wrappers small and focused.
- Preserve the original function's return value.
- Use `apply()` when preserving `this` matters.
- Handle async functions intentionally.
- Prefer returning a wrapped function instead of mutating the original.
- Avoid stacking so many wrappers that debugging becomes confusing.

## Summary

The decorator or wrapper pattern adds behavior around existing code.

It is useful for logging, timing, authorization, caching, retries, and validation.

Good wrappers preserve the original interface while adding one clear behavior.

