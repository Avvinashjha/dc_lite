# Static Methods

Static methods belong to the class itself, not to instances.

```js
class MathUtils {
  static add(a, b) {
    return a + b;
  }
}

console.log(MathUtils.add(2, 3)); // 5
```

You call a static method on the class:

```js
MathUtils.add(2, 3);
```

not on an instance.

## Instance Method vs Static Method

Instance method:

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

console.log(user.greet()); // Hello, Alice
```

Static method:

```js
class User {
  static createGuest() {
    return new User("Guest");
  }

  constructor(name) {
    this.name = name;
  }
}

const guest = User.createGuest();

console.log(guest.name); // Guest
```

Static methods are useful for behavior related to the class, but not to one specific instance.

## The `static` Keyword

Use the `static` keyword before the method name.

```js
class ClassName {
  static methodName() {
    // class-level behavior
  }
}
```

Example:

```js
class Validator {
  static isEmail(value) {
    return value.includes("@");
  }
}

console.log(Validator.isEmail("a@example.com")); // true
```

You do not need to create a `Validator` instance.

## Static Methods Cannot Access Instance Data Directly

Static methods are called on the class, so `this` does not refer to a normal instance.

```js
class User {
  constructor(name) {
    this.name = name;
  }

  static describe() {
    return this.name;
  }
}

console.log(User.describe()); // User
```

Inside a static method, `this` usually refers to the class itself.

It does not refer to an instance like `new User("Alice")`.

If a method needs instance data, make it an instance method.

## Static Factory Methods

Static methods are often used as factory methods.

A factory method creates an instance.

```js
class User {
  constructor(name, role) {
    this.name = name;
    this.role = role;
  }

  static createAdmin(name) {
    return new User(name, "admin");
  }

  static createGuest() {
    return new User("Guest", "guest");
  }
}

const admin = User.createAdmin("Alice");
const guest = User.createGuest();

console.log(admin.role); // admin
console.log(guest.role); // guest
```

This can make object creation more expressive.

## Static Utility Methods

Static methods can group related helper functions.

```js
class StringUtils {
  static capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  static slugify(value) {
    return value.toLowerCase().replaceAll(" ", "-");
  }
}

console.log(StringUtils.capitalize("javascript")); // Javascript
console.log(StringUtils.slugify("JavaScript Basics")); // javascript-basics
```

For simple utilities, plain exported functions can also be a good choice.

```js
export function capitalize(value) {}
export function slugify(value) {}
```

Static methods are not always necessary.

## Static Properties

Modern JavaScript also supports static fields.

```js
class User {
  static defaultRole = "user";

  constructor(name, role = User.defaultRole) {
    this.name = name;
    this.role = role;
  }
}

const user = new User("Alice");

console.log(user.role); // user
```

Static fields belong to the class.

```js
console.log(User.defaultRole); // user
```

## Inherited Static Methods

Static methods can be inherited by subclasses.

```js
class User {
  static describeType() {
    return "User-like object";
  }
}

class Admin extends User {}

console.log(Admin.describeType()); // User-like object
```

Use this carefully.

Sometimes inherited static behavior is useful, and sometimes it makes class relationships harder to understand.

## Best Practices

Use static methods for class-level behavior.

Use instance methods for behavior that depends on instance data.

Use static factory methods when they make creation clearer.

Consider plain exported functions for general utilities.

Do not create an instance just to call a method that does not use instance data.

## Common Mistakes

### Mistake 1: Calling a Static Method on an Instance

```js
class MathUtils {
  static add(a, b) {
    return a + b;
  }
}

const utils = new MathUtils();

utils.add(2, 3); // TypeError
```

Correct:

```js
MathUtils.add(2, 3);
```

### Mistake 2: Expecting Static Methods to Read Instance Properties

```js
class User {
  constructor(name) {
    this.name = name;
  }

  static greet() {
    return `Hello, ${this.name}`;
  }
}
```

`this` in a static method is not an instance.

Use an instance method if you need instance data.

### Mistake 3: Using Static Classes for Every Utility

This is not always needed:

```js
class Formatters {
  static formatDate(date) {}
}
```

This may be simpler:

```js
export function formatDate(date) {}
```

## Quick Check

What does this log?

```js
class User {
  static createGuest() {
    return new User("Guest");
  }

  constructor(name) {
    this.name = name;
  }
}

const guest = User.createGuest();

console.log(guest.name);
```

It logs:

```text
Guest
```

## Summary

Static methods belong to the class, not instances.

- Use `static` before a method name.
- Call static methods on the class.
- Static methods are useful for factories and class-level utilities.
- Instance methods are used when behavior depends on instance data.
- Static fields store class-level values.
- Static methods can be inherited.
- Plain exported functions are often simpler for general utilities.
