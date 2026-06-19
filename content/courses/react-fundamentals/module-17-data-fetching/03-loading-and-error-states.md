# Loading and Error States

Data fetching is not just "get data and render it".

A real UI needs to communicate what is happening.

At minimum, think about:

- loading
- success
- error
- empty
- refreshing stale data
- unauthorized or forbidden access

## A Simple Status Model

Use an explicit status instead of guessing from data.

```jsx
function TeamList() {
  const [teams, setTeams] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTeams() {
      setStatus("loading");
      setError(null);

      try {
        const response = await fetch("/api/teams");

        if (!response.ok) {
          throw new Error("Could not load teams");
        }

        setTeams(await response.json());
        setStatus("success");
      } catch (err) {
        setError(err);
        setStatus("error");
      }
    }

    loadTeams();
  }, []);

  if (status === "loading") return <p>Loading teams...</p>;
  if (status === "error") return <p role="alert">{error.message}</p>;
  if (teams.length === 0) return <p>No teams yet.</p>;

  return teams.map((team) => <article key={team.id}>{team.name}</article>);
}
```

An empty array is not the same as loading.

An error is not the same as empty.

## Avoid Spinner-Only Interfaces

A spinner without text may be inaccessible or unclear.

Prefer visible, meaningful status messages.

```jsx
<p aria-live="polite">Loading invoice details...</p>
```

For errors, `role="alert"` can help assistive technology announce the problem.

```jsx
<p role="alert">Payment history could not be loaded. Try again.</p>
```

## Retry Actions

Errors should often give the user a next step.

```jsx
function ErrorState({ message, onRetry }) {
  return (
    <div role="alert">
      <p>{message}</p>
      <button onClick={onRetry}>Try again</button>
    </div>
  );
}
```

Do not make the user refresh the entire page for a recoverable request.

## Background Refreshing

After initial data is loaded, a refetch should not always replace the page with a full-screen spinner.

```jsx
return (
  <>
    {isRefreshing && <p aria-live="polite">Refreshing...</p>}
    <ProjectTable projects={projects} />
  </>
);
```

Keeping stale data visible during refresh can make the UI feel more stable.

This is one reason query libraries are useful.

## Error Boundaries Are Not Enough

React error boundaries catch rendering errors.

They do not automatically catch failed async requests in an effect.

You still need request-level error handling.

## Common Mistakes

- Using `data.length === 0` to mean both loading and empty.
- Showing a spinner forever when a request fails.
- Hiding detailed errors from logs and showing raw technical messages to users.
- Removing existing data during every background refetch.
- Forgetting accessible status text and alert behavior.

:::quiz
question: Why is explicit request status useful?
options:
  - It prevents React from rendering
  - It lets the UI distinguish loading, error, empty, and success states
  - It removes the need for error handling
  - It makes all requests synchronous
answer: 1
explanation: A status field avoids guessing from data and helps render the right UI for each request phase.
:::

## Practical Challenge

Create a reusable `AsyncState` component that accepts:

- `status`
- `error`
- `isEmpty`
- `children`
- `onRetry`

Use it to render loading, error, empty, and success states for a list of tasks.

## Recap

Good loading and error states are part of the product experience.

Show clear status, distinguish empty from failed, keep stale data visible when appropriate, and give users a practical recovery path.
