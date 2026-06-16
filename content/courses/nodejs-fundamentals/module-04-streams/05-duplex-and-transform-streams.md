# Duplex and Transform Streams

## Why It Matters

Readable and writable streams are one-way. Duplex and transform streams handle two-way or modifying flows. They are used in sockets, compression, encryption, parsing, and data conversion.

Understanding them helps you build pipelines that do more than copy bytes.

## Core Concepts

A duplex stream is both readable and writable. A transform stream is a special duplex stream where output is related to input.

Examples:

- TCP sockets are duplex.
- gzip streams are transform streams.
- crypto cipher streams are transform streams.
- custom parsers and formatters are often transform streams.

## Syntax and Examples

### Built-in transform

```js
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';

await pipeline(
  createReadStream('input.txt'),
  createGzip(),
  createWriteStream('input.txt.gz'),
);
```

`createGzip()` accepts chunks and emits compressed chunks.

### Custom transform

```js
import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';

const uppercase = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  },
});

await pipeline(
  createReadStream('input.txt'),
  uppercase,
  createWriteStream('output.txt'),
);
```

The callback receives an error as the first argument or transformed data as the second.

### Object mode

Object mode streams pass JavaScript values instead of buffers or strings.

```js
import { Transform } from 'node:stream';

const pickName = new Transform({
  objectMode: true,
  transform(user, encoding, callback) {
    callback(null, user.name);
  },
});
```

Object mode is useful, but each object has overhead. It is not a free replacement for arrays.

## Use Cases

Use transform streams for:

- Compression
- Encryption
- Line splitting
- CSV conversion
- Filtering records
- Mapping data while streaming

Use duplex streams for:

- Network sockets
- Protocol implementations
- Interactive process communication

## Common Mistakes

- Forgetting that transform output may not align one-to-one with input chunks.
- Calling the transform callback more than once.
- Throwing inside `transform` instead of passing errors to the callback.
- Mixing object mode and byte mode accidentally.
- Creating transforms when a simple async iterator would be clearer.

## Practical Challenge

Build a transform stream that prefixes each incoming line with a line number. Then test it by piping a text file through the transform into a new file.

## Recap

Duplex streams read and write. Transform streams read, modify, and write. They are powerful for streaming data conversion, but they require careful error handling and awareness of chunk boundaries.
