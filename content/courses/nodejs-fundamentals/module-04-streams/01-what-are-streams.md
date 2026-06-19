# What are Streams?

## Why It Matters

Streams let Node.js process data piece by piece instead of loading everything into memory. They are central to files, HTTP requests and responses, compression, sockets, command line pipelines, and large data processing.

If `readFile` is like receiving a whole book before reading it, a stream is like reading one page at a time.

## Core Concepts

A stream is an object that handles data over time. Node.js has several stream types:

- Readable streams produce data.
- Writable streams consume data.
- Duplex streams can both read and write.
- Transform streams modify data as it passes through.

Examples:

- `fs.createReadStream()` is readable.
- `fs.createWriteStream()` is writable.
- TCP sockets are duplex.
- gzip streams are transform streams.

## Syntax and Examples

### Copying with streams

```js
import { createReadStream, createWriteStream } from 'node:fs';

const source = createReadStream('input.log');
const destination = createWriteStream('output.log');

source.pipe(destination);
```

This copies data without putting the whole file in memory.

### Processing chunks

```js
import { createReadStream } from 'node:fs';

const stream = createReadStream('input.txt', { encoding: 'utf8' });

stream.on('data', (chunk) => {
  console.log('Received chunk:', chunk.length);
});

stream.on('end', () => {
  console.log('Finished');
});

stream.on('error', (error) => {
  console.error('Stream failed:', error);
});
```

Events are useful, but modern code often prefers `pipeline()` for error handling and cleanup.

## Mental Model

Streams are about flow:

1. A source produces chunks.
2. Optional transforms modify chunks.
3. A destination consumes chunks.
4. Backpressure slows the source when the destination cannot keep up.

Good stream code respects the speed of the slowest part of the pipeline.

## Use Cases

Use streams for:

- Large files
- Uploads and downloads
- Compression
- CSV or log processing
- Proxying HTTP responses
- Real-time data feeds

Use simpler APIs for:

- Tiny config files
- Small JSON documents
- One-off scripts where memory is not a concern

## Common Mistakes

- Reading large files with `readFile` and running out of memory.
- Handling only `data` and `end` but not `error`.
- Assuming chunk boundaries match lines, JSON objects, or protocol messages.
- Ignoring backpressure.
- Mixing stream modes accidentally.

## Practical Challenge

Write a script that copies a large file using `readFile` and another using streams. Compare memory usage with `process.memoryUsage()`.

## Recap

Streams process data over time. They are the right tool when data is large, continuous, or naturally chunked. The key skills are handling errors, respecting backpressure, and choosing the right stream type.
