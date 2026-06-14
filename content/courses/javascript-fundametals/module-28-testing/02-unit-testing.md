# Unit Testing

A unit test checks one small piece of code.

In JavaScript, that usually means testing one function, one method, or one small module at a time.

## A Small Function

Start with a function that has clear inputs and outputs.

```js
export function addTax(price, taxRate) {
  return price + price * taxRate;
}
```

A unit test asks a specific question:

> When the price is `100` and the tax rate is `0.08`, does the function return `108`?

The test does not need to know how the function is written internally. It only checks the behavior.

## Test Anatomy

Most tests follow three steps:

1. Arrange
2. Act
3. Assert

Arrange means preparing the data.

Act means running the code being tested.

Assert means checking the result.

```js
import { addTax } from "./pricing.js";

test("adds tax to a price", () => {
  // Arrange
  const price = 100;
  const taxRate = 0.08;

  // Act
  const result = addTax(price, taxRate);

  // Assert
  expect(result).toBe(108);
});
```

This pattern is often called AAA: arrange, act, assert.

## Assertions

An assertion is a check that must be true for the test to pass.

Common assertions include:

```js
expect(total).toBe(42);
expect(user.name).toBe("Maya");
expect(items).toEqual(["a", "b"]);
expect(result).toBeTruthy();
expect(errorMessage).toContain("required");
```

Different test libraries use slightly different assertion names, but the idea is the same: compare the actual result with the expected result.

## `toBe()` vs `toEqual()`

In Jest and many similar assertion libraries, `toBe()` checks strict identity.

```js
expect(2 + 2).toBe(4);
```

For arrays and objects, use deep equality.

```js
expect(["admin", "editor"]).toEqual(["admin", "editor"]);
expect({ active: true }).toEqual({ active: true });
```

Two different object literals are not the same object in memory, even if they contain the same values. That is why `toEqual()` is used for object and array contents.

## Testing Pure Functions

Pure functions are excellent candidates for unit tests.

A pure function:

- returns the same output for the same input
- does not change outside state
- does not mutate its arguments

```js
export function getActiveUsers(users) {
  return users.filter((user) => user.active);
}
```

Test it:

```js
test("returns only active users", () => {
  const users = [
    { id: 1, active: true },
    { id: 2, active: false },
    { id: 3, active: true },
  ];

  expect(getActiveUsers(users)).toEqual([
    { id: 1, active: true },
    { id: 3, active: true },
  ]);
});
```

This test is easy to understand because the function does not depend on the DOM, time, network, random numbers, or external variables.

## Testing Edge Cases

An edge case is an input near a boundary or unusual condition.

For a discount function, important edge cases might be:

- exactly the minimum total
- one cent below the minimum
- zero
- negative input, if possible

```js
export function getDiscountPercent(total) {
  if (total >= 100) {
    return 10;
  }

  return 0;
}
```

Useful tests:

```js
test("returns no discount below 100", () => {
  expect(getDiscountPercent(99.99)).toBe(0);
});

test("returns discount at exactly 100", () => {
  expect(getDiscountPercent(100)).toBe(10);
});
```

Boundary tests often catch off-by-one and comparison mistakes.

## Testing Errors

If a function is supposed to throw, test that behavior directly.

```js
export function parsePositiveNumber(value) {
  const number = Number(value);

  if (!Number.isFinite(number) || number <= 0) {
    throw new Error("Expected a positive number");
  }

  return number;
}
```

Test it:

```js
test("throws for invalid input", () => {
  expect(() => parsePositiveNumber("abc")).toThrow("positive number");
});
```

Notice the function call is wrapped in another function:

```js
() => parsePositiveNumber("abc")
```

That lets the test runner catch the thrown error.

## What Makes a Good Unit Test?

A good unit test is:

- focused on one behavior
- easy to read
- deterministic
- fast
- independent from other tests

Deterministic means the test should pass or fail for the same reason every time.

If a test sometimes passes and sometimes fails without code changes, it is called flaky.

## Common Mistakes

Do not test too many behaviors in one test. If it fails, you want the failure message to point to one clear problem.

Do not use vague test names like `"works"`. Prefer names that describe behavior:

```js
test("returns 0 discount for totals below 100", () => {
  // ...
});
```

Do not mutate shared data between tests. Shared mutation can make tests depend on order.

## Summary

Unit tests check small pieces of code.

The basic structure is arrange, act, assert.

Pure functions are often the easiest code to unit test. Test normal cases, edge cases, and expected errors. Keep each test focused on behavior rather than implementation details.
