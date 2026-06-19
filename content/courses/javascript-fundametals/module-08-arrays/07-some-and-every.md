# some and every

So far, you have learned array methods that return different kinds of results.

`map` transforms every item and returns a new array.

`filter` keeps matching items and returns a new array.

`find` returns the first matching item.

`reduce` builds one final value.

But sometimes you do not need the items themselves.

Sometimes you only need to answer a yes/no question:

```text
Does at least one item match?
Do all items match?
```

That is what **`.some()`** and **`.every()`** are for.

## What Do `some` and `every` Return?

Both methods return a boolean:

- `true`
- `false`

They do not return a new array.

They do not return the matching item.

They answer a question about the array.

```js
const numbers = [1, 2, 3, 4, 5];

const hasEven = numbers.some((number) => number % 2 === 0);
const allEven = numbers.every((number) => number % 2 === 0);

console.log(hasEven); // true
console.log(allEven); // false
```

## The Big Difference

Use `.some()` for "at least one."

Use `.every()` for "all."

| Method | Question | Returns `true` when |
| --- | --- | --- |
| `some` | Does at least one item pass? | One or more items pass |
| `every` | Do all items pass? | Every item passes |

You can think of them like logical operators for arrays:

- `.some()` is like `||` across many items
- `.every()` is like `&&` across many items

## The `some` Method

The `.some()` method checks whether at least one element passes a condition.

```js
const numbers = [1, 2, 3, 4, 5];

const hasEven = numbers.some((number) => {
  return number % 2 === 0;
});

console.log(hasEven); // true
```

The condition is:

```js
number % 2 === 0
```

This checks whether a number is even.

Since `2` and `4` are even, `.some()` returns `true`.

## `some` Step by Step

```js
const numbers = [1, 3, 5, 8, 9];

const hasEven = numbers.some((number) => {
  return number % 2 === 0;
});

console.log(hasEven); // true
```

Step by step:

| Number | Condition result | What happens? |
| --- | --- | --- |
| `1` | `false` | Keep checking |
| `3` | `false` | Keep checking |
| `5` | `false` | Keep checking |
| `8` | `true` | Return `true` and stop |

`.some()` stops as soon as it finds one match.

It does not need to check `9`.

## The `every` Method

The `.every()` method checks whether all elements pass a condition.

```js
const scores = [85, 92, 78, 90];

const allPassed = scores.every((score) => {
  return score >= 70;
});

console.log(allPassed); // true
```

Every score is at least `70`, so `.every()` returns `true`.

If one item fails, the result is `false`.

```js
const scores = [85, 92, 65, 90];

const allPassed = scores.every((score) => score >= 70);

console.log(allPassed); // false
```

The score `65` fails the condition.

## `every` Step by Step

```js
const numbers = [2, 4, 6, 7, 8];

const allEven = numbers.every((number) => {
  return number % 2 === 0;
});

console.log(allEven); // false
```

Step by step:

| Number | Condition result | What happens? |
| --- | --- | --- |
| `2` | `true` | Keep checking |
| `4` | `true` | Keep checking |
| `6` | `true` | Keep checking |
| `7` | `false` | Return `false` and stop |

`.every()` stops as soon as it finds one failure.

It does not need to check `8`.

## Basic Syntax

Both methods use the same callback style as other array methods.

```js
array.some(function (currentValue, index, array) {
  return condition;
});
```

```js
array.every(function (currentValue, index, array) {
  return condition;
});
```

The callback can receive three arguments:

| Argument | Meaning | Common? |
| --- | --- | --- |
| `currentValue` | The current element being checked | Yes |
| `index` | The index of the current element | Sometimes |
| `array` | The original array | Rarely |

Most of the time, you only need the first argument.

## Permission Checks With `some`

Use `.some()` when one matching item is enough.

```js
const users = [
  { name: "Alice", role: "user" },
  { name: "Bob", role: "admin" },
  { name: "Charlie", role: "user" },
];

const hasAdmin = users.some((user) => {
  return user.role === "admin";
});

console.log(hasAdmin); // true
```

