# Render and Commit Phases

React work has two major phases:

- render: calculate the next UI
- commit: apply the result to the host environment

This distinction explains why render code must be pure and why effects run after the screen has been updated.

## The Render Phase

During render, React calls your components and builds the next tree.

```jsx
function CartSummary({ items }) {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  return <p>Total: ${total}</p>;
}
```

This calculation is safe during render because it only derives output from inputs.

React may render:

- because state changed
- because props changed
- because context changed
- because a parent rendered
- because React is retrying work

Rendering does not mean the DOM changed.

## The Commit Phase

During commit, React applies changes.

For browser apps, that can include:

- inserting DOM nodes
- updating attributes
- changing text
- attaching refs
- running layout effects
- scheduling passive effects

React commits only after it has a completed render result.

```text
Render phase:
  call components
  calculate tree
  mark needed mutations

Commit phase:
  mutate DOM
  run layout effects
  allow browser paint
  run passive effects
```

## Effects and Timing

`useEffect` runs after the commit and usually after the browser has painted.

```jsx
useEffect(() => {
  document.title = `Inbox (${unreadCount})`;
}, [unreadCount]);
```

This is good for syncing with systems outside React:

- document title
- subscriptions
- analytics
- network requests
- timers

`useLayoutEffect` runs during commit after DOM mutations but before the browser paints.

```jsx
useLayoutEffect(() => {
  const rect = ref.current.getBoundingClientRect();
  setTooltipWidth(rect.width);
}, []);
```

Use layout effects only when the user would see a visual glitch otherwise.

## Render Must Not Cause Effects

Avoid doing this:

```jsx
function Bad({ userId }) {
  fetch(`/api/users/${userId}`); // bad: runs during render
  return <p>Loading...</p>;
}
```

React can call the component more than once. The render may never be committed. That can create duplicate requests and inconsistent behavior.

Use an effect or a data fetching library.

```jsx
function UserDetails({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let ignored = false;

    async function loadUser() {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      if (!ignored) setUser(data);
    }

    loadUser();
    return () => {
      ignored = true;
    };
  }, [userId]);

  return user ? <p>{user.name}</p> : <p>Loading...</p>;
}
```

The cleanup handles a common race: a slower old request finishing after a newer render.

## Refs During Commit

Refs are attached during commit.

```jsx
function FocusInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return <input ref={inputRef} />;
}
```

During the first render, the DOM node does not exist yet. After commit, `inputRef.current` points to the input.

## Strict Mode Awareness

In development, Strict Mode intentionally makes some behavior repeat.

It can:

- call component render logic more than once
- re-run effects during development checks
- reveal missing cleanup
- expose accidental render side effects

This does not happen the same way in production, but the bugs it reveals are real.

```jsx
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);
}, []);
```

Effects should clean up subscriptions, timers, and external resources.

## Common Mistakes

- Fetching data directly inside the component body.
- Reading layout in `useEffect` when the result must affect the same paint.
- Using `useLayoutEffect` for ordinary side effects.
- Forgetting effect cleanup.
- Assuming every render is committed.

## Tricky Question

If `useEffect` runs, did React commit the render?

Yes. Effects run after commit. React may render without committing, but it does not run effects for abandoned renders.

:::quiz
question: Which work belongs in the render phase?
options:
  - Deriving JSX from props and state
  - Subscribing to a WebSocket
  - Updating the document title
  - Measuring a DOM node after it is inserted
answer: 0
explanation: Render should calculate UI. Subscriptions, document updates, and DOM measurement are side effects that happen after React commits.
:::

## Practical Challenge

Find an effect in an existing component and answer:

1. what external system does it synchronize with?
2. what should trigger it to re-run?
3. what cleanup is needed?
4. could any part be derived during render instead?

## Recap

Render calculates. Commit applies.

Pure render logic lets React retry, pause, or discard work safely. Effects are for synchronizing committed UI with the outside world.
