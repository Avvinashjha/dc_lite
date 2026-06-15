# Jest Basics

Jest is a popular JavaScript test runner.

Vitest is another common runner with a similar API, especially in Vite projects.

This lesson uses Jest-style examples, but many ideas transfer directly to Vitest.

## A Basic Test

```ts
function formatPrice(amount: number) {
  return `$${amount.toFixed(2)}`;
}

test("formats a price with two decimal places", () => {
  expect(formatPrice(12)).toBe("$12.00");
});
```

A test usually has:

- arrange: prepare inputs
- act: run the behavior
- assert: check the result

## Grouping Tests

```ts
describe("formatPrice", () => {
  test("formats whole numbers", () => {
    expect(formatPrice(10)).toBe("$10.00");
  });

  test("formats decimals", () => {
    expect(formatPrice(10.5)).toBe("$10.50");
  });
});
```

Use descriptions that explain behavior.

Avoid vague names like `"works"`.

## Common Matchers

```ts
expect(total).toBe(42);
expect(user).toEqual({ id: "u1", name: "Ava" });
expect(items).toHaveLength(3);
expect(save).toHaveBeenCalledWith({ name: "Ava" });
expect(screen.getByText("Saved")).toBeInTheDocument();
```

`toBe` checks strict identity for primitives and references.

`toEqual` checks object structure.

## Testing Errors

```ts
function parseQuantity(value: string) {
  const quantity = Number(value);

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Quantity must be a positive integer");
  }

  return quantity;
}

test("rejects invalid quantities", () => {
  expect(() => parseQuantity("0")).toThrow("positive integer");
});
```

Test the edge cases that are likely to break.

## Setup and Cleanup

```ts
beforeEach(() => {
  localStorage.clear();
});
```

Use setup sparingly.

Too much shared setup can make tests hard to read.

Prefer each test to show the important data it depends on.

## Common Mistakes

- Writing tests with no meaningful assertion.
- Using `toBe` for objects when `toEqual` is needed.
- Sharing mutable data between tests.
- Testing many behaviors in one large test.
- Using snapshots as a substitute for clear expectations.

:::quiz
question: Which matcher is usually appropriate for comparing object structure?
options:
  - toEqual
  - toBeUndefinedOnly
  - toClick
  - toRender
answer: 0
explanation: `toEqual` compares object and array structure, while `toBe` checks strict identity.
:::

## Practical Challenge

Write Jest or Vitest tests for a `calculateCartTotal(items)` function.

Cover:

- an empty cart
- one item
- multiple quantities
- a discounted item
- invalid negative quantity

Use clear test names and one main assertion per behavior.

## Recap

Jest-style tests are the foundation for many React test suites.

Keep tests small, name behavior clearly, choose the right matcher, and cover edge cases instead of only the happy path.
