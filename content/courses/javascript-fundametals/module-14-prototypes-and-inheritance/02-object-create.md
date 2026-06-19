# Object.create()

`Object.create()` creates a new object with a specific prototype.

```js
const animal = {
  speak() {
    return "Animal sound";
  },
};

const dog = Object.create(animal);

dog.name = "Bruno";

console.log(dog.name); // Bruno
console.log(dog.speak()); // Animal sound
```

`dog` does not have its own `speak` method.

It inherits `speak` from `animal`.

## Basic Syntax

```js
const object = Object.create(prototypeObject);
```

The new object's prototype becomes `prototypeObject`.

```js
const parent = {
  greet() {
    return "Hello";
  },
};

const child = Object.create(parent);

console.log(child.greet()); // Hello
```

Prototype chain:

```text
child
  -> parent
    -> Object.prototype
      -> null
```

## Own vs Inherited Properties

```js
const animal = {
  type: "animal",
};

const dog = Object.create(animal);
dog.name = "Bruno";

console.log(dog.name); // Bruno
console.log(dog.type); // animal

console.log(Object.hasOwn(dog, "name")); // true
console.log(Object.hasOwn(dog, "type")); // false
```

`name` is an own property.

`type` is inherited from `animal`.

## Adding Own Properties

You can add properties after creating the object.

```js
const userMethods = {
  greet() {
    return `Hello, ${this.name}`;
  },
};

const user = Object.create(userMethods);

user.name = "Alice";

console.log(user.greet()); // Hello, Alice
```

Inside `greet`, `this` is `user` because the method is called as:

```js
user.greet()
```

The method is inherited, but `this` is still the object before the dot.

## Creating a Null-Prototype Object

You can create an object with no prototype.

```js
const dictionary = Object.create(null);

dictionary.name = "Alice";

console.log(dictionary.name); // Alice
console.log(dictionary.toString); // undefined
```

This object does not inherit from `Object.prototype`.

It has no inherited `toString`, `hasOwnProperty`, or other normal object methods.

Null-prototype objects are sometimes used as clean dictionaries.

For everyday beginner code, normal objects are more common.

## Object.create() vs Object Literal

Object literal:

```js
const user = {
  name: "Alice",
};
```

The prototype is usually `Object.prototype`.

```js
console.log(Object.getPrototypeOf(user) === Object.prototype); // true
```

`Object.create()` lets you choose the prototype.

```js
const parent = {
  role: "user",
};

const user = Object.create(parent);
```

Now `parent` is the prototype of `user`.

## Object.create() With Property Descriptors

`Object.create()` has a second optional argument for property descriptors.

```js
const user = Object.create(Object.prototype, {
  name: {
    value: "Alice",
    writable: true,
    enumerable: true,
    configurable: true,
  },
});

console.log(user.name); // Alice
```

Property descriptors are advanced.

They let you control details like:

- whether a property can be changed
- whether it appears in enumeration
- whether it can be deleted or reconfigured

For beginner code, you will usually add properties normally.

```js
const user = Object.create(parent);
user.name = "Alice";
```

## Practical Example: Shared Methods

```js
const userMethods = {
  activate() {
    this.active = true;
  },
  deactivate() {
    this.active = false;
  },
};

const alice = Object.create(userMethods);
alice.name = "Alice";
alice.active = false;

const bob = Object.create(userMethods);
bob.name = "Bob";
bob.active = false;

alice.activate();

console.log(alice.active); // true
console.log(bob.active); // false
```

Both objects share the same methods through the prototype.

Each object has its own data.

## Object.create() vs Classes

Classes are more common in modern application code.

```js
class User {
  constructor(name) {
    this.name = name;
    this.active = false;
  }

  activate() {
    this.active = true;
  }
}
```

But classes are built on prototypes.

`Object.create()` helps you see prototypal inheritance directly.

## Best Practices

Use `Object.create()` when you intentionally want to set an object's prototype.

Use object literals for simple objects.

Use classes when creating many instances with shared behavior is clearer.

Use `Object.create(null)` only when you specifically need an object with no inherited properties.

Check own properties with `Object.hasOwn()`.

## Common Mistakes

### Mistake 1: Thinking Inherited Properties Are Own Properties

```js
const parent = {
  role: "user",
};

const child = Object.create(parent);

console.log(child.role); // user
console.log(Object.hasOwn(child, "role")); // false
```

The property exists through inheritance.

It is not directly on `child`.

### Mistake 2: Forgetting That `this` Is the Calling Object

```js
const methods = {
  greet() {
    return this.name;
  },
};

const user = Object.create(methods);
user.name = "Alice";

user.greet(); // Alice
```

Even though `greet` is inherited, `this` is `user`.

### Mistake 3: Using `Object.create(null)` Without Knowing the Tradeoff

```js
const object = Object.create(null);

object.toString; // undefined
```

Null-prototype objects do not inherit normal object methods.

## Quick Check

What does this log?

```js
const parent = {
  role: "user",
};

const child = Object.create(parent);
child.name = "Alice";

console.log(child.role);
console.log(Object.hasOwn(child, "role"));
```

It logs:

```text
user
false
```

`role` is inherited from `parent`.

## Summary

`Object.create()` creates a new object with a chosen prototype.

- `Object.create(parent)` creates an object that inherits from `parent`.
- Own properties live directly on the object.
- Inherited properties come from the prototype.
- `Object.create(null)` creates an object with no prototype.
- Inherited methods still use the calling object as `this`.
- Classes are usually clearer for repeated instance creation.
- `Object.create()` helps reveal how prototypal inheritance works.
