# Authentication Flows

Authentication answers: who is the user?

Authorization answers: what is the user allowed to do?

React apps participate in authentication flows, but the backend must enforce security. Client-side checks improve user experience, not security by themselves.

## Common Login Flow

```text
user submits credentials
        |
        v
server verifies credentials
        |
        v
server creates session or token
        |
        v
client stores or receives auth state
        |
        v
app loads protected data
```

The exact storage strategy matters.

## Session Cookie Flow

With cookie-based sessions, the server sets a cookie after login.

```text
POST /login
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Lax
```

The browser automatically sends the cookie on later requests to the same site.

Benefits:

- tokens can be hidden from JavaScript with `HttpOnly`
- works well with server-rendered apps
- easy for traditional web backends

Concerns:

- CSRF protection may be needed
- cookie domain and SameSite settings matter
- cross-site API calls require careful CORS and credential settings

## Token Flow

Token-based auth often uses access tokens and refresh tokens.

```text
login
  -> receive short-lived access token
  -> receive or store refresh mechanism
  -> send access token with API requests
```

```js
fetch("/api/me", {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
```

Tokens are common for APIs, mobile apps, and separate frontend/backend deployments.

## OAuth and OIDC Awareness

OAuth is about delegated access. OpenID Connect adds identity on top.

A common pattern:

```text
app redirects to identity provider
user logs in
provider redirects back with code
backend exchanges code for tokens
backend creates app session
```

For browser apps, the authorization code flow with PKCE is commonly used.

Avoid outdated implicit flows for new applications.

## Auth State in React

React needs enough auth state to render the right UI.

```jsx
function AuthGate({ children }) {
  const { user, status } = useCurrentUser();

  if (status === "loading") return <p>Checking session...</p>;
  if (!user) return <LoginPrompt />;

  return children;
}
```

This is a UX boundary. The backend must still protect private API endpoints.

## Login Form Mistakes

Avoid leaking details that help attackers.

```text
Bad: "No account exists for this email"
Better: "Invalid email or password"
```

Also consider:

- rate limiting
- account lockout or risk checks
- MFA
- password reset flow
- accessible error messages
- not logging passwords

## Logout

Logout should clear both client and server auth state.

For cookie sessions:

```text
POST /logout
Set-Cookie: session=; Max-Age=0
```

For token flows, clear client-held tokens and invalidate refresh tokens if the backend supports it.

## Common Mistakes

- Protecting routes only in React and leaving APIs open.
- Storing long-lived tokens in easily accessible browser storage without understanding XSS risk.
- Forgetting loading state while checking current user.
- Treating login as only a form submit instead of a security flow.
- Showing detailed login failure reasons.

## Edge Case

A user can be logged out in another tab.

Your app should handle a later `401` by clearing auth state and returning to login or a re-auth flow.

:::quiz
question: Why is a React-only protected route not enough security?
options:
  - Users can call backend APIs directly, so the backend must enforce authorization
  - React components cannot render login forms
  - Protected routes disable CSS
  - Browsers refuse to send authenticated requests
answer: 0
explanation: Client-side route guards are only UX. Real security must be enforced by the server on protected resources.
:::

## Practical Challenge

Design an auth flow for a private dashboard.

Specify:

- login request and response
- how current user is loaded
- how protected routes behave while loading
- how logout works
- how the app responds to `401`
- which checks happen on the backend

## Recap

Authentication is a full-system concern.

React manages forms, auth state, and route experience. The backend owns identity verification, session creation, and authorization enforcement.
