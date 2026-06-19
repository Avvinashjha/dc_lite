# Test Organization and Workflow

Writing one test is useful.

Keeping a growing test suite useful takes organization.

This lesson covers how to name tests, structure files, choose what to test, understand coverage, and use tests in a practical workflow.

## Test File Organization

Common test file patterns include:

```text
src/
  pricing.js
  pricing.test.js
```

or:

```text
src/
  pricing.js
  __tests__/
    pricing.test.js
```

Both styles are common.

Keeping tests near the code can make them easier to find. A separate test folder can be useful for larger integration or end-to-end tests.

Follow the style already used by the project.

## Naming Tests

A good test name describes behavior.

Good:

```js
test("returns no discount for totals below the threshold", () => {
  // ...
});
```

Less useful:

```js
test("works", () => {
  // ...
});
```

When a test fails, the name should help you understand what behavior broke.

## Arrange, Act, Assert

Use a clear structure:

```js
test("marks overdue invoices", () => {
  const invoice = { dueDate: "2026-01-01", paid: false };
  const today = new Date("2026-01-10");

  const result = getInvoiceStatus(invoice, today);

  expect(result).toBe("overdue");
});
```

You do not always need comments for each section. The important part is that the reader can see the setup, action, and assertion.

## Keep Tests Independent

Each test should create or reset the data it needs.

Avoid relying on test order.

```js
beforeEach(() => {
  cart = createEmptyCart();
});
```

Fresh setup makes tests easier to run alone and easier to debug.

## Choosing What to Test

Prioritize behavior with real risk:

- important business rules
- tricky conditions
- data transformations
- async and error paths
- integration points
- bug fixes

For example, a cart total function should be tested with empty carts, multiple items, discounts, taxes, and boundary values.

You do not need to test that `const` works, or that `Array.prototype.filter()` filters. Test your logic.

## Coverage Basics

Code coverage measures how much code ran during tests.

Common coverage types include:

| Type | Meaning |
| --- | --- |
| Line coverage | Which lines ran |
| Branch coverage | Which `if`/`else` paths ran |
| Function coverage | Which functions ran |
| Statement coverage | Which statements ran |

Coverage can reveal untested areas, but it does not prove the tests are good.

This test may increase coverage without checking behavior:

```js
formatPrice(1299);
```

This is better:

```js
expect(formatPrice(1299)).toBe("$12.99");
```

Coverage is a signal, not the goal by itself.

## Regression Tests

When you fix a bug, add a test that would have failed before the fix.

Example bug:

> Users with exactly 18 years of age were rejected, even though the minimum age is 18.

Regression test:

```js
test("allows users who are exactly 18", () => {
  expect(canRegister({ age: 18 })).toBe(true);
});
```

The test protects the fix.

## TDD Basics

TDD stands for test-driven development.

The basic cycle is:

1. Write a failing test for the behavior you want.
2. Write the smallest code needed to pass.
3. Refactor while keeping tests passing.

This is often called red, green, refactor.

TDD is not required for every line of code, but it can be helpful when behavior is clear and you want tests to guide the design.

## Avoiding Brittle Tests

A brittle test fails when implementation changes but behavior is still correct.

For example, this can be brittle:

```js
expect(formatUser).toHaveBeenCalledBefore(saveUser);
```

If users still get saved correctly, the exact private call order may not matter.

Prefer testing visible outcomes:

```js
expect(result).toEqual({
  id: 1,
  name: "Ava",
  status: "saved",
});
```

Check implementation details only when those details are part of the contract.

## Practical Workflow

A common workflow is:

1. Run the relevant tests before changing code.
2. Make a small change.
3. Run focused tests.
4. Add or update tests for changed behavior.
5. Run the broader test suite before sharing the work.

When a test fails, read the failure message carefully.

Ask:

- What behavior was expected?
- What actually happened?
- Is the test wrong, or is the code wrong?
- Did the change reveal a missing edge case?

## Common Mistakes

Do not treat snapshots or coverage numbers as a replacement for meaningful assertions.

Do not ignore flaky tests. A flaky test trains the team to distrust the suite.

Do not make tests so clever that they need their own tests. Test code should be straightforward.

Do not delete a failing test just because it is inconvenient. Understand what it is protecting first.

## Summary

A useful test suite is organized, readable, and focused on behavior.

Use clear names, independent setup, meaningful assertions, regression tests for bugs, and coverage as a guide. Tests should support change, not make every refactor painful.
