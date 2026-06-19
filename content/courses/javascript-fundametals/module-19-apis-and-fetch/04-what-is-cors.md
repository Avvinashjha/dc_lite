# What Is CORS?

CORS stands for Cross-Origin Resource Sharing.

It is a browser security feature that controls whether a web page can read responses from another origin.

You usually encounter CORS when frontend code calls an API.

## What Is an Origin?

An origin is made from:

- protocol
- domain
- port

Example:

```text
https://example.com:443
```

These are different origins:

```text
https://example.com
http://example.com
https://api.example.com
https://example.com:3000
```

Even small differences matter.

## Same-Origin Request

If your page is loaded from:

```text
https://example.com
```

and it requests:

```text
https://example.com/api/users
```

that is same-origin.

CORS is usually not involved.

## Cross-Origin Request

If your page is loaded from:

```text
http://localhost:3000
```

and it requests:

```text
http://localhost:5000/api/users
```

that is cross-origin because the ports differ.

The browser checks whether the API allows the request.

## CORS Is Enforced by Browsers

CORS is mainly a browser rule.

If a server does not send the right CORS headers, the browser blocks JavaScript from reading the response.

Important:

```text
The request may reach the server.
The browser may still block your JavaScript from reading the response.
```

This is why CORS can feel confusing.

## The Key Header

The main response header is:

```http
Access-Control-Allow-Origin
```

Example:

```http
Access-Control-Allow-Origin: http://localhost:3000
```

This tells the browser:

```text
Code from http://localhost:3000 is allowed to read this response.
```

Some public APIs use:

```http
Access-Control-Allow-Origin: *
```

This means any origin can read the response.

Do not use `*` for private authenticated APIs.

## Simple CORS Example

Frontend:

```js
const response = await fetch("http://localhost:5000/api/users");
const users = await response.json();
```

Backend response headers must allow the frontend origin.

```http
Access-Control-Allow-Origin: http://localhost:3000
```

If not, the browser shows a CORS error.

## CORS Is Not an API Bug in fetch

CORS errors are not fixed by changing random `fetch` options in frontend code.

The server must allow the browser origin.

Frontend code can send the request.

But the server controls whether the browser may expose the response.

## Best Practices

Understand the origin: protocol, domain, and port.

Read the CORS error carefully.

Fix CORS on the server or development proxy.

Do not use `mode: "no-cors"` as a normal fix.

Allow only trusted origins for private APIs.

## Common Mistakes

### Mistake 1: Thinking localhost Ports Are Same-Origin

```text
http://localhost:3000
http://localhost:5000
```

Different ports mean different origins.

### Mistake 2: Trying to Fix CORS Only in Frontend Code

CORS permission comes from server response headers.

### Mistake 3: Using `no-cors`

`mode: "no-cors"` usually gives you an opaque response that JavaScript cannot read.

It does not solve normal API access.

## Summary

CORS controls cross-origin response access in browsers.

- Origin means protocol, domain, and port.
- Different ports are different origins.
- Browsers enforce CORS.
- Servers allow origins with CORS response headers.
- `Access-Control-Allow-Origin` is the key header.
- Most CORS fixes happen on the server or proxy, not in frontend `fetch` code.
