# Protected Routes

Protected routes restrict access to screens based on authentication, permissions, or feature availability.

They are useful for dashboards, account pages, admin tools, and paid features.

## Client Protection Is Not Security by Itself

React route protection improves the user experience, but it does not secure data on its own.

Users can inspect client code and call APIs directly.

Real security must happen on the server:

- authenticate API requests
- check permissions on the backend
- avoid sending sensitive data to unauthorized users
- expire and validate sessions or tokens

Client-side protected routes should mirror server rules, not replace them.

## Basic Protected Route

```jsx
import { Navigate, Outlet } from "react-router-dom";

function RequireAuth({ user }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
```

Routes:

```jsx
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route element={<RequireAuth user={user} />}>
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/account" element={<AccountPage />} />
  </Route>
</Routes>
```

The protected child routes render only when `user` exists.

## Preserving the Intended Destination

After login, users often expect to return to the page they originally requested.

```jsx
function RequireAuth({ user }) {
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}
```

Login page:

```jsx
function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  async function handleLogin() {
    await login();
    navigate(from, { replace: true });
  }

  return <button onClick={handleLogin}>Log in</button>;
}
```

Location state is useful here because the redirect target is temporary navigation state.

## Loading Authentication State

Auth state may be unknown at first.

```jsx
function RequireAuth({ user, loading }) {
  if (loading) {
    return <p>Checking session...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
```

Without a loading state, the app may briefly redirect users before their session check finishes.

## Role-Based Routes

```jsx
function RequireRole({ user, role }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.roles.includes(role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
}
```

Again, the server must enforce the same permission.

## Data Router Awareness

In React Router data-router setups, protected routes may be handled in loaders.

A loader can check the session before rendering the route and redirect early.

This can improve data loading flow, especially when route data and authentication are connected.

The exact API depends on the React Router version and framework setup, so follow the pattern used in your project.

## Common Mistakes

- Treating client-side redirects as real security.
- Forgetting a loading state while checking the session.
- Sending users to login but losing the page they wanted.
- Using role checks in the UI but not in the API.
- Protecting only routes while still fetching sensitive data elsewhere.

:::quiz
question: Why are protected routes not enough for real security?
options:
  - Client-side code can be inspected or bypassed, so the server must enforce access
  - React Router cannot redirect users
  - Protected routes only work with class components
  - Links cannot point to protected pages
answer: 0
explanation: Client route guards improve UX, but backend authentication and authorization must protect real data and actions.
:::

## Recap

Protected routes guide users to the right screens and prevent accidental access in the UI.

Always pair them with server-side checks, handle loading states, preserve intended destinations, and keep role logic consistent across the app.

## Practice

Create a protected `/account` route and an admin-only `/admin` route.

Add a fake session loading state, redirect unauthenticated users to login, and show a forbidden page for users without the admin role.
