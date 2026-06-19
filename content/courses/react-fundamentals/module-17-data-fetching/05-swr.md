# SWR

SWR is a React data-fetching library created around the idea "stale while revalidate".

It returns cached data quickly, then revalidates in the background to keep the UI fresh.

This pattern is useful for many read-heavy interfaces.

## Basic SWR Usage

```jsx
import useSWR from "swr";

async function fetcher(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Request failed");
  }

  return response.json();
}

function Profile({ userId }) {
  const { data, error, isLoading } = useSWR(`/api/users/${userId}`, fetcher);

  if (isLoading) return <p>Loading profile...</p>;
  if (error) return <p role="alert">{error.message}</p>;

  return <h1>{data.name}</h1>;
}
```

The key identifies the request.

When the key changes, SWR fetches different data.

## Conditional Fetching

Use `null` as the key when a request is not ready.

```jsx
function Profile({ userId }) {
  const { data } = useSWR(userId ? `/api/users/${userId}` : null, fetcher);

  if (!userId) return <p>Select a user.</p>;
  if (!data) return <p>Loading...</p>;

  return <h1>{data.name}</h1>;
}
```

This avoids requests with missing IDs.

## Revalidation

SWR can revalidate when:

- a component mounts
- the browser window regains focus
- the network reconnects
- you manually call `mutate`
- a refresh interval is configured

This helps data stay fresh without writing custom effect logic.

## Mutating Cached Data

`mutate` can update or refetch cached data.

```jsx
import useSWR, { mutate } from "swr";

async function renameProject(projectId, name) {
  await fetch(`/api/projects/${projectId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  mutate(`/api/projects/${projectId}`);
}
```

After the update, SWR revalidates the project cache.

## SWR vs TanStack Query

Both libraries manage server state.

SWR is often appreciated for a small API and read-heavy flows.

TanStack Query has a broader feature set around mutations, cache control, devtools, infinite queries, and complex invalidation.

Either can be a good choice depending on app needs and team preference.

## Common Mistakes

- Using an unstable object as a key without understanding how it identifies the request.
- Forgetting conditional fetching when required values are missing.
- Treating stale data as always wrong instead of showing it during background revalidation.
- Using SWR for local UI state such as modals and tabs.
- Calling `mutate` on the wrong key.

:::quiz
question: What does "stale while revalidate" mean in UI data fetching?
options:
  - Show cached data first, then refresh it in the background
  - Delete cached data before every render
  - Block the UI until a fresh request completes
  - Store all data in localStorage forever
answer: 0
explanation: SWR can return stale cached data immediately and revalidate it so the UI remains responsive while becoming fresh.
:::

## Practical Challenge

Create a `UserMenu` component with SWR.

It should:

- fetch `/api/me`
- show loading and error states
- render the user's name
- skip the request when the app is known to be logged out

Then add a `refreshProfile` button that calls `mutate` for the same key.

## Recap

SWR is a focused server-state library built around cache-first rendering and background revalidation.

It is especially approachable for read-heavy data, while still supporting manual cache updates when needed.
