# Function Expressions, Arrows, and Closures

JavaScript gives you several ways to create a function, and they are not interchangeable. Knowing which form to reach for — and understanding **closures**, the quiet feature that powers most modern JavaScript patterns — separates beginners from fluent developers.

## Three ways to create a function

### 1. Function declaration

```javascript
function square(n) {
  return n * n;
}
```

Declarations are **hoisted**: you can call `square(...)` on a line above its definition. They also get a friendly name in stack traces.

### 2. Function expression

A function on the right-hand side of an assignment:

```javascript
const square = function (n) {
  return n * n;
};
```

Expressions are **not** hoisted — the variable is, but its value is `undefined` until this line runs. They are useful when you want to treat a function purely as a value.

### 3. Arrow function

```javascript
const square = (n) => n * n;
```

Arrows are compact and great for short transformations. Two rules make them distinct:

- If the body is a single expression, you can omit `{}` and `return`.
- Arrows **do not have their own `this`** (or `arguments`). They inherit `this` from the surrounding scope.

```javascript
const double   = n => n * 2;         // 1 param, no parens needed
const add      = (a, b) => a + b;    // multiple params need parens
const describe = n => {              // block body needs explicit return
  const label = n >= 0 ? "positive" : "negative";
  return `${n} is ${label}`;
};
```

## When to pick which

| Situation                                         | Best form             |
| ------------------------------------------------- | --------------------- |
| A top-level named utility                         | Function declaration  |
| A short callback (`map`, `filter`, event handler) | Arrow function        |
| A method that needs its own `this`                | `function` expression |
| You want hoisting so order of definition is free  | Function declaration  |

A very common beginner mistake is using an arrow as an object method and expecting `this` to refer to the object:

```javascript
const user = {
  name: "Alice",
  sayHi: () => console.log(`Hi, ${this.name}`), // ❌ this is NOT user
};

user.sayHi(); // "Hi, undefined"
```

Fix it with a regular function:

```javascript
const user = {
  name: "Alice",
  sayHi() { console.log(`Hi, ${this.name}`); }, // ✅
};

user.sayHi(); // "Hi, Alice"
```

## Functions are values

This is the single most important idea in this lesson. A function in JavaScript is a **first-class value** — you can:

- Assign it to a variable.
- Pass it as an argument to another function.
- Return it from a function.
- Store it in an array or object.

```javascript
const operations = {
  add: (a, b) => a + b,
  mul: (a, b) => a * b,
};

function apply(op, a, b) {
  return op(a, b); // op is a function we received
}

apply(operations.add, 2, 3); // 5
apply(operations.mul, 2, 3); // 6
```

We explore this further in the next lesson on higher-order functions.

## Closures

A **closure** is a function that "remembers" the variables that were in scope when it was created — even after the outer function has finished running.

### The classic counter

```javascript
function makeCounter() {
  let count = 0;          // lives in makeCounter's scope

  return function () {    // this inner function "closes over" count
    count += 1;
    return count;
  };
}

const counter = makeCounter();
counter(); // 1
counter(); // 2
counter(); // 3
```

`count` is not a global, yet it survives across calls. Why? The returned function keeps a reference to the scope in which it was created. JavaScript's garbage collector sees that `count` is still reachable via that function and keeps it alive.

Visually:

```text
makeCounter() is called
  ┌──────────────────────────┐
  │ scope: { count: 0 }      │◀── the returned function
  │                          │     holds a reference to
  │ returns: function {      │     this scope
  │   count += 1;            │
  │   return count;          │
  │ }                        │
  └──────────────────────────┘

After makeCounter returns, the scope stays alive because
`counter` still refers to the inner function that uses `count`.
```

### Why closures matter

Closures let you:

1. **Create private state** — `count` above is not reachable from outside `counter()`.
2. **Build factories** — produce specialized functions:

```javascript
function makeMultiplier(factor) {
  return n => n * factor; // arrow closes over `factor`
}

const double = makeMultiplier(2);
const triple = makeMultiplier(3);

double(10); // 20
triple(10); // 30
```

3. **Remember configuration** — a common pattern in APIs, middleware, and event handlers.

### A common pitfall: closures in loops

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// prints 3, 3, 3 — all share the same `i`
```

Fix with `let` (per-iteration block scope):

```javascript
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// prints 0, 1, 2 — each arrow closes over its own `i`
```

This is a real-world reason to prefer `let` over `var`.

:::quiz
question: Which statement about arrow functions is TRUE?
options:
  - Arrow functions have their own `this` binding like regular functions.
  - Arrow functions are hoisted to the top of their scope like function declarations.
  - Arrow functions inherit `this` from the surrounding scope and are great for short callbacks.
  - Arrow functions cannot take any parameters.
answer: 2
explanation: Arrows do not bind their own `this` or `arguments`; they inherit `this` from the enclosing lexical scope. That is why they are ideal for short callbacks and bad as object methods that need `this`.
:::

:::quiz
question: `makeGreeter(g)` returns `name => g + ", " + name`. After `const hello = makeGreeter("Hello"); const hola = makeGreeter("Hola");` what does `hello("Alice")` return?
options:
  - "Hola, Alice"
  - "Hello, Alice"
  - undefined
  - A TypeError, because `g` no longer exists.
answer: 1
explanation: Each returned arrow closes over its own copy of `g`. `hello` remembers `"Hello"` and `hola` remembers `"Hola"`, so `hello("Alice")` is `"Hello, Alice"`.
:::

:::exercise
title: Build `once(fn)`
description: Implement a function `once(fn)` that takes a function and returns a new function which calls `fn` the first time it is invoked and returns the cached result on every subsequent call. Use a closure — no globals allowed.
starterCode: |
  function once(fn) {
    // Hint: capture `called` and `result` in an outer scope.
  }

  const init = once(() => {
    console.log("initializing...");
    return 42;
  });

  console.log(init()); // "initializing..." then 42
  console.log(init()); // 42   (no log this time)
  console.log(init()); // 42
:::

## Key takeaways

- Declarations are hoisted and named; expressions are values; arrows are compact and inherit `this`.
- Functions in JavaScript are **first-class values** — treat them like numbers or strings.
- A closure is a function bundled with the variables it captured. Use closures to build private state and factory functions.
- Prefer `let`/`const` over `var`, especially in loops with callbacks.

## Practice

- [Two Sum](/problems/two-sum) — try both a function declaration and an arrow version.
- [Reverse Integer](/problems/reverse-integer) — practice arrow functions for compact transformations.
