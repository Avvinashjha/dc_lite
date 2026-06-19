# Common Effect Pitfalls

Many React bugs come from effects that are unnecessary, too broad, missing cleanup, or using stale values. This lesson collects the traps to check before adding another effect.

## Pitfall 1: Derived State in Effects

Avoid this:

```jsx
const [fullName, setFullName] = useState("");

useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);
```

Calculate during render instead.

```jsx
const fullName = `${firstName} ${lastName}`;
```

This avoids an extra render and prevents values from falling out of sync.

## Pitfall 2: Event Logic in Effects

Avoid this:

```jsx
useEffect(() => {
  if (submitted) {
    sendForm(values);
  }
}, [submitted, values]);
```

If the user submitted the form, call the submit function from the submit handler.

```jsx
async function handleSubmit(event) {
  event.preventDefault();
  await sendForm(values);
}
```

## Pitfall 3: Missing Dependencies

```jsx
useEffect(() => {
  socket.send(message);
}, []);
```

If the effect reads `socket` and `message`, the dependency list must reflect the synchronization. Missing dependencies create stale closures.

## Pitfall 4: Infinite Loops

```jsx
useEffect(() => {
  setOptions({ pageSize: 20 });
}, [options]);
```

The effect sets state, which changes `options`, which reruns the effect. Fix the state shape or remove the effect.

## Pitfall 5: Unstable Object Dependencies

```jsx
const filters = { status };

useEffect(() => {
  loadTasks(filters);
}, [filters]);
```

`filters` is new every render. Move it inside the effect or memoize it when identity stability is actually needed.

## Pitfall 6: Missing Cleanup

```jsx
useEffect(() => {
  window.addEventListener("resize", handleResize);
}, []);
```

This leaks a listener. Return cleanup.

```jsx
useEffect(() => {
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, [handleResize]);
```

## Pitfall 7: Overusing Effects

Before writing an effect, ask:

- Is this synchronizing with an external system?
- Can this be calculated during render?
- Is this caused by a specific event?
- Does this state belong in a reducer?
- Would a framework loader or data library handle this better?

:::quiz
question: Which code usually does not need an effect?
options:
  - Calculating fullName from firstName and lastName
  - Subscribing to a browser event
  - Connecting to a chat room
answer: 0
explanation: Derived values can usually be calculated during render. Effects are for synchronization with external systems.
:::

## Debugging Checklist

When an effect behaves strangely:

- check whether it is needed
- inspect every value it reads
- verify dependencies
- check cleanup
- consider Strict Mode double setup in development
- look for state updates that trigger the same effect again
- check race conditions in async work

## Practice Challenge

Refactor a component with three effects:

- one derived-state effect
- one event-driven effect
- one real subscription effect

Remove the first two effects and keep the subscription effect with correct cleanup.

## Recap

Effects are easy to add and expensive to misuse. Prefer render calculations and event handlers when they fit, list dependencies honestly, clean up external work, and watch for stale closures, loops, and race conditions.
