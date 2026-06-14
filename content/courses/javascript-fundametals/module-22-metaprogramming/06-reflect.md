# Reflect

`Reflect` is a built-in object with methods for performing common object operations.

Many `Reflect` methods match operations you already use:

```js
const user = {
  name: "Ava",
};

console.log(Reflect.get(user, "name")); // "Ava"

Reflect.set(user, "name", "Mia");

console.log(user.name); // "Mia"
```

At first, `Reflect.get()` may look less useful than `user.name`.

The value of `Reflect` becomes clearer when you write generic code, work with dynamic property names, or build proxies.

## Why Reflect Exists

JavaScript has many internal object operations:

- get a property
- set a property
- check whether a property exists
- delete a property
- call a function
- construct an object
- inspect own keys
- define a property

`Reflect` exposes many of these operations as normal functions.

This makes metaprogramming code more consistent.

## Reflect.get()

`Reflect.get(target, propertyKey)` reads a property.

```js
const user = {
  name: "Ava",
};

console.log(Reflect.get(user, "name")); // "Ava"
```

It works well when the property key is dynamic.

```js
function readField(object, fieldName) {
  return Reflect.get(object, fieldName);
}

console.log(readField(user, "name")); // "Ava"
```

`Reflect.get()` also accepts an optional receiver, which matters for getters.

```js
const user = {
  firstName: "Ava",

  get greeting() {
    return `Hello, ${this.firstName}`;
  },
};

const receiver = {
  firstName: "Mia",
};

console.log(Reflect.get(user, "greeting", receiver)); // "Hello, Mia"
```

The receiver becomes `this` inside the getter.

## Reflect.set()

`Reflect.set(target, propertyKey, value)` writes a property.

```js
const user = {
  name: "Ava",
};

const success = Reflect.set(user, "name", "Mia");

console.log(success); // true
console.log(user.name); // "Mia"
```

Unlike assignment, `Reflect.set()` returns a boolean indicating whether the operation succeeded.

```js
const config = {};

Object.defineProperty(config, "apiUrl", {
  value: "https://api.example.com",
  writable: false,
});

console.log(Reflect.set(config, "apiUrl", "new")); // false
```

This can be useful in generic code where you want to handle failure explicitly.

## Reflect.has()

`Reflect.has(target, propertyKey)` works like the `in` operator.

```js
const user = {
  name: "Ava",
};

console.log(Reflect.has(user, "name")); // true
console.log(Reflect.has(user, "toString")); // true
```

It checks the object and its prototype chain.

Use `Object.hasOwn()` if inherited properties should not count.

## Reflect.deleteProperty()

`Reflect.deleteProperty(target, propertyKey)` deletes a property and returns whether it succeeded.

```js
const user = {
  name: "Ava",
};

console.log(Reflect.deleteProperty(user, "name")); // true
console.log(user.name); // undefined
```

This is the function form of `delete user.name`.

## Reflect.ownKeys()

`Reflect.ownKeys(target)` returns all own property keys, including non-enumerable strings and symbols.

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

This is useful for object inspection and tooling.

## Reflect.defineProperty()

`Reflect.defineProperty()` is similar to `Object.defineProperty()`, but it returns a boolean instead of throwing for many failures.

```js
const user = {};

const success = Reflect.defineProperty(user, "id", {
  value: "u_123",
  enumerable: true,
});

console.log(success); // true
```

This makes it easier to use in code paths where success or failure is data.

## Reflect.apply()

`Reflect.apply(target, thisArgument, argumentsList)` calls a function with a chosen `this` value and arguments.

```js
function introduce(prefix) {
  return `${prefix}, I am ${this.name}`;
}

const user = {
  name: "Ava",
};

const message = Reflect.apply(introduce, user, ["Hello"]);

console.log(message); // "Hello, I am Ava"
```

This is similar to `introduce.apply(user, ["Hello"])`.

The `Reflect` version works even if a function has its own unusual `apply` property.

## Reflect.construct()

`Reflect.construct(Constructor, argumentsList)` creates a new instance.

```js
class User {
  constructor(name) {
    this.name = name;
  }
}

const user = Reflect.construct(User, ["Ava"]);

console.log(user.name); // "Ava"
```

This is similar to `new User("Ava")`, but it is easier to use when the constructor and arguments are dynamic.

## Reflect with Proxies

`Reflect` is especially common inside proxy traps.

```js
const target = {
  name: "Ava",
};

const proxy = new Proxy(target, {
  get(target, property, receiver) {
    console.log(`Reading ${String(property)}`);
    return Reflect.get(target, property, receiver);
  },
});

console.log(proxy.name);
```

The trap adds logging, then delegates the normal behavior to `Reflect.get()`.

This pattern helps avoid accidentally changing the meaning of the operation.

## Common Mistake: Thinking Reflect Is Reflection Only

In some languages, reflection means inspecting types and metadata.

JavaScript's `Reflect` does include inspection helpers like `Reflect.ownKeys()`, but it is broader than that.

It provides function forms of internal object operations.

The name can be misleading if you expect it to only inspect things.

## Best Practices

Use direct syntax for normal application code.

Use `Reflect` in generic utilities, proxy traps, and descriptor-aware code.

Prefer `Reflect.get()` and `Reflect.set()` inside proxy traps when you want default behavior plus custom behavior.

Use returned booleans from `Reflect.set()`, `Reflect.deleteProperty()`, and `Reflect.defineProperty()` when failure matters.

## Summary

`Reflect` exposes common object and function operations as methods.

It is especially useful in metaprogramming because it works with dynamic keys, returns success values for some operations, and pairs naturally with `Proxy`.

In everyday code, direct syntax is usually clearer, but `Reflect` is an important tool when customizing language behavior.
