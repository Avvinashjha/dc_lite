# Practical Memory Debugging

Memory bugs can feel mysterious because garbage collection runs automatically.

A practical approach is to look for growth over time and then find what is keeping old values reachable.

## Signs of a Memory Problem

Possible signs include:

- the page or app gets slower the longer it runs
- memory usage keeps increasing after repeated actions
- old screens or components still respond to events
- timers continue after a feature is closed
- performance gets worse after loading many records
- browser tabs crash or reload under memory pressure

Short-term memory growth is normal. The warning sign is memory that keeps growing after the same action is repeated and cleaned up.

## Reproduce the Pattern

Memory debugging starts with a repeatable action.

Examples:

- open and close a modal 20 times
- navigate between two screens repeatedly
- run the same search many times
- load and clear a large data table
- create and remove many DOM elements

If memory grows each time and never settles, something may be retained.

## Use Browser DevTools

Browser developer tools can help you inspect memory.

Common tools include:

- heap snapshots
- allocation timelines
- performance recordings
- detached DOM node views
- object retainers or retaining paths

The exact UI changes across browsers, but the main question stays the same: what is retaining this object?

## Compare Snapshots

A common workflow is:

1. Take a heap snapshot before the action.
2. Perform the action many times.
3. Run cleanup, such as closing the modal or navigating away.
4. Take another heap snapshot.
5. Compare what increased.

Look for objects that should have disappeared but did not.

## Retaining Paths

A retaining path shows why an object is still reachable.

For example, a detached DOM node might be retained by:

```text
window -> appState -> selectedCard -> element
```

Or a large API response might be retained by:

```text
window -> cache -> Map entry -> response object
```

Once you find the retaining path, the fix is usually to remove or limit the reference.

## Debugging With Cleanup Functions

When you create long-lived work, pair it with cleanup.

```js
function mountSearch(input) {
  function handleInput() {
    search(input.value);
  }

  input.addEventListener("input", handleInput);

  return function unmountSearch() {
    input.removeEventListener("input", handleInput);
  };
}
```

This structure makes it easier to verify that cleanup happens.

## Large Data Structures

Large arrays, maps, and response objects can cause memory pressure even without a leak.

```js
const rows = await response.json();
renderTable(rows);
```

If the dataset is huge, consider:

- pagination
- streaming
- processing chunks
- storing only fields you need
- clearing old results before loading new ones
- virtualizing long lists in the UI

Reducing peak memory can be just as important as fixing leaks.

## Async Memory Pressure

Starting many async tasks at once can hold many intermediate values in memory.

```js
const results = await Promise.all(urls.map((url) => fetch(url).then((r) => r.json())));
```

This loads all results into memory at once.

For very large workloads, limit concurrency or process results in smaller batches.

```js
async function loadInBatches(urls, batchSize) {
  const results = [];

  for (let index = 0; index < urls.length; index += batchSize) {
    const batch = urls.slice(index, index + batchSize);
    const batchResults = await Promise.all(
      batch.map((url) => fetch(url).then((response) => response.json()))
    );

    results.push(...batchResults);
  }

  return results;
}
```

## Prevention Checklist

Ask these questions during code review:

- Does this collection grow forever?
- Is this timer cleared?
- Is this event listener removed?
- Is this subscription unsubscribed?
- Is this request aborted or guarded when stale?
- Does this closure capture a large object unnecessarily?
- Does this cache need a size or time limit?
- Are removed DOM nodes still referenced?

## Common Mistakes

- Looking only at total memory instead of repeated growth after cleanup.
- Ignoring retaining paths in heap snapshots.
- Treating all memory growth as a leak.
- Loading huge datasets all at once when batching would be simpler and safer.

## Summary

Memory debugging is about evidence. Reproduce growth, compare snapshots, inspect retaining paths, and remove unnecessary references.

Most prevention comes from clear ownership, bounded collections, and reliable cleanup.
