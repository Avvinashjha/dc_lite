# Constructors

A constructor is a special method that runs when you create a new instance of a class.

```js
class User {
  constructor(name) {
    this.name = name;
  }
}

const user = new User("Alice");

console.log(user.name); // Alice
```

The constructor receives `"Alice"` and assigns it to the new object's `name` property.

## What a Constructor Does

A constructor usually sets up the initial state of an object.

```js
class Product {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }
}

const keyboard = new Product("Keyboard", 1200);

console.log(keyboard.name); // Keyboard
console.log(keyboard.price); // 1200
```

When `new Product(...)` runs:

1. JavaScript creates a new empty object.
2. It sets `this` to that new object.
3. It runs the constructor.
4. It returns the new object.

## Constructor Parameters

Constructors can accept parameters like normal functions.

```js
class User {
  constructor(name, role) {
    this.name = name;
    this.role = role;
  }
}

const admin = new User("Alice", "admin");
const editor = new User("Bob", "editor");
```

Each instance gets its own property values.

```js
console.log(admin.role); // admin
console.log(editor.role); // editor
```

## Default Values

Constructors can use default parameters.

```js
class User {
  constructor(name, role = "user") {
    this.name = name;
    this.role = role;
  }
}

const alice = new User("Alice", "admin");
const bob = new User("Bob");

console.log(alice.role); // admin
console.log(bob.role); // user
```

Defaults are useful when most instances use the same value.

## Constructor With Object Parameter

When there are many options, an object parameter is often clearer.

```js
class User {
  constructor({ name, role = "user", active = true }) {
    this.name = name;
    this.role = role;
    this.active = active;
  }
}

const user = new User({
  name: "Alice",
  role: "admin",
});
```

This avoids confusing positional arguments.

Compare:

```js
new User("Alice", "admin", true);
```

With:

```js
new User({ name: "Alice", role: "admin", active: true });
```

The object version is easier to read.

## Validating Constructor Input

Constructors can validate data.

```js
class Product {
  constructor(name, price) {
    if (price < 0) {
      throw new Error("Price cannot be negative");
    }

    this.name = name;
    this.price = price;
  }
}
```

This prevents invalid instances.

```js
const product = new Product("Keyboard", -100); // Error
```

Use validation when an object should never exist in an invalid state.

## Constructors Do Not Need to Return

Constructors usually do not return a value.

```js
class User {
  constructor(name) {
    this.name = name;
  }
}
```

JavaScript returns the new instance automatically.

Avoid returning custom values from constructors.

It is confusing and rarely needed.

## No Constructor Needed

If a class does not need setup, you can omit the constructor.

```js
class Logger {
  log(message) {
    console.log(`[LOG] ${message}`);
  }
}

const logger = new Logger();

logger.log("App started");
```

JavaScript provides a default constructor automatically.

## Instance Properties

Properties assigned with `this` become instance properties.

```js
class Counter {
  constructor() {
    this.count = 0;
  }
}

const first = new Counter();
const second = new Counter();

first.count = 5;

console.log(first.count); // 5
console.log(second.count); // 0
```

Each instance has its own `count`.

## Constructor and `this`

Inside a constructor, `this` refers to the new instance being created.

```js
class User {
  constructor(name) {
    console.log(this);
    this.name = name;
  }
}

new User("Alice");
```

You learned earlier that `this` depends on how a function is called.

With classes, `new` creates a new object and sets `this` to that object.

## Best Practices

Use constructors to initialize required instance data.

Use default parameters for common defaults.

Use an options object when there are many parameters.

Validate input when invalid objects should not exist.

Avoid doing heavy work in constructors.

Keep constructors easy to understand.

## Common Mistakes

### Mistake 1: Forgetting to Assign to `this`

```js
class User {
  constructor(name) {
    name = name;
  }
}

const user = new User("Alice");

console.log(user.name); // undefined
```

Correct:

```js
this.name = name;
```

### Mistake 2: Putting Too Much Logic in the Constructor

Constructors should set up the object.

Avoid making network requests, starting timers, or doing complex work directly inside constructors unless there is a clear reason.

### Mistake 3: Relying on Argument Order Too Much

```js
new User("Alice", true, "admin", false);
```

This is hard to read.

Use an options object for many settings.

## Quick Check

What does this log?

```js
class User {
  constructor(name, role = "user") {
    this.name = name;
    this.role = role;
  }
}

const user = new User("Alice");

console.log(user.role);
```

It logs:

```text
user
```

## Summary

Constructors initialize new class instances.

- `constructor` runs when `new ClassName(...)` is used.
- Inside a constructor, `this` is the new instance.
- Constructor parameters can set instance properties.
- Defaults and options objects make constructors more flexible.
- Constructors usually do not return values.
- Use validation to prevent invalid instances.
- Omit the constructor when no setup is needed.
