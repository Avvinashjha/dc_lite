# Numbers

JavaScript uses numbers for counting, prices, scores, measurements, calculations, indexes, timers, and much more.

Unlike languages such as C++ or Java, JavaScript does not have separate primitive types like `int`, `float`, and `double`.

JavaScript has one main numeric primitive type:

```js
number
```

This one type is used for both whole numbers and decimals.

```js
const age = 25;
const price = 99.99;
```

Under the hood, JavaScript numbers use the **IEEE 754 double-precision 64-bit floating-point format**. You do not need to memorize that name, but it explains why JavaScript can represent very large numbers, decimals, `Infinity`, and some small decimal precision errors.

## Writing Numbers

You can write numbers in several ways.

```js
const integer = 42;
const decimal = 3.14;
const negative = -10;
const scientific = 1e6;
const readable = 1_000_000;
```

Explanation:

- `42` is a whole number.
- `3.14` is a decimal number.
- `-10` is a negative number.
- `1e6` means `1 * 10^6`, which is `1000000`.
- `1_000_000` uses numeric separators for readability.

Numeric separators do not change the value.

```js
console.log(1_000_000 === 1000000); // true
```

## Checking the Type

Use `typeof` to check that a value is a number.

```js
console.log(typeof 42); // number
console.log(typeof 3.14); // number
```

Both integers and decimals return `"number"`.

## Basic Math Operators

JavaScript supports the standard arithmetic operators.

```js
console.log(10 + 5); // 15
console.log(10 - 5); // 5
console.log(10 * 5); // 50
console.log(10 / 3); // 3.3333333333333335
console.log(10 % 3); // 1
console.log(2 ** 3); // 8
```

Operator meanings:

| Operator | Meaning | Example |
| --- | --- | --- |
| `+` | Addition | `10 + 5` gives `15` |
| `-` | Subtraction | `10 - 5` gives `5` |
| `*` | Multiplication | `10 * 5` gives `50` |
| `/` | Division | `10 / 2` gives `5` |
| `%` | Remainder | `10 % 3` gives `1` |
| `**` | Exponentiation | `2 ** 3` gives `8` |

The remainder operator `%` gives what is left after division.

```js
console.log(11 % 2); // 1
console.log(12 % 2); // 0
```

This is commonly used to check whether a number is even or odd.

```js
const number = 11;

console.log(number % 2 === 0); // false
```

## Operator Precedence

JavaScript follows normal math precedence.

```js
console.log(2 + 3 * 4); // 14
```

Multiplication happens before addition.

Use parentheses when you want to control the order clearly.

```js
console.log((2 + 3) * 4); // 20
```

## Increment and Decrement

JavaScript has shortcuts for increasing or decreasing a number by `1`.

```js
let count = 0;

count++;
console.log(count); // 1

count--;
console.log(count); // 0
```

You can also use assignment operators:

```js
let score = 10;

score += 5;
score -= 2;
score *= 3;
score /= 2;

console.log(score);
```

These are shortcuts for updating numeric values.

## Special Number Values

JavaScript has a few special numeric values.

## `Infinity` and `-Infinity`

`Infinity` represents a number larger than JavaScript can normally represent.

It can also appear when dividing by zero.

```js
console.log(1 / 0); // Infinity
console.log(-1 / 0); // -Infinity
console.log(Infinity + 1); // Infinity
```

`Infinity` is still a number:

```js
console.log(typeof Infinity); // number
```

## `NaN`

`NaN` stands for **Not a Number**.

It usually appears when a numeric operation fails.

```js
console.log("Hello" * 5); // NaN
console.log(Math.sqrt(-1)); // NaN
console.log(0 / 0); // NaN
```

Even though the name is "Not a Number", `NaN` has the type `"number"`:

```js
console.log(typeof NaN); // number
```

This is confusing at first, but `NaN` is JavaScript's way of representing an invalid numeric result.

## Checking for `NaN`

Do not check for `NaN` with `===`.

```js
console.log(NaN === NaN); // false
```

`NaN` is the only JavaScript value that is not equal to itself.

Use `Number.isNaN()` instead:

```js
console.log(Number.isNaN(NaN)); // true
console.log(Number.isNaN("Hello" * 5)); // true
console.log(Number.isNaN(42)); // false
```

