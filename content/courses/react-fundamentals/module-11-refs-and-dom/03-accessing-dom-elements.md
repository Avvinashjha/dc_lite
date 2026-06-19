# Accessing DOM Elements

React manages the DOM for you, but some browser features require a real DOM node.

Examples include focusing, scrolling, measuring, selecting text, playing media, and integrating with non-React libraries.

## Focus an Element

Use a ref and call the browser method in an event handler or effect.

```jsx
function AddTodo() {
  const inputRef = useRef(null);

  function handleAdd() {
    // Add the todo here.
    inputRef.current?.focus();
  }

  return (
    <>
      <input ref={inputRef} placeholder="New todo" />
      <button onClick={handleAdd}>Add</button>
    </>
  );
}
```

The optional chaining protects against the element not being mounted.

## Scroll Into View

```jsx
function ErrorSummary({ hasError }) {
  const errorRef = useRef(null);

  useEffect(() => {
    if (hasError) {
      errorRef.current?.scrollIntoView({ block: "start" });
    }
  }, [hasError]);

  return hasError ? (
    <div ref={errorRef} role="alert">
      Please fix the highlighted fields.
    </div>
  ) : null;
}
```

This is better than searching the document with `querySelector`, because the ref is tied to this component's rendered element.

## Measuring Elements

Sometimes you need size or position.

```jsx
function TooltipAnchor() {
  const buttonRef = useRef(null);
  const [rect, setRect] = useState(null);

  useLayoutEffect(() => {
    if (!buttonRef.current) {
      return;
    }

    setRect(buttonRef.current.getBoundingClientRect());
  }, []);

  return (
    <>
      <button ref={buttonRef}>Hover me</button>
      {rect && <p>Button width: {Math.round(rect.width)}px</p>}
    </>
  );
}
```

`useLayoutEffect` runs after React has updated the DOM but before the browser paints. It is useful when a measurement must happen before the user sees the result.

For many cases, `useEffect` is enough and avoids blocking paint.

## Responding to Size Changes

An element can resize after mount. For example, text can wrap, images can load, or the viewport can change.

Use `ResizeObserver` when the measurement must stay current.

```jsx
function MeasuredPanel() {
  const panelRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!panelRef.current) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });

    observer.observe(panelRef.current);

    return () => observer.disconnect();
  }, []);

  return <section ref={panelRef}>Panel width: {Math.round(width)}px</section>;
}
```

Always clean up observers and listeners.

## Avoid Direct DOM Mutation

This is usually a mistake:

```jsx
function BadStatus({ message }) {
  const statusRef = useRef(null);

  useEffect(() => {
    statusRef.current.textContent = message;
  }, [message]);

  return <p ref={statusRef} />;
}
```

React should render the message:

```jsx
function Status({ message }) {
  return <p>{message}</p>;
}
```

If React owns the content, let React update it.

## Integrating with Third-Party DOM Libraries

Some libraries need a DOM node.

```jsx
function Chart({ data }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    chartRef.current = createChart(containerRef.current);

    return () => {
      chartRef.current.destroy();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    chartRef.current?.setData(data);
  }, [data]);

  return <div ref={containerRef} />;
}
```

Create the library instance when the node exists, update it when props change, and clean it up when the component unmounts.

## Common Mistakes

- Using `document.querySelector` when a ref would be scoped and safer.
- Measuring before the element has rendered.
- Forgetting that conditional rendering can make `ref.current` become `null`.
- Mutating DOM that React is also trying to manage.
- Leaving observers, event listeners, or library instances alive after unmount.

:::quiz
question: Why is a ref usually better than document.querySelector inside a component?
options:
  - It is scoped to the element React rendered for that component
  - It always works before render
  - It automatically updates state when the DOM changes
  - It prevents all layout shifts
answer: 0
explanation: A ref points directly to the element React rendered, avoiding global DOM searches and accidental matches elsewhere on the page.
:::

## Recap

Use refs for safe, scoped DOM access when you need browser APIs.

Prefer React rendering for content and attributes. Reach for direct DOM methods only for imperative actions, measurement, or integration.

## Practice

Build a form that scrolls to the first invalid field after submit.

Use refs for the fields, state for validation messages, and avoid `document.querySelector`.
