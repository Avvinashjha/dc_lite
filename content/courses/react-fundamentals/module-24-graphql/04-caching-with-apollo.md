# Caching with Apollo

Apollo's `InMemoryCache` stores GraphQL results in a normalized client cache.

Good caching can make React apps feel instant. Poor caching can show stale data, duplicate list items, or confusing mutation results.

## Normalized Cache Mental Model

Apollo can split query results into entities by `__typename` and `id`.

```json
{
  "__typename": "User",
  "id": "u1",
  "name": "Asha"
}
```

This becomes a cache record like:

```text
User:u1 -> { id: "u1", name: "Asha" }
```

If another query returns the same user with the same identity, Apollo can reuse and update that record.

## Why `id` and `__typename` Matter

Mutation result:

```graphql
mutation RenameUser($id: ID!, $name: String!) {
  renameUser(id: $id, name: $name) {
    id
    name
    __typename
  }
}
```

Apollo usually adds `__typename` automatically, but you should understand the identity model.

If the cache cannot identify an object, it may store nested copies instead of one shared record.

## Automatic Updates

If a mutation returns an existing entity, fields on that entity can update automatically.

```text
before: User:u1 name = "Asha"
mutation returns: User:u1 name = "Asha Rao"
after: User:u1 name = "Asha Rao"
```

This works well for editing fields on an existing object.

## List Updates Are Different

Creating or deleting items often requires list cache updates.

```jsx
addComment({
  variables: { lessonId, body },
  update(cache, { data }) {
    cache.modify({
      id: cache.identify({ __typename: "Lesson", id: lessonId }),
      fields: {
        comments(existingRefs = []) {
          const newRef = cache.writeFragment({
            data: data.addComment,
            fragment: gql`
              fragment NewComment on Comment {
                id
                body
                __typename
              }
            `,
          });

          return [...existingRefs, newRef];
        },
      },
    });
  },
});
```

Apollo cannot always infer which lists should include a newly created object.

## Type Policies

Type policies customize cache identity and field behavior.

```js
const cache = new InMemoryCache({
  typePolicies: {
    Product: {
      keyFields: ["sku"],
    },
  },
});
```

Use this when a type does not use a normal `id`.

## Pagination Cache Pitfalls

Paginated lists need merge rules.

```js
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        feed: {
          keyArgs: ["filter"],
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          },
        },
      },
    },
  },
});
```

Without careful key arguments, Apollo may mix different filtered lists together.

```text
feed(filter: "open")
feed(filter: "closed")
```

These should not become one combined list.

## Cache Eviction

Deleting an object may require eviction.

```js
cache.evict({ id: cache.identify({ __typename: "Comment", id }) });
cache.gc();
```

Also remove references from lists if needed.

## Refetching

Sometimes refetching is simpler and safer than hand-editing the cache.

```jsx
deleteLesson({
  variables: { id },
  refetchQueries: [GET_LESSONS],
});
```

Refetching costs network time but can be appropriate for complex updates.

## Common Mistakes

- Omitting IDs from queried objects.
- Expecting new objects to appear in every relevant list automatically.
- Mixing paginated lists with different filters.
- Creating custom merge functions that duplicate items.
- Using `no-cache` everywhere to avoid understanding the cache.
- Forgetting to evict deleted records.

## Debugging Tips

When cache behavior is strange, inspect:

- does the object have `id` and `__typename`?
- are query variables different?
- does the list need a manual update?
- does pagination need `keyArgs`?
- did a mutation return enough fields?
- is stale data acceptable for this fetch policy?

:::quiz
question: Why might Apollo not automatically add a newly created comment to a lesson's comments list?
options:
  - The cache can identify the comment but cannot know every list where it belongs
  - Apollo does not support arrays
  - GraphQL mutations cannot return objects
  - React prevents cache writes during events
answer: 0
explanation: Normalization can store the new entity, but list membership often needs `cache.modify`, refetching, or a field policy.
:::

## Practical Challenge

Implement a mutation that creates a lesson comment.

Try two approaches:

1. update the Apollo cache manually
2. refetch the lesson comments query

Compare correctness, complexity, and network cost.

## Recap

Apollo caching depends on identity, variables, field policies, and mutation results.

The cache is powerful, but list updates, pagination, deletion, and filtered data require deliberate design.
