# Creating Context

Context starts with `createContext`. The context object is then used by providers and consumers.

```jsx
import { createContext } from "react";

export const ThemeContext = createContext("light");
```

The default value is used only when a component reads the context without a matching provider above it.

## Creating a Provider Component

It is common to wrap the raw provider in a named component.

```jsx
import { createContext, useMemo, useState } from "react";

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  const value = useMemo(() => {
    return {
      theme,
      setTheme,
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
```

The provider defines the value available to components below it.

## Provider Placement

Place providers as low as practical and as high as necessary.

If only the settings page needs a context, do not wrap the whole app. Smaller provider scope reduces accidental dependencies and unnecessary re-renders.

```jsx
function SettingsPage() {
  return (
    <SettingsProvider>
      <SettingsForm />
    </SettingsProvider>
  );
}
```

## Default Value Strategy

For simple contexts, a harmless default is fine.

```jsx
const ThemeContext = createContext("light");
```

For required app contexts, `null` plus a custom hook gives clearer errors.

```jsx
const AuthContext = createContext(null);
```

```jsx
function useAuth() {
  const auth = useContext(AuthContext);

  if (auth === null) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return auth;
}
```

## Common Mistakes

Do not create context inside a component. Create it at module scope so provider and consumers use the same context object.

```jsx
function App() {
  const ThemeContext = createContext("light"); // wrong
}
```

Do not pass a new object as provider value without considering re-renders.

```jsx
<ThemeContext.Provider value={{ theme, setTheme }}>
```

This may be fine in small apps, but memoization or context splitting can help when many consumers are involved.

:::quiz
question: When is the default value passed to createContext used?
options:
  - When no matching provider exists above the consumer
  - Every time a provider value changes
  - Only during server rendering
answer: 0
explanation: Consumers read the nearest provider value. The default is only used if no matching provider is found.
:::

## Practice Challenge

Create a `LocaleContext`.

Requirements:

- store the current locale
- expose a function to change it
- place the provider around only the part of the app that needs locale
- create a `useLocale` helper that throws outside the provider

## Recap

Create context at module scope, wrap providers in named components, choose sensible defaults, and place providers where the shared value actually belongs.
