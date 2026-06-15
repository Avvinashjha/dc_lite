# Recoil and Jotai

Recoil and Jotai are atom-based state management libraries.

An atom is a small piece of state that components can subscribe to independently.

This model can feel natural when application state is made of many small pieces instead of one large store.

## Atom-Based Thinking

Instead of one central object:

```js
{
  user: {},
  theme: "dark",
  sidebarOpen: true
}
```

Atom libraries let you define independent state units.

```js
const themeAtom = atom("light");
const sidebarOpenAtom = atom(false);
```

Components that read one atom do not need to subscribe to unrelated atoms.

## Jotai Example

Jotai has a very small API.

```jsx
import { atom, useAtom } from "jotai";

const countAtom = atom(0);

function Counter() {
  const [count, setCount] = useAtom(countAtom);

  return <button onClick={() => setCount((value) => value + 1)}>{count}</button>;
}
```

Derived atoms can calculate values from other atoms.

```js
const itemsAtom = atom([]);
const totalAtom = atom((get) =>
  get(itemsAtom).reduce((sum, item) => sum + item.price, 0)
);
```

## Recoil Awareness

Recoil also uses atoms and selectors.

```jsx
const fontSizeState = atom({
  key: "fontSizeState",
  default: 14,
});

function FontButton() {
  const [fontSize, setFontSize] = useRecoilState(fontSizeState);

  return <button onClick={() => setFontSize((size) => size + 1)}>{fontSize}px</button>;
}
```

Recoil introduced many React developers to atom-based state, but library choice should consider ecosystem maturity, maintenance status, team familiarity, and framework compatibility.

## When Atom Stores Fit

Atom-based tools can work well for:

- complex editors
- dashboards with many independent panels
- forms with isolated sections
- derived client state
- apps where fine-grained subscriptions matter

They may feel less natural when the domain is event-driven and benefits from a central action log.

## Async and Server State

Some atom libraries support async atoms or selectors.

That does not mean every API request should become an atom.

For typical server data, TanStack Query and SWR provide specialized behavior: caching, refetching, invalidation, retries, deduping, and stale data handling.

Use atoms for client state unless you have a specific reason to model server state that way.

## Common Mistakes

- Creating too many atoms before understanding the state relationships.
- Splitting state so much that updates become hard to follow.
- Using atoms for server cache behavior that a data-fetching library already solves.
- Forgetting that derived atoms should stay pure.
- Choosing a library because it is interesting rather than because the app needs it.

:::quiz
question: What is the main idea behind atom-based state management?
options:
  - All state must be stored in one reducer
  - Each component must own all of its state locally
  - State is split into small independent units that components can subscribe to
  - Server data is never allowed to be cached
answer: 2
explanation: Atom libraries organize state as small units, often with derived atoms/selectors for calculated values.
:::

## Practical Challenge

Imagine a document editor with:

- selected tool
- zoom level
- open panels
- document title
- autosave status

Choose which values could be separate atoms and which values might belong together.

Explain one risk of splitting the state too much.

## Recap

Recoil and Jotai are useful awareness topics because they show a different state model from Redux and Zustand.

Atom-based state can provide fine-grained subscriptions, but it should still be chosen for a real application need.
