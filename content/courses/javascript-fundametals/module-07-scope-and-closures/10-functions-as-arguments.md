# Functions as Arguments

In the previous lesson, you learned that a **higher-order function** is a function that accepts another function, returns another function, or both.

Now let's zoom in on the first part:

```text
Passing functions as arguments.
```

This is one of the most common JavaScript patterns.

You will see it in:

- event listeners
- timers
- array methods
- async code
- reusable utilities
- framework code

When you pass a function into another function, the passed function is usually called a **callback**.

## Functions Are Values

In JavaScript, functions are values.

That means you can store a function in a variable:

```js
function greet(name) {
  return `Hello, ${name}!`;
}

const greetingFunction = greet;

console.log(greetingFunction("Alice")); // Hello, Alice!
```

Notice this line:

```js
const greetingFunction = greet;
```

There are no parentheses after `greet`.

That means JavaScript stores the function itself in `greetingFunction`.

Because functions are values, they can also be passed as arguments.

## What Is a Callback?

A **callback** is a function passed as an argument to another function.

The receiving function can call the callback whenever it needs to.

Example:

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

Here is what happens:

1. `greet` is defined as a normal function.
2. `processUser` accepts a `name` and a `callback`.
3. `processUser("Alice", greet)` passes the `greet` function into `processUser`.
4. Inside `processUser`, `callback(name)` runs the passed function.

The callback parameter receives the function:

```js
callback
```

Then this line calls it:

```js
callback(name);
```

## Passing the Function, Not Calling It

This is one of the most important callback rules:

```text
Pass the function reference, not the result of calling the function.
```

Correct:

```js
processUser("Alice", greet);
```

Incorrect:

```js
processUser("Alice", greet("Alice"));
```

The difference is:

| Code | Meaning |
| --- | --- |
| `greet` | Pass the function itself |
| `greet()` | Call the function now |
| `greet("Alice")` | Call the function now with `"Alice"` |

If you write this:

```js
processUser("Alice", greet("Alice"));
```

JavaScript runs `greet("Alice")` immediately.

If `greet` does not return another function, the second argument becomes its return value.

In this example, `greet` logs a message but returns `undefined`.

So JavaScript effectively does this:

```js
processUser("Alice", undefined);
```

Then `processUser` tries to call:

```js
callback(name);
```

But `callback` is `undefined`, so the code fails.

## Callback Parameters

A callback can receive arguments from the higher-order function.

```js
function processUser(name, callback) {
  callback(name);
}

function greet(name) {
  console.log(`Hello, ${name}!`);
}

processUser("Mira", greet); // Hello, Mira!
```

The `processUser` function decides what to pass into the callback.

In this case, it passes `name`.

You can pass more than one value:

```js
function calculate(a, b, operation) {
  return operation(a, b);
}

function add(x, y) {
  return x + y;
}

function multiply(x, y) {
  return x * y;
}

console.log(calculate(3, 4, add)); // 7
console.log(calculate(3, 4, multiply)); // 12
```

The same higher-order function can perform different behavior depending on the callback.

## Anonymous Callback Functions

You do not always need to define the callback separately.

You can pass a function directly as an argument.

```js
function processUser(name, callback) {
  callback(name);
}

processUser("Alice", function (name) {
  console.log(`Hello, ${name}!`);
});
```

This function:

```js
function (name) {
  console.log(`Hello, ${name}!`);
}
```

is anonymous because it has no name.

Anonymous callbacks are useful for short, one-time behavior.

## Arrow Function Callbacks

Modern JavaScript often uses arrow functions for short callbacks.

```js
function processUser(name, callback) {
  callback(name);
}

processUser("Alice", (name) => {
  console.log(`Hello, ${name}!`);
});
```

For a single expression, you may see a shorter form:

```js
processUser("Alice", (name) => console.log(`Hello, ${name}!`));
```

Arrow callbacks are common because they are concise.

You will see them constantly with array methods.

## Named Callbacks vs Inline Callbacks

Both styles are valid.

Named callback:

