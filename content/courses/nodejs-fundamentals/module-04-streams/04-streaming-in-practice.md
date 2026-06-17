# Streaming in Practice

## Why It Matters

Streams become valuable when they solve real constraints: memory limits, slow clients, large uploads, compressed responses, and long-running imports. Practical stream code is less about clever APIs and more about making data movement predictable and safe.

## Core Concepts

A practical stream design answers:

- Where does data come from?
- Can chunks be processed independently?
- What happens when the destination is slow?
- How are errors reported?
- What resource cleanup is required?

## Syntax and Examples

### Streaming a large file download

```js
import http from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';

http
  .createServer(async (request, response) => {
    try {
      const file = 'video.mp4';
      const info = await stat(file);

      response.writeHead(200, {
        'content-type': 'video/mp4',
        'content-length': info.size,
      });

      createReadStream(file).pipe(response);
    } catch {
      response.writeHead(404);
      response.end('Not found');
    }
  })
  .listen(3000);
```

This sends data as it is read. For production, also handle stream errors and client disconnects carefully.

### Processing line-oriented data

Chunk boundaries do not equal line boundaries. Use `node:readline` for line-based streams:

```js
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

const lines = createInterface({
  input: createReadStream('access.log'),
  crlfDelay: Infinity,
});

let count = 0;

for await (const line of lines) {
  if (line.includes('ERROR')) count += 1;
}

console.log(`Errors: ${count}`);
```

## Use Cases

Streams are practical for:

- Importing CSV files row by row
- Forwarding uploads to object storage
- Sending large downloads
- Compressing logs
- Reading standard input in CLIs
- Proxying API responses

## Tradeoffs

Streams add complexity. For small data, `readFile`, `JSON.parse`, and normal arrays may be clearer. Use streams when size, latency, or continuous flow justify the extra lifecycle and error handling.

## Common Mistakes

- Parsing full JSON documents with naive chunk handling.
- Not handling client disconnects during upload or download.
- Forgetting to set response headers before piping.
- Logging every chunk in production and slowing the pipeline.
- Assuming a stream pipeline succeeded before awaiting completion.

## Practical Challenge

Build `count-errors.mjs` that accepts a log file and counts lines containing `ERROR`, `WARN`, and `INFO` using `node:readline`. Make sure it can handle files larger than available memory.

## Recap

Practical streaming is about matching the data shape to the processing model. Use streams for large or continuous data, handle errors and disconnects, and use higher-level helpers such as `readline` when chunks are not the unit you care about.