## Floating-Point Precision

JavaScript numbers use binary floating-point representation. This means some decimal calculations are not exact.

```js
console.log(0.1 + 0.2); // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3); // false
```

This is not unique to JavaScript. Many programming languages have the same behavior.

For display purposes, you can use `toFixed()`.

```js
const result = 0.1 + 0.2;

console.log(result.toFixed(1)); // "0.3"
```

Important: `toFixed()` returns a string.

```js
const fixed = result.toFixed(1);

console.log(typeof fixed); // string
```

For money calculations, avoid relying on floating-point decimals directly.

A common beginner-friendly approach is to store money in the smallest unit, such as cents or paise.

```js
const priceInCents = 1999;
const taxInCents = 200;

const totalInCents = priceInCents + taxInCents;

console.log(totalInCents); // 2199
```

For advanced financial calculations, teams often use dedicated decimal libraries.

## Useful Number Methods

JavaScript provides helpful methods on the `Number` object.

## `Number.isInteger()`

Checks whether a value is an integer.

```js
console.log(Number.isInteger(10)); // true
console.log(Number.isInteger(10.5)); // false
```

## `Number.isFinite()`

Checks whether a value is a normal finite number.

```js
console.log(Number.isFinite(100)); // true
console.log(Number.isFinite(Infinity)); // false
console.log(Number.isFinite(NaN)); // false
```

## `Number.parseInt()`

Converts a string into an integer.

```js
console.log(Number.parseInt("42")); // 42
console.log(Number.parseInt("42px")); // 42
```

## `Number.parseFloat()`

Converts a string into a decimal number.

```js
console.log(Number.parseFloat("3.14")); // 3.14
console.log(Number.parseFloat("3.14px")); // 3.14
```

If conversion fails, the result is `NaN`.

```js
console.log(Number.parseInt("hello")); // NaN
```

## The `Math` Object

JavaScript has a built-in `Math` object for common mathematical operations.

You do not create it. You just use it.

```js
console.log(Math.PI); // 3.141592653589793
console.log(Math.round(4.6)); // 5
console.log(Math.floor(4.9)); // 4
console.log(Math.ceil(4.1)); // 5
console.log(Math.max(10, 5, 20)); // 20
console.log(Math.min(10, 5, 20)); // 5
```

## Rounding Numbers

```js
console.log(Math.round(4.5)); // 5
console.log(Math.floor(4.9)); // 4
console.log(Math.ceil(4.1)); // 5
```

Use:

- `Math.round()` to round to the nearest integer
- `Math.floor()` to round down
- `Math.ceil()` to round up

## Random Numbers

`Math.random()` returns a random decimal from `0` up to, but not including, `1`.

```js
console.log(Math.random());
```

To get a random whole number from `1` to `10`:

```js
const randomNumber = Math.floor(Math.random() * 10) + 1;

console.log(randomNumber);
```

How it works:

1. `Math.random()` gives a decimal from `0` to less than `1`.
2. Multiplying by `10` gives a decimal from `0` to less than `10`.
3. `Math.floor()` rounds it down to `0` through `9`.
4. Adding `1` shifts the range to `1` through `10`.

## `number` vs `bigint`

The `number` type is used for most numeric work.

For extremely large whole numbers, JavaScript also has `bigint`.

```js
const regularNumber = 9007199254740991;
const bigNumber = 9007199254740993n;
```

You will usually use `number`. Use `bigint` only when you specifically need very large whole integers.

Do not mix `number` and `bigint` directly in arithmetic:

```js
const value = 10n;

// value + 5; // Error
```

Both sides must be the same numeric type.

## Summary

JavaScript has one main numeric type: `number`.

You learned that:

1. `number` handles both integers and decimals.
2. JavaScript supports normal arithmetic operators like `+`, `-`, `*`, `/`, `%`, and `**`.
3. `Infinity`, `-Infinity`, and `NaN` are special number values.
4. Use `Number.isNaN()` to check for `NaN`.
5. Decimal math can have small floating-point precision issues.
6. `toFixed()` is useful for formatting but returns a string.
7. The `Math` object provides helpers like `round`, `floor`, `ceil`, `max`, `min`, and `random`.
8. Use `bigint` only when you need very large whole numbers.

Next, you will learn about booleans and how JavaScript represents true and false values.