# Why Node.js? Use Cases

## Why It Matters

Choosing Node.js is an architectural decision, not just a language preference. It affects hiring, deployment, package management, performance tuning, testing strategy, and how your application handles concurrency.

Node.js is popular because it lets teams use JavaScript or TypeScript across the stack, has a huge package ecosystem, starts quickly, deploys well in containers and serverless platforms, and handles many simultaneous I/O operations efficiently.

## Core Concepts

### I/O-heavy workloads

Most web services spend much of their time waiting for something else:

- A database query
- A cache lookup
- A payment API
- A file upload
- A message broker
- A downstream microservice

Node.js is designed around not wasting the main JavaScript thread while those operations are pending. You start the operation, return control to the runtime, and continue when the result is available.

```js
import { readFile } from 'node:fs/promises';

const [users, settings] = await Promise.all([
  readFile('users.json', 'utf8'),
  readFile('settings.json', 'utf8'),
]);

console.log(users.length, settings.length);
```

The two reads can progress concurrently. Your code does not need to manually create threads for this common case.

### Shared language benefits

Using JavaScript on both client and server can reduce friction:

- Shared validation schemas
- Shared API types when using TypeScript
- Similar tooling for linting, testing, bundling, and formatting
- Easier context switching for full-stack teams

This does not mean frontend and backend code should be mixed carelessly. Server code still has different security, reliability, and data-access responsibilities.

### Ecosystem leverage

npm has packages for nearly every common server-side task. That is useful, but it also creates risk. Every dependency adds maintenance, security, licensing, and supply chain considerations. A mature Node.js developer knows when to use a package and when a built-in module is enough.

## Strong Use Cases

### APIs and backend services

Node.js is a natural fit for REST APIs, GraphQL APIs, and backend-for-frontend services. These apps usually coordinate I/O and transform JSON.

```js
import http from 'node:http';

const server = http.createServer(async (request, response) => {
  if (request.url === '/health') {
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify({ ok: true }));
    return;
  }

  response.writeHead(404, { 'content-type': 'application/json' });
  response.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(3000);
```

### Real-time systems

Chat apps, dashboards, collaboration tools, and notification systems often keep many connections open. Node.js handles connection-oriented I/O well as long as each event handler stays quick.

### CLI and automation tools

Node.js is widely used for CLIs because it is cross-platform and integrates well with JSON, HTTP, files, and package distribution.

```js
#!/usr/bin/env node
import { argv } from 'node:process';

const name = argv[2] ?? 'developer';
console.log(`Hello, ${name}`);
```

### Build tools

Bundlers, transpilers, test runners, linters, and code generators often run in Node.js. Even projects that do not use Node.js in production often use it during development.

## Tradeoffs

Node.js is not always the best choice.

It can struggle when:

- Request handlers perform heavy CPU work.
- The team depends on too many low-quality packages.
- The app needs strong runtime isolation between tasks.
- The project would benefit more from a framework or language with stricter defaults.

It works best when:

- Work is mostly I/O-bound.
- The team understands async patterns.
- Dependencies are reviewed carefully.
- Long CPU tasks are moved to workers, separate services, native modules, or job queues.

## Common Mistakes

- Choosing Node.js only because the frontend uses JavaScript.
- Installing packages for simple tasks that built-in modules already solve.
- Blocking the event loop with expensive data transformations.
- Assuming async code is automatically faster. Concurrency helps only when there is independent waiting work.
- Ignoring operational needs such as logging, metrics, graceful shutdown, and configuration validation.

## Practical Challenge

List three projects where Node.js is a good fit and one where it is not. For each, explain whether the workload is mostly I/O-bound or CPU-bound. Then write a small script that fetches two URLs concurrently using `fetch` and prints their status codes.

```js
const urls = ['https://example.com', 'https://nodejs.org'];

const responses = await Promise.all(urls.map((url) => fetch(url)));

for (const response of responses) {
  console.log(response.url, response.status);
}
```

## Recap

Node.js is strongest when an application coordinates many I/O operations and needs fast iteration in the JavaScript ecosystem. Its weaknesses appear when CPU-heavy work, dependency sprawl, or poor async discipline block the event loop or make the system hard to operate.
