# Closures

Closures are often described as one of the most difficult JavaScript concepts.

They can sound mysterious at first, but they are built on something you already learned: **lexical scope**.

If you understand that an inner function can access variables from an outer function, you are already close to understanding closures.

## What Is a Closure?

A **closure** is created when a function remembers variables from the scope where it was created.

This can happen even after the outer function has finished running.

Here is the core idea:

```js
function outer() {
  const message = "Hello from outer";

  function inner() {
    console.log(message);
  }

  return inner;
}

const savedFunction = outer();

savedFunction(); // Hello from outer
```

The `outer()` function has already finished.

But `savedFunction()` can still access `message`.

That is a closure.

## Why This Works

When JavaScript creates a function, it remembers the surrounding lexical environment.

That means the function keeps access to the variables that were in scope when the function was created.

In this example:

```js
function outer() {
  const message = "Hello from outer";

  function inner() {
    console.log(message);
  }

  return inner;
}
```

The function `inner` is created inside `outer`.

So `inner` has access to:

- its own scope
- the scope of `outer`
- the global scope

When `outer` returns `inner`, the inner function does not forget where it came from.

It still has access to `message`.

## A Simple Closure

Start with a small example:

```js
function createGreeter(name) {
  return function () {
    return `Hello, ${name}!`;
  };
}

const greetAlice = createGreeter("Alice");

console.log(greetAlice()); // Hello, Alice!
```

Step by step:

1. `createGreeter("Alice")` is called.
2. The parameter `name` receives `"Alice"`.
3. The function returns an inner function.
4. That inner function remembers `name`.
5. `greetAlice()` runs later and still uses `"Alice"`.

The inner function closes over the `name` variable.

That is why it can use `name` after `createGreeter` has finished.

## The Classic Counter Example

The most common closure example is a counter.

```js
function createCounter() {
  let count = 0;

  return function () {
    count++;
    return count;
  };
}

const counter = createCounter();

console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
```

The variable `count` is declared inside `createCounter`.

Normally, you might expect it to disappear after `createCounter()` finishes.

But the returned inner function still uses `count`.

So JavaScript keeps `count` alive as long as the returned function can still be called.

## The Counter Step by Step

Look closely at this line:

```js
const counter = createCounter();
```

This calls `createCounter`.

Inside `createCounter`, JavaScript creates:

```js
let count = 0;
```

Then `createCounter` returns this function:

```js
function () {
  count++;
  return count;
}
```

That returned function is stored in `counter`.

Now every time you call:

```js
counter();
```

the same preserved `count` variable is updated.

The variable is not reset to `0` each time.

That is why the output is:

```text
1
2
3
```

## Each Closure Can Have Its Own State

Every call to the outer function creates a new lexical environment.

```js
function createCounter() {
  let count = 0;

  return function () {
    count++;
    return count;
  };
}

const firstCounter = createCounter();
const secondCounter = createCounter();

console.log(firstCounter()); // 1
console.log(firstCounter()); // 2

console.log(secondCounter()); // 1
console.log(secondCounter()); // 2
```

`firstCounter` and `secondCounter` do not share the same `count`.

Each call to `createCounter()` creates a separate `count` variable.

Each returned function remembers its own version.

## Closures Preserve Variables, Not Just Values

A closure remembers the variable itself, not just a snapshot of its first value.

```js
function createCounter() {
  let count = 0;

  return function () {
    count++;
    return count;
  };
}
```

The inner function can both read and update `count`.

That is why this works:

```js
console.log(counter()); // 1
console.log(counter()); // 2
```

If closures only captured the original value, `count` would always be `0`.

Instead, the function keeps access to the live variable.

## Data Privacy With Closures

Closures can hide data from the outside world.

```js
function createBankAccount(initialBalance) {
  let balance = initialBalance;

  return {
    deposit(amount) {
      balance += amount;
      return balance;
    },
    withdraw(amount) {
      if (amount > balance) {
        return "Insufficient funds";
      }

      balance -= amount;
      return balance;
    },
    getBalance() {
      return balance;
    },
  };
}

const account = createBankAccount(100);

console.log(account.deposit(50)); // 150
console.log(account.withdraw(30)); // 120
console.log(account.getBalance()); // 120
console.log(account.balance); // undefined
```

