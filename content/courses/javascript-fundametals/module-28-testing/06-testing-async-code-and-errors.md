# Testing Async Code and Errors

JavaScript programs often use asynchronous code.

You may fetch data, wait for timers, read files, or call functions that return Promises. Tests need to wait for that work before making assertions.

## Testing Promise Results

Start with an async function:

```js
export async function getDisplayName(loadUser) {
  const user = await loadUser();
  return user.name || "Guest";
}
```

Test the successful result:

```js
test("returns the loaded user's name", async () => {
  const loadUser = jest.fn().mockResolvedValue({ name: "Mina" });

  const result = await getDisplayName(loadUser);

  expect(result).toBe("Mina");
});
```

The test function is marked `async`, and the call is awaited.

## Testing Fallback Behavior

Async tests still need edge cases.

```js
test("returns Guest when the user has no name", async () => {
  const loadUser = jest.fn().mockResolvedValue({});

  await expect(getDisplayName(loadUser)).resolves.toBe("Guest");
});
```

This style uses `resolves` to assert the Promise fulfillment value.

## Testing Rejections

If a Promise should reject, use `rejects`.

```js
export async function requireUser(loadUser) {
  const user = await loadUser();

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
```

Test it:

```js
test("rejects when the user is missing", async () => {
  const loadUser = jest.fn().mockResolvedValue(null);

  await expect(requireUser(loadUser)).rejects.toThrow("User not found");
});
```

Do not forget `await` before `expect(...).rejects`.

Without `await`, the test may finish before the rejection is checked.

## Testing `try...catch`

Some functions catch errors and return fallback values.

```js
export async function loadSettings(fetchSettings) {
  try {
    return await fetchSettings();
  } catch {
    return { theme: "light" };
  }
}
```

Test both branches:

```js
test("returns loaded settings", async () => {
  const fetchSettings = jest.fn().mockResolvedValue({ theme: "dark" });

  await expect(loadSettings(fetchSettings)).resolves.toEqual({
    theme: "dark",
  });
});

test("returns defaults when loading fails", async () => {
  const fetchSettings = jest.fn().mockRejectedValue(new Error("Network down"));

  await expect(loadSettings(fetchSettings)).resolves.toEqual({
    theme: "light",
  });
});
```

The second test checks the error path without needing a real failed network request.

## Testing Timers

Timer code can make tests slow or flaky if you wait for real time.

```js
export function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
```

Test frameworks often provide fake timers so tests can control time.

In Jest:

```js
test("runs after a timeout", () => {
  jest.useFakeTimers();

  const callback = jest.fn();
  setTimeout(callback, 1000);

  jest.advanceTimersByTime(1000);

  expect(callback).toHaveBeenCalled();

  jest.useRealTimers();
});
```

Fake timers are useful, but use them carefully. Always restore real timers when a test suite needs normal timer behavior later.

## Testing `Promise.all()`

When code runs tasks in parallel, test the final behavior.

```js
export async function loadDashboard({ loadUser, loadPosts }) {
  const [user, posts] = await Promise.all([loadUser(), loadPosts()]);

  return {
    userName: user.name,
    postCount: posts.length,
  };
}
```

Test it:

```js
test("loads dashboard data", async () => {
  const loadUser = jest.fn().mockResolvedValue({ name: "Ira" });
  const loadPosts = jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]);

  await expect(loadDashboard({ loadUser, loadPosts })).resolves.toEqual({
    userName: "Ira",
    postCount: 2,
  });
});
```

The test does not need to prove that `Promise.all()` works. It checks that your function combines the results correctly.

## Avoiding Flaky Async Tests

Flaky tests pass sometimes and fail other times.

Common async causes include:

- not awaiting Promises
- relying on real time delays
- depending on network availability
- sharing state between tests
- asserting before the code has finished

Prefer controlled dependencies and explicit `await`.

## Common Mistakes

Do not write tests like this:

```js
test("loads user", () => {
  getUser().then((user) => {
    expect(user.name).toBe("Ava");
  });
});
```

The test does not return or await the Promise, so the runner may finish too early.

Fix it:

```js
test("loads user", async () => {
  const user = await getUser();

  expect(user.name).toBe("Ava");
});
```

## Summary

Async tests must wait for async work.

Use `async` and `await`, or return the Promise. Test fulfilled values, rejected Promises, fallback behavior, and timer-based logic with controlled dependencies. A reliable async test should finish only after all important assertions have run.
