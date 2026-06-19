# Properties and Methods

Objects store data in properties.

They can also store functions.

When a function is stored as a property on an object, it is called a **method**.

```js
const user = {
  name: "Alice",
  greet: function () {
    return "Hello!";
  },
};

console.log(user.name); // Alice
console.log(user.greet()); // Hello!
```

In this object:

- `name` is a property
- `greet` is a method

## Properties Review

A property is a key-value pair.

```js
const product = {
  name: "Keyboard",
  price: 50,
  inStock: true,
};
```

The property names are:

- `name`
- `price`
- `inStock`

The values are:

- `"Keyboard"`
- `50`
- `true`

You access them with dot notation:

```js
console.log(product.name); // Keyboard
```

Or bracket notation:

```js
console.log(product["price"]); // 50
```

## Property Shorthand

If a variable name and property name are the same, you can use shorthand syntax.

Long version:

```js
const name = "Alice";
const role = "admin";

const user = {
  name: name,
  role: role,
};
```

Shorthand version:

```js
const name = "Alice";
const role = "admin";

const user = {
  name,
  role,
};
```

Both create the same object:

```js
{
  name: "Alice",
  role: "admin"
}
```

Property shorthand is common in modern JavaScript.

## Computed Property Names

Sometimes a property name comes from a variable.

Use computed property names with square brackets.

```js
const key = "email";

const user = {
  name: "Alice",
  [key]: "alice@example.com",
};

console.log(user.email); // alice@example.com
```

The expression inside `[]` is evaluated.

Since `key` is `"email"`, JavaScript creates a property named `email`.

This is useful when property names are dynamic.

## Dynamic Property Updates

Computed property names are also useful when updating objects.

```js
const field = "username";
const value = "dailycoder";

const formData = {
  [field]: value,
};

console.log(formData); // { username: "dailycoder" }
```

You will see this pattern often in form handling.

Example:

```js
function updateField(object, field, value) {
  object[field] = value;
}

const user = {
  name: "Alice",
};

updateField(user, "role", "admin");

console.log(user); // { name: "Alice", role: "admin" }
```

## Methods

A method is a function stored inside an object.

```js
const calculator = {
  add: function (a, b) {
    return a + b;
  },
};

console.log(calculator.add(2, 3)); // 5
```

The method name is `add`.

The method value is a function.

You call it with parentheses:

```js
calculator.add(2, 3);
```

## Method Shorthand

Modern JavaScript has a shorter method syntax.

Long version:

```js
const calculator = {
  add: function (a, b) {
    return a + b;
  },
};
```

Shorthand version:

```js
const calculator = {
  add(a, b) {
    return a + b;
  },
};
```

Both work.

The shorthand version is common and easier to read.

## Methods Can Use Object Data

Methods often work with data stored on the same object.

```js
const user = {
  name: "Alice",
  role: "admin",
  describe() {
    return `${this.name} is an ${this.role}`;
  },
};

console.log(user.describe()); // Alice is an admin
```

This example uses `this`.

You will study `this` deeply in the next module.

For now, understand the basic idea:

```text
Inside a method, this can refer to the object that called the method.
```

Do not worry if `this` still feels a little mysterious.

It gets its own module because it has important rules.

## Method Parameters

Methods can receive parameters like normal functions.

```js
const cart = {
  items: [],
  addItem(item) {
    this.items.push(item);
  },
};

cart.addItem("Keyboard");
cart.addItem("Mouse");

console.log(cart.items); // ["Keyboard", "Mouse"]
```

The method `addItem` receives an `item`.

It adds that item to the object's `items` array.

## Objects Can Contain Many Methods

```js
const counter = {
  count: 0,
  increment() {
    this.count += 1;
    return this.count;
  },
  decrement() {
    this.count -= 1;
    return this.count;
  },
  reset() {
    this.count = 0;
    return this.count;
  },
};

console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.reset()); // 0
```

This object combines state and behavior.

The `count` property stores data.

