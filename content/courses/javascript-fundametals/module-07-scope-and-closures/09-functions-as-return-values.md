# Functions as Return Values

In the previous lesson, you learned that functions can be passed as arguments.

Now let's look at the other side of higher-order functions:

```text
Functions can return other functions.
```

This is where higher-order functions and closures work together.

When a function returns another function, the returned function can remember values from the outer function.

That makes it possible to create customized functions, private state, reusable setup logic, and more advanced patterns like currying.

## Returning a Function

A function can return any value.

It can return a string:

```js
function getMessage() {
  return "Hello";
}
```

It can return an object:

```js
function createUser() {
  return {
    name: "Alice",
  };
}
```

It can also return another function:

```js
function createGreeter() {
  return function () {
    return "Hello!";
  };
}
```

The returned function is not automatically executed.

It is returned as a value.

You decide when to call it.

## Calling the Returned Function

Here is a complete example:

```js
function createGreeter() {
  return function () {
    return "Hello!";
  };
}

const greet = createGreeter();

console.log(greet()); // Hello!
```

Step by step:

1. `createGreeter()` runs.
2. It returns an inner function.
3. The returned function is stored in `greet`.
4. `greet()` calls that returned function.

This line:

```js
const greet = createGreeter();
```

does not store `"Hello!"`.

It stores the returned function.

Then this line calls that function:

```js
greet();
```

## Calling in One Line

You can also call the returned function immediately:

```js
function createGreeter() {
  return function () {
    return "Hello!";
  };
}

console.log(createGreeter()()); // Hello!
```

This can look strange at first.

Read it from left to right:

```js
createGreeter()
```

returns a function.

Then the second pair of parentheses calls that returned function:

```js
createGreeter()()
```

This pattern is valid, but it can be harder to read.

Usually, storing the returned function in a variable is clearer.

## Returned Functions and Closures

Returned functions are powerful because they can form closures.

```js
function createGreeter(name) {
  return function () {
    return `Hello, ${name}!`;
  };
}

const greetAlice = createGreeter("Alice");
const greetBob = createGreeter("Bob");

console.log(greetAlice()); // Hello, Alice!
console.log(greetBob()); // Hello, Bob!
```

The returned function remembers the `name` parameter from the outer function.

Each call to `createGreeter` creates a separate closure:

- `greetAlice` remembers `"Alice"`
- `greetBob` remembers `"Bob"`

This is the same closure behavior you studied earlier.

## Function Factories

A **function factory** is a function that creates and returns a new function.

Function factories are useful when you want to create specialized functions.

```js
function createTaxCalculator(taxRate) {
  return function (price) {
    return price + price * taxRate;
  };
}

const calculateUsTax = createTaxCalculator(0.08);
const calculateUkTax = createTaxCalculator(0.2);

console.log(calculateUsTax(100)); // 108
console.log(calculateUkTax(100)); // 120
```

`createTaxCalculator` returns a new function.

Each returned function remembers a different `taxRate`.

The benefit is that you configure the tax rate once.

Then you can use the resulting function many times:

```js
console.log(calculateUsTax(50)); // 54
console.log(calculateUsTax(200)); // 216
```

## Creating Specialized Validators

Function factories are useful for validation.

```js
function createMinLengthValidator(minLength) {
  return function (value) {
    return value.length >= minLength;
  };
}

const isValidUsername = createMinLengthValidator(3);
const isValidPassword = createMinLengthValidator(8);

console.log(isValidUsername("Al")); // false
console.log(isValidUsername("Ava")); // true
console.log(isValidPassword("secret")); // false
console.log(isValidPassword("supersecret")); // true
```

The same factory creates different validators.

Each validator remembers its own `minLength`.

## Creating Loggers

You can return functions to create configured loggers.

```js
function createLogger(level) {
  return function logMessage(message) {
    console.log(`[${level}] ${message}`);
  };
}

const logInfo = createLogger("INFO");
const logError = createLogger("ERROR");

logInfo("App started"); // [INFO] App started
logError("Something failed"); // [ERROR] Something failed
```

The returned function is named `logMessage`.

Naming returned functions is optional, but it can help with debugging.

If an error happens, named functions can produce clearer stack traces.

## One-Time Setup Pattern

Sometimes you want to do setup work once, then reuse the result.

