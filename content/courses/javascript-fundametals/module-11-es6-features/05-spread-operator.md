# Spread Operator

Spread syntax expands an iterable or object into individual values.

It uses three dots:

```js
...
```

Example:

```js
const numbers = [1, 2, 3];

console.log(...numbers); // 1 2 3
```

Spread is used often with arrays, objects, and function calls.

## Spread With Arrays

You can copy an array with spread.

```js
const numbers = [1, 2, 3];
const copy = [...numbers];

console.log(copy); // [1, 2, 3]
```

This creates a new array.

```js
console.log(numbers === copy); // false
```

The arrays have the same values, but they are different arrays.

## Adding Items While Copying

```js
const numbers = [2, 3];

const updated = [1, ...numbers, 4];

console.log(updated); // [1, 2, 3, 4]
```

Spread inserts the elements of `numbers` into the new array.

## Combining Arrays

```js
const frontend = ["HTML", "CSS"];
const programming = ["JavaScript", "TypeScript"];

const skills = [...frontend, ...programming];

console.log(skills);
// ["HTML", "CSS", "JavaScript", "TypeScript"]
```

This is a modern alternative to `concat()`.

## Spread With Function Calls

Spread can pass array values as individual arguments.

```js
const numbers = [10, 5, 20];

console.log(Math.max(...numbers)); // 20
```

Without spread:

```js
Math.max(numbers); // NaN
```

`Math.max()` expects separate numbers, not an array.

Spread turns:

```js
[10, 5, 20]
```

into:

```js
10, 5, 20
```

## Spread With Strings

Strings are iterable, so spread can split them into characters.

```js
const letters = [..."hello"];

console.log(letters); // ["h", "e", "l", "l", "o"]
```

For most beginner work, `split("")` is more explicit.

But spread with strings is common in examples.

## Spread With Objects

Spread can copy object properties into a new object.

```js
const user = {
  name: "Alice",
  role: "user",
};

const copy = {
  ...user,
};

console.log(copy); // { name: "Alice", role: "user" }
```

Object spread creates a new top-level object.

## Updating Objects Immutably

Spread is often used to create updated objects without mutating the original.

```js
const user = {
  name: "Alice",
  role: "user",
};

const updatedUser = {
  ...user,
  role: "admin",
};

console.log(user.role); // user
console.log(updatedUser.role); // admin
```

This pattern is common in React and other state-based UI libraries.

## Spread Order Matters

Later properties override earlier properties.

```js
const user = {
  name: "Alice",
  role: "user",
};

const updatedUser = {
  ...user,
  role: "admin",
};

console.log(updatedUser.role); // admin
```

If you reverse the order:

```js
const updatedUser = {
  role: "admin",
  ...user,
};

console.log(updatedUser.role); // user
```

The spread copied `user.role` after your update.

## Merging Objects

```js
const defaults = {
  theme: "light",
  notifications: true,
};

const userSettings = {
  theme: "dark",
};

const settings = {
  ...defaults,
  ...userSettings,
};

console.log(settings);
// { theme: "dark", notifications: true }
```

This pattern lets user-provided settings override defaults.

## Spread Is Shallow

Spread creates a shallow copy.

Nested objects are still shared.

```js
const user = {
  name: "Alice",
  address: {
    city: "Delhi",
  },
};

const copy = {
  ...user,
};

copy.address.city = "Mumbai";

console.log(user.address.city); // Mumbai
```

The top-level object was copied.

The nested `address` object was not.

To update nested data safely, copy each level:

```js
const updatedUser = {
  ...user,
  address: {
    ...user.address,
    city: "Mumbai",
  },
};
```

## Spread vs Rest

Spread and rest use the same `...` syntax, but they do opposite things.

Spread expands values:

```js
const numbers = [1, 2, 3];
console.log(...numbers);
```

Rest collects values:

```js
function sum(...numbers) {
  return numbers.reduce((total, number) => total + number, 0);
}
```

Context tells you which one it is.

## Best Practices

Use spread to copy arrays:

```js
const copy = [...items];
```

Use spread to combine arrays:

```js
const combined = [...first, ...second];
```

Use spread for immutable object updates:

```js
const updated = { ...user, active: false };
```

Remember that spread is shallow.

Be careful with property order when merging objects.

## Common Mistakes

### Mistake 1: Thinking Spread Deep-Copies Everything

```js
const copy = { ...user };
```

This only copies the top level.

Nested objects are still shared.

### Mistake 2: Using Spread Order Incorrectly

```js
const updated = {
  role: "admin",
  ...user,
};
```

If `user` has a `role` property, it overwrites `"admin"`.

### Mistake 3: Confusing Spread With Rest

```js
const numbers = [1, 2, 3];
console.log(...numbers); // spread
```

```js
function sum(...numbers) {} // rest
```

Same syntax, different purpose.

## Quick Check

What does this log?

```js
const numbers = [1, 2, 3];
const updated = [0, ...numbers, 4];

console.log(updated);
```

It logs:

```js
[0, 1, 2, 3, 4]
```

What does this log?

```js
const user = {
  name: "Alice",
  role: "user",
};

const updated = {
  ...user,
  role: "admin",
};

console.log(updated.role);
```

It logs:

```text
admin
```

## Summary

Spread syntax expands values.

- Use `...array` to expand array elements.
- Use spread to copy and combine arrays.
- Use spread to pass array values into function calls.
- Use object spread to copy and merge object properties.
- Later object properties override earlier ones.
- Spread creates shallow copies.
- Spread expands values; rest collects values.
