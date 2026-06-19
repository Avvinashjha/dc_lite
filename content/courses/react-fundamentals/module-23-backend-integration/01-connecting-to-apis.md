# Connecting to APIs

Most React applications talk to systems outside the browser.

They load data, submit forms, authenticate users, upload files, receive real-time updates, and handle failures.

Good API integration is not just calling `fetch`. It is about timing, state, errors, cancellation, security, and user experience.

## The Basic Shape

A simple React data flow looks like this:

```text
component needs data
        |
        v
start request
        |
        v
show loading state
        |
        v
handle success or error
        |
        v
render result
```

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignored = false;

    async function loadUser() {
      try {
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) throw new Error("Failed to load user");
        const data = await response.json();
        if (!ignored) setUser(data);
      } catch (error) {
        if (!ignored) setError(error);
      }
    }

    loadUser();

    return () => {
      ignored = true;
    };
  }, [userId]);

  if (error) return <p>Could not load user.</p>;
  if (!user) return <p>Loading...</p>;
  return <h1>{user.name}</h1>;
}
```

This handles loading, success, error, and stale response cleanup.

## Request State

Avoid representing network state with only one boolean.

Useful states include:

- idle
- loading
- success
- empty
- error
- refreshing

```jsx
const [status, setStatus] = useState("idle");
```

This makes UI decisions clearer than juggling several booleans that can conflict.

## Race Conditions

A common bug happens when an older request finishes after a newer one.

```text
userId = 1 -> request A starts
userId = 2 -> request B starts
request B finishes first -> show user 2
request A finishes later -> accidentally show user 1
```

Use cleanup flags, `AbortController`, or a data fetching library that handles stale requests.

```jsx
useEffect(() => {
  const controller = new AbortController();

  async function load() {
    const response = await fetch(`/api/users/${userId}`, {
      signal: controller.signal,
    });
    const data = await response.json();
    setUser(data);
  }

  load().catch((error) => {
    if (error.name !== "AbortError") setError(error);
  });

  return () => controller.abort();
}, [userId]);
```

## Central API Helpers

For small apps, direct `fetch` calls may be fine.

For larger apps, create a small API helper.

```js
export async function apiJson(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}
```

Keep this helper boring. Avoid hiding too much behavior.

## Client Fetching vs Server Fetching

Fetch on the client when:

- data depends on browser-only state
- the user triggers the request
- the data updates frequently after load
- the page is fully client-rendered

Fetch on the server when:

- data is needed for first meaningful content
- secrets or database access are involved
- SEO matters
- the result can be cached near the server

Frameworks such as Next.js may support both.

## Common Mistakes

- Fetching during render instead of in an effect, event handler, route loader, or server component.
- Ignoring non-2xx HTTP responses.
- Showing only a spinner and no error or empty state.
- Updating state after a component unmounts or after a newer request has started.
- Duplicating API URL and header logic across many components.

## Security Awareness

The browser is not trusted.

Do not put private API keys, database credentials, or authorization secrets in React code. Anything in the client bundle can be inspected.

:::quiz
question: Why should API requests started in an effect often have cleanup?
options:
  - To avoid stale responses updating state after inputs change or the component unmounts
  - To make HTTP faster
  - To disable browser caching
  - To prevent JSX from rendering
answer: 0
explanation: Cleanup helps prevent old or aborted requests from updating the wrong render state.
:::

## Practical Challenge

Build a `useUser(userId)` hook that returns:

- `status`
- `user`
- `error`
- `refetch`

Handle loading, errors, aborting stale requests, and empty responses.

## Recap

API integration is a state management problem as much as a networking problem.

Plan for loading, errors, cancellation, stale responses, and security from the beginning.
