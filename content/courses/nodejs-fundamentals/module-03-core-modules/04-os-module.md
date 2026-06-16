# The Operating System (os) Module

## Why It Matters

The `node:os` module exposes information about the machine running your program. This is useful for diagnostics, temporary files, platform-specific behavior, worker sizing, and operational logs.

It should not become a dumping ground for environment-specific branching. Use it when runtime facts matter.

## Core Concepts

```js
import os from 'node:os';

console.log(os.platform());
console.log(os.arch());
console.log(os.cpus().length);
console.log(os.totalmem());
console.log(os.freemem());
```

These values describe the host process environment. In containers, reported CPU and memory details may need interpretation because cgroup limits can differ from physical machine capacity.

## Syntax and Examples

### Temporary directories

```js
import os from 'node:os';
import path from 'node:path';
import { mkdtemp } from 'node:fs/promises';

const tempDir = await mkdtemp(path.join(os.tmpdir(), 'my-app-'));
console.log(tempDir);
```

Use OS temp directories for short-lived scratch files. Do not assume temp files are private forever; clean up when possible.

### Platform checks

```js
import os from 'node:os';

if (os.platform() === 'win32') {
  console.log('Windows-specific behavior');
} else {
  console.log('Unix-like behavior');
}
```

Keep platform-specific branches small and isolated. Prefer cross-platform APIs such as `node:path` when possible.

### Worker sizing

```js
import os from 'node:os';

const workerCount = Math.max(1, Math.min(os.availableParallelism?.() ?? os.cpus().length, 4));
console.log(`Starting ${workerCount} workers`);
```

Do not blindly start one worker per CPU in every app. Consider memory, database connections, container limits, and workload shape.

## Use Cases

Use `node:os` for:

- Diagnostic endpoints
- CLI environment reports
- Temporary file locations
- Choosing safe concurrency defaults
- Platform-aware scripts
- Logging host metadata at startup

## Common Mistakes

- Treating `freemem()` as a precise capacity planning tool.
- Hardcoding behavior based on OS when a portable API exists.
- Creating too many workers from CPU count alone.
- Writing temp files and never cleaning them up.
- Logging sensitive host details in public responses.

## Practical Challenge

Create `system-report.mjs` that prints platform, architecture, hostname, uptime, available parallelism, total memory, and temp directory. Format memory in MB for readability.

## Recap

`node:os` gives you runtime host facts. Use it for diagnostics and practical defaults, but be conservative with platform branching and resource assumptions.
