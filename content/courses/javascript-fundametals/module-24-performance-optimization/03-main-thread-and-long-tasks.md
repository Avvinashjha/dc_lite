# Main Thread and Long Tasks

JavaScript often runs on the browser's main thread.

If a task keeps the main thread busy for too long, the page can feel stuck.

## What Is a Task?

A task is a piece of work the browser runs.

Examples:

- running a script
- handling a click event
- handling a timer callback
- processing a message
- running some rendering-related work

The browser generally completes one task before moving to the next one.

## Long Tasks

A long task is usually described as main-thread work that takes more than 50 milliseconds.

That does not mean 49 milliseconds is always fine or 51 milliseconds is always terrible.

It is a useful warning line.

During a long task, the browser may not be able to respond quickly to user input.

```js
button.addEventListener("click", () => {
  const matches = [];

  for (const product of products) {
    if (expensiveMatch(product)) {
      matches.push(product);
    }
  }

  renderProducts(matches);
});
```

If `products` is huge and `expensiveMatch()` is slow, the click handler can block the page.

## Splitting Work Into Chunks

One strategy is to split heavy work into smaller chunks.

```js
function processInChunks(items, processItem, chunkSize = 100) {
  let index = 0;

  function runChunk() {
    const end = Math.min(index + chunkSize, items.length);

    while (index < end) {
      processItem(items[index]);
      index++;
    }

    if (index < items.length) {
      setTimeout(runChunk, 0);
    }
  }

  runChunk();
}
```

This lets the browser handle other work between chunks.

It may take longer overall, but the page can remain more responsive.

## Yielding With Promises

Promises schedule microtasks.

Microtasks run before the browser moves on to many other kinds of work.

This means `await Promise.resolve()` does not always give the browser a chance to paint.

```js
async function runManySteps() {
  for (let i = 0; i < 100000; i++) {
    doWork(i);

    if (i % 1000 === 0) {
      await Promise.resolve();
    }
  }
}
```

This yields to other microtasks, but it may still delay rendering.

For visual responsiveness, APIs like `setTimeout()`, `requestAnimationFrame()`, and `requestIdleCallback()` may be better choices depending on the goal.

## Avoid Repeating Expensive Work

Sometimes the best fix is not chunking.

It is avoiding work entirely.

```js
function updateSearchResults(query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (normalizedQuery === lastQuery) {
    return;
  }

  lastQuery = normalizedQuery;
  renderResults(searchProducts(normalizedQuery));
}
```

If the input has not meaningfully changed, skip the work.

## Use Appropriate Data Structures

The right data structure can reduce work.

```js
const usersById = new Map();

for (const user of users) {
  usersById.set(user.id, user);
}

const selectedUser = usersById.get(selectedId);
```

Looking up an item in a `Map` is often clearer and faster than repeatedly scanning an array.

```js
const selectedUser = users.find((user) => user.id === selectedId);
```

For one lookup, `find()` is fine.

For many lookups, building a map can be worth it.

## Efficient Loops and Array Methods

Array methods like `map()`, `filter()`, and `reduce()` are expressive and should be used when they make code clearer.

But chaining several methods creates intermediate arrays.

```js
const names = users
  .filter((user) => user.active)
  .map((user) => user.name)
  .sort();
```

This is readable and often perfectly fine.

In hot paths with large arrays, one loop may avoid extra work.

```js
const names = [];

for (const user of users) {
  if (user.active) {
    names.push(user.name);
  }
}

names.sort();
```

Do not rewrite clear code into loops by default.

Measure first.

## Common Mistakes

- Doing heavy synchronous work directly inside input handlers.
- Assuming `async` automatically makes CPU-heavy work non-blocking.
- Creating many intermediate arrays in code that runs very often.
- Recalculating the same derived data repeatedly.
- Optimizing loops before checking whether rendering or network is the real bottleneck.

## Summary

Long tasks block the main thread and can make a page feel unresponsive.

Reduce the amount of work, split large work into chunks, choose better data structures when needed, and measure whether the change improves user-visible responsiveness.
