# includes

Sometimes you do not need to transform, filter, sort, or flatten an array.

Sometimes you only need to ask a simple question:

```text
Does this array contain this value?
```

That is what **`.includes()`** is for.

## What Is `includes`?

`includes` checks whether an array contains a specific value.

It returns a boolean:

- `true`
- `false`

```js
const roles = ["admin", "editor", "viewer"];

console.log(roles.includes("admin")); // true
console.log(roles.includes("guest")); // false
```

`includes` is simple, readable, and useful for checking membership.

## Basic Syntax

```js
array.includes(valueToFind);
```

Example:

```js
const fruits = ["Apple", "Banana", "Cherry"];

const hasBanana = fruits.includes("Banana");

console.log(hasBanana); // true
```

The value must match an element in the array.

If no element matches, the result is `false`.

## Checking Strings in an Array

```js
const allowedRoles = ["admin", "editor"];

const userRole = "editor";

if (allowedRoles.includes(userRole)) {
  console.log("Access granted");
} else {
  console.log("Access denied");
}
```

Output:

```text
Access granted
```

This is a common use case.

Instead of writing:

```js
if (userRole === "admin" || userRole === "editor") {
  console.log("Access granted");
}
```

You can write:

```js
if (allowedRoles.includes(userRole)) {
  console.log("Access granted");
}
```

This becomes easier to read as the list grows.

## Checking Numbers in an Array

```js
const selectedIds = [101, 204, 309];

console.log(selectedIds.includes(204)); // true
console.log(selectedIds.includes(999)); // false
```

This is useful when checking selected values, allowed IDs, or completed steps.

## Checking Booleans

`includes` works with booleans too.

```js
const validationResults = [true, true, false];

console.log(validationResults.includes(false)); // true
```

This tells you at least one validation failed.

However, for this kind of boolean test, `.some()` or `.every()` may communicate intent better:

```js
const allValid = validationResults.every((result) => result === true);

console.log(allValid); // false
```

Use the method that makes the question clearest.

## `includes` Is Case-Sensitive

String checks are case-sensitive.

```js
const fruits = ["Apple", "Banana", "Cherry"];

console.log(fruits.includes("Apple")); // true
console.log(fruits.includes("apple")); // false
```

If you want a case-insensitive check, normalize the values.

```js
const fruits = ["Apple", "Banana", "Cherry"];
const search = "apple";

const hasFruit = fruits
  .map((fruit) => fruit.toLowerCase())
  .includes(search.toLowerCase());

console.log(hasFruit); // true
```

For larger arrays, you may prefer `.some()` to avoid creating a new array:

```js
const hasFruit = fruits.some((fruit) => {
  return fruit.toLowerCase() === search.toLowerCase();
});

console.log(hasFruit); // true
```

## Using `fromIndex`

`includes` has an optional second argument:

```js
array.includes(valueToFind, fromIndex);
```

`fromIndex` tells JavaScript where to start searching.

```js
const letters = ["A", "B", "C", "B"];

console.log(letters.includes("B")); // true
console.log(letters.includes("B", 2)); // true
console.log(letters.includes("B", 3)); // true
console.log(letters.includes("B", 4)); // false
```

The last check starts at index `4`.

There is no item at index `4`, so it returns `false`.

## Negative `fromIndex`

`fromIndex` can be negative.

A negative value starts searching that many positions from the end.

```js
const letters = ["A", "B", "C", "D"];

console.log(letters.includes("C", -2)); // true
console.log(letters.includes("B", -2)); // false
```

`-2` starts searching from index `2`, which is `"C"`.

So `"C"` is found, but `"B"` is not searched.

Most of the time, you will use `includes` without `fromIndex`.

But it is useful to know it exists.

## `includes` and `NaN`

`includes` can find `NaN`.

```js
const values = [1, 2, NaN, 4];

console.log(values.includes(NaN)); // true
```

This is helpful because `NaN` is unusual:

```js
console.log(NaN === NaN); // false
```

Even though `NaN === NaN` is false, `includes(NaN)` works.

## `includes` With Objects

This is an important reference-type caveat.

`includes` checks whether the array contains the exact same object reference.

```js
const user = { id: 1, name: "Alice" };
const users = [user];

console.log(users.includes(user)); // true
```

This works because the same object reference is in the array.

But this does not work:

```js
const users = [{ id: 1, name: "Alice" }];

console.log(users.includes({ id: 1, name: "Alice" })); // false
```

The object looks the same, but it is a different object in memory.

Objects are compared by reference, not by shape.

## Finding Objects by Property

If you need to check whether an object with a certain property exists, use `.some()` or `.find()`.

Use `.some()` when you need a boolean:

```js
const users = [{ id: 1, name: "Alice" }];

const hasUser = users.some((user) => user.id === 1);

console.log(hasUser); // true
```

Use `.find()` when you need the object:

```js
const user = users.find((user) => user.id === 1);

console.log(user); // { id: 1, name: "Alice" }
```

Do not use `includes` to search object properties.

Use it for direct value membership.

## `includes` vs `indexOf`

Before `includes`, developers often used `indexOf`.

