# Nginx as a Reverse Proxy

## Why It Matters

A reverse proxy sits in front of backend services and forwards client requests to them. Nginx is commonly used for this because it is fast, mature, and good at handling many connections.

For a Node.js API, Nginx can terminate TLS, forward requests, serve static assets, compress responses, enforce basic limits, normalize headers, and hide internal ports from the public internet.

## Core Concepts

### Forward Proxy vs Reverse Proxy

A forward proxy represents clients. A reverse proxy represents servers.

Clients send requests to Nginx. Nginx forwards those requests to one or more Node processes. The client does not need to know which backend instance handled the request.

### Header Forwarding

Backend apps often need original request details:

- Original host.
- Original client IP.
- Original protocol, especially whether the user used HTTPS.
- Request ID for tracing.

Nginx should forward these details explicitly.

### TLS Termination

Nginx often handles HTTPS certificates and forwards plain HTTP to Node on a private network. This keeps TLS configuration out of the Node app and centralizes certificate renewal.

### Static Assets

Nginx can serve static files directly, which avoids waking the Node process for images, CSS, and browser bundles. Dynamic API requests still go to Node.

## Syntax/Examples

### Express App Behind a Proxy

```js
import express from 'express';

const app = express();

// Trust proxy headers from a known reverse proxy. Do not enable blindly on untrusted networks.
app.set('trust proxy', true);

app.get('/api/whoami', (req, res) => {
  res.json({
    ip: req.ip,
    protocol: req.protocol,
    host: req.get('host'),
    forwardedFor: req.get('x-forwarded-for') ?? null
  });
});

app.listen(3000, () => {
  console.log('api listening on 3000');
});
```

`trust proxy` tells Express to respect proxy headers. In production, configure it only when Nginx is trusted and direct public access to Node is blocked.

### Basic Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name api.example.com;

    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Important details:

- `proxy_pass` points to the Node backend.
- `Host` preserves the original host.
- `X-Forwarded-For` appends the client IP chain.
- `X-Forwarded-Proto` tells Node whether the client used HTTP or HTTPS.

### Static and API Split

```nginx
server {
    listen 80;
    server_name example.com;

    root /var/www/app;

    location /assets/ {
        try_files $uri =404;
        expires 7d;
        add_header Cache-Control "public";
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Nginx serves assets, Node handles API behavior.

## Use Cases

Use Nginx as a reverse proxy when you need:

- A public entry point for one or more Node apps.
- TLS termination and certificate management.
- Static file serving.
- Request size limits before traffic reaches Node.
- Compression or caching at the edge of the app server.
- Routing by domain or path.

## Tradeoffs

Nginx adds another layer to configure and monitor. Incorrect proxy settings can break redirects, cookies, WebSockets, client IP logging, and HTTPS detection.

It is also easy to hide application problems behind proxy tweaks. If Node is slow because of database queries, increasing Nginx timeouts only delays failure.

## Common Mistakes

- Forgetting `proxy_http_version 1.1` and upgrade headers for WebSockets.
- Enabling `app.set('trust proxy', true)` when users can connect directly to Node.
- Not setting request body limits, allowing large uploads to consume resources.
- Missing `X-Forwarded-Proto`, causing secure cookie and redirect bugs.
- Assuming Nginx health means the Node app is healthy.

## Practical Challenge

Run an Express server on port 3000 and configure Nginx to expose it on port 80 under `/api`. Add a route that returns `req.ip` and `req.protocol`. Confirm the values change correctly when proxy headers and `trust proxy` are configured.

## Recap

Nginx as a reverse proxy gives Node apps a strong production front door. It forwards requests, preserves client context through headers, can serve static files, and often handles TLS. Correct header and trust configuration is essential for secure backend behavior.

