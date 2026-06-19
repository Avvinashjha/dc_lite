# Mocks, Stubs, Spies, and Fetch

Tests often need to control dependencies.

If your function sends an API request, writes to storage, logs a message, or gets the current time, the test may not want to use the real dependency.

Test doubles are controlled replacements used during tests.

## Test Double Vocabulary

The words are sometimes used differently across teams, but these definitions are common:

| Term | Meaning |
| --- | --- |
| Dummy | A value passed only because an argument is required |
| Stub | A fake function with controlled behavior |
| Spy | A function that records how it was called |
| Mock | A fake object or function with expectations |

In casual JavaScript testing, "mock" is often used as a general word for any fake dependency.

## Why Use Test Doubles?

Use test doubles to:

- avoid real network calls
- avoid writing real data
- make errors predictable
- check that callbacks were called
- control time, randomness, or external state

They make tests faster and more reliable.

## Dependency Injection

Dependency injection means passing a dependency into a function instead of hard-coding it inside.

This makes code easier to test.

```js
export async function getUserName(userId, fetchJson) {
  const user = await fetchJson(`/api/users/${userId}`);
  return user.name;
}
```

Test it with a stub:

```js
test("returns a user name", async () => {
  const fetchJson = jest.fn().mockResolvedValue({ name: "Ravi" });

  const name = await getUserName(10, fetchJson);

  expect(name).toBe("Ravi");
  expect(fetchJson).toHaveBeenCalledWith("/api/users/10");
});
```

This test does not need a real API server.

## Testing Fetch Wrappers

Many projects wrap `fetch()` in helper functions.

```js
export async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}
```

To test this, you can replace `globalThis.fetch`.

```js
test("returns parsed JSON for successful responses", async () => {
  globalThis.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ name: "Ava" }),
  });

  await expect(fetchJson("/api/user")).resolves.toEqual({ name: "Ava" });

  expect(fetch).toHaveBeenCalledWith("/api/user");
});
```

Then test the error path:

```js
test("throws for failed responses", async () => {
  globalThis.fetch = jest.fn().mockResolvedValue({
    ok: false,
    status: 500,
  });

  await expect(fetchJson("/api/user")).rejects.toThrow("500");
});
```

## Cleaning Up Global Mocks

If you replace a global value, restore or reset it after the test.

```js
const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  jest.clearAllMocks();
});
```

Changing globals can leak into other tests if you do not clean up.

When possible, passing dependencies as arguments is cleaner than modifying globals.

## Spies

A spy records calls.

```js
export function notifyUser(user, sendEmail) {
  sendEmail(user.email, "Welcome!");
}
```

Test it:

```js
test("sends a welcome email", () => {
  const sendEmail = jest.fn();

  notifyUser({ email: "ava@example.com" }, sendEmail);

  expect(sendEmail).toHaveBeenCalledTimes(1);
  expect(sendEmail).toHaveBeenCalledWith("ava@example.com", "Welcome!");
});
```

The test does not send a real email. It checks that the dependency was called correctly.

## Stubs

A stub returns controlled data.

```js
const getCurrentUser = jest.fn().mockReturnValue({
  id: 1,
  role: "admin",
});
```

Use stubs when the code under test needs a dependency result.

## Mocking Failures

Tests should cover failure paths too.

```js
test("returns null when the request fails", async () => {
  const fetchUser = jest.fn().mockRejectedValue(new Error("Offline"));

  const result = await safelyLoadUser(fetchUser);

  expect(result).toBe(null);
});
```

Failure tests are important because error-handling code is easy to skip during manual testing.

## Avoiding Over-Mocking

Mocks are helpful, but too many mocks can make tests brittle.

If a test knows every internal function call, then a harmless refactor can break the test.

Prefer checking behavior:

```js
expect(result).toEqual({ status: "saved" });
```

Only check calls when the call itself is the important behavior:

```js
expect(saveUser).toHaveBeenCalledWith(user);
```

## Testing API Code Without Real APIs

For beginner-level tests, simple `fetch` mocks are enough.

In larger projects, teams may use tools that intercept requests, such as Mock Service Worker. The idea is still the same: tests should control the response and avoid depending on an external service for normal test runs.

## Common Mistakes

Do not call real production APIs from regular automated tests.

Do not leave global mocks active after a test.

Do not mock the function you are trying to test. Mock its external dependencies instead.

Do not assert every internal call unless those calls are the behavior the test is meant to protect.

## Summary

Mocks, stubs, and spies help tests control dependencies.

Use them for network requests, storage, timers, callbacks, and error paths. Keep mocks focused, clean them up, and prefer testing observable behavior over private implementation details.