```js
function createMessageFormatter() {
  console.log("Initializing formatter...");

  const prefix = "[SYSTEM]";

  return function (message) {
    return `${prefix} ${message.toUpperCase()}`;
  };
}

const format = createMessageFormatter();

console.log(format("hello world")); // [SYSTEM] HELLO WORLD
console.log(format("error 404")); // [SYSTEM] ERROR 404
```

The setup code runs here:

```js
const format = createMessageFormatter();
```

It does not run again when you call:

```js
format("hello world");
format("error 404");
```

The returned function reuses the `prefix` from the closure.

This pattern is helpful when setup is expensive or should happen only once.

## Keeping Configuration Private

Returned functions can keep configuration private.

```js
function createApiUrlBuilder(baseUrl) {
  return function buildUrl(path) {
    return `${baseUrl}/${path}`;
  };
}

const buildApiUrl = createApiUrlBuilder("https://api.example.com");

console.log(buildApiUrl("users")); // https://api.example.com/users
console.log(buildApiUrl("posts")); // https://api.example.com/posts
```

The `baseUrl` is remembered by the returned function.

Callers do not need to pass the base URL every time.

They only pass the changing part:

```js
buildApiUrl("users");
```

## Returning Different Functions

An outer function can return different functions based on a condition.

```js
function createAccessChecker(role) {
  if (role === "admin") {
    return function () {
      return true;
    };
  }

  return function (action) {
    return action !== "delete";
  };
}

const adminCanAccess = createAccessChecker("admin");
const viewerCanAccess = createAccessChecker("viewer");

console.log(adminCanAccess("delete")); // true
console.log(viewerCanAccess("delete")); // false
console.log(viewerCanAccess("read")); // true
```

The returned function depends on the `role`.

This pattern can be useful, but use it carefully.

If too many different functions can be returned, the code may become hard to follow.

## Private State With Returned Functions

You already saw counters in the closure lesson.

They are also examples of functions returning functions.

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
```

The returned function keeps `count` private.

No outside code can directly access `count`.

Only the returned function can update it.

## Returning Multiple Functions

Sometimes an outer function returns an object that contains multiple functions.

```js
function createCounter() {
  let count = 0;

  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    getCount() {
      return count;
    },
  };
}

const counter = createCounter();

console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.decrement()); // 1
console.log(counter.getCount()); // 1
```

This still uses closures.

All returned methods share the same private `count`.

This pattern is common when one returned function is not enough.

## Currying

Returning functions is the foundation of **currying**.

Currying transforms a function that takes multiple arguments into a chain of functions that each take one argument.

Regular function:

```js
function add(a, b) {
  return a + b;
}

console.log(add(5, 3)); // 8
```

Curried function:

```js
function curriedAdd(a) {
  return function (b) {
    return a + b;
  };
}

const addFive = curriedAdd(5);

console.log(addFive(3)); // 8
```

You can also call both steps in one line:

```js
console.log(curriedAdd(5)(3)); // 8
```

The first call:

```js
curriedAdd(5)
```

returns a function that remembers `a` as `5`.

The second call:

```js
(3)
```

passes `3` into the returned function.

## Concise Currying Syntax

You may see currying written with arrow functions:

```js
const curriedAdd = (a) => (b) => a + b;

console.log(curriedAdd(5)(3)); // 8
```

This is concise but can be hard to read at first.

It means:

```js
const curriedAdd = function (a) {
  return function (b) {
    return a + b;
  };
};
```

You do not need to use currying often as a beginner.

But recognizing the pattern will help you understand functional JavaScript code.

## Partial Application

Returning functions can also help you pre-fill part of a function's input.

```js
function createDiscount(discountRate) {
  return function (price) {
    return price - price * discountRate;
  };
}

const applyTenPercentOff = createDiscount(0.1);

console.log(applyTenPercentOff(100)); // 90
console.log(applyTenPercentOff(50)); // 45
```

The discount rate is configured once.

The returned function only needs a price.

This is similar to currying, and you will see both ideas in functional programming.

## Memory Considerations

Returned functions keep their closure variables alive.

This is useful:

```js
function createCounter() {
  let count = 0;

  return function () {
    count++;
    return count;
  };
}
```

The returned function needs `count`, so JavaScript keeps it.

But if the outer function creates a very large value, that value may stay in memory as long as the returned function exists.

```js
function createReader() {
  const largeData = new Array(1000000).fill("data");

  return function () {
    return largeData.length;
  };
}

