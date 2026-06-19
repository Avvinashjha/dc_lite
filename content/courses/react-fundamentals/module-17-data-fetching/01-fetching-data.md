# Fetching Data in React

React does not include a built-in data-fetching library.

You can fetch data manually with browser APIs, or use libraries that handle caching and synchronization.

The simplest manual pattern is `useEffect` plus state.

## A Basic Fetch

```jsx
function UsersList() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      setStatus("loading");
      setError(null);

      try {
        const response = await fetch("/api/users");

        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`);
        }

        const data = await response.json();
        setUsers(data);
        setStatus("success");
      } catch (err) {
        setError(err);
        setStatus("error");
      }
    }

    loadUsers();
  }, []);

  if (status === "loading") return <p>Loading users...</p>;
  if (status === "error") return <p>{error.message}</p>;

  return users.map((user) => <article key={user.id}>{user.name}</article>);
}
```

This is acceptable for small examples.

It becomes harder when you add retries, caching, deduplication, refetching, and cancellation.

## Effects Run After Render

`useEffect` runs after React renders.

That means the first render usually happens before the data exists.

Your component must handle empty or loading states.

```jsx
function Profile({ userId }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then((response) => response.json())
      .then(setProfile);
  }, [userId]);

  if (!profile) return <p>Loading profile...</p>;

  return <h1>{profile.name}</h1>;
}
```

Never assume fetched data is available during the first render.

## Dependency Arrays Matter

If a request depends on a prop or state value, include it in the effect dependency array.

```jsx
function SearchResults({ query }) {
  useEffect(() => {
    fetch(`/api/search?q=${encodeURIComponent(query)}`);
  }, [query]);
}
```

Leaving `query` out creates stale requests.

Adding unstable objects or functions can create repeated requests.

## Avoid Race Conditions

If `userId` changes quickly, an older request can finish after a newer request.

```jsx
useEffect(() => {
  let ignore = false;

  async function loadProfile() {
    const response = await fetch(`/api/users/${userId}`);
    const data = await response.json();

    if (!ignore) {
      setProfile(data);
    }
  }

  loadProfile();

  return () => {
    ignore = true;
  };
}, [userId]);
```

This prevents an outdated response from updating the component.

For real cancellation, use `AbortController`.

## Common Mistakes

- Fetching directly in the component body.
- Forgetting to handle loading, empty, and error states.
- Ignoring `response.ok` with `fetch`.
- Omitting dependencies from `useEffect`.
- Updating state after a component no longer cares about a request.

:::quiz
question: Why should API data usually be treated as missing on the first render?
options:
  - React blocks rendering until every fetch finishes
  - Effects run after render, so data often arrives later
  - `fetch` only works inside event handlers
  - State cannot store arrays
answer: 1
explanation: Data loaded in `useEffect` arrives after the initial render, so components need loading or fallback UI.
:::

## Practical Challenge

Build a `PostsList` component that:

- fetches `/api/posts`
- shows a loading message
- shows an error message when the request fails
- shows "No posts yet" for an empty array
- renders post titles with stable keys

## Recap

Manual fetching teaches the moving parts: effects, request status, errors, dependencies, and cleanup.

As the app grows, dedicated data-fetching libraries often reduce repeated code and handle server-state behavior more reliably.
