# State and Re-renders

A re-render happens when React calls a component again to calculate the next UI.

State updates are one of the main reasons components re-render.

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

Each click requests a new render with a new `count`.

## What Re-rendering Means

When a component re-renders, React calls the component function again.

```jsx
function Greeting({ name }) {
  console.log("render Greeting");
  return <h1>Hello, {name}</h1>;
}
```

Calling the function again does not mean React throws away every DOM node. React still reconciles the new element tree with the old one.

## Parent and Child Renders

When a parent re-renders, its children usually render too.

```jsx
function App() {
  const [count, setCount] = useState(0);

  return (
    <main>
      <button onClick={() => setCount(count + 1)}>Update</button>
      <Header />
    </main>
  );
}
```

`Header` may render again even if its output does not change.

This is normal. Do not optimize every render. Start caring when re-renders create visible slowness, expensive work, or unnecessary network/side-effect behavior.

## State Placement Matters

State should live as low as possible, but high enough for every component that needs it.

```jsx
function SearchPage() {
  return (
    <>
      <SearchBox />
      <Footer />
    </>
  );
}
```

If only `SearchBox` needs the query state, keep it inside `SearchBox`. Updating the query does not need to re-render the entire page.

If `SearchResults` also needs the query, lift the state to their shared parent.

```jsx
function SearchPage() {
  const [query, setQuery] = useState("");

  return (
    <>
      <SearchBox query={query} onQueryChange={setQuery} />
      <SearchResults query={query} />
    </>
  );
}
```

## Batching and Render Timing

React batches state updates in event handlers.

```jsx
function handleSave() {
  setIsSaving(true);
  setMessage("Saving...");
  setAttempts((attempts) => attempts + 1);
}
```

React can render once after the handler instead of once per setter call.

State variables inside the handler remain snapshots from the current render.

```jsx
function handleClick() {
  setCount(count + 1);
  console.log(count); // still the old value
}
```

## Stale Closures

A closure keeps access to variables from the render where it was created.

```jsx
function DelayedCounter() {
  const [count, setCount] = useState(0);

  function addLater() {
    setTimeout(() => {
      setCount(count + 1);
    }, 1000);
  }

  return <button onClick={addLater}>Count: {count}</button>;
}
```

If the user clicks several times quickly, each timeout may capture the same old `count`.

Use a functional update when the next value depends on the previous value.

```jsx
setTimeout(() => {
  setCount((count) => count + 1);
}, 1000);
```

Functional updates reduce stale closure bugs.

## Avoid Render Loops

Setting state during render usually causes an infinite loop.

```jsx
function Broken({ value }) {
  const [copy, setCopy] = useState(value);
  setCopy(value);
  return <p>{copy}</p>;
}
```

Most of the time, you do not need a state copy of props. Use the prop directly or derive values during render.

## Common Mistakes

- Treating every re-render as a bug.
- Putting state too high in the component tree.
- Copying props into state without a clear reason.
- Expecting state variables to update immediately inside the same handler.
- Capturing stale state in timers, promises, or delayed callbacks.
- Setting state unconditionally during render.

:::quiz
question: Why can `setCount(count + 1)` inside a `setTimeout` cause stale behavior?
options:
  - Timers cannot update React state
  - The callback may capture an old `count` value from a previous render
  - React disables batching in timers
  - Numbers are immutable
answer: 1
explanation: The delayed callback closes over the state snapshot from the render where it was created. A functional update reads the latest queued state instead.
:::

## Practice Challenge

Create a `DelayedLikeButton`.

Requirements:

- displays a like count
- button schedules an increment after one second
- clicking multiple times quickly should add the correct number of likes
- use a functional update inside the timer

## Recap

State updates trigger re-renders, but rendering is just recalculating UI. Place state carefully, understand batching, and use functional updates to avoid stale closure bugs.
