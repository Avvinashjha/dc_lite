# What is REST?

## Why It Matters

REST is a way to design HTTP APIs around resources, representations, and standard protocol semantics. It helps clients predict how to create, read, update, and delete data without learning a custom command language for every service.

## Core Concepts

- Resources are nouns such as users, invoices, or comments.
- Representations are JSON, HTML, or another format sent over HTTP.
- HTTP methods carry intent: `GET` reads, `POST` creates or triggers processing, `PUT` replaces, `PATCH` partially updates, and `DELETE` removes.
- Status codes describe the outcome independently of the response body.
- REST APIs should be stateless; each request carries the information needed to process it.

## Flow to Remember

A client requests a resource URL with a method and headers. The server authorizes, validates, performs work, and returns a representation plus status code and headers.

## Syntax and Examples

```js
import express from 'express';

const app = express();
app.use(express.json());

app.get('/api/books/:bookId', (req, res) => {
  res.json({ data: { id: req.params.bookId, title: 'Node Patterns' } });
});

app.patch('/api/books/:bookId', (req, res) => {
  res.json({ data: { id: req.params.bookId, ...req.body } });
});

app.listen(3000);
```

## Use Cases and Tradeoffs

- Use REST for resource-oriented APIs consumed by browsers, mobile apps, partners, and internal systems.
- Use RPC-style endpoints only when the operation is naturally a command rather than resource state.
- Use headers for content negotiation, authentication, caching, and idempotency metadata.
- Design URLs from the client's view of the domain, not from table names.

## Common Mistakes

- Using verbs in every URL, such as `/getUser` and `/deleteUser`.
- Returning `200 OK` for every response, including validation and authorization failures.
- Storing session state on one server instance and breaking horizontal scaling.
- Making responses depend on hidden server-side request history.

## Practical Challenge

Design REST routes for tasks and task comments. Include list, create, update, and delete operations and write the expected status code for each.

## Recap

- REST uses HTTP semantics instead of custom commands.
- Resources and representations are the main design units.
- Stateless APIs are easier to scale and reason about.

