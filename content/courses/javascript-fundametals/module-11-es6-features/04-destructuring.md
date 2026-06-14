# Destructuring

Destructuring is a modern JavaScript feature that lets you unpack values from arrays and objects into variables.

Without destructuring:

```js
const user = {
  name: "Alice",
  role: "admin",
};

const name = user.name;
const role = user.role;
```

With destructuring:

```js
const user = {
  name: "Alice",
  role: "admin",
};

const { name, role } = user;
```

Destructuring makes it easier to work with structured data.

## Array Destructuring

Array destructuring uses square brackets.

```js
const colors = ["red", "green", "blue"];

const [first, second] = colors;

console.log(first); // red
console.log(second); // green
```

Array destructuring is based on position.

`first` gets index `0`.

`second` gets index `1`.

## Skipping Array Items

You can skip items with commas.

```js
const colors = ["red", "green", "blue"];

const [first, , third] = colors;

console.log(first); // red
console.log(third); // blue
```

The empty space skips `"green"`.

## Default Values in Array Destructuring

You can provide default values.

```js
const scores = [90];

const [math, science = 0] = scores;

console.log(math); // 90
console.log(science); // 0
```

The default is used only when the value is `undefined`.

## Swapping Variables

Destructuring can swap variables without a temporary variable.

```js
let a = 1;
let b = 2;

[a, b] = [b, a];

console.log(a); // 2
console.log(b); // 1
```

This is concise and common in modern JavaScript.

## Object Destructuring

Object destructuring uses curly braces.

```js
const user = {
  name: "Alice",
  role: "admin",
};

const { name, role } = user;

console.log(name); // Alice
console.log(role); // admin
```

Object destructuring is based on property names, not order.

```js
const { role, name } = user;
```

This still works because JavaScript looks for properties named `role` and `name`.

## Renaming Variables

You can rename variables while destructuring.

```js
const user = {
  name: "Alice",
  role: "admin",
};

const { name: userName, role: userRole } = user;

console.log(userName); // Alice
console.log(userRole); // admin
```

Read this as:

```text
Take the name property and store it in a variable called userName.
```

## Default Values in Object Destructuring

```js
const user = {
  name: "Alice",
};

const { name, role = "user" } = user;

console.log(name); // Alice
console.log(role); // user
```

Defaults are used when the property value is `undefined`.

They are not used for `null`, `false`, `0`, or `""`.

## Nested Destructuring

You can destructure nested objects.

```js
const user = {
  name: "Alice",
  profile: {
    city: "Delhi",
  },
};

const {
  profile: { city },
} = user;

console.log(city); // Delhi
```

Nested destructuring can become hard to read if overused.

For deeply nested data, optional chaining may be clearer.

## Destructuring Function Parameters

Destructuring is common in function parameters.

```js
function printUser({ name, role }) {
  console.log(`${name} is an ${role}`);
}

const user = {
  name: "Alice",
  role: "admin",
};

printUser(user); // Alice is an admin
```

This is useful when a function receives an options object.

```js
function createUser({ name, role = "user", active = true }) {
  return {
    name,
    role,
    active,
  };
}
```

## Destructuring Arrays of Objects

Destructuring combines well with array methods.

```js
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

const names = users.map(({ name }) => name);

console.log(names); // ["Alice", "Bob"]
```

The callback receives each user object and destructures `name`.

## Rest With Destructuring

You can collect remaining properties with rest syntax.

```js
const user = {
  name: "Alice",
  role: "admin",
  password: "secret",
};

const { password, ...publicUser } = user;

console.log(publicUser); // { name: "Alice", role: "admin" }
```

This is a common way to remove a property while creating a new object.

You can do something similar with arrays:

```js
const numbers = [1, 2, 3, 4];

const [first, ...rest] = numbers;

console.log(first); // 1
console.log(rest); // [2, 3, 4]
```

## Destructuring Requires a Value

This causes an error:

```js
const { name } = undefined; // TypeError
```

If an object might be missing, provide a fallback.

```js
const user = undefined;

const { name = "Guest" } = user ?? {};

console.log(name); // Guest
```

## Best Practices

Use destructuring when it makes the code clearer:

```js
const { id, name } = user;
```

Use parameter destructuring for options objects:

```js
function createUser({ name, role = "user" }) {
  return { name, role };
}
```

Avoid deeply nested destructuring if it becomes difficult to read.

Use clear renamed variables when property names are ambiguous:

```js
const { name: userName } = user;
```

## Common Mistakes

### Mistake 1: Expecting Object Destructuring to Use Position

```js
const user = {
  name: "Alice",
  role: "admin",
};

const { role, name } = user;
```

This works because object destructuring uses property names, not position.

### Mistake 2: Forgetting Parentheses During Assignment

When assigning to existing variables with object destructuring, wrap the assignment in parentheses.

```js
let name;

({ name } = { name: "Alice" });
```

Without parentheses, JavaScript may treat `{}` as a block.

### Mistake 3: Destructuring From `undefined`

```js
const { name } = user.profile;
```

If `profile` is `undefined`, this throws.

Use a fallback:

```js
const { name } = user.profile ?? {};
```

## Quick Check

What does this log?

```js
const colors = ["red", "green", "blue"];
const [first, , third] = colors;

console.log(first, third);
```

It logs:

```text
red blue
```

What does this log?

```js
const user = {
  name: "Alice",
  role: "admin",
};

const { name: userName } = user;

console.log(userName);
```

It logs:

```text
Alice
```

## Summary

Destructuring unpacks values from arrays and objects.

- Array destructuring is based on position.
- Object destructuring is based on property names.
- You can skip array items.
- You can rename object properties.
- You can provide default values.
- Destructuring works in function parameters.
- Rest syntax can collect remaining items or properties.
- Provide fallbacks when destructuring values that may be `undefined`.
