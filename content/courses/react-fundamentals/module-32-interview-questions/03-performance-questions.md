# Performance Questions

React performance interviews are usually not about memorizing optimization APIs. They test whether you can identify unnecessary work, measure before changing code, and choose the simplest fix.

The best first answer is often: measure, understand the bottleneck, then optimize.

## 1. What Makes a React App Feel Slow?

Common causes:

- large JavaScript bundles
- slow API responses
- unnecessary re-renders
- expensive render calculations
- huge lists rendered all at once
- layout shifts
- unoptimized images
- blocking third-party scripts
- too much work on initial load

React is only one part of frontend performance.

## 2. How Do You Investigate Performance?

Use:

- browser Performance panel
- React DevTools Profiler
- network waterfall
- Lighthouse
- production monitoring
- bundle analyzer

Ask:

- Is the problem initial load, interaction, rendering, or network?
- Which component renders often?
- Which render is expensive?
- Is the browser blocked by JavaScript?
- Is the app downloading too much code?

## 3. What Is React.memo?

`React.memo` can skip re-rendering a component when its props are equal.

```jsx
const ProductCard = React.memo(function ProductCard({ product, onSelect }) {
  return <button onClick={() => onSelect(product.id)}>{product.name}</button>;
});
```

It helps when:

- the component renders often with the same props
- rendering is expensive
- props are stable

It does not help when props change every render.

## 4. useMemo and useCallback

`useMemo` memoizes expensive calculated values.

```jsx
const filteredProducts = useMemo(
  () => products.filter((product) => product.category === category),
  [products, category]
);
```

`useCallback` memoizes a function reference.

```jsx
const handleSelect = useCallback((id) => {
  setSelectedId(id);
}, []);
```

Use them to solve a measured problem, not as decoration.

## 5. Why Stable References Matter

This creates a new function each render:

```jsx
<ProductList onSelect={(id) => setSelectedId(id)} />
```

That is not automatically bad. It matters when the child is memoized or the function is a dependency of another hook.

Common mistake:

Adding `useCallback` everywhere can make code harder to read without improving performance.

## 6. List Virtualization

Rendering thousands of rows can be slow. Virtualization renders only the visible rows.

Use it for:

- large tables
- long feeds
- log viewers
- search results with many rows

Libraries such as `react-window` or `@tanstack/react-virtual` can help.

Edge cases:

- dynamic row heights
- keyboard navigation
- screen reader behavior
- preserving scroll position

## 7. Code Splitting

Code splitting reduces initial JavaScript.

```jsx
const SettingsPage = lazy(() => import("./SettingsPage"));
```

Good split points:

- routes
- admin sections
- chart-heavy pages
- rarely used modals

Avoid splitting every small component. Too many chunks can create network overhead.

## 8. State Placement and Re-renders

State location affects render scope.

If high-frequency state lives near the root, many components may re-render.

Example:

- search input text should often live near the search UI
- authenticated user may live in context
- theme may live in context
- hover state should usually stay local

Keep state as local as possible while still available where needed.

## 9. Context Performance

When a context value changes, all consumers of that context may re-render.

Improve by:

- splitting contexts by concern
- memoizing provider values when useful
- avoiding large frequently changing objects in global context
- using dedicated state libraries for high-frequency updates

Bad:

```jsx
<AppContext.Provider value={{ user, theme, cart, mousePosition }}>
```

Changing `mousePosition` could affect consumers that only need `theme`.

## 10. Bundle Size

Bundle size affects startup.

Ways to reduce it:

- remove unused dependencies
- import only what you need
- lazy-load heavy features
- prefer browser APIs when simple
- optimize images and fonts
- analyze before replacing packages

Awareness note:

A small library can pull in a large dependency tree. Check the built bundle, not only package size on npm.

:::quiz
question: What should you usually do before adding memoization throughout a React app?
options:
  - Measure where the performance problem actually is.
  - Convert every component to a class component.
  - Disable all effects.
  - Remove all keys from lists.
answer: 0
explanation: Memoization has costs and complexity. Measure first so you optimize the real bottleneck.
:::

## Tricky Questions

Question:

Does a parent re-render always mean the DOM changes?

Answer:

No. React may re-render components to calculate the next UI, but it updates the DOM only where the output actually changed.

Question:

Is `React.memo` always good?

Answer:

No. It adds comparison work and complexity. If props always change or rendering is cheap, it may not help.

Question:

Can performance bugs come from correct code?

Answer:

Yes. Code can be logically correct but still slow because it does too much work, ships too much JavaScript, or renders too many elements.

## Practice Challenge

You have a product page with 5,000 products, category filters, search, and a cart sidebar.

Explain:

- what you would measure first
- where you might use memoization
- whether list virtualization is needed
- what state should remain local
- how you would reduce initial bundle size

## Recap

React performance work starts with measurement. Optimize state placement, list rendering, bundle size, and expensive calculations before reaching for broad memoization.
