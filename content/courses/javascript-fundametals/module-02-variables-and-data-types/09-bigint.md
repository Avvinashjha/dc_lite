# BigInt

`BigInt` is JavaScript's primitive type for very large whole numbers.

It was introduced in ES2020 to solve a specific problem: normal JavaScript numbers cannot safely represent every large integer.

For most everyday JavaScript code, you will use `number`. Use `bigint` only when you need exact precision for very large integers.

## The Safe Integer Problem

JavaScript's `number` type uses double-precision floating-point representation.

This works well for most values, but there is a limit for safe integer precision.

That limit is stored in:

```js
Number.MAX_SAFE_INTEGER;
```

Its value is:

```js
9007199254740991;
```

This is `2^53 - 1`.

You can see the problem when going beyond this limit:

```js
const maxSafe = Number.MAX_SAFE_INTEGER;

console.log(maxSafe); // 9007199254740991
console.log(maxSafe + 1); // 9007199254740992
console.log(maxSafe + 2); // 9007199254740992
console.log(maxSafe + 1 === maxSafe + 2); // true
```

That last result is surprising. Two different mathematical values are treated as the same number because precision was lost.

This is why `BigInt` exists.

## Creating a BigInt

There are two common ways to create a `bigint`.

## Add `n` to the End

Add `n` to the end of an integer literal.

```js
const largeNumber = 900719925474099123456789n;

console.log(typeof largeNumber); // bigint
```

The `n` tells JavaScript this value is a `bigint`, not a normal `number`.

## Use the `BigInt()` Function

You can also use the `BigInt()` function.

```js
const fromNumber = BigInt(123);
const fromString = BigInt("900719925474099123456789");

console.log(fromNumber); // 123n
console.log(fromString); // 900719925474099123456789n
```

For very large values, prefer passing a string.

```js
const precise = BigInt("900719925474099123456789");
```

This avoids precision loss before the value becomes a `bigint`.

## BigInt Is Only for Whole Numbers

`BigInt` cannot represent decimals.

This is invalid:

```js
const value = 1.5n; // SyntaxError
```

This is also invalid:

```js
const value = BigInt(1.5); // RangeError
```

Use `number` for decimal values.

Use `bigint` only for whole integers.

## BigInt Arithmetic

You can use many normal arithmetic operators with `bigint`.

```js
console.log(10n + 5n); // 15n
console.log(10n - 5n); // 5n
console.log(10n * 5n); // 50n
console.log(10n / 3n); // 3n
console.log(10n % 3n); // 1n
console.log(2n ** 3n); // 8n
```

Notice this result:

```js
console.log(10n / 3n); // 3n
```

BigInt division discards the decimal part because `bigint` only represents whole numbers.

## Do Not Mix `number` and `bigint` in Math

JavaScript does not allow mixing `number` and `bigint` in arithmetic.

```js
const big = 10n;
const normal = 5;

// console.log(big + normal); // TypeError
```

You must convert one side explicitly.

Convert the normal number to `bigint`:

```js
const big = 10n;
const normal = 5;

console.log(big + BigInt(normal)); // 15n
```

Or convert the `bigint` to a number:

```js
const big = 10n;
const normal = 5;

console.log(Number(big) + normal); // 15
```

Only convert `bigint` to `number` if you are sure the value is within the safe number range. Otherwise, you can lose precision.

## Comparing BigInt and Number

Strict equality checks both value and type.

```js
console.log(10n === 10); // false
```

Loose equality allows comparison between `bigint` and `number`.

```js
console.log(10n == 10); // true
```

Relational comparisons also work:

```js
console.log(10n > 5); // true
console.log(10n < 20); // true
```

Even though these comparisons work, prefer keeping numeric types consistent. It makes code easier to reason about.

## Truthy and Falsy BigInts

`0n` is falsy.

Any other `bigint` is truthy.

```js
console.log(Boolean(0n)); // false
console.log(Boolean(1n)); // true
console.log(Boolean(-1n)); // true
```

Example:

```js
const count = 0n;

if (count) {
  console.log("Count exists");
} else {
  console.log("Count is zero");
}
```

## BigInt and JSON

One important limitation: `JSON.stringify()` does not directly support `bigint`.

```js
const data = {
  id: 123n
};

// JSON.stringify(data); // TypeError
```

If you need to send a `bigint` through JSON, convert it to a string first.

```js
const data = {
  id: 123n
};

const safeData = {
  id: data.id.toString()
};

console.log(JSON.stringify(safeData)); // {"id":"123"}
```

This is common when working with large IDs from databases or APIs.

## When Should You Use BigInt?

Use `bigint` when you need exact precision for very large whole numbers.

Common examples:

- Very large database IDs
- Cryptographic calculations
- High-precision integer math
- Large counters
- Systems that use integer timestamps beyond the safe number range

For normal app values, use `number`.

Examples that should usually stay as `number`:

- Prices displayed to users
- Percentages
- Screen sizes
- Ages
- Scores
- Small counts

## BigInt vs Number

| Feature | `number` | `bigint` |
| --- | --- | --- |
| Handles decimals | Yes | No |
| Handles very large integers exactly | Not always | Yes |
| Can be used with `Math` methods | Yes | No |
| JSON support | Yes | Not directly |
| Literal example | `123` | `123n` |
| Type from `typeof` | `"number"` | `"bigint"` |

## Common Mistakes

## Adding a Decimal

```js
const value = 1.5n; // Error
```

Use a normal number:

```js
const value = 1.5;
```

## Mixing with Number

```js
const total = 10n + 5; // Error
```

Convert first:

```js
const total = 10n + BigInt(5);
```

## Converting Huge BigInts to Number

```js
const huge = 900719925474099123456789n;

const converted = Number(huge);

console.log(converted); // Precision may be lost
```

If precision matters, keep the value as `bigint` or convert it to a string for display/storage.

## Summary

`BigInt` is for very large whole numbers that need exact precision.

Remember:

1. `bigint` was introduced in ES2020.
2. Create a `bigint` with `123n` or `BigInt("123")`.
3. Use strings with `BigInt()` for very large values.
4. `bigint` cannot represent decimals.
5. Do not mix `number` and `bigint` in arithmetic without conversion.
6. `0n` is falsy, and other BigInt values are truthy.
7. `JSON.stringify()` does not directly support `bigint`.
8. Use `bigint` only when you need very large integer precision.

Next, you will learn about objects and arrays, where JavaScript values start becoming more structured.