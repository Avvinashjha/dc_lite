# Hoisting

Hoisting is one of the most famous JavaScript concepts.

It is also one of the most misunderstood.

Beginners often see code like this and wonder why it works:

```js
sayHello();

function sayHello() {
  console.log("Hello!");
}
```

Then they see code like this and wonder why it fails:

```js
console.log(message);

const message = "Hello!";
```

Both examples are related to hoisting.

Once you understand what JavaScript prepares before running your code, hoisting becomes predictable.

## What Is Hoisting?

**Hoisting** is JavaScript's behavior of processing declarations before code execution.

Before JavaScript runs your code line by line, the engine first scans the current scope and prepares declarations.

This includes things like:

- variable declarations
- function declarations
- function parameters
- class declarations

Important clarification:

```text
JavaScript does not physically move your code.
```

The code stays exactly where you wrote it.

Hoisting is a way to describe how JavaScript sets up memory for declarations before execution begins.

## Declaration vs Assignment

To understand hoisting, you must separate two ideas:

- **declaration**
- **assignment**

This line does both:

```js
var message = "Hello";
```

It declares a variable:

```js
var message;
```

Then it assigns a value:

```js
message = "Hello";
```

Hoisting affects the declaration.

It does not move the assignment to the top.

That distinction explains many hoisting surprises.

## Hoisting Depends on the Keyword

Variables declared with `var`, `let`, and `const` are not handled the same way.

| Keyword | Hoisted? | Initialized Before Declaration Line? | Early Access Result |
| --- | --- | --- | --- |
| `var` | Yes | Yes, initialized to `undefined` | `undefined` |
| `let` | Yes | No | `ReferenceError` |
| `const` | Yes | No | `ReferenceError` |

This is why modern JavaScript prefers `let` and `const`.

They fail loudly when used too early.

`var` can fail silently by giving you `undefined`.

## `var` Is Hoisted and Initialized

When JavaScript sees a `var` declaration, it hoists the declaration and initializes the variable to `undefined`.

Example:

```js
console.log(message); // undefined

var message = "Hello";

console.log(message); // Hello
```

This does not throw an error.

Before the code runs, JavaScript prepares the `message` variable with the value `undefined`.

You can think of the code like this:

```js
var message;

console.log(message); // undefined

message = "Hello";

console.log(message); // Hello
```

This is only a mental model.

JavaScript does not rewrite your file, but this model helps explain the behavior.

## Why `var` Hoisting Can Be Dangerous

The problem with `var` is that early access does not fail.

It gives you `undefined`.

```js
function calculateDiscount(price) {
  console.log(discount); // undefined

  var discount = price * 0.1;

  return discount;
}

console.log(calculateDiscount(100)); // 10
```

This can hide bugs.

You may think the variable has a real value, but JavaScript only gives you `undefined` because the assignment has not happened yet.

With larger functions, this can be hard to debug.

## `let` and `const` Are Hoisted Differently

Variables declared with `let` and `const` are also hoisted.

But they are not initialized until JavaScript reaches their declaration line.

Example:

```js
console.log(message); // ReferenceError

let message = "Hello";
```

And:

```js
console.log(appName); // ReferenceError

const appName = "DailyCoder";
```

The variable exists in the scope, but it cannot be accessed yet.

This period is called the **Temporal Dead Zone**.

## The Temporal Dead Zone

The **Temporal Dead Zone**, often shortened to **TDZ**, is the time between:

1. the start of the scope
2. the line where a `let` or `const` variable is declared

During that time, the variable cannot be used.

```js
{
  // TDZ for username starts here

  console.log(username); // ReferenceError

  const username = "Alice";

  // TDZ for username ends here

  console.log(username); // Alice
}
```

The TDZ helps catch mistakes early.

Instead of silently giving you `undefined`, JavaScript throws a clear error.

This is one reason `let` and `const` are safer than `var`.

## TDZ Applies to Block Scope

Because `let` and `const` are block-scoped, their TDZ starts at the beginning of their block.

```js
const status = "global";

if (true) {
  console.log(status); // ReferenceError

  const status = "block";

  console.log(status); // block
}
```

This may seem surprising.

There is a global `status`, but JavaScript does not use it inside the block.

Why?

Because the block has its own `status` declaration.

Inside that block, the block-scoped `status` shadows the global `status`, but it is still in the TDZ until its declaration line.

