# Handling Tokens and Sessions

Tokens and sessions keep users authenticated after login.

The hard part is not only storing a value. It is choosing where the value lives, how long it lasts, how it is refreshed, and how failures are handled.

## Session Cookies

In a session-cookie model, the server stores session state or can verify a signed session value.

The browser stores a cookie.

Important cookie flags:

- `HttpOnly`: JavaScript cannot read the cookie
- `Secure`: sent only over HTTPS
- `SameSite`: helps control cross-site sending
- `Path` and `Domain`: control where the cookie applies
- `Max-Age` or `Expires`: controls lifetime

```text
Set-Cookie: session=abc; HttpOnly; Secure; SameSite=Lax; Path=/
```

This is a strong default for many web apps.

## Access Tokens

Access tokens are usually short-lived credentials sent with API requests.

```js
fetch("/api/projects", {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
```

Short lifetimes reduce damage if a token leaks.

## Refresh Tokens

Refresh tokens are longer-lived credentials used to obtain new access tokens.

Because they are powerful, they need extra care.

Safer approaches include:

- storing refresh tokens in `HttpOnly` secure cookies
- rotating refresh tokens
- revoking refresh tokens on logout
- detecting reuse of old refresh tokens

Avoid treating refresh tokens like ordinary client state.

## Local Storage vs Cookies

`localStorage` is easy to use but readable by JavaScript.

If an attacker gets JavaScript execution through XSS, they can read tokens from local storage.

Cookies with `HttpOnly` cannot be read by JavaScript, but cookie auth needs CSRF protection depending on SameSite settings and request patterns.

```text
localStorage token:
  XSS risk is high
  easy manual Authorization header

HttpOnly cookie:
  token hidden from JS
  CSRF must be considered
```

There is no storage choice that removes the need for XSS prevention.

## In-Memory Access Tokens

Some apps store access tokens only in memory.

Benefits:

- token disappears on full page reload
- not directly stored in local storage

Costs:

- reload may require a refresh flow
- multiple tabs need coordination
- app startup becomes more complex

This can be useful when combined with a secure refresh cookie.

## Refresh Flow

```text
API request returns 401
        |
        v
try refresh once
        |
        v
if refresh succeeds, retry original request
        |
        v
if refresh fails, clear auth state and show login
```

Avoid infinite refresh loops.

```js
async function requestWithRefresh(path, options) {
  let response = await apiRequest(path, options);

  if (response.status !== 401) {
    return response;
  }

  const refreshed = await refreshSession();
  if (!refreshed) {
    throw new Error("Session expired");
  }

  return apiRequest(path, options);
}
```

Real implementations should coordinate concurrent refreshes so ten failed requests do not trigger ten refresh calls.

## Multi-Tab Behavior

Users often have several tabs open.

Plan for:

- logout in one tab updating other tabs
- token refresh coordination
- stale user state
- permission changes while the app is open

Browser APIs such as `BroadcastChannel` can help tabs communicate.

## CSRF and XSS

CSRF tricks a browser into sending authenticated requests.

XSS runs attacker-controlled JavaScript in your app.

Defenses include:

- `SameSite` cookies
- CSRF tokens for risky cookie-based flows
- strict output escaping
- Content Security Policy
- avoiding dangerous HTML injection
- validating authorization on the server

React escapes text by default, but `dangerouslySetInnerHTML` needs extreme care.

## Common Mistakes

- Storing long-lived tokens in local storage by default.
- Retrying refresh forever.
- Forgetting logout should invalidate server-side refresh state when possible.
- Trusting client-side role flags.
- Logging tokens in errors or analytics.
- Ignoring multi-tab logout behavior.

:::quiz
question: What is one benefit of an `HttpOnly` cookie for auth?
options:
  - JavaScript cannot directly read the cookie value
  - It prevents every CSRF attack automatically
  - It removes the need for HTTPS
  - It makes tokens never expire
answer: 0
explanation: `HttpOnly` prevents JavaScript from reading the cookie, reducing token theft from XSS. It does not remove the need for other security controls.
:::

## Practical Challenge

Design a token/session strategy for a React app.

Document:

- where access credentials are stored
- how refresh works
- how logout works
- how `401` responses are handled
- how multiple tabs stay in sync
- what XSS and CSRF defenses are needed

## Recap

Token and session handling is a security design decision.

Prefer short-lived credentials, clear refresh rules, server-side enforcement, careful storage, and predictable failure behavior.
