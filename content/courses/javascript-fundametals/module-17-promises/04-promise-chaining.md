# Promise Chaining

Promise chaining lets you run async steps in order without deeply nested callbacks.

```js
getUser()
  .then((user) => getOrders(user.id))
  .then((orders) => getOrderDetails(orders[0].id))
  .then((details) => {
    console.log(details);
  })
  .catch((error) => {
    console.log(error.message);
  });
```

Each `.then()` returns a new Promise.

That is what makes chaining possible.

## Chaining Normal Values

```js
Promise.resolve(5)
  .then((number) => number + 1)
  .then((number) => number * 2)
  .then((number) => {
    console.log(number); // 12
  });
```

Each return value becomes the input to the next `.then()`.

## Chaining Promises

```js
getUser()
  .then((user) => {
    return getOrders(user.id);
  })
  .then((orders) => {
    return getOrderDetails(orders[0].id);
  })
  .then((details) => {
    console.log(details);
  });
```

When a `.then()` returns a Promise, the next `.then()` waits.

This avoids nested callbacks.

## Avoid Nested `.then()`

Avoid this:

```js
getUser().then((user) => {
  getOrders(user.id).then((orders) => {
    getOrderDetails(orders[0].id).then((details) => {
      console.log(details);
    });
  });
});
```

This recreates callback hell with promises.

Prefer:

```js
getUser()
  .then((user) => getOrders(user.id))
  .then((orders) => getOrderDetails(orders[0].id))
  .then((details) => console.log(details));
```

## Error Flow in Chains

One `.catch()` can handle errors from the chain.

```js
getUser()
  .then((user) => getOrders(user.id))
  .then((orders) => getOrderDetails(orders[0].id))
  .catch((error) => {
    console.log("Chain failed:", error.message);
  });
```

If `getUser`, `getOrders`, or `getOrderDetails` rejects, control jumps to `.catch()`.

## Partial Error Recovery

You can recover from an error and continue.

```js
loadSettings()
  .catch(() => {
    return {
      theme: "light",
    };
  })
  .then((settings) => {
    console.log(settings.theme);
  });
```

The `.catch()` returns fallback settings.

The next `.then()` receives those settings.

## Rethrowing in a Chain

If you cannot recover, throw again.

```js
loadSettings()
  .catch((error) => {
    throw new Error(`Settings failed: ${error.message}`);
  })
  .catch((error) => {
    console.log(error.message);
  });
```

Rethrowing lets you add context while preserving failure flow.

## Sequential vs Parallel Chains

A promise chain is sequential when each step depends on the previous one.

```js
getUser()
  .then((user) => getOrders(user.id));
```

If tasks are independent, do not chain them unnecessarily.

Use `Promise.all()`:

```js
Promise.all([getUsers(), getProducts(), getSettings()])
  .then(([users, products, settings]) => {
    console.log(users, products, settings);
  });
```

## Best Practices

Return from `.then()` callbacks.

Keep chains flat.

Use one `.catch()` at a meaningful boundary.

Use `.catch()` earlier only when you intentionally recover from a specific failure.

Use `Promise.all()` for independent work.

Switch to `async` / `await` when the chain becomes easier to read that way.

## Common Mistakes

### Mistake 1: Missing `return`

```js
.then((user) => {
  getOrders(user.id);
})
```

The next `.then()` receives `undefined`.

### Mistake 2: Nesting Promises

Nested `.then()` calls are harder to read and handle.

Flatten the chain by returning promises.

### Mistake 3: Catching Too Early

If you catch too early and return a fallback accidentally, later code may run with bad data.

Catch where you can respond intentionally.

## Summary

Promise chaining creates readable sequences of async work.

- `.then()` returns a new Promise.
- Returned values flow to the next `.then()`.
- Returned promises make the chain wait.
- Keep promise chains flat.
- Use `.catch()` for chain errors.
- Use fallback returns only when recovery is safe.
- Use `Promise.all()` for independent async tasks.
