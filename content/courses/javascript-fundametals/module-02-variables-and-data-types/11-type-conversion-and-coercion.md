# Type Conversion and Coercion

JavaScript is a dynamically typed language. A variable can hold a string at one moment and a number later.

```js
let value = "42";
value = 42;
```

This flexibility is useful, but it also means JavaScript sometimes changes values from one type to another.

There are two important terms:

- **Type conversion**: You explicitly change a value from one type to another.
- **Type coercion**: JavaScript automatically changes a value behind the scenes.

Understanding the difference helps you avoid confusing bugs.

## Type Conversion

Type conversion is explicit.

You, the developer, ask JavaScript to convert a value.

```js
const ageText = "25";
const age = Number(ageText);

console.log(age); // 25
console.log(typeof age); // number
```

This is usually safer than relying on JavaScript to guess what you meant.

## Converting to a String

Use `String()` to convert a value to a string.

```js
console.log(String(42)); // "42"
console.log(String(true)); // "true"
console.log(String(null)); // "null"
console.log(String(undefined)); // "undefined"
```

Some values also have a `.toString()` method.

```js
const count = 42;

console.log(count.toString()); // "42"
```

`String()` is often safer because it works with `null` and `undefined`.

```js
console.log(String(null)); // "null"

// null.toString(); // Error
```

## Converting to a Number

Use `Number()` to convert a value to a number.

```js
console.log(Number("100")); // 100
console.log(Number("3.14")); // 3.14
console.log(Number(true)); // 1
console.log(Number(false)); // 0
console.log(Number(null)); // 0
console.log(Number(undefined)); // NaN
```

If JavaScript cannot convert the value into a valid number, the result is `NaN`.

```js
console.log(Number("hello")); // NaN
```

An empty string becomes `0`:

```js
console.log(Number("")); // 0
```

This is one reason conversions should be done intentionally and tested carefully.

## `parseInt()` and `parseFloat()`

`Number()` expects the whole value to be numeric.

```js
console.log(Number("100px")); // NaN
```

`Number.parseInt()` can read an integer from the beginning of a string.

```js
console.log(Number.parseInt("100px")); // 100
console.log(Number.parseInt("42")); // 42
```

`Number.parseFloat()` can read a decimal number.

```js
console.log(Number.parseFloat("3.14px")); // 3.14
console.log(Number.parseFloat("9.99")); // 9.99
```

These functions are useful when extracting numbers from text, such as CSS values.

## Converting to a Boolean

Use `Boolean()` to convert a value to `true` or `false`.

```js
console.log(Boolean("Hello")); // true
console.log(Boolean("")); // false
console.log(Boolean(42)); // true
console.log(Boolean(0)); // false
console.log(Boolean(null)); // false
console.log(Boolean(undefined)); // false
console.log(Boolean(NaN)); // false
```

This uses JavaScript's truthy and falsy rules.

Falsy values include:

```js
false;
0;
"";
null;
undefined;
NaN;
```

Most other values are truthy.

```js
console.log(Boolean("0")); // true
console.log(Boolean("false")); // true
console.log(Boolean([])); // true
console.log(Boolean({})); // true
```

## Type Coercion

Type coercion is implicit.

JavaScript automatically converts a value because of the operation you are performing.

This can be convenient, but it can also be surprising.

```js
console.log("5" + 1); // "51"
console.log("5" - 1); // 4
```

The first result is a string. The second result is a number.

To write predictable code, you should understand why.

## String Coercion with `+`

The `+` operator has two jobs in JavaScript:

- Add numbers
- Join strings

If one side is a string, JavaScript usually converts the other side to a string and concatenates.

```js
console.log("5" + 1); // "51"
console.log("Hello " + "World"); // "Hello World"
console.log(true + " value"); // "true value"
```

This is why template literals are often clearer.

```js
const count = 5;

console.log(`Count: ${count}`);
```

## Number Coercion with Math Operators

Operators like `-`, `*`, `/`, and `%` are only mathematical operators.

So JavaScript tries to convert string values to numbers.

```js
console.log("10" - 2); // 8
console.log("10" * "2"); // 20
console.log("10" / 2); // 5
console.log("10" % 3); // 1
```

If conversion fails, the result is `NaN`.

```js
console.log("hello" - 2); // NaN
```

## Boolean Coercion in Conditions

Conditions automatically convert values to booleans.

```js
const name = "Asha";

if (name) {
  console.log("Name exists");
}
```

The string `"Asha"` is truthy, so the `if` block runs.

An empty string is falsy:

```js
const name = "";

if (name) {
  console.log("Name exists");
} else {
  console.log("Name is empty");
}
```

This behavior is common and useful, but be careful when values like `0` are valid.

```js
const count = 0;

if (count) {
  console.log("Count exists");
} else {
  console.log("This also runs when count is zero");
}
```

If `0` is a valid value, check more directly.

```js
if (count !== null && count !== undefined) {
  console.log("Count has a value");
}
```

## Loose Equality Coercion

The `==` operator allows coercion before comparing.

```js
console.log(5 == "5"); // true
console.log(0 == false); // true
console.log("" == 0); // true
console.log(null == undefined); // true
```

These results can be surprising.

The `===` operator checks both value and type.

```js
console.log(5 === "5"); // false
console.log(0 === false); // false
console.log("" === 0); // false
console.log(null === undefined); // false
```

Use strict equality by default.

## The `null == undefined` Exception

There is one common intentional use of loose equality:

```js
if (value == null) {
  console.log("Value is null or undefined");
}
```

This catches only `null` and `undefined`, not other falsy values.

```js
console.log(null == undefined); // true
console.log(0 == null); // false
console.log("" == null); // false
console.log(false == null); // false
```

Use this pattern only when you specifically want to check for both `null` and `undefined`.

## Best Practices

1. Prefer explicit conversion with `String()`, `Number()`, and `Boolean()`.
2. Use `===` and `!==` instead of `==` and `!=` in most cases.
3. Be careful with the `+` operator when strings are involved.
4. Use template literals for readable string building.
5. Check for `NaN` with `Number.isNaN()`.
6. Be careful with truthy/falsy checks when `0`, `""`, or `false` are valid values.

## Summary

Type conversion and coercion both change values from one type to another, but they happen in different ways.

Remember:

1. Type conversion is explicit and controlled by you.
2. Type coercion is automatic and done by JavaScript.
3. `String()`, `Number()`, and `Boolean()` are common conversion tools.
4. `+` may concatenate strings instead of adding numbers.
5. Math operators like `-`, `*`, and `/` usually coerce values to numbers.
6. Conditions coerce values to booleans.
7. Loose equality `==` performs coercion and can be surprising.
8. Strict equality `===` avoids hidden type conversion.

You have now completed the Variables and Data Types module. The next step is to test your understanding with the module knowledge checks.