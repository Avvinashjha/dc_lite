# Zustand

Zustand is a small state management library with a simple store API.

It is often used when you want global client state without the structure and boilerplate of Redux.

A Zustand store is a hook.

## Creating a Store

```js
import { create } from "zustand";

export const useCartStore = create((set) => ({
  items: [],
  addItem(product) {
    set((state) => ({ items: [...state.items, product] }));
  },
  removeItem(productId) {
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    }));
  },
}));
```

Components call the hook to read and update state.

```jsx
function CartSummary() {
  const count = useCartStore((state) => state.items.length);

  return <p>{count} items in cart</p>;
}

function AddToCartButton({ product }) {
  const addItem = useCartStore((state) => state.addItem);

  return <button onClick={() => addItem(product)}>Add to cart</button>;
}
```

Selecting only the needed value helps avoid unnecessary re-renders.

## Why Teams Choose Zustand

Zustand is popular because it is:

- small
- easy to learn
- not tied to a provider component
- flexible about store shape
- good for app-level client state

It can be a good fit for theme settings, UI workspace state, cart state, media player state, or editor state.

## Derived Values

Do not store values that can be calculated cheaply.

```js
export const useCartStore = create((set, get) => ({
  items: [],
  addItem(product) {
    set((state) => ({ items: [...state.items, product] }));
  },
  getTotal() {
    return get().items.reduce((sum, item) => sum + item.price, 0);
  },
}));
```

For UI subscriptions, prefer selectors.

```jsx
const total = useCartStore((state) =>
  state.items.reduce((sum, item) => sum + item.price, 0)
);
```

## Updating Nested State

Keep immutable updates clear.

```js
const useSettingsStore = create((set) => ({
  profile: { name: "Ava", notifications: true },
  setNotifications(enabled) {
    set((state) => ({
      profile: {
        ...state.profile,
        notifications: enabled,
      },
    }));
  },
}));
```

Zustand does not automatically make every update immutable for you unless you add middleware such as Immer.

## Common Mistakes

- Calling `useCartStore()` without a selector in many components.
- Treating Zustand as a server-state cache instead of using TanStack Query or SWR.
- Putting all UI state in one giant store.
- Mutating arrays or objects in place and returning the same reference.
- Hiding important business events in anonymous `set` calls that are hard to debug.

## Context vs Zustand

Use Context when you mainly need dependency passing or low-frequency shared values.

Use Zustand when you need a shared client store with direct updates and fine-grained subscriptions.

Use Redux Toolkit when the team needs stronger conventions, action history, middleware patterns, and highly predictable workflows.

:::quiz
question: What is a good reason to use a selector with a Zustand store?
options:
  - It prevents the store from being created
  - It limits a component to the exact state it needs
  - It turns server requests into cached queries
  - It replaces React props entirely
answer: 1
explanation: Selectors help components subscribe only to the relevant part of the store, which can reduce unnecessary re-renders.
:::

## Practical Challenge

Create a Zustand store for a music player.

Include `currentTrack`, `isPlaying`, `volume`, `play`, `pause`, and `setVolume`.

Then write one component that only subscribes to `isPlaying` and another that only subscribes to `volume`.

## Recap

Zustand is a lightweight global client-state tool.

It works best when you want simple shared state with minimal setup, but you still need to be careful about selectors, immutable updates, and not mixing server-state concerns into the store.
