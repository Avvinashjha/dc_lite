# Declarations vs Expressions

Functions are one of the most important building blocks in JavaScript.

Instead of writing the same logic again and again, you can wrap that logic in a function and call it whenever you need it.

For example:

```js
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet("Alice");
greet("Bob");
```

The function contains the reusable logic. Each function call provides a different value.

In JavaScript, there is more than one way to create a function. Two of the most common are:

- **function declarations**
- **function expressions**

They can look similar at first, but they behave differently in an important way: **hoisting**.

Understanding that difference will help you avoid confusing bugs.

## Function Declarations

A **function declaration** defines a named function using the `function` keyword.

Syntax:

```js
function functionName(parameters) {
  // code to run
}
```

Example:

```js
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet("Alice"); // Hello, Alice!
```

This function is named `greet`.

It accepts one parameter, `name`, and uses that value inside the function body.

## Calling a Function Declaration

To run a function, you **call** it by writing its name followed by parentheses:

```js
greet("Alice");
```

The value inside the parentheses is passed into the function.

In this example:

```js
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet("Alice");
```

JavaScript takes `"Alice"` and assigns it to the parameter `name` for that function call.

The output is:

```text
Hello, Alice!
```

## Function Declarations Are Hoisted

Function declarations are **hoisted**.

That means JavaScript makes the function available throughout its scope before the code runs.

Because of this, you can call a function declaration before the line where it is written:

```js
sayGoodbye("Bob");

function sayGoodbye(name) {
  console.log(`Goodbye, ${name}!`);
}
```

This works.

JavaScript knows about the full `sayGoodbye` function before it starts executing the code in that scope.

This is different from most values created with `const` and `let`, which cannot be used before their declaration line.

## Why Hoisting Can Be Useful

Hoisting can make code easier to read in some situations.

For example, you might put the main flow of a script at the top, then define helper functions below it:

```js
showWelcomeMessage("Maya");

function showWelcomeMessage(userName) {
  const message = createWelcomeMessage(userName);
  console.log(message);
}

function createWelcomeMessage(userName) {
  return `Welcome back, ${userName}!`;
}
```

This can read nicely because the high-level action appears first.

However, hoisting can also surprise beginners. Some teams prefer to define functions before calling them so the file reads from top to bottom.

Both styles are valid. The important part is understanding how JavaScript behaves.

## Function Expressions

A **function expression** creates a function as a value.

That value is usually assigned to a variable.

Example:

```js
const greet = function (name) {
  console.log(`Hello, ${name}!`);
};

greet("Alice"); // Hello, Alice!
```

Here, the function is assigned to the variable `greet`.

This is why it is called a function expression: the function is being used as part of an expression.

You can think of it like this:

```js
const greet = /* function value */;
```

Once the function value is stored in `greet`, you can call it:

```js
greet("Alice");
```

## Anonymous Function Expressions

Many function expressions are **anonymous**, meaning the function itself has no name.

```js
const greet = function (name) {
  console.log(`Hello, ${name}!`);
};
```

The variable has a name:

```js
greet
```

But the function after the `=` does not:

```js
function (name) {
  console.log(`Hello, ${name}!`);
}
```

This is common in JavaScript.

## Function Expressions Are Not Available Before Assignment

Function expressions are not available until JavaScript reaches the assignment line.

This does not work:

```js
greet("Alice");

const greet = function (name) {
  console.log(`Hello, ${name}!`);
};
```

The result is an error.

With `const` or `let`, JavaScript knows the variable exists, but you cannot access it before the declaration line is reached.

That period is called the **temporal dead zone**.

So the problem is not that the function body is wrong. The problem is that `greet` is being used too early.

Correct version:

```js
const greet = function (name) {
  console.log(`Hello, ${name}!`);
};

greet("Alice");
```

Define the function expression first. Call it after.

## What About `var`?

Older JavaScript code sometimes uses `var` with function expressions:

```js
sayGoodbye("Bob");

var sayGoodbye = function (name) {
  console.log(`Goodbye, ${name}!`);
};
```

This also fails, but the error is different from `const` or `let`.

Because `var` declarations are hoisted and initialized as `undefined`, JavaScript sees this roughly like:

```js
var sayGoodbye;

sayGoodbye("Bob"); // TypeError: sayGoodbye is not a function

sayGoodbye = function (name) {
  console.log(`Goodbye, ${name}!`);
};
```

At the moment of the call, `sayGoodbye` exists, but its value is still `undefined`.

You cannot call `undefined` like a function.

This is another reason modern JavaScript usually avoids `var`.

## Named Function Expressions

A function expression can also have its own name:

```js
const calculateFactorial = function factorial(n) {
  if (n <= 1) {
    return 1;
  }

  return n * factorial(n - 1);
};

console.log(calculateFactorial(5)); // 120
```

Here, the variable name is:

```js
calculateFactorial
```

The function's internal name is:

```js
factorial
```

That internal name can be useful for recursion, which means a function calling itself.

Inside the function, this works:

```js
factorial(n - 1)
```

But outside the function, the internal name is not available:

