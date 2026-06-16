# WebSockets vs Server-Sent Events

## Why It Matters

Real-time features are not all the same. Choosing between WebSockets and SSE affects infrastructure, scaling, client code, security, and reliability.

## Core Concepts

- SSE is one-way server-to-client streaming over HTTP.
- WebSockets provide full-duplex communication over a long-lived upgraded connection.
- SSE has browser reconnection built in through `EventSource`.
- WebSockets are better for low-latency two-way interactions.
- Both require connection lifecycle tracking, authorization, and capacity planning.

## Flow to Remember

SSE keeps an HTTP response open and sends event frames. WebSockets upgrade the HTTP connection and then both client and server exchange messages over the socket.

## Syntax and Examples

```js
import express from 'express';

const app = express();

app.get('/notifications', (req, res) => {
  res.set({ 'content-type': 'text/event-stream', 'cache-control': 'no-cache' });
  res.write(`data: ${JSON.stringify({ message: 'connected' })}\n\n`);
  const timer = setInterval(() => res.write(`data: ${JSON.stringify({ unread: 3 })}\n\n`), 10000);
  req.on('close', () => clearInterval(timer));
});

app.listen(3000);
```

## Use Cases and Tradeoffs

- Use SSE for notifications, dashboards, build progress, and read-only event feeds.
- Use WebSockets for chat, multiplayer, collaborative editing, live cursors, and bidirectional device control.
- Use normal REST endpoints for actions even when live updates are delivered by SSE.
- Use a message broker or pub/sub layer when multiple server instances need to broadcast events.

## Common Mistakes

- Choosing WebSockets because the feature is "real time" even though the client never sends messages.
- Ignoring load balancer idle timeouts.
- Keeping per-connection state only in memory when the app scales horizontally.
- Forgetting to reauthorize long-lived connections when user permissions change.

## Practical Challenge

For a customer support app, decide which features use REST, SSE, and WebSockets: ticket creation, agent typing indicators, new ticket alerts, and dashboard counts.

## Recap

- SSE is simpler for server-to-client updates.
- WebSockets fit bidirectional, low-latency interactions.
- Both choices have operational consequences.

