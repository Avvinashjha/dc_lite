# Pagination, Filtering and Projection

## Why It Matters

APIs become slow when they return too much data or force the database to scan too many rows. Pagination, filtering, and projection control how much data is requested, processed, transferred, and rendered.

These techniques are not only performance optimizations. They are API design tools. A good list endpoint should be predictable under growth: ten records, ten thousand records, or ten million records should not change the contract.

## Core Concepts

### Pagination

Pagination splits a large result set into smaller pages. Common styles are:

- Offset pagination: `?limit=20&offset=40`.
- Page pagination: `?page=3&pageSize=20`.
- Cursor pagination: `?limit=20&after=cursor_value`.

Offset pagination is easy but can get slower for deep pages because the database still skips rows. Cursor pagination is better for large changing datasets because it uses a stable ordering key.

### Filtering

Filtering reduces results by criteria such as status, owner, date range, or search term. Filters should map to indexed database columns when possible.

### Projection

Projection returns only needed fields. A list endpoint may return summaries, while a detail endpoint returns full records.

Projection reduces database I/O, JSON serialization cost, network transfer, and client parsing time.

## Syntax/Examples

### Express Query Parsing

```js
import express from 'express';

const app = express();

function parseListQuery(req, res, next) {
  const limit = Math.min(Number(req.query.limit ?? 20), 100);
  const status = req.query.status ?? null;
  const after = req.query.after ?? null;

  if (!Number.isInteger(limit) || limit < 1) {
    return res.status(400).json({ error: 'limit must be between 1 and 100' });
  }

  req.listQuery = { limit, status, after };
  next();
}

app.get('/orders', parseListQuery, async (req, res) => {
  const result = await orderRepository.list(req.listQuery);
  res.json(result);
});
```

### Cursor Pagination Query Sketch

```js
export function createOrderRepository({ pool }) {
  return {
    async list({ limit, status, after }) {
      const values = [];
      const conditions = [];

      if (status) {
        values.push(status);
        conditions.push(`status = $${values.length}`);
      }

      if (after) {
        values.push(after);
        conditions.push(`created_at < $${values.length}`);
      }

      values.push(limit + 1);
      const where = conditions.length ? `where ${conditions.join(' and ')}` : '';

      const result = await pool.query(
        `select id, status, total_cents, created_at
         from orders
         ${where}
         order by created_at desc
         limit $${values.length}`,
        values
      );

      const rows = result.rows.slice(0, limit);
      const nextCursor = result.rows.length > limit ? rows.at(-1).created_at : null;

      return { data: rows, pageInfo: { nextCursor } };
    }
  };
}
```

This uses `limit + 1` to determine whether another page exists.

## Use Cases

Use offset pagination for:

- Small admin tables.
- Reports where users jump to a page number.
- Datasets with stable size and low write frequency.

Use cursor pagination for:

- Activity feeds.
- Order history.
- Logs and events.
- Large datasets with frequent inserts.

Use projection when:

- List responses do not need detail fields.
- Large JSON columns exist.
- Different clients need different levels of detail.

## Tradeoffs

Cursor pagination requires a stable sort. Sorting only by `created_at` can be ambiguous if many rows share the same timestamp. A stronger cursor often includes two fields, such as `created_at` and `id`.

Filtering creates API flexibility but can damage performance if every arbitrary filter is allowed. Design filters around real use cases and indexes.

## Common Mistakes

- Returning all rows and paginating in application memory.
- Allowing unbounded `limit` values.
- Using offset pagination for very deep high-traffic feeds.
- Sorting by non-indexed columns on large tables.
- Returning full objects in list endpoints when summaries would work.

## Practical Challenge

Build a `GET /orders` endpoint with `limit`, `status`, and cursor-based `after`. Cap `limit` at 100. Return `data` and `pageInfo.nextCursor`. Explain which database index supports the query.

## Recap

Pagination controls result size, filtering controls relevance, and projection controls payload shape. Together they make APIs predictable and efficient. Cursor pagination is usually the better default for large, changing backend datasets.

