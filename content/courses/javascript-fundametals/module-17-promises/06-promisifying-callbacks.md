# Promisifying Callbacks

Promisifying means converting a callback-based API into a Promise-based API.

This is useful when older code uses callbacks but newer code uses promises or `async` / `await`.

## Callback-Based Function

```js
function getUser(callback) {
  setTimeout(() => {
    callback(null, { id: 1, name: "Alice" });
  }, 1000);
}
```

Usage:

```js
getUser((error, user) => {
  if (error) {
    console.log(error.message);
    return;
  }

  console.log(user.name);
});
```

This works, but promise-based code can be easier to compose.

## Promise Wrapper

```js
function getUserPromise() {
  return new Promise((resolve, reject) => {
    getUser((error, user) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(user);
    });
  });
}
```

Now you can use:

```js
getUserPromise().then((user) => {
  console.log(user.name);
});
```

or:

```js
const user = await getUserPromise();
```

## Error-First Callback Pattern

Many Node-style callbacks use this format:

```js
callback(error, data)
```

If `error` exists, reject.

If there is no error, resolve with the data.

```js
function promisifyRead(operation) {
  return new Promise((resolve, reject) => {
    operation((error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}
```

## Manual Promisify Example

```js
function waitWithCallback(ms, callback) {
  setTimeout(() => {
    callback(null, `Waited ${ms}ms`);
  }, ms);
}

function wait(ms) {
  return new Promise((resolve, reject) => {
    waitWithCallback(ms, (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result);
    });
  });
}

const message = await wait(1000);
console.log(message);
```

## Avoid Promisifying Promise APIs

Do not wrap functions that already return promises.

Avoid:

```js
function loadData() {
  return new Promise((resolve, reject) => {
    fetch("/api/data")
      .then((response) => response.json())
      .then(resolve)
      .catch(reject);
  });
}
```

Better:

```js
function loadData() {
  return fetch("/api/data").then((response) => response.json());
}
```

Promisify callback APIs.

Return existing promises directly.

## Best Practices

Promisify when working with callback-based APIs.

Reject errors and resolve successful values.

Use `Error` objects for failures.

Keep wrappers small.

Do not promisify APIs that already return promises.

## Common Mistakes

### Mistake 1: Forgetting to Return After Reject

```js
if (error) {
  reject(error);
}

resolve(data);
```

Only the first settlement matters, but this code is confusing.

Use:

```js
if (error) {
  reject(error);
  return;
}
```

### Mistake 2: Resolving Errors

```js
resolve(error);
```

This fulfills the Promise with an error value.

Use:

```js
reject(error);
```

### Mistake 3: Wrapping Existing Promises

If a function already returns a Promise, return it directly.

## Summary

Promisifying converts callback APIs into Promise APIs.

- Wrap callback APIs with `new Promise()`.
- Use `resolve` for success.
- Use `reject` for failure.
- Error-first callbacks usually use `(error, data)`.
- Promisified functions can be used with `.then()` or `await`.
- Do not wrap existing Promise-returning functions unnecessarily.
