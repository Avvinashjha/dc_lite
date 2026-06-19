# Batching and Scheduling

React does not immediately commit every state update one by one.

It batches related updates and schedules work by priority so applications stay predictable and responsive.

## What Batching Means

Batching means React groups multiple state updates into one render and commit.

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  const [label, setLabel] = useState("idle");

  function handleClick() {
    setCount((count) => count + 1);
    setLabel("clicked");
  }

  return <button onClick={handleClick}>{label}: {count}</button>;
}
```

React can process both updates together and commit once.

## Automatic Batching

Modern React batches updates from more places than older versions did.

Updates can be batched inside:

- React event handlers
- timeouts
- promises
- native event handlers
- async callbacks

```jsx
async function saveProfile() {
  const saved = await api.saveProfile();
  setProfile(saved);
  setStatus("saved");
}
```

React can batch these updates into a single render.

## State Updates Are Requests

Calling a setter does not immediately change the variable in the current render.

```jsx
function handleClick() {
  setCount(count + 1);
  console.log(count); // old value from this render
}
```

The `count` variable belongs to the render that created this handler.

Use functional updates when the next value depends on the previous value.

```jsx
setCount((count) => count + 1);
setCount((count) => count + 1);
```

This reliably increments twice.

## Stale Closure Pitfall

Closures capture values from a specific render.

```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds(seconds + 1); // stale if seconds is from the first render
    }, 1000);

    return () => clearInterval(id);
  }, []);
}
```

Use a functional update.

```jsx
setSeconds((seconds) => seconds + 1);
```

This reads the latest queued state instead of the captured value.

## Scheduling and Priority

Not all updates are equally urgent.

React can prioritize:

- discrete input such as clicks and keypresses
- continuous input such as scrolling
- default updates
- transition updates
- idle or background work

You usually do not manage these priorities manually. You express intent through APIs such as `startTransition`.

## `flushSync`

Sometimes you need React to commit before the next line runs.

```jsx
import { flushSync } from "react-dom";

function openAndMeasure() {
  flushSync(() => {
    setOpen(true);
  });

  const height = panelRef.current.getBoundingClientRect().height;
  positionPopover(height);
}
```

Use `flushSync` rarely. It can reduce React's ability to batch and schedule work.

## Strict Mode Awareness

Strict Mode can make update behavior feel surprising in development because React intentionally checks for unsafe patterns.

For example, an updater function may be called more than once in development to verify it is pure.

```jsx
setItems((items) => {
  items.push(newItem); // bad mutation
  return items;
});
```

Use immutable updates.

```jsx
setItems((items) => [...items, newItem]);
```

Updater functions should not mutate existing state or cause side effects.

## Common Mistakes

- Reading state immediately after setting it and expecting the new value.
- Using `setCount(count + 1)` repeatedly when the next value depends on the previous value.
- Mutating state inside updater functions.
- Overusing `flushSync`.
- Treating batching as a guarantee that no render can happen between async steps.

## Tricky Question

What will this do?

```jsx
setCount(count + 1);
setCount(count + 1);
```

It usually sets the same next value twice because both calls read `count` from the same render.

Use this instead:

```jsx
setCount((count) => count + 1);
setCount((count) => count + 1);
```

:::quiz
question: When should you prefer a functional state update?
options:
  - When the next state depends on the previous state
  - Whenever the component uses JSX
  - Only when state is an object
  - Only inside `useEffect`
answer: 0
explanation: Functional updates receive the latest queued state, which avoids stale closure and batching issues.
:::

## Practical Challenge

Build a counter with three buttons:

- add one immediately
- add one after a timeout
- add three by calling the setter three times

Try direct updates and functional updates. Explain the difference in behavior.

## Recap

React batches updates to avoid unnecessary work and schedules updates so urgent interactions stay responsive.

Treat state setters as requests. When the next value depends on the previous one, use a functional update.
