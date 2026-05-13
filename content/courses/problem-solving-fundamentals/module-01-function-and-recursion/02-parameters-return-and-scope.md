# Parameters, Return Values, and Scope

A function's real power comes from three ideas working together: **parameters** (how data enters), **return values** (how data leaves), and **scope** (where names are visible). Get these right and your code becomes predictable.

## Parameters vs. arguments

These two words are often used interchangeably, but they mean different things:

- **Parameters** are the names listed in the function definition — the placeholders.
- **Arguments** are the actual values you pass when you call the function.

```javascript
function multiply(a, b) { // a and b are parameters
  return a * b;
}

multiply(4, 5); // 4 and 5 are arguments
```

### Default parameters

If a caller forgets to pass a value, the parameter is `undefined`. Default values fix that:

```javascript
function greet(name = "friend") {
  return `Hello, ${name}!`;
}

greet();         // "Hello, friend!"
greet("Alice");  // "Hello, Alice!"
```

### Rest parameters

When you do not know how many arguments you will receive, gather them with `...`:

```javascript
function sum(...numbers) {
  let total = 0;
  for (const n of numbers) total += n;
  return total;
}

sum(1, 2, 3);       // 6
sum(1, 2, 3, 4, 5); // 15
```

`numbers` is now a real array, so you can use `for...of`, `.reduce`, `.length`, etc.

## `return`: the output of a function

`return` does two things:

1. Hands a value back to whoever called the function.
2. Stops the function immediately.

```javascript
function abs(n) {
  if (n >= 0) return n;
  return -n;
}

console.log(abs(-7)); // 7
```

If a function has no `return`, it returns `undefined`. That is fine for actions like logging, but for computations **always return a value**.

```javascript
function bad(a, b) { console.log(a + b); }     // returns undefined
function good(a, b) { return a + b; }          // returns the sum

const x = bad(2, 3);   // x is undefined
const y = good(2, 3);  // y is 5
```

### Return, don't mutate (when possible)

Prefer functions that **take input and return output** over functions that silently change something outside. They are easier to reason about:

```javascript
function doubleAll(nums) {
  return nums.map(n => n * 2);
}

const prices = [10, 20, 30];
const doubled = doubleAll(prices);
// prices is unchanged — doubled is the new array
```

## Scope: where variables live

Scope is the set of rules that decides **which variables a piece of code can see**. JavaScript has three scopes you need to know:

1. **Global scope** — declared at the top of a file, visible everywhere.
2. **Function scope** — variables inside a function, only visible inside that function.
3. **Block scope** — `let` and `const` declared inside `{ ... }` are only visible inside that block.

```javascript
const appName = "DailyCoder"; // global

function showUser(user) {
  const greeting = `Welcome to ${appName}`; // can see global

  if (user.isAdmin) {
    const badge = "ADMIN"; // block-scoped
    console.log(greeting, badge);
  }

  // console.log(badge); // ❌ ReferenceError: badge is block-scoped
}

// console.log(greeting); // ❌ ReferenceError: greeting is function-scoped
```

### The scope chain

When JavaScript needs a variable, it looks outward through a **chain of scopes** until it finds one:

```text
┌──────────────────────────────────────┐
│ Global Scope                         │
│   appName                            │
│                                      │
│   ┌──────────────────────────────┐   │
│   │ Function Scope: showUser     │   │
│   │   user, greeting             │   │
│   │                              │   │
│   │   ┌──────────────────────┐   │   │
│   │   │ Block Scope: if(...) │   │   │
│   │   │   badge              │   │   │
│   │   └──────────────────────┘   │   │
│   └──────────────────────────────┘   │
└──────────────────────────────────────┘

Lookup for `appName` from inside the block:
  block → function → global ✅ found
```

A variable in an inner scope can shadow one from an outer scope with the same name — usually a sign to rename.

## `var` vs. `let` vs. `const`

Short version: **never use `var` in new code.**

| Keyword | Scope     | Reassignable? | Redeclarable in same scope? |
| ------- | --------- | ------------- | --------------------------- |
| `var`   | Function  | Yes           | Yes (footgun)               |
| `let`   | Block     | Yes           | No                          |
| `const` | Block     | No            | No                          |

Default to `const`. Switch to `let` only when you truly need to reassign.

## Hoisting (just enough to be safe)

JavaScript "hoists" function **declarations** to the top of their scope, so you can call them before they appear in the source:

```javascript
sayHi();                        // works
function sayHi() { console.log("hi"); }
```

But `let`/`const` variables are in a **temporal dead zone** until their line runs:

```javascript
console.log(count); // ❌ ReferenceError
let count = 5;
```

Rule of thumb: declare variables before you use them, and this never bites you.

:::quiz
question: Which statement about parameters and arguments is correct?
options:
  - Parameters are the values passed at call time; arguments are placeholders.
  - Parameters are placeholders in the function definition; arguments are the actual values at call time.
  - They are exactly the same thing.
  - Only arrow functions have parameters.
answer: 1
explanation: Parameters are names listed in the definition (placeholders). Arguments are the real values supplied when you call the function.
:::

:::quiz
question: Inside `function test()` you write `if (true) { let x = 10; } console.log(x);`. What happens when `test()` runs?
options:
  - It prints 10.
  - It prints undefined.
  - It prints null.
  - It throws a ReferenceError because `x` is block-scoped to the `if`.
answer: 3
explanation: `let` is block-scoped, so `x` only exists inside the `if` block. Reading it outside throws a ReferenceError.
:::

:::quiz
question: Which return behavior is best for a function named `total(items)`?
options:
  - Log the total with `console.log` and return nothing.
  - Mutate a global `window.total` variable.
  - Compute the total and `return` it.
  - Ask the user via `prompt()` and return their input.
answer: 2
explanation: A function that computes a value should return it. Returning keeps the function testable and lets callers decide whether to log, save, or display the result.
:::

:::exercise
title: Build `averageOf`
description: Write a function `averageOf(...nums)` that accepts any number of arguments and returns their arithmetic mean. Return `0` when called with no arguments (so division by zero never happens). All variables must be declared with `const` or `let`, never `var`.
starterCode: |
  function averageOf(...nums) {
    // Handle the empty case, then compute the mean.
  }

  console.log(averageOf(10, 20, 30)); // 20
  console.log(averageOf());           // 0
:::

## Key takeaways

- Parameters are placeholders; arguments are the actual values.
- Prefer pure `return`-style functions over side-effects when possible.
- `let` and `const` are block-scoped. Default to `const`.
- When in doubt, declare variables **before** you use them.

## Practice

- [Two Sum](/problems/two-sum) — design a clean signature and return a value.
- [Reverse Integer](/problems/reverse-integer) — watch out for overflow and early returns.
