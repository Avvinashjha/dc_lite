# The File System (fs) Module

## Why It Matters

The `node:fs` module lets Node.js read, write, inspect, watch, and stream files. It powers CLIs, build tools, upload handlers, static file servers, configuration loading, logging, and data processing scripts.

File APIs are also where you first see an important Node.js design choice: many operations exist in callback, promise, synchronous, and stream forms.

## Core Concepts

Prefer promise APIs for modern application code:

```js
import { readFile, writeFile } from 'node:fs/promises';

const text = await readFile('input.txt', 'utf8');
await writeFile('output.txt', text.toUpperCase());
```

Use sync APIs sparingly:

```js
import { readFileSync } from 'node:fs';

const config = JSON.parse(readFileSync('config.json', 'utf8'));
```

This can be fine during startup, before the server begins accepting requests.

## Syntax and Examples

### Checking file metadata

```js
import { stat } from 'node:fs/promises';

const info = await stat('report.csv');

console.log(info.isFile());
console.log(info.size);
console.log(info.mtime);
```

Avoid checking if a file exists and then opening it as two separate steps in critical paths. The file can change between those operations. Try the operation and handle the error.

### Creating directories

```js
import { mkdir } from 'node:fs/promises';

await mkdir('logs/app', { recursive: true });
```

`recursive: true` makes directory creation idempotent.

### Streaming large files

```js
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';

await pipeline(
  createReadStream('large.log'),
  createWriteStream('large-copy.log'),
);
```

For large files, streams avoid loading everything into memory.

## Use Cases

Use `fs` for:

- Reading app configuration
- Writing generated files
- Processing uploads
- Managing cache files
- Serving static assets
- Implementing CLIs
- Building migration or maintenance scripts

## Common Mistakes

- Reading large files with `readFile` when a stream is needed.
- Using sync APIs inside HTTP handlers.
- Ignoring encoding and accidentally working with `Buffer` when you expected text.
- Building paths by string concatenation instead of using `node:path`.
- Treating file system operations as safe just because they are local. User-controlled paths can cause traversal vulnerabilities.

## Practical Challenge

Write `copy-uppercase.mjs` that:

1. Reads an input file path from `process.argv`.
2. Reads the file as UTF-8.
3. Writes an uppercase copy beside it.
4. Handles missing arguments and file errors cleanly.

Then rewrite it using streams for a large file scenario.

## Recap

`node:fs` gives Node.js direct file system access. Use promise APIs for most modern code, sync APIs only in controlled places, and streams for large data. Treat paths and file sizes as part of your design, not afterthoughts.
