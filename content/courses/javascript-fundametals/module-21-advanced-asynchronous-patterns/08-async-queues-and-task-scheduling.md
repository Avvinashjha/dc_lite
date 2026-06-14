# Async Queues and Task Scheduling

An async queue stores work and processes it later.

Queues are useful when tasks arrive over time but should be handled in a controlled order.

## Why Use a Queue?

Use a queue when:

- user actions create background work
- tasks should run one at a time
- tasks should be retried later
- work should continue as new items arrive
- you want to smooth out bursts of activity

Example: uploading files selected by a user.

The user may select ten files at once, but your app may upload only two at a time.

## A Simple Sequential Queue

This queue processes one task at a time.

```js
function createQueue() {
  const tasks = [];
  let isProcessing = false;

  async function processQueue() {
    if (isProcessing) {
      return;
    }

    isProcessing = true;

    while (tasks.length > 0) {
      const task = tasks.shift();
      await task();
    }

    isProcessing = false;
  }

  return {
    add(task) {
      tasks.push(task);
      processQueue();
    },
  };
}
```

Usage:

```js
const queue = createQueue();

queue.add(async () => {
  await uploadFile(fileA);
});

queue.add(async () => {
  await uploadFile(fileB);
});
```

The second task waits until the first task finishes.

## Returning a Result From Queued Work

Often the caller needs a Promise for the queued task.

```js
function createResultQueue() {
  const tasks = [];
  let isProcessing = false;

  async function processQueue() {
    if (isProcessing) {
      return;
    }

    isProcessing = true;

    while (tasks.length > 0) {
      const { task, resolve, reject } = tasks.shift();

      try {
        resolve(await task());
      } catch (error) {
        reject(error);
      }
    }

    isProcessing = false;
  }

  return {
    add(task) {
      return new Promise((resolve, reject) => {
        tasks.push({ task, resolve, reject });
        processQueue();
      });
    },
  };
}
```

Usage:

```js
const queue = createResultQueue();

const result = await queue.add(async () => {
  return saveSettings(settings);
});
```

The caller can `await` the queued work.

## Task Scheduling

Scheduling means choosing when work should run.

The simplest scheduler is `setTimeout()`.

```js
setTimeout(() => {
  console.log("Run later");
}, 1000);
```

For Promise-based code, wrap it in a helper.

```js
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

await delay(1000);
console.log("Run later");
```

## Yielding to the Event Loop

Long synchronous loops can block the page.

You can split work into chunks and yield between chunks.

```js
async function processLargeList(items) {
  const chunkSize = 100;

  for (let index = 0; index < items.length; index += chunkSize) {
    const chunk = items.slice(index, index + chunkSize);

    for (const item of chunk) {
      processItem(item);
    }

    await delay(0);
  }
}
```

`await delay(0)` gives the runtime a chance to handle other work before continuing.

## Queue With Concurrency

A queue can also process more than one task at a time.

```js
function createConcurrentQueue(limit) {
  const tasks = [];
  let activeCount = 0;

  function runNext() {
    if (activeCount >= limit || tasks.length === 0) {
      return;
    }

    const { task, resolve, reject } = tasks.shift();
    activeCount += 1;

    task()
      .then(resolve, reject)
      .finally(() => {
        activeCount -= 1;
        runNext();
      });

    runNext();
  }

  return {
    add(task) {
      return new Promise((resolve, reject) => {
        tasks.push({ task, resolve, reject });
        runNext();
      });
    },
  };
}
```

Usage:

```js
const uploads = createConcurrentQueue(2);

await Promise.all(
  files.map((file) => uploads.add(() => uploadFile(file)))
);
```

Only two uploads run at the same time.

## Common Mistakes

Do not let a queue silently stop after one failed task.

Catch errors inside the processor and reject only that task's Promise.

Do not process too much synchronous work in one turn of the event loop.

Chunk large CPU-heavy work when the UI must remain responsive.

Do not build a complicated queue when a simple `for...of` loop is enough.

## Best Practices

- Use queues when work arrives over time.
- Use concurrency limits when multiple queued tasks may run safely.
- Return Promises so callers can observe success or failure.
- Decide whether task order matters.
- Keep queue code small unless you need advanced features.

## Summary

Async queues let you collect work and process it in a controlled way.

They help with background work, uploads, retries, and task bursts.

Scheduling helpers such as `delay()` can also keep long work from blocking everything else.
