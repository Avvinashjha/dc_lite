# Immediately Invoked Function Expressions (IIFE)

An **Immediately Invoked Function Expression** is usually called an **IIFE**.

It is pronounced like "iffy."

An IIFE is a function that runs immediately after it is created.

Example:

```js
(function () {
  console.log("This runs immediately!");
})();
```

Unlike a normal function declaration, you do not define it first and call it later.

The function is created and called in the same statement.

## A Normal Function Call

Before looking deeper at IIFEs, compare them with a normal function.

```js
function greet() {
  console.log("Hello!");
}

greet();
```

This happens in two steps:

1. Define the function.
2. Call the function.

An IIFE combines those two steps:

```js
(function () {
  console.log("Hello!");
})();
```

The function runs immediately.

## The IIFE Syntax

An IIFE has two main parts.

First, the function expression:

```js
function () {
  console.log("Hello!");
}
```

Second, the function call:

```js
()
```

Together, they look like this:

```js
(function () {
  console.log("Hello!");
})();
```

The first pair of parentheses wraps the function:

```js
(function () {
  console.log("Hello!");
})
```

The second pair of parentheses calls it:

```js
();
```

You can read the full syntax like this:

```text
Create this function expression, then immediately call it.
```

## Why the First Parentheses Are Needed

This does not work:

```js
function () {
  console.log("Hello!");
}();
```

JavaScript sees the `function` keyword at the start of a statement and expects a function declaration.

But function declarations need a name:

```js
function greet() {
  console.log("Hello!");
}
```

Wrapping the function in parentheses tells JavaScript:

```text
Treat this as an expression.
```

That is why this works:

```js
(function () {
  console.log("Hello!");
})();
```

An IIFE is a function expression that is immediately called.

## IIFE With an Arrow Function

You can also write an IIFE with an arrow function:

```js
(() => {
  console.log("This also runs immediately!");
})();
```

This is the same idea:

1. Create an arrow function.
2. Immediately call it.

Arrow function IIFEs are common in modern JavaScript, especially for short async setup code.

## The Main Use Case: Private Scope

The classic reason for using an IIFE is to create a private scope.

Variables created inside a function are not available outside that function.

```js
(function () {
  const message = "I am private";

  console.log(message); // I am private
})();

console.log(message); // ReferenceError
```

The variable `message` only exists inside the IIFE.

Code outside the IIFE cannot access it.

This helps prevent variables from leaking into the surrounding scope.

## Why Scope Isolation Mattered So Much

Before modern JavaScript modules, websites often loaded many scripts into the same global scope.

Example:

```html
<script src="analytics.js"></script>
<script src="dashboard.js"></script>
<script src="app.js"></script>
```

If each file created global variables with `var`, those variables could accidentally conflict.

For example:

```js
var currentUser = "Alice";
```

If another script also used the same name:

```js
var currentUser = "Guest";
```

One value could overwrite the other.

IIFEs helped solve this problem:

```js
(function () {
  var currentUser = "Alice";

  console.log(currentUser);
})();
```

Now `currentUser` is local to the function.

It does not become a global variable.

## IIFEs and `var`

IIFEs were especially useful with `var`.

`var` is function-scoped, not block-scoped.

This means a block does not create a private scope for `var`:

```js
if (true) {
  var status = "active";
}

console.log(status); // active
```

The `status` variable is still available outside the `if` block.

But a function does create a scope for `var`:

```js
(function () {
  var status = "active";
})();

console.log(status); // ReferenceError
```

This is one reason IIFEs became a common pattern before `let`, `const`, and modules.

## IIFEs With `let` and `const`

Modern JavaScript has `let` and `const`, which are block-scoped.

That means a plain block can create a private scope:

```js
{
  const status = "active";
  console.log(status); // active
}

console.log(status); // ReferenceError
```

Because of this, IIFEs are not needed as often for basic scope isolation.

Still, IIFEs are useful to understand because you will see them in older code and in some modern patterns.

## Passing Arguments to an IIFE

