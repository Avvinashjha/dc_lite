# then, catch, and finally

Promises are consumed with three main methods:

- `.then()`
- `.catch()`
- `.finally()`

These methods let you respond to success, failure, and cleanup.

## `.then()`

`.then()` runs when a Promise fulfills.

```js
Promise.resolve("Alice").then((name) => {
  console.log(name); // Alice
});
```

The callback receives the fulfilled value.

```js
fetchUser().then((user) => {
  console.log(user.name);
});
```

## Returning From `.then()`

The value returned from `.then()` becomes the value for the next `.then()`.

```js
Promise.resolve(2)
  .then((number) => number * 2)
  .then((number) => {
    console.log(number); // 4
  });
```

If you return a Promise, the chain waits for it.

```js
getUser()
  .then((user) => {
    return getOrders(user.id);
  })
  .then((orders) => {
    console.log(orders);
  });
```

This is one of the most important promise rules.

## `.catch()`

`.catch()` runs when a Promise rejects.

```js
Promise.reject(new Error("Failed")).catch((error) => {
  console.log(error.message); // Failed
});
```

`.catch()` can handle rejections from earlier in the chain.

```js
getUser()
  .then((user) => getOrders(user.id))
  .then((orders) => getOrderDetails(orders[0].id))
  .catch((error) => {
    console.log("Something failed:", error.message);
  });
```

## Throwing Inside `.then()`

If a `.then()` callback throws, the chain becomes rejected.

```js
Promise.resolve("data")
  .then(() => {
    throw new Error("Processing failed");
  })
  .catch((error) => {
    console.log(error.message); // Processing failed
  });
```

This gives promise chains consistent error behavior.

## Recovering in `.catch()`

If `.catch()` returns a value, the next `.then()` receives it.

```js
Promise.reject(new Error("Failed"))
  .catch(() => {
    return "Fallback";
  })
  .then((value) => {
    console.log(value); // Fallback
  });
```

This is useful when a fallback is safe.

If you cannot recover, rethrow.

```js
loadConfig()
  .catch((error) => {
    throw new Error(`Could not load config: ${error.message}`);
  });
```

## `.finally()`

`.finally()` runs after the Promise settles, whether fulfilled or rejected.

```js
loadData()
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log(error.message);
  })
  .finally(() => {
    console.log("Finished");
  });
```

Use `.finally()` for cleanup:

- hide loading spinners
- close temporary UI
- reset state
- log completion

## `.finally()` Does Not Receive the Value

```js
Promise.resolve("Done")
  .finally((value) => {
    console.log(value); // undefined
  })
  .then((value) => {
    console.log(value); // Done
  });
```

`.finally()` is for cleanup, not transforming values.

## Order Matters

```js
Promise.reject(new Error("Failed"))
  .finally(() => {
    console.log("Cleanup");
  })
  .catch((error) => {
    console.log(error.message);
  });
```

Output:

```text
Cleanup
Failed
```

`.finally()` runs, then the rejection continues to `.catch()`.

## Best Practices

Use `.then()` for fulfilled values.

Use `.catch()` for rejected promises.

Return values or promises from `.then()` when chaining.

Use `.finally()` for cleanup only.

Rethrow from `.catch()` if the error is not handled.

Avoid swallowing errors accidentally.

## Common Mistakes

### Mistake 1: Forgetting to Return in `.then()`

```js
getUser()
  .then((user) => {
    getOrders(user.id);
  })
  .then((orders) => {
    console.log(orders); // undefined
  });
```

Return the Promise:

```js
getUser()
  .then((user) => getOrders(user.id))
  .then((orders) => console.log(orders));
```

### Mistake 2: Using `.finally()` to Transform Data

Use `.then()` to transform data.

Use `.finally()` for cleanup.

### Mistake 3: Catching and Hiding Every Error

```js
.catch(() => {})
```

This makes debugging harder.

Handle or rethrow intentionally.

## Summary

Promise methods control success, failure, and cleanup.

- `.then()` handles fulfilled values.
- Returned values flow to the next `.then()`.
- Returned promises are awaited by the chain.
- `.catch()` handles rejections.
- Throwing inside `.then()` rejects the chain.
- `.finally()` runs after success or failure.
- `.finally()` is for cleanup, not transformation.
