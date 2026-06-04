# == vs ===

Equality is one of the most important operator topics in JavaScript.

JavaScript has two ways to compare whether values are equal:

- `==` loose equality
- `===` strict equality

They look similar, but they behave very differently.

The short rule is:

**Use `===` and `!==` by default. Avoid `==` unless you intentionally want its special behavior.**

## Loose Equality

The `==` operator checks whether two values are equal after allowing type coercion.

Type coercion means JavaScript may automatically convert one or both values before comparing them.

```js
console.log(5 == "5"); // true
```

This is true because JavaScript converts the string `"5"` to the number `5`.

More examples:

```js
console.log(0 == false); // true
console.log("" == 0); // true
console.log(null == undefined); // true
```

These results happen because `==` follows coercion rules before deciding equality.

## Why Loose Equality Can Be Dangerous

Loose equality can produce surprising results.

```js
console.log(false == "0"); // true
console.log(false == []); // true
console.log(" \t\r\n " == 0); // true
```

These are not results most beginners expect.

The problem is not that JavaScript is random. The rules are defined, but they are complex enough that code becomes harder to reason about.

In everyday application code, avoid loose equality unless you have a clear reason to use it.

## Strict Equality

The `===` operator checks both value and type.

It does not perform type coercion.

```js
console.log(5 === "5"); // false
console.log(0 === false); // false
console.log("" === 0); // false
console.log(null === undefined); // false
```

If the types are different, `===` returns `false` immediately.

When both type and value match, it returns `true`.

```js
console.log(5 === 5); // true
console.log("hello" === "hello"); // true
console.log(true === true); // true
```

This makes strict equality much more predictable.

## Loose vs Strict Comparison Table

| Expression | `==` result | `===` result | Why |
| --- | --- | --- | --- |
| `5` and `"5"` | `true` | `false` | Loose equality converts the string to a number |
| `0` and `false` | `true` | `false` | Loose equality converts false to `0` |
| `""` and `0` | `true` | `false` | Empty string can coerce to `0` |
| `null` and `undefined` | `true` | `false` | Special loose equality rule |
| `"hello"` and `"hello"` | `true` | `true` | Same type and same value |

## The Useful `value == null` Pattern

There is one common use of loose equality in modern JavaScript:

```js
if (value == null) {
  console.log("Value is null or undefined");
}
```

This checks for both:

```js
value === null
```

and:

```js
value === undefined
```

Why does this work?

```js
console.log(null == undefined); // true
```

But it does not match other falsy values:

```js
console.log(0 == null); // false
console.log("" == null); // false
console.log(false == null); // false
```

So this pattern is often useful when you specifically want to detect missing values.

The strict equivalent is:

```js
if (value === null || value === undefined) {
  console.log("Value is null or undefined");
}
```

Both are valid. Use whichever is clearer for your team.

## Be Careful with Falsy Checks

This is not the same as checking for `null` or `undefined`:

```js
if (!value) {
  console.log("Missing value");
}
```

That condition also catches:

- `0`
- `""`
- `false`
- `NaN`

Example:

```js
const count = 0;

if (!count) {
  console.log("This runs even though count is a valid number");
}
```

If you only mean `null` or `undefined`, use a more specific check.

## Inequality Operators

JavaScript also has two inequality operators:

- `!=` loose inequality
- `!==` strict inequality

## Loose Inequality

`!=` performs type coercion before checking that values are not equal.

```js
console.log(5 != "5"); // false
```

This is false because `5 == "5"` is true after coercion.

Avoid `!=` for the same reason you avoid `==`.

## Strict Inequality

`!==` checks both value and type.

```js
console.log(5 !== "5"); // true
console.log(5 !== 5); // false
```

Use `!==` by default when checking that values are different.

## Comparing Objects and Arrays

Objects and arrays are reference types.

When you compare them with `===`, JavaScript checks whether they are the exact same reference in memory.

It does not compare their contents.

```js
const arr1 = [1, 2, 3];
const arr2 = [1, 2, 3];
const arr3 = arr1;

console.log(arr1 === arr2); // false
console.log(arr1 === arr3); // true
```

`arr1` and `arr2` contain the same values, but they are two different arrays.

`arr3` points to the same array as `arr1`, so the comparison is true.

The same applies to objects:

```js
const user1 = { name: "Asha" };
const user2 = { name: "Asha" };
const user3 = user1;

console.log(user1 === user2); // false
console.log(user1 === user3); // true
```

To compare object or array contents, you need a custom comparison or a utility library.

## Comparing `NaN`

`NaN` is a special case.

It is not equal to itself.

```js
console.log(NaN === NaN); // false
console.log(NaN == NaN); // false
```

Use `Number.isNaN()` instead:

```js
const value = Number("hello");

console.log(Number.isNaN(value)); // true
```

## Best Practices

1. Use `===` for equality checks.
2. Use `!==` for inequality checks.
3. Avoid `==` and `!=` in normal application logic.
4. Use `value == null` only when you intentionally want to check for both `null` and `undefined`.
5. Do not use `!value` when `0`, `""`, or `false` are valid values.
6. Remember that objects and arrays are compared by reference, not by contents.
7. Use `Number.isNaN()` to check for `NaN`.

## Summary

Equality operators decide whether values are the same.

Remember:

1. `==` allows type coercion.
2. `===` checks both value and type.
3. `!=` allows type coercion.
4. `!==` checks both value and type.
5. Use strict equality and strict inequality by default.
6. `value == null` is a useful exception for checking both `null` and `undefined`.
7. Objects and arrays are equal only when they refer to the same object in memory.

Next, you will learn about assignment operators, which are used to store and update values.