# Concurrent Rendering

Concurrent rendering lets React prepare UI updates without blocking the page for one long uninterrupted render.

It does not mean your components run on multiple threads. It means React can pause work, resume it, abandon it, and prioritize more urgent updates.

## Why Concurrency Exists

Some updates are urgent.

Examples:

- typing into an input
- clicking a button
- opening a menu

Other updates can wait a little.

Examples:

- filtering a large list
- rendering search results
- switching a complex tab
- showing non-critical suggestions

Without concurrency, a large render can block urgent input.

## A Mental Model

```text
User types "r"
  urgent: keep input responsive
  less urgent: render 5,000 filtered results

React can:
  update the input first
  start rendering results
  pause if more input arrives
  throw away stale result work
  commit the latest useful result
```

This is possible only if rendering is pure.

## Transitions

`startTransition` marks an update as less urgent.

```jsx
import { startTransition, useState } from "react";

function ProductSearch({ products }) {
  const [query, setQuery] = useState("");
  const [filteredQuery, setFilteredQuery] = useState("");

  function handleChange(event) {
    const nextQuery = event.target.value;
    setQuery(nextQuery);

    startTransition(() => {
      setFilteredQuery(nextQuery);
    });
  }

  const visibleProducts = products.filter((product) =>
    product.name.toLowerCase().includes(filteredQuery.toLowerCase())
  );

  return (
    <>
      <input value={query} onChange={handleChange} />
      <ProductList products={visibleProducts} />
    </>
  );
}
```

The input state is urgent. The filtered list update can be interrupted if the user keeps typing.

## `useTransition`

`useTransition` gives you a pending flag.

```jsx
function TabSwitcher() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState("overview");

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }

  return (
    <>
      {isPending && <p>Updating tab...</p>}
      <button onClick={() => selectTab("overview")}>Overview</button>
      <button onClick={() => selectTab("reports")}>Reports</button>
      <Panel tab={tab} />
    </>
  );
}
```

Use transitions when keeping the current UI responsive is better than immediately blocking on the next UI.

## Deferred Values

`useDeferredValue` lets a value lag behind.

```jsx
function SearchResults({ query, products }) {
  const deferredQuery = useDeferredValue(query);

  const results = products.filter((product) =>
    product.name.toLowerCase().includes(deferredQuery.toLowerCase())
  );

  return <ProductList products={results} />;
}
```

The input can update immediately while the expensive result list follows behind.

## What Concurrency Does Not Fix

Concurrent rendering does not make expensive work disappear.

If filtering 100,000 items takes too long, consider:

- server-side filtering
- indexing
- virtualization
- memoization
- web workers
- pagination

Concurrency improves responsiveness. It is not a replacement for reducing work.

## External Systems Need Care

Concurrent rendering makes render-time side effects especially dangerous.

```jsx
function BadLogger({ value }) {
  analytics.track("rendered", { value }); // bad
  return <p>{value}</p>;
}
```

React may render this component and never commit it. The analytics event would describe UI the user never saw.

Put external effects in effects or event handlers.

## Suspense Awareness

Suspense works with concurrent rendering to show fallbacks while waiting for something.

```jsx
<Suspense fallback={<p>Loading profile...</p>}>
  <Profile />
</Suspense>
```

Depending on the framework and data layer, React can keep existing UI visible while preparing the next screen.

## Common Mistakes

- Expecting concurrency to run JavaScript on another CPU thread.
- Wrapping every update in `startTransition`.
- Using transitions for controlled input state itself.
- Leaving expensive calculations unoptimized and expecting React to hide them.
- Performing side effects during render.

## Edge Cases

A transition can be interrupted by a newer transition. That is usually good.

If you start a transition for search results and the user types again, React can skip committing stale results.

Code should not depend on every intermediate render being visible.

:::quiz
question: What does `startTransition` communicate to React?
options:
  - The enclosed state update is less urgent and may be interrupted
  - The enclosed code should run on a worker thread
  - The enclosed code should never re-render
  - The enclosed update should skip reconciliation
answer: 0
explanation: Transitions mark updates as non-urgent. React can prioritize urgent updates and interrupt transition work.
:::

## Practical Challenge

Create a searchable list with a controlled input and a large result set.

Try three versions:

1. no transition
2. `startTransition` for result updates
3. `useDeferredValue` for the query passed to results

Use the browser Performance panel to compare responsiveness.

## Recap

Concurrent rendering allows React to prepare, pause, retry, and discard render work.

The feature depends on pure rendering and shines when urgent UI should stay responsive while less urgent UI catches up.
