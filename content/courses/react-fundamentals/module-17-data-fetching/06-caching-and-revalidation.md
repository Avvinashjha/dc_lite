# Caching and Revalidation

Caching means keeping a copy of data so future reads can be faster or smoother.

Revalidation means checking whether cached data is still correct.

Good data-fetching design balances speed, freshness, and complexity.

## Why Cache Server State?

Without caching, every component may repeat the same request.

```jsx
function Header() {
  const user = useUser();
  return <span>{user.name}</span>;
}

function SettingsPage() {
  const user = useUser();
  return <h1>{user.name}</h1>;
}
```

If both components fetch `/api/me` separately, the app may waste network requests and show inconsistent loading states.

Server-state libraries dedupe and cache shared requests.

## Stale Is Not Always Bad

Cached data can be stale but still useful.

For example, showing yesterday's account name for half a second while refreshing is often better than showing a blank page.

Ask:

- How wrong can the data be before it harms the user?
- How often does the server data change?
- Should the user see stale data while refreshing?
- Does the action need immediate confirmation?

## Cache Keys

A cache key must uniquely describe the data.

```js
["products", { category: "books", page: 2 }]
```

If the category or page changes, the data changes, so the key must change.

Bad keys create bugs where one screen shows another screen's data.

## Revalidation Triggers

Common revalidation triggers include:

- component mount
- window focus
- network reconnect
- manual refresh
- mutation success
- time-based polling

```js
queryClient.invalidateQueries({ queryKey: ["todos"] });
```

Invalidation says, "This cached data may no longer be correct."

## Cancellation With AbortController

Cancellation prevents work from continuing when the result is no longer needed.

```jsx
useEffect(() => {
  const controller = new AbortController();

  async function search() {
    try {
      const response = await fetch(`/api/search?q=${query}`, {
        signal: controller.signal,
      });

      setResults(await response.json());
    } catch (error) {
      if (error.name !== "AbortError") {
        setError(error);
      }
    }
  }

  search();

  return () => {
    controller.abort();
  };
}, [query]);
```

This is especially important for search boxes, route changes, and slow requests.

## Optimistic Updates

Optimistic updates update the UI before the server responds.

They work best when:

- the expected result is obvious
- failure is rare
- rollback is possible
- the UI clearly communicates pending state when needed

Example: checking a todo item can be optimistic.

Example: transferring money should usually wait for confirmed server success.

## Common Mistakes

- Caching data under a key that misses filters or IDs.
- Refetching too often and wasting network resources.
- Never revalidating and showing old data forever.
- Cancelling requests but still treating `AbortError` as a user-facing failure.
- Using optimistic updates for actions that cannot safely roll back.

:::quiz
question: What is the purpose of invalidating a query after a successful mutation?
options:
  - To tell the cache that related data may be stale and should be refetched
  - To permanently delete the user's browser cache
  - To stop React from rendering the component
  - To convert local state into URL state
answer: 0
explanation: Invalidation marks cached data as potentially outdated so the query library can refetch it.
:::

## Practical Challenge

Design a caching strategy for a notifications dropdown.

Decide:

- when it should fetch
- whether it should refetch on window focus
- whether marking a notification as read should be optimistic
- which query keys you would use
- how cancellation should work if the dropdown closes quickly

## Recap

Caching is about reuse, not just speed.

Revalidation keeps cached data honest.

Use strong cache keys, thoughtful refresh triggers, request cancellation, and careful optimistic updates to build interfaces that feel fast without lying to users.