An IIFE is still a function, so it can receive arguments.

```js
const appName = "DailyCoder";

(function (name) {
  console.log(`Initializing ${name}...`);
})(appName);
```

Output:

```text
Initializing DailyCoder...
```

The value `appName` is passed into the IIFE.

Inside the function, it is available through the `name` parameter.

This works just like a normal function call:

```js
function initialize(name) {
  console.log(`Initializing ${name}...`);
}

initialize(appName);
```

The difference is that the IIFE does not leave behind a reusable function name.

It runs once.

## Why Pass Arguments to an IIFE?

Passing arguments into an IIFE can make dependencies clear.

```js
const config = {
  apiUrl: "https://api.example.com",
};

(function (appConfig) {
  console.log(`Using API: ${appConfig.apiUrl}`);
})(config);
```

Inside the IIFE, the code uses `appConfig`.

Outside the IIFE, the original value is named `config`.

This pattern was often used to create shorter local names for global objects:

```js
(function (doc) {
  const title = doc.title;
  console.log(title);
})(document);
```

The global `document` object is passed in and used locally as `doc`.

## Returning a Value From an IIFE

An IIFE can return a value.

```js
const result = (function () {
  const a = 10;
  const b = 20;

  return a + b;
})();

console.log(result); // 30
```

The IIFE runs immediately.

Its return value is stored in `result`.

This is useful when you want to calculate a value using temporary variables without keeping those variables around.

```js
const userRole = (function () {
  const isAdmin = false;
  const isEditor = true;

  if (isAdmin) {
    return "admin";
  }

  if (isEditor) {
    return "editor";
  }

  return "viewer";
})();

console.log(userRole); // editor
```

The variables `isAdmin` and `isEditor` are private to the IIFE.

Only the final result is stored outside.

## Creating Private Data

IIFEs can also be used to create private data and expose only selected behavior.

```js
const counter = (function () {
  let count = 0;

  return {
    increment() {
      count += 1;
      return count;
    },
    getCount() {
      return count;
    },
  };
})();

console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount()); // 2
```

The variable `count` is not directly accessible:

```js
console.log(counter.count); // undefined
```

Only the returned methods can interact with it.

This pattern is closely related to **closures**, which you will study later.

For now, focus on the main idea: an IIFE can create a private scope and return selected values from it.

## Async IIFEs

An IIFE can be `async`.

This is useful when you want to use `await` inside a script or function-like wrapper.

```js
(async function () {
  const response = await fetch("https://api.example.com/data");
  const data = await response.json();

  console.log(data);
})();
```

You can also write it with an arrow function:

```js
(async () => {
  const response = await fetch("https://api.example.com/data");
  const data = await response.json();

  console.log(data);
})();
```

Async IIFEs became popular because older JavaScript did not allow `await` at the top level of a normal script.

Wrapping the code in an async function made `await` available.

Modern JavaScript modules support top-level `await` in many environments, but async IIFEs are still useful and still appear in real code.

## IIFEs vs Modern Modules

Modern JavaScript modules already have their own scope.

In a module file, variables do not automatically become global:

```js
const apiUrl = "https://api.example.com";

export function getApiUrl() {
  return apiUrl;
}
```

Other files can only access what the module explicitly exports.

Because of modules, IIFEs are no longer the main way to keep file-level variables private.

However, IIFEs are still worth knowing because:

- they appear in legacy JavaScript code
- they help explain scope and function expressions
- they are connected to closures and the module pattern
- build tools may wrap generated code in IIFE-like structures
- async IIFEs are still useful in some scripts

## IIFE vs Function Declaration

Compare this function declaration:

```js
function setup() {
  console.log("Setup complete");
}

setup();
```

The name `setup` remains available after the function runs:

```js
setup();
setup();
```

You can call it again.

Now compare an IIFE:

```js
(function () {
  console.log("Setup complete");
})();
```

There is no function name available afterwards.

The function runs once and then is gone.

Use a normal named function when you need to reuse it.

