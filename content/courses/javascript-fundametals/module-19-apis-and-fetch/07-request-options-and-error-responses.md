# Request Options and Error Responses

`fetch` accepts a second argument called the options object.

Use it to configure the request.

```js
fetch("/api/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ name: "Alice" }),
});
```

## Common Request Options

| Option | Purpose |
| --- | --- |
| `method` | HTTP method such as `GET`, `POST`, `PATCH`, `DELETE` |
| `headers` | request headers |
| `body` | request body |
| `credentials` | whether cookies are included |
| `signal` | cancellation signal |

## POST Example

```js
async function createPost(post) {
  const response = await fetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    throw new Error(`Failed to create post: ${response.status}`);
  }

  return response.json();
}
```

## PATCH Example

```js
async function updatePost(id, changes) {
  const response = await fetch(`/api/posts/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(changes),
  });

  if (!response.ok) {
    throw new Error(`Failed to update post: ${response.status}`);
  }

  return response.json();
}
```

## Handling Error Responses

Many APIs return useful error details in the response body.

```json
{
  "message": "Email is already taken"
}
```

You can parse the error body carefully.

```js
async function parseErrorMessage(response) {
  try {
    const data = await response.json();
    return data.message ?? `Request failed with status ${response.status}`;
  } catch {
    return `Request failed with status ${response.status}`;
  }
}
```

Use it:

```js
async function createUser(user) {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    const message = await parseErrorMessage(response);
    throw new Error(message);
  }

  return response.json();
}
```

## Network Error vs HTTP Error

A network error means the request could not complete at the network level.

An HTTP error means the server responded with an error status like `404` or `500`.

```js
try {
  const response = await fetch("/api/users");

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
} catch (error) {
  console.log(error.message);
}
```

The `catch` block can catch both network errors and errors you throw for HTTP statuses.

## Credentials

Use `credentials` when cookies or HTTP authentication should be included.

```js
fetch("https://api.example.com/me", {
  credentials: "include",
});
```

Common values:

| Value | Meaning |
| --- | --- |
| `same-origin` | default in modern fetch; send credentials for same-origin |
| `include` | include credentials for cross-origin too |
| `omit` | do not include credentials |

Credentialed cross-origin requests require proper CORS configuration.

## Best Practices

Use `method`, `headers`, and `body` intentionally.

Always `JSON.stringify()` JSON request bodies.

Check `response.ok`.

Parse API error bodies carefully.

Distinguish network errors from HTTP error responses.

Use `credentials` only when needed.

## Common Mistakes

### Mistake 1: Forgetting `body`

```js
fetch("/api/users", {
  method: "POST",
});
```

If the server expects data, send a body.

### Mistake 2: Forgetting `Content-Type`

Some APIs will not parse your JSON body without:

```js
"Content-Type": "application/json"
```

### Mistake 3: Assuming `catch` Handles 404 Automatically

`fetch` resolves for HTTP responses, even failed status codes.

Check `response.ok`.

## Summary

The `fetch` options object configures requests.

- Use `method` for HTTP methods.
- Use `headers` for metadata.
- Use `body` for request payloads.
- Use `credentials` when cookies are needed.
- Check `response.ok` for HTTP errors.
- Parse error responses carefully when APIs provide useful error bodies.