This answers the question:

```text
Is at least one user an admin?
```

Since Bob is an admin, the answer is `true`.

## Validation With `every`

Use `.every()` when all items must pass.

```js
const formInputs = [
  { field: "username", isValid: true },
  { field: "email", isValid: true },
  { field: "password", isValid: false },
];

const isFormValid = formInputs.every((input) => {
  return input.isValid;
});

console.log(isFormValid); // false
```

This answers the question:

```text
Are all form inputs valid?
```

One input is invalid, so the answer is `false`.

## Checking for Errors

`.some()` is useful for checking whether any item has a problem.

```js
const fields = [
  { name: "username", error: null },
  { name: "email", error: "Invalid email" },
  { name: "password", error: null },
];

const hasErrors = fields.some((field) => {
  return field.error != null;
});

console.log(hasErrors); // true
```

The `field.error != null` check matches both `null` and `undefined`.

If any field has an error, `hasErrors` is `true`.

## Checking Data Completeness

`.every()` is useful when every item must have a required value.

```js
const users = [
  { name: "Alice", email: "alice@example.com" },
  { name: "Bob", email: "bob@example.com" },
  { name: "Charlie", email: "charlie@example.com" },
];

const allHaveEmails = users.every((user) => {
  return user.email;
});

console.log(allHaveEmails); // true
```

This works because non-empty strings are truthy.

If an email could be an empty string, this condition would fail for that user.

## Short-Circuiting

Both `.some()` and `.every()` short-circuit.

That means they stop early when the final answer is already known.

`.some()` stops when it finds the first passing item.

```js
const numbers = [1, 3, 4, 6, 8];

const hasEven = numbers.some((number) => {
  console.log(`Checking ${number}`);
  return number % 2 === 0;
});

console.log(hasEven); // true
```

Output:

```text
Checking 1
Checking 3
Checking 4
true
```

It does not check `6` or `8`.

`.every()` stops when it finds the first failing item.

```js
const numbers = [2, 4, 5, 6, 8];

const allEven = numbers.every((number) => {
  console.log(`Checking ${number}`);
  return number % 2 === 0;
});

console.log(allEven); // false
```

Output:

```text
Checking 2
Checking 4
Checking 5
false
```

It does not check `6` or `8`.

## Empty Array Behavior

Empty arrays have special behavior.

`.some()` on an empty array returns `false`.

```js
const items = [];

console.log(items.some((item) => item.isActive)); // false
```

This makes sense:

```text
There is not at least one matching item.
```

`.every()` on an empty array returns `true`.

```js
const items = [];

console.log(items.every((item) => item.isActive)); // true
```

This can feel strange at first.

The idea is:

```text
No item failed the condition.
```

This is called vacuous truth in logic.

In practical code, be careful when an empty array should not count as "valid."

## Guarding Against Empty Arrays

If you need at least one item and all items must pass, combine `.length` with `.every()`.

```js
const fields = [];

const isValidForm = fields.length > 0 && fields.every((field) => field.isValid);

console.log(isValidForm); // false
```

This means:

```text
There must be at least one field,
and every field must be valid.
```

This pattern is useful for validation.

## `some` vs `find`

Use `.some()` when you only need a boolean.

Use `.find()` when you need the matching item.

```js
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

const hasUserTwo = users.some((user) => user.id === 2);
const userTwo = users.find((user) => user.id === 2);

console.log(hasUserTwo); // true
console.log(userTwo); // { id: 2, name: "Bob" }
```

| Method | Returns |
| --- | --- |
| `some` | `true` or `false` |
| `find` | Matching item or `undefined` |

## `every` vs `filter`

Use `.every()` when you only need to know whether all items pass.

Use `.filter()` when you need the matching items.

```js
const scores = [80, 90, 100];

const allPassed = scores.every((score) => score >= 70);
const passingScores = scores.filter((score) => score >= 70);

console.log(allPassed); // true
console.log(passingScores); // [80, 90, 100]
```

`every` returns a boolean.

