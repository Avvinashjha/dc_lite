# Constructor Functions and prototype

Before ES6 classes, JavaScript developers often used constructor functions to create similar objects.

This pattern is still important because classes are built on the same prototype system.

## Constructor Function Basics

A constructor function is a regular function intended to be called with `new`.

```js
function User(name, role) {
  this.name = name;
  this.role = role;
}

const user = new User("Alice", "admin");

console.log(user.name); // Alice
console.log(user.role); // admin
```

Constructor function names usually use PascalCase, like class names.

## What `new` Does

When you call a constructor function with `new`, JavaScript:

1. Creates a new object.
2. Sets the new object's prototype to `ConstructorFunction.prototype`.
3. Sets `this` inside the function to the new object.
4. Runs the function body.
5. Returns the new object.

```js
function User(name) {
  this.name = name;
}

const user = new User("Alice");
```

The new object is linked to `User.prototype`.

```js
console.log(Object.getPrototypeOf(user) === User.prototype); // true
```

## Adding Methods to prototype

Add shared methods to the function's `prototype`.

```js
function User(name) {
  this.name = name;
}

User.prototype.greet = function () {
  return `Hello, ${this.name}`;
};

const user = new User("Alice");

console.log(user.greet()); // Hello, Alice
```

The `greet` method is not copied into every instance.

It is shared through the prototype.

## Why Not Put Methods Inside the Constructor?

This creates a new function for every object:

```js
function User(name) {
  this.name = name;

  this.greet = function () {
    return `Hello, ${this.name}`;
  };
}
```

This shares one function:

```js
function User(name) {
  this.name = name;
}

User.prototype.greet = function () {
  return `Hello, ${this.name}`;
};
```

Shared prototype methods are more memory-efficient.

## Own Properties and Prototype Methods

```js
function User(name) {
  this.name = name;
}

User.prototype.greet = function () {
  return `Hello, ${this.name}`;
};

const user = new User("Alice");

console.log(Object.hasOwn(user, "name")); // true
console.log(Object.hasOwn(user, "greet")); // false
```

`name` is an own property.

`greet` is inherited from `User.prototype`.

## The `constructor` Property

The default prototype object has a `constructor` property.

```js
function User(name) {
  this.name = name;
}

console.log(User.prototype.constructor === User); // true
```

Instances can access it through the prototype chain.

```js
const user = new User("Alice");

console.log(user.constructor === User); // true
```

This is useful to recognize, but it is not something you should depend on too heavily.

## Forgetting `new`

Constructor functions are regular functions.

That means this mistake is possible:

```js
function User(name) {
  this.name = name;
}

const user = User("Alice");
```

Without `new`, no instance is created.

In strict mode, `this` is `undefined`, so this throws.

Classes avoid this mistake:

```js
class User {}

User(); // TypeError
```

## Constructor Functions vs Classes

Constructor function:

```js
function User(name) {
  this.name = name;
}

User.prototype.greet = function () {
  return `Hello, ${this.name}`;
};
```

Class:

```js
class User {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return `Hello, ${this.name}`;
  }
}
```

The class version is usually clearer.

The underlying prototype idea is similar.

## Best Practices

Use class syntax for new object-oriented code.

Understand constructor functions so older code makes sense.

Put shared methods on `.prototype`, not inside every constructor call.

Always use `new` with constructor functions.

Use PascalCase for constructor functions.

## Common Mistakes

### Mistake 1: Putting Shared Methods on Each Instance

```js
function User(name) {
  this.name = name;
  this.greet = function () {};
}
```

This creates a new method function per instance.

Use:

```js
User.prototype.greet = function () {};
```

### Mistake 2: Thinking `.prototype` Is the Instance

`User.prototype` is not a user instance.

It is the object that new instances inherit from.

### Mistake 3: Forgetting That Classes Use Prototypes Too

Class methods also live on the class prototype.

```js
class User {
  greet() {}
}

const user = new User();

console.log(Object.hasOwn(user, "greet")); // false
```

## Summary

Constructor functions are the older way to create objects with shared behavior.

- Constructor functions are called with `new`.
- `new` links the instance to `FunctionName.prototype`.
- Shared methods should go on `.prototype`.
- Instance data is usually assigned inside the constructor.
- Classes provide cleaner syntax for the same prototype-based system.
- Understanding constructor functions helps explain how classes work internally.
