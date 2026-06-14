# Class Syntax

Classes are a modern way to create objects that share the same structure and behavior.

You can think of a class as a blueprint.

An object created from a class is called an instance.

```js
class User {
  constructor(name) {
    this.name = name;
  }
}

const user = new User("Alice");

console.log(user.name); // Alice
```

`User` is the class.

`user` is an instance of that class.

## Why Classes Exist

Before classes, JavaScript often used constructor functions.

```js
function User(name) {
  this.name = name;
}

User.prototype.greet = function () {
  return `Hello, ${this.name}`;
};

const user = new User("Alice");
```

ES6 classes provide a cleaner syntax for the same general idea.

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

Classes do not replace objects, functions, or prototypes.

They give you a clearer way to write object-oriented code.

## Basic Class Syntax

```js
class ClassName {
  constructor() {
    // setup code
  }

  methodName() {
    // behavior
  }
}
```

Class names usually use PascalCase.

```js
class ShoppingCart {}
class UserProfile {}
class ApiClient {}
```

PascalCase means each word starts with a capital letter.

## Creating Instances With `new`

Use `new` to create an instance.

```js
class User {
  constructor(name) {
    this.name = name;
  }
}

const alice = new User("Alice");
const bob = new User("Bob");

console.log(alice.name); // Alice
console.log(bob.name); // Bob
```

Each call to `new User(...)` creates a separate object.

## `instanceof`

You can check whether an object was created from a class using `instanceof`.

```js
class User {}

const user = new User();

console.log(user instanceof User); // true
```

This is useful sometimes, but do not overuse it.

Often, checking behavior or shape is more flexible than checking a specific class.

## Classes Are Not Hoisted Like Function Declarations

Function declarations can be called before they appear.

```js
sayHello();

function sayHello() {
  console.log("Hello");
}
```

Classes are different.

```js
const user = new User("Alice"); // ReferenceError

class User {
  constructor(name) {
    this.name = name;
  }
}
```

Declare the class before using it.

## Classes Are Strict Mode by Default

Code inside a class runs in strict mode automatically.

This helps catch mistakes and makes behavior more predictable.

For example, methods called without the correct object do not silently fall back to the global object.

## Class Expressions

Most code uses class declarations.

```js
class User {}
```

But classes can also be expressions.

```js
const User = class {
  constructor(name) {
    this.name = name;
  }
};
```

Class declarations are more common for beginner code.

## Classes and Objects

A class is used to create objects with shared behavior.

```js
class Product {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }

  getLabel() {
    return `${this.name}: Rs.${this.price}`;
  }
}

const keyboard = new Product("Keyboard", 1200);
const mouse = new Product("Mouse", 700);

console.log(keyboard.getLabel()); // Keyboard: Rs.1200
console.log(mouse.getLabel()); // Mouse: Rs.700
```

Each instance has its own data.

The method behavior is shared through the class.

## When Classes Are Useful

Classes are useful when you need many objects with the same behavior.

Examples:

- users
- products
- carts
- game characters
- API clients
- UI components

Example:

```js
class Timer {
  constructor(seconds) {
    this.seconds = seconds;
  }

  reset() {
    this.seconds = 0;
  }
}
```

## When Plain Objects Are Enough

Do not use a class for every object.

Plain object:

```js
const settings = {
  theme: "dark",
  notifications: true,
};
```

This does not need a class.

Use classes when you need repeated structure plus behavior.

## Best Practices

Use PascalCase for class names:

```js
class UserProfile {}
```

Use `new` when creating instances:

```js
const profile = new UserProfile();
```

Keep classes focused on one responsibility.

Use plain objects for simple data.

Declare classes before using them.

## Common Mistakes

### Mistake 1: Forgetting `new`

```js
class User {}

const user = User(); // TypeError
```

Classes must be called with `new`.

Correct:

```js
const user = new User();
```

### Mistake 2: Using a Class for Simple Data

```js
class Settings {
  constructor() {
    this.theme = "dark";
  }
}
```

If there is no shared behavior, a plain object may be clearer.

### Mistake 3: Thinking Classes Are Completely Separate From Prototypes

Classes are built on JavaScript's prototype system.

You will study prototypes in the next module.

For now, understand classes as the modern syntax for object-oriented JavaScript.

## Quick Check

What does this log?

```js
class User {
  constructor(name) {
    this.name = name;
  }
}

const user = new User("Alice");

console.log(user.name);
```

It logs:

```text
Alice
```

## Summary

Classes are blueprints for creating objects.

- Use `class` to define a class.
- Use `new` to create an instance.
- Class names usually use PascalCase.
- A constructor sets up instance data.
- Methods define shared behavior.
- Classes are strict mode by default.
- Classes are built on JavaScript prototypes.
- Use classes when repeated objects need shared behavior.
