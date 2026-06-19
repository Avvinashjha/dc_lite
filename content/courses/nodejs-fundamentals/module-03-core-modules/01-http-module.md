# The http Module

## Why It Matters

The `node:http` module is the foundation under many Node.js web frameworks. You may use Express or Fastify in real projects, but understanding `node:http` explains what those frameworks are wrapping: requests, responses, headers, methods, URLs, sockets, and streaming bodies.

## Core Concepts

An HTTP server receives a request and writes a response.

```js
import http from 'node:http';

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'content-type': 'text/plain' });
  response.end('Hello from Node.js\n');
});

server.listen(3000, () => {
  console.log('Listening on http://localhost:3000');
});
```

`request` is a readable stream. `response` is a writable stream. That means large request and response bodies do not have to be loaded into memory all at once.

## Syntax and Examples

### Routing manually

```js
import http from 'node:http';

const server = http.createServer((request, response) => {
  if (request.method === 'GET' && request.url === '/health') {
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify({ ok: true }));
    return;
  }

  response.writeHead(404, { 'content-type': 'application/json' });
  response.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(3000);
```

Manual routing is useful for learning and very small services. Larger apps usually use a framework to handle routing, middleware, validation, and errors.

### Reading a JSON body

```js
async function readJson(request) {
  let body = '';

  for await (const chunk of request) {
    body += chunk;

    if (body.length > 1_000_000) {
      throw new Error('Body too large');
    }
  }

  return JSON.parse(body);
}
```

Always apply body size limits. A server that reads unlimited request bodies can be exhausted by a client.

## Use Cases

Use `node:http` directly for:

- Learning HTTP internals
- Health check servers
- Simple internal tools
- Custom proxies or stream handling
- Framework internals

Use a framework when you need:

- Declarative routing
- Middleware
- Validation
- Authentication helpers
- Error handling conventions
- OpenAPI integration

## Common Mistakes

- Forgetting to end the response.
- Sending JSON without `content-type: application/json`.
- Trusting `request.url` without parsing it.
- Reading unlimited request bodies.
- Throwing inside an async request handler without converting the error into an HTTP response.

## Practical Challenge

Build a small server with:

- `GET /health` returning `{ "ok": true }`
- `POST /echo` reading JSON and returning it
- A 404 JSON response for everything else

Then test it with `curl`.

## Recap

`node:http` exposes HTTP at a low level. Requests and responses are streams, routing is manual, and error handling is your responsibility. Frameworks are easier to use once you understand this foundation.