## `const` Must Be Assigned Immediately

`const` has one extra rule:

```js
const appName;
```

This is invalid.

A `const` variable must be assigned when it is declared:

```js
const appName = "DailyCoder";
```

That is because `const` cannot be reassigned later.

So JavaScript requires the initial value immediately.

## Hoisting Function Declarations

Function declarations are fully hoisted.

That means the function name and function body are available before the declaration line runs.

```js
sayHi(); // Hi there!

function sayHi() {
  console.log("Hi there!");
}
```

This works because JavaScript prepares the full function declaration before execution.

This is different from `var`, which is initialized to `undefined`.

A function declaration is available as a callable function.

## Function Declarations Are Scoped Too

Function declarations are hoisted within their scope.

```js
function outer() {
  sayHi();

  function sayHi() {
    console.log("Hi from outer");
  }
}

outer(); // Hi from outer
```

The `sayHi` function is available inside `outer`.

But it is not available globally:

```js
function outer() {
  function sayHi() {
    console.log("Hi from outer");
  }
}

outer();

sayHi(); // ReferenceError
```

Hoisting does not ignore scope.

Declarations are hoisted within the scope where they are declared.

## Function Expressions Follow Variable Rules

A function expression stores a function in a variable.

Because of that, it follows variable hoisting rules.

Example with `var`:

```js
sayBye(); // TypeError

var sayBye = function () {
  console.log("Bye!");
};
```

Why is this a `TypeError`?

Because the `var` declaration is hoisted and initialized to `undefined`.

You can think of it like this:

```js
var sayBye;

sayBye(); // TypeError: sayBye is not a function

sayBye = function () {
  console.log("Bye!");
};
```

At the moment of the call, `sayBye` exists, but it is `undefined`.

You cannot call `undefined` like a function.

## Function Expressions With `const`

Function expressions assigned to `const` are common in modern JavaScript.

```js
const sayHello = function () {
  console.log("Hello!");
};

sayHello(); // Hello!
```

But you cannot call them before the declaration line:

```js
sayHello(); // ReferenceError

const sayHello = function () {
  console.log("Hello!");
};
```

The variable `sayHello` is in the TDZ until JavaScript reaches the `const` declaration.

This is the same rule you learned for other `const` variables.

## Arrow Functions Follow Variable Rules Too

Arrow functions are also function expressions.

```js
const sayHello = () => {
  console.log("Hello!");
};
```

They follow the same hoisting behavior as the variable they are assigned to:

```js
sayHello(); // ReferenceError

const sayHello = () => {
  console.log("Hello!");
};
```

The function value is not assigned until JavaScript reaches the assignment line.

## Declaration vs Expression Review

Compare these two examples.

Function declaration:

```js
run();

function run() {
  console.log("Running");
}
```

This works.

Function expression:

```js
run();

const run = function () {
  console.log("Running");
};
```

This fails.

The difference is not how the function is called.

Both are called with:

```js
run();
```

The difference is how the function is created.

Function declarations are fully hoisted.

Function expressions follow variable hoisting rules.

## Hoisting and Scope

Hoisting happens inside a scope.

It does not move declarations across function boundaries.

```js
function showMessage() {
  console.log(message); // undefined

  var message = "Hello";
}

showMessage();

console.log(message); // ReferenceError
```

The `var message` declaration is hoisted inside `showMessage`.

It is not hoisted to the global scope.

The same idea applies to blocks with `let` and `const`:

```js
if (true) {
  console.log(message); // ReferenceError

  let message = "Hello";
}
```

The `message` variable belongs to the `if` block.

Its TDZ starts at the beginning of that block.

## Hoisting in Loops

Loop variables declared with `let` are block-scoped.

```js
for (let i = 0; i < 3; i++) {
  console.log(i);
}

console.log(i); // ReferenceError
```

The loop variable `i` is not available outside the loop.

With `var`, the variable is scoped to the surrounding function or global scope:

```js
for (var i = 0; i < 3; i++) {
  console.log(i);
}

console.log(i); // 3
```

This is not only a block scope issue.

It is also connected to hoisting because the `var i` declaration is hoisted to the surrounding scope.

## A Common `var` Bug

Here is a common bug caused by `var` hoisting:

