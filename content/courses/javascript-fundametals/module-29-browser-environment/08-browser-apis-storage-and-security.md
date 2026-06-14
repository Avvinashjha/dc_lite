# Browser APIs, Storage, and Security

The browser gives JavaScript many APIs beyond the DOM.

Some APIs communicate with servers. Some store data. Some read the current URL. Some interact with the clipboard, camera, notifications, or device state.

These APIs are powerful, but they run inside browser security boundaries.

## Browser APIs Are Environment Features

Browser APIs are not the same as the JavaScript language.

```js
fetch("/api/users");
localStorage.setItem("theme", "dark");
navigator.clipboard.writeText("Copied");
```

These work because the browser provides them.

In another JavaScript environment, they may not exist or may behave differently.

Always ask:

- Is this core JavaScript?
- Or is this a browser API?

## Fetch in the Browser

Browsers provide `fetch()` for HTTP requests.

```js
const response = await fetch("/api/profile");
const profile = await response.json();

console.log(profile.name);
```

In a browser, `fetch()` is subject to browser networking rules, including CORS, credentials, cache behavior, and mixed-content restrictions.

Check HTTP errors explicitly.

```js
async function loadProfile() {
  const response = await fetch("/api/profile");

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}
```

Remember that frontend code is visible to users.

Do not put secret API keys in browser JavaScript.

## Same-Origin Policy

The same-origin policy is a browser security rule.

An origin is made from:

- protocol
- host
- port

These are different origins:

```text
https://example.com
http://example.com
https://example.com:8443
https://api.example.com
```

The same-origin policy limits how scripts from one origin can read data from another origin.

This helps protect users who are logged into websites.

## CORS at a High Level

CORS stands for Cross-Origin Resource Sharing.

It is a controlled way for a server to allow browser JavaScript from another origin to read its responses.

Example:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:5000
```

Those are different origins because the ports differ.

The backend must send the correct CORS headers if the frontend should read the response.

Important point:

CORS is usually fixed on the server or through a development proxy, not by random frontend changes.

`mode: "no-cors"` is usually not a real fix for API calls because it creates an opaque response that normal JavaScript cannot read.

## Web Storage

Browsers provide simple key-value storage through:

- `localStorage`
- `sessionStorage`

Both store strings.

```js
localStorage.setItem("theme", "dark");

const theme = localStorage.getItem("theme");

console.log(theme); // "dark"
```

Remove a value:

```js
localStorage.removeItem("theme");
```

Clear all values for the origin:

```js
localStorage.clear();
```

## `localStorage` vs `sessionStorage`

`localStorage` persists across browser restarts until it is cleared.

`sessionStorage` lasts for the page session.

```js
sessionStorage.setItem("draft", "Hello");
```

Use `localStorage` for non-sensitive preferences.

Use `sessionStorage` for short-lived tab-specific data.

Do not store passwords, private tokens, or sensitive personal data in web storage.

## Storing Objects

Web storage stores strings, so objects need JSON conversion.

```js
const settings = {
  theme: "dark",
  compact: true,
};

localStorage.setItem("settings", JSON.stringify(settings));
```

Read and parse:

```js
const raw = localStorage.getItem("settings");
const settings = raw ? JSON.parse(raw) : null;
```

Parsing can fail if the stored value is not valid JSON.

```js
function readSettings() {
  try {
    const raw = localStorage.getItem("settings");

    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
```

## Cookies at a High Level

Cookies are small pieces of data stored by the browser and often sent with HTTP requests.

They are commonly used for:

- sessions
- authentication
- preferences
- tracking

Cookies have options that affect security and scope, such as:

- `HttpOnly`
- `Secure`
- `SameSite`
- expiration
- domain
- path

Frontend JavaScript can read some cookies through `document.cookie`, but not `HttpOnly` cookies.

```js
console.log(document.cookie);
```

Authentication cookies are often set by the server with `HttpOnly` so JavaScript cannot read them. This reduces the impact of certain cross-site scripting attacks.

## Permissions and User Trust

Some browser APIs require permission or user activation.

Examples:

- geolocation
- camera and microphone
- notifications
- clipboard writes in some cases

```js
navigator.geolocation.getCurrentPosition(
  (position) => {
    console.log(position.coords.latitude);
  },
  (error) => {
    console.log(error.message);
  },
);
```

Many permission-based APIs are asynchronous and may fail.

Design code assuming the user can deny permission.

## Feature Detection

Not every browser supports every API.

Check for features before using them.

```js
if ("clipboard" in navigator) {
  await navigator.clipboard.writeText("Copied text");
} else {
  console.log("Clipboard API is not available");
}
```

Feature detection is better than relying only on browser names.

## Best Practices

- Treat browser APIs as environment-specific.
- Check `response.ok` after `fetch()`.
- Do not store secrets in frontend code or web storage.
- Use server-set `HttpOnly` cookies for sensitive session cookies when appropriate.
- Expect permission-based APIs to fail.
- Use feature detection before relying on newer APIs.
- Fix CORS at the server or proxy layer.

## Common Mistakes

Assuming web storage stores objects:

```js
localStorage.setItem("user", { name: "Asha" });
```

This stores `"[object Object]"`.

Use JSON:

```js
localStorage.setItem("user", JSON.stringify({ name: "Asha" }));
```

Another mistake is storing secrets in browser code:

```js
const API_SECRET = "super-secret";
```

Users can inspect frontend source code. Put secret-protected calls behind a backend.

## Summary

The browser provides many APIs for networking, storage, permissions, and device features.

These APIs are useful because they connect JavaScript to the real browser environment. They also have security boundaries, compatibility differences, and privacy implications that you must account for.
