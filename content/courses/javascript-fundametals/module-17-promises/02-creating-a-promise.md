# Creating a Promise

You can create a Promise with the `Promise` constructor.

```js
const promise = new Promise((resolve, reject) => {
  // async work
});
```

The function passed to `new Promise()` is called the executor.

It receives two functions:

- `resolve`
- `reject`

## Basic Promise Creation

```js
const promise = new Promise((resolve) => {
  resolve("Success");
});

promise.then((value) => {
  console.log(value); // Success
});
```

Calling `resolve(value)` fulfills the Promise with that value.

## Rejecting a Promise

```js
const promise = new Promise((resolve, reject) => {
  reject(new Error("Failed"));
});

promise.catch((error) => {
  console.log(error.message); // Failed
});
```

Calling `reject(error)` rejects the Promise.

Use `Error` objects for rejection reasons when possible.

## Async Work Inside a Promise

```js
function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

wait(1000).then(() => {
  console.log("One second later");
});
```

This wraps `setTimeout` in a Promise.

Now it can be used with `.then()` or `await`.

```js
await wait(1000);
```

## Promise Executor Runs Immediately

The executor function runs immediately when the Promise is created.

```js
const promise = new Promise((resolve) => {
  console.log("Executor running");
  resolve("Done");
});

console.log("After promise");
```

Output:

```text
Executor running
After promise
```

The `.then()` callbacks still run asynchronously, but the executor starts right away.

## Only Settle Once

Only the first call to `resolve` or `reject` matters.

```js
const promise = new Promise((resolve, reject) => {
  resolve("First");
  resolve("Second");
  reject(new Error("Third"));
});

promise.then((value) => {
  console.log(value); // First
});
```

Once settled, the Promise state is locked.

## Throwing Inside the Executor

Throwing inside the executor rejects the Promise.

```js
const promise = new Promise(() => {
  throw new Error("Boom");
});

promise.catch((error) => {
  console.log(error.message); // Boom
});
```

This is similar to calling `reject(error)`.

## `Promise.resolve()`

Use `Promise.resolve()` to create an already-fulfilled Promise.

```js
const promise = Promise.resolve("Done");

promise.then((value) => {
  console.log(value); // Done
});
```

This is useful when you need to return a Promise from a function even though the value is already available.

## `Promise.reject()`

Use `Promise.reject()` to create an already-rejected Promise.

```js
const promise = Promise.reject(new Error("Failed"));

promise.catch((error) => {
  console.log(error.message); // Failed
});
```

This is useful in tests or in functions that need to return a rejected Promise.

## Promisifying a Callback API

Sometimes you have a callback-based API and want a Promise version.

```js
function readData(callback) {
  setTimeout(() => {
    callback(null, "Data loaded");
  }, 1000);
}

function readDataPromise() {
  return new Promise((resolve, reject) => {
    readData((error, data) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(data);
    });
  });
}
```

Now you can use:

```js
const data = await readDataPromise();
```

## Avoid the Promise Constructor When Unneeded

Do not wrap an existing Promise unnecessarily.

Avoid:

```js
function loadUser() {
  return new Promise((resolve, reject) => {
    fetch("/api/user")
      .then((response) => response.json())
      .then(resolve)
      .catch(reject);
  });
}
```

Better:

```js
function loadUser() {
  return fetch("/api/user").then((response) => response.json());
}
```

This mistake is sometimes called the Promise constructor anti-pattern.

## Best Practices

Use `new Promise()` when converting callback-style APIs or wrapping low-level async work.

Use `Promise.resolve()` and `Promise.reject()` for already-known outcomes.

Reject with `Error` objects.

Do not wrap an existing Promise unless you have a real reason.

Remember that the executor runs immediately.

## Common Mistakes

### Mistake 1: Forgetting to Reject on Failure

```js
return new Promise((resolve) => {
  riskyCallback((error, data) => {
    resolve(data);
  });
});
```

If `error` exists, reject it.

### Mistake 2: Wrapping Promises Unnecessarily

If a function already returns a Promise, return it directly.

### Mistake 3: Expecting the Executor to Wait

The executor runs immediately.

The async callbacks inside it may run later.

## Summary

You can create promises with `new Promise()`.

- `resolve(value)` fulfills the Promise.
- `reject(error)` rejects the Promise.
- The executor runs immediately.
- A Promise can settle only once.
- Throwing inside the executor rejects the Promise.
- `Promise.resolve()` creates a fulfilled Promise.
- `Promise.reject()` creates a rejected Promise.
- Avoid wrapping existing promises unnecessarily.
