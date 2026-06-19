# HTTPS and TLS Basics

## Why It Matters

HTTPS is HTTP over TLS. It protects data in transit, authenticates servers, and is expected for nearly every production web application. Node.js can create HTTPS servers and clients directly, but production TLS is often terminated by a reverse proxy, load balancer, or platform.

You still need to understand the basics because certificate errors, insecure client settings, webhook verification, and local development all depend on TLS concepts.

## Core Concepts

### HTTP vs HTTPS

HTTP sends data without transport encryption. HTTPS wraps the connection in TLS so clients can verify the server certificate and exchange encrypted data.

```js
import https from 'node:https';

https.get('https://example.com', (response) => {
  console.log(response.statusCode);
  response.resume();
});
```

For most client code, modern `fetch` is simpler, but `node:https` exposes lower-level options.

### Certificates

An HTTPS server needs a private key and certificate:

```js
import https from 'node:https';
import { readFileSync } from 'node:fs';

const options = {
  key: readFileSync('localhost-key.pem'),
  cert: readFileSync('localhost-cert.pem'),
};

https
  .createServer(options, (request, response) => {
    response.end('secure hello\n');
  })
  .listen(3443);
```

This is useful for learning and local testing. In production, certificate renewal and TLS policy are usually handled by infrastructure.

## Syntax and Examples

### Making a request with options

```js
import https from 'node:https';

const request = https.request(
  'https://example.com',
  { method: 'GET', timeout: 5000 },
  (response) => {
    console.log(response.statusCode);
    response.on('data', (chunk) => process.stdout.write(chunk));
  },
);

request.on('error', (error) => {
  console.error('Request failed:', error);
});

request.end();
```

Always handle request errors. Network failures are normal operational events.

### Do not disable verification

You may see examples using `rejectUnauthorized: false`. That disables certificate verification and makes HTTPS vulnerable to man-in-the-middle attacks.

Use it only for isolated local experiments, never as a production fix.

## Use Cases

Use HTTPS/TLS knowledge for:

- Local HTTPS development
- Debugging certificate failures
- Connecting to APIs with custom CAs
- Understanding platform TLS termination
- Avoiding insecure client settings
- Explaining why secrets still need careful handling even over HTTPS

## Common Mistakes

- Committing private keys to source control.
- Disabling certificate verification to "fix" a request.
- Running plain HTTP for public production traffic.
- Assuming HTTPS validates the application payload. It protects transport, not business rules.
- Managing certificates manually when the platform can automate renewal.

## Practical Challenge

Create a local HTTPS server using a self-signed certificate. Visit it in a browser and observe the warning. Then explain why the browser distrusts it and what a certificate authority changes in production.

## Recap

HTTPS uses TLS to encrypt transport and authenticate servers. Node.js can serve and request HTTPS directly, but production systems often delegate TLS to infrastructure. Never commit keys or disable verification as a shortcut.
