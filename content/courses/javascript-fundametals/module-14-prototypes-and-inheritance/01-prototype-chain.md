# The Prototype Chain

JavaScript objects can inherit properties and methods from other objects.

This inheritance system is based on prototypes.

Every normal object has an internal link to another object called its prototype.

When JavaScript cannot find a property directly on an object, it looks up the prototype chain.

## Own Properties

An own property is a property that exists directly on an object.

```js
const user = {
  name: "Alice",
};

console.log(user.name); // Alice
```

`name` is an own property of `user`.

You can check this with `Object.hasOwn()`.

```js
console.log(Object.hasOwn(user, "name")); // true
```

## Inherited Properties

Objects can also access inherited properties.

```js
const user = {
  name: "Alice",
};

console.log(user.toString); // [Function: toString]
```

You did not define `toString` on `user`.

So where did it come from?

It comes from `Object.prototype`.

Most normal objects inherit from `Object.prototype`.

## Property Lookup

When you access a property, JavaScript searches in this order:

1. Check the object itself.
2. If not found, check the object's prototype.
3. Continue up the prototype chain.
4. Stop when the chain reaches `null`.

Example:

```js
const user = {
  name: "Alice",
};

console.log(user.name); // found on user
console.log(user.toString); // found on Object.prototype
console.log(user.missing); // undefined
```

If JavaScript reaches the end and does not find the property, it returns `undefined`.

## The Prototype Chain Diagram

```text
user
  -> Object.prototype
    -> null
```

This means:

```text
user inherits from Object.prototype.
Object.prototype is the end of the normal object chain.
```

The final prototype is `null`.

## Checking a Prototype

Use `Object.getPrototypeOf()` to inspect an object's prototype.

```js
const user = {
  name: "Alice",
};

const prototype = Object.getPrototypeOf(user);

console.log(prototype === Object.prototype); // true
```

This is the modern way to inspect a prototype.

## Arrays Have Their Own Prototype Chain

Arrays are objects too.

```js
const numbers = [1, 2, 3];

console.log(numbers.map); // [Function: map]
```

The `map` method is not stored directly on every array.

It comes from `Array.prototype`.

Array chain:

```text
numbers
  -> Array.prototype
    -> Object.prototype
      -> null
```

That is why arrays can use both array methods and object methods.

## Functions Have Prototypes Too

Functions are objects in JavaScript.

```js
function greet() {
  return "Hello";
}

console.log(greet.name); // greet
console.log(greet.call); // [Function: call]
```

Function methods like `call`, `apply`, and `bind` come from `Function.prototype`.

Function chain:

```text
greet
  -> Function.prototype
    -> Object.prototype
      -> null
```

## Shadowing Prototype Properties

If an object has its own property with the same name as an inherited property, the own property wins.

```js
const user = {
  toString() {
    return "Custom user string";
  },
};

console.log(user.toString()); // Custom user string
```

JavaScript finds `toString` directly on `user`, so it does not use `Object.prototype.toString`.

This is called shadowing.

## `in` vs `Object.hasOwn()`

The `in` operator checks own and inherited properties.

```js
const user = {
  name: "Alice",
};

console.log("name" in user); // true
console.log("toString" in user); // true
```

`Object.hasOwn()` checks only own properties.

```js
console.log(Object.hasOwn(user, "name")); // true
console.log(Object.hasOwn(user, "toString")); // false
```

Use the right check for the question you are asking.

## Prototype Chain and Methods

Prototype methods are shared.

Every array does not store its own copy of `map`, `filter`, and `reduce`.

Instead, arrays share methods through `Array.prototype`.

```js
const first = [1, 2, 3];
const second = [4, 5, 6];

console.log(first.map === second.map); // true
```

This sharing is memory-efficient.

## Best Practices

Use `Object.getPrototypeOf()` to inspect prototypes.

Use `Object.hasOwn()` when you only care about direct properties.

Remember that arrays and functions are objects with prototype chains.

Avoid modifying built-in prototypes like `Array.prototype` or `Object.prototype`.

Keep prototype concepts in mind when learning classes.

## Common Mistakes

### Mistake 1: Thinking Every Method Is Stored Directly on the Object

```js
const numbers = [1, 2, 3];

console.log(Object.hasOwn(numbers, "map")); // false
```

`map` comes from `Array.prototype`.

### Mistake 2: Confusing `in` With Own Property Checks

```js
"toString" in {};
```

This is `true` because `toString` is inherited.

Use:

```js
Object.hasOwn({}, "toString"); // false
```

### Mistake 3: Modifying Built-In Prototypes

```js
Array.prototype.last = function () {
  return this[this.length - 1];
};
```

This can cause conflicts and bugs in shared code.

Avoid modifying built-in prototypes in normal application code.

## Quick Check

What does this log?

```js
const user = {
  name: "Alice",
};

console.log(Object.hasOwn(user, "name"));
console.log(Object.hasOwn(user, "toString"));
```

It logs:

```text
true
false
```

`name` is an own property.

`toString` is inherited.

## Summary

The prototype chain is JavaScript's object inheritance system.

- Objects can inherit from other objects.
- Own properties live directly on the object.
- Inherited properties come from the prototype chain.
- JavaScript searches upward when a property is missing.
- `Object.getPrototypeOf()` inspects an object's prototype.
- `in` checks own and inherited properties.
- `Object.hasOwn()` checks only own properties.
- Arrays and functions also use prototype chains.
