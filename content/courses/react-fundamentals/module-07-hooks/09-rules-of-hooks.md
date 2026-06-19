# Rules of Hooks

Hooks rely on call order. React associates each hook call with a position in the component's render.

That is why hooks have strict rules.

## Rule 1: Call Hooks at the Top Level

Do not call hooks inside conditions, loops, nested functions, or early-return branches.

```jsx
function Profile({ user }) {
  if (!user) {
    return null;
  }

  const [isEditing, setIsEditing] = useState(false); // risky
}
```

If `user` changes from missing to present, the hook call order changes.

Put hooks before conditional returns.

```jsx
function Profile({ user }) {
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return null;
  }
}
```

## Rule 2: Call Hooks Only from React Functions

Hooks can be called from:

- React function components
- custom hooks

Hooks should not be called from regular utility functions, event handlers, class components, or module-level code.

```jsx
function handleClick() {
  const [count, setCount] = useState(0); // wrong
}
```

## Custom Hook Names

Custom hooks must start with `use`.

```jsx
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  return isOnline;
}
```

The name tells React tooling that the function follows hook rules.

## Conditions Go Inside Hooks

If logic is conditional, keep the hook call in place and put the condition inside.

```jsx
useEffect(() => {
  if (!roomId) {
    return;
  }

  const connection = connect(roomId);
  return () => connection.disconnect();
}, [roomId]);
```

## Dependency Rule

Effects, memoized values, and callbacks should list reactive values they use.

```jsx
useEffect(() => {
  document.title = title;
}, [title]);
```

The dependency lint rule is not just style. It catches stale closures where the hook reads an old value.

## Common Mistakes

Do not silence hook lint warnings as a reflex. First ask whether the logic belongs in an event handler, render calculation, reducer, or effect.

Do not create hooks dynamically.

```jsx
fields.forEach((field) => {
  useState(field.initialValue); // wrong
});
```

Use one state object or a reducer for dynamic data.

:::quiz
question: Why must hooks be called in the same order on every render?
options:
  - React matches hook state by call position
  - JavaScript requires functions to be alphabetized
  - Hooks can only be used in files with one component
answer: 0
explanation: React stores hook state by the order of hook calls, so changing that order attaches state to the wrong hook.
:::

## Practice Challenge

Fix this component:

```jsx
function Dashboard({ userId, enabled }) {
  if (!enabled) {
    return null;
  }

  const [items, setItems] = useState([]);

  useEffect(() => {
    loadItems(userId).then(setItems);
  }, []);

  return <ItemList items={items} />;
}
```

Requirements:

- keep hook order stable
- include correct dependencies
- avoid loading when disabled is false
- handle stale async results if `userId` changes quickly

## Recap

Hooks must be called consistently from React components or custom hooks. Keep hook calls at the top level, put conditions inside hooks, and treat dependency warnings as clues about stale or misplaced logic.
