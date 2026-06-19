# Async Errors and Promises

## Why It Matters

Most Node.js work is asynchronous. If async errors are not awaited, returned, or forwarded, requests hang, failures become unhandled rejections, and tests pass while production loses work.

## Core Concepts

- `async` functions return promises.
- Throwing inside an `async` function rejects the returned promise.
- `try/catch` catches awaited promise rejections.
- Parallel promises need explicit handling with `Promise.all`, `Promise.allSettled`, or cancellation strategy.
- Unhandled rejections should be treated as serious application bugs.

## Flow to Remember

An async operation rejects, `await` turns the rejection into a thrown error, `try/catch` handles it or the rejection propagates to the caller.

## Syntax and Examples

```js
import { setTimeout as delay } from 'node:timers/promises';

async function fetchUserProfile(userId) {
  if (!userId) throw new Error('userId is required');
  await delay(10);
  return { id: userId, name: 'Asha' };
}

try {
  const profile = await fetchUserProfile('user_123');
  console.log(profile);
} catch (error) {
  console.error('Could not load profile', error);
}

const results = await Promise.allSettled([
  fetchUserProfile('user_1'),
  fetchUserProfile('')
]);
console.log(results);
```

## Use Cases and Tradeoffs

- Use `try/catch` around awaited work when you can recover or add context.
- Use `Promise.all` when all tasks must succeed.
- Use `Promise.allSettled` when partial success is meaningful.
- Return promises from test cases and middleware wrappers so failures are visible.

## Common Mistakes

- Starting a promise and never awaiting it.
- Using `forEach(async () => {})` and expecting the loop to wait.
- Catching an error only to throw a new one without cause/context.
- Mixing callbacks and promises from the same API incorrectly.

## Practical Challenge

Refactor an async `forEach` loop that sends emails into a `for...of` loop for sequential sends and a `Promise.allSettled` version for parallel sends.

## Recap

- Async errors are promise rejections.
- `await` plus `try/catch` makes failures explicit.
- Parallel async work needs a deliberate success/failure policy.

