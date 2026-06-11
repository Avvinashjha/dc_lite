# Global vs Function Scope

This is where JavaScript starts to get more interesting.

It is also where many beginners meet their first `ReferenceError`.

Example:

```js
function showMessage() {
  const message = "Hello!";
}

console.log(message); // ReferenceError
```

The variable exists, but not where you are trying to use it.

That is a scope problem.

## What Is Scope?

**Scope** is the set of rules that decides where a variable can be accessed.

When you create a variable, JavaScript does not make it available everywhere automatically.

Where the variable is declared determines where it can be used.

For example:

```js
const appName = "DailyCoder";

function showAppName() {
  console.log(appName);
}

showAppName(); // DailyCoder
```

The function can access `appName` because `appName` is in an outer scope.

But this works differently:

```js
function showAppName() {
  const appName = "DailyCoder";
}

console.log(appName); // ReferenceError
```

Now `appName` is declared inside the function.

Code outside the function cannot access it.

That difference is the heart of scope.

## Why Scope Matters

Scope helps JavaScript organize variables.

Without scope, every variable would be available everywhere.

That might sound convenient at first, but it would quickly become dangerous.

Imagine a large app where every part of the code can change every variable.

One feature could accidentally overwrite a value used by another feature.

Scope prevents many of these mistakes by keeping variables contained.

Good scope usage helps you:

- avoid name conflicts
- protect temporary variables
- make functions easier to understand
- reduce accidental changes
- prepare for closures and modules

## Global Scope

A variable is in **global scope** when it is declared outside of functions and blocks.

```js
const globalMessage = "I am accessible from many places.";

function sayHello() {
  console.log(globalMessage);
}

sayHello(); // I am accessible from many places.
console.log(globalMessage); // I am accessible from many places.
```

The variable `globalMessage` is declared outside the function.

Because of that, the function can access it.

Code after the function can also access it.

## Global Scope in a Browser

In browser scripts, the global scope is shared by the page.

For older scripts that are not modules, top-level `var` declarations can become properties on the global `window` object:

```js
var username = "Alice";

console.log(window.username); // Alice
```

This is one reason older JavaScript code could become messy.

Many scripts on the same page shared the same global space.

Modern code usually avoids this by using:

- `const` and `let`
- modules
- functions
- build tools

Top-level `let` and `const` behave better than `var`, but they are still globally scoped within that script or module context.

The safest habit is simple:

```text
Create variables in the smallest scope where they are needed.
```

## The Danger of Global Variables

Global variables can be accessed from many places.

That also means they can be changed from many places.

```js
let currentUser = "Alice";

function logInAsGuest() {
  currentUser = "Guest";
}

function showCurrentUser() {
  console.log(currentUser);
}

showCurrentUser(); // Alice
logInAsGuest();
showCurrentUser(); // Guest
```

This code works, but the shared variable can become hard to track.

If many functions can change `currentUser`, it becomes harder to know where a bug came from.

Global variables can also cause naming conflicts.

```js
// Script A
var user = "Alice";

// Script B
var user = "Bob";
```

Both scripts use the same global variable name.

The second value can overwrite the first one.

This problem is often called **global namespace pollution**.

## When Global Values Are Okay

Global values are not always bad.

Some values are meant to be shared widely.

For example:

```js
const APP_NAME = "DailyCoder";
const VERSION = "1.0.0";
```

These constants might be safe if they are truly shared configuration values and are not reassigned.

But most variables should not be global.

If a value only belongs to one function, keep it inside that function.

If a value only belongs to one module, keep it inside that module.

## Function Scope

A variable has **function scope** when it is declared inside a function.

```js
function calculateTotal() {
  const subtotal = 100;
  const tax = 8;

  return subtotal + tax;
}

console.log(calculateTotal()); // 108
```

The variables `subtotal` and `tax` exist inside `calculateTotal`.

They are not available outside the function:

```js
function calculateTotal() {
  const subtotal = 100;
  const tax = 8;

  return subtotal + tax;
}

calculateTotal();

console.log(subtotal); // ReferenceError
console.log(tax); // ReferenceError
```

This is a good thing.

The function's internal variables are protected from the rest of the program.

## Function Scope Creates Encapsulation

**Encapsulation** means keeping related logic and data together while hiding details that other code does not need.

```js
function formatPrice(amount) {
  const rounded = amount.toFixed(2);
  const currency = "USD";

  return `${currency} ${rounded}`;
}

console.log(formatPrice(19.99)); // USD 19.99
```

The variables `rounded` and `currency` are implementation details.

Other code only needs the final formatted value.

The function hides those temporary variables inside its own scope.

This makes your program safer and easier to reason about.

## Function Variables Are Created Per Call

Variables inside a function are created each time the function is called.

