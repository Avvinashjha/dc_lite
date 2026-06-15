# Real-Time with WebSockets

WebSockets let the browser and server keep a long-lived two-way connection.

They are useful when the server needs to push updates without waiting for the client to poll.

## When to Use WebSockets

Good fits:

- chat
- multiplayer or collaboration
- live notifications
- dashboards with frequent updates
- presence indicators
- trading or monitoring screens

Poor fits:

- data that changes rarely
- simple form submission
- pages where polling every few minutes is enough
- one-off file downloads

WebSockets add operational complexity, so use them when real-time behavior matters.

## Basic Connection

```jsx
useEffect(() => {
  const socket = new WebSocket("wss://example.com/realtime");

  socket.addEventListener("open", () => {
    socket.send(JSON.stringify({ type: "subscribe", channel: "orders" }));
  });

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    handleRealtimeMessage(message);
  });

  return () => {
    socket.close();
  };
}, []);
```

Always close the connection when the component or subscription owner unmounts.

## Connection Ownership

Do not open a new WebSocket in every small component.

Prefer one connection owned by:

- an app-level provider
- a feature-level provider
- a real-time service module
- a data client

```text
RealtimeProvider
  -> opens socket once
  -> manages subscriptions
  -> updates shared state
  -> components read derived data
```

This avoids duplicate connections and conflicting message handlers.

## Reconnection

Networks fail. Laptops sleep. Mobile devices switch networks.

Plan for reconnection:

- detect close events
- retry with backoff
- avoid retry storms
- resubscribe after reconnecting
- show connection status
- handle missed messages

```text
connected
  -> disconnected
  -> wait 1s
  -> retry
  -> wait 2s
  -> retry
  -> wait 4s
```

Backoff protects both your server and the user's battery.

## Message Ordering and Missed Events

WebSocket messages can arrive while local state is changing.

Use server-generated IDs or sequence numbers when ordering matters.

```json
{
  "type": "order.updated",
  "orderId": "o1",
  "version": 17
}
```

If the client reconnects after being offline, it may need to refetch current state instead of trusting missed events.

## Authentication

WebSocket authentication depends on backend design.

Options include:

- cookie-based session during the handshake
- short-lived token in a protocol-specific auth message
- signed connection URL

Do not put long-lived secrets in URLs. URLs can appear in logs.

## React State Updates

Realtime messages can be frequent. Avoid re-rendering the whole app for every tiny event.

Consider:

- normalizing data by id
- batching state updates
- using selectors
- throttling visual updates
- showing summary counts instead of every event
- virtualizing long live lists

## WebSockets vs Server-Sent Events

Server-Sent Events are one-way: server to browser.

They can be simpler for notifications or live feeds where the client does not need to send frequent messages.

```text
SSE: server pushes updates
WebSocket: server and client both send messages
```

Choose the simpler tool that fits the interaction.

## Common Mistakes

- Opening one socket per component instance.
- Forgetting to close sockets or unsubscribe.
- Reconnecting immediately in a tight loop.
- Assuming no messages are missed during disconnects.
- Trusting client-sent messages without server authorization.
- Updating large React trees on every high-frequency message.

:::quiz
question: What should a client usually do after reconnecting to a WebSocket feed?
options:
  - Resubscribe and reconcile or refetch state that may have changed while offline
  - Assume no messages were missed
  - Create a new socket every render
  - Disable authentication for the new connection
answer: 0
explanation: Disconnects can cause missed events. The client should resubscribe and recover current state safely.
:::

## Practical Challenge

Design a live notifications system.

Specify:

- who owns the socket connection
- how authentication works
- how subscriptions are represented
- how reconnection works
- how missed notifications are recovered
- how the UI avoids excessive re-renders

## Recap

WebSockets are powerful for real-time two-way updates, but they require careful connection ownership, cleanup, reconnection, ordering, and authorization.

Use them when real-time interaction is worth the complexity.
