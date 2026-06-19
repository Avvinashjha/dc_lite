# Why Custom Hooks

Custom hooks let you reuse stateful React logic without duplicating components or hiding behavior in inheritance.

A custom hook is a function that calls one or more hooks and returns values a component can use.

## The Problem: Repeated Stateful Logic

Imagine two components both need to know whether the browser is online.

```jsx
function StatusBadge() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }

    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return <span>{isOnline ? "Online" : "Offline"}</span>;
}
```

If another component needs the same logic, copy-pasting creates maintenance risk.

## Extracting the Logic

```jsx
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }

    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}
```

Now components can focus on rendering.

```jsx
function StatusBadge() {
  const isOnline = useOnlineStatus();
  return <span>{isOnline ? "Online" : "Offline"}</span>;
}
```

## What Gets Reused?

Custom hooks reuse logic, not state instances.

If two components call `useOnlineStatus`, each call gets its own hook state and effects. They may observe the same browser events, but React treats the hook state separately for each component.

## When to Extract a Custom Hook

Extract a hook when:

- multiple components repeat the same hook logic
- a component has a focused stateful concern that deserves a name
- effect setup and cleanup distract from rendering
- a sequence of state transitions can be hidden behind a small API

Do not extract just to reduce line count. A custom hook should make the component easier to understand.

:::quiz
question: What does a custom hook reuse?
options:
  - Stateful logic
  - One shared state instance for all callers
  - JSX markup only
answer: 0
explanation: Custom hooks package hook logic. Each call still gets its own state for that component instance.
:::

## Common Mistakes

Do not hide too much. If the hook returns a vague object like `{ data, stuff, run }`, the component may become harder to read.

Do not extract a hook before the behavior is stable. Premature extraction can freeze the wrong abstraction.

Do not use a custom hook to share global state unless it uses a shared external source or context. Calling the same hook in two places does not automatically make state shared.

## Practice Challenge

Find two components that both track window width, online status, or local storage. Extract the repeated logic into a custom hook.

Requirements:

- name the hook with `use`
- keep rendering in the component
- include cleanup if the hook subscribes to browser events
- explain whether each caller gets shared or separate state

## Recap

Custom hooks give names to reusable stateful logic. They improve components when the extracted behavior has a clear purpose, a clear API, and follows the same rules as built-in hooks.
