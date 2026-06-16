# Building CRUD Endpoints

## Why It Matters

CRUD endpoints are the daily work of many APIs. The challenge is not only making create, read, update, and delete work; it is making them predictable under validation errors, missing records, retries, and concurrent clients.

## Core Concepts

- Create usually maps to `POST /resources` and returns `201 Created`.
- List usually maps to `GET /resources` with filtering and pagination.
- Read maps to `GET /resources/:id`.
- Replace maps to `PUT`; partial update maps to `PATCH`.
- Delete maps to `DELETE` and can return `204 No Content` when successful.

## Flow to Remember

The route parses input, validates it, calls a service, persists changes, maps domain outcomes to status codes, and returns a stable response shape.

## Syntax and Examples

```js
import express from 'express';
import { randomUUID } from 'node:crypto';

const app = express();
const todos = new Map();
app.use(express.json());

app.post('/api/todos', (req, res) => {
  const title = String(req.body?.title ?? '').trim();
  if (!title) return res.status(400).json({ error: { code: 'TITLE_REQUIRED' } });
  const todo = { id: randomUUID(), title, completed: false };
  todos.set(todo.id, todo);
  res.status(201).location(`/api/todos/${todo.id}`).json({ data: todo });
});

app.get('/api/todos/:id', (req, res) => {
  const todo = todos.get(req.params.id);
  if (!todo) return res.status(404).json({ error: { code: 'TODO_NOT_FOUND' } });
  res.json({ data: todo });
});

app.patch('/api/todos/:id', (req, res) => {
  const todo = todos.get(req.params.id);
  if (!todo) return res.status(404).json({ error: { code: 'TODO_NOT_FOUND' } });
  const updated = { ...todo, completed: Boolean(req.body.completed) };
  todos.set(updated.id, updated);
  res.json({ data: updated });
});

app.listen(3000);
```

## Use Cases and Tradeoffs

- Use CRUD for resources with clear lifecycle state.
- Use service functions for business rules such as uniqueness, ownership, and allowed transitions.
- Use transactions for create/update flows that touch multiple tables.
- Use idempotency keys when clients may retry creates after timeouts.

## Common Mistakes

- Treating `PATCH` as a free-form merge into database rows.
- Deleting data permanently when audit or restore requirements need soft deletes.
- Ignoring ownership checks on `GET /resources/:id`.
- Returning internal database column names as public API fields by accident.

## Practical Challenge

Implement CRUD for `projects` with an in-memory repository. Add validation and a consistent `{ data }` or `{ error }` response shape.

## Recap

- CRUD is simple only when the happy path is considered.
- Status codes, validation, and missing records are part of the contract.
- Separate HTTP handlers from persistence and business rules.

