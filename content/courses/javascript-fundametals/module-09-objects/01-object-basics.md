# Object Basics

Objects are one of the most important data structures in JavaScript.

You have already worked with arrays, which store ordered lists:

```js
const user = ["Alice", 25, "admin"];
```

This works, but it is not very clear.

What does index `0` mean?

What does index `1` mean?

Objects solve this problem by storing data with names.

```js
const user = {
  name: "Alice",
  age: 25,
  role: "admin",
};
```

Now the meaning is obvious.

Objects store data as **key-value pairs**.

## What Is an Object?

An object is a collection of related data.

Each piece of data is stored as a property.

```js
const product = {
  name: "Keyboard",
  price: 50,
  inStock: true,
};
```

This object has three properties:

- `name`
- `price`
- `inStock`

Each property has a value:

| Key | Value |
| --- | --- |
| `name` | `"Keyboard"` |
| `price` | `50` |
| `inStock` | `true` |

Objects are useful when values belong together and each value has a clear name.

## Creating an Object

The most common way to create an object is with an object literal.

```js
const user = {
  name: "Ava",
  email: "ava@example.com",
  isActive: true,
};
```

Object literals use curly braces:

```js
{}
```

Inside the braces, properties are written as:

```js
key: value
```

Multiple properties are separated with commas.

```js
const course = {
  title: "JavaScript Fundamentals",
  level: "beginner",
  lessons: 12,
};
```

## Property Values Can Be Any Type

Object property values can be any JavaScript value.

```js
const profile = {
  name: "Mira",
  age: 28,
  isVerified: true,
  favoriteTopics: ["arrays", "objects", "functions"],
  address: {
    city: "Delhi",
    country: "India",
  },
};
```

This object contains:

- strings
- numbers
- booleans
- an array
- another object

Objects can model real-world data because real data is often mixed and nested.

## Accessing Properties With Dot Notation

Use dot notation when you know the property name.

```js
const user = {
  name: "Alice",
  role: "admin",
};

console.log(user.name); // Alice
console.log(user.role); // admin
```

Dot notation is the most common way to access object properties.

It is simple and readable.

```js
object.property
```

## Accessing Properties With Bracket Notation

You can also use bracket notation.

```js
const user = {
  name: "Alice",
  role: "admin",
};

console.log(user["name"]); // Alice
console.log(user["role"]); // admin
```

Bracket notation uses a string property name:

```js
object["property"]
```

This is useful when the property name is stored in a variable.

```js
const user = {
  name: "Alice",
  role: "admin",
};

const key = "role";

console.log(user[key]); // admin
```

If you wrote `user.key`, JavaScript would look for a property literally named `key`.

```js
console.log(user.key); // undefined
```

## When Bracket Notation Is Required

Bracket notation is required when a property name is not a valid identifier.

```js
const settings = {
  "dark-mode": true,
  "font size": 16,
};

console.log(settings["dark-mode"]); // true
console.log(settings["font size"]); // 16
```

You cannot write:

```js
settings.dark-mode;
```

JavaScript would treat `-` as subtraction.

For normal property names, use dot notation.

For dynamic or unusual property names, use bracket notation.

## Adding Properties

You can add properties after an object is created.

```js
const user = {
  name: "Alice",
};

user.role = "admin";
user.isActive = true;

console.log(user);
```

Result:

```js
{
  name: "Alice",
  role: "admin",
  isActive: true
}
```

You can also add properties with bracket notation:

```js
user["lastLogin"] = "2026-06-14";
```

## Updating Properties

To update a property, assign a new value.

```js
const product = {
  name: "Mouse",
  price: 25,
};

product.price = 30;

console.log(product.price); // 30
```

Objects are mutable.

That means you can change their contents.

## Deleting Properties

You can remove a property with the `delete` operator.

```js
const user = {
  name: "Alice",
  password: "secret",
};

delete user.password;

console.log(user); // { name: "Alice" }
```

Use `delete` carefully.

In many applications, it is clearer to create a new object without the property or set the value to `null` when you intentionally want to show absence.

## Missing Properties

If you access a property that does not exist, JavaScript returns `undefined`.

```js
const user = {
  name: "Alice",
};

console.log(user.email); // undefined
```

This does not throw an error.

It simply means the property is missing.

## Nested Objects

Objects can contain other objects.

```js
const user = {
  name: "Alice",
  address: {
    city: "Mumbai",
    country: "India",
  },
};

console.log(user.address.city); // Mumbai
```

You can chain property access:

```js
user.address.city
```

Read it like this:

```text
Get user.
Then get address.
Then get city.
```

## Safe Nested Access

If a nested object might be missing, direct access can fail.

```js
const user = {
  name: "Alice",
};

console.log(user.address.city); // TypeError
```

`user.address` is `undefined`.

Trying to read `.city` from `undefined` causes an error.

Use optional chaining for safer access:

```js
console.log(user.address?.city); // undefined
```

You can combine it with nullish coalescing:

```js
const city = user.address?.city ?? "Unknown";

console.log(city); // Unknown
```

## Objects vs Arrays

Use arrays when order matters and items are similar.

```js
const scores = [90, 85, 72];
```

Use objects when values have names.

```js
const user = {
  name: "Alice",
  age: 25,
  role: "admin",
};
```

Often, you will combine both:

```js
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];
```

This is one of the most common data shapes in JavaScript: an array of objects.

## Best Practices

Use clear property names:

```js
const user = {
  firstName: "Ava",
  isActive: true,
};
```

Prefer dot notation for normal properties:

```js
user.firstName;
```

Use bracket notation for dynamic keys:

```js
const key = "firstName";
user[key];
```

Group related data together:

```js
const product = {
  name: "Keyboard",
  price: 50,
  inStock: true,
};
```

Use optional chaining when nested data may be missing:

```js
const city = user.address?.city;
```

## Common Mistakes

### Mistake 1: Using an Array When an Object Is Clearer

```js
const user = ["Alice", 25, "admin"];
```

This works, but the meaning depends on remembering indexes.

Better:

```js
const user = {
  name: "Alice",
  age: 25,
  role: "admin",
};
```

### Mistake 2: Confusing Dot and Bracket Notation

```js
const user = {
  name: "Alice",
};

const key = "name";

console.log(user.key); // undefined
console.log(user[key]); // Alice
```

Use bracket notation when the property name is stored in a variable.

### Mistake 3: Accessing Nested Properties Unsafely

```js
const user = {
  name: "Alice",
};

console.log(user.address.city); // TypeError
```

Use optional chaining:

```js
console.log(user.address?.city); // undefined
```

## Quick Check

What does this log?

```js
const book = {
  title: "JavaScript Basics",
  pages: 250,
};

console.log(book.title);
```

It logs:

```text
JavaScript Basics
```

What does this log?

```js
const user = {
  name: "Mira",
};

const key = "name";

console.log(user[key]);
```

It logs:

```text
Mira
```

## Summary

Objects store related data as key-value pairs.

- Use object literals `{}` to create objects.
- Object properties have keys and values.
- Use dot notation for normal property access.
- Use bracket notation for dynamic or unusual property names.
- Objects can contain arrays and other objects.
- Missing properties return `undefined`.
- Use optional chaining for safe nested access.
- Use arrays for ordered lists and objects for named data.
