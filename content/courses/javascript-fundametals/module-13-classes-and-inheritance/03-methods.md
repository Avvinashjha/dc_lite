# Methods

Class methods define behavior shared by instances.

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

`greet` is a method.

It can read instance data through `this`.

## Instance Methods

Methods written inside a class body are instance methods.

```js
class Counter {
  constructor() {
    this.count = 0;
  }

  increment() {
    this.count += 1;
    return this.count;
  }

  reset() {
    this.count = 0;
  }
}

const counter = new Counter();

console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
counter.reset();
console.log(counter.count); // 0
```

You call instance methods on an instance.

```js
counter.increment();
```

## Methods Use `this`

Inside a method, `this` usually refers to the instance before the dot.

```js
const counter = new Counter();

counter.increment();
```

Inside `increment`, `this` is `counter`.

That is why this works:

```js
this.count += 1;
```

## Methods Can Receive Parameters

```js
class Cart {
  constructor() {
    this.items = [];
  }

  addItem(name, price) {
    this.items.push({ name, price });
  }

  getTotal() {
    return this.items.reduce((total, item) => total + item.price, 0);
  }
}

const cart = new Cart();

cart.addItem("Keyboard", 1200);
cart.addItem("Mouse", 700);

console.log(cart.getTotal()); // 1900
```

Methods are regular functions with special method syntax.

They can take parameters, return values, and call other methods.

## Calling One Method From Another

Use `this.methodName()`.

```js
class User {
  constructor(name) {
    this.name = name;
  }

  getDisplayName() {
    return this.name.toUpperCase();
  }

  greet() {
    return `Hello, ${this.getDisplayName()}`;
  }
}

const user = new User("Alice");

console.log(user.greet()); // Hello, ALICE
```

`this.getDisplayName()` calls another method on the same instance.

## Method Extraction Pitfall

Class methods can lose `this` when extracted.

```js
class User {
  constructor(name) {
    this.name = name;
  }

  greet() {
    console.log(`Hello, ${this.name}`);
  }
}

const user = new User("Alice");
const greet = user.greet;

greet(); // TypeError in strict mode
```

The method was separated from the instance.

The call is now:

```js
greet()
```

not:

```js
user.greet()
```

So `this` is lost.

## Fixing Lost Method Context

Use a wrapper:

```js
setTimeout(() => {
  user.greet();
}, 1000);
```

Or use `bind`:

```js
const greet = user.greet.bind(user);

greet(); // Hello, Alice
```

This connects back to the `this` module.

## Methods Are Shared

Methods declared in the class body are shared by instances through the prototype.

```js
class User {
  greet() {
    return "Hello";
  }
}

const a = new User();
const b = new User();

console.log(a.greet === b.greet); // true
```

Both instances use the same method function.

This is memory-efficient.

You will learn prototypes in the next module.

## Avoid Defining Methods Inside the Constructor

This works:

```js
class User {
  constructor(name) {
    this.name = name;
    this.greet = function () {
      return `Hello, ${this.name}`;
    };
  }
}
```

But it creates a new function for every instance.

Prefer class methods:

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

## Method Return Values

Methods can return values.

```js
class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  getArea() {
    return this.width * this.height;
  }
}

const rectangle = new Rectangle(10, 5);

console.log(rectangle.getArea()); // 50
```

Methods can also mutate instance state.

```js
class Toggle {
  constructor() {
    this.on = false;
  }

  toggle() {
    this.on = !this.on;
  }
}
```

Be clear about whether a method returns data, changes state, or both.

## Best Practices

Use class methods for shared behavior.

Use `this` to access instance data.

Keep methods focused on one task.

Prefer returning values when possible.

Be careful when passing methods as callbacks.

Avoid defining normal methods inside the constructor unless you have a specific reason.

## Common Mistakes

### Mistake 1: Forgetting `this`

```js
class User {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return `Hello, ${name}`;
  }
}
```

`name` is not a local variable in `greet`.

Correct:

```js
return `Hello, ${this.name}`;
```

### Mistake 2: Extracting a Method and Losing `this`

```js
const greet = user.greet;
greet();
```

Use:

```js
const greet = user.greet.bind(user);
```

or:

```js
() => user.greet()
```

### Mistake 3: Making Methods Too Large

A method that validates input, fetches data, formats output, updates state, and renders UI is doing too much.

Split large behavior into smaller methods.

## Quick Check

What does this log?

```js
class Counter {
  constructor() {
    this.count = 0;
  }

  increment() {
    this.count += 1;
    return this.count;
  }
}

const counter = new Counter();

console.log(counter.increment());
console.log(counter.increment());
```

It logs:

```text
1
2
```

## Summary

Class methods define behavior for instances.

- Instance methods are called on objects created from the class.
- Methods use `this` to access instance data.
- Methods can receive parameters and return values.
- Methods can call other methods with `this.methodName()`.
- Class methods are shared between instances.
- Extracted methods can lose `this`.
- Keep methods focused and readable.
