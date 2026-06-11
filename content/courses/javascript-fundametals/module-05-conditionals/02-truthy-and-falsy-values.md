# Truthy and Falsy Values

JavaScript conditions do not require a value to be exactly `true` or `false`.

When JavaScript sees a value in a boolean context, it converts that value to a boolean.

Boolean contexts include:

- `if` conditions
- `while` conditions
- ternary conditions
- logical operators like `&&`, `||`, and `!`

Values that become `true` are called **truthy**.

Values that become `false` are called **falsy**.

## Boolean Context Example

```js
const username = "Asha";

if (username) {
  console.log("Welcome!");
}
```

`username` is a string, not a boolean.

But because `"Asha"` is a non-empty string, JavaScript treats it as truthy, so the block runs.

## The Falsy Values

JavaScript has a small list of falsy values.

These values become `false` in a boolean context:

| Value | Meaning |
| --- | --- |
| `false` | The boolean false value |
| `0` | Number zero |
| `-0` | Negative zero |
| `0n` | BigInt zero |
| `""` | Empty string |
| `null` | Intentional absence of value |
| `undefined` | Missing or unassigned value |
| `NaN` | Invalid number result |

Examples:

```js
console.log(Boolean(false)); // false
console.log(Boolean(0)); // false
console.log(Boolean(-0)); // false
console.log(Boolean(0n)); // false
console.log(Boolean("")); // false
console.log(Boolean(null)); // false
console.log(Boolean(undefined)); // false
console.log(Boolean(NaN)); // false
```

If a value is not falsy, it is truthy.

## Truthy Values

The rule for truthy values is simple:

**Everything not on the falsy list is truthy.**

Some truthy values surprise beginners.

```js
console.log(Boolean("0")); // true
console.log(Boolean("false")); // true
console.log(Boolean(" ")); // true
console.log(Boolean([])); // true
console.log(Boolean({})); // true
console.log(Boolean(-1)); // true
console.log(Boolean(function () {})); // true
```

Why?

- `"0"` is a non-empty string.
- `"false"` is a non-empty string.
- `" "` contains a space, so it is not empty.
- Arrays and objects are objects, and objects are truthy.
- `-1` is a non-zero number.
- Functions are objects, and objects are truthy.

## Testing Truthiness

Use `Boolean()` when you want to see how JavaScript treats a value.

```js
const value = "Hello";

console.log(Boolean(value)); // true
```

You can also use double NOT:

```js
console.log(!!value); // true
```

`Boolean(value)` is more explicit and easier for beginners to read.

## Practical Use: Checking a String

Truthy/falsy checks are useful for strings.

```js
const username = "Asha";

if (username) {
  console.log(`Welcome, ${username}`);
}
```

This is cleaner than:

```js
if (username !== "" && username !== null && username !== undefined) {
  console.log(`Welcome, ${username}`);
}
```

But be careful: this only works when an empty string should count as missing.

## Practical Use: Checking Array Length

An array is always truthy, even when it is empty.

```js
console.log(Boolean([])); // true
```

So this is not a good way to check whether an array has items:

```js
const items = [];

if (items) {
  console.log("This runs even though the array is empty");
}
```

Check `.length` instead:

```js
const items = ["apple", "banana"];

if (items.length) {
  console.log("We have items to process.");
}
```

`items.length` is a number.

- `0` is falsy.
- Any positive length is truthy.

For maximum clarity, you can also write:

```js
if (items.length > 0) {
  console.log("We have items to process.");
}
```

## Practical Use: Default Values

Truthy/falsy behavior is often used with `||` for fallback values.

```js
const inputName = "";
const displayName = inputName || "Guest";

console.log(displayName); // Guest
```

This works because `""` is falsy.

However, `||` treats all falsy values as missing.

```js
const quantity = 0;
const finalQuantity = quantity || 1;

console.log(finalQuantity); // 1
```

This may be wrong if `0` is a valid quantity.

For cases where only `null` or `undefined` should use the fallback, modern JavaScript provides `??`.

```js
const quantity = 0;
const finalQuantity = quantity ?? 1;

console.log(finalQuantity); // 0
```

You will learn more about nullish coalescing soon.

## The `"0"` Gotcha

The string `"0"` is truthy.

```js
const input = "0";

if (input) {
  console.log("This runs");
}
```

This runs because `"0"` contains one character.

If you need to detect the string `"0"`, check directly:

```js
if (input === "0") {
  console.log("Input is the string zero");
}
```

If you need a number, convert first:

```js
const numericInput = Number(input);

if (numericInput === 0) {
  console.log("Input is numeric zero");
}
```

## The Empty Array and Empty Object Gotcha

Empty arrays and empty objects are truthy.

```js
console.log(Boolean([])); // true
console.log(Boolean({})); // true
```

So this runs:

```js
if ([]) {
  console.log("Empty array is truthy");
}
```

To check if an array is empty:

```js
const items = [];

if (items.length === 0) {
  console.log("Array is empty");
}
```

To check if an object has no own enumerable keys:

```js
const user = {};

if (Object.keys(user).length === 0) {
  console.log("Object is empty");
}
```

## Avoid Overly Broad Checks

Truthy/falsy checks are concise, but they can hide intent.

This is broad:

```js
if (!value) {
  console.log("Missing value");
}
```

It catches:

- `false`
- `0`
- `""`
- `null`
- `undefined`
- `NaN`

If you only want to check for `null` or `undefined`, be specific:

```js
if (value == null) {
  console.log("Value is null or undefined");
}
```

If you only want to check for an empty string:

```js
if (value === "") {
  console.log("Value is an empty string");
}
```

If you only want to check for zero:

```js
if (value === 0) {
  console.log("Value is zero");
}
```

## Common Mistakes

## Thinking `"false"` Is Falsy

```js
console.log(Boolean("false")); // true
```

It is a non-empty string, so it is truthy.

## Thinking `"0"` Is Falsy

```js
console.log(Boolean("0")); // true
```

It is also a non-empty string.

## Checking an Empty Array Directly

```js
const items = [];

if (items) {
  console.log("This still runs");
}
```

Use `.length` when you care about array contents.

## Using `||` When `0` Is Valid

```js
const count = 0;
const finalCount = count || 10;

console.log(finalCount); // 10
```

If `0` is valid, use `??` or a direct check.

## Best Practices

1. Memorize the falsy values.
2. Remember that everything else is truthy.
3. Use truthy checks for simple existence checks.
4. Use direct comparisons when `0`, `""`, or `false` are valid values.
5. Check array length instead of checking the array itself.
6. Use `Boolean(value)` when you want an explicit boolean conversion.
7. Be careful with fallback values using `||`.

## Summary

Truthy and falsy values explain how JavaScript treats non-boolean values in conditions.

Falsy values include:

1. `false`
2. `0`
3. `-0`
4. `0n`
5. `""`
6. `null`
7. `undefined`
8. `NaN`

Everything else is truthy.

Remember:

1. `"0"` is truthy.
2. `"false"` is truthy.
3. `[]` is truthy.
4. `{}` is truthy.
5. `0` is falsy.
6. Empty strings are falsy.
7. Truthy/falsy checks are useful, but direct comparisons are safer when exact meaning matters.

Next, you will learn about optional chaining, a modern way to safely access nested values.
