# Pipes and Chaining

## Why It Matters

Piping is how streams become practical. Instead of manually reading chunks and writing them somewhere else, you connect a readable stream to a writable stream. Chaining adds transforms between them.

This mirrors Unix pipelines: one stage produces data, the next stage consumes it.

## Core Concepts

```js
import { createReadStream, createWriteStream } from 'node:fs';

createReadStream('input.txt').pipe(createWriteStream('output.txt'));
```

`pipe()` returns the destination stream, which allows chaining:

```js
source.pipe(transformA).pipe(transformB).pipe(destination);
```

## Syntax and Examples

### Compression pipeline

```js
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';

createReadStream('access.log')
  .pipe(createGzip())
  .pipe(createWriteStream('access.log.gz'));
```

This reads, compresses, and writes in chunks.

### Piping HTTP responses

```js
import http from 'node:http';
import { createReadStream } from 'node:fs';

http
  .createServer((request, response) => {
    response.writeHead(200, { 'content-type': 'text/plain' });
    createReadStream('large.txt').pipe(response);
  })
  .listen(3000);
```

This is better than `readFile` for large files because the response can begin before the whole file is read.

## Error Handling

Plain `pipe()` does not automatically handle every error across a chain. For production code, prefer `pipeline()` from `node:stream/promises`.

```js
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';

await pipeline(
  createReadStream('access.log'),
  createGzip(),
  createWriteStream('access.log.gz'),
);
```

`pipeline()` rejects if any stream fails and helps clean up the chain.

## Use Cases

Use pipes for:

- File copies
- Compression
- Upload forwarding
- Static file responses
- Data import/export jobs
- Streaming API clients

## Common Mistakes

- Using plain `pipe()` and forgetting error handlers.
- Piping a binary stream through text assumptions.
- Trying to parse JSON across arbitrary chunks without a streaming parser.
- Forgetting that `pipe()` starts flowing data.
- Building chains that hide important validation or cleanup.

## Practical Challenge

Create a script that gzips a file using `pipeline()`. Accept input and output paths from `process.argv`, validate them, and print a success message only after the pipeline completes.

## Recap

Pipes connect stream stages. They are concise and memory-efficient, but error handling matters. Prefer `pipeline()` for robust stream chains.
