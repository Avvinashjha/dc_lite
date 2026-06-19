# Debugging Async Code

Async bugs can be harder to debug because the code does not always run from top to bottom in one uninterrupted path.

Promises, `async` functions, timers, event handlers, and network requests all run later.

The main skill is learning to follow when something happens and what value is available at that time.

## Start With the Timeline

When async code is confusing, write down the order you expect.

```js
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

console.log("C");
```

The output is:

```text
A
C
B
```

The timer callback runs after the current synchronous code finishes.

Many async bugs come from expecting a value before it is ready.

## Missing `await`

A common mistake is forgetting to await a Promise.

```js
async function showUser() {
  const response = fetch("/api/user");
  const user = await response.json();
  console.log(user.name);
}
```

`fetch()` returns a Promise, so `response` is not a `Response` object yet.

Fix it by awaiting the request.

```js
async function showUser() {
  const response = await fetch("/api/user");
  const user = await response.json();
  console.log(user.name);
}
```

If you see an error like "`response.json` is not a function", inspect whether `response` is actually a Promise.

## Awaiting JSON Parsing

`response.json()` also returns a Promise.

```js
const response = await fetch("/api/user");
const user = response.json();

console.log(user.name);
```

Here, `user` is a Promise, not the parsed object.

```js
const response = await fetch("/api/user");
const user = await response.json();

console.log(user.name);
```

If a value logs as `Promise { <pending> }`, ask which async step still needs `await`.

## Catching Async Errors

Use `try...catch` inside `async` functions.

```js
async function loadProducts() {
  try {
    const response = await fetch("/api/products");

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Could not load products:", error);
    return [];
  }
}
```

The `catch` block handles errors thrown by awaited operations inside the `try` block.

Without it, failures may become unhandled promise rejections.

## `.catch()` on Promise Chains

Promise chains should end with error handling.

```js
fetch("/api/products")
  .then((response) => response.json())
  .then((products) => {
    renderProducts(products);
  })
  .catch((error) => {
    console.error("Could not load products:", error);
  });
```

If an error is thrown in a `.then()` callback, the nearest later `.catch()` handles it.

## Breakpoints in Async Code

You can set breakpoints inside async functions and callbacks.

```js
async function saveSettings(settings) {
  const response = await fetch("/api/settings", {
    method: "POST",
    body: JSON.stringify(settings),
  });

  return response.json();
}
```

Pause before the `fetch` call and inspect:

- `settings`
- request options
- whether the function was called more than once

Pause after the `await` and inspect:

- `response.status`
- `response.ok`
- response headers

## Debugging Race Conditions

A race condition happens when the result depends on which async operation finishes first.

```js
let currentUser;

async function selectUser(id) {
  const response = await fetch(`/api/users/${id}`);
  currentUser = await response.json();
  renderUser(currentUser);
}

selectUser(1);
selectUser(2);
```

If user 1 responds after user 2, the UI may show the wrong user.

One fix is to track the latest request.

```js
let latestRequestId = 0;

async function selectUser(id) {
  const requestId = ++latestRequestId;

  const response = await fetch(`/api/users/${id}`);
  const user = await response.json();

  if (requestId !== latestRequestId) {
    return;
  }

  renderUser(user);
}
```

When debugging race conditions, log or watch request IDs, timestamps, and the input that started each request.

## Debugging Timers

Timers are another source of async confusion.

```js
let count = 0;

setInterval(() => {
  count += 1;
  console.log(count);
}, 1000);
```

If a timer runs too often, check whether you create multiple intervals.

```js
let intervalId;

function startTimer() {
  if (intervalId) {
    return;
  }

  intervalId = setInterval(() => {
    console.log("tick");
  }, 1000);
}
```

Clear timers when they are no longer needed.

```js
clearInterval(intervalId);
intervalId = undefined;
```

## Debugging Parallel Work

When using `Promise.all`, one rejected Promise rejects the whole operation.

```js
const [user, orders] = await Promise.all([
  fetchUser(userId),
  fetchOrders(userId),
]);
```

If this fails, debug each Promise separately or wrap each operation with more context.

```js
async function fetchUserWithContext(userId) {
  try {
    return await fetchUser(userId);
  } catch (error) {
    throw new Error(`fetchUser failed for ${userId}: ${error.message}`);
  }
}
```

Useful error messages should say which async operation failed.

## Common Mistakes

Do not assume code after an async call waits automatically. Only `await` or Promise chaining waits.

Do not use `forEach` with `async` callbacks when you need to await each operation.

```js
users.forEach(async (user) => {
  await saveUser(user);
});
```

Use `for...of` for sequential work.

```js
for (const user of users) {
  await saveUser(user);
}
```

Use `Promise.all` for parallel work.

```js
await Promise.all(users.map((user) => saveUser(user)));
```

Do not catch errors and silently ignore them.

```js
catch (error) {
  // Bad: the failure disappears.
}
```

At least log useful context or return a deliberate fallback.

## Summary

Async debugging is about timing and state.

Check:

- which operation returns a Promise
- which Promises need `await`
- where errors are caught
- whether requests can finish out of order
- whether timers or callbacks run more than once
- whether parallel operations need more context

When async code feels unpredictable, make the execution order visible.
