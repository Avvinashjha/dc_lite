# useContext

`useContext` reads a value from the nearest matching context provider above the component.

Context is useful when many components need the same value and passing it through every layer would create noisy props.

## Creating and Reading Context

```jsx
import { createContext, useContext } from "react";

const ThemeContext = createContext("light");

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function ToolbarButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Save</button>;
}
```

`ToolbarButton` receives `"dark"` because it is inside the provider.

## Default Values

The value passed to `createContext(defaultValue)` is used only when there is no matching provider.

```jsx
const LocaleContext = createContext("en");
```

Defaults are helpful for tests and simple fallbacks, but many app contexts should fail clearly when used outside a provider.

```jsx
function useCurrentUser() {
  const user = useContext(CurrentUserContext);

  if (user === null) {
    throw new Error("useCurrentUser must be used inside CurrentUserProvider");
  }

  return user;
}
```

## Updates and Re-renders

When a provider's `value` changes, every component reading that context can re-render.

```jsx
<UserContext.Provider value={{ user, setUser }}>
  {children}
</UserContext.Provider>
```

This creates a new object on every render. If the provider re-renders often, consumers may re-render even when `user` did not change. Memoize provider values when needed, and split contexts when state and actions have different update patterns.

## What Context Is Not

Context is not a replacement for all props. Props are still clearer for local parent-child data.

Context is not automatically a performance optimization. It can reduce prop passing, but broad providers with frequently changing values can make performance worse.

:::quiz
question: Which provider value does useContext read?
options:
  - The nearest matching provider above the component
  - The first provider created anywhere in the app
  - The provider imported from the same file only
answer: 0
explanation: Context lookup walks up the rendered tree and uses the nearest matching provider.
:::

## Common Mistakes

Do not place highly local state in global context just to avoid one prop.

Do not pass a fresh object or function-heavy value through context without considering re-renders.

Do not create multiple copies of the same context module through unusual imports; consumers must use the exact context object that the provider uses.

## Practice Challenge

Create a `ThemeContext` with a provider and a `useTheme` hook.

Requirements:

- default to `"light"`
- expose a toggle function
- read the context in a deeply nested button
- throw a helpful error if the custom hook is used outside the provider

## Recap

`useContext` reads shared values from providers. Use it for data that truly spans component layers, keep provider values stable, and avoid turning context into a dumping ground for all state.
