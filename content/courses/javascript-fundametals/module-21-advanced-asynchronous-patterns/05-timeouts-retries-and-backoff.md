# Timeouts, Retries, and Backoff

Network requests and async tasks can fail for temporary reasons.

A server may be busy. A connection may drop. A request may take too long.

Timeouts, retries, and backoff help make async code more resilient.

## Timeouts

A timeout stops waiting after a limit.

For `fetch()`, combine a timer with `AbortController`.

```js
async function fetchWithTimeout(url, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });

    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}
```

The timeout prevents a request from hanging forever.

## Retrying Failed Work

A retry runs the same operation again after it fails.

```js
async function retry(operation, maxAttempts = 3) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}
```

Usage:

```js
const data = await retry(async () => {
  const response = await fetch("/api/products");

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
});
```

## Not Every Failure Should Be Retried

Retry temporary failures.

Examples:

- network interruptions
- `408 Request Timeout`
- `429 Too Many Requests`
- `500`, `502`, `503`, or `504`

Do not usually retry errors caused by the request itself.

Examples:

- `400 Bad Request`
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`

Retrying a bad request usually sends the same bad request again.

## Adding Delay Between Retries

Retrying immediately can overload a server.

Add a small delay.

```js
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retryWithDelay(operation, maxAttempts = 3, delayMs = 500) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt < maxAttempts) {
        await wait(delayMs);
      }
    }
  }

  throw lastError;
}
```

## Exponential Backoff

Exponential backoff increases the delay after each failed attempt.

```js
function getBackoffDelay(attempt, baseDelayMs) {
  return baseDelayMs * 2 ** (attempt - 1);
}

console.log(getBackoffDelay(1, 500)); // 500
console.log(getBackoffDelay(2, 500)); // 1000
console.log(getBackoffDelay(3, 500)); // 2000
```

This gives the system more time to recover.

## Retry With Backoff

```js
async function retryWithBackoff(operation, options = {}) {
  const {
    maxAttempts = 3,
    baseDelayMs = 500,
    shouldRetry = () => true,
  } = options;

  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt === maxAttempts || !shouldRetry(error)) {
        break;
      }

      const delayMs = baseDelayMs * 2 ** (attempt - 1);
      await wait(delayMs);
    }
  }

  throw lastError;
}
```

Usage:

```js
const user = await retryWithBackoff(
  async () => {
    const response = await fetch("/api/user");

    if (!response.ok) {
      const error = new Error(`Request failed: ${response.status}`);
      error.status = response.status;
      throw error;
    }

    return response.json();
  },
  {
    maxAttempts: 4,
    shouldRetry: (error) => error.status >= 500 || error.status === 429,
  }
);
```

## Jitter

If many clients retry at the same exact times, they can overload the server again.

Jitter adds randomness to the delay.

```js
function addJitter(delayMs) {
  const randomExtra = Math.random() * delayMs * 0.25;
  return delayMs + randomExtra;
}
```

For beginner code, simple backoff is enough.

In production systems, jitter is often important.

## Idempotency

Before retrying, ask whether repeating the operation is safe.

Retrying a `GET` request is usually safe.

Retrying a payment, order creation, or email send can cause duplicates unless the API supports idempotency keys.

```js
await fetch("/api/orders", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Idempotency-Key": crypto.randomUUID(),
  },
  body: JSON.stringify(order),
});
```

An idempotency key lets the server recognize duplicate attempts.

## Common Mistakes

Do not retry forever.

```js
while (true) {
  await fetch("/api/data");
}
```

Always set a maximum attempt count.

Do not retry every error.

If the user is unauthorized, retries will not fix the token.

Do not forget to clear timeout timers.

Use `finally` when a timer is tied to an async operation.

## Best Practices

- Use timeouts for operations that should not wait forever.
- Retry only failures that may be temporary.
- Use exponential backoff to avoid hammering services.
- Add jitter for high-traffic or production retry systems.
- Be careful retrying operations that create or change data.

## Summary

Timeouts limit how long async work can run.

Retries can recover from temporary failures.

Backoff spaces retries out so your app is more reliable and more respectful of the systems it calls.