The methods change or read that data.

## Methods vs Functions

A function can stand alone:

```js
function greet(name) {
  return `Hello, ${name}`;
}
```

A method belongs to an object:

```js
const greeter = {
  greet(name) {
    return `Hello, ${name}`;
  },
};
```

You call them differently:

```js
greet("Alice");
greeter.greet("Alice");
```

The second one is a method call because `greet` is a property on `greeter`.

## Objects as Configuration

Objects are often used to pass configuration into functions.

```js
function createUser(options) {
  return {
    name: options.name,
    role: options.role ?? "user",
    active: options.active ?? true,
  };
}

const user = createUser({
  name: "Alice",
  role: "admin",
});

console.log(user);
```

This is clearer than passing many positional arguments:

```js
createUser("Alice", "admin", true);
```

With an object, each value has a name.

## Checking if a Property Exists

You can check if a property exists using the `in` operator.

```js
const user = {
  name: "Alice",
};

console.log("name" in user); // true
console.log("email" in user); // false
```

This checks whether the property exists on the object or its prototype chain.

For beginner use, it is often enough to check whether a value is present:

```js
if (user.email !== undefined) {
  console.log(user.email);
}
```

But be careful: a property can exist with the value `undefined`.

## `hasOwnProperty`

To check whether an object has its own property, you may see `hasOwnProperty`.

```js
const user = {
  name: "Alice",
};

console.log(user.hasOwnProperty("name")); // true
console.log(user.hasOwnProperty("email")); // false
```

Modern code sometimes uses:

```js
Object.hasOwn(user, "name");
```

This avoids some edge cases.

You do not need to master this yet, but it is useful to recognize.

## Best Practices

Use property shorthand when names match:

```js
const name = "Alice";
const user = { name };
```

Use method shorthand:

```js
const user = {
  greet() {
    return "Hello";
  },
};
```

Use computed property names for dynamic keys:

```js
const key = "email";
const user = { [key]: "alice@example.com" };
```

Use objects to group related data and behavior:

```js
const timer = {
  seconds: 0,
  tick() {
    this.seconds += 1;
  },
};
```

Avoid putting unrelated data and methods in the same object.

## Common Mistakes

### Mistake 1: Calling a Method Without Parentheses

```js
const user = {
  greet() {
    return "Hello";
  },
};

console.log(user.greet); // [Function]
```

This accesses the function value.

To call it:

```js
console.log(user.greet()); // Hello
```

### Mistake 2: Forgetting Brackets for Dynamic Keys

```js
const key = "email";

const user = {
  key: "alice@example.com",
};

console.log(user.email); // undefined
```

This creates a property literally named `key`.

Correct:

```js
const user = {
  [key]: "alice@example.com",
};
```

### Mistake 3: Using Arrow Functions for Methods That Need `this`

```js
const user = {
  name: "Alice",
  greet: () => {
    return `Hello, ${this.name}`;
  },
};
```

Arrow functions do not have their own `this`.

You will learn this deeply in the next module.

For object methods that use `this`, prefer method shorthand:

```js
const user = {
  name: "Alice",
  greet() {
    return `Hello, ${this.name}`;
  },
};
```

## Quick Check

What does this log?

```js
const key = "role";

const user = {
  name: "Alice",
  [key]: "admin",
};

console.log(user.role);
```

It logs:

```text
admin
```

What is `greet` in this object?

```js
const user = {
  name: "Alice",
  greet() {
    return "Hello";
  },
};
```

`greet` is a method because it is a function stored on an object.

## Summary

Objects can store both data and behavior.

- Properties are key-value pairs.
- Methods are functions stored as object properties.
- Property shorthand reduces repetition.
- Computed property names let you create dynamic keys.
- Method shorthand is the modern way to write object methods.
- Methods can receive parameters like normal functions.
- Methods that use `this` should usually use method shorthand, not arrow functions.
- Objects are useful for grouping related data, behavior, and configuration.
