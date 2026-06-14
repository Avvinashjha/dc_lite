# Authentication and Token Storage

Authentication answers: "Who is this user?"

Authorization answers: "What is this user allowed to do?"

Frontend JavaScript often participates in authentication flows, but it should not be the only place security decisions happen.

The server must enforce permissions.

## Common Authentication Data

Web apps commonly use:

- session cookies
- bearer tokens
- refresh tokens
- short-lived access tokens
- CSRF tokens

The details vary by app.

The important idea is that authentication data is sensitive.

If someone else gets it, they may be able to act as the user.

## Bearer Tokens

A bearer token is commonly sent in the `Authorization` header.

```js
const response = await fetch("/api/me", {
  headers: {
    "Authorization": `Bearer ${accessToken}`,
  },
});
```

"Bearer" means whoever has the token can use it.

Treat bearer tokens like temporary passwords.

## Cookies

Cookies are often used for server-managed sessions.

The server sends a cookie, and the browser stores it.

On future matching requests, the browser sends the cookie automatically.

Important cookie flags:

| Flag | Purpose |
| --- | --- |
| `HttpOnly` | prevents JavaScript from reading the cookie |
| `Secure` | sends the cookie only over HTTPS |
| `SameSite` | limits cross-site cookie sending |

These flags are set by the server.

Frontend code can use cookie-based sessions without reading the session cookie directly.

```js
const response = await fetch("/api/me", {
  credentials: "same-origin",
});
```

## localStorage Risks

`localStorage` is convenient.

It is also readable by any JavaScript running on the page.

```js
localStorage.setItem("token", accessToken);
```

If your page has an XSS bug, code running in the page can read `localStorage`.

That does not mean `localStorage` is always forbidden, but it should not be your default place for sensitive tokens.

Prefer storage decisions made with your backend and security requirements in mind.

## sessionStorage

`sessionStorage` is scoped to a browser tab.

It is cleared when the tab session ends.

However, it is still readable by JavaScript on the page.

That means it has similar XSS exposure to `localStorage`.

## Memory Storage

Some apps keep short-lived tokens in memory.

```js
let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}
```

This avoids persistent browser storage.

It also means the token is lost on refresh, so the app needs a plan for re-authentication.

## Never Put Secrets in Frontend Code

Frontend code is downloaded by users.

Anything bundled into browser JavaScript can be inspected.

Do not place private API keys, database credentials, signing secrets, or service tokens in frontend code.

Use a backend endpoint when a secret must remain secret.

```js
// Frontend calls your backend
await fetch("/api/create-payment-session", {
  method: "POST",
});
```

The backend can then call the external service with secret credentials.

## Authentication Is Not Authorization

Knowing who the user is does not automatically mean they can perform every action.

For example, this frontend check is useful for display:

```js
if (user.role === "admin") {
  showAdminButton();
}
```

But hiding a button is not security.

The server must still check permission when the request arrives.

## Handle Logout Carefully

Logout should clear client-side state and tell the server to end the session when needed.

```js
async function logout() {
  await fetch("/api/logout", {
    method: "POST",
    credentials: "same-origin",
  });

  appState.user = null;
  navigateToLogin();
}
```

If tokens are stored in browser storage, clear them on logout.

```js
localStorage.removeItem("token");
sessionStorage.removeItem("token");
```

## Common Mistakes

Do not store private API keys in frontend source code.

Do not assume hiding UI elements enforces permissions.

Do not leave old tokens in storage after logout.

Do not use long-lived bearer tokens casually.

Do not choose token storage without considering XSS, CSRF, and your backend design.

## Summary

Authentication data is sensitive.

Cookies with strong flags, short-lived tokens, and server-enforced authorization are common parts of secure designs.

Frontend code can improve the user experience, but the server must enforce the real security rules.
