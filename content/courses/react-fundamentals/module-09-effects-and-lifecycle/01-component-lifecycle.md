# Component Lifecycle

React components move through a lifecycle: they render, appear on the screen, update when inputs change, and eventually leave the screen.

Class components described this with methods such as `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount`. Function components use rendering plus hooks.

## Render and Commit

React work has two broad phases:

- render: React calls components and calculates what the UI should look like
- commit: React applies changes to the DOM

Effects run after the commit. That means the DOM has been updated by the time a normal `useEffect` runs.

## Mount, Update, Unmount

A component mounts when it appears for the first time.

It updates when props, state, or context cause it to render again.

It unmounts when React removes it from the screen.

```jsx
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = connectToRoom(roomId);

    return () => {
      connection.disconnect();
    };
  }, [roomId]);
}
```

This one effect covers several lifecycle moments:

- connect after mount
- reconnect after `roomId` changes
- disconnect before reconnecting or unmounting

## Mapping Class Lifecycle to Effects

Class idea:

```jsx
componentDidMount() {}
componentDidUpdate() {}
componentWillUnmount() {}
```

Hook idea:

```jsx
useEffect(() => {
  // synchronize after render

  return () => {
    // cleanup previous synchronization
  };
}, [dependencies]);
```

Do not translate lifecycle methods mechanically. Effects are about synchronization, not "where do I put mount code?"

## Strict Mode Awareness

In development, React Strict Mode may run effects, clean them up, and run them again to reveal unsafe side effects.

If duplicate setup breaks your code, the effect likely needs proper cleanup or idempotent setup.

## Common Mistakes

Do not perform side effects during render.

```jsx
function Page({ title }) {
  document.title = title; // wrong place
  return <h1>{title}</h1>;
}
```

Use an effect.

```jsx
useEffect(() => {
  document.title = title;
}, [title]);
```

Do not think `[]` means "run once forever" in every environment. It means the effect has no reactive dependencies.

:::quiz
question: When does a normal useEffect run?
options:
  - After React commits the render
  - During JSX parsing before the component runs
  - Before every state variable is initialized
answer: 0
explanation: useEffect runs after React has committed updates to the DOM.
:::

## Practice Challenge

Convert this lifecycle idea into an effect:

- when `roomId` changes, connect to that room
- disconnect from the old room first
- disconnect when the component unmounts
- avoid reconnecting when unrelated state changes

## Recap

Function components do not need class lifecycle methods. Think in terms of rendering and synchronization: render calculates UI, effects connect to external systems after commit, and cleanup reverses previous setup.
