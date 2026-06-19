# Blocking vs Non-blocking I/O

## Why It Matters

I/O means input and output: reading files, writing responses, calling APIs, querying databases, and accepting socket data. Node.js is useful because it can wait on many I/O operations without dedicating a JavaScript thread to each one.

Blocking I/O makes the current thread wait. Non-blocking I/O starts the operation and lets the runtime continue.

## Core Concepts

### Blocking file read

```js
import { readFileSync } from 'node:fs';

const data = readFileSync('large-file.txt', 'utf8');
console.log(data.length);
```

This is easy to understand, but while `readFileSync` runs, no other JavaScript can run in the process.

### Non-blocking file read

```js
import { readFile } from 'node:fs/promises';

const data = await readFile('large-file.txt', 'utf8');
console.log(data.length);
```

The async function pauses, but the process can continue handling other ready events.

### Blocking in servers

This server has a hidden scalability problem:

```js
import http from 'node:http';
import { readFileSync } from 'node:fs';

http
  .createServer((request, response) => {
    const page = readFileSync('index.html', 'utf8');
    response.end(page);
  })
  .listen(3000);
```

Each request blocks the event loop while the file is read. Use async I/O or cache startup data instead:

```js
import http from 'node:http';
import { readFile } from 'node:fs/promises';

http
  .createServer(async (request, response) => {
    try {
      const page = await readFile('index.html', 'utf8');
      response.end(page);
    } catch {
      response.writeHead(500);
      response.end('Server error');
    }
  })
  .listen(3000);
```

## Tradeoffs

Synchronous I/O is not always wrong. It can be acceptable:

- During process startup
- In small one-off scripts
- In test fixtures
- When reading a tiny config file before the server starts listening

Avoid synchronous I/O:

- In HTTP handlers
- In message consumers
- In real-time connection handlers
- In code paths shared by many concurrent users

## Use Cases

Non-blocking I/O helps when many operations are waiting at once:

```js
const results = await Promise.all(
  userIds.map((id) => fetch(`https://api.example.com/users/${id}`)),
);

console.log(`Fetched ${results.length} users`);
```

You still need limits. Starting 50,000 operations at once can overwhelm memory, databases, or remote services. Use queues or concurrency limits for large batches.

## Common Mistakes

- Replacing every sync call with async without thinking about startup simplicity.
- Using `Promise.all` for huge unbounded lists.
- Forgetting that CPU work can block even if all I/O is async.
- Reading entire large files into memory instead of streaming.
- Doing synchronous logging to slow destinations in hot paths.

## Practical Challenge

Build two versions of a file-size server:

- Version A uses `statSync`.
- Version B uses `await stat()` from `node:fs/promises`.

Send several requests with a browser or `curl` and reason about which version can keep the event loop freer under load.

## Recap

Blocking I/O waits on the main thread. Non-blocking I/O lets Node.js continue scheduling other work while the operation is pending. Use sync APIs intentionally, mostly outside hot server paths.
