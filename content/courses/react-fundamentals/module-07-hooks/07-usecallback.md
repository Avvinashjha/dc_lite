# useCallback

`useCallback` caches a function between renders.

```jsx
const handleSelect = useCallback((id) => {
  setSelectedId(id);
}, []);
```

It is similar to `useMemo`, but it returns a function.

```jsx
const handleSelect = useMemo(() => {
  return (id) => setSelectedId(id);
}, []);
```

## Why Function Identity Matters

Functions created inside a component are new on every render.

```jsx
function ProductPage() {
  function handleAddToCart(productId) {
    addToCart(productId);
  }

  return <ProductList onAdd={handleAddToCart} />;
}
```

This is usually fine. It matters when a child is memoized, the function is a dependency of another hook, or identity changes cause expensive work.

## Pairing with memo

```jsx
const ProductRow = memo(function ProductRow({ product, onAdd }) {
  return <button onClick={() => onAdd(product.id)}>Add</button>;
});

function ProductList({ products }) {
  const handleAdd = useCallback((productId) => {
    addToCart(productId);
  }, []);

  return products.map((product) => (
    <ProductRow key={product.id} product={product} onAdd={handleAdd} />
  ));
}
```

`useCallback` helps only if the child can skip rendering and the function reference would otherwise change.

## Dependency Pitfalls

Callbacks also capture values from the render that created them.

```jsx
const increment = useCallback(() => {
  setCount(count + 1);
}, []);
```

This callback always sees the initial `count`. Fix it with a dependency or a functional update.

```jsx
const increment = useCallback(() => {
  setCount((count) => count + 1);
}, []);
```

If the callback reads `userId`, include `userId`.

```jsx
const loadUser = useCallback(() => {
  return fetchUser(userId);
}, [userId]);
```

## When Not to Use It

Do not wrap every event handler in `useCallback`. It can add noise without improving performance.

Use it when function identity is part of the problem:

- memoized child props
- effect dependencies
- subscription APIs that need stable callbacks
- custom hooks that return callbacks

:::quiz
question: What problem can useCallback solve?
options:
  - It prevents all re-renders in a component
  - It keeps a function reference stable while dependencies are unchanged
  - It makes asynchronous code synchronous
answer: 1
explanation: useCallback memoizes function identity. It does not automatically prevent rendering by itself.
:::

## Common Mistakes

Do not leave dependencies empty to keep the function "stable" if the function reads changing values. That creates stale closures.

Do not use `useCallback` as a replacement for moving logic out of a component. Pure utility functions can often live outside the component entirely.

## Practice Challenge

Create a memoized `TodoItem` component.

Requirements:

- pass an `onToggle` callback from the parent
- use `useCallback` only if it helps the memoized child
- update todos with a functional state update
- explain what dependency list is required

## Recap

`useCallback` memoizes function identity. It is useful when identity affects rendering or effect behavior, but stale closures are a common trap. Include dependencies or use functional updates.
