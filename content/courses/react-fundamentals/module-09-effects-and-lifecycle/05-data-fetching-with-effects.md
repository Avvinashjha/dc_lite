# Data Fetching with Effects

Fetching data in an effect is common in client-rendered React apps, but it comes with edge cases: loading state, errors, race conditions, cancellation, and repeated requests.

Framework loaders and data libraries often handle these better. Still, understanding effect-based fetching is important.

## Basic Fetching Pattern

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadUser() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, [userId]);
}
```

This works as a starting point, but it has a race condition.

## Race Conditions

If `userId` changes from `1` to `2`, request `1` may finish after request `2`. The older response could overwrite newer data.

One simple fix is an ignore flag.

```jsx
useEffect(() => {
  let ignore = false;

  async function loadUser() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();

      if (!ignore) {
        setUser(data);
      }
    } catch (error) {
      if (!ignore) {
        setError(error);
      }
    } finally {
      if (!ignore) {
        setIsLoading(false);
      }
    }
  }

  loadUser();

  return () => {
    ignore = true;
  };
}, [userId]);
```

## Aborting Requests

`AbortController` can cancel fetch work that is no longer needed.

```jsx
useEffect(() => {
  const controller = new AbortController();

  async function loadUser() {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        signal: controller.signal,
      });
      const data = await response.json();
      setUser(data);
    } catch (error) {
      if (error.name !== "AbortError") {
        setError(error);
      }
    }
  }

  loadUser();

  return () => controller.abort();
}, [userId]);
```

Aborting is useful, but still handle stale results defensively when APIs or wrappers do not support cancellation.

## Loading and Empty States

Plan for:

- initial loading
- refetch loading
- empty results
- network errors
- server validation errors
- unauthorized responses

Users should know whether the app is waiting, failed, or truly has no data.

## When Not to Fetch in an Effect

Avoid effect fetching when:

- the framework has route loaders or server components
- data should be prefetched before rendering
- caching and deduplication matter
- many components need the same server state

In those cases, use the framework's data APIs or a library such as TanStack Query.

:::quiz
question: What race condition can happen when fetching in an effect?
options:
  - An older request can finish later and overwrite newer data
  - React can only run one fetch per application
  - JSON parsing always blocks rendering forever
answer: 0
explanation: Requests do not always finish in the order they started, so stale responses must be ignored or canceled.
:::

## Common Mistakes

Do not make the effect callback itself `async`.

```jsx
useEffect(async () => {
  // wrong: returns a promise instead of cleanup
}, []);
```

Define and call an async function inside the effect.

Do not ignore HTTP error status. `fetch` only rejects for network errors by default.

```jsx
if (!response.ok) {
  throw new Error("Request failed");
}
```

## Practice Challenge

Build a `UserDetails` component that fetches by `userId`.

Requirements:

- show loading, error, empty, and success states
- abort or ignore stale requests
- include `userId` in dependencies
- handle non-OK HTTP responses
- explain when you would replace this with a data-fetching library

## Recap

Effect-based fetching is useful but easy to get subtly wrong. Handle loading and errors, include dependencies, guard against stale responses, abort when possible, and use a data library when caching or coordination becomes important.
