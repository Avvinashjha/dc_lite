# Scaling: Horizontal vs Vertical

## Why It Matters

A Node.js API that works for ten users may fail for ten thousand users. Scaling is the process of increasing the system's ability to handle traffic, data, and background work without unacceptable latency or downtime.

Scaling is not only about buying bigger machines. It is also about understanding bottlenecks: CPU, memory, database connections, network bandwidth, slow external APIs, lock contention, and inefficient queries.

Node.js is single-threaded for JavaScript execution inside one process, but it is excellent at concurrent I/O. That means scaling decisions should be based on real workload characteristics, not generic rules.

## Core Concepts

### Vertical Scaling

Vertical scaling means giving one server more resources: more CPU, more memory, faster disk, or better network capacity.

Advantages:

- Simple operational model.
- No distributed coordination for application instances.
- Often the fastest first step for small systems.
- Works well when the bottleneck is memory or CPU on one machine.

Limitations:

- Hardware has an upper limit.
- Larger machines can be expensive.
- A single server is still a single failure point unless paired with redundancy.
- Deployments and maintenance may cause downtime if no second instance exists.

### Horizontal Scaling

Horizontal scaling means running more instances of the application and distributing traffic across them.

Advantages:

- Can increase capacity gradually.
- Better fault tolerance when instances run on different machines or zones.
- Supports rolling deployments.
- Matches stateless HTTP APIs well.

Limitations:

- Requires load balancing.
- Requires shared persistence for data that outlives one request.
- Requires careful session, cache, and background job design.
- Observability becomes more important because failures may affect only some instances.

### Statelessness

Horizontal scaling works best when application instances are stateless. Stateless does not mean the application has no data. It means any instance can handle the next request because durable state lives outside the process: database, Redis, object storage, queue, or identity provider.

Avoid storing these only in memory if you plan to scale horizontally:

- Login sessions.
- User carts.
- Rate limit counters.
- WebSocket routing state.
- Long-running job progress.

## Syntax/Examples

### A Simple Node Server Prepared for Multiple Instances

```js
import express from 'express';
import { randomUUID } from 'node:crypto';

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', pid: process.pid });
});

app.get('/request-id', (req, res) => {
  res.json({ requestId: req.headers['x-request-id'] ?? randomUUID() });
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(`api listening on ${port}, pid ${process.pid}`);
});
```

This server has no per-user memory dependency. Several copies can run with different ports:

```bash
PORT=3001 node server.js
PORT=3002 node server.js
PORT=3003 node server.js
```

A reverse proxy or load balancer can then distribute requests.

### Spotting a Scaling Bottleneck

If latency rises, ask where time is spent:

```js
app.use((req, res, next) => {
  const started = performance.now();

  res.on('finish', () => {
    console.log('request timing', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      durationMs: Math.round(performance.now() - started)
    });
  });

  next();
});
```

Simple timing logs do not replace full observability, but they help identify whether requests are slow everywhere or only on specific routes.

## Use Cases

Vertical scaling is often appropriate when:

- You are early in the product lifecycle.
- Operational simplicity matters more than maximum resilience.
- The database or application needs more memory.
- You need a quick capacity increase while designing a better scaling path.

Horizontal scaling is often appropriate when:

- Traffic is growing beyond one instance.
- You need rolling deployments and high availability.
- CPU-bound work blocks one Node process.
- Traffic has spikes that require adding and removing instances.

## Tradeoffs

Scaling the Node process is only one part of scaling the API. If every request makes five slow database queries, adding more app instances may overload the database faster. If every instance opens too many database connections, horizontal scaling can create a new bottleneck.

Always consider shared dependencies:

- Database connection limits.
- Redis memory and throughput.
- External API rate limits.
- Queue consumer concurrency.
- File uploads and object storage bandwidth.

## Common Mistakes

- Scaling app servers before measuring the actual bottleneck.
- Keeping sessions in local memory and then adding multiple instances.
- Assuming Node cluster mode replaces infrastructure-level load balancing.
- Opening a new database connection per request.
- Ignoring graceful shutdown, causing dropped requests during deployments.

## Practical Challenge

Run the same Express server on three ports. Add a `/health` route that returns `pid` and `port`. Put a reverse proxy in front of the three instances and confirm repeated requests are handled by different processes.

## Recap

Vertical scaling makes one machine stronger. Horizontal scaling adds more application instances. Node APIs usually scale horizontally well when they are stateless, use shared persistence, and avoid per-request infrastructure creation. Measure bottlenecks before scaling so the added capacity solves the real problem.

