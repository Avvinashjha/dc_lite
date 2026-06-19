# Queries and Mutations

Queries read data. Mutations change data.

In React, the important skill is connecting these operations to loading states, variables, errors, cache updates, and user feedback.

## Query Basics

```graphql
query GetProduct($id: ID!) {
  product(id: $id) {
    id
    name
    price
  }
}
```

Variables keep operations reusable and safe.

```json
{
  "id": "p1"
}
```

Avoid building query strings with user input.

## Field Selection

Request the fields the component needs.

```graphql
query ProductCard($id: ID!) {
  product(id: $id) {
    id
    name
    thumbnailUrl
    price
  }
}
```

If another screen needs reviews, use a different operation or fragment.

## Fragments

Fragments reuse field selections.

```graphql
fragment ProductSummary on Product {
  id
  name
  price
}

query ProductPage($id: ID!) {
  product(id: $id) {
    ...ProductSummary
    description
  }
}
```

Fragments are useful, but avoid creating huge fragments that every screen imports blindly.

## Mutation Basics

Mutations should return the changed data the client needs.

```graphql
mutation RenameProject($id: ID!, $name: String!) {
  renameProject(id: $id, name: $name) {
    id
    name
    updatedAt
  }
}
```

Returning `id` and changed fields helps normalized caches update correctly.

## Input Objects

For larger mutations, use input objects.

```graphql
input CreateLessonInput {
  courseId: ID!
  title: String!
  body: String!
}

mutation CreateLesson($input: CreateLessonInput!) {
  createLesson(input: $input) {
    id
    title
  }
}
```

This keeps operation signatures manageable as inputs grow.

## Handling Errors

GraphQL has transport-level errors and GraphQL operation errors.

Examples:

- network is offline
- server returns `500`
- validation error in the GraphQL response
- partial data with field errors
- authorization error for one field

Your React UI should distinguish:

- cannot reach server
- user input is invalid
- user lacks permission
- data partially loaded

## Optimistic Mutations

An optimistic mutation updates UI before the server responds.

```jsx
renameProject({
  variables: { id, name },
  optimisticResponse: {
    renameProject: {
      __typename: "Project",
      id,
      name,
      updatedAt: new Date().toISOString(),
    },
  },
});
```

Use optimistic updates for reversible, low-risk actions. Be careful with payments, inventory, and destructive operations.

## Pagination

GraphQL lists still need pagination.

Common styles:

- offset pagination
- cursor pagination
- connection-style pagination

```graphql
query ProjectList($after: String) {
  projects(first: 20, after: $after) {
    edges {
      cursor
      node {
        id
        name
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

Cursor pagination is often better for changing lists.

## Common Mistakes

- Omitting `id` from mutation responses.
- Requesting huge nested lists without pagination.
- Using one giant query for every screen.
- Ignoring partial data and GraphQL errors.
- Treating all mutations as safe for optimistic UI.
- Forgetting that authorization must be checked on the server.

:::quiz
question: Why should mutation responses often include `id` and changed fields?
options:
  - Client caches can identify and update the changed object
  - GraphQL requires every mutation to return a string
  - It prevents the server from validating input
  - It disables pagination
answer: 0
explanation: Normalized caches commonly use IDs and typenames to update entities after mutations.
:::

## Practical Challenge

Write GraphQL operations for a lesson comments feature.

Include:

- query comments with pagination
- mutation to add a comment
- mutation to edit a comment
- mutation to delete a comment
- fields needed for cache updates
- possible validation and authorization errors

## Recap

Queries and mutations are more than syntax. They define data shape, cache behavior, error handling, and UI state.

Use variables, focused field selections, pagination, and mutation responses that help the client stay consistent.
