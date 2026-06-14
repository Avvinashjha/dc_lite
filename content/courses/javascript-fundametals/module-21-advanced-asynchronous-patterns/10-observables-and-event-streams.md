# Observables and Event Streams

Observables are a pattern for working with values over time.

They are not built into JavaScript in the same way Promises are, but libraries such as RxJS use them heavily.

You do not need to master RxJS in this course.

But understanding the idea helps you recognize another advanced async pattern.

## Promise vs Async Iterator vs Observable

A Promise represents one future result.

```js
const user = await fetchUser(1);
```

An async iterator represents a sequence that you pull from over time.

```js
for await (const message of messages) {
  console.log(message);
}
```

An Observable represents a sequence that pushes values to subscribers over time.

```js
const subscription = observable.subscribe((value) => {
  console.log(value);
});
```

The important difference is control:

- async iterators are usually pull-based
- observables are usually push-based

## Events Are Streams

DOM events are a familiar event stream.

```js
button.addEventListener("click", () => {
  console.log("clicked");
});
```

Every click is a value over time.

Observables provide a structured way to subscribe to, transform, combine, and unsubscribe from those values.

## A Tiny Observable

Here is a small educational observable implementation.

```js
function createObservable(start) {
  return {
    subscribe(observer) {
      const cleanup = start(observer);

      return {
        unsubscribe() {
          if (cleanup) {
            cleanup();
          }
        },
      };
    },
  };
}
```

Use it to emit a value every second:

```js
const timer = createObservable((observer) => {
  let count = 0;

  const intervalId = setInterval(() => {
    observer.next(count);
    count += 1;
  }, 1000);

  return () => clearInterval(intervalId);
});

const subscription = timer.subscribe({
  next(value) {
    console.log(value);
  },
});

setTimeout(() => {
  subscription.unsubscribe();
}, 5000);
```

After five seconds, the subscription is cleaned up.

## Unsubscribing Matters

Long-lived event streams can leak memory or keep doing work.

Always unsubscribe when you no longer need values.

```js
const subscription = stream.subscribe({
  next(value) {
    render(value);
  },
});

function cleanup() {
  subscription.unsubscribe();
}
```

This is similar in spirit to aborting a fetch request or clearing an interval.

## Transforming Streams

Observable libraries usually provide operators.

For example, RxJS has operators such as:

- `map`
- `filter`
- `debounceTime`
- `switchMap`
- `mergeMap`
- `catchError`

The exact syntax depends on the library.

Conceptually, stream transformations are similar to array transformations, but values arrive over time.

```js
// Conceptual example
searchInput$
  .pipe(
    debounceTime(300),
    filter((query) => query.length >= 2),
    switchMap((query) => fetchResults(query))
  )
  .subscribe(renderResults);
```

This describes an async search flow:

- wait until typing pauses
- ignore very short queries
- start the latest request
- render the latest results

## switchMap and Stale Results

In RxJS, `switchMap` is commonly used for search-like behavior.

When a new value arrives, it switches to the new async operation and ignores or cancels the old one if possible.

This solves the same stale-result problem you saw earlier with request ids and `AbortController`.

You do not need Observables for every app.

But they can be powerful when many events and async operations need to be combined.

## When Observables Help

Observables can be useful for:

- user input streams
- websocket messages
- live dashboards
- complex UI events
- retryable event pipelines
- combining multiple changing values

They are less useful for simple one-time requests.

For a single `fetch()`, a Promise and `async/await` are usually clearer.

## Common Mistakes

Do not use Observables just because they are advanced.

They add concepts and library-specific syntax.

Do not forget cleanup.

Subscriptions that live too long can cause bugs.

Do not confuse an Observable with a Promise.

A Promise settles once.

An Observable may emit many values and may never complete.

## Best Practices

- Use Promises for one-time async results.
- Use async iterators for pull-based sequences.
- Consider Observables for push-based event streams.
- Always unsubscribe from long-lived streams.
- Keep stream pipelines readable and focused.

## Summary

Observables model values pushed over time.

They are common in libraries such as RxJS and are useful for complex event-driven async flows.

For beginner-friendly JavaScript, learn the concept first: subscribe to a stream, handle values, and clean up when finished.
