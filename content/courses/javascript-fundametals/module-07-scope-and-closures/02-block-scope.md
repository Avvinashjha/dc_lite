# Block Scope

In the previous lesson, you learned about global scope and function scope.

Now you will learn another important type of scope: **block scope**.

Block scope is one of the main reasons modern JavaScript code uses `let` and `const` instead of `var`.

## What Is a Block?

A **block** is code wrapped in curly braces:

```js
{
  // This is a block
}
```

You see blocks in many places:

```js
if (isLoggedIn) {
  console.log("Welcome back!");
}
```

```js
for (let i = 0; i < 3; i++) {
  console.log(i);
}
```

```js
while (count < 5) {
  count++;
}
```

Blocks appear in:

- `if` and `else` statements
- `for` loops
- `while` loops
- `switch` statements
- `try...catch` statements
- standalone `{}` blocks

Block scope means a variable only exists inside the block where it was declared.

## Block Scope With `let`

Variables declared with `let` are block-scoped.

```js
if (true) {
  let message = "Inside the block";
  console.log(message); // Inside the block
}

console.log(message); // ReferenceError
```

The variable `message` exists inside the `if` block.

Once the block ends, `message` is no longer available.

This keeps temporary variables contained.

## Block Scope With `const`

Variables declared with `const` are also block-scoped.

```js
if (true) {
  const status = "active";
  console.log(status); // active
}

console.log(status); // ReferenceError
```

The variable `status` only exists between the `{` and `}` of the `if` block.

This is exactly what you usually want.

If a value is only needed inside a block, it should not leak into the rest of the program.

## The `var` Trap

The older `var` keyword does not follow block scope.

`var` is function-scoped.

That means a `var` declared inside an `if` block can still be accessed outside that block.

```js
if (true) {
  var leakedMessage = "I escaped the block";
}

console.log(leakedMessage); // I escaped the block
```

This can be surprising.

The variable looks like it belongs to the `if` block, but it does not.

Because `var` ignores block scope, it can leak into a wider scope than you intended.

## `var` Inside a Function

Inside a function, `var` is scoped to the whole function.

```js
function showStatus(isActive) {
  if (isActive) {
    var status = "active";
  }

  console.log(status);
}

showStatus(true); // active
```

The `status` variable is declared inside the `if` block.

But because it uses `var`, it is available throughout the entire `showStatus` function.

This can also produce confusing results:

```js
function showStatus(isActive) {
  if (isActive) {
    var status = "active";
  }

  console.log(status);
}

showStatus(false); // undefined
```

When `isActive` is `false`, the assignment never happens.

But the `var` declaration still belongs to the function scope, so `status` exists with the value `undefined`.

You will learn more about this behavior in the hoisting lesson.

## `let` and `const` Stay Inside the Block

Now compare the same idea with `let`:

```js
function showStatus(isActive) {
  if (isActive) {
    let status = "active";
    console.log(status); // active
  }

  console.log(status); // ReferenceError
}

showStatus(true);
```

The variable `status` only exists inside the `if` block.

The same is true with `const`:

```js
function showStatus(isActive) {
  if (isActive) {
    const status = "active";
    console.log(status); // active
  }

  console.log(status); // ReferenceError
}

showStatus(true);
```

This makes the code safer.

The variable cannot accidentally be used outside the block where it belongs.

## Block Scope in `if...else`

Each block has its own scope.

```js
const score = 85;

if (score >= 50) {
  const result = "Pass";
  console.log(result); // Pass
} else {
  const result = "Fail";
  console.log(result);
}
```

Both blocks declare a variable named `result`.

This is allowed because each `result` belongs to a different block.

But outside the `if...else`, neither variable exists:

```js
const score = 85;

if (score >= 50) {
  const result = "Pass";
} else {
  const result = "Fail";
}

console.log(result); // ReferenceError
```

If you need the value after the block, declare it in the outer scope:

```js
const score = 85;
let result;

if (score >= 50) {
  result = "Pass";
} else {
  result = "Fail";
}

console.log(result); // Pass
```

Or, for simple choices, use an expression:

```js
const score = 85;
const result = score >= 50 ? "Pass" : "Fail";

console.log(result); // Pass
```

## Block Scope in Loops

Block scope is especially useful in loops.

```js
for (let i = 0; i < 3; i++) {
  console.log(i);
}

console.log(i); // ReferenceError
```

The loop counter `i` only exists inside the loop.

That is good.

The counter is a temporary variable. It should not pollute the outer scope.

With `var`, the loop counter leaks:

```js
for (var i = 0; i < 3; i++) {
  console.log(i);
}

console.log(i); // 3
```

After the loop finishes, `i` is still available.

This is one of the classic problems with `var`.

## Why `let` Is Better for Loop Counters

Use `let` for loop counters because the value changes on each iteration.

```js
for (let index = 0; index < 3; index++) {
  console.log(index);
}
```

The variable `index` belongs to the loop.

It does not leak outside:

```js
console.log(index); // ReferenceError
```

This keeps your outer scope clean.

It also prevents accidental reuse:

```js
for (let i = 0; i < 3; i++) {
  console.log(i);
}

for (let i = 0; i < 2; i++) {
  console.log(i);
}
```

Both loops can safely use `i`.

Each loop has its own block-scoped `i`.

## Blocks Can Be Standalone

You can create a block without an `if`, loop, or function.

```js
const value = 10;

{
  const value = 20;
  console.log(value); // 20
}

console.log(value); // 10
```

The inner `value` only exists inside the standalone block.

The outer `value` is unchanged.

Standalone blocks are not used every day, but they can be useful when you want a temporary private scope.

## Shadowing With Block Scope

When an inner scope declares a variable with the same name as an outer scope, the inner variable shadows the outer one.

