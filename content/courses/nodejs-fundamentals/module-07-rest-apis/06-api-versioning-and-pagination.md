# API Versioning and Pagination

## Why It Matters

APIs evolve and datasets grow. Versioning controls breaking changes; pagination keeps list endpoints fast, predictable, and affordable for clients and databases.

## Core Concepts

- Version only when behavior or response contracts break, not for every deploy.
- URI versioning (`/v1`) is explicit and easy to route.
- Header versioning keeps URLs cleaner but can be harder to debug.
- Offset pagination is simple but can shift when rows are inserted or deleted.
- Cursor pagination is better for large or frequently changing datasets.

## Flow to Remember

A list request includes a limit and cursor or offset. The service fetches one page plus enough metadata to indicate whether another page exists, then returns stable pagination fields.

## Syntax and Examples

```js
import express from 'express';

const app = express();
const items = Array.from({ length: 100 }, (_, index) => ({ id: index + 1, name: `Item ${index + 1}` }));

app.get('/api/v1/items', (req, res) => {
  const limit = Math.min(Number(req.query.limit ?? 20), 50);
  const after = Number(req.query.after ?? 0);
  const page = items.filter((item) => item.id > after).slice(0, limit);
  const nextCursor = page.length === limit ? page.at(-1).id : null;

  res.json({ data: page, page: { limit, nextCursor } });
});

app.listen(3000);
```

## Use Cases and Tradeoffs

- Use `/api/v1` when many clients need a clear compatibility boundary.
- Use cursor pagination for feeds, logs, events, and high-volume tables.
- Use offset pagination for admin screens where jumping to page numbers matters and data is small enough.
- Document maximum limits to protect database and response size.

## Common Mistakes

- Breaking existing response fields without a migration plan.
- Allowing unlimited `limit` values.
- Using offset pagination on a table that changes constantly and confusing users with duplicates or missing rows.
- Encoding sensitive filter data into public cursors.

## Practical Challenge

Add cursor pagination to `GET /api/v1/orders`. Return `data`, `page.limit`, and `page.nextCursor`, and reject limits above 100.

## Recap

- Versioning is about client contracts.
- Pagination is a performance and usability feature.
- Cursor pagination is usually safer for changing datasets.

