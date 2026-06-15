# Secure Authentication

Authentication answers "Who is this user?"

React authentication code usually handles login forms, session checks, redirects, protected routes, token refresh, logout, and user-specific UI. The sensitive decisions must still be enforced by the backend.

## Authentication vs Authorization

Authentication identifies the user. Authorization decides what that user can do.

```jsx
function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
```

This route guard improves user experience, but it is not enough security. The API must still verify the session and permissions.

## Session Cookies

Many apps use secure, `HttpOnly` cookies for sessions.

Benefits:

- JavaScript cannot read `HttpOnly` cookies.
- Cookies can use `Secure` and `SameSite` flags.
- The server can invalidate sessions centrally.

Tradeoffs:

- Cookie-based sessions need CSRF protection for state-changing requests.
- Cross-site app/API deployments require careful cookie and CORS settings.
- Logout must clear the server session and cookie correctly.

Frontend code usually calls an endpoint to learn the current session:

```js
async function getCurrentUser() {
  const response = await fetch("/api/me", {
    credentials: "include",
  });

  if (response.status === 401) return null;
  if (!response.ok) throw new Error("Failed to load session");

  return response.json();
}
```

## Token Storage

Access tokens are sometimes used for API calls.

Storage choice matters:

- memory: harder to steal persistently, but lost on refresh
- `localStorage`: persists, but is readable by JavaScript and exposed to XSS
- `sessionStorage`: per-tab persistence, still readable by JavaScript
- cookies: can be `HttpOnly`, but may need CSRF protection

There is no universally perfect choice. The right design depends on app architecture, threat model, backend support, and user experience.

Avoid storing long-lived high-privilege tokens in `localStorage`.

## Login Forms

Secure login UX includes more than a password field.

Good practices:

- use HTTPS only
- use `type="password"` for passwords
- use proper labels and autocomplete values
- show generic errors when needed to avoid account enumeration
- preserve username/email after failed login, but not password
- support multi-factor authentication when required
- rate limiting and lockout should be handled server-side

```jsx
<label htmlFor="email">Email</label>
<input id="email" name="email" type="email" autoComplete="username" />

<label htmlFor="password">Password</label>
<input
  id="password"
  name="password"
  type="password"
  autoComplete="current-password"
/>
```

## Protected Routes and Loading States

Do not briefly show protected content while the session is still loading.

```jsx
function AuthGate({ children }) {
  const { user, isLoading } = useSession();

  if (isLoading) return <p>Checking session...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
```

Also handle session expiration during API calls. A user can be authenticated when the page loads and unauthenticated five minutes later.

## Logout

Logout should clear server-side session state, not only frontend state.

```js
async function logout() {
  await fetch("/api/logout", {
    method: "POST",
    credentials: "include",
  });

  queryClient.clear();
  navigate("/login", { replace: true });
}
```

Clear cached user-specific data after logout so the next user on the same device does not see stale information.

## Edge Cases

- Multiple tabs may have different auth state unless you synchronize logout.
- Token refresh can create race conditions if many requests refresh at once.
- Redirecting back to `returnTo` URLs can create open redirect vulnerabilities.
- A copied browser storage token may outlive the user's expectation.
- "Remember me" changes risk because sessions last longer.
- Error reporting tools should not capture passwords, tokens, or full auth headers.

## Common Mistakes

- Treating route guards as backend authorization.
- Storing long-lived tokens in `localStorage` without considering XSS.
- Forgetting CSRF protection for cookie-based sessions.
- Showing protected UI before session loading completes.
- Not clearing caches on logout.
- Trusting roles stored only in browser storage.

:::quiz
question: Why are `HttpOnly` cookies useful for session authentication?
options:
  - They prevent JavaScript from reading the cookie value
  - They make authorization unnecessary on the server
  - They allow passwords to be stored in React state forever
  - They disable all CSRF risks by themselves
answer: 0
explanation: `HttpOnly` cookies are not readable by JavaScript, reducing token theft through XSS. Cookie-based sessions still need server checks and often CSRF protection.
:::

## Practice Challenge

Design an auth flow for a React dashboard. Include session loading, protected routes, login errors, logout, cache clearing, token or cookie storage choice, CSRF handling if needed, and how the UI responds when the session expires during an API request.

## Recap

Secure React authentication is about careful handling of sessions, redirects, storage, loading states, logout, and cache cleanup. The frontend guides users, but the backend enforces identity and permissions.