```js
const mode = "light";

if (true) {
  const mode = "dark";
  console.log(mode); // dark
}

console.log(mode); // light
```

Inside the block, JavaScript uses the closest `mode`.

Outside the block, JavaScript uses the outer `mode`.

Shadowing is valid, but it can become confusing.

Use it only when the meaning is clear.

## Block Scope Does Not Replace Function Scope

Block scope and function scope both matter.

```js
function createMessage(isAdmin) {
  const prefix = "User type:";

  if (isAdmin) {
    const role = "admin";
    return `${prefix} ${role}`;
  }

  const role = "viewer";
  return `${prefix} ${role}`;
}

console.log(createMessage(true)); // User type: admin
console.log(createMessage(false)); // User type: viewer
```

Here:

- `prefix` is function-scoped because it is declared in the function body
- each `role` is block-scoped because it is declared inside a block

The inner block can access `prefix` from the outer function scope.

But the function scope cannot access a `role` declared inside an `if` block after that block ends.

## `const` and Objects Inside Blocks

Remember that `const` prevents reassignment.

It does not make objects immutable.

```js
if (true) {
  const user = {
    name: "Alice",
  };

  user.name = "Ava";

  console.log(user.name); // Ava
}
```

The `user` variable is block-scoped.

Outside the block, it is not available:

```js
console.log(user); // ReferenceError
```

But while inside the block, the object it points to can still be changed.

This connects back to what you learned about `const` and object mutation.

## `catch` Blocks

`catch` blocks also create block scope.

```js
try {
  JSON.parse("{ bad json }");
} catch (error) {
  console.log(error.message);
}

console.log(error); // ReferenceError
```

The `error` variable only exists inside the `catch` block.

This keeps error-handling variables from leaking into the rest of the code.

## `switch` and Blocks

A `switch` statement uses braces, but its cases can be tricky because all cases share the same block unless you add extra braces.

This can cause problems:

```js
const role = "admin";

switch (role) {
  case "admin":
    const message = "Admin user";
    console.log(message);
    break;
  case "viewer":
    const message = "Viewer user";
    console.log(message);
    break;
}
```

This code can fail because both `message` declarations are in the same `switch` block.

You can fix it by adding braces around each case:

```js
const role = "admin";

switch (role) {
  case "admin": {
    const message = "Admin user";
    console.log(message);
    break;
  }
  case "viewer": {
    const message = "Viewer user";
    console.log(message);
    break;
  }
}
```

Now each case has its own block scope.

## Why Modern JavaScript Avoids `var`

Modern JavaScript almost always uses `const` and `let`.

The main reasons are:

- `const` and `let` are block-scoped
- `var` is only function-scoped
- `var` can leak out of blocks
- `var` can make hoisting behavior confusing
- block scope makes code easier to reason about

Default to `const`.

Use `let` when the variable must be reassigned.

Avoid `var` in modern code.

## Best Practices

Declare variables as close as possible to where they are used:

```js
if (cartTotal > 100) {
  const discount = cartTotal * 0.1;
  console.log(discount);
}
```

Use `const` by default:

```js
const maxAttempts = 3;
```

Use `let` when the value changes:

```js
let attempts = 0;

while (attempts < 3) {
  attempts++;
}
```

Avoid `var`:

```js
// Avoid this in modern JavaScript
var message = "Hello";
```

If you need a value outside a block, declare it outside the block intentionally:

```js
let message;

if (isLoggedIn) {
  message = "Welcome back";
} else {
  message = "Please sign in";
}

console.log(message);
```

Do not declare a value inside a block and expect it to exist outside.

## Common Mistakes

### Mistake 1: Trying to Use `let` Outside Its Block

```js
if (true) {
  let message = "Hello";
}

console.log(message); // ReferenceError
```

The variable `message` only exists inside the block.

### Mistake 2: Expecting `var` to Stay Inside a Block

```js
if (true) {
  var message = "Hello";
}

console.log(message); // Hello
```

`var` does not respect block scope.

Use `let` or `const` instead.

### Mistake 3: Declaring a Result Inside `if...else` and Using It Later

```js
if (score >= 50) {
  const result = "Pass";
} else {
  const result = "Fail";
}

console.log(result); // ReferenceError
```

Declare the variable outside the block if it must be used later:

```js
let result;

if (score >= 50) {
  result = "Pass";
} else {
  result = "Fail";
}

console.log(result);
```

### Mistake 4: Forgetting That `switch` Cases Share Scope

```js
switch (role) {
  case "admin":
    const label = "Admin";
    break;
  case "viewer":
    const label = "Viewer";
    break;
}
```

Add braces to create separate block scopes:

```js
switch (role) {
  case "admin": {
    const label = "Admin";
    break;
  }
  case "viewer": {
    const label = "Viewer";
    break;
  }
}
```

## Quick Check

What happens here?

```js
if (true) {
  const message = "Inside";
}

console.log(message);
```

It throws a `ReferenceError`.

`message` is block-scoped.

What does this log?

```js
if (true) {
  var message = "Inside";
}

console.log(message);
```

It logs:

```text
Inside
```

`var` does not stay inside the block.

What does this log?

```js
const value = 1;

{
  const value = 2;
  console.log(value);
}

console.log(value);
```

It logs:

```text
2
1
```

The block has its own `value`, and the outer `value` is unchanged.

## Summary

Block scope controls variables declared inside curly braces.

- A block is code inside `{}`.
- `let` and `const` are block-scoped.
- `var` is not block-scoped; it is function-scoped.
- Loop counters declared with `let` stay inside the loop.
- Standalone blocks can create temporary private scopes.
- `switch` cases may need extra braces to create separate scopes.
- Use `const` by default, `let` when reassignment is needed, and avoid `var` in modern JavaScript.
