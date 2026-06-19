# Core Concept Questions

React interviews test whether you can explain UI as state, components, rendering, and data flow. Strong answers are short, precise, and tied to practical bugs.

Use these questions to practice answering out loud.

## 1. What Problem Does React Solve?

React helps build user interfaces from reusable components. Instead of manually updating the DOM for every state change, you describe what the UI should look like for a given state, and React updates the DOM efficiently.

Strong answer:

```text
React lets developers model UI as a function of state. Components receive data through props, keep local state when needed, and React reconciles changes into DOM updates.
```

Common mistake:

Saying "React is a framework that makes websites dynamic" is too vague.

## 2. What Is a Component?

A component is a reusable piece of UI with its own rendering logic.

```jsx
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}
```

Components should usually be:

- focused
- named clearly
- driven by props and state
- free of unnecessary side effects during render

## 3. What Are Props?

Props are inputs passed from a parent component to a child component.

```jsx
function ProductCard({ product, onAddToCart }) {
  return (
    <button onClick={() => onAddToCart(product.id)}>
      Add {product.name}
    </button>
  );
}
```

Props are read-only from the child's perspective. If the child needs to change something, it should call a callback passed by the parent.

## 4. What Is State?

State is data that changes over time and affects rendering.

Examples:

- current form input
- selected tab
- authenticated user
- fetched data
- open or closed modal

Avoid storing data in state if it can be derived from existing state or props.

## 5. Props vs State

Props come from outside the component. State is owned by the component.

Example:

```jsx
function Counter({ initialCount }) {
  const [count, setCount] = useState(initialCount);

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

`initialCount` is a prop. `count` is state.

## 6. What Is Conditional Rendering?

Conditional rendering means showing different UI for different states.

```jsx
if (status === "loading") return <Spinner />;
if (status === "error") return <ErrorMessage />;
return <Profile user={user} />;
```

Good React apps handle loading, success, empty, and error states explicitly.

## 7. Why Are Keys Important?

Keys help React identify items in a list across renders.

```jsx
todos.map((todo) => <TodoItem key={todo.id} todo={todo} />);
```

Use stable ids. Avoid array indexes when items can be inserted, removed, sorted, or filtered.

Common bug:

Using index keys in an editable list can make input state appear to move to the wrong row.

## 8. What Is Reconciliation?

Reconciliation is React's process for comparing the previous component tree to the next one and deciding what DOM updates are needed.

You do not usually control reconciliation directly, but your choices affect it:

- stable component types preserve state
- changed keys reset state
- list keys help React match items correctly

## 9. What Is Lifting State Up?

Lift state up when multiple components need to read or update the same data.

Example:

If `SearchInput` changes the query and `ProductList` uses the query, store `query` in their nearest shared parent.

Do not lift every piece of state to the top. Keep state as local as possible while still serving the components that need it.

## 10. Controlled vs Uncontrolled Inputs

Controlled inputs store form values in React state.

```jsx
<input value={email} onChange={(event) => setEmail(event.target.value)} />
```

Uncontrolled inputs keep the value in the DOM and can be read with a ref.

Controlled inputs are best when:

- validation depends on current value
- the UI reacts while typing
- submit buttons depend on form state
- values must be reset programmatically

## 11. What Should Not Happen During Render?

Render should be pure. Avoid:

- network requests
- timers
- subscriptions
- state updates
- localStorage writes
- DOM mutations

Use event handlers or effects for side effects.

:::quiz
question: Which value should usually be used as a React list key?
options:
  - A stable item id from the data
  - The array index for every list
  - Math.random()
  - The item label, even if labels can repeat
answer: 0
explanation: Stable unique ids help React preserve the correct item identity across inserts, deletes, and reordering.
:::

## Tricky Questions

Question:

Why might this be a bug?

```jsx
setCount(count + 1);
setCount(count + 1);
```

Answer:

Both updates may read the same `count` value from the current render. Use functional updates when the next value depends on the previous value.

```jsx
setCount((current) => current + 1);
setCount((current) => current + 1);
```

Question:

Does changing props always remount a component?

Answer:

No. Prop changes normally cause re-rendering, not remounting. Changing the component type or key can cause remounting and state reset.

## Practice Prompt

Explain this flow in one minute:

```text
User types in a controlled input -> state updates -> component re-renders -> input receives new value prop -> UI stays in sync with React state.
```

## Recap

Core React interviews are about clarity. Be ready to explain components, props, state, keys, rendering, controlled forms, and why render should stay pure.
