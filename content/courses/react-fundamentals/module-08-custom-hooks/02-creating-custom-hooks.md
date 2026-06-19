# Creating Custom Hooks

A custom hook is a JavaScript function whose name starts with `use` and that may call other hooks.

```jsx
function useSomething() {
  // call hooks here
  return something;
}
```

The `use` prefix matters because React tooling uses it to check hook rules.

## Start from a Component

Begin with working component logic.

```jsx
function SearchPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(id);
  }, [query]);

  return <SearchResults query={debouncedQuery} onQueryChange={setQuery} />;
}
```

The debounce behavior can be named and reused.

## Extract the Hook

```jsx
function useDebouncedValue(value, delayMs) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => clearTimeout(id);
  }, [value, delayMs]);

  return debouncedValue;
}
```

Now the component is smaller and clearer.

```jsx
function SearchPage() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);

  return <SearchResults query={debouncedQuery} onQueryChange={setQuery} />;
}
```

## Designing the Return Value

Return a single value when the hook has one obvious result.

```jsx
const isOnline = useOnlineStatus();
```

Return an object when there are named values and actions.

```jsx
const { value, setValue, reset } = useLocalStorage("theme", "light");
```

Return an array when the API intentionally mirrors a built-in hook.

```jsx
const [isOpen, toggle] = useToggle(false);
```

## Inputs and Dependencies

Custom hook parameters are reactive values too. If an effect inside the hook reads a parameter, it belongs in that effect's dependency array.

```jsx
function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
```

## Common Mistakes

Do not call custom hooks conditionally.

```jsx
if (enabled) {
  useDebouncedValue(query, 300); // wrong
}
```

Put the condition inside the hook or inside an effect within the hook.

Do not return unstable callbacks unless callers do not care about identity. If a hook returns functions used in dependencies or memoized children, consider `useCallback`.

:::quiz
question: Why should a custom hook name start with use?
options:
  - So React tooling can enforce hook rules
  - So the hook automatically shares state globally
  - So it can only be called once per app
answer: 0
explanation: The use prefix marks the function as a hook for React linting and conventions.
:::

## Testing Awareness

Custom hooks are often testable because logic is separated from rendering. You can test them through a small component or hook testing utility. Focus on behavior: initial value, updates, cleanup, and edge cases.

For hooks that touch browser APIs, mock the API or wrap it so tests can control the environment.

## Practice Challenge

Create a `useToggle` hook.

Requirements:

- accept an optional initial boolean
- return the current value
- return `toggle`, `turnOn`, and `turnOff` functions
- keep returned callbacks stable with `useCallback`
- write down two edge cases to test

## Recap

Create custom hooks by extracting a named stateful concern from a component. Keep the API small, include dependencies honestly, follow hook rules, and design return values that are easy for components to use.
