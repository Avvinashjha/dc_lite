# REST Integration

REST APIs model data as resources addressed by URLs.

React does not require REST, but REST is still one of the most common ways React apps communicate with backends.

## Resources and Methods

REST endpoints usually use nouns for resources and HTTP methods for actions.

```text
GET    /api/products       list products
GET    /api/products/42    get one product
POST   /api/products       create product
PATCH  /api/products/42    update product fields
DELETE /api/products/42    delete product
```

The URL identifies the resource. The method describes what to do.

## Fetching a List

```jsx
async function getProducts({ page, query }) {
  const params = new URLSearchParams({
    page: String(page),
    q: query,
  });

  const response = await fetch(`/api/products?${params}`);

  if (!response.ok) {
    throw new Error("Could not load products");
  }

  return response.json();
}
```

Use `URLSearchParams` instead of building query strings by hand.

## Creating a Resource

```jsx
async function createProduct(input) {
  const response = await fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Could not create product");
  }

  return response.json();
}
```

Always serialize the body explicitly when sending JSON.

## Status Codes Matter

Common status codes:

- `200`: success with response body
- `201`: created
- `204`: success with no body
- `400`: invalid request
- `401`: unauthenticated
- `403`: authenticated but not allowed
- `404`: not found
- `409`: conflict
- `422`: validation error
- `429`: rate limited
- `500`: server error

Do not treat all failures the same in the UI.

Validation errors can show field messages. A server outage may show a retry button. A `401` may redirect to login.

## Pagination and Filtering

Large lists should not be fetched all at once.

```text
GET /api/orders?page=2&limit=25&status=open
```

The response might include metadata.

```json
{
  "items": [],
  "page": 2,
  "totalPages": 8,
  "totalItems": 183
}
```

React UI should handle empty pages, loading the next page, and filters changing while requests are in flight.

## Optimistic Updates

An optimistic update changes the UI before the server confirms success.

```jsx
async function completeTodo(todoId) {
  setTodos((todos) =>
    todos.map((todo) =>
      todo.id === todoId ? { ...todo, completed: true } : todo
    )
  );

  try {
    await api.completeTodo(todoId);
  } catch (error) {
    setTodos((todos) =>
      todos.map((todo) =>
        todo.id === todoId ? { ...todo, completed: false } : todo
      )
    );
  }
}
```

Optimistic UI feels fast, but rollback logic must be correct.

## Idempotency Awareness

Network failures can leave the client unsure whether the server completed a request.

For payments, orders, and other critical mutations, backends often support idempotency keys.

```text
POST /api/orders
Idempotency-Key: 70f7b9c2
```

Retrying with the same key should not create duplicate orders.

## Common Mistakes

- Using `GET` for mutations because it is convenient.
- Ignoring `response.ok`.
- Calling `response.json()` for a `204 No Content` response.
- Fetching unbounded lists.
- Retrying non-idempotent mutations without backend support.
- Treating `401` and `403` as the same error.

:::quiz
question: What does `403 Forbidden` usually mean?
options:
  - The user is authenticated but does not have permission
  - The request succeeded with no body
  - The server created a new resource
  - The browser could not parse JSX
answer: 0
explanation: `403` usually means the server understood who the user is but denies access to the resource.
:::

## Practical Challenge

Design REST endpoints for a todo app.

Include:

- list todos with filters
- create a todo
- edit a title
- mark complete
- delete a todo
- handle validation errors

Then write React request functions for each endpoint.

## Recap

REST integration is about clear resource contracts, meaningful status handling, pagination, retries, and careful mutation behavior.

React components should not need to know every low-level HTTP detail, but they should receive enough information to show the right UI.
