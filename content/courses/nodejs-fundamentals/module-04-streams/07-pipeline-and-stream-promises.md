# pipeline() and stream/promises

## Why It Matters

Stream error handling is easy to get wrong. A chain can fail in the source, a transform, or the destination. `pipeline()` from `node:stream/promises` gives modern Node.js code an `await`-friendly way to connect streams, propagate errors, and clean up.

## Core Concepts

```js
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';

await pipeline(
  createReadStream('input.txt'),
  createWriteStream('output.txt'),
);
```

If any stream fails, `pipeline()` rejects. If it succeeds, the promise resolves when the pipeline is complete.

## Syntax and Examples

### Compression with error handling

```js
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { createGzip } from 'node:zlib';

try {
  await pipeline(
    createReadStream('server.log'),
    createGzip(),
    createWriteStream('server.log.gz'),
  );

  console.log('Compressed successfully');
} catch (error) {
  console.error('Compression failed:', error);
}
```

This is clearer than attaching `error` handlers to each stream manually.

### Abortable pipeline

```js
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';

const controller = new AbortController();

setTimeout(() => controller.abort(), 5000);

await pipeline(
  createReadStream('huge-input.dat'),
  createWriteStream('huge-output.dat'),
  { signal: controller.signal },
);
```

Abort signals are useful for request cancellation, timeouts, and shutdown.

## Use Cases

Use `pipeline()` when:

- Connecting more than one stream.
- You need one success/failure result.
- You want `try/catch` around stream work.
- Cleanup matters.
- You are writing scripts, workers, or request handlers that await completion.

Plain `pipe()` can still be fine for tiny examples, but `pipeline()` is a better default for production stream chains.

## Common Mistakes

- Starting a pipeline without awaiting it.
- Catching errors too late after a response has already been partially sent.
- Forgetting abort handling for long pipelines.
- Mixing callback `pipeline` and promise `pipeline` imports.
- Assuming `pipeline()` makes invalid parsing logic correct. It handles stream mechanics, not data semantics.

## Practical Challenge

Create `compress.mjs` that accepts input and output paths, gzips the input with `pipeline()`, supports a 10-second timeout with `AbortController`, and prints a clear error message on failure.

## Recap

`pipeline()` is the modern default for robust stream chains. It composes streams, respects backpressure, rejects on failure, and works naturally with `async` and `await`.
