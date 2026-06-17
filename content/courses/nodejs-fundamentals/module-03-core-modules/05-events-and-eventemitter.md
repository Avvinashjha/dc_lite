# Events and EventEmitter

## Why It Matters

Many Node.js APIs are event-driven. Streams emit `data`, `end`, and `error`. Servers emit connection events. Processes emit lifecycle events. Understanding `EventEmitter` helps you read Node.js code and design small event-based abstractions.

## Core Concepts

`EventEmitter` lets an object publish named events and lets listeners subscribe.

```js
import { EventEmitter } from 'node:events';

const bus = new EventEmitter();

bus.on('user:created', (user) => {
  console.log('Created user', user.id);
});

bus.emit('user:created', { id: 123 });
```

Listeners run synchronously when `emit` is called. If a listener is slow, `emit` is slow.

## Syntax and Examples

### once

Use `once` when a listener should run only the first time:

```js
bus.once('ready', () => {
  console.log('Ready only once');
});
```

### Removing listeners

```js
function onMessage(message) {
  console.log(message);
}

bus.on('message', onMessage);
bus.off('message', onMessage);
```

Remove listeners when they are tied to a request, socket, UI session, or other lifecycle. Otherwise long-lived emitters can retain memory.

### Error events

`error` is special. If an emitter emits `error` and nobody listens, Node.js throws.

```js
bus.on('error', (error) => {
  console.error('Emitter failed:', error);
});

bus.emit('error', new Error('Something broke'));
```

## Use Cases

Use events when:

- One producer has multiple independent listeners.
- You are modeling lifecycle events.
- You are integrating with Node.js stream or server APIs.
- You want loose coupling inside a small boundary.

Avoid events when:

- A direct function call is clearer.
- The order of operations is critical and hard to trace.
- You need request-response behavior.
- Errors need structured propagation across layers.

## Common Mistakes

- Forgetting `error` listeners.
- Assuming listeners run asynchronously.
- Creating hidden control flow that is hard to follow.
- Adding listeners repeatedly without removing them.
- Using a global event bus for unrelated application behavior.

## Practical Challenge

Create a `JobRunner` class that extends `EventEmitter`. It should emit:

- `start` before work begins
- `success` with a result
- `failure` with an error
- `finish` in all cases

Then attach listeners and run a successful and failing job.

## Recap

`EventEmitter` is a small but important Node.js primitive. Events are useful for lifecycle notifications and stream-like APIs, but listeners run synchronously and must be managed carefully.
