# Hydration

Hydration is the process where React attaches client-side behavior to HTML that was already rendered on the server.

The server sends visible markup. The client loads JavaScript and React connects that markup to components, state, refs, and event handlers.

## Hydration Flow

```text
server renders HTML
        |
        v
browser displays HTML
        |
        v
client JavaScript loads
        |
        v
React matches components to existing DOM
        |
        v
event handlers and state become active
```

Before hydration finishes, the user may see content but not be able to interact with every control.

## Matching Matters

For hydration to work well, the client render should produce the same initial output as the server render.

If they differ, React may warn about a hydration mismatch.

```jsx
function Clock() {
  return <p>{new Date().toLocaleTimeString()}</p>;
}
```

The server and client may render different times.

Better:

```jsx
function Clock() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
  }, []);

  return <p>{time || "Loading time..."}</p>;
}
```

The server and initial client render match, then the client updates after hydration.

## Common Causes of Mismatches

Hydration mismatches often come from:

- reading current time during render
- using random values during render
- reading `window` or `localStorage` during render
- locale differences between server and client
- invalid HTML nesting
- feature flags that differ between environments
- data changing between server render and client hydration

## Browser-Only Values

Avoid this during server rendering:

```jsx
function WidthLabel() {
  return <p>{window.innerWidth}px</p>;
}
```

Use an effect.

```jsx
function WidthLabel() {
  const [width, setWidth] = useState(null);

  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);

  return <p>{width === null ? "Unknown width" : `${width}px`}</p>;
}
```

The first render is consistent. The client updates after hydration.

## `useId` Awareness

React's `useId` helps generate consistent IDs across server and client renders.

```jsx
function EmailField() {
  const id = useId();

  return (
    <>
      <label htmlFor={id}>Email</label>
      <input id={id} type="email" />
    </>
  );
}
```

Avoid generating IDs with `Math.random()` during render.

## Hydration Cost

SSR can improve when content appears, but hydration still costs CPU.

Heavy hydration can delay interactivity.

Ways to reduce hydration cost include:

- keeping client components small
- avoiding unnecessary JavaScript above the fold
- using Server Components where appropriate
- splitting rarely used widgets
- deferring non-critical interactive features

## Streaming and Selective Hydration Awareness

React can hydrate parts of the page as their code and data become available.

With Suspense, a page can stream sections and hydrate interactive parts independently.

```text
header HTML arrives
product content arrives
reviews fallback appears
reviews content streams later
interactive widgets hydrate when ready
```

Frameworks usually manage the details, but Suspense boundaries are part of the mental model.

## Escape Hatches

Some frameworks provide options to render a component only on the client. This can be useful for browser-only widgets such as maps or charts.

Use this carefully. Client-only rendering can avoid hydration mismatches, but it also gives up server-rendered content for that component.

## Common Mistakes

- Treating hydration warnings as harmless noise.
- Rendering random IDs or timestamps during initial render.
- Assuming visible HTML means all controls are interactive.
- Making a large page a Client Component when only one widget needs interactivity.
- Hiding mismatches instead of fixing the source.

## Tricky Question

Can a page be fast to show content but slow to use?

Yes. SSR may deliver HTML quickly, but a large JavaScript bundle or expensive hydration can delay interaction.

:::quiz
question: What usually causes a hydration mismatch?
options:
  - The server HTML and the client's initial render do not match
  - The page has CSS
  - The component uses props
  - The server sends HTML before JavaScript
answer: 0
explanation: Hydration expects the initial client render to match the existing server-rendered DOM. Differences can cause warnings and incorrect behavior.
:::

## Practical Challenge

Create a component that displays:

- current time
- random id
- window width

First render those values directly and observe why SSR would mismatch. Then refactor to make the initial render deterministic and update browser-only values after hydration.

## Recap

Hydration turns server-rendered HTML into interactive React UI.

The key rule is consistency: server output and initial client output should match. After hydration, browser-only updates can run safely.
