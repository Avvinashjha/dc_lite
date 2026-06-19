# Cleanup Functions

Cleanup functions reverse work started by an effect. They prevent leaks, duplicate subscriptions, stale timers, and updates from work that no longer matters.

```jsx
useEffect(() => {
  const resource = startSomething();

  return () => {
    resource.stop();
  };
}, []);
```

## When Cleanup Runs

React runs cleanup:

- before the effect runs again because dependencies changed
- when the component unmounts
- during development checks such as Strict Mode remounting

Cleanup belongs to a particular render's effect. It should clean up the work started by that same effect.

## Timers

```jsx
useEffect(() => {
  const id = setInterval(() => {
    setSeconds((seconds) => seconds + 1);
  }, 1000);

  return () => clearInterval(id);
}, []);
```

Without cleanup, the timer can continue after the component is gone.

## Event Listeners

```jsx
useEffect(() => {
  function handleResize() {
    setWidth(window.innerWidth);
  }

  window.addEventListener("resize", handleResize);
  handleResize();

  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);
```

The same function reference used for `addEventListener` must be used for `removeEventListener`.

## Subscriptions

```jsx
useEffect(() => {
  const unsubscribe = store.subscribe(() => {
    setValue(store.getSnapshot());
  });

  return unsubscribe;
}, [store]);
```

Subscriptions are one of the clearest cleanup cases. If you subscribe, you must unsubscribe.

## Abort Requests

Fetch requests can be aborted with `AbortController`.

```jsx
useEffect(() => {
  const controller = new AbortController();

  async function load() {
    const response = await fetch(`/api/users/${userId}`, {
      signal: controller.signal,
    });
    const data = await response.json();
    setUser(data);
  }

  load().catch((error) => {
    if (error.name !== "AbortError") {
      setError(error);
    }
  });

  return () => controller.abort();
}, [userId]);
```

This prevents outdated requests from continuing after `userId` changes or the component unmounts.

## Common Mistakes

Do not make the cleanup function async. React expects cleanup to run synchronously.

```jsx
return async () => {
  await connection.disconnect(); // avoid this pattern
};
```

Start async shutdown if needed, but the cleanup function itself should not return a promise.

Do not forget that cleanup runs before reruns, not only on unmount.

:::quiz
question: When dependencies change, what happens before React runs the next effect setup?
options:
  - React runs the previous cleanup function
  - React deletes all component state
  - React skips cleanup until page refresh
answer: 0
explanation: Cleanup for the previous effect runs before setup for the next effect when dependencies change.
:::

## Practice Challenge

Create a `useWindowSize` hook.

Requirements:

- read the initial window size
- subscribe to `resize`
- clean up the listener
- avoid crashing in non-browser environments by documenting or guarding `window`

## Recap

Cleanup is the other half of an effect. Any effect that starts a timer, subscription, request, listener, or connection should clearly stop or invalidate it when the synchronization is no longer current.
