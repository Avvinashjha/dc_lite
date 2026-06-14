# Why CORS Exists

CORS exists to protect users.

Without browser restrictions, a malicious website could make requests to other sites and read private data.

## The Security Problem

Imagine you are logged in to your bank in one browser tab.

Then you visit a malicious website in another tab.

Without browser protections, that malicious site might try:

```js
fetch("https://bank.example.com/account")
```

If the browser allowed the malicious site to read the response, it could steal private data.

CORS helps prevent this.

## Cookies Make This Important

Browsers can automatically include cookies with requests.

Cookies often prove that you are logged in.

So a request from a malicious page could potentially include your session cookies.

CORS controls whether the malicious page is allowed to read the response.

## Same-Origin Policy

Before CORS, browsers used the same-origin policy.

The same-origin policy says:

```text
A page can freely read resources from the same origin.
Reading cross-origin responses is restricted.
```

CORS is a controlled way for servers to relax this restriction.

## CORS Is Server Permission

The server decides who may read its responses.

Example:

```http
Access-Control-Allow-Origin: https://trusted-app.example.com
```

This says:

```text
Allow JavaScript from https://trusted-app.example.com to read this response.
```

If the server does not send permission, the browser blocks access.

## Public APIs vs Private APIs

Public API:

```http
Access-Control-Allow-Origin: *
```

This may be okay for data intended for everyone.

Private API:

```http
Access-Control-Allow-Origin: https://app.example.com
```

Private APIs should allow only trusted origins.

If credentials like cookies are involved, you must be even more careful.

## Credentials and CORS

Some requests include credentials such as cookies.

Frontend:

```js
fetch("https://api.example.com/me", {
  credentials: "include",
});
```

Server responses for credentialed requests need specific headers.

They cannot safely use:

```http
Access-Control-Allow-Origin: *
```

The server must name the allowed origin and allow credentials.

## CORS Does Not Replace Authentication

CORS is not authentication.

Authentication answers:

```text
Who is the user?
```

CORS answers:

```text
Which browser origins may read this response?
```

You usually need both for private APIs.

## CORS Does Not Protect Servers From All Requests

CORS mainly protects browser users by controlling response access.

It does not stop every possible request from reaching a server.

Other tools, scripts, and servers can make HTTP requests without browser CORS enforcement.

Servers still need proper authentication, authorization, rate limiting, and validation.

## Best Practices

Allow only trusted frontend origins for private APIs.

Do not use `*` for authenticated APIs.

Use proper authentication and authorization.

Understand that CORS is a browser security feature.

Do not treat CORS as a replacement for backend security.

## Common Mistakes

### Mistake 1: Thinking CORS Authenticates Users

CORS does not log users in or verify identity.

It only controls browser response access by origin.

### Mistake 2: Using `*` Everywhere

This may expose data meant only for a trusted app.

### Mistake 3: Thinking CORS Blocks All Non-Browser Clients

CORS is enforced by browsers.

Backend servers and command-line tools are not restricted in the same way.

## Summary

CORS exists because browsers protect users from cross-origin data theft.

- Same-origin policy restricts cross-origin reads.
- CORS lets servers opt in to trusted origins.
- Cookies and logged-in sessions make CORS important.
- CORS is not authentication.
- Private APIs should allow specific trusted origins.
- Servers still need real security controls.
