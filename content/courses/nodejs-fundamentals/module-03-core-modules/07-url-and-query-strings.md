# URL and Query String Handling

## Why It Matters

URLs carry routing, filtering, pagination, search, and resource identity. Parsing them with string splitting is fragile. Node.js provides standard URL APIs that correctly handle encoding, query parameters, relative URLs, and edge cases.

Use `URL` and `URLSearchParams` for modern code.

## Core Concepts

```js
const url = new URL('https://example.com/products?page=2&tag=node');

console.log(url.protocol);
console.log(url.hostname);
console.log(url.pathname);
console.log(url.searchParams.get('page'));
```

`URL` represents the whole URL. `URLSearchParams` represents the query string.

## Syntax and Examples

### Building URLs

```js
const url = new URL('https://api.example.com/search');

url.searchParams.set('q', 'node streams');
url.searchParams.set('page', '1');

console.log(url.toString());
```

Let the API encode values. Do not manually concatenate `?q=${value}` when values may contain spaces, `&`, `?`, or Unicode.

### Parsing request URLs

In `node:http`, `request.url` is usually a path, not a full absolute URL. Provide a base:

```js
import http from 'node:http';

http
  .createServer((request, response) => {
    const url = new URL(request.url, 'http://localhost');

    response.end(`Path: ${url.pathname}, page: ${url.searchParams.get('page')}`);
  })
  .listen(3000);
```

The base is needed only for parsing. In real apps, be careful when reconstructing public URLs behind proxies.

### Multiple query values

```js
const params = new URLSearchParams('tag=node&tag=api&sort=recent');

console.log(params.get('tag'));
console.log(params.getAll('tag'));
```

Use `getAll` when repeated keys are valid.

## Use Cases

Use URL APIs for:

- Pagination query strings
- API client request construction
- Redirect targets
- Parsing HTTP request paths
- Validating callback URLs
- File URL handling with `import.meta.url`

## Common Mistakes

- Splitting URLs by `/`, `?`, or `&`.
- Forgetting query parameter values are strings.
- Double-encoding values.
- Trusting user-provided redirect URLs without allowlists.
- Using `node:path` for URLs or URL APIs for file system paths.

## Practical Challenge

Write `parse-url.mjs` that accepts a URL from `process.argv` and prints the protocol, host, path, and all query parameters. Then build a new URL that changes `page` to `2` while preserving the other parameters.

## Recap

`URL` and `URLSearchParams` give you structured, encoding-aware URL handling. Prefer them over manual string parsing for both servers and API clients.
