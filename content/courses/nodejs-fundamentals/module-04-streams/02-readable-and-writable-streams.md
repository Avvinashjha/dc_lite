# Readable and Writable Streams

## Why It Matters

Readable and writable streams are the basic ends of most stream pipelines. A readable stream provides chunks. A writable stream accepts chunks. Understanding these two types makes pipes, transforms, uploads, and downloads much easier to reason about.

## Core Concepts

```js
import { createReadStream, createWriteStream } from 'node:fs';

const readable = createReadStream('source.txt');
const writable = createWriteStream('dest.txt');

readable.pipe(writable);
```

Readable streams can be consumed with events, async iteration, or piping. Writable streams can be written to manually or used as a pipe destination.

## Syntax and Examples

### Async iteration over readable streams

```js
import { createReadStream } from 'node:fs';

const readable = createReadStream('notes.txt', { encoding: 'utf8' });

for await (const chunk of readable) {
  console.log(chunk);
}
```

Async iteration fits well with `async` functions and `try/catch`.

### Writing manually

```js
import { createWriteStream } from 'node:fs';

const writable = createWriteStream('numbers.txt', { encoding: 'utf8' });

for (let i = 1; i <= 5; i += 1) {
  writable.write(`${i}\n`);
}

writable.end();
```

Call `end()` when no more data will be written.

### Handling write completion

```js
import { once } from 'node:events';
import { createWriteStream } from 'node:fs';

const writable = createWriteStream('output.txt');

writable.write('hello\n');
writable.end();

await once(writable, 'finish');
console.log('Write complete');
```

`finish` means all data has been flushed to the writable stream.

## Use Cases

Readable streams appear in:

- File reads
- HTTP request bodies
- HTTP client responses
- Standard input

Writable streams appear in:

- File writes
- HTTP responses
- Standard output
- Compression destinations

## Common Mistakes

- Forgetting to call `end()` on manual writable streams.
- Assuming a chunk is a complete line.
- Ignoring `error` events.
- Writing faster than the destination can handle.
- Using event mode and async iteration on the same stream without understanding the flow mode change.

## Practical Challenge

Write `prefix-lines.mjs` that reads from `process.stdin` and writes each chunk to `process.stdout` with a prefix. Then improve it to handle full lines instead of raw chunks.

## Recap

Readable streams produce chunks and writable streams consume chunks. Use async iteration for readable streams, `end()` writable streams when done, and always think about errors and flow control.
