# useState

`useState` stores a value that should survive between renders and update the UI when it changes.

```jsx
const [value, setValue] = useState(initialValue);
```

The first item is the current state for this render. The second item is a setter that schedules an update.

## Basic Example

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

After `setCount` runs, React renders again with the new count.

## State Is a Snapshot

State variables do not change inside the current render.

```jsx
function handleClick() {
  setCount(count + 1);
  console.log(count); // previous render's value
}
```

Think of `count` as a snapshot from the render that created this handler.

## Functional Updates

When the next state depends on the previous state, use the functional form.

```jsx
setCount((currentCount) => currentCount + 1);
```

This matters when multiple updates happen close together.

```jsx
setCount((count) => count + 1);
setCount((count) => count + 1);
setCount((count) => count + 1);
```

This reliably adds 3.

## Objects and Arrays

State should be treated as immutable. Create new objects and arrays instead of mutating existing ones.

```jsx
setUser((user) => ({
  ...user,
  name: "Ava",
}));
```

```jsx
setItems((items) => [...items, newItem]);
```

Mutating state can prevent React from seeing that something changed and can make bugs very hard to trace.

## Lazy Initial State

If the initial value is expensive to calculate, pass a function.

```jsx
const [settings, setSettings] = useState(() => loadSettingsFromStorage());
```

React calls this initializer only for the initial render.

## Common Mistakes

Do not store values in state if they can be derived during render.

```jsx
const fullName = `${firstName} ${lastName}`;
```

This is better than keeping a separate `fullName` state that can fall out of sync.

Do not use state for values that do not affect rendering. Use `useRef` for mutable values like timer ids.

:::quiz
question: Which useState update is safest when the next value depends on the previous value?
options:
  - setCount(count + 1)
  - setCount((current) => current + 1)
  - count = count + 1
answer: 1
explanation: The functional updater receives the latest pending state, which avoids stale snapshot problems.
:::

## Practice Challenge

Build a shopping cart component.

Requirements:

- add items without mutating the existing array
- remove items by id
- update quantity using a functional state update
- calculate the total during render instead of storing it separately

## Recap

Use `useState` for render-affecting values. Treat state as immutable, prefer functional updates when state depends on previous state, and avoid storing values that can be calculated from existing props or state.
