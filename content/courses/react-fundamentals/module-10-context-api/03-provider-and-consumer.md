# Provider and Consumer

A context provider supplies a value to a subtree. A consumer reads that value.

Modern React usually consumes context with `useContext`, but understanding providers and the older consumer component helps you recognize both patterns.

## Provider Basics

```jsx
const ThemeContext = createContext("light");

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}
```

Every component inside `Toolbar` can read `"dark"` from `ThemeContext`.

## Nested Providers

The nearest provider wins.

```jsx
<ThemeContext.Provider value="light">
  <Header />
  <ThemeContext.Provider value="dark">
    <AdminPanel />
  </ThemeContext.Provider>
</ThemeContext.Provider>
```

`Header` reads `"light"`. `AdminPanel` and its children read `"dark"`.

Nested providers are useful for overriding values in a section of the tree.

## Consumer Component

Before hooks, context could be read with a consumer component.

```jsx
<ThemeContext.Consumer>
  {(theme) => <button className={theme}>Save</button>}
</ThemeContext.Consumer>
```

You may still see this in older code or class components. In function components, `useContext` is usually cleaner.

## Provider Values Can Be Dynamic

```jsx
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

When `theme` changes, consumers that read the context can update.

## Passing State and Actions

It is common to pass both state and actions.

```jsx
const value = useMemo(() => {
  return {
    theme,
    toggleTheme,
  };
}, [theme, toggleTheme]);
```

If actions do not change as often as state, splitting contexts can reduce unnecessary renders.

## Common Mistakes

Do not wrap providers around larger trees than necessary.

Do not assume provider children automatically skip rendering. Context updates notify consumers, and normal parent renders can still render children.

Do not put unstable values in context without understanding the consequences.

:::quiz
question: If providers are nested for the same context, which value does a consumer read?
options:
  - The nearest provider above it
  - The oldest provider in the app
  - A merged version of all provider values
answer: 0
explanation: Context uses the nearest matching provider in the rendered tree.
:::

## Practice Challenge

Create nested theme providers:

- the app defaults to light theme
- an admin section overrides the theme to dark
- a button inside each section displays the current theme

Then remove the inner provider and observe which value the admin button receives.

## Recap

Providers define context values for subtrees, and consumers read the nearest matching provider. Provider placement and value identity shape both correctness and performance.
