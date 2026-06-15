# Render Props

A render prop is a prop whose value is a function that returns UI.

The component owns some behavior or data. The caller decides how to render it.

## Basic Example

```jsx
function MousePosition({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  return (
    <div
      onMouseMove={(event) => {
        setPosition({ x: event.clientX, y: event.clientY });
      }}
    >
      {render(position)}
    </div>
  );
}
```

Usage:

```jsx
<MousePosition
  render={({ x, y }) => (
    <p>
      Mouse: {x}, {y}
    </p>
  )}
/>
```

The `MousePosition` component handles tracking. The parent controls presentation.

## children as a Function

Many render prop APIs use `children`.

```jsx
function Toggle({ children }) {
  const [on, setOn] = useState(false);

  return children({
    on,
    toggle: () => setOn((value) => !value),
  });
}
```

Usage:

```jsx
<Toggle>
  {({ on, toggle }) => (
    <button onClick={toggle}>{on ? "On" : "Off"}</button>
  )}
</Toggle>
```

This is still a render prop. The function happens to be passed as `children`.

## Why Use Render Props?

Render props are useful when:

- behavior is reusable
- the rendering needs to vary a lot
- a component should not decide its own markup
- the caller needs access to internal state or helper functions

Before hooks, render props were a common way to share stateful behavior.

## Modern Hook Alternative

This render prop:

```jsx
<Toggle>
  {({ on, toggle }) => (
    <Switch checked={on} onChange={toggle} />
  )}
</Toggle>
```

could often become:

```jsx
function SettingsSwitch() {
  const { on, toggle } = useToggle();

  return <Switch checked={on} onChange={toggle} />;
}
```

Hooks are usually simpler when the consumer is already a function component.

Render props are still useful in component libraries and in places where JSX composition is the main API.

## Common Mistake: New Functions and Memoization

Render props often create inline functions.

```jsx
<DataLoader>
  {(data) => <Chart data={data} />}
</DataLoader>
```

This is normal. Do not optimize it automatically.

But if the child relies on memoization and the render function identity matters, you may need to move or memoize the function.

Optimize based on measurement, not habit.

## Error and Loading States

Render prop components should expose enough state for realistic UI.

```jsx
function DataLoader({ url, children }) {
  const { data, error, loading } = useFetch(url);

  return children({ data, error, loading });
}
```

Usage:

```jsx
<DataLoader url="/api/products">
  {({ data, error, loading }) => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Could not load products.</p>;
    return <ProductGrid products={data} />;
  }}
</DataLoader>
```

The caller can choose the right UI for each state.

## Common Mistakes

- Calling the render prop without checking that it is a function.
- Hiding too much logic inside the render function.
- Using render props where a simple `children` node would be enough.
- Making the API hard to read by passing too many values.
- Assuming render props are obsolete; older code and libraries still use them.

:::quiz
question: What makes a prop a render prop?
options:
  - It is a function prop used to decide what UI to render
  - It must be named render
  - It can only be used in class components
  - It prevents re-renders automatically
answer: 0
explanation: A render prop is any function prop that a component calls to render UI. It does not have to be named render.
:::

## Recap

Render props separate behavior from presentation by letting the caller provide a rendering function.

They are less common in new app code because hooks solve many of the same problems, but they remain an important React pattern.

## Practice

Build a `WindowSize` component that passes `{ width, height }` to its child function.

Use it to render both a text label and a layout warning when the window is narrow.
