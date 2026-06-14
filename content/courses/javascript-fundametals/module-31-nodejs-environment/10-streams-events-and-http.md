# Streams, Events, and HTTP

Node.js is often used for programs that handle data over time.

Examples:

- reading a large file
- receiving an HTTP request body
- sending a response
- processing logs
- handling realtime messages

Streams and events are two important Node patterns for this kind of work.

## EventEmitter Basics

Node's `EventEmitter` lets objects publish and listen for named events.

```js
import { EventEmitter } from "node:events";

const emitter = new EventEmitter();

emitter.on("ready", () => {
  console.log("Ready event received");
});

emitter.emit("ready");
```

This is similar to browser events in concept, but it is not the DOM event system.

There is no bubbling or capturing.

It is just an object emitting named events.

## Event Data

Events can pass data to listeners.

```js
import { EventEmitter } from "node:events";

const bus = new EventEmitter();

bus.on("user:created", (user) => {
  console.log(`Created ${user.name}`);
});

bus.emit("user:created", { id: 1, name: "Ada" });
```

Event emitters are useful when a piece of code should announce that something happened without directly calling every listener.

## The `error` Event

In Node, `error` events are special for many emitters.

If an `EventEmitter` emits `error` and there is no listener, Node may throw.

```js
emitter.on("error", (error) => {
  console.error("Emitter error:", error.message);
});
```

When working with streams, servers, or custom emitters, pay attention to error events.

## What Is a Stream?

A stream represents data that arrives or leaves in chunks.

Instead of loading everything at once, a stream processes data piece by piece.

This is useful for:

- large files
- network data
- request bodies
- response bodies
- logs

For small files, `readFile()` is often fine.

For large data, streams can use less memory.

## Reading with a Stream

```js
import { createReadStream } from "node:fs";

const stream = createReadStream("large-file.txt", {
  encoding: "utf8",
});

stream.on("data", (chunk) => {
  console.log("Received chunk:", chunk.length);
});

stream.on("end", () => {
  console.log("Finished reading");
});

stream.on("error", (error) => {
  console.error("Stream error:", error.message);
});
```

The file is read in chunks.

Each chunk triggers a `data` event.

## Writing with a Stream

```js
import { createWriteStream } from "node:fs";

const stream = createWriteStream("output.txt", {
  encoding: "utf8",
});

stream.write("First line\n");
stream.write("Second line\n");
stream.end("Done\n");
```

Writable streams are useful when output is built over time.

## Piping Streams

Piping sends data from a readable stream to a writable stream.

```js
import { createReadStream, createWriteStream } from "node:fs";

const source = createReadStream("input.txt");
const destination = createWriteStream("copy.txt");

source.pipe(destination);
```

This copies data without manually handling every chunk.

For robust production code, use pipeline utilities that handle errors and cleanup.

```js
import { pipeline } from "node:stream/promises";
import { createReadStream, createWriteStream } from "node:fs";

await pipeline(
  createReadStream("input.txt"),
  createWriteStream("copy.txt")
);
```

## HTTP Servers

Node can create HTTP servers with the built-in `http` module.

```js
import http from "node:http";

const server = http.createServer((request, response) => {
  response.setHeader("Content-Type", "text/plain");
  response.end("Hello from Node\n");
});

server.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});
```

When a request arrives, Node calls your request handler.

This is event-driven programming.

## Request and Response Objects

In the built-in HTTP module:

- `request` contains information about the incoming request
- `response` is used to send data back

```js
const server = http.createServer((request, response) => {
  console.log(request.method);
  console.log(request.url);

  response.statusCode = 200;
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify({ ok: true }));
});
```

The request object is a readable stream.

The response object is a writable stream.

That is why streams matter in Node web servers.

## Simple Routing

The built-in `http` module does not provide full routing.

You can write basic routing manually:

```js
const server = http.createServer((request, response) => {
  if (request.method === "GET" && request.url === "/health") {
    response.statusCode = 200;
    response.end("OK");
    return;
  }

  response.statusCode = 404;
  response.end("Not found");
});
```

For real apps, frameworks provide routing, middleware, validation, and error handling.

## Practical Pitfalls

Long CPU-heavy work blocks Node's event loop.

```js
// A very expensive loop can delay timers and requests
for (let i = 0; i < 1_000_000_000; i += 1) {}
```

Node is good at asynchronous I/O, but JavaScript still runs on the main thread.

Use care with:

- large synchronous loops
- synchronous file APIs in servers
- unbounded request bodies
- missing stream error handlers
- keeping too much data in memory

## Security Cautions

When building Node servers:

- validate request input
- do not expose stack traces to users
- do not trust file paths from requests
- do not log secrets
- set appropriate response headers
- use HTTPS in production
- keep dependencies updated

Node gives you low-level power. Frameworks help, but they do not remove the need for secure decisions.

## Common Mistakes

Do not use streams for every tiny file just because they exist.

Do not ignore `error` events on streams.

Do not assume Node HTTP routing works like Express routing.

Do not block the event loop with heavy synchronous work in a server.

Do not store request bodies in memory without size limits in real applications.

## Summary

Node.js uses events and streams heavily.

`EventEmitter` lets objects publish events, streams process data in chunks, and the built-in `http` module shows how Node handles web requests at a low level.

These ideas appear underneath many Node frameworks and libraries.
