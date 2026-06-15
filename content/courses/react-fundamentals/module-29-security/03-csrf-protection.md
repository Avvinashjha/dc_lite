# CSRF Protection

CSRF stands for cross-site request forgery.

It happens when another site causes a user's browser to send an authenticated request to your application. If your server trusts that request only because cookies are present, an unwanted action may occur.

## Why Cookies Matter

Browsers automatically attach matching cookies to requests.

If your app uses a session cookie, the browser may send it when a form, image, script, or fetch request targets your domain.

Example risk:

```html
<!-- On an attacker's site -->
<form action="https://app.example.com/api/email" method="POST">
  <input name="email" value="attacker@example.com" />
</form>
<script>
  document.querySelector("form").submit();
</script>
```

If the user is signed in and the server accepts the request, the user's email might be changed without intent.

## React's Role

React does not directly cause or solve CSRF.

Your React code usually helps by:

- sending CSRF tokens with state-changing requests
- using the correct request methods
- avoiding state changes through `GET`
- handling expired token errors clearly
- keeping auth and API calls consistent

The server must verify the CSRF protection.

## Use Safe HTTP Methods

`GET` should read data and should not change important state.

```js
// Good: read operation
fetch("/api/products");
```

State-changing requests should use methods such as `POST`, `PUT`, `PATCH`, or `DELETE`.

```js
await fetch("/api/profile", {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ displayName: "Asha" }),
});
```

This does not prevent CSRF by itself, but it makes protection easier and avoids dangerous browser prefetch or link behavior.

## CSRF Tokens

A CSRF token is a secret value the server expects on legitimate state-changing requests.

Common frontend pattern:

```js
const csrfToken = document
  .querySelector('meta[name="csrf-token"]')
  ?.getAttribute("content");

await fetch("/api/settings", {
  method: "POST",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    "X-CSRF-Token": csrfToken,
  },
  body: JSON.stringify({ theme: "dark" }),
});
```

Some apps fetch a token from an endpoint. Others render it into the initial HTML. Follow the backend framework's expected pattern.

## SameSite Cookies

Cookie settings reduce CSRF risk.

Important flags:

- `SameSite=Lax`: sends cookies on many same-site requests and top-level safe navigations.
- `SameSite=Strict`: sends cookies only in stricter same-site contexts.
- `SameSite=None; Secure`: allows cross-site cookies, but only over HTTPS.
- `HttpOnly`: prevents JavaScript from reading the cookie.
- `Secure`: sends the cookie only over HTTPS.

Frontend JavaScript cannot set `HttpOnly`. The server must set sensitive cookie flags.

## CORS Is Not CSRF Protection

CORS controls whether browser JavaScript can read cross-origin responses.

It does not automatically stop a browser from sending a request. A CSRF attack may not need to read the response.

Use CORS for cross-origin access control, not as your only CSRF defense.

## Token-Based APIs

If your app stores an access token in memory and sends it in an `Authorization` header, classic cookie-based CSRF risk is lower because the browser does not attach that header automatically from another site.

But other risks remain:

- XSS can steal or use tokens.
- Refresh-token cookies may still need CSRF protection.
- Misconfigured CORS can expose APIs.
- Logout and account-change flows still need careful design.

Security depends on the whole auth design.

## Common Mistakes

- Changing server state with `GET`.
- Assuming React event handlers prevent CSRF.
- Assuming CORS is enough.
- Sending CSRF tokens only sometimes.
- Not handling expired CSRF tokens in the UI.
- Setting `SameSite=None` without understanding cross-site cookie exposure.

:::quiz
question: Why is CORS not enough to prevent CSRF?
options:
  - CSRF can rely on the browser sending an authenticated request even if the attacker cannot read the response
  - CORS only applies to CSS files
  - CORS disables all cookies automatically
  - React ignores CORS headers
answer: 0
explanation: CORS limits response access for browser JavaScript. CSRF is about causing an authenticated request, which may be harmful even without reading the response.
:::

## Practice Challenge

Design a React API helper for cookie-based sessions. It should include `credentials: "include"`, attach an `X-CSRF-Token` header for state-changing methods, and show a recoverable error when the token is missing or expired.

## Recap

CSRF is mostly a server-side protection problem, but React apps must send the right tokens, use safe methods, handle auth errors, and avoid confusing CORS with CSRF defense.
