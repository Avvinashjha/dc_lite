# Introduction to Promises

Promises are one of the most important tools for asynchronous JavaScript.

A Promise represents work that will finish later.

It may succeed.

It may fail.

But either way, it gives you a structured way to handle the future result.

```js
const promise = fetch("/api/user");
```

`fetch()` does not return the final data immediately.

It returns a Promise.

## Why Promises Exist

Before promises, many async APIs used callbacks.

```js
getUser((error, user) => {
  if (error) {
    console.log(error.message);
    return;
  }

  console.log(user.name);
});
```

Callbacks work, but deeply nested callbacks become hard to manage.

Promises make async results composable.

```js
getUser()
  .then((user) => {
    console.log(user.name);
  })
  .catch((error) => {
    console.log(error.message);
  });
```

Promises also power `async` / `await`.

## Promise States

A Promise has three states:

| State | Meaning |
| --- | --- |
| `pending` | The operation is still running |
| `fulfilled` | The operation completed successfully |
| `rejected` | The operation failed |

Example:

```js
const promise = new Promise((resolve) => {
  setTimeout(() => {
    resolve("Done");
  }, 1000);
});
```

At first, the Promise is pending.

After one second, it becomes fulfilled with the value `"Done"`.

## Settled Promises

Once a Promise is fulfilled or rejected, it is settled.

A settled Promise cannot change state again.

```js
const promise = new Promise((resolve, reject) => {
  resolve("First");
  reject(new Error("Second"));
  resolve("Third");
});

promise.then((value) => {
  console.log(value); // First
});
```

Only the first settlement counts.

## Fulfilled Values

When a Promise fulfills, it passes a value to `.then()`.

```js
Promise.resolve("Alice").then((name) => {
  console.log(name); // Alice
});
```

The fulfilled value can be any JavaScript value:

- string
- number
- object
- array
- `undefined`
- another Promise

## Rejected Reasons

When a Promise rejects, it passes a reason to `.catch()`.

Usually the reason should be an `Error` object.

```js
Promise.reject(new Error("Failed")).catch((error) => {
  console.log(error.message); // Failed
});
```

Technically, promises can reject with any value.

But rejecting with `Error` objects is best for debugging.

## Promises Are Asynchronous

Even already-resolved promises run `.then()` callbacks asynchronously.

```js
console.log("A");

Promise.resolve().then(() => {
  console.log("B");
});

console.log("C");
```

Output:

```text
A
C
B
```

The `.then()` callback runs later, after the current synchronous code finishes.

## Promises and async / await

`async` / `await` is built on promises.

This:

```js
getUser().then((user) => {
  console.log(user.name);
});
```

Can be written as:

```js
async function showUser() {
  const user = await getUser();
  console.log(user.name);
}
```

The syntax changes.

The underlying model is still promises.

## Best Practices

Use promises for async operations that complete once.

Use `.then()` for simple chains.

Use `.catch()` for failures.

Use `async` / `await` when it improves readability.

Reject with `Error` objects.

Remember that Promise callbacks run asynchronously.

## Common Mistakes

### Mistake 1: Expecting `.then()` to Run Immediately

```js
console.log("Start");
Promise.resolve().then(() => console.log("Promise"));
console.log("End");
```

This logs:

```text
Start
End
Promise
```

### Mistake 2: Thinking a Promise Can Settle Twice

```js
resolve("A");
resolve("B");
```

Only `"A"` matters.

### Mistake 3: Treating Promises Like Final Values

```js
const user = getUser();
console.log(user.name); // wrong if getUser returns a Promise
```

Use `.then()` or `await`.

## Summary

Promises represent async work that completes later.

- Promises can be pending, fulfilled, or rejected.
- Fulfilled promises pass values to `.then()`.
- Rejected promises pass reasons to `.catch()`.
- Once settled, a Promise cannot change state.
- Promise callbacks run asynchronously.
- `async` / `await` is syntax built on top of promises.
