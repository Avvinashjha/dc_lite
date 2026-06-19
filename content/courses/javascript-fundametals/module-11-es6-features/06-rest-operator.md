# Rest Operator

Rest syntax collects multiple values into one array or object.

It uses the same three dots as spread:

```js
...
```

But rest does the opposite of spread.

Spread expands values.

Rest collects values.

## Rest Parameters

Rest parameters collect extra function arguments into an array.

```js
function sum(...numbers) {
  return numbers.reduce((total, number) => total + number, 0);
}

console.log(sum(1, 2, 3)); // 6
console.log(sum(5, 10, 15, 20)); // 50
```

Inside the function, `numbers` is a real array.

```js
function showValues(...values) {
  console.log(Array.isArray(values));
}

showValues(1, 2, 3); // true
```

## Rest Parameter Must Be Last

A rest parameter must be the final parameter.

```js
function logUser(role, ...names) {
  console.log(role);
  console.log(names);
}

logUser("admin", "Alice", "Bob");
```

Output:

```text
admin
["Alice", "Bob"]
```

This is invalid:

```js
function broken(...names, role) {}
```

JavaScript would not know how many arguments belong to `names`.

## Rest With Array Destructuring

Rest can collect remaining array items.

```js
const numbers = [1, 2, 3, 4];

const [first, ...rest] = numbers;

console.log(first); // 1
console.log(rest); // [2, 3, 4]
```

The rest variable gets the remaining items.

You can name it whatever makes sense:

```js
const [primary, ...others] = users;
```

## Rest With Object Destructuring

Rest can collect remaining object properties.

```js
const user = {
  name: "Alice",
  role: "admin",
  password: "secret",
};

const { password, ...publicUser } = user;

console.log(publicUser);
// { name: "Alice", role: "admin" }
```

This is useful when you want a new object without one or more properties.

## Rest Creates a New Array or Object

Rest creates a new array or object for the collected values.

```js
const numbers = [1, 2, 3];
const [first, ...others] = numbers;

console.log(others); // [2, 3]
console.log(others === numbers); // false
```

For objects:

```js
const user = {
  name: "Alice",
  role: "admin",
};

const { name, ...details } = user;

console.log(details); // { role: "admin" }
```

Like spread, this is shallow.

Nested objects are still references.

## Rest vs `arguments`

Before rest parameters, JavaScript had the `arguments` object.

```js
function showArguments() {
  console.log(arguments);
}

showArguments("a", "b");
```

But `arguments` is not a real array.

Rest parameters are clearer and easier to use.

```js
function showArguments(...args) {
  console.log(args.map((value) => value.toUpperCase()));
}

showArguments("a", "b"); // ["A", "B"]
```

Prefer rest parameters in modern JavaScript.

## Rest vs Spread

The same `...` syntax can mean rest or spread depending on where it appears.

Rest collects:

```js
function sum(...numbers) {
  return numbers.length;
}
```

Spread expands:

```js
const numbers = [1, 2, 3];
sum(...numbers);
```

Rest appears in places that receive values:

- function parameters
- array destructuring
- object destructuring

Spread appears in places that provide values:

- function calls
- array literals
- object literals

## Practical Example: Flexible Logging

```js
function log(level, ...messages) {
  const text = messages.join(" ");
  console.log(`[${level}] ${text}`);
}

log("INFO", "User", "logged", "in");
// [INFO] User logged in
```

The first argument has a specific meaning.

All remaining arguments become `messages`.

## Practical Example: Removing Sensitive Data

```js
const user = {
  id: 1,
  name: "Alice",
  password: "secret",
  token: "abc123",
};

const { password, token, ...safeUser } = user;

console.log(safeUser);
// { id: 1, name: "Alice" }
```

This pattern is common when preparing data to display or return from a function.

## Best Practices

Use rest parameters instead of `arguments`:

```js
function fn(...args) {}
```

Keep rest parameters last:

```js
function createUser(role, ...names) {}
```

Use rest destructuring to separate known values from remaining values:

```js
const { id, ...details } = user;
```

Use clear names:

```js
const [firstUser, ...remainingUsers] = users;
```

## Common Mistakes

### Mistake 1: Putting Rest Before Another Parameter

```js
function broken(...items, last) {}
```

Rest must be last.

### Mistake 2: Confusing Rest With Spread

```js
function sum(...numbers) {}
```

This is rest because it collects arguments.

```js
sum(...numbers);
```

This is spread because it expands an array into arguments.

### Mistake 3: Expecting Rest to Deep-Copy Nested Objects

```js
const { id, ...details } = user;
```

This creates a shallow copy of remaining properties.

Nested objects are still shared references.

## Quick Check

What does this log?

```js
function collect(first, ...others) {
  console.log(first);
  console.log(others);
}

collect("a", "b", "c");
```

It logs:

```text
a
["b", "c"]
```

What does this log?

```js
const [first, ...rest] = [10, 20, 30];

console.log(rest);
```

It logs:

```js
[20, 30]
```

## Summary

Rest syntax collects values.

- Rest uses `...`.
- Rest parameters collect function arguments into an array.
- Rest parameters must be last.
- Array rest collects remaining array items.
- Object rest collects remaining object properties.
- Rest creates shallow copies.
- Rest collects values; spread expands values.
- Prefer rest parameters over the old `arguments` object.
