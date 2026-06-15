# Introduction to Hooks

Hooks are functions that let function components use React features such as state, effects, refs, context, memoization, and reducers.

Before hooks, stateful logic usually lived in class components. Hooks let you keep components as functions while still connecting them to React's render cycle.

## What Hooks Solve

Hooks make it easier to:

- store component state
- run side effects after rendering
- read context
- keep mutable values without re-rendering
- reuse stateful logic with custom hooks

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

`useState` gives the component memory between renders. When state changes, React renders the component again.

## Hooks Are Tied to Rendering

A component function runs again on every render. Local variables are recreated each time.

```jsx
function Example() {
  let clicks = 0;

  function handleClick() {
    clicks += 1;
    console.log(clicks);
  }

  return <button onClick={handleClick}>Click</button>;
}
```

This variable does not update the UI and is reset on the next render. Use state when the UI depends on the value.

## The Built-In Hooks

Common hooks include:

- `useState` for simple state
- `useEffect` for synchronizing with external systems
- `useContext` for reading context values
- `useRef` for DOM references and mutable values
- `useMemo` for memoized calculations
- `useCallback` for memoized functions
- `useReducer` for complex state transitions

## Hooks Compose

Hooks can be combined inside custom hooks.

```jsx
function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
```

The custom hook does not create a new React feature. It packages existing hooks into a reusable pattern.

## Important Mental Model

Hooks do not "run once inside a component" in the way constructor code did in classes. They participate in each render.

An effect may run after a render. A state setter schedules a future render. A memoized value may be reused if dependencies are unchanged.

:::quiz
question: What happens when a state setter from useState updates the value?
options:
  - React schedules the component to render again
  - The local variable changes without a render
  - The component is permanently converted to a class
answer: 0
explanation: State setters tell React that the component needs another render with the new state.
:::

## Common Mistakes

Do not call hooks like normal utility functions from event handlers or conditions. Hooks must be called while React is rendering a component or another hook.

Do not use hooks to avoid learning component data flow. Hooks are still React; props, state, rendering, and effects still matter.

## Practice Challenge

Take a simple component that uses only props and local variables. Add:

- one `useState` value
- one `useEffect` that updates `document.title`
- one `useRef` attached to an input

Write down which values cause re-renders and which values do not.

## Recap

Hooks let function components connect to React features. They are render-aware, composable, and powerful, but they must follow React's rules so state stays matched to the correct component.
