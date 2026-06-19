# Promise.all, race, allSettled, and any

Promise combinators are methods that work with multiple promises.

The most common ones are:

- `Promise.all()`
- `Promise.allSettled()`
- `Promise.race()`
- `Promise.any()`

They help you coordinate async tasks.

## `Promise.all()`

Use `Promise.all()` when all tasks are required.

```js
const [users, products, settings] = await Promise.all([
  getUsers(),
  getProducts(),
  getSettings(),
]);
```

All three promises start immediately.

`Promise.all()` fulfills when all fulfill.

It rejects if any one rejects.

## Result Order

Results keep input order.

```js
const [slow, fast] = await Promise.all([
  slowTask(),
  fastTask(),
]);
```

Even if `fastTask()` finishes first, its result goes into `fast` because it was second in the input array.

## `Promise.allSettled()`

Use `Promise.allSettled()` when you want every result, even failures.

```js
const results = await Promise.allSettled([
  loadProfile(),
  loadNotifications(),
  loadRecommendations(),
]);
```

Each result is an object.

Fulfilled:

```js
{
  status: "fulfilled",
  value: data
}
```

Rejected:

```js
{
  status: "rejected",
  reason: error
}
```

This is useful when partial success is acceptable.

## `Promise.race()`

`Promise.race()` settles as soon as the first input promise settles.

```js
const result = await Promise.race([
  fetchData(),
  wait(3000).then(() => {
    throw new Error("Timed out");
  }),
]);
```

If `fetchData()` finishes first, you get its result.

If the timeout rejects first, the race rejects.

`Promise.race()` is commonly used for timeouts.

## `Promise.any()`

`Promise.any()` fulfills as soon as the first input promise fulfills.

```js
const data = await Promise.any([
  fetchFromServerA(),
  fetchFromServerB(),
  fetchFromServerC(),
]);
```

It ignores rejections unless all promises reject.

If all reject, it rejects with an `AggregateError`.

```js
try {
  await Promise.any([
    Promise.reject(new Error("A failed")),
    Promise.reject(new Error("B failed")),
  ]);
} catch (error) {
  console.log(error instanceof AggregateError); // true
}
```

## Comparing Combinators

| Method | Fulfills when | Rejects when | Use case |
| --- | --- | --- | --- |
| `Promise.all()` | all fulfill | any rejects | all tasks required |
| `Promise.allSettled()` | all settle | never rejects from input promises | collect successes and failures |
| `Promise.race()` | first settles fulfilled | first settles rejected | timeout or first result/failure |
| `Promise.any()` | first fulfills | all reject | first successful result |

## Mapping With `Promise.all()`

```js
const users = await Promise.all(
  userIds.map((id) => getUser(id))
);
```

`map` creates promises.

`Promise.all` waits for all of them.

## Be Careful With Too Much Parallelism

This starts one request per ID immediately:

```js
await Promise.all(userIds.map((id) => getUser(id)));
```

For a small list, this is fine.

For thousands of items, it may overwhelm the network or server.

In advanced code, you may use concurrency limits.

## Best Practices

Use `Promise.all()` when every task is required.

Use `Promise.allSettled()` when partial success is acceptable.

Use `Promise.race()` for timeouts or first-settled behavior.

Use `Promise.any()` when you only need the first success.

Remember that result order follows input order.

Avoid starting too many tasks at once.

## Common Mistakes

### Mistake 1: Expecting `Promise.all()` to Ignore Failures

If one input rejects, `Promise.all()` rejects.

Use `Promise.allSettled()` if you need all outcomes.

### Mistake 2: Confusing `race` and `any`

`race` cares about the first settled promise, whether success or failure.

`any` cares about the first fulfilled promise.

### Mistake 3: Assuming Result Order Means Finish Order

`Promise.all()` results are in input order, not completion order.

## Summary

Promise combinators coordinate multiple promises.

- `Promise.all()` waits for all and rejects on the first rejection.
- `Promise.allSettled()` waits for all outcomes.
- `Promise.race()` settles with the first settled promise.
- `Promise.any()` fulfills with the first successful promise.
- `Promise.any()` rejects with `AggregateError` only if all reject.
- Use the combinator that matches the behavior you need.
