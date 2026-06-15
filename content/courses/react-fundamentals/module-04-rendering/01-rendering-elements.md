# Rendering Elements

Rendering is the process of turning React element descriptions into UI on the page.

In modern React apps, rendering usually starts with `createRoot`.

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

This code tells React:

- find the DOM node with id `root`
- create a React root attached to that node
- render the `App` component inside it

## The HTML Mount Point

React needs a real DOM element to own.

In a Vite project, `index.html` usually contains:

```html
<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>
```

React controls what appears inside `#root`. The rest of the page still belongs to normal HTML.

## Elements Are Descriptions

A React element is a description of what should appear.

```jsx
const element = <h1>Hello React</h1>;
```

Rendering the element does not mean you manually create an `h1`. React reads the description and decides how to update the DOM.

Most apps render a component tree rather than a single element.

```jsx
function App() {
  return (
    <main>
      <h1>Dashboard</h1>
      <StatusPanel />
    </main>
  );
}
```

## Rendering Happens More Than Once

The initial render creates the starting UI. Later renders happen when state, props, or context change.

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

Clicking the button updates state. React calls `Counter` again to get the next UI description.

Rendering does not always mean React replaces the whole DOM. React compares the new description with the previous one and updates what changed.

## Components Must Be Pure While Rendering

A component should calculate JSX from props and state.

```jsx
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}
```

Avoid changing external values, starting timers, making network requests, or setting state during render.

```jsx
// Bad: this can cause an infinite render loop
function BrokenCounter() {
  const [count, setCount] = useState(0);
  setCount(count + 1);
  return <p>{count}</p>;
}
```

Side effects belong in event handlers or effect hooks, which you will learn later.

## StrictMode Awareness

In development, `StrictMode` may intentionally call components more than once to help reveal unsafe rendering behavior.

```jsx
<StrictMode>
  <App />
</StrictMode>
```

If a component does something impure during render, double-calling makes the bug easier to notice.

Do not remove `StrictMode` just because you see duplicate logs in development. Instead, check whether the component is doing side effects while rendering.

## Common Mistakes

- Calling `createRoot` inside a component. It should be done once at the app entry point.
- Rendering into the wrong DOM id.
- Expecting a render to replace the entire page.
- Setting state while rendering.
- Treating duplicate development logs in `StrictMode` as production behavior.

:::quiz
question: Where should `createRoot(...).render(...)` usually live in a React app?
options:
  - Inside every component
  - In the app entry file such as `main.jsx`
  - Inside each event handler
  - In a CSS file
answer: 1
explanation: The React root is normally created once in the entry file, then React manages the component tree below that root.
:::

## Practice Challenge

Create a minimal `main.jsx` and `App.jsx`.

Requirements:

- `main.jsx` uses `createRoot`.
- `App.jsx` renders a heading and a `Counter` component.
- `Counter` updates with a button click.
- No component calls `createRoot`.

## Recap

Rendering starts by attaching React to a DOM mount point. React calls components to produce element descriptions, then updates the DOM to match those descriptions over time.
