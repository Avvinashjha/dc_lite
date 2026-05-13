# Introduction to Functions

A **function** is a named, reusable block of code that performs a specific task. Functions are the fundamental building blocks of every JavaScript program — whenever you find yourself repeating the same logic, a function is almost always the right answer.

## Why do we need functions?

Imagine you want to greet three users. Without a function you might write:

```javascript
console.log("Hello, Alice! Welcome back.");
console.log("Hello, Bob! Welcome back.");
console.log("Hello, Carol! Welcome back.");
```

If the greeting changes (say, we want to add an emoji), you must edit the string in three places — and miss one, and you have a bug. Functions fix this:

```javascript
function greet(name) {
  console.log(`Hello, ${name}! Welcome back.`);
}

greet("Alice");
greet("Bob");
greet("Carol");
```

Now the greeting lives in **one place**. Change it once, all callers see the new behavior.

Functions give you four superpowers:

1. **Reusability** — write once, call everywhere.
2. **Abstraction** — name a chunk of logic so readers understand intent without reading every line.
3. **Testability** — a small named function is easy to test in isolation.
4. **Composition** — build big programs by combining small functions.

## Anatomy of a function

Every JavaScript function has four parts:

```text
           name        parameters
            │              │
            ▼              ▼
    function  addTwo ( a , b )  {
       return a + b;            ◀─ body
    }
```

| Part        | Purpose                                                             |
| ----------- | ------------------------------------------------------------------- |
| `function`  | Keyword that declares a function.                                   |
| Name        | Identifier you use to call the function (here, `addTwo`).           |
| Parameters  | Named inputs the function receives (here, `a` and `b`).             |
| Body        | Statements executed when the function is called.                    |
| `return`    | Optional. Produces an output value.                                 |

## Defining vs. calling

Defining a function is not the same as running it. Defining is like writing a recipe; calling is cooking it.

```javascript
function addTwo(a, b) {
  return a + b;
}

addTwo(2, 3);
```

`addTwo` on its own is just the recipe. The parentheses `addTwo(2, 3)` are what actually runs the body with `a = 2` and `b = 3`. Forgetting the parentheses is one of the most common beginner mistakes:

```javascript
console.log(addTwo);       // prints the function itself
console.log(addTwo(2, 3)); // prints 5
```

## A slightly larger example

Say we are building a shopping cart and need a subtotal that applies a discount:

```javascript
function subtotal(price, quantity, discountPercent) {
  const gross = price * quantity;
  const discount = gross * (discountPercent / 100);
  return gross - discount;
}

console.log(subtotal(199, 2, 10)); // 358.2
```

Notice how the function reads like a sentence: "subtotal of this price, this quantity, with this discount". That is abstraction working for you.

## Rules of thumb

- **One function, one job.** If you find yourself writing "and" in the function name (`saveUserAndSendEmail`), split it.
- **Short names, clear verbs.** `sum`, `getUser`, `isValidEmail`. Prefer verbs for actions and `is`/`has` prefixes for booleans.
- **Return, don't `console.log`.** Returning lets callers decide what to do with the result. Logging hard-codes a decision.

:::quiz
question: You need to greet 20 users the same way. Which approach best applies the idea behind functions?
options:
  - Copy the greeting line 20 times and change only the name each time.
  - Write the greeting logic once inside a function and call it for each user.
  - Ask the user to type their own greeting.
  - Store the greeting in a variable and reassign it before each call.
answer: 1
explanation: Functions let you write the logic once and reuse it. If the greeting ever changes, you edit one place instead of twenty.
:::

:::quiz
question: What is the difference between `greet` and `greet()` in JavaScript?
options:
  - They are identical.
  - `greet` renames the function; `greet()` deletes it.
  - `greet` refers to the function itself (a value); `greet()` calls it and runs the body.
  - `greet()` only works inside a class.
answer: 2
explanation: A function is a value you can pass around by its name. Adding parentheses `()` invokes it — that is what actually executes the body.
:::

:::exercise
title: Refactor into a function
description: You have three lines printing a farewell for three users. Extract a function `farewell(name)` that prints `"Goodbye, <name>!"` and call it three times to produce the same output.
starterCode: |
  console.log("Goodbye, Alice!");
  console.log("Goodbye, Bob!");
  console.log("Goodbye, Carol!");

  // Your refactor here:
  // function farewell(name) { ... }
  // farewell("Alice");
  // farewell("Bob");
  // farewell("Carol");
:::

## Where to go next

You now know what a function is and why it exists. In the next lesson we look inside the function: how **parameters** receive values, how **`return`** produces them, and how **scope** decides where variables are visible.

## Practice

- [Two Sum](/problems/two-sum) — write your first multi-line function with a clear return value.
- [Reverse Integer](/problems/reverse-integer) — practice wrapping a step-by-step transformation into one reusable function.
