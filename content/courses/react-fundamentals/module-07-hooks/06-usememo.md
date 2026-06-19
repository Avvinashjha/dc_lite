# useMemo

`useMemo` caches the result of a calculation between renders.

```jsx
const visibleItems = useMemo(() => {
  return items.filter((item) => item.visible);
}, [items]);
```

React reuses the previous result while the dependencies are unchanged.

## When useMemo Helps

Use `useMemo` when:

- a calculation is noticeably expensive
- a stable object or array reference prevents unnecessary child renders
- a derived value is passed to another hook that depends on identity

```jsx
const sortedProducts = useMemo(() => {
  return [...products].sort((a, b) => a.price - b.price);
}, [products]);
```

The copy matters. Sorting the original array would mutate props or state.

## When Not to Use It

Do not memoize every calculation.

```jsx
const fullName = `${firstName} ${lastName}`;
```

This is cheap and clear without `useMemo`.

Memoization has overhead and makes dependency correctness more important. Add it when it solves a real problem.

## Object Identity

Objects and arrays created during render are new on every render.

```jsx
const options = { pageSize: 20 };
```

If `options` is passed to a memoized child, that child may re-render every time. `useMemo` can stabilize it.

```jsx
const options = useMemo(() => ({ pageSize: 20 }), []);
```

## Dependency Pitfalls

The memoized calculation should list every reactive value it reads.

```jsx
const filtered = useMemo(() => {
  return items.filter((item) => item.category === selectedCategory);
}, [items, selectedCategory]);
```

Missing `selectedCategory` would return stale results.

## Common Mistakes

Do not use `useMemo` for side effects. It runs during rendering and should stay pure.

Do not mutate data inside `useMemo`.

```jsx
// Wrong: mutates products.
const sorted = useMemo(() => products.sort(compare), [products]);
```

Do not expect `useMemo` to be a semantic guarantee forever. It is a performance hint. Code should still be correct if React recalculates.

:::quiz
question: What should the function passed to useMemo do?
options:
  - Return a calculated value without side effects
  - Start subscriptions and timers
  - Update state on every render
answer: 0
explanation: useMemo is for pure calculations during render. Effects belong in useEffect.
:::

## Practice Challenge

Create a product list with search and sorting.

Requirements:

- use `useMemo` for filtering and sorting
- avoid mutating the original products array
- include all dependencies
- remove `useMemo` and compare readability for a tiny list

## Recap

`useMemo` caches calculated values. Use it for expensive work or stable references, keep calculations pure, include dependencies, and avoid adding it where simple render logic is enough.
