# Hooks Questions

Hooks interviews test whether you understand state, effects, refs, memoization, context, reducers, and the rules that keep React behavior predictable.

Do not memorize hooks as isolated APIs. Explain when each hook is appropriate and what bugs it can prevent or create.

## 1. What Are Hooks?

Hooks are functions that let function components use React features such as state, effects, refs, context, and reducers.

Examples:

- `useState` for local state
- `useEffect` for synchronizing with external systems
- `useRef` for mutable values that do not trigger renders
- `useMemo` for memoized derived values
- `useCallback` for stable function references
- `useReducer` for structured state updates
- `useContext` for reading context values

## 2. Rules of Hooks

Rules:

- call hooks only at the top level of React function components or custom hooks
- do not call hooks inside loops, conditions, or nested functions
- custom hook names should start with `use`

Why:

React relies on hook call order to connect state and effects to the right component instance.

Bad:

```jsx
if (isOpen) {
  const [value, setValue] = useState("");
}
```

Good:

```jsx
const [value, setValue] = useState("");

if (!isOpen) {
  return null;
}
```

## 3. When Should You Use useState?

Use `useState` for local state that changes and affects rendering.

Good examples:

- input value
- selected tab
- modal open state
- simple counters

Avoid `useState` for values that can be derived:

```jsx
const completedCount = todos.filter((todo) => todo.completed).length;
```

Do not store `completedCount` separately unless necessary.

## 4. When Should You Use useEffect?

Use `useEffect` to synchronize a component with something outside React.

Examples:

- fetch data
- subscribe to events
- update document title
- start and clean up timers
- integrate with non-React widgets

Do not use effects for calculations that can happen during render.

Bad:

```jsx
useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);
```

Better:

```jsx
const fullName = `${firstName} ${lastName}`;
```

## 5. Dependency Array Questions

The dependency array tells React when to rerun an effect.

```jsx
useEffect(() => {
  document.title = `${count} messages`;
}, [count]);
```

If the effect reads a reactive value from props or state, that value usually belongs in the dependency array.

Common mistake:

Leaving a dependency out to silence repeated effects. This often creates stale closures.

## 6. What Is a Stale Closure?

A stale closure happens when a function uses an old value from a previous render.

Example:

```jsx
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1);
  }, 1000);

  return () => clearInterval(id);
}, []);
```

`count` stays stuck from the first render.

Fix:

```jsx
useEffect(() => {
  const id = setInterval(() => {
    setCount((current) => current + 1);
  }, 1000);

  return () => clearInterval(id);
}, []);
```

## 7. When Should You Use useRef?

Use `useRef` for:

- DOM elements
- timeout ids
- previous values
- mutable values that should not trigger renders

```jsx
const inputRef = useRef(null);

function focusInput() {
  inputRef.current?.focus();
}
```

Do not use refs to avoid state when the UI needs to update.

## 8. useMemo vs useCallback

`useMemo` memoizes a value.

```jsx
const expensiveTotal = useMemo(() => calculateTotal(items), [items]);
```

`useCallback` memoizes a function reference.

```jsx
const handleSelect = useCallback((id) => {
  setSelectedId(id);
}, []);
```

Use them when there is a real reason:

- expensive calculation
- stable prop for memoized child
- stable dependency for another hook

Do not wrap everything by default.

## 9. useReducer

Use `useReducer` when state updates are complex or action-driven.

```jsx
function cartReducer(state, action) {
  switch (action.type) {
    case "add_item":
      return { ...state, items: [...state.items, action.item] };
    default:
      return state;
  }
}
```

Good fits:

- cart
- form wizard
- reducer-like domain actions
- state transitions with many cases

## 10. Custom Hooks

Custom hooks extract reusable stateful logic.

```jsx
function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
```

Custom hooks do not share state automatically. Each call gets its own state unless the hook uses shared external storage or context.

:::quiz
question: What is the best description of `useEffect`?
options:
  - It is required for every derived value.
  - It synchronizes a component with external systems after rendering.
  - It replaces all event handlers.
  - It makes state updates synchronous.
answer: 1
explanation: useEffect is for side effects such as subscriptions, data fetching, timers, and browser APIs, not ordinary render-time calculations.
:::

## Tricky Questions

Question:

Why can this cause an infinite loop?

```jsx
const options = { roomId };

useEffect(() => {
  connect(options);
}, [options]);
```

Answer:

`options` is a new object on every render, so the dependency changes every time. Move the object inside the effect or memoize it if needed.

Question:

Does `useRef` changing cause a re-render?

Answer:

No. Updating `ref.current` does not trigger rendering.

## Practice Challenge

Write a custom hook named `useDebouncedValue`.

Requirements:

- accept a value and delay
- update the debounced value only after the delay
- clear the timeout when value or delay changes
- return the debounced value

Explain why the cleanup function matters.

## Recap

Hooks are powerful because they make stateful logic composable. Strong interview answers explain the purpose, dependency behavior, common bugs, and tradeoffs of each hook.
