# Async Iterators

Async iterators are like regular iterators, but each next value may arrive later.

They are useful when data is not ready all at once.

Examples include:

- pages from an API
- chunks from a stream
- messages from a websocket
- log lines from a server
- events from a queue

## From Iterator to Async Iterator

A regular iterator has a `.next()` method that returns a result immediately.

```js
const iterator = [10, 20][Symbol.iterator]();

console.log(iterator.next()); // { value: 10, done: false }
console.log(iterator.next()); // { value: 20, done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```

An async iterator also has `.next()`, but `.next()` returns a Promise.

```js
const result = await asyncIterator.next();
```

That Promise resolves to the familiar iterator result object:

```js
{
  value: "some value",
  done: false
}
```

## Async Generator Functions

The easiest way to create an async iterator is with an async generator function.

Use `async function*`.

```js
async function* delayedNumbers() {
  yield 1;

  await new Promise((resolve) => setTimeout(resolve, 500));
  yield 2;

  await new Promise((resolve) => setTimeout(resolve, 500));
  yield 3;
}
```

This function can `await` inside its body and `yield` values over time.

## Consuming Async Iterators Manually

You can call `.next()` yourself.

```js
const numbers = delayedNumbers();

console.log(await numbers.next()); // { value: 1, done: false }
console.log(await numbers.next()); // { value: 2, done: false }
console.log(await numbers.next()); // { value: 3, done: false }
console.log(await numbers.next()); // { value: undefined, done: true }
```

This is useful for understanding the protocol, but most code uses `for await...of`.

## The Async Iterable Protocol

An object is async iterable if it has a `Symbol.asyncIterator` method.

```js
const asyncRange = {
  start: 1,
  end: 3,

  async *[Symbol.asyncIterator]() {
    for (let value = this.start; value <= this.end; value += 1) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      yield value;
    }
  },
};

for await (const value of asyncRange) {
  console.log(value);
}
```

This makes your own objects work with async iteration syntax.

## Fetching Pages One at a Time

Async iterators are especially useful for paginated APIs.

```js
async function* fetchUsersByPage(baseUrl) {
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(`${baseUrl}?page=${page}`);

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const data = await response.json();

    yield data.users;

    hasMore = data.hasMore;
    page += 1;
  }
}
```

The consumer can process one page at a time:

```js
for await (const users of fetchUsersByPage("/api/users")) {
  console.log(`Received ${users.length} users`);
}
```

The caller does not need to manage page numbers directly.

## Flattening Async Results

Sometimes each yielded value is a batch.

You can yield individual items instead.

```js
async function* fetchUsers(baseUrl) {
  for await (const page of fetchUsersByPage(baseUrl)) {
    for (const user of page) {
      yield user;
    }
  }
}

for await (const user of fetchUsers("/api/users")) {
  console.log(user.name);
}
```

This hides pagination from the consumer.

## Error Handling

Use `try...catch` around the loop.

```js
try {
  for await (const user of fetchUsers("/api/users")) {
    console.log(user.name);
  }
} catch (error) {
  console.error("Could not load users:", error);
}
```

If the async generator throws, the loop stops and control moves to `catch`.

## Cleanup With finally

Async generators can clean up resources.

```js
async function* readMessages(connection) {
  try {
    while (connection.isOpen) {
      yield await connection.nextMessage();
    }
  } finally {
    connection.close();
  }
}
```

The `finally` block can run when:

- the iterator finishes
- the loop breaks early
- an error occurs

## Common Mistakes

Do not use regular `for...of` with an async iterator.

```js
for (const value of delayedNumbers()) {
  console.log(value); // TypeError
}
```

Use:

```js
for await (const value of delayedNumbers()) {
  console.log(value);
}
```

Do not forget that async iteration is sequential by default.

```js
for await (const user of fetchUsers("/api/users")) {
  await saveUser(user);
}
```

This waits for each `saveUser()` before moving to the next user.

That may be correct, but it is not parallel.

## Best Practices

- Use async iterators when values arrive over time.
- Keep each yielded value meaningful, such as one item or one page.
- Handle errors around the consuming loop.
- Use `finally` for cleanup in generators that hold resources.
- Be clear about whether work should be sequential or concurrent.

## Summary

Async iterators represent values that arrive asynchronously.

Async generator functions use `async function*`, can `await`, and can `yield` results over time.

They are a clean way to model paginated data, streams, queues, and other async sources.
