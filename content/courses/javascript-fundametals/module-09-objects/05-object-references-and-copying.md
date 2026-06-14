# Object References and Copying

Objects are reference types.

This is one of the most important ideas to understand before you build larger JavaScript programs.

When you assign an object to another variable, JavaScript does not copy the whole object.

It copies a reference to the same object.

```js
const user = {
  name: "Alice",
};

const admin = user;

admin.name = "Ava";

console.log(user.name); // Ava
```

Changing `admin.name` also changed `user.name`.

That is because `user` and `admin` point to the same object.

## Objects Are Stored by Reference

Primitive values behave differently.

```js
let a = 10;
let b = a;

b = 20;

console.log(a); // 10
console.log(b); // 20
```

Numbers are primitive values, so assigning `a` to `b` copies the value.

Objects are different:

```js
const first = {
  count: 1,
};

const second = first;

second.count = 2;

console.log(first.count); // 2
```

Both variables refer to the same object.

## Comparing Objects

Objects are compared by reference.

```js
const user1 = {
  name: "Alice",
};

const user2 = {
  name: "Alice",
};

console.log(user1 === user2); // false
```

The objects have the same contents, but they are different objects in memory.

Now compare this:

```js
const user1 = {
  name: "Alice",
};

const user2 = user1;

console.log(user1 === user2); // true
```

This is `true` because both variables reference the same object.

## Mutating Objects

To mutate an object means to change the existing object.

```js
const user = {
  name: "Alice",
  role: "user",
};

user.role = "admin";

console.log(user); // { name: "Alice", role: "admin" }
```

Mutation is not always wrong.

But you must know when it is happening.

Unintentional mutation can create bugs when multiple parts of your program share the same object.

## `const` Does Not Make Objects Immutable

`const` prevents reassignment.

It does not prevent object mutation.

```js
const user = {
  name: "Alice",
};

user.name = "Ava"; // allowed

console.log(user.name); // Ava
```

This is not allowed:

```js
user = {
  name: "Mira",
}; // TypeError
```

With `const`, the variable cannot point to a different object.

But the object itself can still change.

## Creating a Shallow Copy With Spread

Use the object spread syntax to create a shallow copy.

```js
const user = {
  name: "Alice",
  role: "user",
};

const copy = {
  ...user,
};

copy.role = "admin";

console.log(user.role); // user
console.log(copy.role); // admin
```

Now `user` and `copy` are different top-level objects.

## Updating Objects Immutably

Instead of changing the original object, create a new object with updated values.

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

This pattern is common in frontend development.

It makes changes easier to track.

## Spread Order Matters

Properties written later override earlier properties.

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

If you put the spread last, it overwrites your update.

```js
const updatedUser = {
  role: "admin",
  ...user,
};

console.log(updatedUser.role); // user
```

The original `user.role` overwrote `"admin"`.

## Shallow Copy Caveat

Object spread creates a shallow copy.

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

But `address` still points to the same nested object.

## Copying Nested Objects

To update nested data immutably, copy each level that changes.

```js
const user = {
  name: "Alice",
  address: {
    city: "Delhi",
    country: "India",
  },
};

const updatedUser = {
  ...user,
  address: {
    ...user.address,
    city: "Mumbai",
  },
};

console.log(user.address.city); // Delhi
console.log(updatedUser.address.city); // Mumbai
```

The important idea:

```text
Copy the object you are updating and every nested object along the path.
```

## `Object.assign()`

Before object spread became common, developers often used `Object.assign()`.

```js
const user = {
  name: "Alice",
  role: "user",
};

const copy = Object.assign({}, user);

console.log(copy); // { name: "Alice", role: "user" }
```

This also creates a shallow copy.

Object spread is usually more readable:

```js
const copy = { ...user };
```

## Deep Copying

A deep copy copies nested objects too.

For JSON-safe data, you may see:

```js
const deepCopy = JSON.parse(JSON.stringify(original));
```

But this has limitations.

It loses values such as:

- functions
- `undefined`
- `Date` objects
- `Map`
- `Set`
- `BigInt`

Modern JavaScript provides `structuredClone()` for many deep-copy cases.