```js
function countVisit(userName) {
  const message = `${userName} visited the page.`;
  console.log(message);
}

countVisit("Alice");
countVisit("Bob");
```

Each function call gets its own `userName` and `message`.

The first call does not reuse the second call's values.

You can think of a function call as a temporary workspace.

When the function starts, JavaScript creates the workspace.

When the function finishes, that workspace is no longer needed.

## Parameters Are Function-Scoped

Parameters are also local to the function.

```js
function greet(name) {
  return `Hello, ${name}!`;
}

console.log(greet("Alice")); // Hello, Alice!
console.log(name); // ReferenceError
```

The parameter `name` only exists inside `greet`.

Code outside the function cannot access it.

This is why different functions can safely use the same parameter names:

```js
function greet(name) {
  return `Hello, ${name}!`;
}

function farewell(name) {
  return `Goodbye, ${name}!`;
}

console.log(greet("Alice")); // Hello, Alice!
console.log(farewell("Bob")); // Goodbye, Bob!
```

Both functions use a parameter named `name`.

They do not conflict because each `name` belongs to a different function scope.

## Same Name in Different Scopes

Different scopes can contain variables with the same name.

```js
const message = "Global message";

function showMessage() {
  const message = "Function message";
  console.log(message);
}

showMessage(); // Function message
console.log(message); // Global message
```

Inside the function, JavaScript uses the closest variable named `message`.

Outside the function, JavaScript uses the global `message`.

This is called **shadowing**.

The inner variable shadows the outer variable while you are inside that inner scope.

Shadowing is allowed, but it can be confusing if overused.

Use clear names when two variables mean different things.

## Inner Functions

Functions can be created inside other functions.

```js
function outerFunction() {
  const outerMessage = "I am outside the inner function.";

  function innerFunction() {
    console.log(outerMessage);
  }

  innerFunction();
}

outerFunction(); // I am outside the inner function.
```

The inner function can access variables from the outer function.

This is a key part of JavaScript's scope system.

## Lexical Scope

JavaScript uses **lexical scope**.

Lexical scope means a function's access to variables is based on where the function is written in the code.

It is not based on where the function is called.

Example:

```js
const globalVar = "Global";

function outerFunction() {
  const outerVar = "Outer";

  function innerFunction() {
    const innerVar = "Inner";

    console.log(innerVar);
    console.log(outerVar);
    console.log(globalVar);
  }

  innerFunction();
}

outerFunction();
```

Output:

```text
Inner
Outer
Global
```

The inner function can access:

- its own variables
- variables from the outer function
- variables from the global scope

This works because of where `innerFunction` is written.

It is written inside `outerFunction`, so it has access to `outerFunction`'s scope.

## Scope Lookup

When JavaScript sees a variable name, it looks for that variable in a specific order.

```js
const value = "global";

function outer() {
  const value = "outer";

  function inner() {
    const value = "inner";
    console.log(value);
  }

  inner();
}

outer(); // inner
```

JavaScript starts in the current scope.

In this case, the current scope is `inner`.

It finds `value` there, so it stops searching.

If the inner `value` did not exist, JavaScript would look in the outer scope:

```js
const value = "global";

function outer() {
  const value = "outer";

  function inner() {
    console.log(value);
  }

  inner();
}

outer(); // outer
```

If the outer `value` did not exist either, JavaScript would look in the global scope:

```js
const value = "global";

function outer() {
  function inner() {
    console.log(value);
  }

  inner();
}

outer(); // global
```

This chain is often called the **scope chain**.

## Inner Scope Can Look Out

Inner scopes can access outer scopes.

```js
const appName = "DailyCoder";

function showAppName() {
  console.log(appName);
}

showAppName(); // DailyCoder
```

The function can look outward and find `appName`.

This also works with nested functions:

```js
function createMessage() {
  const prefix = "Status:";

  function formatMessage(text) {
    return `${prefix} ${text}`;
  }

  return formatMessage("Ready");
}

console.log(createMessage()); // Status: Ready
```

The inner function `formatMessage` can access `prefix` from the outer function.

## Outer Scope Cannot Look In

Outer scopes cannot access variables from inner scopes.

```js
function outerFunction() {
  function innerFunction() {
    const innerMessage = "Inside";
    console.log(innerMessage);
  }

  innerFunction();

  console.log(innerMessage); // ReferenceError
}

outerFunction();
```

The variable `innerMessage` belongs to `innerFunction`.

The outer function cannot access it.

Scope access moves outward, not inward.

You can remember it this way:

```text
Inner scopes can look up.
Outer scopes cannot look down.
```

## Lexical Scope Is Based on Where Code Is Written

This example shows why lexical scope matters:

```js
const message = "global";

function printMessage() {
  console.log(message);
}

function run() {
  const message = "local";
  printMessage();
}

run(); // global
```

