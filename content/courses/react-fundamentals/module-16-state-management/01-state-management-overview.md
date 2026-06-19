# State Management Overview

State management is the practice of deciding where data lives, how it changes, and which parts of the UI can read it.

In React, the simplest state management tool is still component state.

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

The hard part is not learning more libraries.

The hard part is choosing the smallest place where state can live without making the application confusing.

## Four Common Kinds of State

React applications usually contain several different kinds of state.

| Kind | Examples | Usually Stored In |
| --- | --- | --- |
| Local UI state | open modal, selected tab, form draft | component state |
| Shared client state | current theme, authenticated user, cart contents | lifted state, Context, or store |
| Server state | products, posts, profile loaded from an API | TanStack Query, SWR, or custom fetching |
| URL state | search text, filters, pagination, selected item id | route params or query string |

Treating every kind of state the same way is a common source of over-engineering.

## Local State

Use local state when only one component or a small group of nearby components need the value.

```jsx
function SearchBox() {
  const [query, setQuery] = useState("");

  return (
    <label>
      Search
      <input value={query} onChange={(event) => setQuery(event.target.value)} />
    </label>
  );
}
```

This state should not automatically move to a global store.

If a parent needs the value, lift it up to the closest shared parent.

## Server State Is Different

Server state does not belong fully to the browser.

It can become stale, fail to load, be shared by many screens, and need background refreshes.

```jsx
function ProductList() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    setStatus("loading");

    fetch("/api/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, []);

  if (status === "loading") return <p>Loading products...</p>;
  if (status === "error") return <p>Could not load products.</p>;

  return products.map((product) => <article key={product.id}>{product.name}</article>);
}
```

This works for simple cases, but repeated API state often benefits from a server-state library.

## URL State

State that should survive refresh, back/forward navigation, or sharing a link often belongs in the URL.

```jsx
// /products?category=books&page=2
const params = new URLSearchParams(window.location.search);
const category = params.get("category") ?? "all";
const page = Number(params.get("page") ?? "1");
```

Filters, page numbers, selected tabs, and sort orders are often better as URL state than global state.

## Common Mistakes

- Putting every value into Context or Redux because it is "state".
- Storing server data in a client store and then manually rebuilding caching, retries, and refetching.
- Duplicating the same value in local state and global state.
- Keeping route-specific filters in memory instead of the URL.
- Lifting state too high before more than one component actually needs it.

## Awareness Note

There is no universal "best" state management library.

A small form, a data-heavy dashboard, and an offline-first editor have different needs.

Choose based on ownership, update frequency, debugging needs, team familiarity, and whether the state is local, server, global, or URL-based.

:::quiz
question: Which state is usually a good candidate for URL state?
options:
  - A product list filter that should be shareable as a link
  - Whether a dropdown is currently open
  - The current mouse position during a drag
  - A temporary password confirmation field
answer: 0
explanation: Shareable filters should often live in the URL so refresh, browser history, and copied links preserve them.
:::

## Practical Challenge

Look at a page in one of your React apps.

Write down every piece of state on the page and label it as local UI state, shared client state, server state, or URL state.

Then choose one value that is stored too globally and one value that is not stored globally enough.

## Recap

Good state management starts with classification.

Keep local state local, put shareable navigation state in the URL, use server-state tools for API data when complexity grows, and reserve global client stores for state that truly belongs to the whole app.
