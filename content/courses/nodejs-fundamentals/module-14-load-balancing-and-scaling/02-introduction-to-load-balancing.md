# Introduction to Load Balancing

## Why It Matters

Load balancing distributes incoming traffic across multiple backend instances. Without it, horizontal scaling is just several servers with no reliable way for users to reach them.

For Node.js APIs, load balancing helps with capacity, availability, deployments, and fault isolation. If one instance crashes, the load balancer can stop sending traffic to it. If traffic grows, new instances can join the pool.

## Core Concepts

### Backend Pool

A backend pool is the set of application instances that can handle traffic. They may run on different ports on one machine, different virtual machines, containers, or Kubernetes pods.

### Health Checks

A load balancer should know whether an instance is healthy. Health checks usually call an endpoint such as `/health` or `/ready`.

A basic liveness endpoint says the process is running. A readiness endpoint says the process is ready to serve traffic, which may require database connectivity, migrations completed, and configuration loaded.

### Algorithms

Common load balancing algorithms include:

- Round robin: send each new request to the next backend in order.
- Least connections: send traffic to the backend with the fewest active connections.
- IP hash: consistently route the same client IP to the same backend.
- Weighted routing: send more traffic to stronger or newer instances.

Round robin is simple and common for stateless HTTP APIs. Sticky routing should be used only when needed because it can hide statefulness problems.

### Layer 4 vs Layer 7

Layer 4 load balancing works at TCP or UDP level. It is fast and does not inspect HTTP details.

Layer 7 load balancing understands HTTP. It can route by host, path, header, cookie, or method. Nginx reverse proxying for HTTP APIs is usually Layer 7 behavior.

## Syntax/Examples

### Minimal Backend Instances

```js
import express from 'express';

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', port, pid: process.pid });
});

app.get('/api/time', (req, res) => {
  res.json({ now: new Date().toISOString(), servedBy: port });
});

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
```

Run three instances:

```bash
PORT=3001 node server.js
PORT=3002 node server.js
PORT=3003 node server.js
```

A load balancer can now treat these as an upstream pool.

### Conceptual Nginx Upstream

```nginx
upstream node_api {
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
    server 127.0.0.1:3003;
}

server {
    listen 80;

    location /api/ {
        proxy_pass http://node_api;
    }
}
```

With round robin, requests rotate through the upstream servers.

## Use Cases

Load balancing is used for:

- Scaling API traffic across instances.
- Keeping service available during process crashes.
- Rolling deployments without taking all instances down at once.
- Routing different domains or paths to different services.
- Separating public traffic from internal services.

## Tradeoffs

Load balancing improves availability but does not make the backend automatically reliable. If every instance depends on the same failing database, all instances can still fail. If all instances run on one machine, machine failure still takes the service down.

Load balancers also need good timeout settings. If proxy timeouts are too short, slow but valid requests fail. If timeouts are too long, dead connections consume resources.

## Common Mistakes

- Treating `/health` as healthy even when the app cannot reach required dependencies.
- Using sticky sessions to avoid fixing local session storage.
- Forgetting to forward important headers such as `Host`, `X-Forwarded-For`, and `X-Forwarded-Proto`.
- Sending traffic to instances before they finish startup.
- Letting load balancer retries duplicate non-idempotent requests.

## Practical Challenge

Create three local Node instances that return their port. Configure a load balancer in front of them. Refresh the endpoint several times and record which instance responds. Then stop one instance and confirm traffic continues to the others.

## Recap

Load balancing is the traffic distribution layer that makes horizontal scaling usable. It relies on backend pools, health checks, algorithms, and correct proxy behavior. For Node APIs, it works best when instances are stateless and dependencies are shared safely.

