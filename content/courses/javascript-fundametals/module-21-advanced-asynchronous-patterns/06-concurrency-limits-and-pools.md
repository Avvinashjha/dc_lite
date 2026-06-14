# Concurrency Limits and Pools

Concurrency means multiple async operations are in progress at the same time.

Sometimes full parallelism is useful.

Sometimes it is too much.

## Sequential Work

This runs one task after another.

```js
for (const id of userIds) {
  const user = await fetchUser(id);
  console.log(user.name);
}
```

This is simple and predictable, but it can be slow.

## Fully Concurrent Work

This starts all requests right away.

```js
const users = await Promise.all(
  userIds.map((id) => fetchUser(id))
);
```

This is faster when the list is small.

But if `userIds` has thousands of items, it may create too much load.

## Why Limit Concurrency?

Limit concurrency when you want to:

- avoid rate limits
- protect your server
- reduce memory pressure
- keep the browser responsive
- avoid opening too many connections

The goal is not always maximum speed.

The goal is controlled speed.

## Running in Batches

The simplest limit is batching.

```js
async function runInBatches(items, batchSize, task) {
  const results = [];

  for (let index = 0; index < items.length; index += batchSize) {
    const batch = items.slice(index, index + batchSize);
    const batchResults = await Promise.all(batch.map(task));

    results.push(...batchResults);
  }

  return results;
}
```

Usage:

```js
const users = await runInBatches(userIds, 5, fetchUser);
```

This runs five requests at a time, then starts the next five.

## A Concurrency Pool

A pool keeps a fixed number of workers active until all tasks are done.

```js
async function mapWithConcurrency(items, limit, task) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;

      results[currentIndex] = await task(items[currentIndex], currentIndex);
    }
  }

  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    () => worker()
  );

  await Promise.all(workers);
  return results;
}
```

Usage:

```js
const users = await mapWithConcurrency(userIds, 3, async (id) => {
  return fetchUser(id);
});
```

Only three `fetchUser()` calls are in progress at once.

## Preserving Result Order

The pool above stores results by `currentIndex`.

That means results keep the same order as the input array, even if tasks finish out of order.

```js
const ids = [10, 20, 30];
const users = await mapWithConcurrency(ids, 2, fetchUser);

console.log(users[0]); // result for 10
console.log(users[1]); // result for 20
console.log(users[2]); // result for 30
```

Preserving order is often helpful for UI rendering.

## Handling Errors

The basic pool rejects when any task throws.

```js
try {
  const users = await mapWithConcurrency(userIds, 3, fetchUser);
  renderUsers(users);
} catch (error) {
  showError(error);
}
```

If you need every result, even failures, return outcome objects.

```js
const outcomes = await mapWithConcurrency(userIds, 3, async (id) => {
  try {
    return { status: "fulfilled", value: await fetchUser(id) };
  } catch (error) {
    return { status: "rejected", reason: error };
  }
});
```

This is similar to `Promise.allSettled()`, but with a concurrency limit.

## Choosing a Limit

There is no perfect number.

Good defaults are usually small:

- 2 to 4 for expensive browser work
- 4 to 8 for moderate network requests
- lower when an API has strict rate limits

Measure real behavior when performance matters.

## Common Mistakes

Do not use `Promise.all()` on huge arrays without thinking.

```js
await Promise.all(largeList.map(uploadFile));
```

This may start thousands of uploads.

Do not make the limit so low that independent work becomes unnecessarily slow.

Do not hide important failures.

If some tasks fail, decide whether the whole operation should fail or whether partial results are acceptable.

## Best Practices

- Use sequential loops when order and simplicity matter most.
- Use `Promise.all()` for small independent groups.
- Use batches or pools for large or rate-limited workloads.
- Preserve result order when callers expect it.
- Decide how errors should affect the whole operation.

## Summary

Concurrency limits control how many async operations run at once.

They protect users, browsers, and services from too much work at the same time.

Batches are simple, while worker pools keep the limit active more efficiently.
