# Higher-Order Functions

JavaScript treats functions as values.

That means you can:

- store functions in variables
- pass functions as arguments
- return functions from other functions
- put functions inside arrays or objects

This ability leads to one of the most important patterns in JavaScript: **higher-order functions**.

## What Is a Higher-Order Function?

A **higher-order function** is a function that does at least one of these things:

- takes another function as an argument
- returns another function

Example:

```js
function runTask(task) {
  task();
}

function sayHello() {
  console.log("Hello!");
}

runTask(sayHello); // Hello!
```

`runTask` is a higher-order function because it accepts another function as an argument.

The function passed into `runTask` is called a **callback**.

## Why Higher-Order Functions Matter

Higher-order functions are everywhere in JavaScript.

You use them when working with:

- event listeners
- timers
- array methods like `forEach`, `map`, `filter`, and `reduce`
- custom reusable utilities
- function factories
- asynchronous code

They make JavaScript flexible because behavior can be passed around as data.

Instead of hardcoding what a function should do, you can pass in the behavior you want.

## Functions as Arguments

One of the most common forms of higher-order functions is passing a function as an argument.

```js
function greet(name) {
  console.log(`Hello, ${name}!`);
}

function processUser(name, callback) {
  console.log("Processing user...");
  callback(name);
}

processUser("Alice", greet);
```

Output:

```text
Processing user...
Hello, Alice!
```

Here:

- `greet` is a normal function
- `processUser` is a higher-order function
- `callback` is the parameter that receives a function
- `processUser("Alice", greet)` passes the function itself

Inside `processUser`, this line calls the callback:

```js
callback(name);
```

## What Is a Callback?

A **callback** is a function passed into another function to be called later.

The receiving function decides when to call it.

```js
function afterLogin(username, onSuccess) {
  console.log("Checking login...");
  onSuccess(username);
}

function showDashboard(username) {
  console.log(`Welcome, ${username}`);
}

afterLogin("Mira", showDashboard);
```

Output:

```text
Checking login...
Welcome, Mira
```

The callback is not special syntax.

It is just a function being passed as a value.

## Passing a Function Reference

When you pass a callback, you usually pass the function name without parentheses.

```js
processUser("Alice", greet);
```

This passes the function itself.

Do not write this:

```js
processUser("Alice", greet("Alice"));
```

That calls `greet("Alice")` immediately.

Then it passes the return value of `greet("Alice")` into `processUser`.

If `greet` does not return a function, this is usually a bug.

## Function Reference vs Function Call

This is a critical difference:

| Code | Meaning |
| --- | --- |
| `greet` | The function itself |
| `greet()` | Call the function now |
| `greet("Alice")` | Call the function now with `"Alice"` |

Example:

```js
function greet(name) {
  console.log(`Hello, ${name}!`);
}

function processUser(name, callback) {
  callback(name);
}

processUser("Alice", greet); // Correct
```

Incorrect version:

```js
processUser("Alice", greet("Alice"));
```

This runs `greet("Alice")` immediately.

Because `greet` only logs and does not return a function, the callback value becomes `undefined`.

Then `processUser` tries to call `undefined`:

```js
callback(name);
```

That causes a `TypeError`.

## Anonymous Callback Functions

You do not always need to define a callback separately.

You can pass an anonymous function directly.

```js
function processUser(name, callback) {
  callback(name);
}

processUser("Alice", function (name) {
  console.log(`Hello, ${name}!`);
});
```

This is useful when the callback is short and only used once.

The function has no name because it is used directly as an argument.

## Arrow Function Callbacks

In modern JavaScript, short callbacks are often written as arrow functions.

```js
function processUser(name, callback) {
  callback(name);
}

processUser("Alice", (name) => {
  console.log(`Hello, ${name}!`);
});
```

For very short callbacks, you may see a shorter form:

```js
processUser("Alice", (name) => console.log(`Hello, ${name}!`));
```

