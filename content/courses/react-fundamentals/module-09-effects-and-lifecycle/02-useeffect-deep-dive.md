# useEffect Deep Dive

`useEffect` is one of the most misunderstood hooks because it looks like a place to "run code after render." A better mental model is: use effects to synchronize a component with an external system.

External systems include the DOM outside React, browser APIs, timers, subscriptions, network requests, analytics, and imperative libraries.

## Effect Structure

```jsx
useEffect(() => {
  // setup

  return () => {
    // cleanup
  };
}, [dependencies]);
```

Setup runs after commit. Cleanup runs before the next setup when dependencies change, and when the component unmounts.

## Synchronization Example

```jsx
function VideoPlayer({ isPlaying }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  return <video ref={videoRef} src="/intro.mp4" />;
}
```

The rendered prop says what should be true. The effect makes the external video element match it.

## Effects and State Updates

Effects may update state, but this is often a sign to slow down and check the design.

Good reason:

```jsx
useEffect(() => {
  const unsubscribe = store.subscribe(() => {
    setSnapshot(store.getSnapshot());
  });

  return unsubscribe;
}, [store]);
```

Suspicious reason:

```jsx
useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);
```

The full name can be calculated during render.

## Event Logic Does Not Belong in Effects

If something happens because the user clicked a button, put it in the click handler.

```jsx
function handleBuyClick() {
  trackPurchaseStarted(productId);
  openCheckout(productId);
}
```

An effect should not guess which event caused state to change.

## Development Double Runs

React may run an effect twice in development Strict Mode. This helps catch missing cleanup.

An effect that subscribes should unsubscribe. An effect that starts a timer should clear it. An effect that opens a connection should close it.

## Common Mistakes

Do not use effects as a dumping ground for all code that mentions state.

Do not set state in an effect if it creates a render loop.

```jsx
useEffect(() => {
  setCount(count + 1);
}, [count]);
```

This keeps changing `count`, which keeps running the effect.

Do not omit dependencies to force old behavior. That creates stale closures.

:::quiz
question: Which is the best description of useEffect?
options:
  - A way to synchronize rendered state with external systems
  - A replacement for every event handler
  - A faster way to calculate values during render
answer: 0
explanation: Effects should connect React output to systems outside React, such as subscriptions, timers, DOM APIs, and network work.
:::

## Practice Challenge

Review a component and mark each effect as one of these:

- necessary synchronization
- derived state that can be calculated during render
- event logic that belongs in a handler
- missing cleanup

Rewrite at least one unnecessary effect without `useEffect`.

## Recap

Effects are powerful because they bridge React and the outside world. Use them for synchronization, keep them focused, clean up what they start, and avoid using them for render calculations or event-specific logic.
