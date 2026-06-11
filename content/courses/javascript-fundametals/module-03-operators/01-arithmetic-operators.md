# Arithmetic Operators

Now that you know how to store data in variables, you need to know how to manipulate it.

Arithmetic operators are symbols that perform math operations on numeric values.

```js
const total = 10 + 5;

console.log(total); // 15
```

You will use arithmetic operators for totals, counters, indexes, prices, scores, measurements, timers, and many other calculations.

## Core Arithmetic Operators

JavaScript supports the standard arithmetic operators you know from math.

| Operator | Name | Description | Example | Result |
| --- | --- | --- | --- | --- |
| `+` | Addition | Adds numbers or concatenates strings | `10 + 5` | `15` |
| `-` | Subtraction | Subtracts the right value from the left value | `10 - 5` | `5` |
| `*` | Multiplication | Multiplies values | `10 * 5` | `50` |
| `/` | Division | Divides the left value by the right value | `10 / 2` | `5` |
| `%` | Remainder | Returns the remainder after division | `10 % 3` | `1` |
| `**` | Exponentiation | Raises a value to a power | `2 ** 3` | `8` |

## Addition

Use `+` to add numbers.

```js
const total = 10 + 5;

console.log(total); // 15
```

The `+` operator also joins strings.

```js
console.log("Hello" + " " + "World"); // Hello World
```

Be careful when mixing strings and numbers:

```js
console.log("5" + 1); // "51"
```

Because one value is a string, JavaScript performs string concatenation.

## Subtraction

Use `-` to subtract numbers.

```js
const remaining = 10 - 3;

console.log(remaining); // 7
```

If a numeric string is used with subtraction, JavaScript may coerce it into a number:

```js
console.log("10" - 3); // 7
```

Even though this works, explicit conversion is usually clearer:

```js
const value = Number("10") - 3;

console.log(value); // 7
```

## Multiplication

Use `*` to multiply numbers.

```js
const price = 100;
const quantity = 3;

const total = price * quantity;

console.log(total); // 300
```

## Division

Use `/` to divide numbers.

```js
console.log(10 / 2); // 5
console.log(10 / 3); // 3.3333333333333335
```

Division can produce decimal values.

Dividing by zero gives `Infinity` or `-Infinity`.

```js
console.log(1 / 0); // Infinity
console.log(-1 / 0); // -Infinity
```

## Remainder Operator

The `%` operator returns the remainder after division.

```js
console.log(10 % 3); // 1
console.log(10 % 2); // 0
console.log(7 % 4); // 3
```

Think of `10 % 3` like this:

- `3` fits into `10` three times.
- `3 * 3` is `9`.
- `1` is left over.

So the result is `1`.

## Checking Even or Odd Numbers

The remainder operator is commonly used to check whether a number is even or odd.

```js
const number = 10;

console.log(number % 2 === 0); // true
```

If a number divided by `2` has a remainder of `0`, it is even.

```js
const number = 7;

if (number % 2 === 0) {
  console.log("Even");
} else {
  console.log("Odd");
}
```

## Exponentiation

Use `**` to raise a number to a power.

```js
console.log(2 ** 3); // 8
console.log(5 ** 2); // 25
```

`2 ** 3` means:

```text
2 * 2 * 2
```

## Increment and Decrement

The increment operator `++` adds `1` to a variable.

The decrement operator `--` subtracts `1` from a variable.

```js
let count = 0;

count++;
console.log(count); // 1

count--;
console.log(count); // 0
```

These operators only work on variables or writable properties, not fixed values.

```js
// 5++; // Error
```

## Postfix Increment

Postfix means the operator comes after the variable.

```js
let count = 5;

console.log(count++); // 5
console.log(count); // 6
```

With postfix:

1. JavaScript returns the current value.
2. Then it updates the variable.

## Prefix Increment

Prefix means the operator comes before the variable.

```js
let count = 5;

console.log(++count); // 6
console.log(count); // 6
```

With prefix:

1. JavaScript updates the variable.
2. Then it returns the new value.

The same idea applies to decrement:

```js
let score = 10;

console.log(score--); // 10
console.log(score); // 9

console.log(--score); // 8
console.log(score); // 8
```

## Prefer Clear Updates

Prefix and postfix behavior can be confusing.

In many situations, this is clearer:

```js
count = count + 1;
```

Or:

```js
count += 1;
```

Use `++` and `--` when they improve readability, such as simple counters. Avoid using them inside complicated expressions.

## Shorthand Assignment Operators

When updating a variable based on its current value, you can combine arithmetic with assignment.

```js
let x = 10;

x += 5; // x = x + 5
x -= 3; // x = x - 3
x *= 2; // x = x * 2
x /= 4; // x = x / 4
x %= 4; // x = x % 4
```

Step by step:

```js
let x = 10;

x += 5;
console.log(x); // 15

x -= 3;
console.log(x); // 12

x *= 2;
console.log(x); // 24

x /= 4;
console.log(x); // 6

x %= 4;
console.log(x); // 2
```

These are useful for counters, totals, and repeated calculations.

## Operator Precedence

JavaScript follows an order of operations.

In general:

1. Parentheses `()`
2. Exponentiation `**`
3. Multiplication `*`, division `/`, remainder `%`
4. Addition `+`, subtraction `-`

Example:

```js
console.log(2 + 3 * 4); // 14
```

Multiplication happens first:

```text
3 * 4 = 12
2 + 12 = 14
```

Use parentheses to make the order explicit:

```js
console.log((2 + 3) * 4); // 20
```

Parentheses make your intention clear to both JavaScript and other developers.

## A Practical Example

Imagine a shopping cart calculation:

```js
const itemPrice = 499;
const quantity = 3;
const discount = 100;

const subtotal = itemPrice * quantity;
const finalTotal = subtotal - discount;

console.log(subtotal); // 1497
console.log(finalTotal); // 1397
```

Now add tax:

```js
const taxRate = 0.18;
const tax = finalTotal * taxRate;
const totalWithTax = finalTotal + tax;

console.log(totalWithTax);
```

Arithmetic operators are the foundation of calculations like this.

## Common Mistakes

## Mixing Strings and Numbers with `+`

```js
console.log("10" + 5); // "105"
```

If you want math, convert first:

```js
console.log(Number("10") + 5); // 15
```

## Expecting `%` to Return a Percentage

The `%` operator does not calculate percentages. It returns a remainder.

```js
console.log(10 % 3); // 1
```

To calculate 20% of 100:

```js
console.log(100 * 0.2); // 20
```

## Hiding Logic in Increment Expressions

This is harder to read:

```js
let count = 1;
const result = count++ + ++count;
```

Prefer simple steps:

```js
let count = 1;

count += 1;
count += 1;
```

## Summary

Arithmetic operators let you perform calculations in JavaScript.

Remember:

1. Use `+`, `-`, `*`, and `/` for basic math.
2. Use `%` to get the remainder after division.
3. Use `% 2` to check even and odd numbers.
4. Use `**` for exponentiation.
5. `++` and `--` update values by `1`, but prefix and postfix behave differently.
6. Shorthand assignment operators like `+=` and `*=` update a variable based on its current value.
7. JavaScript follows operator precedence, but parentheses make code clearer.
8. Be careful when using `+` with strings and numbers together.

Next, you will learn about assignment operators in more detail.