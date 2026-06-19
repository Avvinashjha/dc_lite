# ORMs and Query Builders

## Why It Matters

ORMs and query builders reduce repetitive data-access code, but they also add abstractions over SQL and database behavior. Choosing one affects performance, type safety, migrations, onboarding, and how easily developers can reason about queries.

## Core Concepts

- An ORM maps database tables or documents to application objects.
- A query builder constructs SQL through JavaScript APIs without hiding the relational model completely.
- Raw SQL offers maximum control but more repetition.
- Migrations, transactions, eager loading, and connection management differ by tool.
- Generated types are helpful only when runtime schema and migrations stay aligned.

## Flow to Remember

Application code asks the ORM or query builder for data, the library generates database queries, the driver executes them, and results are mapped back into JavaScript objects.

## Syntax and Examples

```js
// Query-builder style example with Knex-like syntax.
export async function listActiveUsers(db, { limit = 20 }) {
  return db('users')
    .select('id', 'email', 'name')
    .where({ active: true })
    .orderBy('created_at', 'desc')
    .limit(limit);
}

// Raw SQL equivalent is often clearer for complex joins.
export async function listActiveUsersSql(pool, { limit = 20 }) {
  const result = await pool.query(
    'SELECT id, email, name FROM users WHERE active = true ORDER BY created_at DESC LIMIT $1',
    [limit]
  );
  return result.rows;
}
```

## Use Cases and Tradeoffs

- Use ORMs for common CRUD, relations, migrations, and type generation when the team values speed and consistency.
- Use query builders when you want composable SQL with less magic.
- Use raw SQL for performance-critical reports, complex joins, and database-specific features.
- Measure generated queries before optimizing around assumptions.

## Common Mistakes

- Assuming ORM relations cannot cause N+1 query problems.
- Letting persistence models become public API response models.
- Ignoring transactions because the ORM hides connections.
- Fighting the abstraction instead of using raw SQL for a complex query.

## Practical Challenge

Compare raw SQL, a query builder, and an ORM for a `users with latest order` endpoint. List which one you would choose and why.

## Recap

- ORMs trade control for productivity.
- Query builders keep SQL concepts visible.
- The best data-access layer still requires database knowledge.

