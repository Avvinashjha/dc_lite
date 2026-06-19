# Server-Sent Events (SSE)

## Why It Matters

SSE lets a server push a stream of text events to a browser over plain HTTP. It is useful when clients need live updates but do not need bidirectional messaging.

## Core Concepts

- SSE uses `Content-Type: text/event-stream`.
- The browser `EventSource` API automatically reconnects when the connection drops.
- Events are UTF-8 text frames separated by blank lines.
- `id:` allows clients to resume from the last event ID.
- SSE works well through many HTTP stacks, but long-lived connections affect capacity planning.

## Flow to Remember

The client opens an `EventSource`, Express sets streaming headers, the server writes event frames, and the connection stays open until client or server closes it.

## Syntax and Examples

```js
import express from 'express';

const app = express();

app.get('/events', (req, res) => {
  res.set({
    'content-type': 'text/event-stream',
    'cache-control': 'no-cache',
    connection: 'keep-alive'
  });
  res.flushHeaders?.();

  const timer = setInterval(() => {
    res.write(`event: heartbeat\n`);
    res.write(`data: ${JSON.stringify({ at: new Date().toISOString() })}\n\n`);
  }, 5000);

  req.on('close', () => clearInterval(timer));
});

app.listen(3000);
```

## Use Cases and Tradeoffs

- Use SSE for dashboards, notifications, job progress, build logs, and read-only live feeds.
- Prefer SSE over WebSockets when the server is the only side sending frequent updates.
- Send heartbeats to keep proxies from closing idle connections.
- Track connected clients carefully to avoid memory leaks.

## Common Mistakes

- Forgetting the blank line after each event.
- Buffering responses through middleware or proxies that prevent streaming.
- Opening too many connections per browser or tenant.
- Sending secrets to every connected client instead of authorizing per stream.

## Practical Challenge

Create an SSE endpoint that streams job progress from 0 to 100 percent, then closes the connection. Write a small browser page that listens with `EventSource`.

## Recap

- SSE is one-way server-to-client streaming over HTTP.
- It is simpler than WebSockets for many live update problems.
- Long-lived connections need cleanup, heartbeats, and authorization.