```js
const fruits = ["Apple", "Banana", "Cherry"];

console.log(fruits.indexOf("Banana")); // 1
console.log(fruits.indexOf("Orange")); // -1
```

To check membership with `indexOf`, you had to write:

```js
if (fruits.indexOf("Banana") !== -1) {
  console.log("Found it");
}
```

With `includes`, the intent is clearer:

```js
if (fruits.includes("Banana")) {
  console.log("Found it");
}
```

Use `includes` when you only need a boolean.

Use `indexOf` if you specifically need the index of a primitive value.

## `includes` vs `some`

Both can answer yes/no questions.

Use `includes` for direct value checks:

```js
const roles = ["admin", "editor"];

console.log(roles.includes("admin")); // true
```

Use `some` for condition-based checks:

```js
const users = [
  { name: "Alice", role: "admin" },
  { name: "Bob", role: "user" },
];

const hasAdmin = users.some((user) => user.role === "admin");

console.log(hasAdmin); // true
```

Comparison:

| Method | Best for | Returns |
| --- | --- | --- |
| `includes` | Checking a direct value | Boolean |
| `some` | Checking a condition | Boolean |

## Practical Example: Feature Flags

```js
const enabledFeatures = ["dark-mode", "notifications", "autosave"];

function isFeatureEnabled(featureName) {
  return enabledFeatures.includes(featureName);
}

console.log(isFeatureEnabled("dark-mode")); // true
console.log(isFeatureEnabled("beta-dashboard")); // false
```

This pattern is easy to read.

The array stores allowed values.

`includes` checks whether a requested value exists in that list.

## Practical Example: Form Validation

```js
const allowedFileTypes = ["jpg", "png", "webp"];

const uploadedFileType = "png";

if (allowedFileTypes.includes(uploadedFileType)) {
  console.log("File type allowed");
} else {
  console.log("Invalid file type");
}
```

This is a clean alternative to several `||` checks.

## Practical Example: Avoiding Duplicates

You can use `includes` before adding a value.

```js
const tags = ["javascript", "arrays"];
const newTag = "javascript";

if (!tags.includes(newTag)) {
  tags.push(newTag);
}

console.log(tags); // ["javascript", "arrays"]
```

This prevents duplicate primitive values.

For objects, use a property check with `.some()` instead.

```js
const users = [{ id: 1, name: "Alice" }];
const newUser = { id: 1, name: "Alice" };

const alreadyExists = users.some((user) => user.id === newUser.id);

if (!alreadyExists) {
  users.push(newUser);
}
```

## Best Practices

Use `includes` for simple value membership:

```js
const hasRole = allowedRoles.includes(userRole);
```

Use `some` for object property checks:

```js
const hasUser = users.some((user) => user.id === targetId);
```

Normalize strings for case-insensitive checks:

```js
const hasName = names.some((name) => {
  return name.toLowerCase() === search.toLowerCase();
});
```

Use `includes` instead of `indexOf(...) !== -1` when you only need `true` or `false`:

```js
const hasItem = items.includes(item);
```

Remember that `includes` compares objects by reference:

```js
users.includes({ id: 1 }); // Usually not what you want
```

## Common Mistakes

### Mistake 1: Expecting Object Shape Comparison

```js
const users = [{ id: 1, name: "Alice" }];

console.log(users.includes({ id: 1, name: "Alice" })); // false
```

The object has the same properties, but it is not the same reference.

Use `some`:

```js
const exists = users.some((user) => user.id === 1);

console.log(exists); // true
```

### Mistake 2: Forgetting Case Sensitivity

```js
const fruits = ["Apple", "Banana"];

console.log(fruits.includes("apple")); // false
```

Normalize both sides:

```js
const hasApple = fruits.some((fruit) => {
  return fruit.toLowerCase() === "apple";
});

console.log(hasApple); // true
```

### Mistake 3: Using `includes` When You Need the Item

```js
const users = [{ id: 1, name: "Alice" }];

const result = users.includes(1);

console.log(result); // false
```

The array contains objects, not the number `1`.

Use `find` if you need the object:

```js
const user = users.find((user) => user.id === 1);
```

### Mistake 4: Using `includes` When You Need All Matches

`includes` only answers whether a value exists.

It does not return matching items.

Use `filter` for all matches:

```js
const admins = users.filter((user) => user.role === "admin");
```

## Quick Check

What does this return?

```js
const roles = ["admin", "editor", "viewer"];

roles.includes("editor");
```

It returns:

```js
true
```

What does this return?

```js
const fruits = ["Apple", "Banana"];

fruits.includes("apple");
```

It returns:

```js
false
```

`includes` is case-sensitive.

What does this return?

```js
const users = [{ id: 1 }];

users.includes({ id: 1 });
```

It returns:

```js
false
```

The object being searched for is a different reference.

Use `some` for property-based checks:

```js
users.some((user) => user.id === 1);
```

## Summary

`includes` checks whether an array contains a specific value.

- It returns `true` or `false`.
- It is best for direct primitive value checks.
- It is case-sensitive for strings.
- It can find `NaN`.
- It accepts an optional `fromIndex`.
- It compares objects by reference, not by shape.
- Use `some` for condition-based checks.
- Use `find` when you need the matching item.
- Use `filter` when you need all matching items.