The variable `balance` is private.

Code outside `createBankAccount` cannot access it directly.

The only way to interact with `balance` is through the methods returned from the function.

Those methods form closures over `balance`.

## Why Privacy Matters

Without closures, you might store balance directly on an object:

```js
const account = {
  balance: 100,
};

account.balance = -999;
```

Any code can change it to an invalid value.

With a closure, you can control how the value changes:

```js
function createBankAccount(initialBalance) {
  let balance = initialBalance;

  return {
    deposit(amount) {
      if (amount <= 0) {
        return "Invalid deposit";
      }

      balance += amount;
      return balance;
    },
    getBalance() {
      return balance;
    },
  };
}
```

The private variable is protected by the functions that close over it.

## Function Factories

A **function factory** is a function that creates and returns another function.

Closures make function factories useful.

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

The `double` function remembers `multiplier` as `2`.

The `triple` function remembers `multiplier` as `3`.

Each returned function has its own closure.

## Creating Specialized Functions

Closures are useful when you want to configure a function once and use it many times.

```js
function createFormatter(prefix) {
  return function (value) {
    return `${prefix}: ${value}`;
  };
}

const formatError = createFormatter("Error");
const formatWarning = createFormatter("Warning");

console.log(formatError("File not found")); // Error: File not found
console.log(formatWarning("Low storage")); // Warning: Low storage
```

The returned functions remember different `prefix` values.

This pattern keeps repeated logic in one place.

## Closures in Event Handlers

Closures are common in browser event handlers.

```js
function setupButton() {
  let clickCount = 0;

  const button = document.getElementById("myButton");

  button.addEventListener("click", function () {
    clickCount++;
    console.log(`Button clicked ${clickCount} times`);
  });
}

setupButton();
```

The click handler is created inside `setupButton`.

It remembers `clickCount`.

Even after `setupButton()` finishes, the event handler can still update `clickCount` when the button is clicked.

That is closure behavior.

## Closures in Timers

Closures also appear with timers.

```js
function remindLater(message, delay) {
  setTimeout(function () {
    console.log(message);
  }, delay);
}

remindLater("Take a break", 1000);
```

The callback passed to `setTimeout` remembers `message`.

When the timer runs later, the outer function has already finished.

But the callback still has access to `message`.

## The Loop Gotcha With `var`

Closures and loops used to cause many bugs with `var`.

```js
for (var i = 1; i <= 3; i++) {
  setTimeout(function () {
    console.log(i);
  }, 1000);
}
```

You might expect:

```text
1
2
3
```

But this logs:

```text
4
4
4
```

Why?

`var` is function-scoped, not block-scoped.

All three callbacks close over the same `i` variable.

By the time the callbacks run, the loop has finished and `i` is `4`.

## The Loop Fix With `let`

Use `let` for loop counters.

```js
for (let i = 1; i <= 3; i++) {
  setTimeout(function () {
    console.log(i);
  }, 1000);
}
```

This logs:

```text
1
2
3
```

With `let`, each loop iteration gets its own block-scoped `i`.

Each callback closes over a different `i`.

This is one of the reasons `let` is safer than `var` in loops.

## Closures and Memory

Closures keep outer variables alive as long as the inner function can still use them.

This is usually exactly what you want.

```js
function createCounter() {
  let count = 0;

  return function () {
    count++;
    return count;
  };
}
```

The returned function needs `count`, so JavaScript keeps `count`.

But this also means you should avoid keeping large data in closures longer than necessary.

```js
function createProcessor() {
  const hugeList = new Array(1000000).fill("data");

  return function () {
    return hugeList.length;
  };
}

const processor = createProcessor();
```

As long as `processor` exists, `hugeList` may stay in memory.

This does not mean closures are bad.

It means closures preserve state, so you should use that power intentionally.

## Closure vs Global Variable

Closures often give you a safer alternative to global variables.

Global state:

```js
let count = 0;

function increment() {
  count++;
  return count;
}
```

