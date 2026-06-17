# Graceful Shutdown

## Why It Matters

Servers do not only stop when developers press Ctrl+C. Deployments, autoscaling, crashes, and host maintenance all stop processes. Graceful shutdown lets an app stop accepting new work, finish in-flight requests, close resources, and exit cleanly.

## Core Concepts

- `SIGTERM` is the normal production shutdown signal.
- `SIGINT` commonly comes from Ctrl+C locally.
- Stop accepting new connections before closing databases and queues.
- Use a timeout so shutdown cannot hang forever.
- Readiness checks should fail before the process exits so load balancers stop sending traffic.

## Flow to Remember

The process receives a signal, marks itself not ready, closes the HTTP server, waits for in-flight work, closes pools and clients, then exits.

## Syntax and Examples

```js
import express from 'express';
import { createServer } from 'node:http';

const app = express();
let ready = true;

app.get('/ready', (req, res) => {
  res.status(ready ? 200 : 503).json({ ready });
});

const server = createServer(app);
server.listen(3000);

async function shutdown(signal) {
  console.log(`Received ${signal}`);
  ready = false;

  const timeout = setTimeout(() => process.exit(1), 10_000);
  server.close(async () => {
    clearTimeout(timeout);
    // await pool.end();
    process.exit(0);
  });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
```

## Use Cases and Tradeoffs

- Use graceful shutdown for APIs, workers, schedulers, and websocket/SSE services.
- Close database pools, message brokers, telemetry exporters, and file handles.
- Stop background job polling before closing shared clients.
- Coordinate shutdown timeouts with orchestrator grace periods.

## Common Mistakes

- Calling `process.exit()` immediately on `SIGTERM`.
- Closing the database before HTTP requests finish.
- Leaving SSE or WebSocket clients open forever.
- Using a shutdown timeout longer than the platform grace period.

## Practical Challenge

Add graceful shutdown to an Express app with a PostgreSQL pool. Make `/ready` return `503` after shutdown starts and close the pool after the server closes.

## Recap

- Graceful shutdown protects in-flight work.
- Shutdown has an order: stop traffic, finish work, close resources.
- Always include a timeout.