Arrow functions are especially common with array methods.

## Array Methods as Higher-Order Functions

Many array methods are higher-order functions because they accept callbacks.

### `forEach`

`forEach` runs a callback once for each item in an array.

```js
const numbers = [1, 2, 3, 4];

numbers.forEach(function (number) {
  console.log(number * 2);
});
```

Output:

```text
2
4
6
8
```

With an arrow function:

```js
numbers.forEach((number) => {
  console.log(number * 2);
});
```

### `filter`

`filter` uses a callback to decide which items to keep.

```js
const ages = [15, 22, 18, 30, 12];

const adults = ages.filter(function (age) {
  return age >= 18;
});

console.log(adults); // [22, 18, 30]
```

The callback returns `true` for items that should stay.

It returns `false` for items that should be removed.

### `map`

`map` uses a callback to transform each item into a new value.

```js
const prices = [10, 20, 30];

const withTax = prices.map(function (price) {
  return price * 1.08;
});

console.log(withTax); // [10.8, 21.6, 32.4]
```

The original array is not changed.

`map` returns a new array.

## Event Listeners Use Callbacks

Browser event listeners are higher-order functions too.

```js
const button = document.getElementById("myButton");

button.addEventListener("click", function (event) {
  console.log("Button was clicked!");
  console.log(event);
});
```

You pass a function to `addEventListener`.

The browser calls that function later when the event happens.

This is why callbacks are so important in JavaScript.

They let you say:

```text
When something happens, run this function.
```

## Timers Use Callbacks

Timers also use callbacks.

```js
setTimeout(function () {
  console.log("This runs later.");
}, 2000);
```

`setTimeout` receives two arguments:

- a callback function
- a delay in milliseconds

The callback runs after the delay.

With an arrow function:

```js
setTimeout(() => {
  console.log("This runs later.");
}, 2000);
```

## Synchronous vs Asynchronous Callbacks

Some callbacks run immediately during the current operation.

These are **synchronous callbacks**.

```js
const numbers = [1, 2, 3];

numbers.forEach((number) => {
  console.log(number);
});

console.log("Done");
```

Output:

```text
1
2
3
Done
```

The `forEach` callback runs before `"Done"` is logged.

Other callbacks run later.

These are **asynchronous callbacks**.

```js
setTimeout(() => {
  console.log("Timer finished");
}, 1000);

console.log("Waiting...");
```

Output:

```text
Waiting...
Timer finished
```

The timer callback runs later, after the current code finishes.

## Returning Functions

Higher-order functions can also return functions.

You saw this with closures.

```js
function makeMultiplier(multiplier) {
  return function (number) {
    return number * multiplier;
  };
}

const double = makeMultiplier(2);
const triple = makeMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

`makeMultiplier` is a higher-order function because it returns another function.

The returned function remembers `multiplier` through closure.

You will study functions as return values in more detail later in this module.

## Custom Higher-Order Function Example

You can write your own higher-order functions.

```js
function repeat(times, action) {
  for (let i = 0; i < times; i++) {
    action(i);
  }
}

repeat(3, function (index) {
  console.log(`Run number ${index + 1}`);
});
```

Output:

```text
Run number 1
Run number 2
Run number 3
```

The `repeat` function does not know what action should happen.

It only knows how many times to run the action.

The caller provides the behavior.

That is the power of higher-order functions.

## Naming Callback Parameters

When you write a function that accepts a callback, choose a clear parameter name.

Generic:

```js
function run(value, fn) {
  return fn(value);
}
```

Clearer:

```js
function processUser(user, onComplete) {
  return onComplete(user);
}
```

Other common callback names:

- `callback`
- `handler`
- `listener`
- `predicate`
- `transform`
- `onSuccess`
- `onError`

The name should communicate what the function is expected to do.

## Extracting Named Callbacks

Inline callbacks are convenient, but long callbacks can make code hard to read.

Harder to read:

```js
const validUsers = users.filter((user) => {
  const hasEmail = user.email.includes("@");
  const isActive = user.status === "active";
  const hasPermission = user.role === "admin" || user.role === "editor";

  return hasEmail && isActive && hasPermission;
});
```

Clearer:

```js
function isValidUser(user) {
  const hasEmail = user.email.includes("@");
  const isActive = user.status === "active";
  const hasPermission = user.role === "admin" || user.role === "editor";

  return hasEmail && isActive && hasPermission;
}

