# Behavioral Patterns (Observer, Strategy)

## Why It Matters

Behavioral patterns describe how parts of a system communicate and choose behavior. Node.js backends are full of decisions and events: which pricing rule applies, which notification channel to use, what should happen after an order is paid, and how errors should flow.

Observer and Strategy are two of the most practical behavioral patterns for backend code. They reduce large conditional blocks and loosen coupling between producers and consumers.

## Core Concepts

### Strategy

Strategy moves interchangeable algorithms behind a common interface. Instead of one function with many branches, each behavior becomes a separate implementation.

A discount example often starts like this:

```js
export function calculateDiscount(user, cart) {
  if (user.plan === 'enterprise') return cart.total * 0.2;
  if (user.plan === 'student') return cart.total * 0.1;
  if (cart.total > 10_000) return cart.total * 0.05;
  return 0;
}
```

This is fine when the rules are small. It becomes harder when each rule has database lookups, audit requirements, or feature flags.

A strategy approach separates the rules:

```js
const discountStrategies = {
  enterprise: {
    calculate(cart) {
      return cart.total * 0.2;
    }
  },
  student: {
    calculate(cart) {
      return cart.total * 0.1;
    }
  },
  default: {
    calculate(cart) {
      return cart.total > 10_000 ? cart.total * 0.05 : 0;
    }
  }
};

export function calculateDiscount({ user, cart }) {
  const strategy = discountStrategies[user.plan] ?? discountStrategies.default;
  return strategy.calculate(cart);
}
```

### Observer

Observer lets one object announce that something happened while other objects react. In Node.js, this often appears as `EventEmitter`, domain events, message queues, or pub/sub systems.

```js
import { EventEmitter } from 'node:events';

export const domainEvents = new EventEmitter();

domainEvents.on('order.created', async (event) => {
  console.log('send confirmation email', event.orderId);
});

domainEvents.on('order.created', async (event) => {
  console.log('update analytics', event.orderId);
});
```

The order service does not need to import email and analytics modules directly.

## Syntax/Examples

### Strategy in an Express Route

```js
import express from 'express';

const exportStrategies = {
  json: {
    contentType: 'application/json',
    serialize(data) {
      return JSON.stringify(data);
    }
  },
  csv: {
    contentType: 'text/csv',
    serialize(data) {
      const rows = data.map((item) => `${item.id},${item.email}`);
      return ['id,email', ...rows].join('\n');
    }
  }
};

const app = express();

app.get('/users/export', async (req, res) => {
  const users = [
    { id: 'u1', email: 'a@example.com' },
    { id: 'u2', email: 'b@example.com' }
  ];

  const format = req.query.format ?? 'json';
  const strategy = exportStrategies[format];

  if (!strategy) {
    return res.status(400).json({ error: 'Unsupported export format' });
  }

  res.type(strategy.contentType).send(strategy.serialize(users));
});
```

Adding XML later does not require rewriting the route. It requires adding another strategy.

### Observer with Safer Event Dispatch

`EventEmitter` does not automatically await async listeners. If async listeners matter, create a small dispatcher.

```js
export function createEventBus() {
  const handlers = new Map();

  return {
    on(eventName, handler) {
      const eventHandlers = handlers.get(eventName) ?? [];
      eventHandlers.push(handler);
      handlers.set(eventName, eventHandlers);
    },

    async emit(eventName, payload) {
      const eventHandlers = handlers.get(eventName) ?? [];
      await Promise.all(eventHandlers.map((handler) => handler(payload)));
    }
  };
}
```

Usage:

```js
const eventBus = createEventBus();

eventBus.on('user.registered', async ({ user }) => {
  await welcomeEmailClient.send({ to: user.email });
});

export function createUserService({ userRepository, eventBus }) {
  return {
    async register(input) {
      const user = await userRepository.create(input);
      await eventBus.emit('user.registered', { user });
      return user;
    }
  };
}
```

This keeps side effects organized. For high-volume or mission-critical events, a durable queue is usually better than in-process events.

## Use Cases

Use Strategy when behavior changes by tenant, plan, provider, file type, pricing model, authorization policy, or feature flag.

Use Observer when a business event should trigger multiple side effects:

- Send an email after registration.
- Update a search index after product changes.
- Create an audit log after permission changes.
- Publish analytics after checkout.
- Invalidate cache after content updates.

## Tradeoffs

Strategy improves extension but may hide control flow if strategies are registered dynamically in many places. Keep registration discoverable.

Observer reduces coupling but can make behavior harder to trace. If an API call creates five events and each event triggers three handlers, debugging requires good logs and naming. For important side effects, decide whether the main operation should fail when a handler fails.

## Common Mistakes

- Using Strategy for tiny `if` statements that are unlikely to grow.
- Letting strategies have inconsistent return shapes.
- Emitting events before the database transaction commits.
- Assuming `EventEmitter` awaits async listeners.
- Using in-process events for work that must survive process restarts.

## Practical Challenge

Build a notification strategy with `email`, `sms`, and `webhook` implementations. Then emit a `notification.sent` event after a successful send. Decide which failures should be retried and which should be returned to the caller.

## Recap

Behavioral patterns manage communication and variation. Strategy replaces sprawling conditionals with interchangeable behavior. Observer lets one event trigger many reactions. In Node.js, both patterns are powerful when paired with clear interfaces, reliable error handling, and practical logging.

