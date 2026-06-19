# Worker Threads and Child Processes

## Why It Matters

Async I/O keeps Node.js responsive while waiting, but it does not make CPU-heavy JavaScript run in parallel. If your code compresses large files, hashes large inputs, resizes images, parses huge JSON payloads, or runs expensive calculations on the main thread, it can block every other request.

Worker threads and child processes are two ways to move work away from the main event loop.

## Core Concepts

### Worker threads

Worker threads run JavaScript in separate threads within the same process. They are useful for CPU-heavy tasks that need parallel execution but still belong inside the same application.

```js
// worker.mjs
import { parentPort, workerData } from 'node:worker_threads';

function fib(n) {
  return n < 2 ? n : fib(n - 1) + fib(n - 2);
}

parentPort.postMessage(fib(workerData.n));
```

```js
// main.mjs
import { Worker } from 'node:worker_threads';

function runWorker(n) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./worker.mjs', import.meta.url), {
      workerData: { n },
    });

    worker.once('message', resolve);
    worker.once('error', reject);
    worker.once('exit', (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with ${code}`));
    });
  });
}

console.log(await runWorker(40));
```

Workers communicate by messages. Data is cloned by default, though transferable objects and shared memory exist for advanced cases.

### Child processes

Child processes run separate operating system processes. They are useful when you need isolation, want to execute another program, or need separate memory and process lifecycle.

```js
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const { stdout } = await execFileAsync('node', ['--version']);
console.log(stdout.trim());
```

Prefer `execFile` or `spawn` over `exec` when passing user-influenced arguments. `exec` runs through a shell and increases command injection risk.

## Worker Threads vs Child Processes

Use worker threads when:

- The work is CPU-bound JavaScript.
- You want lower overhead than a process.
- Shared memory or transferable buffers may help.
- The task is part of the same application trust boundary.

Use child processes when:

- You need stronger isolation.
- You are running external commands.
- The task may crash or leak memory independently.
- Different runtime flags or executables are needed.

## Use Cases

Common worker-thread tasks:

- CPU-heavy validation
- Large JSON transformation
- Compression or decompression
- Hashing many files
- Image processing through libraries

Common child-process tasks:

- Running Git, ffmpeg, or system tools
- Sandboxing untrusted-ish work with stricter boundaries
- Separating a long-running helper service
- Running scripts in another language

## Common Mistakes

- Using workers for ordinary database or HTTP calls. Async I/O is already suited for that.
- Creating one worker per request without limits.
- Forgetting to handle `error` and `exit`.
- Sending huge data copies to workers and losing the performance benefit.
- Passing unsanitized user input to shell commands.

## Practical Challenge

Create a server with two endpoints:

- `/block` calculates Fibonacci on the main thread.
- `/worker` calculates the same value in a worker thread.

Open multiple browser tabs or use repeated `curl` calls. Observe which endpoint keeps the server more responsive.

## Recap

Async I/O solves waiting, not CPU parallelism. Worker threads move CPU-heavy JavaScript off the main event loop. Child processes provide stronger isolation and are the right tool for external commands. Both need lifecycle handling and concurrency limits.
