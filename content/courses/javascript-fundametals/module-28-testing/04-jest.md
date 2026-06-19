# Jest

Jest is a popular JavaScript test runner and assertion library.

A test runner finds your test files, runs them, and reports whether they passed or failed.

An assertion library gives you functions like `expect()` so you can check results.

Jest includes both.

## A Simple Jest Test

Imagine this file:

```js
// math.js
export function add(a, b) {
  return a + b;
}
```

A Jest test might look like this:

```js
// math.test.js
import { add } from "./math.js";

test("adds two numbers", () => {
  expect(add(2, 3)).toBe(5);
});
```

When the test runs:

1. Jest imports the function.
2. The test calls `add(2, 3)`.
3. `expect(...).toBe(5)` checks the result.

## Test Files

Jest commonly recognizes files with names like:

- `math.test.js`
- `math.spec.js`
- `__tests__/math.js`

Projects can configure this differently, but those names are common.

## `test()` and `it()`

Jest supports both `test()` and `it()`.

```js
test("formats a user name", () => {
  // ...
});

it("formats a user name", () => {
  // ...
});
```

They do the same thing. Some teams prefer `it()` because it reads like a sentence:

```js
it("returns guest when the name is missing", () => {
  // ...
});
```

Pick one style and use it consistently in a project.

## Grouping Tests with `describe()`

Use `describe()` to group related tests.

```js
describe("formatPrice", () => {
  test("formats cents as dollars", () => {
    expect(formatPrice(1299)).toBe("$12.99");
  });

  test("formats zero", () => {
    expect(formatPrice(0)).toBe("$0.00");
  });
});
```

Grouping can make test output easier to scan.

## Common Matchers

Jest matchers are methods used after `expect()`.

| Matcher | Use |
| --- | --- |
| `toBe()` | primitive values or same object reference |
| `toEqual()` | object and array contents |
| `toContain()` | arrays or strings containing a value |
| `toBeTruthy()` | truthy values |
| `toBeFalsy()` | falsy values |
| `toThrow()` | expected thrown errors |

Examples:

```js
expect(2 + 2).toBe(4);
expect(["js", "css"]).toContain("js");
expect({ role: "admin" }).toEqual({ role: "admin" });
expect(() => JSON.parse("{")).toThrow();
```

## Testing Async Code

If a function returns a Promise, return or await that Promise in the test.

```js
async function getUserName(loadUser) {
  const user = await loadUser();
  return user.name;
}

test("returns the loaded user name", async () => {
  const loadUser = jest.fn().mockResolvedValue({ name: "Sam" });

  await expect(getUserName(loadUser)).resolves.toBe("Sam");
});
```

You can also write:

```js
test("returns the loaded user name", async () => {
  const loadUser = jest.fn().mockResolvedValue({ name: "Sam" });

  const name = await getUserName(loadUser);

  expect(name).toBe("Sam");
});
```

Both styles are valid. Choose the one that reads clearly.

## Mock Functions

`jest.fn()` creates a mock function.

A mock function can:

- stand in for a dependency
- remember how it was called
- return a controlled value

```js
test("calls the logger with a message", () => {
  const logger = jest.fn();

  logger("Saved");

  expect(logger).toHaveBeenCalledWith("Saved");
});
```

Mock functions are useful when the important behavior is that your code calls another function correctly.

## Setup and Cleanup

Jest provides lifecycle helpers:

```js
beforeEach(() => {
  // run before each test
});

afterEach(() => {
  jest.clearAllMocks();
});
```

Use `beforeEach()` for fresh setup that every test needs.

Use `afterEach()` to clear mocks, reset timers, or clean up DOM changes.

## Watch Mode

Many Jest projects support watch mode.

```bash
npm test -- --watch
```

Watch mode reruns tests as files change. It is useful while developing because feedback is quick.

The exact command depends on the project's `package.json`.

## Common Mistakes

Do not forget to `await` asynchronous behavior. A test can pass too early if the Promise is not handled.

Do not use `toBe()` for object contents:

```js
expect({ count: 1 }).toEqual({ count: 1 });
```

Do not make one test depend on a mock call from another test. Clear or recreate mocks for each test.

## Summary

Jest gives you a test runner, assertions, mocks, and setup helpers in one tool.

Core pieces to remember:

- `test()` defines a test
- `describe()` groups tests
- `expect()` creates assertions
- matchers such as `toBe()` and `toEqual()` check results
- `jest.fn()` creates mock functions
