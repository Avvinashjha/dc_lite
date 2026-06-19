# MongoDB and Node.js

## Why It Matters

MongoDB stores JSON-like documents and fits data that is naturally hierarchical, flexible, or frequently read as a whole document. Node developers often use it because document shapes map closely to JavaScript objects.

## Core Concepts

- A database contains collections; collections contain documents.
- Documents can embed related data or reference other documents.
- Indexes are required for efficient queries at scale.
- Schemas are flexible but application validation is still necessary.
- Transactions exist, but document modeling should avoid unnecessary multi-document writes.

## Flow to Remember

The service validates input, gets a collection from the MongoDB client, executes a query or write with filters, and maps BSON/ObjectId values into API-friendly JSON.

## Syntax and Examples

```js
import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URL);
await client.connect();
const users = client.db('app').collection('users');
await users.createIndex({ email: 1 }, { unique: true });

export async function createUser({ email, name }) {
  const now = new Date();
  const result = await users.insertOne({ email, name, createdAt: now });
  return { id: result.insertedId.toString(), email, name, createdAt: now.toISOString() };
}

export async function findUser(id) {
  const doc = await users.findOne({ _id: new ObjectId(id) });
  return doc ? { id: doc._id.toString(), email: doc.email, name: doc.name } : null;
}
```

## Use Cases and Tradeoffs

- Embed child data when it is owned by the parent and read together.
- Reference data when it is large, shared, or changes independently.
- Use schema validation in code and optional collection validators for critical invariants.
- Use change streams for event-driven integrations when the deployment supports them.

## Common Mistakes

- Skipping indexes because early development data is small.
- Letting every document in a collection have a different shape without migration discipline.
- Exposing raw `_id` and internal fields inconsistently.
- Using MongoDB as if joins and transactions were free.

## Practical Challenge

Model a blog post with embedded comments. Add indexes for author ID and publish date, then write repository functions for create, list by author, and add comment.

## Recap

- MongoDB is document-oriented, not schema-free in practice.
- Document shape should match access patterns.
- Indexes and validation are still essential.