const validUsers = users.filter(isValidUser);
```

The named function explains the purpose of the callback.

It also makes the callback easier to reuse and test.

## Best Practices

Pass the function reference, not the result of calling the function:

```js
processUser("Alice", greet);
```

Use inline callbacks for short, one-time logic:

```js
numbers.map((number) => number * 2);
```

Extract longer callbacks into named functions:

```js
function isAdult(age) {
  return age >= 18;
}

const adults = ages.filter(isAdult);
```

Use clear callback parameter names when writing higher-order functions:

```js
function saveUser(user, onSuccess) {
  // save user
  onSuccess(user);
}
```

Keep higher-order functions focused.

A good higher-order function should make code more flexible, not harder to understand.

## Common Mistakes

### Mistake 1: Calling the Callback Too Early

```js
function greet(name) {
  console.log(`Hello, ${name}`);
}

function processUser(name, callback) {
  callback(name);
}

processUser("Alice", greet("Alice"));
```

This calls `greet("Alice")` immediately.

The correct version passes the function reference:

```js
processUser("Alice", greet);
```

### Mistake 2: Forgetting to Call the Callback Inside the Higher-Order Function

```js
function processUser(name, callback) {
  console.log("Processing user...");
}

processUser("Alice", function (name) {
  console.log(`Hello, ${name}`);
});
```

The callback is passed in, but it never runs.

Correct version:

```js
function processUser(name, callback) {
  console.log("Processing user...");
  callback(name);
}
```

### Mistake 3: Forgetting to Return From Array Callbacks

```js
const ages = [15, 22, 18];

const adults = ages.filter((age) => {
  age >= 18;
});

console.log(adults); // []
```

With braces, arrow functions need an explicit `return`.

Correct version:

```js
const adults = ages.filter((age) => {
  return age >= 18;
});
```

Or use a concise arrow function:

```js
const adults = ages.filter((age) => age >= 18);
```

### Mistake 4: Making Inline Callbacks Too Large

```js
data.map((item) => {
  // many lines of logic
});
```

Large inline callbacks can hide the purpose of the code.

Use a named function when the callback grows:

```js
function transformItem(item) {
  // many lines of logic
}

data.map(transformItem);
```

## Quick Check

What does this code do?

```js
function run(callback) {
  callback();
}

function sayHi() {
  console.log("Hi");
}

run(sayHi);
```

It logs:

```text
Hi
```

`sayHi` is passed as a callback and called inside `run`.

What is the difference between these two?

```js
run(sayHi);
run(sayHi());
```

`run(sayHi)` passes the function itself.

`run(sayHi())` calls `sayHi` immediately and passes its return value.

What does this return?

```js
const numbers = [1, 2, 3];

const doubled = numbers.map((number) => number * 2);
```

It returns:

```js
[2, 4, 6]
```

`map` is a higher-order function because it accepts a callback.

## Summary

Higher-order functions are functions that accept functions, return functions, or both.

- A callback is a function passed as an argument to another function.
- Pass function references without parentheses when you want them called later.
- Anonymous functions and arrow functions are common callback styles.
- Array methods like `forEach`, `map`, and `filter` are higher-order functions.
- Event listeners and timers use callbacks.
- Some callbacks are synchronous; others run later asynchronously.
- Higher-order functions make code flexible by letting callers provide behavior.
