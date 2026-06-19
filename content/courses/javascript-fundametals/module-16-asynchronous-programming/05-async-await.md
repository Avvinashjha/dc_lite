# async / await

`async` / `await` is modern syntax for working with promises.

It lets asynchronous code read more like synchronous code.

Promise chain:

```js
getUser()
  .then((user) => getOrders(user.id))
  .then((orders) => {
    console.log(orders);
  })
  .catch((error) => {
    console.log(error.message);
  });
```

With `async` / `await`:

```js
async function showOrders() {
  try {
    const user = await getUser();
    const orders = await getOrders(user.id);

    console.log(orders);
  } catch (error) {
    console.log(error.message);
  }
}
```

The second version is often easier to follow.

## `async` Functions

Add `async` before a function to make it an async function.

```js
async function loadUser() {
  return { name: "Alice" };
}
```

An async function always returns a Promise.

```js
const result = loadUser();

console.log(result); // Promise
```

Even if you return a normal value, JavaScript wraps it in a Promise.

```js
loadUser().then((user) => {
  console.log(user.name); // Alice
});
```

## `await`

`await` pauses the async function until the Promise settles.

```js
async function loadUser() {
  const response = await fetch("/api/user");
  const user = await response.json();

  return user;
}
```

`await` can only be used inside async functions, except in modules that support top-level await.

## Awaiting a Promise

```js
function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function run() {
  console.log("Start");
  await wait(1000);
  console.log("End");
}

run();
```

Output:

```text
Start
End
```

`End` logs after the Promise resolves.

## Error Handling With `try...catch`

Use `try...catch` around awaited promises.

```js
async function loadUser() {
  try {
    const response = await fetch("/api/user");
    const user = await response.json();
    return user;
  } catch (error) {
    console.log("Could not load user");
    return null;
  }
}
```

If an awaited Promise rejects, JavaScript jumps to `catch`.

## Sequential Await

These requests run one after another.

```js
const user = await getUser();
const orders = await getOrders(user.id);
```

This is correct when the second step depends on the first.

If steps do not depend on each other, running them sequentially may be slower than necessary.

You will learn parallel async tasks later in this module.

## Async Function Expressions

You can write async arrow functions.

```js
const loadUser = async () => {
  const response = await fetch("/api/user");
  return response.json();
};
```

You can use async callbacks too, but be careful with array methods like `forEach`.

## Avoid `await` Inside `forEach`

This does not wait the way beginners often expect:

```js
users.forEach(async (user) => {
  await saveUser(user);
});
```

`forEach` does not wait for async callbacks.

Use `for...of` for sequential async work:

```js
for (const user of users) {
  await saveUser(user);
}
```

Or use `Promise.all()` for parallel work:

```js
await Promise.all(users.map((user) => saveUser(user)));
```

## Best Practices

Use `async` / `await` for readable promise code.

Wrap awaited operations in `try...catch` when failures are expected.

Use sequential `await` only when order matters or later work depends on earlier results.

Avoid `async` callbacks with `forEach` when you need to wait.

Remember that async functions return promises.

## Common Mistakes

### Mistake 1: Forgetting `await`

```js
async function loadUser() {
  const response = fetch("/api/user");
  console.log(response.json); // wrong
}
```

`response` is a Promise.

Correct:

```js
const response = await fetch("/api/user");
```

### Mistake 2: Expecting Async Functions to Return Plain Values

```js
async function getName() {
  return "Alice";
}

const name = getName();

console.log(name); // Promise
```

Use:

```js
const name = await getName();
```

inside an async function.

### Mistake 3: Using `await` Outside an Async Context

```js
const user = await getUser(); // invalid in normal script code
```

Wrap it:

```js
async function run() {
  const user = await getUser();
}
```

## Summary

`async` / `await` is syntax for working with promises.

- Async functions always return promises.
- `await` waits for a Promise inside an async function.
- Rejected promises can be handled with `try...catch`.
- Sequential `await` is useful when steps depend on each other.
- Use `Promise.all()` for independent parallel work.
- Avoid `await` inside `forEach` when you need to wait.
