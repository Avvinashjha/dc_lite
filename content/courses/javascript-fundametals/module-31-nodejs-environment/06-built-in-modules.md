# Built-In Modules

Node.js includes many built-in modules.

Built-in modules are available without installing anything from npm.

They help you work with:

- files
- paths
- URLs
- events
- HTTP
- cryptography
- operating system information
- streams
- child processes

This lesson covers several beginner-friendly modules you will see often.

## Importing Built-In Modules

Use the `node:` prefix for clarity.

```js
import path from "node:path";
import { readFile } from "node:fs/promises";
```

The prefix makes it clear that the module is built into Node.

CommonJS style:

```js
const path = require("node:path");
```

This course uses ES module examples.

## `node:path`

The `path` module helps you work with file paths safely.

```js
import path from "node:path";

const filePath = path.join("data", "users.json");

console.log(filePath);
```

Use `path.join()` instead of manually adding slashes.

```js
// Avoid
const filePath = "data/" + fileName;
```

Manual string paths can break across operating systems or produce invalid paths.

Useful methods:

```js
path.join("data", "users.json");
path.extname("users.json");
path.basename("/app/data/users.json");
path.dirname("/app/data/users.json");
```

## `node:url`

The `url` module helps work with URLs.

Modern JavaScript also provides the `URL` class.

```js
const url = new URL("https://example.com/search?q=node");

console.log(url.hostname);
console.log(url.pathname);
console.log(url.searchParams.get("q"));
```

Build query strings with `URLSearchParams`.

```js
const params = new URLSearchParams({
  q: "node basics",
  page: "1",
});

console.log(`/search?${params}`);
```

This is safer than manually concatenating query strings.

## `node:fs`

The `fs` module works with the file system.

Modern beginner code usually uses the promise-based API:

```js
import { readFile, writeFile } from "node:fs/promises";

const text = await readFile("notes.txt", "utf8");

await writeFile("copy.txt", text);
```

You will learn more about file system operations in the next lesson.

## `node:events`

The `events` module provides `EventEmitter`.

An event emitter lets one part of a program emit events and another part listen for them.

```js
import { EventEmitter } from "node:events";

const bus = new EventEmitter();

bus.on("message", (text) => {
  console.log(`Received: ${text}`);
});

bus.emit("message", "Hello");
```

This pattern appears in streams, servers, and many Node libraries.

## `node:http`

The `http` module can create an HTTP server.

```js
import http from "node:http";

const server = http.createServer((request, response) => {
  response.statusCode = 200;
  response.setHeader("Content-Type", "text/plain");
  response.end("Hello from Node");
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
```

This is useful for learning how Node handles requests.

In real applications, many teams use frameworks like Express, Fastify, or Next.js on top of Node.

## `node:os`

The `os` module provides operating system information.

```js
import os from "node:os";

console.log(os.platform());
console.log(os.cpus().length);
console.log(os.homedir());
```

This can be useful for scripts and tooling.

## `node:crypto`

The `crypto` module provides cryptographic utilities.

Example: create a random ID.

```js
import { randomUUID } from "node:crypto";

console.log(randomUUID());
```

Do not invent your own security algorithms.

Use well-reviewed platform APIs and libraries for security-sensitive work.

## Built-In vs npm Package

Before installing a package, check whether Node already has a built-in solution.

Examples:

| Task | Built-in option |
| --- | --- |
| read files | `node:fs/promises` |
| build paths | `node:path` |
| parse URLs | `URL` / `node:url` |
| generate UUIDs | `node:crypto` |
| create simple HTTP server | `node:http` |

Built-in modules reduce dependency risk and keep projects simpler.

## Common Mistakes

Do not import local files like built-ins.

```js
import config from "config.js"; // package-style import
import config from "./config.js"; // local file import
```

Do not manually join paths with `/` when `path.join()` is clearer.

Do not use the low-level `http` module and expect a full web framework.

Do not choose a package before checking built-in modules.

## Summary

Node.js ships with many built-in modules.

The most important early ones are `path`, `url`, `fs`, `events`, and `http`.

Use built-in modules when they fit the job, and reach for npm packages when they clearly save meaningful work.
