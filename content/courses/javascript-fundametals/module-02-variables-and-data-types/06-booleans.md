# Booleans

Booleans are one of the simplest and most important data types in JavaScript.

A boolean can have only two possible values:

```js
true;
false;
```

You can think of a boolean like a yes/no answer:

- Is the user logged in? `true` or `false`
- Is the form valid? `true` or `false`
- Is the cart empty? `true` or `false`

Booleans are the foundation of decisions in programming.

## Creating Booleans

Create booleans by writing `true` or `false` without quotes.

```js
const isJavaScriptFun = true;
const isSkyGreen = false;

console.log(typeof isJavaScriptFun); // boolean
console.log(typeof isSkyGreen); // boolean
```

Do not put quotes around boolean values.

```js
const isActive = "true";

console.log(typeof isActive); // string
```

`"true"` is a string, not a boolean. This difference matters when you write conditions.

## Booleans from Comparisons

You will often get booleans from comparisons.

```js
const age = 20;

console.log(age > 18); // true
console.log(age === 25); // false
console.log(age < 0); // false
```

Comparison operators return `true` or `false`.

Common comparison operators:

| Operator | Meaning | Example |
| --- | --- | --- |
| `>` | Greater than | `10 > 5` gives `true` |
| `<` | Less than | `10 < 5` gives `false` |
| `>=` | Greater than or equal to | `10 >= 10` gives `true` |
| `<=` | Less than or equal to | `8 <= 10` gives `true` |
| `===` | Strictly equal | `5 === 5` gives `true` |
| `!==` | Strictly not equal | `5 !== 3` gives `true` |

Use `===` and `!==` for equality checks. They are safer than `==` and `!=` because they avoid unexpected type conversion.

```js
console.log(5 === "5"); // false
console.log(5 == "5"); // true
```

The strict comparison is usually what you want.

## Booleans in `if` Statements

Booleans control which code runs.

```js
const isLoggedIn = true;

if (isLoggedIn) {
  console.log("Welcome back!");
} else {
  console.log("Please log in.");
}
```

This condition:

```js
if (isLoggedIn) {
```

means:

```js
if (isLoggedIn === true) {
```

The shorter version is common and readable.

## Logical Operators

JavaScript has logical operators for combining or reversing boolean values.

## `&&` means AND

Both sides must be true.

```js
const isLoggedIn = true;
const hasPermission = true;

console.log(isLoggedIn && hasPermission); // true
```

If either side is false, the result is false.

```js
const isLoggedIn = true;
const hasPermission = false;

console.log(isLoggedIn && hasPermission); // false
```

## `||` means OR

At least one side must be true.

```js
const hasEmail = true;
const hasPhone = false;

console.log(hasEmail || hasPhone); // true
```

Only when both sides are false does `||` return false.

## `!` means NOT

The NOT operator reverses a boolean.

```js
const isLoggedIn = false;

console.log(!isLoggedIn); // true
```

This is useful for conditions:

```js
const isCartEmpty = true;

if (!isCartEmpty) {
  console.log("Proceed to checkout");
} else {
  console.log("Your cart is empty");
}
```

## Converting Values with `Boolean()`

You can convert a value to a boolean with the `Boolean()` function.

```js
console.log(Boolean(1)); // true
console.log(Boolean(0)); // false
console.log(Boolean("Hello")); // true
console.log(Boolean("")); // false
```

This introduces an important JavaScript concept: **truthy and falsy values**.

## Falsy Values

Falsy values behave like `false` in a boolean context.

The common falsy values are:

```js
false;
0;
"";
null;
undefined;
NaN;
```

Examples:

```js
console.log(Boolean(0)); // false
console.log(Boolean("")); // false
console.log(Boolean(null)); // false
console.log(Boolean(undefined)); // false
console.log(Boolean(NaN)); // false
```

## Truthy Values

Most other values are truthy.

```js
console.log(Boolean(1)); // true
console.log(Boolean(-1)); // true
console.log(Boolean("Hello")); // true
console.log(Boolean("0")); // true
console.log(Boolean("false")); // true
```

Notice that `"0"` and `"false"` are truthy because they are non-empty strings.

You will learn truthy and falsy behavior in more depth when you study conditionals.

## Practical Example

Imagine a login form.

```js
const email = "asha@example.com";
const password = "secret123";

const hasEmail = email !== "";
const hasPassword = password !== "";

if (hasEmail && hasPassword) {
  console.log("Form can be submitted");
} else {
  console.log("Please fill out all fields");
}
```

Here:

- `email !== ""` creates a boolean.
- `password !== ""` creates a boolean.
- `&&` checks that both are true.

## The `Boolean` Object Trap

JavaScript also has a `Boolean` object wrapper.

Avoid using it.

```js
const primitiveFalse = false;
const objectFalse = new Boolean(false);

console.log(typeof primitiveFalse); // boolean
console.log(typeof objectFalse); // object
```

The confusing part is that all objects are truthy.

```js
const objectFalse = new Boolean(false);

if (objectFalse) {
  console.log("This still runs");
}
```

Even though the internal value is `false`, the object itself is truthy.

Use primitive booleans:

```js
const isActive = false;
```

Do not use:

```js
const isActive = new Boolean(false);
```

## Naming Boolean Variables

Boolean variables are easier to read when their names sound like yes/no questions.

Good names:

```js
const isLoggedIn = true;
const hasPermission = false;
const canEdit = true;
const shouldShowMenu = false;
```

Less clear:

```js
const login = true;
const permission = false;
```

Names like `is`, `has`, `can`, and `should` make boolean values easier to understand.

## Summary

Booleans represent logical true or false values.

You learned that:

1. Boolean values are `true` and `false`.
2. `"true"` and `"false"` are strings, not booleans.
3. Comparisons return booleans.
4. Booleans control `if` statements and other decision-making logic.
5. `&&`, `||`, and `!` combine or reverse boolean values.
6. `Boolean()` converts values to booleans.
7. Some values are falsy, while most values are truthy.
8. Avoid `new Boolean()` because it creates a truthy object.

Next, you will learn about `null` and `undefined`, two values that represent absence in different ways.