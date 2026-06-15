# React Query (TanStack Query)

TanStack Query, formerly React Query, is a server-state library.

It helps React apps fetch, cache, refetch, synchronize, and update API data.

It is not a replacement for local component state or global client state.

## Why It Exists

Manual fetching often repeats the same logic:

- loading state
- error state
- caching
- duplicate request prevention
- background refetching
- retries
- stale data handling
- mutation updates

TanStack Query centralizes these concerns.

## Query Client Setup

```jsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
```

The query client owns the cache.

## Reading Data With `useQuery`

```jsx
import { useQuery } from "@tanstack/react-query";

async function fetchProject(projectId) {
  const response = await fetch(`/api/projects/${projectId}`);

  if (!response.ok) {
    throw new Error("Could not load project");
  }

  return response.json();
}

function ProjectDetails({ projectId }) {
  const projectQuery = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchProject(projectId),
  });

  if (projectQuery.isLoading) return <p>Loading project...</p>;
  if (projectQuery.isError) return <p role="alert">{projectQuery.error.message}</p>;

  return <h1>{projectQuery.data.name}</h1>;
}
```

The `queryKey` identifies the cached data.

Include every variable that changes the request.

## Query Keys

Bad:

```js
useQuery({
  queryKey: ["project"],
  queryFn: () => fetchProject(projectId),
});
```

This caches all projects under the same key.

Good:

```js
useQuery({
  queryKey: ["project", projectId],
  queryFn: () => fetchProject(projectId),
});
```

The key should describe the data, not the component using it.

## Mutations

Use mutations for create, update, and delete operations.

```jsx
const queryClient = useQueryClient();

const updateProject = useMutation({
  mutationFn: (project) =>
    fetch(`/api/projects/${project.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["projects"] });
  },
});
```

Invalidation tells TanStack Query that related cached data should be refetched.

## Optimistic Updates Awareness

Optimistic updates show the expected result before the server confirms it.

They make interfaces feel fast, but must handle rollback on failure.

```js
useMutation({
  mutationFn: updateTodo,
  onMutate: async (updatedTodo) => {
    await queryClient.cancelQueries({ queryKey: ["todos"] });
    const previousTodos = queryClient.getQueryData(["todos"]);

    queryClient.setQueryData(["todos"], (todos = []) =>
      todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
    );

    return { previousTodos };
  },
  onError: (_error, _updatedTodo, context) => {
    queryClient.setQueryData(["todos"], context.previousTodos);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ["todos"] });
  },
});
```

Use this carefully for actions where rollback behavior is clear.

## Common Mistakes

- Using a query key that omits request variables.
- Treating query data as permanent client state.
- Forgetting to invalidate related queries after a mutation.
- Creating a new `QueryClient` inside a component render.
- Using optimistic updates without rollback.

:::quiz
question: What should a TanStack Query `queryKey` include?
options:
  - Only the component name
  - Every variable that affects the fetched data
  - A random value so the cache is always fresh
  - The HTTP method only
answer: 1
explanation: Query keys identify cached data, so they should include request variables such as IDs, filters, or pagination.
:::

## Practical Challenge

Build a projects page with:

- `useQuery` for `["projects"]`
- loading, error, and empty states
- a create-project mutation
- invalidation after successful creation

Then explain why the project list belongs in TanStack Query instead of a Redux slice.

## Recap

TanStack Query is a strong default for server state.

It handles cache lifecycle, request status, refetching, invalidation, and mutations so components can focus on rendering the data experience.
