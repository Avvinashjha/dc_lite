# Differences Between var, let, and const

In the previous lesson, you learned the basic rule:

1. Use `const` by default.
2. Use `let` when a value needs to change.
3. Avoid `var` in modern JavaScript.

Now let's look at **why** that rule exists.

The main differences between `var`, `let`, and `const` come down to four ideas:

- Scope
- Redeclaration
- Reassignment
- Hoisting

Understanding these differences will help you avoid some of the most common beginner bugs in JavaScript.

## 1. Scope

**Scope** means where a variable is accessible in your code.

JavaScript has different kinds of scope, but for this lesson we will focus on:

- Function scope
- Block scope
- Global scope

## `var` Is Function-Scoped

A variable declared with `var` is scoped to the nearest function.

If it is not inside a function, it becomes globally scoped.

The surprising part is that `var` does **not** respect block scope.

A block is code inside curly braces `{}`:

```js
if (true) {
  var color = "blue";
}

console.log(color); // blue
```

Even though `color` was declared inside the `if` block, it is still accessible outside that block.

This is called **leaking out of the block**, and it can lead to bugs.

Inside a function, `var` stays inside the function:

```js
function showColor() {
  var color = "blue";
  console.log(color);
}

showColor();

console.log(color); // Error
```

So `var` is limited by functions, but not by blocks.

## `let` and `const` Are Block-Scoped

Variables declared with `let` and `const` are scoped to the nearest block.

```js
if (true) {
  let size = "large";
  const color = "blue";

  console.log(size);
  console.log(color);
}

console.log(size); // Error
console.log(color); // Error
```

This behavior is safer because variables only exist where they are needed.

## The Loop Problem

The difference becomes very clear with loops.

Using `var`:

```js
for (var i = 0; i < 3; i++) {
  console.log(i);
}

console.log(i); // 3
```

The loop variable `i` is still available after the loop ends.

Using `let`:

```js
for (let j = 0; j < 3; j++) {
  console.log(j);
}

console.log(j); // Error
```

The variable `j` only exists inside the loop.

This is usually what you want.

## 2. Redeclaration

**Redeclaration** means declaring a variable again using the same name in the same scope.

## `var` Allows Redeclaration

```js
var name = "Alice";
var name = "Bob";

console.log(name); // Bob
```

JavaScript allows this without warning.

In a large file, accidentally redeclaring a variable can overwrite important data and make the bug hard to find.

## `let` and `const` Prevent Redeclaration

```js
let age = 25;
let age = 30; // Error
```

```js
const country = "India";
const country = "Japan"; // Error
```

This is a good thing. JavaScript tells you immediately that the name already exists.

You can still use the same variable name in a different block:

```js
let status = "outside";

if (true) {
  let status = "inside";
  console.log(status); // inside
}

console.log(status); // outside
```

These two `status` variables are in different scopes, so they do not conflict.

## 3. Reassignment

**Reassignment** means changing the value stored in an existing variable.

`var` can be reassigned:

```js
var score = 0;
score = 10;
```

`let` can be reassigned:

```js
let score = 0;
score = 10;
```

`const` cannot be reassigned:

```js
const score = 0;
score = 10; // Error
```

This is why `const` is the default choice for values that should not be replaced.

Remember: for objects and arrays, `const` prevents reassignment of the variable name, not every internal change.

```js
const user = {
  name: "Asha"
};

user.name = "Ravi"; // Allowed
```

But this is not allowed:

```js
const user = {
  name: "Asha"
};

user = {
  name: "Ravi"
}; // Error
```

## 4. Hoisting

**Hoisting** is JavaScript's behavior of preparing declarations before code runs.

This topic can get deep, but the practical difference is simple:

- `var` is hoisted and initialized as `undefined`.
- `let` and `const` are hoisted but not initialized.

## `var` Hoisting

This code runs:

```js
console.log(myVar); // undefined

var myVar = 10;
```

JavaScript behaves roughly like this:

```js
var myVar;

console.log(myVar); // undefined

myVar = 10;
```

This can be confusing because the variable appears to exist before the line where you declared it.

## `let` and `const` Hoisting

This code does not run:

```js
console.log(myLet); // Error

let myLet = 20;
```

This also does not run:

```js
console.log(myConst); // Error

const myConst = 30;
```

`let` and `const` are hoisted, but they are not available until the declaration line is reached.

The time between the start of the scope and the declaration line is called the **Temporal Dead Zone**, often shortened to **TDZ**.

## Temporal Dead Zone

The Temporal Dead Zone means you cannot access a `let` or `const` variable before it is declared.

```js
{
  console.log(message); // Error

  let message = "Hello";
}
```

This error helps you catch mistakes early.

With `var`, JavaScript gives you `undefined`, which can hide bugs.

With `let` and `const`, JavaScript stops and tells you something is wrong.

## Comparison Table

| Feature | `var` | `let` | `const` |
| --- | --- | --- | --- |
| Scope | Function or global | Block | Block |
| Can be reassigned? | Yes | Yes | No |
| Can be redeclared in same scope? | Yes | No | No |
| Hoisted? | Yes | Yes | Yes |
| Value before declaration | `undefined` | TDZ error | TDZ error |
| Modern recommendation | Avoid in new code | Use when value changes | Use by default |

## Best Practice Examples

Use `const` for values that should not be replaced:

```js
const userName = "Asha";
const maxAttempts = 3;
const isLoggedIn = false;
```

Use `let` for values that need to change:

```js
let attempts = 0;

attempts = attempts + 1;
attempts = attempts + 1;
```

Avoid `var`:

```js
var count = 0; // Avoid in modern JavaScript
```

Prefer:

```js
let count = 0;
```

Or:

```js
const count = 0;
```

The right choice depends on whether the value needs to change.

## Common Questions

### Should I ever use `var`?

In new code, usually no.

You should understand `var` because you will see it in older JavaScript code, but modern code should prefer `const` and `let`.

### If `const` is default, why do we need `let`?

Because some values really do change.

Examples:

```js
let counter = 0;
counter++;
```

```js
let currentUser = null;
currentUser = "Asha";
```

### Is `const` more secure than `let`?

Not exactly.

`const` does not make data private or deeply immutable. It simply prevents reassignment of the variable name.

## Summary

The difference between `var`, `let`, and `const` is not just style. It affects how your code behaves.

1. `var` is function-scoped, can be redeclared, and is initialized as `undefined` during hoisting.
2. `let` is block-scoped, can be reassigned, and prevents redeclaration in the same scope.
3. `const` is block-scoped, cannot be reassigned, and must be initialized immediately.
4. `let` and `const` have a Temporal Dead Zone before their declaration line.
5. Modern JavaScript uses `const` by default, `let` when reassignment is needed, and avoids `var`.

Next, you will learn about the different types of data that variables can store.