```js
function isAdult(age) {
  return age >= 18;
}

const ages = [12, 18, 24, 15];
const adults = ages.filter(isAdult);

console.log(adults); // [18, 24]
```

Inline callback:

```js
const ages = [12, 18, 24, 15];

const adults = ages.filter((age) => age >= 18);

console.log(adults); // [18, 24]
```

Use an inline callback when the logic is short and obvious.

Use a named callback when the logic is longer, reused, or deserves a clear name.

## Array Methods Use Callbacks

Array methods are some of the most common places to pass functions as arguments.

### `forEach`

`forEach` runs a callback for each item.

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

The callback receives each item one at a time.

## `map` Transforms Values

`map` uses a callback to transform each item into a new value.

```js
const numbers = [1, 2, 3];

const doubled = numbers.map((number) => {
  return number * 2;
});

console.log(doubled); // [2, 4, 6]
```

With concise arrow syntax:

```js
const doubled = numbers.map((number) => number * 2);
```

The callback returns the new value for each item.

`map` returns a new array.

## `filter` Keeps or Removes Values

`filter` uses a callback to decide which items should stay.

```js
const ages = [15, 22, 18, 30, 12];

const adults = ages.filter((age) => {
  return age >= 18;
});

console.log(adults); // [22, 18, 30]
```

The callback should return:

- `true` to keep the item
- `false` to remove the item

Short version:

```js
const adults = ages.filter((age) => age >= 18);
```

## `reduce` Combines Values

`reduce` uses a callback to combine array values into one result.

```js
const numbers = [1, 2, 3, 4];

const total = numbers.reduce((sum, number) => {
  return sum + number;
}, 0);

console.log(total); // 10
```

The callback receives:

- the current accumulated value
- the current item

In this example, `sum` starts at `0`.

Then each number is added to it.

## Event Listeners Use Callbacks

Browser event listeners are built around callbacks.

```js
const button = document.getElementById("myButton");

button.addEventListener("click", function (event) {
  console.log("Button was clicked!");
  console.log(event);
});
```

You pass a function to `addEventListener`.

The browser stores that function and calls it later when the button is clicked.

The callback receives an `event` object with information about what happened.

With an arrow function:

```js
button.addEventListener("click", (event) => {
  console.log("Button was clicked!");
  console.log(event);
});
```

## Timers Use Callbacks

Timers also accept functions as arguments.

```js
setTimeout(() => {
  console.log("This runs after 2 seconds");
}, 2000);
```

The first argument is the callback.

The second argument is the delay in milliseconds.

This code does not pause the entire program.

It schedules the callback to run later.

## Synchronous Callbacks

Some callbacks run immediately during the current operation.

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

The `forEach` callback is synchronous.

It runs before the next line after `forEach`.

## Asynchronous Callbacks

Some callbacks run later.

```js
setTimeout(() => {
  console.log("Timer finished");
}, 1000);

console.log("Waiting");
```

Output:

```text
Waiting
Timer finished
```

The timer callback is asynchronous.

It runs after the current code finishes and the delay has passed.

Callbacks are a foundation for asynchronous JavaScript.

You will study async behavior more deeply later.

## Custom Callback Example

You can write your own functions that accept callbacks.

```js
function repeat(times, action) {
  for (let i = 0; i < times; i++) {
    action(i);
  }
}

repeat(3, (index) => {
  console.log(`Run ${index + 1}`);
});
```

Output:

```text
Run 1
Run 2
Run 3
```

The `repeat` function controls the loop.

The callback controls what happens on each iteration.

This separation makes the function reusable.

## Callback Return Values

Sometimes the higher-order function uses the callback's return value.

Example:

```js
function transform(value, callback) {
  return callback(value);
}

const result = transform(5, (number) => {
  return number * 2;
});

console.log(result); // 10
```

The callback returns `10`.

Then `transform` returns that value.

Array methods like `map`, `filter`, and `reduce` depend on callback return values.

Other APIs, like `forEach` and many event listeners, usually ignore callback return values.

## Naming Callback Parameters

