# Arrow Functions

Arrow functions are a shorter way to write function expressions.

They were introduced in ES6 and are used everywhere in modern JavaScript.

Regular function expression:

```js
const add = function (a, b) {
  return a + b;
};
```

Arrow function:

```js
const add = (a, b) => {
  return a + b;
};
```

Shorter arrow function:

```js
const add = (a, b) => a + b;
```

## Basic Syntax

```js
const functionName = (parameters) => {
  // function body
};
```

Example:

```js
const greet = (name) => {
  return `Hello, ${name}`;
};

console.log(greet("Alice")); // Hello, Alice
```

The arrow `=>` separates the parameters from the function body.

## Single Expression Return

If the function body has only one expression, you can omit the braces and `return`.

```js
const double = (number) => number * 2;

console.log(double(5)); // 10
```

This is called an implicit return.

These two functions behave the same:

```js
const double = (number) => {
  return number * 2;
};
```

```js
const double = (number) => number * 2;
```

Use the shorter version when it stays readable.

## One Parameter

If there is exactly one parameter, parentheses are optional.

```js
const square = number => number * number;

console.log(square(4)); // 16
```

Many teams still prefer parentheses for consistency:

```js
const square = (number) => number * number;
```

Both are valid.

## Zero Parameters

If there are no parameters, you must use parentheses.

```js
const getMessage = () => "Hello!";

console.log(getMessage()); // Hello!
```

## Multiple Parameters

If there are multiple parameters, parentheses are required.

```js
const multiply = (a, b) => a * b;

console.log(multiply(3, 4)); // 12
```

## Returning Objects

When returning an object literal implicitly, wrap the object in parentheses.

Wrong:

```js
const createUser = (name) => { name: name };
```

JavaScript treats `{}` as a function body, not an object.

Correct:

```js
const createUser = (name) => ({ name: name });

console.log(createUser("Alice")); // { name: "Alice" }
```

With property shorthand:

```js
const createUser = (name) => ({ name });
```

## Arrow Functions With Array Methods

Arrow functions are commonly used with array methods.

```js
const numbers = [1, 2, 3];

const doubled = numbers.map((number) => number * 2);

console.log(doubled); // [2, 4, 6]
```

With `filter`:

```js
const scores = [90, 45, 70, 30];

const passing = scores.filter((score) => score >= 60);

console.log(passing); // [90, 70]
```

With `reduce`:

```js
const numbers = [1, 2, 3, 4];

const total = numbers.reduce((sum, number) => sum + number, 0);

console.log(total); // 10
```

Arrow functions are especially useful for short callbacks.

## Multi-Line Arrow Functions

Use braces when the function needs multiple statements.

```js
const formatUser = (user) => {
  const name = user.name.trim();
  const role = user.role.toUpperCase();

  return `${name} (${role})`;
};
```

When you use braces, you must write `return` if you want to return a value.

```js
const double = (number) => {
  number * 2;
};

console.log(double(5)); // undefined
```

Correct:

```js
const double = (number) => {
  return number * 2;
};
```

## Arrow Functions and `this`

Arrow functions do not have their own `this`.

They use `this` from the surrounding scope.

You studied this in the previous module.

This is why arrow functions are not a good choice for object methods that need `this`.

Avoid:

```js
const user = {
  name: "Alice",
  greet: () => {
    return `Hello, ${this.name}`;
  },
};
```

Prefer:

```js
const user = {
  name: "Alice",
  greet() {
    return `Hello, ${this.name}`;
  },
};
```

Arrow functions are excellent for callbacks.

They are not a replacement for every function.

## Arrow Functions Are Not Hoisted Like Function Declarations

Arrow functions are usually stored in variables.

```js
const greet = () => "Hello";
```

This follows the rules of `const`.

You cannot call it before the declaration.

```js
greet(); // ReferenceError

const greet = () => "Hello";
```

Function declarations behave differently:

```js
greet(); // Hello

function greet() {
  return "Hello";
}
```

## When to Use Arrow Functions

Arrow functions are great for:

- short callbacks
- array methods
- simple transformations
- functions that do not need their own `this`

Example:

```js
const names = users.map((user) => user.name);
```

Regular functions are often better for:

- object methods that use `this`
- constructor functions
- functions where hoisting improves readability
- longer named functions

## Best Practices

Use concise arrow functions for simple expressions:

```js
const ids = users.map((user) => user.id);
```

Use braces and `return` for multi-step logic:

```js
const labels = users.map((user) => {
  const status = user.active ? "Active" : "Inactive";
  return `${user.name}: ${status}`;
});
```

Use method shorthand for object methods that need `this`.

Do not force arrow functions into every situation.

## Common Mistakes

### Mistake 1: Forgetting `return` With Braces

```js
const doubled = numbers.map((number) => {
  number * 2;
});
```

This returns `undefined` for each item.

Correct:

```js
const doubled = numbers.map((number) => {
  return number * 2;
});
```

Or:

```js
const doubled = numbers.map((number) => number * 2);
```

### Mistake 2: Returning an Object Without Parentheses

```js
const users = names.map((name) => { name });
```

Correct:

```js
const users = names.map((name) => ({ name }));
```

### Mistake 3: Using Arrow Functions for Methods That Need `this`

```js
const user = {
  name: "Alice",
  greet: () => this.name,
};
```

Use method shorthand instead.

## Quick Check

What does this return?

```js
const add = (a, b) => a + b;

add(2, 3);
```

It returns:

```text
5
```

What does this return?

```js
const createUser = (name) => ({ name });

createUser("Alice");
```

It returns:

```js
{ name: "Alice" }
```

## Summary

Arrow functions provide a shorter syntax for function expressions.

- Use `=>` to create an arrow function.
- Single-expression arrow functions can return implicitly.
- Braces require an explicit `return`.
- Wrap object literals in parentheses when returning them implicitly.
- Arrow functions are common with array methods.
- Arrow functions do not have their own `this`.
- Avoid arrow functions for object methods that need `this`.
