# MySQL and Node.js

## Why It Matters

MySQL is a widely used relational database for web applications. Node services commonly use it for transactional business data such as users, orders, invoices, inventory, and permissions.

## Core Concepts

- Use a driver such as `mysql2` with promises for async code.
- Use connection pools instead of opening a new connection for every request.
- Use `?` placeholders for parameterized queries.
- Choose data types, indexes, and constraints deliberately.
- Understand transaction isolation when multiple requests update related rows.

## Flow to Remember

The API validates input, gets a pooled connection, sends SQL with parameters, MySQL executes the query and returns rows or metadata, then the connection returns to the pool.

## Syntax and Examples

```js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  uri: process.env.MYSQL_URL,
  waitForConnections: true,
  connectionLimit: 10
});

export async function findUserByEmail(email) {
  const [rows] = await pool.execute(
    'SELECT id, email, name FROM users WHERE email = ? LIMIT 1',
    [email]
  );
  return rows[0] ?? null;
}

export async function createUser({ email, name }) {
  const [result] = await pool.execute(
    'INSERT INTO users (email, name) VALUES (?, ?)',
    [email, name]
  );
  return { id: result.insertId, email, name };
}
```

## Use Cases and Tradeoffs

- Use MySQL for traditional web apps, reporting-friendly relational data, and systems already standardized on MySQL.
- Use InnoDB for transactions and row-level locking.
- Use read replicas only after understanding replication lag.
- Keep SQL close to repositories or query modules.

## Common Mistakes

- Using string interpolation for SQL values.
- Not indexing foreign keys and filter columns.
- Assuming timezone handling is correct without standardizing on UTC.
- Leaving transactions open when an error occurs.

## Practical Challenge

Build a MySQL repository for `orders` with `createOrder` and `findOrderById`. Use placeholders and return a public object rather than raw driver metadata.

## Recap

- MySQL is a transactional relational database.
- Pools and parameterized queries are baseline requirements.
- Schema design and indexes are part of API performance.

