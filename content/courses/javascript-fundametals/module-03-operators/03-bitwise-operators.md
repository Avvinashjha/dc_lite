# Bitwise Operators

Bitwise operators work with the binary representation of numbers.

Most JavaScript code uses arithmetic, comparison, and logical operators much more often. Bitwise operators are more advanced and appear in specific situations such as permissions, flags, low-level data handling, graphics, algorithms, and technical interviews.

You do not need bitwise operators for most everyday web development, but understanding them helps you understand how numbers can be manipulated at the bit level.

## What Does Bitwise Mean?

Computers store numbers using bits.

A bit is either:

```text
0
```

or:

```text
1
```

For example, the number `5` can be represented in binary as:

```text
0101
```

The number `1` is:

```text
0001
```

Bitwise operators compare or shift these individual bits.

## The Important JavaScript Rule

JavaScript numbers are normally stored as 64-bit floating-point values.

But bitwise operators are different.

Before a bitwise operation runs, JavaScript converts the operands to **32-bit signed integers**. After the operation, the result is converted back to a normal JavaScript number.

This has important consequences:

1. Decimal parts are removed.
2. Very large numbers can lose information.
3. Bitwise operators are best used with whole numbers.

Example:

```js
console.log(3.9 | 0); // 3
```

The decimal part is removed because bitwise operations work on 32-bit integers.

## Core Bitwise Operators

| Operator | Name | Meaning |
| --- | --- | --- |
| `&` | AND | Bit is `1` only if both bits are `1` |
| `|` | OR | Bit is `1` if at least one bit is `1` |
| `^` | XOR | Bit is `1` if the bits are different |
| `~` | NOT | Inverts all bits |
| `<<` | Left shift | Moves bits to the left |
| `>>` | Signed right shift | Moves bits to the right and keeps the sign |
| `>>>` | Unsigned right shift | Moves bits to the right and fills with `0`s |

## Bitwise AND

The `&` operator compares each bit.

It returns `1` only when both bits are `1`.

```text
0101  // 5
0001  // 1
----
0001  // 1
```

JavaScript:

```js
console.log(5 & 1); // 1
```

Another example:

```text
0110  // 6
0011  // 3
----
0010  // 2
```

```js
console.log(6 & 3); // 2
```

## Bitwise OR

The `|` operator returns `1` when at least one bit is `1`.

```text
0101  // 5
0001  // 1
----
0101  // 5
```

```js
console.log(5 | 1); // 5
```

Another example:

```text
0100  // 4
0010  // 2
----
0110  // 6
```

```js
console.log(4 | 2); // 6
```

## Bitwise XOR

The `^` operator returns `1` when the bits are different.

```text
0101  // 5
0001  // 1
----
0100  // 4
```

```js
console.log(5 ^ 1); // 4
```

XOR is useful in some algorithms because it highlights differences between bit patterns.

## Bitwise NOT

The `~` operator inverts all bits.

```js
console.log(~5); // -6
```

This result surprises many beginners.

In JavaScript:

```js
~x === -(x + 1)
```

So:

```js
console.log(~5); // -6
console.log(~0); // -1
console.log(~-1); // 0
```

The reason involves 32-bit signed integer representation. You do not need to memorize all the internals yet, but remember that `~` flips every bit.

## Left Shift

The `<<` operator shifts bits to the left and fills the right side with `0`s.

```text
0101  // 5
1010  // 10
```

```js
console.log(5 << 1); // 10
```

Shifting left by `1` is similar to multiplying by `2`.

```js
console.log(5 << 1); // 10
console.log(5 << 2); // 20
```

Use normal multiplication for readability unless you specifically need bitwise behavior.

## Signed Right Shift

The `>>` operator shifts bits to the right while preserving the sign.

```js
console.log(5 >> 1); // 2
console.log(8 >> 1); // 4
```

Shifting right by `1` is similar to dividing by `2` and truncating.

```js
console.log(9 >> 1); // 4
```

For negative numbers, `>>` keeps the negative sign.

```js
console.log(-8 >> 1); // -4
```

