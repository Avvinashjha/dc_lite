# React.memo

`React.memo` lets React skip re-rendering a component when its props have not changed.

```jsx
const MemoizedComponent = React.memo(Component);
```

It is useful for components that render often with the same props and are expensive enough to matter.

## Basic Example

```jsx
const ProductRow = React.memo(function ProductRow({ product }) {
  return (
    <li>
      {product.name}: ${product.price}
    </li>
  );
});
```

If `ProductRow` receives the same `product` prop as last time, React can reuse the previous result.

## Shallow Prop Comparison

`React.memo` compares props shallowly.

These values are stable:

```jsx
<ProductRow id="p1" name="Keyboard" price={79} />
```

These values may be new every render:

```jsx
<ProductRow product={{ id: "p1", name: "Keyboard", price: 79 }} />
```

The object literal creates a new object each time, so `React.memo` sees a changed prop.

## Function Props

Inline functions are also new each render.

```jsx
<ProductRow product={product} onSelect={() => selectProduct(product.id)} />
```

This can defeat memoization.

You can sometimes move the function into the child:

```jsx
const ProductRow = React.memo(function ProductRow({ product, onSelect }) {
  return (
    <button onClick={() => onSelect(product.id)}>
      {product.name}
    </button>
  );
});
```

Now the parent can pass a stable `onSelect` function.

## When React.memo Helps

`React.memo` is most likely to help when:

- the component renders frequently
- the component receives the same props frequently
- rendering the component is expensive
- the parent renders for unrelated reasons
- props can be kept stable without awkward code

Example:

```jsx
const Chart = React.memo(function Chart({ data, options }) {
  return <ExpensiveChart data={data} options={options} />;
});
```

If chart data rarely changes but the parent renders often, memoization may help.

## When React.memo Does Not Help

It may not help when:

- props always change
- the component is cheap to render
- context changes force the component to render
- the memo comparison costs more than rendering
- the code becomes harder to understand

```jsx
const TinyLabel = React.memo(function TinyLabel({ text }) {
  return <span>{text}</span>;
});
```

Memoizing tiny components everywhere usually adds noise.

## Custom Comparison

`React.memo` accepts a custom comparison function.

```jsx
const ProductRow = React.memo(function ProductRow({ product }) {
  return <li>{product.name}</li>;
}, (previousProps, nextProps) => {
  return previousProps.product.id === nextProps.product.id
    && previousProps.product.name === nextProps.product.name;
});
```

Use this carefully. A wrong comparison can leave the UI stale.

If you ignore a prop that affects rendering, React may skip a render it needed.

## Context Still Matters

A memoized component can still re-render when context it reads changes.

```jsx
const Toolbar = React.memo(function Toolbar() {
  const theme = useContext(ThemeContext);
  return <div className={theme}>...</div>;
});
```

`React.memo` only compares props. It does not block context updates.

## Common Mistakes

- Wrapping every component in `React.memo`.
- Passing new object, array, or function props and expecting memoization to work.
- Writing custom comparisons that miss important props.
- Using memoization to hide poor state placement.
- Assuming `React.memo` prevents all renders.

:::quiz
question: Why might React.memo fail to skip a child render?
options:
  - The parent passes a new object or function prop each render
  - React.memo only works on class components
  - The child has no JSX
  - The component name starts with a lowercase letter
answer: 0
explanation: React.memo uses shallow prop comparison. New object and function references are considered different.
:::

## Recap

`React.memo` can skip renders when props are stable.

Use it for measured or obvious expensive cases, and remember that stable props matter as much as the memo wrapper.

## Practice

Create a parent with a counter and a slow `ProductList` child.

Wrap the child in `React.memo`, then test what happens when you pass stable props versus new array literals.
