# Logical Short-Circuiting

Logical operators in JavaScript do more than return `true` or `false`.

The `&&` and `||` operators evaluate values from left to right and return one of the actual operand values.

They also stop early when they already know the result.

This behavior is called **short-circuiting**.

## What Does Short-Circuiting Mean?

Short-circuiting means JavaScript stops evaluating an expression as soon as the final result is known.

Example:

```js
const result = "Asha" || "Guest";

console.log(result); // Asha
```

JavaScript does not need to evaluate `"Guest"` as the final value because `"Asha"` is already truthy.

## `||` Returns the First Truthy Value

The `||` operator looks for the first truthy value.

Rules:

1. Evaluate from left to right.
2. Return the first truthy value.
3. If every value is falsy, return the last value.

```js
console.log("Asha" || "Guest"); // Asha
console.log("" || "Guest"); // Guest
console.log(null || undefined || "Default"); // Default
console.log(false || 0 || ""); // ""
```

In the last example, all values are falsy, so `||` returns the last value.

## Using `||` for Default Values

One common use of `||` is providing fallback values.

```js
const userProvidedName = "";
const defaultName = "Guest";

const displayName = userProvidedName || defaultName;

console.log(displayName); // Guest
```

Because `userProvidedName` is an empty string, it is falsy.

So JavaScript returns `"Guest"`.

## Chaining Fallbacks

You can chain multiple fallback values.

```js
const configColor = null;
const themeColor = undefined;
const defaultColor = "blue";

const finalColor = configColor || themeColor || defaultColor;

console.log(finalColor); // blue
```

JavaScript checks:

1. `configColor`: falsy
2. `themeColor`: falsy
3. `defaultColor`: truthy

It returns `"blue"` and stops.

## The `||` Gotcha

`||` uses truthiness.

That means it treats all falsy values as missing.

This can cause bugs when `0`, `""`, or `false` are valid values.

```js
function setVolume(level) {
  const safeLevel = level || 50;

  console.log(safeLevel);
}

setVolume(0); // 50
```

This is wrong if `0` means muted volume.

`0` is falsy, so `||` uses the fallback.

## `??` for Nullish Fallbacks

The nullish coalescing operator `??` checks only for:

- `null`
- `undefined`

It does not treat `0`, `""`, or `false` as missing.

```js
function setVolume(level) {
  const safeLevel = level ?? 50;

  console.log(safeLevel);
}

setVolume(0); // 0
setVolume(null); // 50
setVolume(undefined); // 50
```

Use `??` when you only want a fallback for missing values.

Use `||` when any falsy value should trigger the fallback.

## `&&` Returns the First Falsy Value

The `&&` operator looks for the first falsy value.

Rules:

1. Evaluate from left to right.
2. Return the first falsy value.
3. If every value is truthy, return the last value.

```js
console.log("Asha" && "Developer"); // Developer
console.log("Asha" && 0 && "Developer"); // 0
console.log(true && "Done"); // Done
console.log(true && null && "Done"); // null
```

When all values are truthy, `&&` returns the last value.

When it finds a falsy value, it stops and returns that value.

## Using `&&` as a Guard

`&&` can prevent code from running when a required value is missing.

```js
const user = null;

const userName = user && user.name;

console.log(userName); // null
```

JavaScript stops at `user` because it is `null`.

It never tries to read:

```js
user.name
```

This avoids an error.

Modern JavaScript often uses optional chaining for this:

```js
const userName = user?.name;
```

You will learn optional chaining next.

## Conditional Execution with `&&`

You can use `&&` to run something only when a condition is truthy.

```js
const isLoggedIn = true;

isLoggedIn && showDashboard();
```

If `isLoggedIn` is true, `showDashboard()` runs.

If `isLoggedIn` is false, JavaScript stops before calling the function.

Equivalent `if` version:

```js
if (isLoggedIn) {
  showDashboard();
}
```

Use the version that is easier to read.

For multiple statements, prefer `if`.

```js
if (isLoggedIn) {
  showDashboard();
  updateLastSeen();
}
```

## Combining `&&` and `||`

You may see expressions that combine both operators.

```js
const name = user && user.name || "Guest";
```

This means:

1. If `user` exists, try `user.name`.
2. If that result is falsy, use `"Guest"`.

However, this can become hard to read.

Modern JavaScript is clearer:

```js
const name = user?.name ?? "Guest";
```

When expressions become complex, prefer clearer syntax or `if...else`.

## Short-Circuiting Prevents Unneeded Work

Short-circuiting can avoid unnecessary function calls.

```js
function expensiveCheck() {
  console.log("Running expensive check");
  return true;
}

const isEnabled = false;

if (isEnabled && expensiveCheck()) {
  console.log("Allowed");
}
```

Because `isEnabled` is false, `expensiveCheck()` never runs.

This is useful when the right side should only run if the left side passes.

## Practical Example: Display Name

```js
const user = {
  profile: {
    displayName: ""
  }
};

const displayName = user.profile.displayName || "Guest";

console.log(displayName); // Guest
```

This is okay if an empty display name should use the fallback.

If an empty string is valid, use a more specific check.

```js
const displayName = user.profile.displayName ?? "Guest";
```

## Practical Example: Safe Callback

Sometimes a function argument is optional.

```js
function saveData(data, onSuccess) {
  console.log("Saving data...");

  onSuccess && onSuccess();
}

saveData({ name: "Asha" });
saveData({ name: "Asha" }, () => console.log("Saved"));
```

The callback only runs if it exists.

This works, but optional chaining is more direct:

```js
onSuccess?.();
```

## Common Mistakes

## Using `||` When `0` Is Valid

```js
const page = 0;
const currentPage = page || 1;

console.log(currentPage); // 1
```

If page `0` is valid, use `??`.

```js
const currentPage = page ?? 1;
```

## Expecting Logical Operators to Return Booleans

```js
console.log("hello" || "default"); // hello
console.log("hello" && "done"); // done
```

These operators return actual values.

Use `Boolean()` if you need a strict boolean.

```js
console.log(Boolean("hello" && "done")); // true
```

## Making Expressions Too Clever

Avoid code that is short but hard to understand.

```js
const result = user && user.profile && user.profile.name || "Guest";
```

Prefer:

```js
const result = user?.profile?.name ?? "Guest";
```

Or use clear `if...else` logic.

## Best Practices

1. Use `||` for fallbacks only when all falsy values should fall back.
2. Use `??` when only `null` or `undefined` should fall back.
3. Use `&&` for simple guards or conditional execution.
4. Prefer `if...else` when there are multiple actions.
5. Remember that `&&` and `||` return actual operand values.
6. Avoid overly clever chains that hide intent.

## Summary

Logical short-circuiting lets JavaScript stop evaluating early.

Remember:

1. `||` returns the first truthy value, or the last value if all are falsy.
2. `&&` returns the first falsy value, or the last value if all are truthy.
3. `||` is useful for fallback values but can mishandle valid falsy values like `0`.
4. `??` is better when only `null` or `undefined` should trigger a fallback.
5. `&&` can guard property access or conditionally run a function.
6. Short-circuiting can avoid unnecessary work.
7. Clear code is better than clever code.

Next, you will learn optional chaining, a modern syntax for safely accessing nested properties.
