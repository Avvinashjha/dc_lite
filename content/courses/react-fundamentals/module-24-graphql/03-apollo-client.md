# Apollo Client

Apollo Client is a popular GraphQL client for React.

It handles sending operations, tracking loading and error state, caching normalized data, updating UI after mutations, and working with subscriptions.

## Setup

A typical setup creates one client and provides it to React.

```jsx
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "/graphql",
  cache: new InMemoryCache(),
});

export function AppProviders({ children }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
```

Create the client outside components so it is not recreated on every render.

## Running a Query

```jsx
import { gql, useQuery } from "@apollo/client";

const GET_VIEWER = gql`
  query GetViewer {
    viewer {
      id
      name
    }
  }
`;

function ViewerName() {
  const { data, loading, error } = useQuery(GET_VIEWER);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Could not load viewer.</p>;

  return <p>{data.viewer.name}</p>;
}
```

Handle loading and error states near the UI that depends on them.

## Query Variables

```jsx
const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      name
    }
  }
`;

function ProjectHeader({ projectId }) {
  const { data } = useQuery(GET_PROJECT, {
    variables: { id: projectId },
  });

  return <h1>{data?.project?.name || "Project"}</h1>;
}
```

When variables change, Apollo knows it is a different operation result.

## Running a Mutation

```jsx
const RENAME_PROJECT = gql`
  mutation RenameProject($id: ID!, $name: String!) {
    renameProject(id: $id, name: $name) {
      id
      name
    }
  }
`;

function RenameProjectForm({ project }) {
  const [renameProject, { loading }] = useMutation(RENAME_PROJECT);

  async function handleSubmit(name) {
    await renameProject({
      variables: { id: project.id, name },
    });
  }

  return <button disabled={loading}>Save</button>;
}
```

If the mutation returns the changed object with the same `id` and `__typename`, Apollo can update the normalized cache automatically.

## Fetch Policies

Fetch policies control how Apollo uses cache and network.

Common policies:

- `cache-first`: use cache if possible, otherwise network
- `network-only`: always fetch from network, then update cache
- `cache-and-network`: show cache first, then refresh
- `no-cache`: do not write result to cache

```jsx
useQuery(GET_REPORT, {
  fetchPolicy: "cache-and-network",
});
```

Choose based on freshness needs and user experience.

## Authentication Headers

Apollo links can add auth headers.

```js
const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    Authorization: accessToken ? `Bearer ${accessToken}` : "",
  },
}));
```

Do not store secrets in the client. The token strategy still needs secure design.

## Error Handling

Apollo can expose GraphQL errors and network errors.

Plan for:

- field validation errors
- unauthenticated requests
- forbidden access
- partial data
- offline state
- retry rules

Global error links can help with logging or auth expiration, but user-facing messages usually belong near the relevant UI.

## Common Mistakes

- Creating a new `ApolloClient` inside a component render.
- Using `network-only` everywhere and losing cache benefits.
- Assuming every mutation updates every affected list automatically.
- Ignoring variables when reasoning about cached query results.
- Hiding all errors behind one generic toast.

:::quiz
question: Where should an Apollo Client instance usually be created?
options:
  - Outside normal component render so the same client is reused
  - Inside every component that calls `useQuery`
  - Inside JSX returned from a list
  - Only inside a mutation callback
answer: 0
explanation: Recreating the client can reset cache and cause unnecessary work. Apps usually create one shared client and pass it through `ApolloProvider`.
:::

## Practical Challenge

Create an Apollo setup for a course app.

Include:

- shared client
- cache setup
- auth header link
- current user query
- lesson query with variables
- mutation to mark lesson complete
- UI states for loading, error, and success

## Recap

Apollo Client connects React to GraphQL operations and a normalized cache.

Use it deliberately: choose fetch policies, return useful mutation fields, handle errors clearly, and keep the client setup stable.
