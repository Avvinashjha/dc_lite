# Subscriptions

GraphQL subscriptions let clients receive pushed updates from the server.

They are commonly implemented over WebSockets, although the exact transport depends on the server and client setup.

## When Subscriptions Help

Use subscriptions when the server needs to notify the client quickly.

Good fits:

- chat messages
- live comments
- notifications
- collaborative editing
- job status updates
- presence updates

Avoid subscriptions when occasional polling is simpler and good enough.

## Subscription Operation

```graphql
subscription CommentAdded($lessonId: ID!) {
  commentAdded(lessonId: $lessonId) {
    id
    body
    author {
      id
      name
    }
    createdAt
  }
}
```

Subscriptions should be scoped. A user should subscribe only to data they are allowed to see.

## Apollo Subscription Setup

Apollo commonly uses a split link: HTTP for queries and mutations, WebSocket for subscriptions.

```js
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === "OperationDefinition" && definition.operation === "subscription";
  },
  wsLink,
  httpLink
);
```

The app still uses one `ApolloClient`, but operations travel through different transports.

## Using a Subscription

```jsx
const COMMENT_ADDED = gql`
  subscription CommentAdded($lessonId: ID!) {
    commentAdded(lessonId: $lessonId) {
      id
      body
      __typename
    }
  }
`;

function LiveComments({ lessonId }) {
  const { data } = useSubscription(COMMENT_ADDED, {
    variables: { lessonId },
  });

  useEffect(() => {
    if (data?.commentAdded) {
      // update local state or Apollo cache
    }
  }, [data]);

  return null;
}
```

Many apps subscribe inside the component or provider that owns the relevant list.

## Updating the Cache

Subscription payloads often need to be merged into the cache.

```jsx
useSubscription(COMMENT_ADDED, {
  variables: { lessonId },
  onData({ client, data }) {
    const comment = data.data?.commentAdded;
    if (!comment) return;

    client.cache.modify({
      id: client.cache.identify({ __typename: "Lesson", id: lessonId }),
      fields: {
        comments(existingRefs = [], { readField }) {
          const alreadyExists = existingRefs.some(
            (ref) => readField("id", ref) === comment.id
          );

          if (alreadyExists) return existingRefs;

          const newRef = client.cache.writeFragment({
            data: comment,
            fragment: gql`
              fragment LiveComment on Comment {
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

Deduplicate by ID. Subscriptions can deliver events already reflected by an optimistic mutation or refetch.

## Connection Auth

Subscription connections often need authentication.

The server must verify:

- who opened the connection
- which channels or topics they can subscribe to
- whether permissions changed during the connection
- whether the token expired

Do not assume that because a user loaded the page, every subscription event is allowed.

## Reconnection and Missed Events

Subscriptions can disconnect.

After reconnecting, the client may need to refetch current state.

```text
connected to comments
  -> laptop sleeps
  -> connection drops
  -> new comments are created
  -> reconnect
  -> refetch comments or request missed events
```

If exact delivery matters, use sequence numbers, durable events, or a backend recovery API.

## Common Mistakes

- Subscribing to broad global events instead of scoped data.
- Forgetting to update or deduplicate cache entries.
- Assuming every event is delivered exactly once.
- Ignoring auth changes after the socket connects.
- Opening duplicate subscriptions from repeated component mounts.
- Using subscriptions for data that polling could handle.

## Edge Case

A user creates a comment with an optimistic mutation and then receives the same comment through a subscription.

Without deduplication, the UI may show it twice.

:::quiz
question: Why should subscription handlers often deduplicate by ID?
options:
  - The same entity can arrive from optimistic updates, refetches, or subscription events
  - GraphQL does not allow repeated field names
  - React requires IDs to be numbers
  - WebSockets cannot send arrays
answer: 0
explanation: Realtime systems often receive the same logical update through multiple paths. Deduplication keeps lists correct.
:::

## Practical Challenge

Add live comments to a lesson page.

Design:

- subscription operation
- Apollo link setup
- cache update behavior
- deduplication rule
- reconnect recovery
- authorization checks
- fallback polling plan if WebSockets are unavailable

## Recap

GraphQL subscriptions bring realtime updates into the same typed API model as queries and mutations.

They still require WebSocket-style thinking: connection lifecycle, auth, missed events, deduplication, and careful cache updates.
