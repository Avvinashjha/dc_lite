# useMemo and useCallback

`useMemo` and `useCallback` help keep values stable between renders.

They are performance tools, not default requirements.

## useMemo

`useMemo` caches the result of a calculation.

```jsx
const visibleProducts = useMemo(() => {
  return products
    .filter((product) => product.inStock)
    .sort((a, b) => a.name.localeCompare(b.name));
}, [products]);
```

React reuses the previous result while dependencies stay the same.

## When useMemo Helps

Use `useMemo` when:

- a calculation is expensive
- dependencies do not change often
- the memoized value is passed to a memoized child
- recomputing creates noticeable lag

```jsx
function ProductPage({ products, query }) {
  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [products, query]);

  return <ProductList products={filteredProducts} />;
}
```

For small arrays, this may not matter. For large lists, it can.

## useCallback

`useCallback` caches a function reference.

```jsx
const handleSelect = useCallback((id) => {
  setSelectedId(id);
}, []);
```

It is equivalent to:

```jsx
const handleSelect = useMemo(() => {
  return (id) => setSelectedId(id);
}, []);
```

Use `useCallback` when a stable function reference matters.

## useCallback with Memoized Children

```jsx
const ProductRow = React.memo(function ProductRow({ product, onSelect }) {
  return <button onClick={() => onSelect(product.id)}>{product.name}</button>;
});

function ProductList({ products }) {
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = useCallback((id) => {
    setSelectedId(id);
  }, []);

  return products.map((product) => (
    <ProductRow
      key={product.id}
      product={product}
      onSelect={handleSelect}
    />
  ));
}
```

Without `useCallback`, every row receives a new `onSelect` function when `ProductList` renders.

## Dependencies Must Be Correct

Dependencies tell React when to recalculate.

```jsx
const total = useMemo(() => {
  return items.reduce((sum, item) => sum + item.price, 0);
}, [items]);
```

Leaving out dependencies creates stale values.

```jsx
const total = useMemo(() => {
  return items.reduce((sum, item) => sum + item.price, 0);
}, []); // wrong if items can change
```

The UI may show an old total.

## Avoid Memoizing Everything

This is usually unnecessary:

```jsx
const label = useMemo(() => `Hello, ${name}`, [name]);
```

The calculation is cheap. The memoization adds complexity without meaningful benefit.

Memoization also has a cost: React must store the value and compare dependencies.

## Stale Closure Trap

```jsx
const handleSave = useCallback(() => {
  saveDraft(draft);
}, []);
```

If `draft` changes, this callback still uses the initial draft because the dependency array is empty.

Fix it:

```jsx
const handleSave = useCallback(() => {
  saveDraft(draft);
}, [draft]);
```

Or use a functional update when appropriate.

## Common Mistakes

- Using `useMemo` for cheap calculations.
- Using `useCallback` for every event handler.
- Leaving dependencies out to "make it stable".
- Passing memoized values to children that are not memoized and expecting a benefit.
- Forgetting that memoization is a cache, not a guarantee of business logic correctness.

:::quiz
question: What is the main difference between useMemo and useCallback?
options:
  - useMemo caches a value, while useCallback caches a function reference
  - useMemo only works in class components
  - useCallback prevents state updates
  - useMemo runs after paint, while useCallback runs before paint
answer: 0
explanation: useMemo returns a cached calculation result. useCallback returns a cached function reference.
:::

## Recap

Use `useMemo` for expensive calculated values and `useCallback` for stable function props.

Keep dependency arrays correct. A stale memoized value is worse than a harmless re-render.

## Practice

Build a product search page with a large product array.

Measure typing responsiveness before and after memoizing the filtered list. Then add a memoized row component and test whether `useCallback` changes row renders.
