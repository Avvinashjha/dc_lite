# Arrow Functions and this

Arrow functions behave differently from regular functions.

The most important difference for this module is:

```text
Arrow functions do not have their own this.
```

Instead, an arrow function uses `this` from the surrounding scope.

This is called **lexical this**.

## Regular Functions Have Their Own `this`

A regular function's `this` depends on how it is called.

```js
const user = {
  name: "Alice",
  greet() {
    console.log(this.name);
  },
};

user.greet(); // Alice
```

The method is called as `user.greet()`.

So `this` is `user`.

## Arrow Functions Do Not Have Their Own `this`

Now compare this:

```js
const user = {
  name: "Alice",
  greet: () => {
    console.log(this.name);
  },
};

user.greet(); // usually undefined
```

This surprises many beginners.

Even though the function is called as `user.greet()`, the arrow function does not create its own `this`.

So `this` is not `user`.

For object methods that need `this`, avoid arrow functions.

Use method shorthand:

```js
const user = {
  name: "Alice",
  greet() {
    console.log(this.name);
  },
};
```

## Lexical `this`

Lexical means based on where code is written.

Arrow functions capture `this` from the surrounding scope.

```js
const user = {
  name: "Alice",
  greetLater() {
    setTimeout(() => {
      console.log(`Hello, ${this.name}`);
    }, 1000);
  },
};

user.greetLater(); // Hello, Alice
```

Why does this work?

`greetLater` is a regular method.

When called as:

```js
user.greetLater()
```

`this` inside `greetLater` is `user`.

The arrow function inside `setTimeout` does not create its own `this`.

It uses the surrounding `this`, which is `user`.

## Arrow Functions Are Useful Inside Methods

Arrow functions are often useful inside object methods when you want to keep the outer `this`.

```js
const counter = {
  count: 0,
  start() {
    setInterval(() => {
      this.count += 1;
      console.log(this.count);
    }, 1000);
  },
};
```

The arrow callback uses the `this` from `start`.

Since `start` is called as a method, `this` is `counter`.

## Regular Callback Problem

With a regular function callback, `this` can be lost.

```js
const user = {
  name: "Alice",
  greetLater() {
    setTimeout(function () {
      console.log(`Hello, ${this.name}`);
    }, 1000);
  },
};

user.greetLater(); // this is not user
```

The regular function passed to `setTimeout` has its own `this`.

It does not automatically use the `this` from `greetLater`.

## Arrow Callback Fix

Use an arrow function when you want the callback to use the surrounding `this`.

```js
const user = {
  name: "Alice",
  greetLater() {
    setTimeout(() => {
      console.log(`Hello, ${this.name}`);
    }, 1000);
  },
};

user.greetLater(); // Hello, Alice
```

This is one of the best uses of arrow functions.

## Do Not Use Arrow Functions for Object Methods That Need `this`

Avoid this:

```js
const user = {
  name: "Alice",
  greet: () => {
    return `Hello, ${this.name}`;
  },
};
```

Use this:

```js
const user = {
  name: "Alice",
  greet() {
    return `Hello, ${this.name}`;
  },
};
```

Rule of thumb:

```text
Use regular method syntax for object methods.
Use arrow functions for callbacks that should inherit this.
```

## Arrow Functions and `bind`

You cannot change an arrow function's `this` with `bind`, `call`, or `apply`.

```js
const user = {
  name: "Alice",
};

const greet = () => {
  console.log(this.name);
};

const boundGreet = greet.bind(user);

boundGreet(); // still not Alice
```

`bind` creates a new function, but it cannot replace the lexical `this` of an arrow function.

This is another reason not to use arrow functions when you need dynamic `this`.

## Arrow Functions in Event Handlers

In browser event handlers, regular functions can receive `this` as the element.

```js
button.addEventListener("click", function () {
  console.log(this); // the button element
});
```

An arrow function does not get its own `this`.

```js
button.addEventListener("click", () => {
  console.log(this); // surrounding this, not the button
});
```

In modern code, many developers prefer using the event object instead:

```js
button.addEventListener("click", (event) => {
  console.log(event.currentTarget);
});
```

This is clearer than relying on `this`.

## Arrow Functions and Classes

You may see arrow functions used in class fields.

```js
class Counter {
  count = 0;

  increment = () => {
    this.count += 1;
    return this.count;
  };
}
```

This pattern can preserve `this` when the method is passed as a callback.

Classes get their own module later, so you do not need to master this pattern yet.

Just recognize why it exists:

```text
The arrow function keeps the instance's this.
```

## Best Practices

Use method shorthand for object methods:

```js
const user = {
  greet() {
    return `Hello, ${this.name}`;
  },
};
```

Use arrow functions for callbacks that need the surrounding `this`:

```js
setTimeout(() => {
  this.save();
}, 1000);
```

Do not use arrow functions when you need `this` to be set by the caller.

Do not expect `bind`, `call`, or `apply` to change an arrow function's `this`.

Prefer `event.currentTarget` in DOM event handlers when it makes the code clearer.

## Common Mistakes

### Mistake 1: Using an Arrow Function as an Object Method

```js
const user = {
  name: "Alice",
  greet: () => {
    console.log(this.name);
  },
};

user.greet(); // not Alice
```

Arrow functions do not have their own `this`.

### Mistake 2: Using a Regular Function Callback When You Need Outer `this`

```js
const user = {
  name: "Alice",
  greetLater() {
    setTimeout(function () {
      console.log(this.name);
    }, 1000);
  },
};
```

Use an arrow function:

```js
setTimeout(() => {
  console.log(this.name);
}, 1000);
```

### Mistake 3: Trying to Rebind an Arrow Function

```js
const fn = () => this.name;
const bound = fn.bind({ name: "Alice" });
```

`bind` cannot change an arrow function's lexical `this`.

## Quick Check

What does this usually log?

```js
const user = {
  name: "Alice",
  greet: () => {
    console.log(this.name);
  },
};

user.greet();
```

It usually logs:

```text
undefined
```

The arrow function does not get `user` as `this`.

What does this log?

```js
const user = {
  name: "Alice",
  greetLater() {
    setTimeout(() => {
      console.log(this.name);
    }, 1000);
  },
};

user.greetLater();
```

It logs:

```text
Alice
```

The arrow callback inherits `this` from `greetLater`.

## Summary

Arrow functions do not have their own `this`.

- Regular function `this` depends on how the function is called.
- Arrow function `this` comes from the surrounding scope.
- Do not use arrow functions as object methods when the method needs `this`.
- Arrow functions are useful inside methods for callbacks and timers.
- `bind`, `call`, and `apply` cannot change an arrow function's `this`.
- In event handlers, use `event.currentTarget` when it is clearer than relying on `this`.
