# Using fetch

`fetch` is the modern browser API for making HTTP requests from JavaScript.

You use it when your code needs to talk to a server.

Examples:

- load users from an API
- submit a form
- fetch product data
- save settings
- call your backend

## What Is an API?

An API is a way for one program to communicate with another program.

In web development, an API often means an HTTP endpoint that returns data.

Example URL:

```text
https://api.example.com/users/1
```

Your JavaScript sends a request.

The server sends a response.

## Basic fetch Example

```js
const response = await fetch("https://api.example.com/users/1");
const user = await response.json();

console.log(user.name);
```

This code:

1. Sends a request with `fetch`.
2. Waits for the HTTP response.
3. Parses the response body as JSON.
4. Uses the resulting object.

## fetch Returns a Promise

`fetch()` is asynchronous.

```js
const result = fetch("/api/user");

console.log(result); // Promise
```

To get the response, use `await` inside an async function.

```js
async function loadUser() {
  const response = await fetch("/api/user");
  const user = await response.json();

  return user;
}
```

Or use `.then()`.

```js
fetch("/api/user")
  .then((response) => response.json())
  .then((user) => {
    console.log(user.name);
  });
```

In modern code, `async` / `await` is often easier to read.

## The Response Object

`fetch()` resolves to a `Response` object.

```js
const response = await fetch("/api/user");

console.log(response.status);
console.log(response.ok);
console.log(response.headers);
```

Useful response properties:

| Property | Meaning |
| --- | --- |
| `status` | HTTP status code, such as `200` or `404` |
| `ok` | `true` for status codes 200-299 |
| `headers` | response headers |

## Reading the Response Body

Common body-reading methods:

```js
await response.json();
await response.text();
await response.blob();
```

Use `.json()` when the server sends JSON.

```js
const data = await response.json();
```

Important:

```text
response.json() also returns a Promise.
```

That is why you need `await`.

## fetch Does Not Reject for 404

This surprises many beginners.

`fetch()` rejects for network-level failures.

It does not reject just because the server returns `404` or `500`.

```js
const response = await fetch("/api/missing");

console.log(response.status); // 404
console.log(response.ok); // false
```

You should check `response.ok`.

```js
async function loadUser() {
  const response = await fetch("/api/user");

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}
```

## Handling fetch Errors

```js
async function loadUser() {
  try {
    const response = await fetch("/api/user");

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.log("Could not load user:", error.message);
    return null;
  }
}
```

This handles:

- network failures
- failed status codes you explicitly throw for
- JSON parsing errors

## Best Practices

Use `async` / `await` for readable request code.

Check `response.ok` before parsing data when status matters.

Use `response.json()` for JSON responses.

Handle errors with `try...catch`.

Do not assume every response body is valid JSON.

## Common Mistakes

### Mistake 1: Forgetting `await response.json()`

```js
const data = response.json();

console.log(data); // Promise
```

Correct:

```js
const data = await response.json();
```

### Mistake 2: Assuming 404 Rejects Automatically

```js
const response = await fetch("/missing");
```

This can still resolve.

Check:

```js
if (!response.ok) {}
```

### Mistake 3: Calling fetch Outside Async Code With await

```js
const response = await fetch("/api/user");
```

This must be inside an async function or module with top-level await support.

## Summary

`fetch` sends HTTP requests from JavaScript.

- `fetch()` returns a Promise.
- The fulfilled value is a `Response` object.
- Use `await response.json()` to parse JSON.
- Check `response.ok` for HTTP error statuses.
- Use `try...catch` for network, parsing, and thrown response errors.
