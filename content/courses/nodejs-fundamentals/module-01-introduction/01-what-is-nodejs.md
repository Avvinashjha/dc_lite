# What is Node.js?

## Why It Matters

Node.js lets JavaScript run outside the browser. That single idea changed how teams build web servers, command line tools, build systems, automation scripts, desktop apps, serverless functions, and real-time applications.

Before Node.js, JavaScript was mostly a browser language. Node.js embeds the V8 JavaScript engine and adds APIs for files, networking, processes, streams, cryptography, and operating system integration. The result is a runtime: a program that executes your JavaScript and provides capabilities that browsers intentionally do not expose.

For backend developers, Node.js matters because it is especially good at handling many concurrent I/O tasks: HTTP requests, database calls, file reads, message queues, and API integrations. It is not magic, and it is not the best tool for every workload, but it gives JavaScript a practical server-side environment.

## Core Concepts

### Runtime vs language

JavaScript is the language. Node.js is one runtime for that language.

The language gives you syntax such as functions, promises, classes, modules, arrays, and objects. Node.js adds runtime APIs such as:

- `node:fs` for files
- `node:http` for servers and clients
- `node:path` for path handling
- `node:crypto` for hashing, random values, and encryption primitives
- `node:process` for environment variables, arguments, and process lifecycle

Browsers provide web APIs such as `document`, `window`, `fetch`, and `localStorage`. Node.js provides server and operating system APIs. Modern Node.js also includes some web-compatible APIs, including `fetch`, `URL`, `AbortController`, and Web Streams, but you should still think carefully about which runtime you are targeting.

### Event-driven execution

Node.js uses an event-driven model. Instead of creating one operating system thread per request, Node.js usually runs your JavaScript on one main thread and delegates slow I/O work to the operating system or a worker pool. When the work is ready, Node.js schedules a callback, promise continuation, or event handler.

This model works well when code spends a lot of time waiting:

- Waiting for a database
- Waiting for a remote API
- Waiting for disk
- Waiting for a client to send data

It works poorly when one request performs a long CPU-bound task on the main thread, because that blocks other JavaScript from running.

### Built-in modules

Node.js ships with many built-in modules. Use the `node:` prefix when importing them:

```js
import { readFile } from 'node:fs/promises';

const text = await readFile('message.txt', 'utf8');
console.log(text);
```

The `node:` prefix makes it clear you are importing a core module, not a package from `node_modules`.

## Syntax and Examples

Create a file named `hello.mjs`:

```js
console.log('Hello from Node.js');
console.log('Node version:', process.version);
console.log('Platform:', process.platform);
```

Run it:

```bash
node hello.mjs
```

A tiny HTTP server:

```js
import http from 'node:http';

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'content-type': 'text/plain' });
  response.end(`You requested ${request.url}\n`);
});

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});
```

Run it with `node server.mjs`, then open `http://localhost:3000`.

This example shows the basic shape of Node.js programs: import a module, create something long-lived, register a handler, and let Node.js call your handler when events happen.

## Use Cases

Node.js is commonly used for:

- REST and GraphQL APIs
- Real-time apps with WebSockets or Server-Sent Events
- Backend-for-frontend services
- CLI tools and developer automation
- Build tooling and code generation
- Serverless functions
- Streaming data pipelines
- Lightweight workers that coordinate I/O-heavy jobs

Node.js is less ideal for heavy CPU workloads such as video encoding, numerical simulation, image processing, and machine learning inference unless you offload the CPU work to native libraries, worker threads, separate processes, or another service.

## Common Mistakes

- Treating Node.js like browser JavaScript and expecting `document` or `window` to exist.
- Blocking the event loop with long loops, synchronous file calls in request handlers, or expensive JSON processing.
- Ignoring errors from async operations.
- Importing built-in modules without realizing package names can conflict; prefer `node:` for core modules.
- Assuming Node.js is single-threaded in every sense. Your JavaScript usually runs on one main thread, but Node.js uses operating system async I/O and a libuv worker pool internally.

## Practical Challenge

Create a script named `runtime-info.mjs` that prints:

- Node.js version
- Current working directory
- Platform and CPU architecture
- The value of an environment variable named `APP_ENV`, defaulting to `development`

Run it twice:

```bash
node runtime-info.mjs
APP_ENV=production node runtime-info.mjs
```

## Recap

Node.js is a JavaScript runtime, not a framework. It combines the JavaScript language with server-side APIs and an event-driven execution model. Its strengths are I/O-heavy applications, tooling, and network services. Its main risk is blocking the event loop with CPU-heavy or synchronous work.
