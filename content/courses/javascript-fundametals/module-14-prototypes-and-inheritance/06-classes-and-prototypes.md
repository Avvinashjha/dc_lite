# Classes and Prototypes

Classes look different from constructor functions, but they still use prototypes.

This is important:

```text
JavaScript classes are syntax built on top of the prototype system.
```

Understanding this helps explain where class methods live and how inheritance works.

## Class Methods Live on the Prototype

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
console.log(Object.hasOwn(User.prototype, "greet")); // true
```

`name` is stored directly on the instance.

`greet` is stored on `User.prototype`.

## Instance Prototype Link

```js
const user = new User("Alice");

console.log(Object.getPrototypeOf(user) === User.prototype); // true
```

The instance inherits from the class prototype.

Prototype chain:

```text
user
  -> User.prototype
    -> Object.prototype
      -> null
```

## Class Inheritance and Prototypes

```js
class Animal {
  speak() {
    return "Animal sound";
  }
}

class Dog extends Animal {
  bark() {
    return "Woof";
  }
}

const dog = new Dog();

console.log(dog.bark()); // Woof
console.log(dog.speak()); // Animal sound
```

`dog` inherits from `Dog.prototype`.

`Dog.prototype` inherits from `Animal.prototype`.

Prototype chain:

```text
dog
  -> Dog.prototype
    -> Animal.prototype
      -> Object.prototype
        -> null
```

## Static Methods and Prototypes

Instance methods live on `ClassName.prototype`.

Static methods live on the class constructor itself.

```js
class User {
  greet() {
    return "Hello";
  }

  static createGuest() {
    return new User();
  }
}

console.log(Object.hasOwn(User.prototype, "greet")); // true
console.log(Object.hasOwn(User, "createGuest")); // true
```

That is why you call:

```js
user.greet();
```

and:

```js
User.createGuest();
```

## Public Fields Are Own Properties

Modern public fields become own properties on each instance.

```js
class Counter {
  count = 0;

  increment() {
    this.count += 1;
  }
}

const counter = new Counter();

console.log(Object.hasOwn(counter, "count")); // true
console.log(Object.hasOwn(counter, "increment")); // false
```

`count` is on the instance.

`increment` is on the prototype.

## Arrow Function Fields Are Own Properties

Some code uses arrow function fields in classes.

```js
class User {
  name = "Alice";

  greet = () => {
    return `Hello, ${this.name}`;
  };
}

const a = new User();
const b = new User();

console.log(Object.hasOwn(a, "greet")); // true
console.log(a.greet === b.greet); // false
```

The arrow function is created for each instance.

This can preserve `this`, but it is not shared through the prototype.

Use this pattern intentionally.

## Do Not Modify Built-In Prototypes

Avoid adding methods to built-in prototypes.

```js
Array.prototype.last = function () {
  return this[this.length - 1];
};
```

This may seem convenient, but it can cause problems:

- conflicts with future JavaScript features
- conflicts with libraries
- surprising behavior in loops or debugging
- harder-to-maintain code

Prefer helper functions:

```js
function last(array) {
  return array[array.length - 1];
}
```

Or use existing methods:

```js
array.at(-1);
```

## Prototype Pollution Awareness

Prototype pollution is when code accidentally or maliciously changes a shared prototype such as `Object.prototype`.

```js
Object.prototype.isAdmin = true;
```

Now many objects may appear to have `isAdmin`.

```js
const user = {};

console.log(user.isAdmin); // true
```

This can create serious security bugs.

You will study security later.

For now:

```text
Do not modify Object.prototype or other built-in prototypes.
```

## Best Practices

Use classes for modern object-oriented code.

Remember that class methods are prototype methods.

Use `Object.hasOwn()` to distinguish own properties from inherited ones.

Avoid modifying built-in prototypes.

Use public fields for simple instance defaults.

Use normal class methods for shared behavior.

Use arrow function fields only when you specifically need per-instance bound behavior.

## Common Mistakes

### Mistake 1: Thinking Class Syntax Avoids Prototypes

Classes are built on prototypes.

They make prototype-based object creation easier to write.

### Mistake 2: Expecting Methods to Be Own Properties

```js
class User {
  greet() {}
}

const user = new User();

Object.hasOwn(user, "greet"); // false
```

The method is on `User.prototype`.

### Mistake 3: Modifying `Object.prototype`

```js
Object.prototype.extra = "bad idea";
```

This affects many objects.

Avoid it.

## Summary

Classes and prototypes are connected.

- Class methods live on `ClassName.prototype`.
- Instances inherit from the class prototype.
- `extends` creates a prototype chain between class prototypes.
- Static methods live on the class constructor.
- Public fields become own properties on each instance.
- Arrow function fields are per-instance functions.
- Avoid modifying built-in prototypes.
- Prototype knowledge explains how class behavior is shared.
