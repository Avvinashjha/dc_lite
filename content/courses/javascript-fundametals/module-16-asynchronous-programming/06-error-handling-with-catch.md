# Error Handling with catch

Asynchronous code can fail.

Network requests can fail.

JSON parsing can fail.

A Promise can reject.

You need to handle those failures clearly.

## Promise `.catch()`

Use `.catch()` to handle a rejected Promise.

```js
loadUser()
  .then((user) => {
    console.log(user.name);
  })
  .catch((error) => {
    console.log("Could not load user");
  });
```

If `loadUser()` rejects, the `.catch()` callback runs.

## One `.catch()` Can Handle a Chain

```js
getUser()
  .then((user) => getOrders(user.id))
  .then((orders) => getOrderDetails(orders[0].id))
  .then((details) => {
    console.log(details);
  })
  .catch((error) => {
    console.log("Something failed:", error.message);
  });
```

If any step rejects or throws, the chain jumps to `.catch()`.

## Throwing Inside `.then()`

Throwing inside `.then()` turns into a rejected Promise.

```js
Promise.resolve("data")
  .then(() => {
    throw new Error("Failed inside then");
  })
  .catch((error) => {
    console.log(error.message);
  });
```

Output:

```text
Failed inside then
```

## `try...catch` With `async` / `await`

With `async` / `await`, use normal `try...catch`.

```js
async function loadUser() {
  try {
    const user = await getUser();
    console.log(user.name);
  } catch (error) {
    console.log("Could not load user");
  }
}
```

If `getUser()` rejects, the error is caught.

## Returning Fallback Values

Sometimes a fallback is safe.

```js
async function loadSettings() {
  try {
    return await fetchSettings();
  } catch (error) {
    return {
      theme: "light",
      notifications: true,
    };
  }
}
```

This is reasonable if default settings are acceptable.

Do not use fallbacks to hide important failures.

## Rethrowing Async Errors

Sometimes you add context and rethrow.

```js
async function loadUserProfile(userId) {
  try {
    return await fetchUserProfile(userId);
  } catch (error) {
    throw new Error(`Could not load profile for user ${userId}: ${error.message}`);
  }
}
```

The caller can catch the new error.

## `.finally()` With Promises

Promise `.finally()` runs after success or failure.

```js
setLoading(true);

loadUser()
  .then((user) => {
    showUser(user);
  })
  .catch((error) => {
    showError("Could not load user");
  })
  .finally(() => {
    setLoading(false);
  });
```

This is useful for cleanup.

With `async` / `await`:

```js
async function run() {
  setLoading(true);

  try {
    const user = await loadUser();
    showUser(user);
  } catch (error) {
    showError("Could not load user");
  } finally {
    setLoading(false);
  }
}
```

## Unhandled Rejections

If a Promise rejects and nothing catches it, you get an unhandled rejection.

```js
loadUser(); // rejects, but no catch
```

Handle expected failures:

```js
loadUser().catch((error) => {
  console.log(error.message);
});
```

or:

```js
try {
  await loadUser();
} catch (error) {
  console.log(error.message);
}
```

## Best Practices

Use `.catch()` for promise chains.

Use `try...catch` with `async` / `await`.

Catch errors where you can respond meaningfully.

Use `finally` for cleanup like loading state.

Rethrow unexpected errors or errors the current function cannot handle.

Avoid swallowing async errors silently.

## Common Mistakes

### Mistake 1: Forgetting to Await Inside try

```js
try {
  loadUser();
} catch (error) {
  console.log("Caught");
}
```

If `loadUser()` returns a rejecting Promise, this does not catch it.

Correct:

```js
try {
  await loadUser();
} catch (error) {
  console.log("Caught");
}
```

### Mistake 2: Catching and Returning Nothing

```js
async function loadUser() {
  try {
    return await fetchUser();
  } catch (error) {
    console.log(error.message);
  }
}
```

This returns `undefined` on failure.

That may be okay, but it should be intentional.

### Mistake 3: Showing Raw Error Details to Users

Log technical details for developers.

Show friendly messages to users.

## Summary

Async errors are handled through promises or `async` / `await`.

- Use `.catch()` for promise chains.
- Use `try...catch` around awaited promises.
- Throwing inside `.then()` creates a rejection.
- Use `.finally()` or `finally` for cleanup.
- Do not leave expected rejections unhandled.
- Catch errors where you can respond meaningfully.