Any code can change `count`.

Closure state:

```js
function createCounter() {
  let count = 0;

  return function () {
    count++;
    return count;
  };
}

const increment = createCounter();
```

Now `count` is private to the closure.

Only the returned function can update it.

## Closures Are Not Copies of Everything

A closure does not copy every variable from the outer scope in a way you manually control.

It keeps access to the variables it needs from the lexical environment.

```js
function createLogger(prefix) {
  const unusedValue = "not used";

  return function (message) {
    console.log(`${prefix}: ${message}`);
  };
}
```

The returned function uses `prefix`.

It does not use `unusedValue`.

JavaScript engines are optimized to manage this efficiently.

The important concept is not memory implementation details.

The important concept is:

```text
The inner function can still access outer variables it uses.
```

## Best Practices

Use closures when you need private state:

```js
function createCounter() {
  let count = 0;

  return function () {
    count++;
    return count;
  };
}
```

Use closures to create specialized functions:

```js
function makeMultiplier(multiplier) {
  return function (number) {
    return number * multiplier;
  };
}
```

Use `let` and `const` in loops:

```js
for (let i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log(i);
  }, 1000);
}
```

Avoid using closures when simple parameters would be clearer:

```js
function calculateTotal(price, taxRate) {
  return price + price * taxRate;
}
```

Do not hide state in a closure if other developers need to inspect or update it directly.

Closures are useful, but clarity still matters.

## Common Mistakes

### Mistake 1: Thinking the Outer Variable Disappears Immediately

```js
function outer() {
  const message = "Still here";

  return function () {
    return message;
  };
}

const fn = outer();

console.log(fn()); // Still here
```

The `message` variable stays available because the returned function closes over it.

### Mistake 2: Thinking Each `var` Loop Iteration Gets a New Variable

```js
for (var i = 1; i <= 3; i++) {
  setTimeout(function () {
    console.log(i);
  }, 1000);
}
```

All callbacks share the same `i`.

Use `let` instead:

```js
for (let i = 1; i <= 3; i++) {
  setTimeout(function () {
    console.log(i);
  }, 1000);
}
```

### Mistake 3: Exposing Private State Accidentally

```js
function createSettings() {
  const settings = {
    theme: "dark",
  };

  return settings;
}

const settings = createSettings();
settings.theme = "light";
```

This does not keep the object private.

If you return the object itself, outside code can change it.

Return controlled methods instead:

```js
function createSettings() {
  const settings = {
    theme: "dark",
  };

  return {
    getTheme() {
      return settings.theme;
    },
  };
}
```

### Mistake 4: Making Closures Too Complicated

```js
function createA(a) {
  return function createB(b) {
    return function createC(c) {
      return function createD(d) {
        return a + b + c + d;
      };
    };
  };
}
```

This is valid JavaScript, but it can be hard to read.

Use closures when they make code clearer, not just because they are possible.

## Quick Check

What does this log?

```js
function createGreeting(name) {
  return function () {
    return `Hello, ${name}`;
  };
}

const greetMira = createGreeting("Mira");

console.log(greetMira());
```

It logs:

```text
Hello, Mira
```

The returned function remembers `name`.

What does this log?

```js
function createCounter() {
  let count = 0;

  return function () {
    count++;
    return count;
  };
}

const counter = createCounter();

console.log(counter());
console.log(counter());
```

It logs:

```text
1
2
```

Both calls use the same preserved `count` variable.

What does this log?

```js
const first = createCounter();
const second = createCounter();

console.log(first());
console.log(first());
console.log(second());
```

It logs:

```text
1
2
1
```

Each call to `createCounter()` creates a separate closure with its own `count`.

## Summary

A closure is a function that remembers variables from the scope where it was created.

- Closures are based on lexical scope.
- Inner functions can remember outer variables even after the outer function returns.
- Closures preserve variables, not just one-time value snapshots.
- Each call to an outer function can create a separate closure.
- Closures are useful for private state, function factories, event handlers, and timers.
- `let` helps avoid classic closure bugs in loops.
- Closures keep referenced variables alive, so use them intentionally.
