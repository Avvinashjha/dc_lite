# The useState Hook

`useState` is the React hook for adding state to a function component.

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

`useState(0)` creates state with an initial value of `0`.

It returns an array with two items:

- the current state value
- a setter function that requests an update

## Naming Convention

The common pattern is:

```jsx
const [value, setValue] = useState(initialValue);
```

Examples:

```jsx
const [isOpen, setIsOpen] = useState(false);
const [email, setEmail] = useState("");
const [selectedId, setSelectedId] = useState(null);
```

Use names that describe the UI state, not generic names like `data` when a clearer name exists.

## Initial Values

Choose an initial value that matches how the component renders before user interaction.

```jsx
const [query, setQuery] = useState("");
const [items, setItems] = useState([]);
const [error, setError] = useState(null);
```

Avoid switching between unrelated types unless the state truly has multiple states.

```jsx
// Harder to reason about
const [items, setItems] = useState(null);

// Often easier when the UI expects an array
const [items, setItems] = useState([]);
```

## Lazy Initial State

If the initial value is expensive to calculate, pass a function.

```jsx
function PreferencesPanel() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("settings");
    return saved ? JSON.parse(saved) : { theme: "light" };
  });

  return <p>Theme: {settings.theme}</p>;
}
```

React calls the initializer only for the initial render.

Do not call the function yourself:

```jsx
// Runs on every render before useState receives the value
const [settings, setSettings] = useState(loadSettings());

// Runs once for initial state
const [settings, setSettings] = useState(loadSettings);
```

## Setter Functions Request Updates

Calling a setter tells React to render with a new value.

```jsx
setCount(count + 1);
```

It does not change the current `count` variable in the running function. The new value appears in the next render.

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    console.log(count); // old value from this render
  }

  return <button onClick={handleClick}>{count}</button>;
}
```

## Functional Updates

When the next state depends on the previous state, use a functional update.

```jsx
setCount((currentCount) => currentCount + 1);
```

This is especially important when multiple updates happen together.

```jsx
function AddThreeButton() {
  const [count, setCount] = useState(0);

  function addThree() {
    setCount((count) => count + 1);
    setCount((count) => count + 1);
    setCount((count) => count + 1);
  }

  return <button onClick={addThree}>Count: {count}</button>;
}
```

Each updater receives the latest queued value.

## Hook Rules Preview

Hooks must be called:

- at the top level of a component or custom hook
- in the same order on every render
- not inside conditions, loops, or nested functions

```jsx
// Bad
if (isLoggedIn) {
  const [draft, setDraft] = useState("");
}
```

React relies on call order to connect state values to hook calls.

## Common Mistakes

- Forgetting to import `useState`.
- Calling `useState` conditionally.
- Expecting the state variable to update immediately after calling its setter.
- Passing `loadInitialState()` instead of `loadInitialState` for expensive initial state.
- Using `setCount(count + 1)` several times in one handler when a functional update is needed.

:::quiz
question: When should you prefer `setCount((count) => count + 1)`?
options:
  - When the next value depends on the previous value
  - Only when count is a string
  - Only in class components
  - When you want to avoid rendering
answer: 0
explanation: Functional updates receive the latest queued state value, which makes them safer when updates depend on previous state.
:::

## Practice Challenge

Build a `Stepper` component.

Requirements:

- starts at `0`
- has `+1`, `-1`, and `Reset` buttons
- uses functional updates for increment and decrement
- disables the decrement button when the value is `0`

## Recap

`useState` gives a component remembered state and a setter. Choose clear initial values, use lazy initialization for expensive setup, and use functional updates when the next state depends on the previous state.
