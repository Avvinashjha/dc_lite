# Running Tasks in Parallel

Sometimes async tasks depend on each other.

Sometimes they do not.

If tasks are independent, you can often start them at the same time.

This can make async code faster.

## Sequential Async Work

Sequential work runs one step after another.

```js
const user = await getUser();
const orders = await getOrders(user.id);
```

This is correct because `getOrders` needs `user.id`.

The second task depends on the first.

## Unnecessary Sequential Work

These tasks do not depend on each other:

```js
const users = await getUsers();
const products = await getProducts();
const settings = await getSettings();
```

This waits for each request before starting the next.

If they are independent, that is slower than needed.

## `Promise.all()`

`Promise.all()` starts multiple promises and waits for all of them.

```js
const [users, products, settings] = await Promise.all([
  getUsers(),
  getProducts(),
  getSettings(),
]);
```

All three operations start right away.

The result is an array of resolved values in the same order as the input promises.

## Order of Results

The result order matches the input order, not completion order.

```js
const [a, b] = await Promise.all([
  slowTask(),
  fastTask(),
]);
```

Even if `fastTask` finishes first, its result still goes into `b`.

## What If One Promise Fails?

`Promise.all()` rejects if any promise rejects.

```js
try {
  const results = await Promise.all([
    loadUser(),
    loadOrders(),
    loadSettings(),
  ]);

  console.log(results);
} catch (error) {
  console.log("At least one task failed");
}
```

This is useful when all tasks are required.

## `Promise.allSettled()`

If you want to wait for every task even when some fail, use `Promise.allSettled()`.

```js
const results = await Promise.allSettled([
  loadUser(),
  loadOrders(),
  loadSettings(),
]);

console.log(results);
```

Each result has a status:

```js
{
  status: "fulfilled",
  value: ...
}
```

or:

```js
{
  status: "rejected",
  reason: ...
}
```

Use this when partial success is acceptable.

## Mapping to Promises

You can run async work for many items.

```js
const users = await Promise.all(
  userIds.map((id) => getUser(id))
);
```

`map` creates an array of promises.

`Promise.all` waits for all of them.

## Sequential Loop With `for...of`

Sometimes you need one item at a time.

```js
for (const user of users) {
  await saveUser(user);
}
```

This is sequential.

Use it when:

- order matters
- you must avoid too many requests at once
- each step depends on the previous one

## Avoid `forEach` With async Waiting

```js
users.forEach(async (user) => {
  await saveUser(user);
});
```

`forEach` does not wait for the async callbacks.

Use `for...of` for sequential work.

Use `Promise.all` for parallel work.

## Best Practices

Use sequential `await` when tasks depend on each other.

Use `Promise.all()` when independent tasks are all required.

Use `Promise.allSettled()` when partial success is acceptable.

Be careful not to start too many async operations at once.

Avoid `forEach` when you need to wait for async work.

## Common Mistakes

### Mistake 1: Awaiting Independent Tasks One by One

```js
const a = await taskA();
const b = await taskB();
```

If independent, prefer:

```js
const [a, b] = await Promise.all([taskA(), taskB()]);
```

### Mistake 2: Expecting `Promise.all()` to Ignore Failures

If one promise rejects, `Promise.all()` rejects.

Use `Promise.allSettled()` for partial results.

### Mistake 3: Using `forEach` With async Work

`forEach` does not wait for promises returned by its callback.

## Summary

Async tasks can run sequentially or in parallel.

- Sequential `await` is correct when tasks depend on each other.
- `Promise.all()` runs independent required tasks together.
- Results from `Promise.all()` keep input order.
- `Promise.all()` rejects if any task rejects.
- `Promise.allSettled()` waits for both successes and failures.
- Use `for...of` for sequential async loops.
- Avoid `forEach` when you need to await async work.
