# Backpressure

## Why It Matters

Backpressure is what prevents a fast source from overwhelming a slow destination. Without it, a Node.js process can consume too much memory, slow down, or crash while buffering data that cannot be written yet.

Streams are valuable because they include backpressure mechanisms. Good stream code lets those mechanisms work.

## Core Concepts

When you call `writable.write(chunk)`, it returns a boolean:

- `true` means the writable can accept more data now.
- `false` means its internal buffer is full enough that you should wait for `drain`.

```js
import { once } from 'node:events';
import { createWriteStream } from 'node:fs';

const writable = createWriteStream('numbers.txt');

for (let i = 0; i < 1_000_000; i += 1) {
  const canContinue = writable.write(`${i}\n`);

  if (!canContinue) {
    await once(writable, 'drain');
  }
}

writable.end();
```

Ignoring the return value can create unbounded buffering.

## Syntax and Examples

### pipe handles backpressure

```js
import { createReadStream, createWriteStream } from 'node:fs';

createReadStream('large-input.txt').pipe(createWriteStream('large-output.txt'));
```

`pipe()` pauses and resumes the readable stream based on writable pressure.

### pipeline is safer

```js
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';

await pipeline(
  createReadStream('large-input.txt'),
  createWriteStream('large-output.txt'),
);
```

`pipeline()` adds better error and cleanup behavior.

## Use Cases

Backpressure matters in:

- Large file copies
- HTTP downloads to slow clients
- Upload forwarding
- Database exports
- Log processing
- Message queue consumers

It is less visible with small files but becomes critical under load.

## Common Mistakes

- Manually writing chunks and ignoring `write()` returning `false`.
- Collecting all chunks into an array before processing.
- Using `data` event handlers that do async work without pausing or limiting.
- Treating memory growth as unavoidable instead of a flow-control bug.
- Starting too many independent streams at once.

## Practical Challenge

Write a script that writes one million lines to a file. First ignore the `write()` return value. Then update it to wait for `drain`. Compare memory usage with `process.memoryUsage().rss`.

## Recap

Backpressure is flow control. Let `pipe()` or `pipeline()` manage it when possible. When writing manually, respect `write()` returning `false` and wait for `drain`.
