# Props vs State

Props and state are the two main kinds of data in React components.

Props come from a parent. State is owned by a component and can change over time.

## Props: Inputs from a Parent

```jsx
function App() {
  return <UserCard name="Alice" role="Developer" />;
}

function UserCard({ name, role }) {
  return (
    <article>
      <h2>{name}</h2>
      <p>{role}</p>
    </article>
  );
}
```

`App` passes props. `UserCard` receives them.

Props are read-only from the child component's point of view.

```jsx
function UserCard({ name }) {
  // Bad: do not reassign or mutate props
  name = name.toUpperCase();

  return <h2>{name}</h2>;
}
```

Instead, derive a new local value:

```jsx
function UserCard({ name }) {
  const displayName = name.toUpperCase();

  return <h2>{displayName}</h2>;
}
```

## Props Can Be Many Types

```jsx
<ProductCard
  name="Keyboard"
  price={99}
  inStock={true}
  tags={["hardware", "input"]}
  seller={{ id: "s1", name: "ACME" }}
  onAddToCart={() => addToCart("keyboard")}
/>
```

Props can be strings, numbers, booleans, arrays, objects, functions, elements, and children.

When passing objects, arrays, or functions, remember that new references can affect memoization later. For now, focus on clear data flow.

## Default Values

You can provide defaults while destructuring.

```jsx
function Badge({ label, tone = "neutral" }) {
  return <span className={`badge badge-${tone}`}>{label}</span>;
}
```

Defaults help components behave predictably when optional props are omitted.

Do not hide required data with misleading defaults. If a component cannot render without a prop, design the API so callers provide it.

## State: Remembered Component Data

State belongs to a component.

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((count) => count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

Use state for data that changes and affects rendering.

Examples:

- selected item id
- form input value
- whether a dialog is open
- loading or error status

Do not store values that can be calculated from props or other state.

```jsx
function CartSummary({ items }) {
  const itemCount = items.length;

  return <p>{itemCount} items</p>;
}
```

## Props Configure, State Remembers

```jsx
function ToggleMessage({ message, initiallyVisible = true }) {
  const [isVisible, setIsVisible] = useState(initiallyVisible);

  return (
    <section>
      <button onClick={() => setIsVisible((visible) => !visible)}>
        {isVisible ? "Hide" : "Show"}
      </button>
      {isVisible && <p>{message}</p>}
    </section>
  );
}
```

`message` configures the component from outside.

`isVisible` is remembered internally.

Be careful with props used only as initial state. If `initiallyVisible` changes later, `isVisible` will not automatically reset. That is often correct, but it should be intentional.

## Composition with Props and Children

Composition is often better than adding many configuration props.

```jsx
function Card({ title, children }) {
  return (
    <article className="card">
      <h2>{title}</h2>
      {children}
    </article>
  );
}
```

Use it:

```jsx
<Card title="Billing">
  <p>Your next invoice is due on Friday.</p>
  <button>Update payment method</button>
</Card>
```

The card owns the shell. The parent owns the content.

## Prop Validation Awareness

JavaScript React does not automatically validate prop types at runtime.

Common ways teams document or validate props include:

- TypeScript interfaces or types
- PropTypes in older or plain JavaScript projects
- runtime schema validation at API boundaries
- clear component examples and tests

You do not need to add a validation library for every small component. But for shared components, make accepted props obvious.

```jsx
/**
 * Button props:
 * - variant: "primary" | "secondary"
 * - disabled: boolean
 * - onClick: function
 */
function Button({ variant = "primary", disabled = false, onClick, children }) {
  return (
    <button
      className={`button button-${variant}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

## Lifting State Up

When siblings need the same data, move state to their nearest shared parent.

```jsx
function ProductPage({ products }) {
  const [selectedId, setSelectedId] = useState(products[0]?.id ?? null);
  const selectedProduct = products.find((product) => product.id === selectedId);

  return (
    <>
      <ProductList
        products={products}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      <ProductDetails product={selectedProduct} />
    </>
  );
}
```

The parent owns the source of truth. Children receive props and call callbacks.

## Common Prop Mistakes

- Mutating an object received through props.
- Copying props into state without a clear reason.
- Passing strings instead of booleans or numbers.
- Creating a component with too many unrelated props instead of using composition.
- Forgetting to pass `children` through wrapper components.
- Using a prop named `onClick` but calling it during render instead of in response to a click.

:::quiz
question: Which statement best describes props and state?
options:
  - Props are owned by the child, state is owned by the parent
  - Props are inputs from a parent, state is remembered data owned by a component
  - Props and state are both always global
  - State cannot affect rendering
answer: 1
explanation: Props flow from parent to child. State is local remembered data that can be updated with a setter and causes rendering when it changes.
:::

:::quiz
question: What is a risk of copying a prop into state just to display it?
options:
  - The local state can get out of sync when the prop changes
  - React will refuse to render the component
  - Props become mutable
  - JSX stops escaping text
answer: 0
explanation: If you initialize state from a prop, later prop changes do not automatically update that state. Use the prop directly unless you intentionally need a separate draft.
:::

:::exercise
title: Build a Toggle Switch
description: Create a ToggleSwitch component that accepts a label prop and uses state to toggle between on and off. Render the label and current state.
starterCode: |
  import { useState } from "react";

  function ToggleSwitch({ label }) {
    const [isOn, setIsOn] = useState(false);

    return (
      <button onClick={() => setIsOn((isOn) => !isOn)}>
        {/* Render label and current state */}
      </button>
    );
  }
:::

## Recap

Props are read-only inputs. State is remembered, changing data. Use props for configuration, state for UI that changes, children for composition, and lifted state when multiple components need one source of truth.
