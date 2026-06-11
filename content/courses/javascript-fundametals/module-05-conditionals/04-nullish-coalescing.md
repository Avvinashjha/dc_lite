# Nullish Coalescing

The nullish coalescing operator `??` provides fallback values in a safer way than `||` for many situations.

You learned earlier that `||` returns the first truthy value.

That is useful, but it has a problem:

```js
const volume = 0 || 50;

console.log(volume); // 50
```

This is wrong if `0` is a valid value.

The `??` operator solves this by only falling back when the value is `null` or `undefined`.

## What Does Nullish Mean?

In JavaScript, **nullish** means:

- `null`
- `undefined`

Only these two values are considered nullish.

These values are falsy, but not nullish:

- `0`
- `""`
- `false`
- `NaN`

## Basic Syntax

```js
const result = leftValue ?? fallbackValue;
```

If `leftValue` is not `null` or `undefined`, JavaScript returns `leftValue`.

If `leftValue` is `null` or `undefined`, JavaScript returns `fallbackValue`.

Example:

```js
console.log("Asha" ?? "Guest"); // Asha
console.log(null ?? "Guest"); // Guest
console.log(undefined ?? "Guest"); // Guest
```

## `??` Preserves Valid Falsy Values

Unlike `||`, `??` does not reject all falsy values.

```js
console.log(0 ?? 50); // 0
console.log("" ?? "Default"); // ""
console.log(false ?? true); // false
console.log(NaN ?? 100); // NaN
```

These values are not `null` or `undefined`, so they are preserved.

## The `||` Problem

Using `||` for defaults can accidentally replace valid values.

```js
function setVolume(userVolume) {
  const volume = userVolume || 50;

  console.log(`Volume set to: ${volume}`);
}

setVolume(0); // Volume set to: 50
setVolume(null); // Volume set to: 50
setVolume(80); // Volume set to: 80
```

The problem is `0`.

`0` is falsy, so `||` uses the fallback.

But `0` can be a valid volume level.

## The `??` Solution

Use `??` when only `null` or `undefined` should trigger the fallback.

```js
function setVolume(userVolume) {
  const volume = userVolume ?? 50;

  console.log(`Volume set to: ${volume}`);
}

setVolume(0); // Volume set to: 0
setVolume(null); // Volume set to: 50
setVolume(undefined); // Volume set to: 50
setVolume(80); // Volume set to: 80
```

Now `0` is preserved.

## `||` vs `??`

| Value | `value || "fallback"` | `value ?? "fallback"` |
| --- | --- | --- |
| `0` | `"fallback"` | `0` |
| `""` | `"fallback"` | `""` |
| `false` | `"fallback"` | `false` |
| `null` | `"fallback"` | `"fallback"` |
| `undefined` | `"fallback"` | `"fallback"` |
| `"hello"` | `"hello"` | `"hello"` |

Use this rule:

- Use `||` when any falsy value should fall back.
- Use `??` when only missing values should fall back.

## Common Use Case: API Data

An API may return `0` as a valid count.

```js
const apiResponse = {
  count: 0
};

const postCount = apiResponse.count ?? 0;

console.log(postCount); // 0
```

If the API returns `null`, you can use the fallback:

```js
const apiResponse = {
  count: null
};

const postCount = apiResponse.count ?? 0;

console.log(postCount); // 0
```

## Common Use Case: Configuration Defaults

Configuration values often use `false`, `0`, or `""` intentionally.

```js
const config = {
  timeout: 0,
  isEnabled: false,
  label: ""
};

const timeout = config.timeout ?? 3000;
const isEnabled = config.isEnabled ?? true;
const label = config.label ?? "Untitled";

console.log(timeout); // 0
console.log(isEnabled); // false
console.log(label); // ""
```

Using `||` here would incorrectly replace all three values.

## Chaining `??`

You can chain `??` when there are multiple possible sources.

```js
const configValue = null;
const envValue = undefined;
const defaultValue = "production";

const finalEnv = configValue ?? envValue ?? defaultValue;

console.log(finalEnv); // production
```

JavaScript returns the first value that is not `null` or `undefined`.

Another example:

```js
const localSetting = undefined;
const serverSetting = "dark";
const defaultSetting = "light";

const theme = localSetting ?? serverSetting ?? defaultSetting;

console.log(theme); // dark
```

## Mixing `??` with `&&` or `||`

JavaScript does not allow mixing `??` directly with `&&` or `||` without parentheses.

This is a syntax error:

```js
// const result = a || b ?? c;
```

Use parentheses to make the order clear:

```js
const result = (a || b) ?? c;
```

Or:

```js
const result = a || (b ?? c);
```

The parentheses tell JavaScript exactly how to group the logic.

## `??` with Optional Chaining

`??` is often used with optional chaining.

```js
const user = {
  profile: null
};

const displayName = user.profile?.name ?? "Guest";

console.log(displayName); // Guest
```

Optional chaining safely returns `undefined` if the property path is missing.

Then `??` provides the fallback.

You will learn optional chaining in more detail next.

## Common Mistakes

## Using `||` When `0` Is Valid

```js
const page = 0;
const currentPage = page || 1;

console.log(currentPage); // 1
```

Use `??`:

```js
const currentPage = page ?? 1;

console.log(currentPage); // 0
```

## Thinking `??` Handles All Falsy Values

```js
console.log("" ?? "Default"); // ""
console.log(false ?? true); // false
```

`??` only checks for `null` and `undefined`.

## Forgetting Parentheses

```js
// const value = a && b ?? c; // SyntaxError
```

Use:

```js
const value = (a && b) ?? c;
```

## Best Practices

1. Use `??` for defaults when `0`, `""`, or `false` should remain valid.
2. Use `||` only when all falsy values should trigger the fallback.
3. Use parentheses when combining `??` with `&&` or `||`.
4. Pair `??` with optional chaining for safe nested property access.
5. Choose the operator that communicates your intent clearly.

## Summary

The nullish coalescing operator `??` is a modern way to provide fallback values.

Remember:

1. `??` returns the right side only when the left side is `null` or `undefined`.
2. It preserves `0`, `""`, `false`, and `NaN`.
3. `||` checks truthiness, while `??` checks nullishness.
4. `??` is useful for API data and configuration defaults.
5. You can chain `??` to check multiple fallback sources.
6. You must use parentheses when mixing `??` with `&&` or `||`.

Next, you will learn optional chaining, which pairs naturally with nullish coalescing.
