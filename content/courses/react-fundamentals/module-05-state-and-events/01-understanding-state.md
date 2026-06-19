# Understanding State

State is data a component remembers between renders.

When state changes, React renders the component again and updates the UI.

```jsx
import { useState } from "react";

function LikeButton() {
  const [liked, setLiked] = useState(false);

  return (
    <button onClick={() => setLiked(!liked)}>
      {liked ? "Liked" : "Like"}
    </button>
  );
}
```

The `liked` value is state because it changes over time and affects what the user sees.

## State vs Regular Variables

A regular variable is recreated every render.

```jsx
function BrokenCounter() {
  let count = 0;

  return (
    <button onClick={() => {
      count = count + 1;
      console.log(count);
    }}>
      Count: {count}
    </button>
  );
}
```

The console value changes inside the click handler, but React does not know it should render again. The button text does not update reliably.

Use state for values that should persist and update the UI.

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

## What Belongs in State

Use state for data that:

- changes over time
- affects rendering
- is owned by the component or its parent

Good examples:

- selected tab
- form input value
- whether a menu is open
- loaded data
- validation errors
- a shopping cart

Do not put every value in state.

Derived values can often be calculated during render.

```jsx
function CartSummary({ items }) {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return <p>Total: ${total}</p>;
}
```

Storing `total` in separate state can create bugs if it gets out of sync with `items`.

## State Is a Snapshot

Each render receives a snapshot of state.

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    console.log(count);
  }

  return <button onClick={handleClick}>{count}</button>;
}
```

The log prints the `count` from the current render, not the future value. The next value appears after React renders again.

This snapshot model is important for understanding stale closures and functional updates.

## Keep State Minimal

Avoid duplicating the same fact in multiple state variables.

```jsx
// Risky
const [firstName, setFirstName] = useState("Ada");
const [lastName, setLastName] = useState("Lovelace");
const [fullName, setFullName] = useState("Ada Lovelace");
```

Prefer deriving:

```jsx
const [firstName, setFirstName] = useState("Ada");
const [lastName, setLastName] = useState("Lovelace");
const fullName = `${firstName} ${lastName}`;
```

Minimal state is easier to keep correct.

## Common Mistakes

- Using a regular variable for data that should update the UI.
- Storing derived data that can be calculated from props or other state.
- Expecting state to change immediately after calling a setter.
- Mutating arrays or objects in state.
- Keeping related state in many places instead of choosing one owner.

:::quiz
question: Which value most clearly belongs in React state?
options:
  - A full name calculated from `firstName` and `lastName`
  - Whether a dropdown menu is currently open
  - A CSS class name that never changes
  - The result of `items.length`
answer: 1
explanation: Whether a dropdown is open changes over time and affects the UI. Derived values like full names and item counts can usually be calculated during render.
:::

## Practice Challenge

Design state for a `SignupForm`.

It needs:

- email input
- password input
- whether the password is visible
- whether the form is currently submitting

Write the `useState` calls you would use. Then identify one value you should derive instead of storing separately.

## Recap

State is remembered data that drives rendering. Keep it minimal, avoid duplication, and remember that each render sees a snapshot of state.
