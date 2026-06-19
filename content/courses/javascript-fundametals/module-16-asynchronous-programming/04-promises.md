# Promises

A Promise represents an asynchronous operation that will finish later.

It can end in one of two main ways:

- fulfilled: the operation succeeded
- rejected: the operation failed

```js
const promise = fetch("/api/user");
```

The request does not finish immediately.

The Promise represents the future result.

## Promise States

A Promise has three states:

| State | Meaning |
| --- | --- |
| pending | still waiting |
| fulfilled | completed successfully |
| rejected | failed |

Once a Promise is fulfilled or rejected, it is settled.

## Creating a Promise

```js
const promise = new Promise((resolve, reject) => {
  const success = true;

  if (success) {
    resolve("Done");
  } else {
    reject(new Error("Failed"));
  }
});
```

`resolve` fulfills the Promise.

`reject` rejects the Promise.

Most of the time, you will consume promises from APIs instead of creating them manually.

## Using `.then()`

Use `.then()` to handle a fulfilled Promise.

```js
const promise = Promise.resolve("Done");

promise.then((value) => {
  console.log(value); // Done
});
```

The callback runs when the Promise is fulfilled.

## Using `.catch()`

Use `.catch()` to handle a rejected Promise.

```js
const promise = Promise.reject(new Error("Failed"));

promise.catch((error) => {
  console.log(error.message); // Failed
});
```

`.catch()` is the promise version of handling failure.

## Chaining Promises

`.then()` returns a new Promise, so you can chain steps.

```js
getUser(userId)
  .then((user) => getOrders(user.id))
  .then((orders) => getOrderDetails(orders[0].id))
  .then((details) => {
    console.log(details);
  })
  .catch((error) => {
    console.log(error.message);
  });
```

If any step rejects, control jumps to `.catch()`.

## Returning Values From `.then()`

If you return a normal value from `.then()`, it becomes the value for the next `.then()`.

```js
Promise.resolve(2)
  .then((number) => number * 2)
  .then((number) => {
    console.log(number); // 4
  });
```

If you return another Promise, the chain waits for it.

```js
getUser()
  .then((user) => fetch(`/api/orders/${user.id}`))
  .then((response) => response.json());
```

## Promise `.finally()`

Promises also have `.finally()`.

```js
loadData()
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log(error.message);
  })
  .finally(() => {
    console.log("Finished loading");
  });
```

It runs after fulfillment or rejection.

This is useful for cleanup, like hiding a loading spinner.

## Promise Errors

Throwing inside `.then()` rejects the next Promise.

```js
Promise.resolve("data")
  .then(() => {
    throw new Error("Something failed");
  })
  .catch((error) => {
    console.log(error.message);
  });
```

This lets errors travel through the chain.

## Best Practices

Return promises from `.then()` callbacks when the next step depends on them.

Use `.catch()` at a meaningful boundary.

Avoid deeply nested `.then()` calls.

Use `async` / `await` for readability when promise chains become long.

Do not forget that Promise code runs later.

## Common Mistakes

### Mistake 1: Forgetting to Return a Promise

```js
getUser()
  .then((user) => {
    getOrders(user.id);
  })
  .then((orders) => {
    console.log(orders); // undefined
  });
```

Correct:

```js
getUser()
  .then((user) => {
    return getOrders(user.id);
  })
  .then((orders) => {
    console.log(orders);
  });
```

### Mistake 2: Handling Errors Too Late or Not at All

Always handle expected rejections.

```js
loadData().catch((error) => {
  console.log(error.message);
});
```

### Mistake 3: Nesting `.then()` Like Callbacks

```js
getUser().then((user) => {
  getOrders(user.id).then((orders) => {
    console.log(orders);
  });
});
```

Prefer chaining:

```js
getUser()
  .then((user) => getOrders(user.id))
  .then((orders) => console.log(orders));
```

## Summary

Promises represent async work that finishes later.

- Promises can be pending, fulfilled, or rejected.
- Use `.then()` for success.
- Use `.catch()` for failure.
- Use `.finally()` for cleanup.
- Promise chains can flatten async flows.
- Returning a Promise from `.then()` makes the chain wait.
- `async` / `await` is built on promises.
