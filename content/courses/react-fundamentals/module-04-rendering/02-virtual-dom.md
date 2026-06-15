# The Virtual DOM

The virtual DOM is a common name for React's in-memory description of the UI.

It is not a second browser DOM. It is a tree of React elements that describes what the UI should look like.

## Why React Uses Descriptions

Manual DOM code tells the browser how to update step by step.

```js
const button = document.querySelector("#counter");
button.textContent = `Count: ${count}`;
button.disabled = count >= 10;
```

React components describe the desired result.

```jsx
function CounterButton({ count }) {
  return (
    <button disabled={count >= 10}>
      Count: {count}
    </button>
  );
}
```

When `count` changes, React produces a new description and figures out the DOM changes.

## What Happens During an Update

At a high level:

1. State or props change.
2. React calls the affected components.
3. Components return new React element descriptions.
4. React compares the new tree with the previous tree.
5. React commits the necessary DOM updates.

This model lets you write UI as a function of state.

```jsx
UI = f(state)
```

You do not write every DOM operation by hand.

## The Virtual DOM Is Not Magic

The virtual DOM helps React organize updates, but it does not make every app automatically fast.

Expensive work can still happen when:

- components do heavy calculations while rendering
- large lists render too often
- keys are unstable
- state is stored too high in the tree
- unnecessary props change on many children

React reduces DOM work, but your component structure still matters.

## Render Phase and Commit Phase

React work can be thought of in two broad phases.

During the render phase, React calls components and builds the next UI description.

```jsx
function ProductRow({ product }) {
  return <li>{product.name}</li>;
}
```

During the commit phase, React applies the needed changes to the real DOM.

Rendering should be pure because React may start, pause, repeat, or discard render work in modern React. DOM mutations and side effects should happen after React commits, not while a component is calculating JSX.

## Example: Updating a Label

```jsx
function SaveStatus({ isSaving }) {
  return (
    <button disabled={isSaving}>
      {isSaving ? "Saving..." : "Save"}
    </button>
  );
}
```

If `isSaving` changes from `false` to `true`, React does not need to recreate your whole app. It can update the button's disabled state and text.

## Common Mistakes

- Thinking the virtual DOM is the same as the browser DOM.
- Assuming React updates are free because diffing exists.
- Doing side effects during render because "React will handle it."
- Optimizing before measuring real render or interaction problems.
- Blaming the virtual DOM when unstable keys or broad state placement are the actual issue.

:::quiz
question: What is the virtual DOM in React?
options:
  - A browser API for faster HTML parsing
  - An in-memory description of the UI React can compare between renders
  - A CSS optimization system
  - A replacement for JavaScript state
answer: 1
explanation: React uses element trees as descriptions of UI. Comparing old and new descriptions helps React decide what real DOM updates are needed.
:::

## Mini Challenge

Look at this component:

```jsx
function ProductList({ products, selectedId }) {
  return (
    <ul>
      {products.map((product) => (
        <li
          key={product.id}
          className={product.id === selectedId ? "selected" : ""}
        >
          {product.name}
        </li>
      ))}
    </ul>
  );
}
```

Explain what changes in the UI description when `selectedId` changes from one product id to another. Which DOM updates should React need to commit?

## Recap

The virtual DOM is React's description-based update model. Components return what the UI should be, and React compares descriptions to update the real DOM efficiently.