Even though `printMessage()` is called inside `run()`, it does not use `run`'s `message`.

Why?

Because `printMessage` was written in the global scope, not inside `run`.

Its scope is determined by where it was created.

It can access the global `message`, not the local `message` inside `run`.

This is lexical scope.

## Scope and `ReferenceError`

When JavaScript cannot find a variable in the scope chain, it throws a `ReferenceError`.

```js
function showTotal() {
  const total = 100;
}

console.log(total); // ReferenceError
```

JavaScript looks for `total`:

1. in the current scope
2. then in outer scopes
3. then in the global scope

If it still cannot find the variable, the code fails.

This error usually means:

- the variable was declared in a different scope
- the variable name is misspelled
- the variable is being used before it exists

## Scope and Closures

Lexical scope is the foundation for closures.

You do not need to master closures yet, but the basic idea starts here:

```js
function outer() {
  const message = "Remember me";

  function inner() {
    console.log(message);
  }

  return inner;
}

const savedFunction = outer();
savedFunction(); // Remember me
```

The inner function can still access `message` even after `outer()` has finished.

That behavior is called a closure.

You will explore it in detail later in this module.

For now, remember this:

```text
Closures are possible because inner functions can access variables from outer functions.
```

## Best Practices

Create variables in the smallest scope where they are needed:

```js
function calculateTotal(price, quantity) {
  const subtotal = price * quantity;
  const tax = subtotal * 0.08;

  return subtotal + tax;
}
```

Avoid unnecessary global variables:

```js
// Avoid this when the value is only needed by one function
let subtotal;

function calculateTotal(price, quantity) {
  subtotal = price * quantity;
  return subtotal;
}
```

Prefer local variables:

```js
function calculateTotal(price, quantity) {
  const subtotal = price * quantity;
  return subtotal;
}
```

Use functions to create private workspaces:

```js
function buildUsername(firstName, lastName) {
  const normalizedFirst = firstName.trim().toLowerCase();
  const normalizedLast = lastName.trim().toLowerCase();

  return `${normalizedFirst}.${normalizedLast}`;
}
```

Be careful with shared state:

```js
let count = 0;

function increment() {
  count += 1;
  return count;
}
```

This can be useful, but because `count` lives outside the function, other code may also change it.

## Common Mistakes

### Mistake 1: Trying to Use a Function Variable Outside the Function

```js
function createUser() {
  const username = "Alice";
}

console.log(username); // ReferenceError
```

The variable `username` only exists inside `createUser`.

If you need the value outside, return it:

```js
function createUser() {
  const username = "Alice";
  return username;
}

console.log(createUser()); // Alice
```

### Mistake 2: Using Too Many Global Variables

```js
let price = 100;
let quantity = 2;
let tax = 16;

function calculateTotal() {
  return price * quantity + tax;
}
```

This function depends on global variables.

It is harder to reuse and test.

A better version uses parameters and local variables:

```js
function calculateTotal(price, quantity) {
  const subtotal = price * quantity;
  const tax = subtotal * 0.08;

  return subtotal + tax;
}
```

### Mistake 3: Thinking Scope Depends on Where a Function Is Called

```js
const color = "blue";

function showColor() {
  console.log(color);
}

function run() {
  const color = "red";
  showColor();
}

run(); // blue
```

The function `showColor` uses the scope where it was written.

It does not use the scope where it was called.

### Mistake 4: Overusing Shadowing

```js
const user = "Global user";

function showUser() {
  const user = "Function user";
  console.log(user);
}
```

This is valid, but repeated shadowing can make code harder to read.

Use clearer names when it helps:

```js
const defaultUser = "Global user";

function showUser() {
  const currentUser = "Function user";
  console.log(currentUser);
}
```

## Quick Check

What does this log?

```js
const message = "Global";

function showMessage() {
  console.log(message);
}

showMessage();
```

It logs:

```text
Global
```

The function can access variables from the outer global scope.

What happens here?

```js
function createMessage() {
  const message = "Inside";
}

console.log(message);
```

It throws a `ReferenceError`.

The variable `message` only exists inside the function.

What does this log?

```js
const value = "global";

function outer() {
  const value = "outer";

  function inner() {
    console.log(value);
  }

  inner();
}

outer();
```

It logs:

```text
outer
```

The inner function uses the closest available `value`, which is in `outer`.

## Summary

Scope controls where variables can be accessed.

- **Global scope** is outside functions and can be accessed from many places.
- Global variables should be used carefully because they can cause conflicts and accidental changes.
- **Function scope** keeps variables inside a function.
- Parameters are function-scoped too.
- Inner functions can access variables from outer functions.
- Outer functions cannot access variables declared inside inner functions.
- JavaScript uses lexical scope, which means scope is based on where functions are written.
- Lexical scope is the foundation for closures.