Good callback parameter names make your function easier to understand.

Generic:

```js
function process(value, fn) {
  return fn(value);
}
```

Clearer:

```js
function processUser(user, onComplete) {
  return onComplete(user);
}
```

Useful names include:

- `callback`
- `handler`
- `listener`
- `predicate`
- `transform`
- `onSuccess`
- `onError`
- `onComplete`

Choose a name that explains when or why the callback will run.

## Callback and Closure Together

Callbacks often use closures.

```js
function setupCounterButton(button) {
  let count = 0;

  button.addEventListener("click", () => {
    count++;
    console.log(`Clicked ${count} times`);
  });
}
```

The callback passed to `addEventListener` closes over `count`.

Every time the button is clicked, the callback updates the same preserved variable.

This combines two important ideas:

- functions as arguments
- closures

## Best Practices

Pass a function reference when the receiving function should call it later:

```js
processUser("Alice", greet);
```

Use inline callbacks for short logic:

```js
const names = users.map((user) => user.name);
```

Extract longer callbacks into named functions:

```js
function hasValidEmail(user) {
  return user.email.includes("@");
}

const validUsers = users.filter(hasValidEmail);
```

Use clear callback parameter names:

```js
function saveUser(user, onSuccess) {
  // save user
  onSuccess(user);
}
```

Remember whether the API uses the callback's return value.

For example, `filter` needs a return value:

```js
const adults = ages.filter((age) => age >= 18);
```

But `forEach` is usually used for side effects:

```js
ages.forEach((age) => {
  console.log(age);
});
```

## Common Mistakes

### Mistake 1: Calling the Callback Instead of Passing It

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

Correct version:

```js
processUser("Alice", greet);
```

### Mistake 2: Forgetting to Call the Callback

```js
function processUser(name, callback) {
  console.log("Processing user...");
}

processUser("Alice", (name) => {
  console.log(`Hello, ${name}`);
});
```

The callback is passed in, but never called.

Correct version:

```js
function processUser(name, callback) {
  console.log("Processing user...");
  callback(name);
}
```

### Mistake 3: Forgetting `return` in a `filter` Callback

```js
const ages = [15, 22, 18];

const adults = ages.filter((age) => {
  age >= 18;
});

console.log(adults); // []
```

With braces, an arrow function needs an explicit `return`.

Correct version:

```js
const adults = ages.filter((age) => {
  return age >= 18;
});
```

Or:

```js
const adults = ages.filter((age) => age >= 18);
```

### Mistake 4: Making Inline Callbacks Too Complex

```js
const result = data.map((item) => {
  // many lines of logic
});
```

If the callback grows, extract it:

```js
function transformItem(item) {
  // many lines of logic
}

const result = data.map(transformItem);
```

### Mistake 5: Assuming Every Callback Is Async

```js
[1, 2, 3].forEach((number) => {
  console.log(number);
});

console.log("Done");
```

The callback runs synchronously.

Not all callbacks are async.

Timers and event listeners run later, but array callbacks usually run immediately.

## Quick Check

What does this code log?

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

`sayHi` is passed as a function and called inside `run`.

What is wrong here?

```js
run(sayHi());
```

It calls `sayHi` immediately and passes its return value to `run`.

To pass the function itself, use:

```js
run(sayHi);
```

What does this return?

```js
const numbers = [1, 2, 3];

const doubled = numbers.map((number) => number * 2);
```

It returns:

```js
[2, 4, 6]
```

The callback tells `map` how to transform each number.

## Summary

Passing functions as arguments is one of the most important JavaScript patterns.

- A callback is a function passed into another function.
- Pass a function reference like `greet`, not a function call like `greet()`.
- The receiving function decides when to call the callback.
- Callbacks can be named functions, anonymous functions, or arrow functions.
- Array methods, event listeners, and timers all use callbacks.
- Some callbacks are synchronous, while others run later asynchronously.
- Callback return values matter for methods like `map`, `filter`, and `reduce`.
- Long callbacks are often clearer when extracted into named functions.
