# Optional Chaining

Optional chaining `?.` is a modern JavaScript feature for safely accessing nested values.

It was introduced in ES2020.

It helps prevent errors like:

```text
Cannot read properties of undefined
```

or:

```text
Cannot read properties of null
```

Optional chaining is especially useful when working with data that may be incomplete, such as API responses, user input, or optional configuration.

## The Problem

Imagine this object:

```js
const user = {
  name: "Asha",
  address: {
    city: "Delhi"
  }
};
```

This works:

```js
console.log(user.address.city); // Delhi
```

But this does not:

```js
// console.log(user.address.zipCode.street);
```

`zipCode` does not exist.

Trying to read `.street` from `undefined` causes an error.

Before optional chaining, you had to check each level manually.

```js
let street;

if (user && user.address && user.address.zipCode) {
  street = user.address.zipCode.street;
}
```

This works, but it is verbose and hard to read.

## The Optional Chaining Solution

Optional chaining lets you safely access nested properties.

```js
const street = user?.address?.zipCode?.street;

console.log(street); // undefined
```

No error is thrown.

If any part before `?.` is `null` or `undefined`, JavaScript stops and returns `undefined`.

This stopping behavior is another form of short-circuiting.

## How It Works

```js
const value = user?.address?.zipCode?.street;
```

JavaScript checks:

1. Is `user` `null` or `undefined`?
2. If not, access `address`.
3. Is `address` `null` or `undefined`?
4. If not, access `zipCode`.
5. Is `zipCode` `null` or `undefined`?
6. If it is, stop and return `undefined`.

## Optional Chaining with Properties

The most common use is safe property access.

```js
const data = {
  user: null
};

console.log(data.user?.profile?.age); // undefined
```

Without optional chaining:

```js
// console.log(data.user.profile.age); // Error
```

Because `data.user` is `null`, JavaScript cannot read `.profile` from it.

## Optional Chaining with Bracket Notation

Use `?.[]` for arrays or dynamic keys.

```js
const users = ["Asha", "Ravi"];

console.log(users?.[0]); // Asha
console.log(users?.[5]); // undefined
```

This is also useful with dynamic object keys.

```js
const settings = {
  theme: "dark"
};

const key = "theme";

console.log(settings?.[key]); // dark
```

You can continue chaining:

```js
const users = [
  { name: "Asha" }
];

console.log(users?.[0]?.name); // Asha
console.log(users?.[1]?.name); // undefined
```

## Optional Chaining with Function Calls

Use `?.()` to call a function only if it exists.

```js
const api = {
  fetchData() {
    return "Data loaded";
  }
};

const result = api.fetchData?.();

console.log(result); // Data loaded
```

If the method does not exist, JavaScript returns `undefined` instead of throwing.

```js
const result = api.deleteData?.();

console.log(result); // undefined
```

This is useful for optional callbacks.

```js
function saveData(data, onSuccess) {
  console.log("Saving data...");

  onSuccess?.();
}

saveData({ name: "Asha" });
saveData({ name: "Asha" }, () => console.log("Saved"));
```

The callback runs only if it was provided.

## Optional Chaining with `??`

Optional chaining pairs well with nullish coalescing.

`?.` safely reads the value.

`??` provides a fallback if the result is `null` or `undefined`.

```js
const config = {
  theme: "dark"
};

const timeout = config.settings?.timeout ?? 3000;

console.log(timeout); // 3000
```

If `settings` does not exist, `config.settings?.timeout` returns `undefined`.

Then `??` returns `3000`.

Another example:

```js
const user = {
  profile: {
    displayName: ""
  }
};

const displayName = user.profile?.displayName ?? "Guest";

console.log(displayName); // ""
```

The empty string is preserved because `??` only falls back for `null` or `undefined`.

## Optional Chaining Only Checks the Value Before It

Optional chaining checks the value immediately before `?.`.

This is safe:

```js
const user = null;

console.log(user?.profile); // undefined
```

This is not safe:

```js
const user = {};

// console.log(user.profile.name); // Error
```

Why?

`user` exists, so JavaScript tries to access `profile`.

But `profile` is `undefined`, and then `.name` causes an error.

Use optional chaining at each uncertain level:

```js
console.log(user.profile?.name); // undefined
```

Or:

```js
console.log(user?.profile?.name); // undefined
```

## Optional Chaining Does Not Hide All Errors

Optional chaining only short-circuits for `null` and `undefined`.

If a value exists but is the wrong type, you can still get errors.

```js
const user = {
  getName: "Asha"
};

// user.getName?.(); // TypeError: user.getName is not a function
```

`getName` exists, but it is a string, not a function.

Optional function calls only help when the function is missing, not when the value exists with the wrong type.

## When to Use Optional Chaining

Use optional chaining when the data may reasonably be missing.

Good use cases:

- API responses
- optional configuration
- optional callbacks
- user-generated data
- deeply nested data where some levels may be missing

Example:

```js
const city = apiResponse.user?.address?.city ?? "Unknown city";
```

## When Not to Use Optional Chaining

Do not use optional chaining to hide bugs.

If a property should always exist, it may be better to let the error happen during development.

Less useful:

```js
const id = order?.id;
```

If every valid `order` must have an `id`, hiding a missing `order` might make the bug harder to find.

Better:

```js
const id = order.id;
```

Use optional chaining when missing data is expected, not when missing data means your program is broken.

## Common Mistakes

## Forgetting to Chain Every Uncertain Level

```js
const user = {};

// user.profile.name; // Error
```

Use:

```js
user.profile?.name;
```

Or:

```js
user?.profile?.name;
```

## Using Optional Chaining Everywhere

Too much optional chaining can hide real problems.

```js
const total = order?.items?.[0]?.price;
```

This may be correct if the order data is optional.

But if an order must always have items, you may want validation instead of silent `undefined`.

## Confusing `?.` with `??`

`?.` safely accesses a value.

`??` provides a fallback.

They solve different problems, but often work together.

```js
const name = user?.profile?.name ?? "Guest";
```

## Best Practices

1. Use `?.` when a value may be `null` or `undefined`.
2. Chain `?.` at every uncertain level.
3. Pair `?.` with `??` when you need a fallback.
4. Avoid using `?.` to hide data that should always exist.
5. Use optional function calls for optional callbacks or methods.

## Summary

Optional chaining makes nested access safer and cleaner.

Remember:

1. `obj?.prop` safely accesses a property.
2. `obj?.[key]` safely accesses dynamic keys or array indexes.
3. `fn?.()` safely calls a function if it exists.
4. If the value before `?.` is `null` or `undefined`, the expression returns `undefined`.
5. Optional chaining works well with `??` for fallback values.
6. Use it for data that may be missing, not to hide bugs.

Next, you will learn common conditional patterns that combine these tools in real code.
