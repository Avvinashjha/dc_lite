# useEffect

`useEffect` lets a component synchronize with something outside React's render output.

Examples include:

- setting up subscriptions
- updating the document title
- starting and stopping timers
- connecting to browser APIs
- fetching data when a component appears or when a key value changes

## Basic Example

```jsx
import { useEffect, useState } from "react";

function PageTitleCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  return <button onClick={() => setCount(count + 1)}>Add</button>;
}
```

The effect runs after React commits the render to the screen. The dependency array tells React when the synchronization should run again.

## Effects Are Not Event Handlers

Use event handlers for direct user actions.

```jsx
function handleSubmit() {
  sendAnalytics("signup_submitted");
}
```

Do not move this into an effect just because it uses state. Effects are for synchronization caused by rendering, not for every action in the app.

## Dependency Arrays

```jsx
useEffect(() => {
  document.title = title;
}, [title]);
```

Every reactive value used inside the effect should be included in the dependency array: props, state, and values declared inside the component.

An empty array means the effect does not depend on any reactive values from the component.

```jsx
useEffect(() => {
  console.log("Component mounted");
}, []);
```

## Cleanup

Return a cleanup function when the effect creates something that must be stopped.

```jsx
useEffect(() => {
  const id = setInterval(() => {
    console.log("tick");
  }, 1000);

  return () => clearInterval(id);
}, []);
```

React runs cleanup before the effect runs again and when the component unmounts.

## Stale Closures

Effects capture values from the render that created them.

```jsx
useEffect(() => {
  const id = setInterval(() => {
    console.log(count);
  }, 1000);

  return () => clearInterval(id);
}, []);
```

This logs the initial `count`, not the latest count. Add `count` to dependencies, use a functional update, or store the latest value in a ref depending on the goal.

:::quiz
question: What should go in an effect dependency array?
options:
  - Reactive values from the component that the effect reads
  - Only values that are strings or numbers
  - Nothing, because React can always infer them at runtime
answer: 0
explanation: Effects should list props, state, and component-scope values that they read so React can resynchronize correctly.
:::

## Common Mistakes

Do not use effects to compute values that can be calculated during render.

```jsx
const filteredItems = items.filter((item) => item.visible);
```

Do not suppress dependency warnings without understanding why. The warning often points to a stale closure or misplaced logic.

Do not forget cleanup for subscriptions, timers, and in-flight async work that can outlive the component.

## Practice Challenge

Create a component that starts a timer when `isRunning` is true and stops it when false.

Requirements:

- use an effect
- include the correct dependencies
- clean up the interval
- avoid reading stale state inside the interval

## Recap

`useEffect` synchronizes React components with external systems. Use it after rendering, list dependencies honestly, clean up resources, and avoid using effects for calculations or direct event responses.