Use an IIFE when you want a one-time function scope.

## IIFE vs Plain Block

In modern JavaScript, a plain block can create scope for `let` and `const`:

```js
{
  const temporaryValue = 42;
  console.log(temporaryValue);
}

console.log(temporaryValue); // ReferenceError
```

So why use an IIFE?

An IIFE can do things a plain block cannot always do as directly:

- return a value into a variable
- create function scope for old `var` code
- use `async` behavior with `await`
- create closures with private state

For simple `let` and `const` scope, a block is often enough.

For a one-time function with return values, async behavior, or private state, an IIFE can still be useful.

## Common IIFE Shapes

You may see IIFEs written in a few styles.

Classic function expression:

```js
(function () {
  console.log("Classic IIFE");
})();
```

Arrow function:

```js
(() => {
  console.log("Arrow IIFE");
})();
```

Async function:

```js
(async function () {
  console.log("Async IIFE");
})();
```

Async arrow function:

```js
(async () => {
  console.log("Async arrow IIFE");
})();
```

The classic function expression is useful to recognize because it appears often in older code.

## Best Practices

Use IIFEs when you need a one-time private scope:

```js
const settings = (function () {
  const environment = "production";

  return {
    environment,
    debug: environment !== "production",
  };
})();
```

Use async IIFEs when your environment does not support top-level `await`:

```js
(async () => {
  const response = await fetch("/api/user");
  const user = await response.json();

  console.log(user);
})();
```

Prefer modules for organizing modern JavaScript files:

```js
// config.js
const apiUrl = "https://api.example.com";

export function getApiUrl() {
  return apiUrl;
}
```

Do not use IIFEs just to make code look clever.

If a named function or module is clearer, use that.

## Common Mistakes

### Mistake 1: Forgetting the Calling Parentheses

```js
(function () {
  console.log("This does not run yet");
});
```

This creates a function expression, but it does not call it.

Correct version:

```js
(function () {
  console.log("This runs immediately");
})();
```

The final `()` calls the function.

### Mistake 2: Forgetting the Wrapping Parentheses

```js
function () {
  console.log("Hello");
}();
```

This is invalid syntax because JavaScript expects a function declaration, and declarations need names.

Correct version:

```js
(function () {
  console.log("Hello");
})();
```

### Mistake 3: Using an IIFE When a Reusable Function Is Needed

```js
(function () {
  console.log("Saving user");
})();
```

This runs once.

If you need to save a user multiple times, use a named function:

```js
function saveUser() {
  console.log("Saving user");
}

saveUser();
saveUser();
```

### Mistake 4: Thinking an IIFE Makes Everything Private Forever

An IIFE creates a private scope, but anything you return can still be used outside.

```js
const data = (function () {
  const privateMessage = "Hidden";

  return {
    message: privateMessage,
  };
})();

console.log(data.message); // Hidden
```

The variable `privateMessage` is private, but the returned object is public.

Be careful about what you return.

## Quick Check

What does this code log?

```js
(function () {
  const message = "Hello from inside";
  console.log(message);
})();
```

It logs:

```text
Hello from inside
```

The function runs immediately.

What happens here?

```js
(function () {
  const secret = "private";
})();

console.log(secret);
```

It throws a `ReferenceError`.

The variable `secret` only exists inside the IIFE.

What does this return?

```js
const total = (function () {
  const price = 100;
  const tax = 8;

  return price + tax;
})();
```

It stores this value in `total`:

```js
108
```

## Summary

An IIFE is a function expression that runs immediately.

- IIFE stands for **Immediately Invoked Function Expression**.
- The common syntax is `(function () { ... })();`.
- The first parentheses make the function an expression.
- The final parentheses call the function.
- IIFEs create private scope.
- IIFEs were especially useful before `let`, `const`, and ES modules.
- You can pass arguments into an IIFE and return values from it.
- Async IIFEs are still useful in environments without top-level `await`.
- Modern modules reduce the need for IIFEs, but the pattern is still important to recognize.
