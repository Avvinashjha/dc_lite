# Database and Query Optimization

## Why It Matters

Many slow Node.js APIs are not slow because JavaScript is slow. They are slow because database access is inefficient: missing indexes, N+1 queries, over-fetching, unbounded scans, lock waits, and excessive connection usage.

Query optimization is backend optimization. A well-designed Node service should make database work explicit, measured, and aligned with API access patterns.

## Core Concepts

### Measure Before Changing

Use timing, query logs, and database execution plans. Guessing can lead to indexes that do not help or code changes that move the bottleneck elsewhere.

### Indexes

Indexes help the database find rows without scanning the whole table. They are most useful for columns used in `where`, `join`, `order by`, and uniqueness constraints.

Indexes speed reads but cost storage and slow writes because each index must be maintained.

### N+1 Queries

N+1 happens when code loads a list and then runs one query per item.

Example problem:

```js
const orders = await orderRepository.listRecent();
for (const order of orders) {
  order.items = await itemRepository.findByOrderId(order.id);
}
```

For 100 orders, this makes 101 queries. Use joins, batching, or dedicated aggregate queries.

### Connection Pooling

A pool reuses database connections. Too few connections cause waiting. Too many can overload the database. In horizontally scaled Node apps, total connections are `instances * pool size`.

## Syntax/Examples

### Query Timing Wrapper

```js
export function createTimedPool({ pool, logger }) {
  return {
    async query(text, params) {
      const started = performance.now();
      try {
        return await pool.query(text, params);
      } finally {
        logger.info('db query', {
          durationMs: Math.round(performance.now() - started),
          statement: text.split('\n')[0]
        });
      }
    }
  };
}
```

Do not log full parameter values if they may contain sensitive data.

### Avoiding N+1 With Batching

```js
export async function listOrdersWithItems({ pool, userId, limit }) {
  const ordersResult = await pool.query(
    `select id, created_at, status
     from orders
     where user_id = $1
     order by created_at desc
     limit $2`,
    [userId, limit]
  );

  const orderIds = ordersResult.rows.map((order) => order.id);
  if (orderIds.length === 0) return [];

  const itemsResult = await pool.query(
    `select order_id, sku, quantity
     from order_items
     where order_id = any($1::uuid[])`,
    [orderIds]
  );

  const itemsByOrderId = new Map();
  for (const item of itemsResult.rows) {
    const items = itemsByOrderId.get(item.order_id) ?? [];
    items.push(item);
    itemsByOrderId.set(item.order_id, items);
  }

  return ordersResult.rows.map((order) => ({
    ...order,
    items: itemsByOrderId.get(order.id) ?? []
  }));
}
```

This uses two queries instead of one query per order.

### Index for a Common Endpoint

If your endpoint is:

```sql
select id, created_at, status
from orders
where user_id = $1
order by created_at desc
limit 20;
```

A useful index may be:

```sql
create index orders_user_created_at_idx on orders (user_id, created_at desc);
```

The best index depends on the database, data distribution, and full query plan.

## Use Cases

Optimize database access when:

- A high-traffic endpoint spends most time waiting on queries.
- Query latency grows as tables grow.
- The database CPU is high during API traffic.
- Connection pools are saturated.
- List endpoints need pagination and sorting.

Common improvements:

- Add targeted indexes.
- Replace N+1 queries with batching or joins.
- Select only needed columns.
- Move expensive aggregate work to precomputed tables or materialized views.
- Use transactions only around work that must be atomic.

## Tradeoffs

Indexes improve reads but slow writes and consume storage. Joins reduce round trips but can produce large duplicated result sets. Caching reduces database load but introduces staleness. Read replicas increase read capacity but may lag behind primary writes.

Optimization is about the whole path, not one query in isolation.

## Common Mistakes

- Selecting `*` from large tables for list endpoints.
- Adding indexes without checking query plans.
- Creating a new database pool in every module or request.
- Ignoring total connection count across scaled instances.
- Using transactions around slow external API calls.
- Loading thousands of rows into Node to filter in memory.

## Practical Challenge

Find a list endpoint and write the SQL it needs. Identify the `where` and `order by` columns. Propose one index. Then rewrite any N+1 loading into a batched query and measure the number of database round trips before and after.

## Recap

Database optimization is often the biggest API optimization. Measure query time, avoid N+1 patterns, use targeted indexes, limit selected columns, and manage connection pools based on total deployed instances. Keep the Node service aligned with how the database can efficiently answer requests.

