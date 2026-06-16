# Clustering and PM2

## Why It Matters

A single Node.js process runs JavaScript on one main thread. On a multi-core server, one process cannot fully use all CPU cores for JavaScript work. Clustering runs multiple Node processes so the app can handle more concurrent work on the same machine.

PM2 is a process manager that can run Node apps in cluster mode, restart crashed processes, manage logs, and help with zero-downtime reloads.

## Core Concepts

### Node Cluster

The built-in `node:cluster` module can start a primary process and multiple worker processes. Workers share the same server port, and incoming connections are distributed between them.

```js
import cluster from 'node:cluster';
import os from 'node:os';
import express from 'express';

if (cluster.isPrimary) {
  const workerCount = os.availableParallelism();

  for (let index = 0; index < workerCount; index += 1) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(`worker ${worker.process.pid} exited, starting another`);
    cluster.fork();
  });
} else {
  const app = express();

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', pid: process.pid });
  });

  app.listen(3000, () => {
    console.log(`worker ${process.pid} listening`);
  });
}
```

This is useful for learning, but many teams use process managers or container orchestration instead of writing cluster code manually.

### PM2 Cluster Mode

PM2 can run multiple instances without application-level cluster code:

```bash
pm2 start server.js -i max --name node-api
pm2 status
pm2 logs node-api
```

`-i max` starts one process per available CPU core. You can also specify a number:

```bash
pm2 start server.js -i 4 --name node-api
```

### Process Management Responsibilities

A process manager helps with:

- Restarting crashed workers.
- Keeping logs available.
- Running multiple app instances.
- Reloading with reduced downtime.
- Starting apps after machine reboot.

It does not replace good application design. The app still needs health checks, graceful shutdown, externalized state, and safe database connection usage.

## Syntax/Examples

### Graceful Shutdown for Clustered Processes

```js
import http from 'node:http';
import express from 'express';

const app = express();
const server = http.createServer(app);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', pid: process.pid });
});

server.listen(process.env.PORT ?? 3000);

async function shutdown(signal) {
  console.log(`received ${signal}, closing server`);

  server.close((error) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }

    process.exit(0);
  });

  setTimeout(() => {
    console.error('forced shutdown after timeout');
    process.exit(1);
  }, 10_000).unref();
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
```

Graceful shutdown lets existing requests finish when PM2, Docker, Kubernetes, or the OS stops the process.

### PM2 Ecosystem File

```js
export default {
  apps: [
    {
      name: 'node-api',
      script: './server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
```

Run it:

```bash
pm2 start ecosystem.config.js
pm2 reload node-api
```

`reload` attempts a zero-downtime restart by replacing workers gradually.

## Use Cases

Use clustering or PM2 when:

- One machine has multiple CPU cores.
- A single Node process is CPU-saturated.
- You want crash restarts outside the application code.
- You deploy to VMs rather than containers or a platform service.

In container platforms, you may choose one Node process per container and scale containers horizontally instead. That is often simpler in Kubernetes-style environments.

## Tradeoffs

Clustered workers do not share memory. If one worker updates an in-memory cache, other workers do not see it. Use Redis or another shared store for state that must be consistent.

PM2 is operational tooling. It needs startup integration, log rotation, monitoring, and deployment discipline. It can simplify VM deployments, but it should not hide unhealthy application behavior.

## Common Mistakes

- Assuming cluster workers share variables.
- Running scheduled jobs in every worker and duplicating work.
- Opening too many database connections across workers.
- Using PM2 reload without graceful shutdown support.
- Using cluster mode for CPU-heavy work that should be moved to worker threads, queues, or separate services.

## Practical Challenge

Run an Express app with PM2 cluster mode using two instances. Add a route that returns `process.pid`. Call it repeatedly to see different workers respond. Then add graceful shutdown and test `pm2 reload` while sending requests.

## Recap

Clustering lets Node use multiple CPU cores by running multiple processes. PM2 provides practical process management for VM deployments. Treat each worker as a separate instance: keep state external, manage database connections carefully, and implement graceful shutdown for reliable deployments.