```js
function hasPermission(user) {
  if (user.isAdmin) {
    var access = "full";
  }

  return access;
}

console.log(hasPermission({ isAdmin: true })); // full
console.log(hasPermission({ isAdmin: false })); // undefined
```

When `isAdmin` is false, the assignment does not run.

But `access` still exists because `var` is hoisted to the function scope.

A clearer version uses an explicit return:

```js
function hasPermission(user) {
  if (user.isAdmin) {
    return "full";
  }

  return "limited";
}
```

This avoids relying on a variable that may or may not have been assigned.

## Why `let` and `const` Are Safer

`let` and `const` make mistakes more obvious.

```js
function hasPermission(user) {
  if (user.isAdmin) {
    const access = "full";
  }

  return access; // ReferenceError
}
```

This fails immediately.

That is helpful.

It tells you that `access` was declared in the wrong scope for how you are trying to use it.

You can fix the scope intentionally:

```js
function hasPermission(user) {
  let access = "limited";

  if (user.isAdmin) {
    access = "full";
  }

  return access;
}
```

Or use early returns:

```js
function hasPermission(user) {
  if (user.isAdmin) {
    return "full";
  }

  return "limited";
}
```

## Classes and Hoisting

Class declarations are also hoisted in the sense that JavaScript knows about the binding.

But like `let` and `const`, classes are not initialized until their declaration line.

```js
const user = new User(); // ReferenceError

class User {
  constructor(name) {
    this.name = name;
  }
}
```

You do not need to master classes yet, but the rule is useful to know:

```text
Use classes after they are declared.
```

## Best Practices

Use `const` by default:

```js
const maxAttempts = 3;
```

Use `let` when reassignment is required:

```js
let count = 0;
count++;
```

Avoid `var`:

```js
// Avoid this in modern JavaScript
var message = "Hello";
```

Declare variables before using them:

```js
const message = "Hello";
console.log(message);
```

Define function expressions before calling them:

```js
const greet = function (name) {
  return `Hello, ${name}`;
};

console.log(greet("Alice"));
```

Function declarations can be called before their definition, but many teams still prefer defining them before use for readability:

```js
function greet(name) {
  return `Hello, ${name}`;
}

console.log(greet("Alice"));
```

## Common Mistakes

### Mistake 1: Thinking Assignments Are Hoisted

```js
console.log(score); // undefined

var score = 100;
```

Only the declaration is hoisted.

The assignment still happens where it is written.

### Mistake 2: Expecting `let` to Behave Like `var`

```js
console.log(score); // ReferenceError

let score = 100;
```

`let` is hoisted, but it cannot be accessed before initialization.

### Mistake 3: Calling a Function Expression Too Early

```js
calculateTotal(); // ReferenceError

const calculateTotal = function () {
  return 100;
};
```

Function expressions assigned to `const` follow `const` hoisting rules.

Define them before calling them.

### Mistake 4: Forgetting That Hoisting Respects Scope

```js
function createMessage() {
  var message = "Hello";
}

console.log(message); // ReferenceError
```

The `message` declaration is hoisted inside `createMessage`, not outside it.

Hoisting does not make local variables global.

## Quick Check

What does this log?

```js
console.log(name);

var name = "Alice";
```

It logs:

```js
undefined
```

The `var` declaration is hoisted and initialized to `undefined`.

What happens here?

```js
console.log(name);

const name = "Alice";
```

It throws a `ReferenceError`.

The variable is in the temporal dead zone until its declaration line.

What does this code do?

```js
sayHi();

function sayHi() {
  console.log("Hi!");
}
```

It logs:

```text
Hi!
```

Function declarations are fully hoisted.

What happens here?

```js
sayHi();

const sayHi = function () {
  console.log("Hi!");
};
```

It throws a `ReferenceError`.

The function expression is assigned to a `const`, and that variable cannot be accessed before initialization.

## Summary

Hoisting is JavaScript's setup step for declarations before code execution.

- JavaScript does not physically move your code.
- Declarations are prepared before execution.
- Assignments still happen where they are written.
- `var` is hoisted and initialized to `undefined`.
- `let` and `const` are hoisted but unavailable until their declaration line.
- The temporal dead zone prevents early access to `let` and `const`.
- Function declarations are fully hoisted.
- Function expressions and arrow functions follow the hoisting rules of the variable they are assigned to.
- Hoisting always respects scope.
