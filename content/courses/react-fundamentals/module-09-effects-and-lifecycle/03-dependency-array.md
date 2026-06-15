# The Dependency Array

The dependency array tells React when an effect, memoized value, or memoized callback should be recalculated.

For effects, dependencies answer this question: "Which reactive values does this synchronization depend on?"

## Reactive Values

Reactive values include:

- props
- state
- context values
- variables and functions declared inside the component

```jsx
function UserProfile({ userId }) {
  const [includePosts, setIncludePosts] = useState(false);

  useEffect(() => {
    loadUser(userId, includePosts);
  }, [userId, includePosts]);
}
```

Both `userId` and `includePosts` are read by the effect, so both are dependencies.

## Empty Dependency Array

```jsx
useEffect(() => {
  const connection = connectOnce();
  return () => connection.disconnect();
}, []);
```

An empty array means the effect does not read changing values from the component. It does not mean "ignore changes."

If the effect reads a prop or state value, `[]` is usually wrong.

## No Dependency Array

```jsx
useEffect(() => {
  console.log("after every render");
});
```

Without an array, the effect runs after every render. This is less common and should be intentional.

## Object and Function Dependencies

Objects and functions created during render have new identities each render.

```jsx
const options = { roomId };

useEffect(() => {
  const connection = connect(options);
  return () => connection.disconnect();
}, [options]);
```

This reconnects every render because `options` is always new.

Move object creation inside the effect when possible.

```jsx
useEffect(() => {
  const options = { roomId };
  const connection = connect(options);
  return () => connection.disconnect();
}, [roomId]);
```

## Stale Closures

Missing dependencies freeze values from an old render.

```jsx
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1);
  }, 1000);

  return () => clearInterval(id);
}, []);
```

This uses the initial `count`. A functional update avoids reading `count`.

```jsx
useEffect(() => {
  const id = setInterval(() => {
    setCount((count) => count + 1);
  }, 1000);

  return () => clearInterval(id);
}, []);
```

## Removing Dependencies Correctly

If a dependency causes too many reruns, do not delete it first. Change the code so the effect no longer reads it.

Options include:

- move calculations into the effect
- move event-specific logic into an event handler
- use a functional state update
- store non-rendering mutable values in a ref
- split one broad effect into smaller effects

:::quiz
question: What does an empty dependency array mean?
options:
  - The effect reads no reactive values from the component
  - React should ignore all dependency rules
  - The effect is guaranteed to run only once in every possible environment
answer: 0
explanation: [] says the effect does not depend on props, state, or component-scope values that change between renders.
:::

## Common Mistakes

Do not include state setters such as `setCount` just to silence uncertainty. React state setters are stable.

Do not include derived values if including their source values is clearer, unless the derived value is what the effect actually reads.

Do not wrap everything in `useCallback` or `useMemo` to satisfy dependencies. First check whether the effect is necessary.

## Practice Challenge

Fix the dependencies in this effect:

```jsx
function Search({ query, page }) {
  const options = { page };

  useEffect(() => {
    search(query, options);
  }, []);
}
```

Try two solutions:

- include correct dependencies
- restructure the effect to avoid unnecessary object identity changes

## Recap

Dependency arrays protect synchronization from stale values and unnecessary work. List reactive values honestly, understand identity changes, and restructure code instead of hiding dependencies.
