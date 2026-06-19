# Network and API Debugging

Many JavaScript applications depend on APIs.

When data does not load or a form does not submit, the bug might be in frontend code, request configuration, server behavior, authentication, CORS, or the response format.

The Network panel helps you separate those possibilities.

## First Question: Did the Request Happen?

Open DevTools and go to the Network panel.

Trigger the action again.

Look for the request.

If there is no request, the problem may be before the network layer:

- the event handler did not run
- the form submitted and reloaded the page
- a condition skipped the fetch call
- JavaScript crashed earlier
- the wrong button or element has the listener

Use the Console and breakpoints to confirm the code path.

## Check the URL

A small URL mistake can cause a large bug.

```js
fetch("/api/users/42");
```

Check:

- path
- query string
- protocol
- domain
- port
- trailing slashes if the API cares about them

For query strings, prefer `URLSearchParams`.

```js
const params = new URLSearchParams({
  status: "active",
  page: "1",
});

const response = await fetch(`/api/users?${params}`);
```

This avoids broken URLs when values contain spaces, `&`, `?`, or other special characters.

## Check the Method

APIs often require a specific HTTP method.

```js
await fetch("/api/users/42", {
  method: "PATCH",
});
```

Common method meanings:

| Method | Common use |
| --- | --- |
| `GET` | Read data |
| `POST` | Create data or submit an action |
| `PATCH` | Update part of a resource |
| `PUT` | Replace a resource |
| `DELETE` | Delete a resource |

If the method is wrong, the server may return `404`, `405`, `400`, or another error.

## Check Status Codes

The status code tells you how the server responded.

Common examples:

| Status | Meaning |
| --- | --- |
| `200` | OK |
| `201` | Created |
| `204` | Success with no body |
| `400` | Bad request |
| `401` | Not authenticated |
| `403` | Authenticated but not allowed |
| `404` | Not found |
| `409` | Conflict |
| `422` | Validation error |
| `500` | Server error |

Remember that `fetch()` does not reject for normal HTTP error statuses.

```js
const response = await fetch("/api/users/42");

if (!response.ok) {
  throw new Error(`Request failed: ${response.status}`);
}
```

## Check Request Headers

Headers describe the request.

For JSON request bodies, send `Content-Type`.

```js
await fetch("/api/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ name: "Maya" }),
});
```

For APIs that return JSON, you may also send `Accept`.

```js
headers: {
  "Accept": "application/json",
  "Content-Type": "application/json",
}
```

For protected APIs, inspect the authorization header.

```js
headers: {
  Authorization: `Bearer ${token}`,
}
```

Never paste real tokens into shared bug reports or screenshots.

## Check the Request Body

In the Network panel, inspect the payload.

Common request body mistakes:

- sending an object instead of JSON text
- forgetting `JSON.stringify`
- sending fields with the wrong names
- sending `undefined` values
- using the wrong content type
- accidentally submitting an empty form

Bad:

```js
body: { name: "Maya" }
```

Good:

```js
body: JSON.stringify({ name: "Maya" })
```

## Check the Response Body

The response body often explains the failure.

```json
{
  "message": "Email is already taken"
}
```

Handle error bodies deliberately.

```js
async function readErrorMessage(response) {
  const text = await response.text();

  if (!text) {
    return `Request failed with ${response.status}`;
  }

  try {
    const data = JSON.parse(text);
    return data.message || `Request failed with ${response.status}`;
  } catch {
    return text;
  }
}
```

This helps when the server sometimes returns JSON and sometimes returns plain text.

## Debugging CORS

CORS errors happen when the browser blocks frontend JavaScript from reading a cross-origin response.

The Console may show a CORS message, and the Network panel may show the request.

Important points:

- CORS is enforced by the browser.
- CORS permission comes from server response headers.
- `mode: "no-cors"` is usually not a real API fix.
- A development proxy can help during local development.

If a request works in a server-side tool but fails in the browser, CORS may be involved because server-side tools do not enforce browser CORS rules.

## Debugging Authentication

Authentication bugs often show up as `401` or `403`.

Check:

- Is the token present?
- Is the token expired?
- Is the header name correct?
- Does the API expect cookies instead of bearer tokens?
- Are credentials included when cookies are needed?

For cookie-based auth, you may need:

```js
await fetch("/api/account", {
  credentials: "include",
});
```

Only use credentials when the API and security model require it.

## Debugging Slow Requests

The Network panel shows timing information.

Slow requests may be caused by:

- server processing
- large response bodies
- slow network
- duplicate requests
- missing caching
- requests made sequentially when they could be parallel

Before optimizing code, confirm which request is actually slow.

## Common Mistakes

Do not debug API problems only from `catch`.

```js
try {
  await fetch("/api/users");
} catch (error) {
  console.error(error);
}
```

This catches network-level failures, but it does not catch `404` or `500` unless you check `response.ok`.

Do not assume an empty response can be parsed as JSON. A `204 No Content` response has no body.

Do not expose tokens or private data in screenshots, logs, or shared examples.

Do not guess whether the frontend or backend is wrong. Inspect the request and response.

## Summary

Network debugging is evidence-based.

Check:

- whether the request happened
- URL and method
- status code
- headers
- request body
- response body
- CORS messages
- authentication details
- timing and duplicate requests

The Network panel turns vague API failures into specific facts.
