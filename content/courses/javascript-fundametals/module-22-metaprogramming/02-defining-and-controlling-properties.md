# Defining and Controlling Properties

Most JavaScript properties are created with object literals or assignment.

```js
const settings = {};

settings.theme = "dark";
```

That creates a normal writable, enumerable, configurable property.

Metaprogramming gives you more control.

Use `Object.defineProperty()` to define a property with an explicit descriptor.

## Object.defineProperty()

`Object.defineProperty()` takes three arguments:

```js
Object.defineProperty(object, propertyKey, descriptor);
```

Example:

```js
const user = {};

Object.defineProperty(user, "id", {
  value: "u_123",
  writable: false,
  enumerable: true,
  configurable: false,
});

console.log(user.id); // "u_123"
```

The descriptor controls how the property behaves.

## Writable

`writable` controls whether assignment can change a data property.

```js
const config = {};

Object.defineProperty(config, "apiUrl", {
  value: "https://api.example.com",
  writable: false,
  enumerable: true,
  configurable: true,
});

config.apiUrl = "https://evil.example.com";

console.log(config.apiUrl); // "https://api.example.com"
```

In strict mode, assigning to a non-writable property throws a `TypeError`.

```js
"use strict";

const config = {};

Object.defineProperty(config, "apiUrl", {
  value: "https://api.example.com",
  writable: false,
});

config.apiUrl = "new value"; // TypeError
```

## Enumerable

`enumerable` controls whether the property appears in common enumeration.

```js
const user = {
  name: "Ava",
};

Object.defineProperty(user, "passwordHash", {
  value: "hashed-value",
  enumerable: false,
});

console.log(Object.keys(user)); // ["name"]
console.log(user.passwordHash); // "hashed-value"
```

This can reduce noise in logs and loops.

It is not security.

Anyone with access to the object can still inspect the property.

## Configurable

`configurable` controls whether a property can be deleted or reconfigured.

```js
const user = {};

Object.defineProperty(user, "id", {
  value: "u_123",
  configurable: false,
});

delete user.id;

console.log(user.id); // "u_123"
```

Once `configurable` is `false`, you cannot freely change the property's descriptor.

```js
Object.defineProperty(user, "id", {
  enumerable: true,
}); // TypeError
```

Be careful with `configurable: false`. It is hard to undo.

## Descriptor Defaults

Properties created with assignment are permissive by default.

```js
const user = {};
user.name = "Ava";

console.log(Object.getOwnPropertyDescriptor(user, "name"));
```

That descriptor has:

```js
{
  value: "Ava",
  writable: true,
  enumerable: true,
  configurable: true
}
```

Properties created with `Object.defineProperty()` default to `false` for boolean descriptor fields.

```js
const user = {};

Object.defineProperty(user, "name", {
  value: "Ava",
});

console.log(Object.getOwnPropertyDescriptor(user, "name"));
```

That descriptor has:

```js
{
  value: "Ava",
  writable: false,
  enumerable: false,
  configurable: false
}
```

This default surprises many beginners.

If you want normal behavior, set the fields explicitly.

## Defining Multiple Properties

Use `Object.defineProperties()` to define several properties at once.

```js
const product = {};

Object.defineProperties(product, {
  id: {
    value: "p_100",
    enumerable: true,
  },
  name: {
    value: "Keyboard",
    writable: true,
    enumerable: true,
    configurable: true,
  },
  internalCode: {
    value: "warehouse-7",
    enumerable: false,
  },
});

console.log(Object.keys(product)); // ["id", "name"]
```

This is useful when creating objects with intentionally controlled behavior.

## Object.freeze()

`Object.freeze()` prevents adding, removing, or changing properties on an object.

```js
const settings = {
  theme: "dark",
};

Object.freeze(settings);

settings.theme = "light";
settings.language = "en";

console.log(settings); // { theme: "dark" }
```

In strict mode, these invalid changes throw errors.

`Object.freeze()` is shallow.

```js
const settings = {
  theme: "dark",
  nested: {
    compact: true,
  },
};

Object.freeze(settings);

settings.nested.compact = false;

console.log(settings.nested.compact); // false
```

The nested object was not frozen.

## Object.seal()

`Object.seal()` prevents adding or removing properties, but existing writable properties can still change.

```js
const user = {
  name: "Ava",
};

Object.seal(user);

user.name = "Ava Stone";
user.role = "admin";

console.log(user); // { name: "Ava Stone" }
```

Use it when the object's shape should stay fixed but values may still update.

## Object.preventExtensions()

`Object.preventExtensions()` prevents new properties from being added.

```js
const user = {
  name: "Ava",
};

Object.preventExtensions(user);

user.role = "admin";

console.log(user.role); // undefined
```

Existing configurable properties can still be deleted unless they are also sealed or frozen.

## Common Mistake: Using Descriptors for Privacy

Non-enumerable and non-writable properties are not private.

```js
const secretKey = "token";

const user = {};

Object.defineProperty(user, "secret", {
  value: secretKey,
  enumerable: false,
});

console.log(Object.getOwnPropertyNames(user)); // ["secret"]
```

Use closures, private class fields, or careful architecture for privacy.

Descriptors control object behavior. They do not provide strong secrecy.

## Best Practices

Use normal object syntax for ordinary application data.

Use descriptors when you need a specific behavior, such as non-enumerable metadata or read-only constants.

Always remember descriptor defaults when using `Object.defineProperty()`.

Avoid `configurable: false` unless you truly need a permanent property shape.

Use `Object.freeze()` for shallow runtime protection, not deep immutability.

## Summary

`Object.defineProperty()` and related APIs let you control how object properties behave.

You can make properties non-writable, non-enumerable, or non-configurable.

These tools are powerful, but they should be used intentionally because they can make objects harder to understand and change.
