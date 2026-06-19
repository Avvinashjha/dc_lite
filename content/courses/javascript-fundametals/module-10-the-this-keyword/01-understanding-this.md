# Understanding this

The `this` keyword is one of the most misunderstood parts of JavaScript.

It is also one of the most important.

You will see `this` in:

- object methods
- classes
- event handlers
- callbacks
- `bind`, `call`, and `apply`
- older JavaScript codebases

The key idea is:

```text
this is usually determined by how a function is called.
```

Not where the function is written.

Not what the function is named.

How it is called.

## What Is `this`?

`this` is a special keyword that refers to a value called the function's **execution context**.

In simpler words:

```text
this is the object a function is currently working with.
```

Example:

```js
const user = {
  name: "Alice",
  greet() {
    return `Hello, ${this.name}`;
  },
};

console.log(user.greet()); // Hello, Alice
```

Inside `greet`, `this` refers to `user`.

So:

```js
this.name
```

means:

```js
user.name
```

for this method call.

## `this` in an Object Method

When a function is called as a method on an object, `this` usually refers to the object before the dot.

```js
const user = {
  name: "Ava",
  describe() {
    console.log(this.name);
  },
};

user.describe(); // Ava
```

The call is:

```js
user.describe()
```

The object before the dot is `user`.

So inside `describe`, `this` is `user`.

## The Object Before the Dot Matters

Look carefully at this example:

```js
const person = {
  name: "Mira",
  sayName() {
    console.log(this.name);
  },
};

person.sayName(); // Mira
```

The object before the dot is `person`.

So `this` refers to `person`.

Now assign the same method to another object:

```js
const person = {
  name: "Mira",
  sayName() {
    console.log(this.name);
  },
};

const admin = {
  name: "Aarav",
  sayName: person.sayName,
};

admin.sayName(); // Aarav
```

The function was originally written inside `person`.

But it was called as:

```js
admin.sayName()
```

So `this` is `admin`.

This is why we say:

```text
this depends on the call site.
```

The call site is the place where the function is called.

## Losing `this`

A common bug happens when you copy a method into a standalone variable.

```js
const user = {
  name: "Alice",
  greet() {
    console.log(`Hello, ${this.name}`);
  },
};

const greetUser = user.greet;

greetUser(); // What is this?
```

The function is no longer called as:

```js
user.greet()
```

It is called as:

```js
greetUser()
```

There is no object before the dot.

So `this` is no longer `user`.

In strict mode, `this` will be `undefined`.

In non-strict browser code, `this` may fall back to the global object.

Either way, this is usually not what you wanted.

## Strict Mode and `this`

Strict mode makes JavaScript safer and less surprising.

Inside a regular function call, strict mode gives `this` the value `undefined`.

```js
"use strict";

function showThis() {
  console.log(this);
}

showThis(); // undefined
```

Without strict mode in a browser, `this` may refer to `window`.

```js
function showThis() {
  console.log(this);
}

showThis(); // window in non-strict browser code
```

Modern JavaScript modules and many build tools use strict mode automatically.

For learning, the important point is:

```text
A plain function call does not give you an object as this.
```

## `this` Is Not the Function Itself

Beginners sometimes think `this` means "this function".

It does not.

```js
const user = {
  name: "Alice",
  greet() {
    console.log(this);
  },
};

user.greet();
```

Here `this` is the `user` object, not the `greet` function.

## `this` Is Not the Outer Object Automatically

`this` is not based only on where a function is written.

```js
const user = {
  name: "Alice",
  profile: {
    name: "Admin Profile",
    showName() {
      console.log(this.name);
    },
  },
};

user.profile.showName(); // Admin Profile
```

The object before the final dot is `profile`.

So `this` is `user.profile`, not `user`.

## `this` With Constructor Functions

Before classes became common, JavaScript often used constructor functions.

```js
function User(name) {
  this.name = name;
}

const user = new User("Alice");

console.log(user.name); // Alice
```

When a function is called with `new`, JavaScript creates a new object and sets `this` to that new object.

You will learn more about this later with classes and prototypes.

For now:

```text
new changes what this means.
```

## `this` in Classes

Classes also use `this`.

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

Inside the class, `this` refers to the instance created by `new`.

You will study classes in a later module.

This module prepares you for that.

## The Four Main Rules

You can understand most `this` behavior with four rules.

| How the function is called | What `this` usually is |
| --- | --- |
| `object.method()` | The object before the dot |
| `functionName()` | `undefined` in strict mode |
| `new FunctionName()` | The newly created object |
| `function.call(value)` / `apply` / `bind` | The value you provide |

There is one major exception:

```text
Arrow functions do not have their own this.
```

You will learn that in a separate lesson.

## Best Practices

Look at the call site when reasoning about `this`.

```js
user.greet();
```

Ask:

```text
What object is before the dot?
```

Use method shorthand for object methods:

```js
const user = {
  name: "Alice",
  greet() {
    return `Hello, ${this.name}`;
  },
};
```

Avoid extracting methods unless you intentionally bind them.

```js
const greet = user.greet; // this may be lost
```

Do not assume `this` means the outer object.

Always check how the function is called.

## Common Mistakes

### Mistake 1: Thinking `this` Is Based on Where the Function Was Written

```js
const user = {
  name: "Alice",
  sayName() {
    console.log(this.name);
  },
};

const admin = {
  name: "Ava",
  sayName: user.sayName,
};

admin.sayName(); // Ava
```

The method was written in `user`, but called through `admin`.

So `this` is `admin`.

### Mistake 2: Losing `this` by Storing a Method in a Variable

```js
const user = {
  name: "Alice",
  greet() {
    console.log(this.name);
  },
};

const greet = user.greet;

greet(); // this is not user
```

The object before the dot is gone.

### Mistake 3: Expecting a Nested Method to Use the Outer Object

```js
const user = {
  name: "Alice",
  profile: {
    name: "Profile",
    show() {
      console.log(this.name);
    },
  },
};

user.profile.show(); // Profile
```

`this` is `user.profile`, not `user`.

## Quick Check

What does this log?

```js
const user = {
  name: "Alice",
  sayName() {
    console.log(this.name);
  },
};

user.sayName();
```

It logs:

```text
Alice
```

What does this log?

```js
const user = {
  name: "Alice",
  sayName() {
    console.log(this.name);
  },
};

const admin = {
  name: "Ava",
  sayName: user.sayName,
};

admin.sayName();
```

It logs:

```text
Ava
```

The function is called as `admin.sayName()`, so `this` is `admin`.

## Summary

`this` is a special keyword whose value depends on how a function is called.

- In `object.method()`, `this` is usually the object before the dot.
- A plain function call does not automatically get the surrounding object.
- In strict mode, a plain function call has `this` as `undefined`.
- When called with `new`, `this` is the newly created object.
- `call`, `apply`, and `bind` let you control `this`.
- Arrow functions do not have their own `this`.
- To understand `this`, always inspect the call site.