```js
const original = {
  user: {
    name: "Alice",
  },
};

const copy = structuredClone(original);

copy.user.name = "Ava";

console.log(original.user.name); // Alice
```

Use deep copying only when you really need it.

Often, copying only the changed path is better.

## Freezing an Object

`Object.freeze()` prevents changes to an object's top-level properties.

```js
const settings = Object.freeze({
  theme: "dark",
});

settings.theme = "light";

console.log(settings.theme); // dark
```

In strict mode, trying to change a frozen object can throw an error.

But `Object.freeze()` is shallow.

```js
const settings = Object.freeze({
  theme: {
    mode: "dark",
  },
});

settings.theme.mode = "light";

console.log(settings.theme.mode); // light
```

The nested object was not frozen.

## Practical Example: Updating a User

```js
const user = {
  id: 1,
  name: "Alice",
  role: "user",
};

function promoteUser(user) {
  return {
    ...user,
    role: "admin",
  };
}

const promoted = promoteUser(user);

console.log(user.role); // user
console.log(promoted.role); // admin
```

This function does not mutate the original object.

That makes it easier to reason about.

## Practical Example: Updating an Array of Objects

Objects often appear inside arrays.

```js
const users = [
  { id: 1, name: "Alice", active: true },
  { id: 2, name: "Bob", active: false },
];

const updatedUsers = users.map((user) => {
  if (user.id === 2) {
    return {
      ...user,
      active: true,
    };
  }

  return user;
});

console.log(updatedUsers);
```

This creates a new array and a new object only for the updated user.

The original `users` array is not mutated.

## Mutation vs Immutable Updates

| Approach | Example | Original changed? |
| --- | --- | --- |
| Mutation | `user.role = "admin"` | Yes |
| Immutable update | `{ ...user, role: "admin" }` | No |

Mutation can be simpler for small scripts.

Immutable updates are often better when state is shared, tracked, or rendered in a UI.

## Best Practices

Know when you are mutating an object:

```js
user.name = "Ava";
```

Use spread for simple shallow copies:

```js
const copy = { ...user };
```

Use immutable updates when you want predictable changes:

```js
const updatedUser = { ...user, active: false };
```

Copy nested objects when updating nested data:

```js
const updated = {
  ...user,
  address: {
    ...user.address,
    city: "Mumbai",
  },
};
```

Remember that object comparison checks references, not contents.

## Common Mistakes

### Mistake 1: Thinking Assignment Copies an Object

```js
const user = {
  name: "Alice",
};

const copy = user;

copy.name = "Ava";

console.log(user.name); // Ava
```

Assignment copies the reference, not the object.

### Mistake 2: Thinking `const` Makes an Object Immutable

```js
const user = {
  name: "Alice",
};

user.name = "Ava"; // allowed
```

`const` prevents reassignment, not mutation.

### Mistake 3: Forgetting Spread Is Shallow

```js
const user = {
  address: {
    city: "Delhi",
  },
};

const copy = { ...user };

copy.address.city = "Mumbai";

console.log(user.address.city); // Mumbai
```

Nested objects are still shared unless you copy them too.

### Mistake 4: Comparing Objects by Contents

```js
console.log({ name: "Alice" } === { name: "Alice" }); // false
```

They look the same, but they are two different objects.

## Quick Check

What does this log?

```js
const a = {
  count: 1,
};

const b = a;

b.count = 2;

console.log(a.count);
```

It logs:

```text
2
```

What does this log?

```js
const a = {
  count: 1,
};

const b = {
  ...a,
};

b.count = 2;

console.log(a.count);
```

It logs:

```text
1
```

## Summary

Objects are reference types.

- Assigning an object to another variable copies the reference.
- Mutating one reference changes the shared object.
- Objects are compared by reference, not by contents.
- `const` prevents reassignment, not object mutation.
- Object spread creates a shallow copy.
- Nested objects must be copied separately when updating nested data.
- Immutable updates create new objects instead of changing existing ones.
- `JSON.parse(JSON.stringify(...))` can deep-copy only JSON-safe data.
- `structuredClone()` can help with many deep-copy cases.
