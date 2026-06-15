# Reusing Stateful Logic

Reusable stateful logic should have a clear boundary: what the hook owns, what the component owns, and what external system is being synchronized.

Custom hooks are strongest when the component can say what it needs without knowing every setup detail.

## Keep UI Outside the Hook

A hook should usually return data and actions, not JSX.

```jsx
function useDisclosure(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((value) => !value), []);

  return { isOpen, open, close, toggle };
}
```

The component decides how to render a modal, menu, or panel.

```jsx
function HelpPanel() {
  const panel = useDisclosure();

  return (
    <>
      <button onClick={panel.open}>Open help</button>
      {panel.isOpen && <aside>Helpful content</aside>}
    </>
  );
}
```

## Separate Configuration from State

Pass stable configuration into the hook.

```jsx
function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = window.localStorage.getItem(key);
    return stored === null ? initialValue : JSON.parse(stored);
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
```

If `key` changes, the effect writes to a new place. Decide whether the hook should also reload from that new key; document that behavior.

## Avoid Over-General Hooks

This hook is too vague:

```jsx
function useManager(config) {
  // handles fetching, forms, modals, selection, and notifications
}
```

A hook should have a focused reason to exist. Several small hooks are easier to test and reuse than one hook that owns everything.

## Composition

Hooks can call other hooks.

```jsx
function useSearchQuery(initialQuery = "") {
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebouncedValue(query, 300);

  return { query, setQuery, debouncedQuery };
}
```

Composition works because custom hooks follow the same call-order rules.

## Common Mistakes

Do not assume a custom hook makes state shared. Each call has its own state unless the hook reads from context or an external store.

Do not hide required provider setup. If a hook needs context, throw a clear error when the provider is missing.

Do not return new object and function identities casually from a hook used by performance-sensitive consumers.

:::quiz
question: If two components call the same custom hook that uses useState, what happens by default?
options:
  - They share one state value
  - Each component gets its own state
  - React throws because custom hooks can only be used once
answer: 1
explanation: A custom hook call is tied to the component that calls it, so each caller receives its own hook state.
:::

## Testing Awareness

Test custom hooks through behavior:

- initial state
- state transitions
- effects and cleanup
- error paths
- changing inputs over time

For reusable hooks, tests often pay off more than for one-off component internals because many components depend on the same behavior.

## Practice Challenge

Create `useAsyncTask`.

Requirements:

- accept an async function
- expose `run`, `isLoading`, `error`, and `data`
- ignore stale results if a later call finishes first
- keep rendering decisions outside the hook
- write test cases for success, failure, and overlapping calls

## Recap

Reusable stateful logic should be focused, named, and independent from presentation. Compose hooks when it clarifies behavior, and be explicit about whether state is local, shared through context, or stored externally.
