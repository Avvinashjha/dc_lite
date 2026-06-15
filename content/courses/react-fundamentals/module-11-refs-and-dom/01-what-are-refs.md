# What are Refs?

Most React data flows through props and state. A ref is different: it is a way to keep a direct reference to something without causing a render.

Refs are commonly used for:

- accessing a DOM node, such as an input or video element
- storing a mutable value that should survive renders
- exposing a small imperative API from a child component
- integrating with browser APIs or third-party libraries that need a DOM element

Refs are powerful, but they are not a replacement for state.

## Declarative First

React prefers declarative code.

Instead of saying "find this DOM node and change its text", you usually say "render this text from state".

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

The button label changes because state changes. No manual DOM update is needed.

Use a ref when the thing you need is outside normal rendering.

```jsx
function SearchBox() {
  const inputRef = useRef(null);

  function focusSearch() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={focusSearch}>Focus search</button>
    </>
  );
}
```

Here, focusing is an imperative browser action. A ref is appropriate.

## What a Ref Looks Like

A ref object has a `current` property.

```jsx
const inputRef = useRef(null);
```

React sets `inputRef.current` to the DOM element after the component is rendered.

Before the element exists, `current` is `null`.

After the element is removed, React sets it back to `null`.

## Refs Do Not Trigger Renders

Changing a ref does not re-render the component.

```jsx
function RenderCount() {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return <p>Rendered {renderCount.current} times</p>;
}
```

This works because the ref value survives between renders.

But if the user interface must update when a value changes, use state instead.

```jsx
function BadCounter() {
  const countRef = useRef(0);

  return (
    <button onClick={() => countRef.current += 1}>
      Count: {countRef.current}
    </button>
  );
}
```

Clicking the button changes the ref, but React does not know it needs to render again. The displayed count will not reliably update.

## Common Ref Use Cases

Refs are useful when you need to:

- focus an input after an action
- scroll an element into view
- measure an element size
- control media playback
- store a timer ID
- store a previous value
- connect a chart, map, or editor library to a DOM node

```jsx
function VideoPlayer() {
  const videoRef = useRef(null);

  return (
    <>
      <video ref={videoRef} src="/intro.mp4" />
      <button onClick={() => videoRef.current.play()}>Play</button>
      <button onClick={() => videoRef.current.pause()}>Pause</button>
    </>
  );
}
```

## Avoid Using Refs for Normal Data Flow

If a parent needs to affect a child, prefer props.

If a child needs to notify a parent, prefer callback props.

If the UI depends on a value, prefer state.

Refs should usually be the exception, not the default.

## Safe Access

Because refs can be `null`, check before using them when timing is uncertain.

```jsx
function scrollToResult(resultRef) {
  if (!resultRef.current) {
    return;
  }

  resultRef.current.scrollIntoView({ behavior: "smooth" });
}
```

Inside event handlers after the element is mounted, the ref is usually available. In effects, it is still a good habit to think about cleanup and conditional rendering.

## Common Mistakes

- Storing visible UI data in refs instead of state.
- Reading `ref.current` during render to decide what to display.
- Mutating DOM styles directly when class names or props would be clearer.
- Forgetting that `current` may be `null`.
- Passing a ref to a function component that does not forward it.

## Awareness Note: Strict Mode

In development, React Strict Mode may run some render and effect logic more than once to help find unsafe code.

Do not write ref logic that depends on effects running exactly once. Always make setup and cleanup predictable.

:::quiz
question: Which statement best describes a React ref?
options:
  - A mutable reference that can survive renders without causing a render
  - A special kind of state that always updates the UI
  - A replacement for props between parent and child components
  - A way to skip React's rendering system for all updates
answer: 0
explanation: A ref stores a mutable value on its current property. Updating it does not trigger a render.
:::

## Recap

Refs let React components hold references to DOM nodes or mutable values.

Use refs for imperative actions and integration points. Use state and props for data that should drive the rendered output.

## Practice

Build a small form with a search input and a "Focus search" button.

Then add a second button that clears the input by updating React state, not by directly mutating the DOM value.
