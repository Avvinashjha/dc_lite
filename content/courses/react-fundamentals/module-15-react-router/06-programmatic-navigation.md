# Programmatic Navigation

Most navigation should use links.

Programmatic navigation is for cases where code needs to navigate after an action completes.

Examples:

- redirecting after login
- going to a detail page after creating a record
- sending users away after logout
- returning to the previous page after closing a modal route

## useNavigate

Use `useNavigate` to navigate from code.

```jsx
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    await login();
    navigate("/dashboard");
  }

  return <form onSubmit={handleSubmit}>...</form>;
}
```

The user goes to `/dashboard` after login succeeds.

## Replace vs Push

By default, navigation pushes a new history entry.

Use `replace: true` when the previous page should not remain in history.

```jsx
navigate("/login", { replace: true });
```

This is common after logout or when redirecting away from an invalid page.

## Navigating Back

```jsx
navigate(-1);
```

This behaves like the browser back button.

Use it when returning to the previous location makes sense. If the user may have landed directly on the page, provide a fallback link too.

## Passing Location State

You can pass temporary state with navigation.

```jsx
navigate("/checkout", {
  state: { fromCart: true },
});
```

Read it with `useLocation`.

```jsx
const location = useLocation();
const fromCart = location.state?.fromCart;
```

Location state is not the same as URL state. It may disappear on refresh and is not shareable.

Use the URL for state that should survive reloads or be shared.

## Redirecting During Render

Use `Navigate` for declarative redirects.

```jsx
import { Navigate } from "react-router-dom";

function AccountPage({ user }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <AccountDetails user={user} />;
}
```

This is useful when rendering depends on a condition.

## Avoid Navigation Side Effects in Render

Do not call `navigate()` directly during render.

```jsx
function BadPage({ user }) {
  const navigate = useNavigate();

  if (!user) {
    navigate("/login"); // bad
  }

  return <p>Account</p>;
}
```

Use `Navigate` or an effect.

```jsx
function AccountPage({ user }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <p>Account</p>;
}
```

## Common Mistakes

- Using programmatic navigation when a `Link` would be more accessible.
- Calling `navigate` during render.
- Forgetting `replace` for redirects that should not be in back history.
- Storing shareable state in location state instead of the URL.
- Navigating before an async action succeeds.

:::quiz
question: Which is the best use case for useNavigate?
options:
  - Redirecting after a successful form submission
  - Rendering a normal navigation menu
  - Showing active link styles
  - Defining a route parameter
answer: 0
explanation: useNavigate is for navigation triggered by code, such as after login or form submission. Normal menus should use Link or NavLink.
:::

## Recap

Use links for normal navigation and `useNavigate` for action-driven navigation.

Use `Navigate` for declarative redirects, and choose between push and replace based on expected browser history behavior.

## Practice

Build a signup form that navigates to `/welcome` after a fake successful request.

Pass a temporary success message with location state, then decide whether that message should instead be represented in the URL or app state.
