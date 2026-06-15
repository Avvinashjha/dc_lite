# Conditional Rendering

Conditional rendering means showing different UI for different state or props.

In React, you use normal JavaScript to decide what JSX to return.

## Early Returns

Early returns are clear when a component has distinct states.

```jsx
function UserPanel({ user, isLoading, error }) {
  if (isLoading) {
    return <p>Loading user...</p>;
  }

  if (error) {
    return <p role="alert">Could not load user.</p>;
  }

  if (!user) {
    return <p>No user selected.</p>;
  }

  return <h2>{user.name}</h2>;
}
```

This avoids deeply nested JSX.

## Ternary Expressions

Use a ternary when you need one of two branches inside JSX.

```jsx
function LoginStatus({ isLoggedIn }) {
  return (
    <p>
      {isLoggedIn ? "You are signed in." : "Please sign in."}
    </p>
  );
}
```

Ternaries are best when both branches are short.

If the JSX becomes hard to scan, move the logic into variables or early returns.

```jsx
function AccountAction({ isLoggedIn, isSaving }) {
  let action;

  if (isSaving) {
    action = <button disabled>Saving...</button>;
  } else if (isLoggedIn) {
    action = <button>Sign out</button>;
  } else {
    action = <button>Sign in</button>;
  }

  return <div className="account-action">{action}</div>;
}
```

## Logical AND

Use `&&` to render something only when a condition is true.

```jsx
function AlertBanner({ message }) {
  return (
    <header>
      <h1>Dashboard</h1>
      {message && <p role="alert">{message}</p>}
    </header>
  );
}
```

Be careful with numbers.

```jsx
// Bug: renders 0 when count is 0
{count && <p>{count} unread messages</p>}

// Better
{count > 0 && <p>{count} unread messages</p>}
```

React renders `0`, but ignores `false`, `null`, and `undefined`.

## Returning null

A component can return `null` to render nothing.

```jsx
function AdminTools({ user }) {
  if (user.role !== "admin") {
    return null;
  }

  return <button>Open admin tools</button>;
}
```

This is useful for small optional components.

Do not overuse it for major application flow. For larger cases, rendering an explicit empty state is often clearer.

## Conditional Classes and Attributes

Conditional rendering is not only about whole elements. Props can be conditional too.

```jsx
function TabButton({ isSelected, children }) {
  return (
    <button
      className={isSelected ? "tab selected" : "tab"}
      aria-selected={isSelected}
    >
      {children}
    </button>
  );
}
```

This keeps the same button in the DOM while changing how it behaves and appears.

## Preserving or Resetting State

Switching between different component types can reset state.

```jsx
{mode === "view" ? <ProfileView /> : <ProfileEditor />}
```

If both branches are the same component type in the same position, React preserves state.

```jsx
<ProfileEditor mode={mode} />
```

Sometimes preservation is good. Sometimes you want a reset. Use keys intentionally when identity changes.

```jsx
<ProfileEditor key={user.id} user={user} />
```

## Common Mistakes

- Nesting several ternaries until JSX becomes unreadable.
- Using `count && ...` and rendering `0`.
- Returning nothing from a component instead of `null`.
- Hiding important empty states by rendering a blank screen.
- Accidentally resetting state by switching component types.

:::quiz
question: What is a common problem with `{items.length && <List />}`?
options:
  - It always renders the list twice
  - It can render `0` when the array is empty
  - It prevents keys from working
  - It turns `items.length` into a string
answer: 1
explanation: React renders numbers. When `items.length` is 0, the expression evaluates to 0, so the UI can show an unexpected 0.
:::

## Practice Challenge

Build a `DataView` component with these props:

- `isLoading`
- `error`
- `items`

Requirements:

- show a loading message first
- show an error message if there is an error
- show an empty state when `items` is empty
- otherwise render the item names in a list with stable keys

Use early returns for the main branches.

## Recap

Conditional rendering uses regular JavaScript. Choose early returns, ternaries, `&&`, `null`, conditional props, and keys based on the shape of the UI state you need to represent.
