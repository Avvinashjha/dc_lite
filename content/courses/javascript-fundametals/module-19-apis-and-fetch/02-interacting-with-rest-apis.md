# Interacting with REST APIs

REST APIs are a common style of web API.

They organize data around resources.

Examples of resources:

- users
- products
- orders
- posts
- comments

An API endpoint is a URL for working with a resource.

```text
/api/users
/api/users/1
/api/products
/api/orders/42
```

## Resources and URLs

A collection endpoint often represents many items.

```text
GET /api/users
```

An item endpoint often represents one item.

```text
GET /api/users/1
```

The number `1` is usually an ID.

## HTTP Methods

REST APIs use HTTP methods to describe actions.

| Method | Common purpose |
| --- | --- |
| `GET` | Read data |
| `POST` | Create data |
| `PUT` | Replace data |
| `PATCH` | Update part of data |
| `DELETE` | Delete data |

The URL identifies the resource.

The method describes the action.

## GET Request

```js
async function getUser(id) {
  const response = await fetch(`/api/users/${id}`);

  if (!response.ok) {
    throw new Error(`Could not load user ${id}`);
  }

  return response.json();
}
```

`GET` is the default method for `fetch`.

## POST Request

Use `POST` to create data.

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
    throw new Error("Could not create user");
  }

  return response.json();
}
```

The body is converted to JSON text with `JSON.stringify()`.

The `Content-Type` header tells the server what format you are sending.

## PATCH Request

Use `PATCH` to update part of a resource.

```js
async function updateUserName(id, name) {
  const response = await fetch(`/api/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error("Could not update user");
  }

  return response.json();
}
```

## DELETE Request

```js
async function deleteUser(id) {
  const response = await fetch(`/api/users/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Could not delete user");
  }
}
```

Some delete endpoints return JSON.

Some return no body.

Check the API documentation.

## HTTP Status Codes

Status codes tell you what happened.

| Status | Meaning |
| --- | --- |
| `200` | OK |
| `201` | Created |
| `204` | No Content |
| `400` | Bad Request |
| `401` | Unauthorized |
| `403` | Forbidden |
| `404` | Not Found |
| `500` | Server Error |

`response.ok` is `true` for status codes from `200` to `299`.

## API Documentation

Real APIs have documentation.

Documentation usually tells you:

- endpoint URLs
- HTTP methods
- required headers
- request body shape
- response body shape
- possible status codes
- authentication requirements

Always read the API docs.

## Best Practices

Use the correct HTTP method for the action.

Check `response.ok`.

Send JSON with `Content-Type: application/json`.

Use `JSON.stringify()` for request bodies.

Do not assume every response has a JSON body.

Read API documentation carefully.

## Common Mistakes

### Mistake 1: Sending an Object Directly as body

```js
body: { name: "Alice" }
```

Correct:

```js
body: JSON.stringify({ name: "Alice" })
```

### Mistake 2: Forgetting Content-Type

Some servers need:

```js
headers: {
  "Content-Type": "application/json",
}
```

### Mistake 3: Parsing JSON From a 204 Response

`204 No Content` has no body.

Calling `response.json()` may fail.

## Summary

REST APIs organize data around resources.

- URLs identify resources.
- HTTP methods describe actions.
- `GET` reads data.
- `POST` creates data.
- `PATCH` updates part of data.
- `DELETE` removes data.
- Status codes describe results.
- Use headers and JSON bodies correctly.