```js
const calculateFactorial = function factorial(n) {
  if (n <= 1) {
    return 1;
  }

  return n * factorial(n - 1);
};

console.log(calculateFactorial(5)); // 120

console.log(factorial(5)); // ReferenceError
```

Outside the function expression, you use the variable name `calculateFactorial`.

## Declarations vs Expressions

Here is the core difference:

| Feature | Function Declaration | Function Expression |
| --- | --- | --- |
| Basic syntax | `function greet() {}` | `const greet = function () {};` |
| Has a required name? | Yes | No, it can be anonymous |
| Can be called before it appears? | Yes | No |
| Hoisting behavior | The function is available throughout its scope | The variable exists according to `let`, `const`, or `var` rules, but the function value is assigned later |
| Common use | Standalone helper functions | Functions stored in variables or passed around as values |

## When to Use Function Declarations

Function declarations are a good fit for named, reusable helpers.

```js
function formatPrice(amount) {
  return `$${amount.toFixed(2)}`;
}

function calculateTotal(price, quantity) {
  return price * quantity;
}

const total = calculateTotal(19.99, 3);
console.log(formatPrice(total)); // $59.97
```

This style is clear when the function is meant to be a normal reusable part of the file.

Function declarations also work well when you want helper functions to appear below the main code.

## When to Use Function Expressions

Function expressions are useful when you want to treat a function like a value.

For example, you can store a function in a variable:

```js
const double = function (number) {
  return number * 2;
};

console.log(double(4)); // 8
```

You can also pass functions into other functions:

```js
const numbers = [1, 2, 3];

const doubled = numbers.map(function (number) {
  return number * 2;
});

console.log(doubled); // [2, 4, 6]
```

In this example, the function expression is passed directly to `map()`.

You will see this pattern often in JavaScript.

## Avoid Calling Function Expressions Too Early

This is one of the most common mistakes:

```js
const result = add(2, 3);

const add = function (a, b) {
  return a + b;
};
```

This fails because `add` has not been initialized yet.

Fix it by moving the function expression above the call:

```js
const add = function (a, b) {
  return a + b;
};

const result = add(2, 3);

console.log(result); // 5
```

## Function Declaration vs Function Expression in Practice

These two examples produce the same result:

```js
function subtract(a, b) {
  return a - b;
}

console.log(subtract(10, 4)); // 6
```

```js
const subtract = function (a, b) {
  return a - b;
};

console.log(subtract(10, 4)); // 6
```

The main difference is not what happens when they are called after definition.

The main difference is **when the function becomes available**.

A declaration is available throughout its scope.

A function expression assigned to `const` or `let` is only usable after the assignment line has run.

## Best Practices

Use function declarations when you are writing clear, standalone helper functions:

```js
function isAdult(age) {
  return age >= 18;
}
```

Use function expressions when the function is being stored, passed around, or used as a value:

```js
const isAdult = function (age) {
  return age >= 18;
};
```

Define function expressions before you call them:

```js
const getUsername = function (user) {
  return user.name;
};

console.log(getUsername({ name: "Ava" }));
```

Avoid `var` for function expressions:

```js
// Avoid this
var greet = function (name) {
  return `Hello, ${name}`;
};
```

Prefer `const` when the variable will not be reassigned:

```js
const greet = function (name) {
  return `Hello, ${name}`;
};
```

## Common Mistakes

### Mistake 1: Calling a Function Expression Before It Exists

```js
showMessage();

const showMessage = function () {
  console.log("Hello!");
};
```

This fails because `showMessage` is used before it is initialized.

Correct version:

```js
const showMessage = function () {
  console.log("Hello!");
};

showMessage();
```

### Mistake 2: Thinking Function Expressions Are the Same as Declarations

These are not identical:

```js
function run() {
  console.log("Running");
}
```

```js
const run = function () {
  console.log("Running");
};
```

They can be called the same way after they exist:

```js
run();
```

But they do not have the same hoisting behavior.

### Mistake 3: Forgetting the Semicolon After a Function Expression

A function declaration does not need a semicolon:

```js
function greet() {
  console.log("Hello");
}
```

A function expression is part of a variable assignment, so it commonly ends with a semicolon:

```js
const greet = function () {
  console.log("Hello");
};
```

JavaScript may insert semicolons automatically, but writing the semicolon here makes the assignment clearer.

## Quick Check

What happens here?

```js
sayHello();

function sayHello() {
  console.log("Hello!");
}
```

It works because `sayHello` is a function declaration.

What happens here?

```js
sayHello();

const sayHello = function () {
  console.log("Hello!");
};
```

It fails because `sayHello` is a function expression assigned to a `const`, and the variable cannot be used before initialization.

## Summary

Function declarations and function expressions both create functions, but they are not available at the same time.

- A **function declaration** uses `function name() {}` and is hoisted with its full function body.
- A **function expression** creates a function as a value, often assigned to a variable.
- Function expressions assigned with `const` or `let` must be defined before they are called.
- Named function expressions can help with recursion and debugging.
- Use declarations for standalone helpers and expressions when functions need to be treated as values.
