# Introduction to GraphQL

GraphQL is an API query language and runtime.

Instead of calling many fixed REST endpoints, a client asks for exactly the fields it needs from a typed schema.

## REST vs GraphQL

REST often exposes multiple endpoints.

```text
GET /api/users/42
GET /api/users/42/posts
GET /api/posts/99/comments
```

GraphQL usually exposes one endpoint and different operations.

```graphql
query UserProfile($id: ID!) {
  user(id: $id) {
    id
    name
    posts {
      id
      title
    }
  }
}
```

The response shape follows the query shape.

## The Schema

The schema defines what clients can ask for.

```graphql
type User {
  id: ID!
  name: String!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  body: String!
}

type Query {
  user(id: ID!): User
}
```

The schema is a contract between frontend and backend teams.

## Queries, Mutations, and Subscriptions

GraphQL has three main operation types:

- query: read data
- mutation: change data
- subscription: receive pushed updates

```graphql
query GetUser {
  user(id: "42") {
    id
    name
  }
}
```

```graphql
mutation RenameUser {
  renameUser(id: "42", name: "Asha") {
    id
    name
  }
}
```

```graphql
subscription OnlineUsers {
  userCameOnline {
    id
    name
  }
}
```

## Why React Teams Use GraphQL

GraphQL can help when:

- screens need nested data from several resources
- clients need different field selections
- frontend and backend teams want a typed contract
- overfetching is a problem
- generated TypeScript types are useful

It is not automatically simpler than REST.

GraphQL moves complexity into schema design, resolver performance, caching, tooling, and authorization.

## Overfetching and Underfetching

Overfetching means receiving data you do not need.

Underfetching means needing several requests to build one screen.

GraphQL lets the client shape the selection.

```graphql
query ProductCard($id: ID!) {
  product(id: $id) {
    id
    name
    price
    thumbnailUrl
  }
}
```

The card does not need product reviews, inventory history, or supplier details.

## Resolver Awareness

The server resolves fields.

```text
Query.user
  -> User.posts
  -> Post.comments
```

A query can look simple but trigger many backend calls if resolvers are inefficient.

This is known as the N+1 problem.

Tools such as batching and DataLoader are often used on the server.

## Authorization Still Matters

GraphQL does not automatically secure fields.

The backend must check permissions for:

- operations
- object access
- sensitive fields
- nested relationships
- mutations

Do not rely on hiding a field in the UI.

## Common Mistakes

- Treating GraphQL as only "REST with one endpoint."
- Designing a schema that mirrors database tables too directly.
- Forgetting field-level authorization.
- Letting clients request extremely expensive nested data.
- Assuming GraphQL removes the need for pagination.

## Edge Case

GraphQL can return partial data with errors.

```json
{
  "data": {
    "user": {
      "id": "42",
      "name": "Asha",
      "posts": null
    }
  },
  "errors": [
    { "message": "Could not load posts" }
  ]
}
```

Clients must understand how their GraphQL library exposes partial data and errors.

:::quiz
question: What does a GraphQL schema primarily define?
options:
  - The available types, fields, and operations clients can use
  - The CSS layout of React components
  - The browser cache size
  - The order React commits DOM changes
answer: 0
explanation: The schema is the typed API contract for GraphQL operations.
:::

## Practical Challenge

Design a GraphQL schema for a course platform.

Include:

- course
- module
- lesson
- current user's progress
- mutation to mark a lesson complete

Identify which fields require authorization.

## Recap

GraphQL lets clients request typed, nested data from a schema.

Its benefits are strongest when paired with good schema design, resolver performance, pagination, authorization, and client caching discipline.
