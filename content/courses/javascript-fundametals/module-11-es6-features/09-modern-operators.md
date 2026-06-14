# Modern Operators

Modern JavaScript includes operators that make common checks shorter and safer.

This lesson focuses on two very common ES6+ era features:

- optional chaining: `?.`
- nullish coalescing: `??`

You may have seen these earlier.

Here, we connect them to modern JavaScript patterns.

## The Problem With Deep Property Access

Objects often contain nested data.

```js
const user = {
  profile: {
    address: {
      city: "Delhi",
    },
  },
};

console.log(user.profile.address.city); // Delhi
```

But what if `profile` is missing?

```js
const user = {};

console.log(user.profile.address.city); // TypeError
```

JavaScript cannot read `address` from `undefined`.

## Optional Chaining

Optional chaining lets you safely access nested properties.

```js
const user = {};

console.log(user.profile?.address?.city); // undefined
```

If the value before `?.` is `null` or `undefined`, JavaScript stops and returns `undefined`.

This avoids a `TypeError`.

## Optional Chaining With Methods

Optional chaining can also call a method only if it exists.

```js
const user = {
  greet() {
    return "Hello";
  },
};

console.log(user.greet?.()); // Hello
```

If the method is missing:

```js
const user = {};

console.log(user.greet?.()); // undefined
```

This is useful when a callback or method may not exist.

## Optional Chaining With Arrays

You can use optional chaining with bracket access.

```js
const users = [{ name: "Alice" }];

console.log(users[0]?.name); // Alice
console.log(users[1]?.name); // undefined
```

This is helpful when an array item may not exist.

## Nullish Coalescing

Nullish coalescing provides a fallback only when a value is `null` or `undefined`.

```js
const name = null;

const displayName = name ?? "Guest";

console.log(displayName); // Guest
```

The operator is:

```js
??
```

Read it as:

```text
Use the left value unless it is null or undefined.
Otherwise use the right value.
```

## `??` vs `||`

The `||` operator uses the right value for any falsy left value.

Falsy values include:

- `false`
- `0`
- `""`
- `null`
- `undefined`
- `NaN`

Example:

```js
const count = 0;

console.log(count || 10); // 10
console.log(count ?? 10); // 0
```

`0` is falsy, so `||` uses `10`.

But `0` is not `null` or `undefined`, so `??` keeps `0`.

## Preserving Valid Falsy Values

Use `??` when values like `0`, `false`, or `""` are valid.

```js
const settings = {
  volume: 0,
  darkMode: false,
};

const volume = settings.volume ?? 50;
const darkMode = settings.darkMode ?? true;

console.log(volume); // 0
console.log(darkMode); // false
```

Using `||` here would produce incorrect defaults.

## Combining `?.` and `??`

Optional chaining and nullish coalescing work well together.

```js
const user = {};

const city = user.profile?.address?.city ?? "Unknown";

console.log(city); // Unknown
```

Optional chaining safely reads the nested value.

Nullish coalescing provides a fallback.

This is a very common modern JavaScript pattern.

## Optional Chaining Does Not Hide All Errors

Optional chaining only protects against `null` or `undefined` at that point in the chain.

```js
const user = {
  profile: null,
};

console.log(user.profile?.name); // undefined
```

But this still fails:

```js
const user = null;

console.log(user.profile?.name); // TypeError
```

Why?

The optional chain starts at `profile`, but `user` itself is `null`.

Correct:

```js
console.log(user?.profile?.name); // undefined
```

Put `?.` where a value may be `null` or `undefined`.

## Do Not Overuse Optional Chaining

Optional chaining is useful when missing data is expected.

But if a value should always exist, optional chaining can hide bugs.

```js
const total = cart?.items?.length ?? 0;
```

This is fine if `cart` may be missing.

But if `cart` should never be missing, a thrown error might reveal a real problem earlier.

Use optional chaining intentionally.

## Best Practices

Use optional chaining for uncertain nested data:

```js
const email = user.profile?.email;
```

Use nullish coalescing for safe defaults:

```js
const limit = options.limit ?? 10;
```

Use `??` instead of `||` when `0`, `false`, or `""` should be preserved.

Combine them for common fallback patterns:

```js
const city = user.address?.city ?? "Unknown";
```

Do not use optional chaining to hide bugs in required data.

## Common Mistakes

### Mistake 1: Using `||` When `0` Is Valid

```js
const quantity = 0;
const finalQuantity = quantity || 1;

console.log(finalQuantity); // 1
```

Correct:

```js
const finalQuantity = quantity ?? 1;
```

### Mistake 2: Starting Optional Chaining Too Late

```js
const user = null;

console.log(user.profile?.name); // TypeError
```

Correct:

```js
console.log(user?.profile?.name); // undefined
```

### Mistake 3: Overusing Optional Chaining

If data is required, optional chaining may hide a bug.

Use it when absence is expected.

## Quick Check

What does this log?

```js
const user = {};

console.log(user.profile?.email ?? "No email");
```

It logs:

```text
No email
```

What does this log?

```js
const count = 0;

console.log(count ?? 10);
```

It logs:

```text
0
```

`0` is not `null` or `undefined`.

## Summary

Modern operators make safe access and defaults easier.

- Optional chaining `?.` safely accesses values that may be missing.
- It stops when the value before `?.` is `null` or `undefined`.
- Nullish coalescing `??` provides defaults for `null` or `undefined`.
- `??` preserves valid falsy values like `0`, `false`, and `""`.
- `?.` and `??` are often used together.
- Use these operators intentionally, not to hide required data problems.
