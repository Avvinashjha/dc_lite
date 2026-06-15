# Using useContext

`useContext` is the standard way for function components to read context.

```jsx
const value = useContext(SomeContext);
```

The component reads the nearest provider value and re-renders when that value changes.

## Basic Usage

```jsx
const ThemeContext = createContext("light");

function ThemeButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Save</button>;
}
```

The component does not receive `theme` through props. It reads it from the rendered tree.

## Custom Context Hooks

Many apps wrap `useContext` in a custom hook.

```jsx
const AuthContext = createContext(null);

export function useAuth() {
  const auth = useContext(AuthContext);

  if (auth === null) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return auth;
}
```

This gives consumers a clear API and a useful error when provider setup is missing.

## Reading Multiple Contexts

A component can read more than one context.

```jsx
function Header() {
  const auth = useAuth();
  const theme = useTheme();

  return <header className={theme.name}>Hello, {auth.user.name}</header>;
}
```

If either context value changes, the component can re-render.

## Conditional Rendering with useContext

Call `useContext` before conditional returns when needed. The hook rules still apply.

```jsx
function AdminLink() {
  const { user } = useAuth();

  if (!user?.isAdmin) {
    return null;
  }

  return <a href="/admin">Admin</a>;
}
```

## Performance Awareness

Every consumer reads the whole context value. If the provider value changes from `{ user, notifications }`, consumers that only use `user` may still re-render when `notifications` changes.

Split contexts when different values change at different rates.

```jsx
const AuthUserContext = createContext(null);
const AuthActionsContext = createContext(null);
```

This is more useful than one giant app context.

:::quiz
question: What happens to a component that calls useContext when the provider value changes?
options:
  - It may re-render with the new context value
  - It automatically keeps the old value forever
  - It can only update after a page refresh
answer: 0
explanation: Context consumers are notified when their provider value changes.
:::

## Common Mistakes

Do not call `useContext` in regular functions outside React rendering.

Do not destructure from a nullable context without guarding. A missing provider can turn into a confusing runtime error.

Do not use context when a prop would make the dependency clearer and more reusable.

## Practice Challenge

Create an `AuthProvider` and `useAuth` hook.

Requirements:

- expose `user`, `login`, and `logout`
- throw a helpful error when used outside the provider
- read auth in a nested `UserMenu`
- split actions into a separate context as an optional performance improvement

## Recap

`useContext` reads shared values from the nearest provider. Wrap it in custom hooks for clearer APIs, keep hook rules in mind, and split contexts when broad values cause avoidable re-renders.
