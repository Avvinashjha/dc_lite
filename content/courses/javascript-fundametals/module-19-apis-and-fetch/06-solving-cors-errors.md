# Solving CORS Errors

CORS errors are common when building frontend apps.

They often happen during local development when the frontend and backend run on different ports.

Example:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:5000
```

These are different origins.

## Read the Error Message

A browser CORS error may say something like:

```text
Access to fetch at 'http://localhost:5000/api/users'
from origin 'http://localhost:3000'
has been blocked by CORS policy.
```

Important details:

- requested URL
- frontend origin
- missing or invalid CORS header
- credentials-related issues
- preflight issues

Read it carefully before changing code.

## Fix CORS on the Server

The normal fix is to configure the API server to allow your frontend origin.

Example response header:

```http
Access-Control-Allow-Origin: http://localhost:3000
```

For production:

```http
Access-Control-Allow-Origin: https://app.example.com
```

The exact code depends on your backend framework.

## Development Proxy

Many frontend dev tools can proxy API requests.

Instead of calling:

```js
fetch("http://localhost:5000/api/users");
```

you call:

```js
fetch("/api/users");
```

The dev server forwards the request to the backend.

From the browser's perspective, the request appears same-origin.

This is common with tools like Vite, Webpack dev server, and other frontend frameworks.

## Do Not Use `no-cors` as a Fix

Avoid this:

```js
fetch("http://localhost:5000/api/users", {
  mode: "no-cors",
});
```

This usually creates an opaque response.

Your JavaScript cannot read the body, status, or headers normally.

It does not solve normal API communication.

## Credentials Issues

If your request includes cookies:

```js
fetch("https://api.example.com/me", {
  credentials: "include",
});
```

The server must allow credentials and specify the exact origin.

Typical headers:

```http
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Credentials: true
```

The server cannot use `*` for credentialed requests.

## Preflight Requests

Some requests trigger a preflight request.

A preflight is an automatic `OPTIONS` request the browser sends before the real request.

This can happen when using:

- methods like `PUT`, `PATCH`, or `DELETE`
- custom headers
- non-simple content types

The server must respond correctly to the `OPTIONS` request.

If preflight fails, the real request is blocked.

## Checklist for CORS Errors

Check these:

1. Is the frontend origin correct?
2. Does the server send `Access-Control-Allow-Origin`?
3. Does the allowed origin exactly match protocol, domain, and port?
4. Are credentials involved?
5. Is `Access-Control-Allow-Credentials` needed?
6. Is the browser sending a preflight `OPTIONS` request?
7. Does the server support that method and headers?
8. Are you calling the correct URL?

## What Frontend Code Can Fix

Frontend code can:

- call the correct URL
- include or omit credentials intentionally
- avoid unnecessary custom headers
- use a dev proxy
- send the correct request method and body

Frontend code usually cannot:

- force the server to allow an origin
- bypass browser CORS safely
- read an opaque `no-cors` response like normal JSON

## Best Practices

Fix CORS in server configuration or a dev proxy.

Use exact trusted origins for private APIs.

Avoid `mode: "no-cors"` for API calls.

Handle credentialed requests carefully.

Understand preflight requests.

Keep local dev origins predictable.

## Common Mistakes

### Mistake 1: Trying Random fetch Options

CORS is mostly controlled by server response headers.

Random frontend options usually do not fix it.

### Mistake 2: Allowing Every Origin in Production

Do not use `*` for private APIs.

### Mistake 3: Forgetting Port Differences

```text
localhost:3000
localhost:5000
```

Different ports mean different origins.

## Summary

CORS errors are solved by allowing trusted origins correctly.

- Read the browser error carefully.
- Configure the server to send CORS headers.
- Use a development proxy when helpful.
- Avoid `mode: "no-cors"` for normal API requests.
- Credentialed requests need stricter CORS configuration.
- Preflight requests must be handled by the server.