`filter` returns an array.

## Truthy and Falsy Return Values

The callbacks do not have to return literal `true` or `false`.

They can return truthy or falsy values.

```js
const users = [
  { name: "Alice", email: "alice@example.com" },
  { name: "Bob", email: "" },
];

const everyoneHasEmail = users.every((user) => user.email);

console.log(everyoneHasEmail); // false
```

The first email is a non-empty string, so it is truthy.

The second email is an empty string, so it is falsy.

For clarity, you can also write explicit boolean checks:

```js
const everyoneHasEmail = users.every((user) => user.email !== "");
```

## Using Index With `some` and `every`

The second callback argument is the index.

```js
const steps = ["start", "load", "finish"];

const hasFinishAfterStart = steps.some((step, index) => {
  return step === "finish" && index > 0;
});

console.log(hasFinishAfterStart); // true
```

You will not need the index every time.

But it is available when the condition depends on position.

## Best Practices

Use `.some()` for "at least one" checks:

```js
const hasAdmin = users.some((user) => user.role === "admin");
```

Use `.every()` for "all items" checks:

```js
const allPaid = invoices.every((invoice) => invoice.status === "paid");
```

Use clear boolean conditions:

```js
const hasExpensiveProduct = products.some((product) => product.price > 1000);
```

Be careful with empty arrays and `.every()`:

```js
const isValid = fields.length > 0 && fields.every((field) => field.isValid);
```

Use `.find()` if you need the actual item:

```js
const admin = users.find((user) => user.role === "admin");
```

Use `.filter()` if you need all matching items:

```js
const admins = users.filter((user) => user.role === "admin");
```

## Common Mistakes

### Mistake 1: Expecting `some` to Return the Matching Item

```js
const users = [{ id: 1 }, { id: 2 }];

const result = users.some((user) => user.id === 2);

console.log(result); // true
```

`some` returns a boolean.

Use `find` if you need the item:

```js
const user = users.find((user) => user.id === 2);
```

### Mistake 2: Expecting `every` to Return Matching Items

```js
const scores = [80, 90, 100];

const result = scores.every((score) => score >= 70);

console.log(result); // true
```

`every` returns a boolean.

Use `filter` if you need the items:

```js
const passingScores = scores.filter((score) => score >= 70);
```

### Mistake 3: Forgetting `return`

```js
const scores = [80, 90, 100];

const allPassed = scores.every((score) => {
  score >= 70;
});

console.log(allPassed); // false
```

With braces, arrow functions need an explicit `return`.

Correct:

```js
const allPassed = scores.every((score) => {
  return score >= 70;
});
```

Or:

```js
const allPassed = scores.every((score) => score >= 70);
```

### Mistake 4: Forgetting the Empty Array Edge Case

```js
const fields = [];

const isValid = fields.every((field) => field.isValid);

console.log(isValid); // true
```

If an empty form should not be valid, include a length check:

```js
const isValid = fields.length > 0 && fields.every((field) => field.isValid);
```

## Quick Check

What does this return?

```js
const numbers = [1, 3, 5, 8];

const result = numbers.some((number) => number % 2 === 0);
```

It returns:

```js
true
```

At least one number is even.

What does this return?

```js
const numbers = [2, 4, 6, 7];

const result = numbers.every((number) => number % 2 === 0);
```

It returns:

```js
false
```

The number `7` is not even.

What does this return?

```js
const items = [];

const result = items.every((item) => item.isActive);
```

It returns:

```js
true
```

No item fails the condition, so `.every()` returns `true` for an empty array.

## Summary

`some` and `every` answer yes/no questions about arrays.

- `some` returns `true` if at least one item passes the condition.
- `every` returns `true` only if all items pass the condition.
- Both methods return booleans, not arrays or elements.
- Both methods short-circuit.
- `some` stops when it finds the first passing item.
- `every` stops when it finds the first failing item.
- `some` on an empty array returns `false`.
- `every` on an empty array returns `true`.
- Use `find` when you need the matching item.
- Use `filter` when you need all matching items.
