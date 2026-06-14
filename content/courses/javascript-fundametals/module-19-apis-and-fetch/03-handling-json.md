# Handling JSON

Most web APIs send and receive JSON.

JSON is a text format for structured data.

Example JSON response:

```json
{
  "id": 1,
  "name": "Alice",
  "role": "admin"
}
```

In JavaScript, you usually work with objects.

So API code often converts between JSON text and JavaScript values.

## Reading JSON Responses

Use `response.json()` to parse a JSON response.

```js
const response = await fetch("/api/user");
const user = await response.json();

console.log(user.name);
```

Important:

```text
response.json() returns a Promise.
```

So use:

```js
await response.json()
```

## Sending JSON Requests

Use `JSON.stringify()` to send JavaScript data as JSON text.

```js
const user = {
  name: "Alice",
  role: "admin",
};

const response = await fetch("/api/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(user),
});
```

The server receives JSON text.

## Why Content-Type Matters

The `Content-Type` header tells the server what format the request body uses.

```js
headers: {
  "Content-Type": "application/json",
}
```

Without it, some servers may not parse the body correctly.

## JSON Parse Errors

`response.json()` can fail if the response body is not valid JSON.

```js
try {
  const response = await fetch("/api/user");
  const data = await response.json();
  console.log(data);
} catch (error) {
  console.log("Could not parse response");
}
```

This can happen when:

- the server returns HTML error pages
- the response is empty
- the response body is invalid JSON
- the wrong endpoint was called

## Handling Empty Responses

Some responses have no body.

Example:

```text
204 No Content
```

Do not always call `response.json()`.

```js
const response = await fetch("/api/users/1", {
  method: "DELETE",
});

if (response.status === 204) {
  console.log("Deleted");
} else {
  const data = await response.json();
  console.log(data);
}
```

## Checking Content-Type Before Parsing

You can inspect response headers.

```js
const contentType = response.headers.get("Content-Type");

if (contentType?.includes("application/json")) {
  const data = await response.json();
  console.log(data);
} else {
  const text = await response.text();
  console.log(text);
}
```

This is useful when an API sometimes returns non-JSON responses.

## JSON and Dates

JSON does not have a special Date type.

APIs usually send dates as strings.

```json
{
  "createdAt": "2026-06-14T12:00:00.000Z"
}
```

In JavaScript:

```js
const data = await response.json();

console.log(typeof data.createdAt); // string
```

Convert it if you need a Date object.

```js
const createdAt = new Date(data.createdAt);
```

## Best Practices

Use `response.json()` for JSON responses.

Use `JSON.stringify()` for JSON request bodies.

Set `Content-Type: application/json` when sending JSON.

Do not assume every response has a JSON body.

Handle parsing errors.

Remember that JSON dates are strings.

## Common Mistakes

### Mistake 1: Forgetting await

```js
const data = response.json();
console.log(data.name); // wrong
```

Correct:

```js
const data = await response.json();
```

### Mistake 2: Sending Raw Objects

```js
body: user
```

Correct:

```js
body: JSON.stringify(user)
```

### Mistake 3: Parsing Empty Responses

Calling `response.json()` on an empty body can fail.

Check the status or API docs.

## Summary

APIs commonly use JSON.

- `response.json()` parses JSON response bodies.
- `JSON.stringify()` converts JavaScript values into JSON text.
- JSON request bodies usually need `Content-Type: application/json`.
- Empty responses should not always be parsed as JSON.
- Invalid JSON causes parsing errors.
- Dates from JSON are strings unless you convert them.