const reader = createReader();
```

This does not mean returned functions are bad.

It means you should be aware that closures preserve needed variables.

## When to Return a Function

Return a function when you want to:

- create customized behavior
- remember configuration
- preserve private state
- delay execution
- split a task into steps
- create reusable specialized functions

Example:

```js
function createPermissionChecker(requiredRole) {
  return function (user) {
    return user.role === requiredRole;
  };
}

const isAdmin = createPermissionChecker("admin");

console.log(isAdmin({ name: "Ava", role: "admin" })); // true
console.log(isAdmin({ name: "Mia", role: "viewer" })); // false
```

The returned function is easier to use because `requiredRole` is already configured.

## When Not to Return a Function

Do not return a function just to make code look advanced.

This is unnecessarily complex:

```js
function add(a) {
  return function (b) {
    return a + b;
  };
}

console.log(add(2)(3));
```

If you only need simple addition, this is clearer:

```js
function add(a, b) {
  return a + b;
}

console.log(add(2, 3));
```

Returning functions is useful when it simplifies repeated use or preserves meaningful state.

If it makes the code harder to understand, use a normal function.

## Best Practices

Use function factories for configured behavior:

```js
function createFormatter(prefix) {
  return function (message) {
    return `${prefix}: ${message}`;
  };
}
```

Name returned functions when it helps readability or debugging:

```js
function createLogger(level) {
  return function logMessage(message) {
    console.log(`[${level}] ${message}`);
  };
}
```

Keep closures small and intentional:

```js
function createMultiplier(multiplier) {
  return function (number) {
    return number * multiplier;
  };
}
```

Avoid hiding too much logic behind nested function calls:

```js
// Harder to read for many beginners
const result = createA("x")("y")("z");
```

Prefer clarity over cleverness.

## Common Mistakes

### Mistake 1: Forgetting to Call the Returned Function

```js
function createGreeter() {
  return function () {
    return "Hello";
  };
}

console.log(createGreeter()); // [Function]
```

`createGreeter()` returns a function.

It does not return `"Hello"` until the returned function is called.

Correct:

```js
const greet = createGreeter();

console.log(greet()); // Hello
```

Or:

```js
console.log(createGreeter()()); // Hello
```

### Mistake 2: Thinking All Returned Functions Share State

```js
function createCounter() {
  let count = 0;

  return function () {
    count++;
    return count;
  };
}

const first = createCounter();
const second = createCounter();
```

`first` and `second` have separate closure environments.

They do not share the same `count`.

### Mistake 3: Returning a Function When a Value Is Needed

```js
function getTotal(price) {
  return function () {
    return price * 1.08;
  };
}

const total = getTotal(100);

console.log(total); // [Function]
```

If the caller expects a number, return the number:

```js
function getTotal(price) {
  return price * 1.08;
}
```

Return a function only when the caller should use that function later.

### Mistake 4: Making Nested Functions Too Hard to Follow

```js
const result = a(1)(2)(3)(4);
```

This may be valid, but it can be difficult to read without context.

Use clear names and intermediate variables when needed:

```js
const addOne = createAdder(1);
const result = addOne(2);
```

## Quick Check

What does this log?

```js
function createGreeter(name) {
  return function () {
    return `Hello, ${name}`;
  };
}

const greetMira = createGreeter("Mira");

console.log(greetMira());
```

It logs:

```text
Hello, Mira
```

The returned function remembers `name`.

What does this log?

```js
function makeMultiplier(multiplier) {
  return function (number) {
    return number * multiplier;
  };
}

const double = makeMultiplier(2);

console.log(double(6));
```

It logs:

```text
12
```

The returned function remembers `multiplier` as `2`.

What does this mean?

```js
curriedAdd(5)(3);
```

It means:

1. Call `curriedAdd(5)` to get a function.
2. Call the returned function with `3`.

## Summary

Functions can return other functions.

- A function that returns another function is a higher-order function.
- The returned function is not automatically executed.
- Returned functions often use closures to remember outer variables.
- Function factories create customized functions.
- Returning functions can support one-time setup, private state, and specialized behavior.
- Currying uses returned functions to split arguments across multiple calls.
- Use this pattern when it improves clarity or reuse, not just because it is possible.
