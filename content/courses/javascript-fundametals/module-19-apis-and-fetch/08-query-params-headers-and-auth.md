# Query Params, Headers, and Auth

Real API requests often need more than a URL.

You may need:

- query parameters
- headers
- authentication tokens
- pagination options
- filters

## Query Parameters

Query parameters appear after `?` in a URL.

```text
/api/products?category=books&page=2
```

They are often used for:

- search
- filters
- sorting
- pagination

Example:

```js
const response = await fetch("/api/products?category=books&page=2");
```

## Building Query Strings Safely

Use `URLSearchParams`.

```js
const params = new URLSearchParams({
  category: "books",
  page: "2",
  sort: "price",
});

const response = await fetch(`/api/products?${params.toString()}`);
```

`URLSearchParams` handles encoding for you.

```js
const params = new URLSearchParams({
  q: "javascript basics",
});

console.log(params.toString()); // q=javascript+basics
```

## Request Headers

Headers send metadata with a request.

```js
const response = await fetch("/api/users", {
  headers: {
    "Accept": "application/json",
  },
});
```

Common headers:

| Header | Purpose |
| --- | --- |
| `Accept` | tells server what response format you want |
| `Content-Type` | tells server what request body format you send |
| `Authorization` | sends authentication credentials |

## Authorization Header

Many APIs use bearer tokens.

```js
const token = "abc123";

const response = await fetch("/api/me", {
  headers: {
    "Authorization": `Bearer ${token}`,
  },
});
```

This tells the server who is making the request.

Never hard-code real secrets in frontend source code.

Frontend code is visible to users.

## API Keys in Frontend Code

Be careful with API keys.

Public browser code cannot safely hide secrets.

If an API key must be secret, call that API from your backend instead.

Frontend-safe keys are usually restricted by domain, permissions, or quota.

## Pagination Example

```js
async function loadProducts({ page = 1, limit = 20, category }) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (category) {
    params.set("category", category);
  }

  const response = await fetch(`/api/products?${params}`);

  if (!response.ok) {
    throw new Error("Could not load products");
  }

  return response.json();
}
```

Convert numbers to strings when building query params.

## Combining Headers

```js
async function createProduct(product, token) {
  const response = await fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error("Could not create product");
  }

  return response.json();
}
```

This sends both JSON format information and authentication.

## Best Practices

Use `URLSearchParams` for query strings.

Use headers intentionally.

Use `Authorization` for tokens when the API requires it.

Do not expose secret keys in frontend code.

Check API documentation for required params and headers.

Handle missing or expired authentication.

## Common Mistakes

### Mistake 1: Manually Concatenating Unsafe Query Strings

```js
const url = "/api/search?q=" + searchText;
```

Use:

```js
const params = new URLSearchParams({ q: searchText });
```

### Mistake 2: Hard-Coding Secrets

```js
const apiSecret = "real-secret-key";
```

Frontend code is visible to users.

### Mistake 3: Forgetting Bearer Prefix

Many APIs expect:

```http
Authorization: Bearer token
```

not just:

```http
Authorization: token
```

Check the API docs.

## Summary

Query params and headers make API requests more specific.

- Query params are used for filtering, searching, sorting, and pagination.
- `URLSearchParams` builds query strings safely.
- Headers send metadata.
- `Content-Type` describes request bodies.
- `Authorization` commonly sends auth tokens.
- Do not expose secret API keys in frontend code.
