# How React Renders

React performance starts with understanding what a render is.

A render is React calling your component function or class `render` method to calculate what the UI should look like.

Rendering does not always mean the browser DOM changed. React can render, compare the result, and decide that only a small DOM update is needed.

## What Triggers a Render?

A component can render when:

- its state changes
- its parent renders
- its context value changes
- an external store subscription tells React to update

```jsx
function Parent() {
  const [count, setCount] = useState(0);

  return (
    <>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
      <Child />
    </>
  );
}
```

When `Parent` renders, `Child` normally renders too.

That is not automatically a problem.

## Render Phase and Commit Phase

React work is often described in two phases.

The render phase calculates the next UI.

The commit phase applies changes to the DOM and runs layout effects.

Your component render logic should be pure:

```jsx
function Total({ items }) {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  return <p>Total: {total}</p>;
}
```

Avoid side effects during render:

```jsx
function BadTotal({ items }) {
  localStorage.setItem("last-count", items.length); // side effect
  return <p>{items.length}</p>;
}
```

Side effects belong in effects or event handlers.

## Re-render Does Not Mean Slow

A small re-render is usually cheap.

Do not try to prevent every render. Optimize when rendering causes visible lag, high CPU usage, slow input, or poor profiling results.

A useful question is:

> Is this render expensive enough to matter?

## Expensive Render Work

Render can become expensive when it includes:

- large lists
- heavy calculations
- complex component trees
- creating many objects for memoized children
- repeated formatting or sorting
- unnecessary context updates

```jsx
function ProductList({ products }) {
  const sortedProducts = [...products].sort((a, b) => a.name.localeCompare(b.name));

  return sortedProducts.map((product) => (
    <ProductRow key={product.id} product={product} />
  ));
}
```

Sorting on every render may be fine for 20 products and slow for 20,000.

## State Placement

Where state lives affects how much of the tree renders.

```jsx
function App() {
  const [draft, setDraft] = useState("");

  return (
    <>
      <SearchInput value={draft} onChange={setDraft} />
      <ExpensiveDashboard />
    </>
  );
}
```

Typing re-renders `App`, which re-renders `ExpensiveDashboard`.

If the draft is only needed by the search area, move it closer.

```jsx
function App() {
  return (
    <>
      <SearchSection />
      <ExpensiveDashboard />
    </>
  );
}
```

Good state placement is often better than adding memoization everywhere.

## Keys and Rendering

Keys help React match list items between renders.

```jsx
items.map((item) => <TodoRow key={item.id} item={item} />)
```

Avoid array indexes as keys when items can be inserted, removed, or reordered.

Bad keys can cause unnecessary DOM work and state bugs.

## Common Mistakes

- Assuming every render updates the DOM.
- Optimizing before measuring.
- Keeping fast-changing state too high in the tree.
- Doing expensive calculations during render without need.
- Using unstable keys in lists.
- Treating `React.memo`, `useMemo`, and `useCallback` as default requirements.

:::quiz
question: Which statement is true about React rendering?
options:
  - React may render a component without changing the DOM
  - Every render replaces the whole page
  - Child components never render when a parent renders
  - Rendering is the right place for side effects
answer: 0
explanation: React renders to calculate the next UI, then commits only the necessary changes to the DOM.
:::

## Recap

Rendering is React calculating UI. Committing is React applying changes.

Before reaching for memoization, check state placement, list keys, expensive calculations, and real profiling evidence.

## Practice

Create a page with a search input and an expensive list.

Move the search state down into a smaller component and compare how many components render during typing.
