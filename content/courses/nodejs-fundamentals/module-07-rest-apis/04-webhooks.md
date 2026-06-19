# Webhooks

## Why It Matters

Webhooks let one system notify another system when an event happens. They are common for payments, messaging, identity, CI/CD, and SaaS integrations, but they require careful security and retry handling because the sender controls timing.

## Core Concepts

- A webhook is an HTTP request sent by a provider to your endpoint.
- Providers usually retry non-2xx responses.
- Signature verification proves the request body came from the provider and was not modified.
- Idempotency prevents duplicate events from causing duplicate side effects.
- Webhook handlers should acknowledge quickly and move slow work to a queue.

## Flow to Remember

The provider sends an event, your route reads the raw body, verifies the signature, stores the event ID, acknowledges receipt, and processes the event once.

## Syntax and Examples

```js
import express from 'express';
import { createHmac, timingSafeEqual } from 'node:crypto';

const app = express();
app.post('/webhooks/provider', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.get('x-provider-signature') ?? '';
  const expected = createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(req.body)
    .digest('hex');

  const valid = signature.length === expected.length &&
    timingSafeEqual(Buffer.from(signature), Buffer.from(expected));

  if (!valid) return res.status(401).send('invalid signature');

  const event = JSON.parse(req.body.toString('utf8'));
  console.log('received event', event.id, event.type);
  res.status(202).json({ received: true });
});

app.listen(3000);
```

## Use Cases and Tradeoffs

- Use webhooks to react to external events without polling.
- Store event IDs before processing to handle retries safely.
- Return quickly and process slow side effects asynchronously.
- Expose separate endpoints per provider when signature schemes differ.

## Common Mistakes

- Parsing JSON before signature verification when the provider signs the raw body.
- Assuming each event arrives exactly once and in order.
- Returning `200 OK` before durable storage when losing the event would be harmful.
- Not rotating or protecting webhook secrets.

## Practical Challenge

Implement a webhook endpoint that verifies an HMAC signature, stores processed event IDs in memory, and ignores duplicate deliveries.

## Recap

- Webhooks are inbound integration events.
- Verify signatures against the raw request body.
- Design for retries, duplicates, and out-of-order delivery.

