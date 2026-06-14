# Inheritance with extends

Inheritance lets one class reuse behavior from another class.

The parent class is called the superclass or base class.

The child class is called the subclass or derived class.

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
  bark() {
    return `${this.name} barks`;
  }
}

const dog = new Dog("Bruno");

console.log(dog.speak()); // Bruno makes a sound
console.log(dog.bark()); // Bruno barks
```

`Dog` inherits from `Animal`.

## The `extends` Keyword

Use `extends` to create a child class.

```js
class Child extends Parent {}
```

Example:

```js
class User {
  constructor(name) {
    this.name = name;
  }

  describe() {
    return `User: ${this.name}`;
  }
}

class Admin extends User {
  deleteUser() {
    return "User deleted";
  }
}
```

An `Admin` instance can use methods from both `Admin` and `User`.

```js
const admin = new Admin("Alice");

console.log(admin.describe()); // User: Alice
console.log(admin.deleteUser()); // User deleted
```

## `super()` in Constructors

If a child class has its own constructor, it must call `super()` before using `this`.

```js
class User {
  constructor(name) {
    this.name = name;
  }
}

class Admin extends User {
  constructor(name, permissions) {
    super(name);
    this.permissions = permissions;
  }
}

const admin = new Admin("Alice", ["delete-users"]);
```

`super(name)` calls the parent constructor.

It sets up the parent part of the instance.

## Why `super()` Must Come First

This is invalid:

```js
class Admin extends User {
  constructor(name, permissions) {
    this.permissions = permissions; // ReferenceError
    super(name);
  }
}
```

In a derived class constructor, JavaScript does not allow `this` before `super()`.

Correct:

```js
class Admin extends User {
  constructor(name, permissions) {
    super(name);
    this.permissions = permissions;
  }
}
```

## Method Overriding

A child class can define a method with the same name as a parent method.

```js
class Animal {
  speak() {
    return "Animal sound";
  }
}

class Dog extends Animal {
  speak() {
    return "Woof";
  }
}

const dog = new Dog();

console.log(dog.speak()); // Woof
```

The child method overrides the parent method.

## Calling Parent Methods With `super`

Inside a child method, `super.methodName()` calls the parent method.

```js
class User {
  describe() {
    return "Regular user";
  }
}

class Admin extends User {
  describe() {
    return `${super.describe()} with admin access`;
  }
}

const admin = new Admin();

console.log(admin.describe());
// Regular user with admin access
```

This is useful when you want to extend parent behavior instead of replacing it completely.

## Inheritance Creates an "Is-A" Relationship

Use inheritance when the child really is a kind of parent.

Good:

```text
Dog is an Animal.
Admin is a User.
SavingsAccount is a BankAccount.
```

Questionable:

```text
Car is an Engine.
User is a Database.
Order is an EmailSender.
```

If the relationship is not "is-a", inheritance may be the wrong design.

## Inherited Methods Use the Child Instance

```js
class User {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return `Hello, ${this.name}`;
  }
}

class Admin extends User {}

const admin = new Admin("Alice");

console.log(admin.greet()); // Hello, Alice
```

The method `greet` comes from `User`.

But `this` is the `admin` instance.

## Inheritance Chains

Classes can inherit through multiple levels.

```js
class Animal {}
class Mammal extends Animal {}
class Dog extends Mammal {}
```

This works, but deep inheritance chains can become hard to understand.

Prefer simple inheritance.

## Best Practices

Use inheritance for true "is-a" relationships.

Call `super()` before using `this` in child constructors.

Use method overriding carefully.

Use `super.methodName()` when extending parent behavior.

Avoid deep inheritance chains.

Consider composition when inheritance feels forced.

## Common Mistakes

### Mistake 1: Forgetting `super()` in a Child Constructor

```js
class Admin extends User {
  constructor(name) {
    this.name = name; // ReferenceError
  }
}
```

Correct:

```js
class Admin extends User {
  constructor(name) {
    super(name);
  }
}
```

### Mistake 2: Using Inheritance for Code Sharing Only

Inheritance should model a meaningful relationship.

If you only want to reuse a helper function, use a separate function or composition.

### Mistake 3: Overriding Methods Accidentally

If a child class defines a method with the same name as the parent, it replaces the parent method for that child.

Use clear method names and override intentionally.

## Quick Check

What does this log?

```js
class User {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return `Hello, ${this.name}`;
  }
}

class Admin extends User {}

const admin = new Admin("Alice");

console.log(admin.greet());
```

It logs:

```text
Hello, Alice
```

## Summary

Inheritance lets one class extend another.

- Use `extends` to create a child class.
- The child inherits parent methods.
- Use `super()` to call the parent constructor.
- `super()` must run before `this` in child constructors.
- Child classes can override parent methods.
- `super.methodName()` calls a parent method.
- Use inheritance for true "is-a" relationships.
- Avoid deep or forced inheritance.
