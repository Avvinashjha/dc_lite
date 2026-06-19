# for await...of and Streaming Data

`for await...of` lets you loop over async iterables.

It is most useful when data arrives in pieces instead of all at once.

This is the mental model behind many streaming APIs.

## Why Streaming Matters

Some data is small enough to load all at once.

```js
const response = await fetch("/api/users");
const users = await response.json();
```

But some data is large or continuous:

- a large file
- a long API response
- live chat messages
- logs
- sensor data

For these cases, processing chunks as they arrive can be more efficient.

## The Basic Syntax

Use `for await...of` inside an async function or module.

```js
async function printValues(asyncIterable) {
  for await (const value of asyncIterable) {
    console.log(value);
  }
}
```

Each loop step waits for the next value.

## A Simple Async Stream

Here is an async generator that acts like a small stream.

```js
async function* downloadChunks() {
  yield "chunk 1";

  await new Promise((resolve) => setTimeout(resolve, 300));
  yield "chunk 2";

  await new Promise((resolve) => setTimeout(resolve, 300));
  yield "chunk 3";
}

for await (const chunk of downloadChunks()) {
  console.log(chunk);
}
```

Output:

```txt
chunk 1
chunk 2
chunk 3
```

The values are handled as they arrive.

## Streaming Instead of Waiting

Imagine a report with thousands of rows.

Waiting for every row before showing anything can make the app feel slow.

An async iterable lets the UI update gradually.

```js
async function renderReport(rows) {
  for await (const row of rows) {
    addRowToTable(row);
  }
}
```

The function can display each row without needing the entire report in memory.

## Reading Fetch Response Streams

Modern browsers expose response bodies as streams.

The exact APIs are more advanced, but the idea is familiar: read chunks until the stream is done.

```js
async function readTextStream(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let result = "";

  while (true) {
    const { value, done } = await reader.read();

    if (done) {
      break;
    }

    result += decoder.decode(value, { stream: true });
  }

  result += decoder.decode();
  return result;
}
```

This example uses a `ReadableStream` reader directly.

Some runtimes and libraries wrap streams as async iterables, which makes them usable with `for await...of`.

## Creating a Stream-Like Helper

You can wrap repeated async work in an async generator.

```js
async function* pollUntilComplete(jobId) {
  while (true) {
    const response = await fetch(`/api/jobs/${jobId}`);
    const job = await response.json();

    yield job;

    if (job.status === "complete" || job.status === "failed") {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
```

Now the caller can decide what to do with each status update.

```js
for await (const job of pollUntilComplete("job_123")) {
  updateProgress(job.progress);
}
```

## Breaking Early

You can stop a `for await...of` loop with `break`.

```js
for await (const message of incomingMessages()) {
  if (message.type === "error") {
    break;
  }

  renderMessage(message);
}
```

If the async generator has a `finally` block, it can clean up when the loop exits.

## Sequential by Design

`for await...of` waits for each next value.

That is exactly what you want for streams, where order often matters.

But it is not the same as running many tasks in parallel.

```js
for await (const file of filesToUpload()) {
  await uploadFile(file);
}
```

This uploads one file at a time.

If you need controlled parallel work, use a concurrency limit pattern later in this module.

## Common Mistakes

Do not use `Array.prototype.forEach()` with `await` and expect it to pause the outer function.

```js
items.forEach(async (item) => {
  await saveItem(item);
});

console.log("This runs before saves finish");
```

Use `for...of` or `for await...of` when you need sequential waiting.

```js
for (const item of items) {
  await saveItem(item);
}
```

Do not stream if you need the entire result before doing anything.

For small data, simple `await response.json()` is often clearer.

## Best Practices

- Use `for await...of` for async values that arrive over time.
- Keep stream processing incremental.
- Use `break` when you no longer need more values.
- Handle errors around the whole loop.
- Choose sequential streaming deliberately; do not assume it is parallel.

## Summary

`for await...of` consumes async iterables one value at a time.

It is a natural fit for streaming data, polling status updates, paginated results, and async sources where values arrive gradually.

Streaming patterns help apps respond sooner and avoid loading everything into memory at once.
