# useRef

`useRef` stores a mutable value that survives between renders without causing a re-render when it changes.

Refs are commonly used for DOM nodes, timers, previous values, and instance-like values.

## DOM Refs

```jsx
import { useRef } from "react";

function SearchInput() {
  const inputRef = useRef(null);

  function focusInput() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={focusInput}>Focus search</button>
    </>
  );
}
```

React sets `inputRef.current` to the DOM node after the element is rendered.

## Mutable Values

Changing a ref does not render the component.

```jsx
const renderCount = useRef(0);
renderCount.current += 1;
```

This can be useful for debugging, but do not use refs for values that should appear in the UI. Use state for render-affecting data.

## Timer IDs

Refs are good for values that need to be read by multiple handlers.

```jsx
function Stopwatch() {
  const intervalRef = useRef(null);

  function start() {
    intervalRef.current = setInterval(() => {
      console.log("tick");
    }, 1000);
  }

  function stop() {
    clearInterval(intervalRef.current);
  }

  return (
    <>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </>
  );
}
```

The timer id does not need to be displayed, so state would be unnecessary.

## Avoiding Stale Values

Refs can hold the latest value for long-lived callbacks.

```jsx
function ChatStatus({ roomId }) {
  const latestRoomId = useRef(roomId);

  useEffect(() => {
    latestRoomId.current = roomId;
  }, [roomId]);
}
```

Use this carefully. If an effect should resynchronize when a value changes, include the value in the dependency array instead of hiding it in a ref.

## Common Mistakes

Do not read or write refs during render to control visible output. That breaks React's predictable rendering model.

Do not assume `ref.current` is available before the element mounts. It starts as the initial value, often `null`.

Do not replace state with refs just to avoid re-renders. If the UI depends on the value, React needs state.

:::quiz
question: What happens when you update ref.current?
options:
  - React re-renders immediately
  - The value changes without triggering a render
  - The component unmounts and mounts again
answer: 1
explanation: Refs are mutable containers. Updating current does not notify React or trigger rendering.
:::

## Practice Challenge

Build a component with an input and two buttons:

- one button focuses the input
- one button logs how many times the focus button was clicked
- store the click count in a ref
- explain why state is not required for the click count

## Recap

`useRef` is for mutable values and DOM access that should survive renders without driving the UI. Use state when a value should be rendered; use refs when the value is needed imperatively.
