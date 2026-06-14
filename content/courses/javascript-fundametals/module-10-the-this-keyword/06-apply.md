# apply()

`apply()` is similar to `call()`.

It runs a function immediately with a specific `this` value.

The difference is how arguments are passed.

```js
function introduce(role, city) {
  return `${this.name} is a ${role} from ${city}`;
}

const user = {
  name: "Alice",
};

const message = introduce.apply(user, ["developer", "Delhi"]);

console.log(message); // Alice is a developer from Delhi
```

With `apply()`, arguments are passed as an array.

## Basic Syntax

```js
functionName.apply(thisValue, [arg1, arg2, arg3]);
```

The first argument is the value of `this`.

The second argument is an array or array-like object containing the function arguments.

## `apply()` Runs Immediately

Like `call()`, `apply()` calls the function right away.

```js
function sayName() {
  console.log(this.name);
}

const user = {
  name: "Alice",
};

sayName.apply(user); // Alice
```

It does not return a new bound function.

If you need a function for later, use `bind()`.

## `apply()` With Arguments

```js
function add(a, b, c) {
  return a + b + c;
}

const numbers = [1, 2, 3];

console.log(add.apply(null, numbers)); // 6
```

The array values become individual arguments:

```js
add(1, 2, 3)
```

`null` is used because `add` does not use `this`.

## `apply()` vs `call()`

`call()` passes arguments one by one.

```js
introduce.call(user, "developer", "Delhi");
```

`apply()` passes arguments as an array.

```js
introduce.apply(user, ["developer", "Delhi"]);
```

Both call the function immediately.

Only the argument style is different.

## Practical Example: Math.max

`Math.max()` expects individual arguments.

```js
console.log(Math.max(10, 5, 20)); // 20
```

If your numbers are already in an array, older code often used `apply()`.

```js
const numbers = [10, 5, 20];

console.log(Math.max.apply(null, numbers)); // 20
```

Modern JavaScript usually uses spread syntax:

```js
console.log(Math.max(...numbers)); // 20
```

Still, understanding `apply()` helps you read older code.

## Method Borrowing With `apply()`

Like `call()`, `apply()` can borrow methods.

```js
const user = {
  name: "Alice",
  describe(role, city) {
    return `${this.name} is a ${role} from ${city}`;
  },
};

const admin = {
  name: "Ava",
};

const args = ["manager", "Mumbai"];

console.log(user.describe.apply(admin, args));
// Ava is a manager from Mumbai
```

The method belongs to `user`.

But during this call, `this` is `admin`.

## `apply()` and Array-Like Values

`apply()` can also work with array-like values.

Array-like values have indexed items and a `length`, but are not true arrays.

Older JavaScript used this pattern with `arguments`.

```js
function maxOfArguments() {
  return Math.max.apply(null, arguments);
}

console.log(maxOfArguments(4, 9, 2)); // 9
```

Modern JavaScript usually prefers rest parameters:

```js
function maxOfArguments(...numbers) {
  return Math.max(...numbers);
}
```

But `apply()` is still important for understanding existing code.

## `apply()` vs Spread Syntax

Modern JavaScript often uses spread syntax instead of `apply()`.

Older:

```js
fn.apply(context, args);
```

Modern:

```js
fn.call(context, ...args);
```

Or if `this` does not matter:

```js
fn(...args);
```

Example:

```js
const numbers = [1, 2, 3];

console.log(Math.max.apply(null, numbers)); // 3
console.log(Math.max(...numbers)); // 3
```

Spread syntax is usually more readable.

`apply()` is still useful when you specifically need to set `this` and pass an argument array.

## `apply()` and Arrow Functions

`apply()` cannot change an arrow function's `this`.

```js
const user = {
  name: "Alice",
};

const greet = () => {
  console.log(this.name);
};

greet.apply(user); // not Alice
```

Arrow functions use lexical `this`.

Use a regular function when you need `apply()` to control context.

## Comparing `bind`, `call`, and `apply`

| Method | Runs immediately? | Sets `this`? | Argument style |
| --- | --- | --- | --- |
| `bind()` | No | Yes | One by one, preset for later |
| `call()` | Yes | Yes | One by one |
| `apply()` | Yes | Yes | Array or array-like |

Examples:

```js
fn.bind(user); // returns a new function
fn.call(user, a, b); // runs now
fn.apply(user, [a, b]); // runs now
```

## Best Practices

Use `apply()` when your arguments are already in an array and you need to choose `this`.

```js
fn.apply(context, args);
```

Use spread syntax when `this` does not matter:

```js
fn(...args);
```

Use `call()` when arguments are written one by one:

```js
fn.call(context, arg1, arg2);
```

Use `bind()` when you need to save a function for later:

```js
const bound = fn.bind(context);
```

Do not expect `apply()` to change arrow function `this`.

## Common Mistakes

### Mistake 1: Passing Arguments One by One to `apply()`

```js
introduce.apply(user, "developer", "Delhi");
```

This is wrong.

The second argument should be an array:

```js
introduce.apply(user, ["developer", "Delhi"]);
```

### Mistake 2: Thinking `apply()` Returns a Bound Function

```js
const result = fn.apply(context, args);
```

This stores the function's return value.

It does not store a bound function.

### Mistake 3: Using `apply()` When Spread Is Clearer

```js
Math.max.apply(null, numbers);
```

Modern code often prefers:

```js
Math.max(...numbers);
```

## Quick Check

What does this log?

```js
function add(a, b) {
  return a + b;
}

console.log(add.apply(null, [2, 3]));
```

It logs:

```text
5
```

What is the main difference between `call()` and `apply()`?

```text
call passes arguments one by one.
apply passes arguments as an array.
```

## Summary

`apply()` calls a function immediately with a chosen `this` value and an array of arguments.

- The first argument becomes `this`.
- The second argument is an array or array-like list of function arguments.
- `apply()` runs immediately.
- `apply()` is similar to `call()`, but the argument style is different.
- Modern spread syntax often replaces older `apply()` usage.
- `apply()` cannot change arrow function `this`.
- Use `bind()` when you need a function for later.
