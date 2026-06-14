# Object Introspection and Descriptors

Metaprogramming means writing code that inspects, creates, or customizes other code behavior.

In JavaScript, much of that starts with objects.

You already know how to read and write properties:

```js
const user = {
  name: "Ava",
  role: "admin",
};

console.log(user.name);
```

Metaprogramming asks deeper questions:

- What properties does this object really have?
- Are those properties writable?
- Do they show up in loops?
- Are they normal values, or are they getters and setters?
- Are there symbol properties that `Object.keys()` does not show?

## Inspecting Object Keys

`Object.keys()` returns the object's own enumerable string keys.

```js
const user = {
  name: "Ava",
  role: "admin",
};

console.log(Object.keys(user)); // ["name", "role"]
```

"Own" means the property belongs directly to the object, not its prototype.

"Enumerable" means the property is meant to show up in common enumeration tools like `Object.keys()` and `for...in`.

## Own Properties vs Prototype Properties

Objects can inherit properties from their prototype.

```js
const shared = {
  describe() {
    return "shared method";
  },
};

const user = Object.create(shared);
user.name = "Ava";

console.log(Object.keys(user)); // ["name"]
console.log("describe" in user); // true
```

`describe` exists through the prototype chain, but it is not an own property of `user`.

Use `Object.hasOwn()` when you want to check only the object itself.

```js
console.log(Object.hasOwn(user, "name")); // true
console.log(Object.hasOwn(user, "describe")); // false
```

## Getting All Own Property Names

`Object.getOwnPropertyNames()` returns own string property names, including non-enumerable ones.

```js
const user = {
  name: "Ava",
};

Object.defineProperty(user, "internalId", {
  value: "u_123",
  enumerable: false,
});

console.log(Object.keys(user)); // ["name"]
console.log(Object.getOwnPropertyNames(user)); // ["name", "internalId"]
```

Non-enumerable does not mean private. It only means hidden from common enumeration.

## Property Descriptors

A property descriptor describes how a property behaves.

Use `Object.getOwnPropertyDescriptor()` to inspect one property.

```js
const user = {
  name: "Ava",
};

console.log(Object.getOwnPropertyDescriptor(user, "name"));
```

Output looks like this:

```js
{
  value: "Ava",
  writable: true,
  enumerable: true,
  configurable: true
}
```

These fields matter:

| Field | Meaning |
| --- | --- |
| `value` | the stored value |
| `writable` | whether assignment can change the value |
| `enumerable` | whether common enumeration includes it |
| `configurable` | whether the property can be deleted or reconfigured |

## Data Properties

A data property stores a value directly.

```js
const product = {
  name: "Keyboard",
  price: 75,
};
```

Both `name` and `price` are data properties.

Their descriptors contain `value` and `writable`.

## Accessor Properties

An accessor property runs functions when code reads or writes it.

```js
const user = {
  firstName: "Ava",
  lastName: "Stone",

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  },
};

console.log(user.fullName); // "Ava Stone"
```

The descriptor for `fullName` contains `get` and `set` instead of `value` and `writable`.

```js
console.log(Object.getOwnPropertyDescriptor(user, "fullName"));
```

Accessor properties are a form of metaprogramming because property access triggers custom behavior.

## Symbol Properties

Symbols can also be property keys.

```js
const id = Symbol("id");

const user = {
  name: "Ava",
  [id]: "u_123",
};

console.log(Object.keys(user)); // ["name"]
console.log(Object.getOwnPropertySymbols(user)); // [Symbol(id)]
```

`Object.keys()` does not return symbol keys.

Use `Object.getOwnPropertySymbols()` when you specifically need own symbol properties.

## Reflect.ownKeys()

`Reflect.ownKeys()` returns all own property keys: enumerable, non-enumerable, string, and symbol.

```js
const id = Symbol("id");

const user = {
  name: "Ava",
  [id]: "u_123",
};

Object.defineProperty(user, "internal", {
  value: true,
  enumerable: false,
});

console.log(Reflect.ownKeys(user));
// ["name", "internal", Symbol(id)]
```

This is one of the most complete ways to inspect an object's own keys.

## Common Mistake: Assuming Object.keys() Shows Everything

`Object.keys()` is useful, but it does not show:

- inherited properties
- non-enumerable properties
- symbol properties

That is usually good for normal application code, but it can be misleading when building tools, validators, serializers, or debugging helpers.

## Best Practices

Use `Object.keys()` for normal enumerable data.

Use `Object.hasOwn()` when inherited properties should not count.

Use descriptors when property behavior matters.

Use `Reflect.ownKeys()` when you need the complete list of own keys.

Do not treat non-enumerable or symbol properties as secure secrets.

## Summary

JavaScript objects have more structure than simple key-value pairs.

You can inspect own properties, inherited properties, descriptors, non-enumerable keys, and symbol keys.

These inspection tools are the foundation for descriptors, symbols, `Reflect`, and `Proxy`.
