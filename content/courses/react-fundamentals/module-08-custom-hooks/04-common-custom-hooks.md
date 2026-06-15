# Common Custom Hooks

Many custom hooks appear again and again across React apps. Studying them helps you recognize good hook boundaries.

## useToggle

```jsx
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((current) => !current);
  }, []);

  const turnOn = useCallback(() => setValue(true), []);
  const turnOff = useCallback(() => setValue(false), []);

  return { value, toggle, turnOn, turnOff };
}
```

Use this for simple open/closed UI such as panels, menus, and dialogs.

## useDebouncedValue

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

This helps avoid running expensive work or requests for every keystroke.

## usePrevious

```jsx
function usePrevious(value) {
  const previousRef = useRef();

  useEffect(() => {
    previousRef.current = value;
  }, [value]);

  return previousRef.current;
}
```

The first render returns `undefined` because there is no previous value yet.

## useLocalStorageState

```jsx
function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(() => {
    const item = window.localStorage.getItem(key);
    return item === null ? initialValue : JSON.parse(item);
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
```

Edge cases matter here. `localStorage` may be unavailable in some environments, JSON parsing can fail, and server rendering does not have `window`.

## useFetch Awareness

A simple `useFetch` hook is a good exercise, but production apps often need caching, retries, deduplication, stale data handling, pagination, and invalidation.

Libraries such as TanStack Query or framework data APIs may be better than a hand-written fetch hook for serious data loading.

## useEventListener

```jsx
function useEventListener(target, eventName, handler) {
  useEffect(() => {
    if (!target) {
      return;
    }

    target.addEventListener(eventName, handler);

    return () => {
      target.removeEventListener(eventName, handler);
    };
  }, [target, eventName, handler]);
}
```

This hook is simple, but the `handler` dependency matters. If callers pass a new function every render, the listener is removed and added repeatedly. Sometimes that is fine; sometimes you need a stable callback or a ref-based latest handler pattern.

:::quiz
question: What is a common edge case for a usePrevious hook?
options:
  - The first render has no previous value
  - It always triggers a re-render
  - It cannot be used with strings
answer: 0
explanation: usePrevious stores the value after rendering, so the first render returns undefined unless you provide a custom initial value.
:::

## Common Mistakes

Do not copy a common hook without understanding its edge cases. Hooks that touch storage, network, timers, or events need cleanup and environment awareness.

Do not build a data-fetching library accidentally. Once you need cache invalidation and request deduplication, use a tool designed for that problem.

Do not ignore accessibility when hooks drive UI state. A disclosure hook still needs components to render correct ARIA attributes and focus behavior.

## Practice Challenge

Implement `useClickOutside`.

Requirements:

- return a ref to attach to an element
- call a handler when a pointer event starts outside the element
- clean up the document listener
- handle the initial `ref.current === null` case
- explain how you would test it

## Recap

Common hooks are patterns, not magic. Use them to learn boundaries, cleanup, dependency handling, and edge cases. In production, choose between a small custom hook and a mature library based on the complexity of the problem.
