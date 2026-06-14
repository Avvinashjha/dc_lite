# CORS and Browser Security Boundaries

Browsers enforce security boundaries around web pages.

One of the most important boundaries is the origin.

An origin is made of:

- protocol
- domain
- port

These are different origins:

```text
https://example.com
https://api.example.com
http://example.com
https://example.com:8443
```

## Same-Origin Policy

The same-origin policy limits how one origin can interact with another.

Without this rule, a page from one site could freely read private data from another site in the same browser.

The same-origin policy is one reason browser apps are safer than they would be otherwise.

## What CORS Does

CORS stands for cross-origin resource sharing.

CORS is a controlled way for a server to say:

"This other origin is allowed to read my response."

For example, an API might allow a frontend hosted at `https://app.example.com`.

The server sends CORS headers.

The browser checks those headers.

If the headers do not allow the request, browser JavaScript cannot read the response.

## CORS Is Not Authentication

CORS does not prove who the user is.

CORS does not replace login.

CORS does not replace authorization checks.

This is a common mistake.

```js
// This frontend request might be blocked or allowed by CORS.
// The server still needs authentication and authorization.
const response = await fetch("https://api.example.com/admin/users");
```

Even if CORS blocks the frontend from reading a response, the server should still protect the route.

## CORS Is a Browser Rule

CORS is enforced by browsers.

It is not a general server-to-server security boundary.

Backend services, command-line tools, and scripts are not protected by browser CORS checks in the same way.

That is why APIs must enforce their own authentication, authorization, validation, and rate limits.

## Credentials and CORS

Cross-origin requests that include cookies or other credentials need careful setup.

```js
await fetch("https://api.example.com/me", {
  credentials: "include",
});
```

The server must explicitly allow credentials.

It also must not use a careless wildcard origin for credentialed requests.

If a request uses cookies, think about CSRF protections too.

## Do Not Use CORS as an Access Control List

It is fine to restrict which browser origins can read responses.

But do not treat CORS as your only access control.

Your server should still ask:

- Is the user authenticated?
- Is the user allowed to access this resource?
- Is the request valid?
- Is the rate reasonable?

## Content Security Policy

Content Security Policy, or CSP, is a browser feature that limits what a page is allowed to load and execute.

It is configured with HTTP response headers.

Example shape:

```text
Content-Security-Policy: default-src 'self'; script-src 'self'
```

CSP can reduce damage from some XSS mistakes by limiting where scripts can come from.

It is not a substitute for safe DOM updates.

Think of CSP as an extra layer.

## Mixed Content

Mixed content happens when an HTTPS page loads resources over HTTP.

```html
<!-- Avoid loading insecure resources from an HTTPS page -->
<script src="http://example.com/widget.js"></script>
```

Modern browsers block many forms of mixed content.

Use HTTPS for scripts, styles, images, API calls, and other resources.

## Common Mistakes

Do not say "CORS secures my API" without authentication and authorization.

Do not fix CORS by allowing every origin with credentials.

Do not expose private data just because a request comes from a known frontend origin.

Do not assume a blocked browser response means the server route is safe.

Do not rely on CSP instead of escaping and safe DOM APIs.

## Summary

CORS controls whether browser JavaScript can read cross-origin responses.

It is useful, but it is not authentication, authorization, CSRF protection, or rate limiting.

Use CORS as one browser boundary among many security layers.