## Unsigned Right Shift

The `>>>` operator shifts bits to the right and fills the left side with `0`s.

This can turn negative numbers into large positive 32-bit values.

```js
console.log(-5 >>> 0); // 4294967291
```

This operator is useful in low-level numeric work, but it is uncommon in beginner JavaScript.

## Practical Use Case: Odd or Even

The last binary bit of an odd number is `1`.

The last binary bit of an even number is `0`.

So you can use `num & 1` to check odd/even.

```js
const number = 7;

if (number & 1) {
  console.log("Odd");
} else {
  console.log("Even");
}
```

This works, but the modulo version is more readable for most developers:

```js
if (number % 2 !== 0) {
  console.log("Odd");
}
```

Prefer readability unless there is a specific reason to use bitwise operators.

## Practical Use Case: Flags and Permissions

Bitwise operators are useful when multiple on/off settings can be stored in one number.

Each permission gets its own bit:

```js
const READ = 1;    // 0001
const WRITE = 2;   // 0010
const EXECUTE = 4; // 0100
```

Combine permissions with OR:

```js
let permissions = READ | WRITE;

console.log(permissions); // 3
```

Check a permission with AND:

```js
if (permissions & WRITE) {
  console.log("User can write");
}
```

Add a permission:

```js
permissions = permissions | EXECUTE;
```

Remove a permission:

```js
permissions = permissions & ~WRITE;
```

This pattern is called **bitmasking**.

It is common in permissions systems, graphics, game development, operating systems, and low-level APIs.

## The Double Tilde

You may see `~~value` in JavaScript code.

It applies bitwise NOT twice.

```js
console.log(~~3.14); // 3
console.log(~~-3.14); // -3
console.log(~~"42"); // 42
```

This truncates toward zero.

It is closer to `Math.trunc()` than `Math.floor()`.

```js
console.log(Math.trunc(-3.14)); // -3
console.log(Math.floor(-3.14)); // -4
```

While `~~` is short, it is not very readable.

Prefer:

```js
Math.trunc(value);
```

or:

```js
Math.floor(value);
```

depending on the behavior you need.

## Bitwise OR with Zero

Another shortcut is `value | 0`.

```js
console.log(3.9 | 0); // 3
console.log("42" | 0); // 42
```

Like `~~`, it converts to a 32-bit integer and truncates.

This can be surprising and can break with large numbers.

Prefer explicit methods in most application code.

## Common Mistakes

## Confusing `&` with `&&`

`&` is bitwise AND.

`&&` is logical AND.

```js
console.log(5 & 1); // 1
console.log(true && false); // false
```

They are not the same operator.

## Confusing `|` with `||`

`|` is bitwise OR.

`||` is logical OR.

```js
console.log(4 | 2); // 6
console.log(false || true); // true
```

They behave very differently.

## Using Bitwise Tricks for Readability-Critical Code

This is clever:

```js
const integer = ~~value;
```

This is clearer:

```js
const integer = Math.trunc(value);
```

Readable code is usually better than clever code.

## Using Bitwise Operators with Large Numbers

Bitwise operators convert values to 32-bit integers.

Large numbers may lose data.

```js
console.log(2147483648 | 0); // -2147483648
```

This happens because the value crosses the signed 32-bit integer boundary.

Use bitwise operators only when you understand the 32-bit behavior.

## Summary

Bitwise operators work on the 32-bit binary representation of numbers.

Remember:

1. JavaScript converts operands to 32-bit signed integers for bitwise operations.
2. Decimals are truncated during bitwise operations.
3. `&`, `|`, and `^` compare bits.
4. `~` flips bits.
5. `<<`, `>>`, and `>>>` shift bits.
6. Bitwise operators are useful for flags, permissions, and low-level algorithms.
7. `num & 1` can check odd/even, but `% 2` is usually clearer.
8. `~~value` and `value | 0` are truncation shortcuts, but `Math.trunc()` is more readable.
9. Do not confuse bitwise operators with logical operators.

Next, you will learn about comparison operators, which are used to compare values and build conditions.