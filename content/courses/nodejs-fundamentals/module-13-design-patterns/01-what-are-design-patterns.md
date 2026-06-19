# What are Design Patterns?

## Why It Matters

Design patterns are reusable solutions to problems that appear again and again in software design. In Node.js backend work, those problems are usually not abstract textbook puzzles. They show up as questions like:

- How should route handlers call business logic without becoming huge files?
- How can a payment provider be swapped without rewriting every service?
- How do we keep caching, logging, retries, validation, and authorization from being copied everywhere?
- How should code react to events without tightly coupling producers and consumers?

Patterns give names to solutions. That vocabulary helps teams discuss tradeoffs quickly. Saying "this is a repository" or "this is a strategy" is shorter than explaining the whole structure every time.

Patterns are not rules. They are tools. A good backend uses patterns to reduce accidental complexity. A bad backend uses patterns to hide simple code behind layers that do not earn their cost.

## Core Concepts

### Pattern vs Framework Feature

A framework feature is something provided by a library, such as Express middleware or a Prisma client. A pattern is a design idea that can be implemented with plain JavaScript, a framework, or a library.

For example, Express middleware is a framework feature, but it also expresses a pattern: request processing is split into small functions arranged in a chain.

### The Problem Shape Matters

Before choosing a pattern, identify the pressure in the code:

- Too many `if` branches may point to Strategy.
- Repeated object creation may point to Factory.
- Unclear data access boundaries may point to Repository.
- Cross-cutting behavior such as logging may point to Decorator, Proxy, or middleware.
- One part of the system needing to notify many other parts may point to Observer or events.

A pattern is useful when it matches a recurring pressure. It is not useful just because the code is "enterprise" or the pattern sounds professional.

### Node.js Has Its Own Biases

Node encourages small modules, asynchronous APIs, event emitters, streams, middleware, dependency injection through function parameters, and composition over inheritance. Many classic object-oriented patterns still apply, but they are often simpler in JavaScript.

Instead of a class hierarchy, you may use functions and objects:

```js
export function createUserService({ userRepository, passwordHasher }) {
  return {
    async register(input) {
      const passwordHash = await passwordHasher.hash(input.password);
      return userRepository.create({ ...input, passwordHash });
    }
  };
}
```

This is dependency injection without a container. It keeps the service testable and avoids hidden globals.

## Syntax/Examples

Consider a route handler that has grown too much:

```js
import express from 'express';
import { randomUUID } from 'node:crypto';

const app = express();
app.use(express.json());

app.post('/orders', async (req, res, next) => {
  try {
    if (!req.body.userId || !Array.isArray(req.body.items)) {
      return res.status(400).json({ error: 'Invalid order' });
    }

    const order = {
      id: randomUUID(),
      userId: req.body.userId,
      items: req.body.items,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Imagine database writes, payment calls, emails, logging, and metrics here.
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});
```

A pattern-oriented rewrite does not need to be complicated:

```js
import express from 'express';
import { randomUUID } from 'node:crypto';

function createOrderFactory() {
  return {
    createPendingOrder(input) {
      return {
        id: randomUUID(),
        userId: input.userId,
        items: input.items,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
    }
  };
}

function createOrderService({ orderFactory, orderRepository }) {
  return {
    async placeOrder(input) {
      if (!input.userId || !Array.isArray(input.items)) {
        const error = new Error('Invalid order');
        error.statusCode = 400;
        throw error;
      }

      const order = orderFactory.createPendingOrder(input);
      await orderRepository.save(order);
      return order;
    }
  };
}

const orderRepository = {
  async save(order) {
    console.log('saving order', order.id);
  }
};

const orderService = createOrderService({
  orderFactory: createOrderFactory(),
  orderRepository
});

const app = express();
app.use(express.json());

app.post('/orders', async (req, res, next) => {
  try {
    const order = await orderService.placeOrder(req.body);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});
```

This example uses several pattern ideas without overengineering:

- Factory centralizes object creation.
- Service separates use case logic from HTTP.
- Repository hides persistence details.
- Dependency injection makes the service easy to test.

## Use Cases

Use design patterns when they make the code easier to change in one of these ways:

- Provider replacement: switching email, storage, payment, or search vendors.
- Testability: passing fake repositories, clocks, and clients into services.
- Cross-cutting behavior: applying logging, metrics, retries, validation, or authorization consistently.
- Complexity boundaries: keeping controllers, domain logic, database access, and infrastructure separate.
- Runtime flexibility: choosing behavior based on tenant, plan, feature flag, or request context.

## Tradeoffs

Patterns introduce names, files, and boundaries. Those can clarify a system, but they can also slow development when used too early.

A useful test is: "What change becomes easier after this pattern?" If the answer is vague, keep the code simple. If the answer is specific, such as "we can test order creation without starting Express or Postgres", the pattern probably has value.

## Common Mistakes

- Applying every pattern from a list instead of solving an actual local problem.
- Creating class-heavy JavaScript when a small function would be clearer.
- Hiding dependencies inside modules, which makes code hard to test and reason about.
- Treating patterns as architecture. Patterns are building blocks, not the whole system design.
- Creating one file per tiny concept before the behavior is stable.

## Practical Challenge

Take a route handler in an existing Express app and identify three responsibilities inside it. Move one responsibility into a service function and pass its dependencies as arguments. Do not add a framework or container. Verify that the route handler becomes mostly HTTP input and output code.

## Recap

Design patterns are shared names for proven design moves. In Node.js, they often appear as small modules, functions, middleware, event emitters, and injected dependencies. Use them to make real changes easier: testing, swapping providers, separating concerns, and applying behavior consistently. Avoid patterns that only add ceremony.

