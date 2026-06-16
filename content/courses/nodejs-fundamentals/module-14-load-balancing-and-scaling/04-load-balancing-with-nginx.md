# Load Balancing with Nginx

## Why It Matters

Nginx can reverse proxy to a single Node process, but its real scaling value appears when it distributes traffic across multiple processes or machines. This lets a Node API use more CPU cores, survive individual process crashes, and support rolling restarts.

Nginx load balancing is a practical step between a single-process app and a larger orchestration platform.

## Core Concepts

### Upstream Blocks

An `upstream` block names a group of backend servers. A `proxy_pass` directive can then target the group.

```nginx
upstream node_api {
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
    server 127.0.0.1:3003;
}
```

### Load Balancing Methods

Nginx uses round robin by default. Other useful options include:

```nginx
upstream node_api {
    least_conn;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
}
```

`least_conn` can help when requests have uneven duration.

```nginx
upstream node_api {
    ip_hash;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
}
```

`ip_hash` sends the same client IP to the same backend when possible. Use it carefully because it can create uneven load and can hide session state problems.

### Failure Handling

Nginx can temporarily stop sending traffic to a backend after failures:

```nginx
upstream node_api {
    server 127.0.0.1:3001 max_fails=3 fail_timeout=10s;
    server 127.0.0.1:3002 max_fails=3 fail_timeout=10s;
}
```

Open source Nginx checks failures mostly while proxying real traffic. Dedicated active health checks require Nginx Plus or external tooling.

## Syntax/Examples

### Full Local Load Balancer Configuration

```nginx
upstream node_api {
    least_conn;
    server 127.0.0.1:3001 max_fails=3 fail_timeout=10s;
    server 127.0.0.1:3002 max_fails=3 fail_timeout=10s;
    server 127.0.0.1:3003 max_fails=3 fail_timeout=10s;
}

server {
    listen 8080;
    server_name localhost;

    location / {
        proxy_pass http://node_api;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_connect_timeout 2s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
}
```

### Backend That Shows Distribution

```js
import express from 'express';

const app = express();
const port = Number(process.env.PORT);

app.get('/', (req, res) => {
  res.json({ servedBy: port, pid: process.pid });
});

app.listen(port, () => {
  console.log(`backend ready on ${port}`);
});
```

Run several processes, then call Nginx repeatedly:

```bash
PORT=3001 node server.js
PORT=3002 node server.js
PORT=3003 node server.js
curl http://localhost:8080/
```

You should see different `servedBy` values over repeated calls.

## Use Cases

Nginx load balancing is useful for:

- Multiple Node processes on one VM.
- Several app servers behind one public endpoint.
- Blue-green or canary deployments with weighted servers.
- Gradual migration from one backend to another.

Weighted example:

```nginx
upstream node_api {
    server 127.0.0.1:3001 weight=9;
    server 127.0.0.1:3002 weight=1;
}
```

This sends roughly 90 percent of traffic to one backend and 10 percent to another.

## Tradeoffs

Nginx is powerful, but it does not know your business semantics. Retrying a failed `GET` is usually safe. Retrying a `POST /payments` can duplicate side effects unless the application uses idempotency keys.

Load balancing also changes how you think about logs. One request can hit any instance, so request IDs and centralized logging become important.

## Common Mistakes

- Using local memory sessions with round robin load balancing.
- Not setting proxy timeouts, leading to confusing default behavior.
- Retrying unsafe methods without idempotency protection.
- Forgetting WebSocket upgrade headers for real-time APIs.
- Running all upstreams on the same overloaded machine and expecting high availability.

## Practical Challenge

Configure three local Node instances behind an Nginx upstream. Change from round robin to `least_conn` and add one route that sleeps for two seconds before responding. Send concurrent requests and observe how distribution changes.

## Recap

Nginx load balancing uses upstream pools to distribute traffic across Node instances. Choose algorithms based on request behavior, configure timeouts intentionally, and keep application instances stateless so any backend can serve any request.

