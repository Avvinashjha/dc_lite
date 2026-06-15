# The useRef Hook

`useRef` creates a ref object for a function component.

```jsx
const ref = useRef(initialValue);
```

The returned object stays the same between renders.

```jsx
{
  current: initialValue
}
```

You can read or write `ref.current`.

## DOM Refs

The most common first use of `useRef` is storing a DOM element.

```jsx
function LoginForm() {
  const emailRef = useRef(null);

  function focusEmail() {
    emailRef.current?.focus();
  }

  return (
    <form>
      <input ref={emailRef} type="email" />
      <button type="button" onClick={focusEmail}>
        Focus email
      </button>
    </form>
  );
}
```

React fills `emailRef.current` after the input is mounted.

## Mutable Values That Do Not Render

Refs can also store values that should not affect rendering.

```jsx
function Stopwatch() {
  const intervalIdRef = useRef(null);
  const [seconds, setSeconds] = useState(0);

  function start() {
    if (intervalIdRef.current !== null) {
      return;
    }

    intervalIdRef.current = setInterval(() => {
      setSeconds((value) => value + 1);
    }, 1000);
  }

  function stop() {
    clearInterval(intervalIdRef.current);
    intervalIdRef.current = null;
  }

  return (
    <>
      <p>{seconds}s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </>
  );
}
```

The timer ID is not displayed, so it belongs in a ref. The seconds value is displayed, so it belongs in state.

## Ref vs State

Use state when:

- the value affects what is rendered
- changing the value should update the screen
- the value is part of the component's visible behavior

Use a ref when:

- the value needs to survive renders
- changing the value should not trigger a render
- the value represents an imperative handle, timer ID, DOM node, or previous value

## Storing Previous Values

A ref can remember a previous prop or state value.

```jsx
function PriceChange({ price }) {
  const previousPriceRef = useRef(price);

  useEffect(() => {
    previousPriceRef.current = price;
  }, [price]);

  const previousPrice = previousPriceRef.current;

  return (
    <p>
      Current: {price}, previous: {previousPrice}
    </p>
  );
}
```

The effect runs after rendering, so during the next render the ref contains the previous value.

## Do Not Read Layout During Render

This is a common mistake:

```jsx
function BadMeasure() {
  const boxRef = useRef(null);
  const width = boxRef.current?.offsetWidth;

  return <div ref={boxRef}>Width: {width}</div>;
}
```

During render, the DOM may not exist yet. Even when it does, reading layout during render creates confusing timing.

Measure in an effect instead.

```jsx
function MeasureBox() {
  const boxRef = useRef(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (!boxRef.current) {
      return;
    }

    setWidth(boxRef.current.offsetWidth);
  }, []);

  return <div ref={boxRef}>Width: {width}</div>;
}
```

## Updating a Ref Is Immediate

Unlike state updates, ref writes are synchronous.

```jsx
valueRef.current = "saved";
console.log(valueRef.current); // "saved"
```

That does not mean refs are better than state. It means refs are useful for mutable bookkeeping.

## Common Mistakes

- Expecting `ref.current = value` to update the UI.
- Using refs to avoid learning state or effects.
- Creating a ref inside a loop or condition.
- Reading DOM measurements during render.
- Forgetting to clear timers or subscriptions stored in refs.

:::quiz
question: A value should be stored in state instead of a ref when...
options:
  - changing it should update what the user sees
  - it stores a DOM node
  - it stores an interval ID
  - it stores a third-party library instance
answer: 0
explanation: State is the right tool for values that drive rendering. Refs are better for mutable values that do not need to render.
:::

## Recap

`useRef` gives you a stable object whose `current` value can change without re-rendering.

Use it for DOM access, timers, previous values, and integration details. Use state for visible UI data.

## Practice

Create a component with a text input, a "Save draft" button, and a visible "Saved count".

Store the latest draft text in a ref, but store the saved count in state so the screen updates when the count changes.
