# Prototypal Inheritance

JavaScript uses prototypal inheritance.

That means objects can inherit directly from other objects.

Classes in JavaScript are built on top of this prototype system.

To understand classes deeply, you need to understand prototypes.

## Objects Inherit From Objects

```js
const animal = {
  speak() {
    return "Animal sound";
  },
};

const dog = Object.create(animal);

dog.name = "Bruno";

console.log(dog.speak()); // Animal sound
```

`dog` inherits from `animal`.

When JavaScript cannot find `speak` on `dog`, it looks at `animal`.

## Constructor Functions

Before classes, JavaScript commonly used constructor functions.

```js
function User(name) {
  this.name = name;
}

const user = new User("Alice");

console.log(user.name); // Alice
```

When called with `new`, a constructor function creates a new object.

Inside the function, `this` refers to the new object.

## The `prototype` Property

Every normal function has a `prototype` property.

```js
function User(name) {
  this.name = name;
}

console.log(User.prototype);
```

Objects created with `new User()` inherit from `User.prototype`.

```js
const user = new User("Alice");

console.log(Object.getPrototypeOf(user) === User.prototype); // true
```

This is the key connection:

```text
new User() creates an object whose prototype is User.prototype.
```

## Adding Shared Methods

You can add methods to the constructor's prototype.

```js
function User(name) {
  this.name = name;
}

User.prototype.greet = function () {
  return `Hello, ${this.name}`;
};

const alice = new User("Alice");
const bob = new User("Bob");

console.log(alice.greet()); // Hello, Alice
console.log(bob.greet()); // Hello, Bob
console.log(alice.greet === bob.greet); // true
```

Both instances share the same `greet` function.

Each instance has its own `name`.

## Why Put Methods on the Prototype?

This is less efficient:

```js
function User(name) {
  this.name = name;
  this.greet = function () {
    return `Hello, ${this.name}`;
  };
}
```

Every instance gets its own copy of `greet`.

This is more efficient:

```js
function User(name) {
  this.name = name;
}

User.prototype.greet = function () {
  return `Hello, ${this.name}`;
};
```

All instances share one method.

## The `constructor` Property

By default, a function's prototype has a `constructor` property.

```js
function User(name) {
  this.name = name;
}

const user = new User("Alice");

console.log(user.constructor === User); // true
```

The `constructor` property points back to the function.

Do not rely on it too heavily for application logic.

It is useful to recognize when inspecting objects.

## Class Syntax Does the Same Thing

This class:

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

is similar in concept to:

```js
function User(name) {
  this.name = name;
}

User.prototype.greet = function () {
  return `Hello, ${this.name}`;
};
```

Class methods are placed on the class prototype.

```js
const user = new User("Alice");

console.log(Object.getPrototypeOf(user) === User.prototype); // true
```

Classes are cleaner syntax over prototypes.

## Inheritance With Constructor Functions

Before `class extends`, inheritance was more manual.

```js
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function () {
  return `${this.name} makes a sound`;
};

function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed;
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function () {
  return `${this.name} barks`;
};

const dog = new Dog("Bruno", "Labrador");

console.log(dog.speak()); // Bruno makes a sound
console.log(dog.bark()); // Bruno barks
```

This is verbose.

Modern classes make it easier:

```js
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} makes a sound`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }

  bark() {
    return `${this.name} barks`;
  }
}
```

The class version still uses prototypes underneath.

## Own Properties vs Prototype Methods

```js
class User {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return `Hello, ${this.name}`;
  }
}

const user = new User("Alice");

console.log(Object.hasOwn(user, "name")); // true
console.log(Object.hasOwn(user, "greet")); // false
```

`name` is an own property.

`greet` is inherited from `User.prototype`.

## Best Practices

Use class syntax for most modern object-oriented JavaScript.

Understand prototypes because classes use them underneath.

Put shared methods on prototypes or class bodies, not inside every constructor call.

Avoid manually changing prototype chains unless you have a clear reason.

Use `Object.create()` when you intentionally need direct prototypal inheritance.

## Common Mistakes

### Mistake 1: Thinking Class Methods Are Own Properties

```js
const user = new User("Alice");

Object.hasOwn(user, "greet"); // false
```

Class methods are usually on the prototype.

### Mistake 2: Forgetting `new` With Constructor Functions

```js
function User(name) {
  this.name = name;
}

const user = User("Alice"); // wrong
```

Without `new`, `this` is not the new instance.

Classes prevent this mistake by throwing if called without `new`.

### Mistake 3: Replacing a Prototype and Losing `constructor`

```js
Dog.prototype = Object.create(Animal.prototype);
```

This creates inheritance, but it also replaces the default prototype object.

Often old-style code then restores:

```js
Dog.prototype.constructor = Dog;
```

Modern class syntax avoids this manual work.

## Quick Check

What does this log?

```js
function User(name) {
  this.name = name;
}

User.prototype.greet = function () {
  return `Hello, ${this.name}`;
};

const alice = new User("Alice");
const bob = new User("Bob");

console.log(alice.greet === bob.greet);
```

It logs:

```text
true
```

Both instances share the same prototype method.

## Summary

Prototypal inheritance means objects can inherit from other objects.

- Constructor functions use `.prototype` for shared methods.
- Objects created with `new` inherit from the constructor's `.prototype`.
- Prototype methods are shared between instances.
- Instance data is usually stored as own properties.
- Classes are modern syntax over the prototype system.
- `extends` is cleaner than manual prototype-chain setup.
- Understanding prototypes helps explain how classes really work.
