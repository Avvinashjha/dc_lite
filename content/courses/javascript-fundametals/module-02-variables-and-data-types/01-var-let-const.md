# var, let, and const

In programming, a **variable** is a named place to store data so you can use it later.

You can think of a variable like a labeled box:

```js
let userName = "Asha";
```

Here, `userName` is the label, and `"Asha"` is the value stored inside it.

JavaScript has three keywords for creating variables:

- `var`
- `let`
- `const`

Understanding the difference between them is one of the most important foundations in JavaScript.

## Declaring a Variable

To create a variable, you use a declaration keyword, a name, and usually a value.

```js
let message = "Hello";
```

This line means:

1. Create a variable using `let`.
2. Name it `message`.
3. Store the string `"Hello"` inside it.

You can then use the variable later:

```js
console.log(message);
```

## `var`: The Older Way

`var` is the original way to declare variables in JavaScript.

You will still see `var` in older codebases, tutorials, and libraries, but it is rarely the best choice in modern JavaScript.

```js
var age = 25;
var age = 30;

age = 35;

console.log(age); // 35
```

With `var`:

- You can update the value.
- You can redeclare the same variable name.
- It is function-scoped, not block-scoped.

The redeclaration behavior can make bugs harder to notice:

```js
var total = 100;
var total = 0;

console.log(total); // 0
```

JavaScript does not warn you that `total` was declared twice. In a larger file, that can be dangerous.

For modern code, avoid `var` unless you are working in an older codebase that already uses it.

## `let`: For Values That Change

`let` was introduced in ES6, also known as ECMAScript 2015.

Use `let` when the value needs to change later.

```js
let score = 0;

score = 10;
score = 20;

console.log(score); // 20
```

With `let`:

- You can update the value.
- You cannot redeclare the same name in the same scope.
- It is block-scoped.

This is allowed:

```js
let score = 0;
score = 10;
```

This is not allowed:

```js
let score = 0;
let score = 10; // Error
```

That error is helpful because it prevents you from accidentally declaring the same variable twice.

## `const`: For Values That Should Not Be Reassigned

`const` was also introduced in ES6.

Use `const` when the variable should not be reassigned.

```js
const pi = 3.14159;

console.log(pi);
```

With `const`:

- You cannot redeclare the same name in the same scope.
- You cannot reassign it to a new value.
- It is block-scoped.
- You must give it a value immediately.

This is valid:

```js
const country = "India";
```

This is not valid:

```js
const country;
country = "India";
```

This is also not valid:

```js
const country = "India";
country = "Japan"; // Error
```

`const` does not mean the value is deeply frozen. It means the variable name cannot be reassigned.

For example, this is allowed:

```js
const user = {
  name: "Asha"
};

user.name = "Ravi";

console.log(user.name); // Ravi
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

You will learn objects and arrays in more detail later. For now, remember this rule: `const` prevents reassignment of the variable, not every change inside an object or array.

## Block Scope

Both `let` and `const` are **block-scoped**.

A block is code inside curly braces `{}`.

```js
if (true) {
  let message = "Inside the block";
  console.log(message);
}
```

The variable only exists inside that block.

This will cause an error:

```js
if (true) {
  let message = "Inside the block";
}

console.log(message); // Error
```

This is one reason `let` and `const` are safer than `var`. They keep variables limited to the part of the code where they are needed.

## Choosing Between `let` and `const`

Use `const` by default.

```js
const appName = "DailyCoder";
const maxLoginAttempts = 5;
```

Use `let` only when the value needs to change.

```js
let attempts = 0;

attempts = attempts + 1;
attempts = attempts + 1;

console.log(attempts); // 2
```

Avoid `var` in new code.

## Comparison Table

| Keyword | Can be reassigned? | Can be redeclared in same scope? | Scope | Modern usage |
| --- | --- | --- | --- | --- |
| `var` | Yes | Yes | Function | Avoid in new code |
| `let` | Yes | No | Block | Use when the value changes |
| `const` | No | No | Block | Use by default |

## Common Mistakes

### Redeclaring a `let`

```js
let name = "Asha";
let name = "Ravi"; // Error
```

Use reassignment instead:

```js
let name = "Asha";
name = "Ravi";
```

### Reassigning a `const`

```js
const language = "JavaScript";
language = "Python"; // Error
```

If the value must change, use `let`:

```js
let language = "JavaScript";
language = "Python";
```

### Using `var` Out of Habit

```js
var count = 0;
```

Prefer:

```js
let count = 0;
```

Or, if the value will not change:

```js
const count = 0;
```

## Best Practice

The modern JavaScript rule is:

1. Start with `const`.
2. Change to `let` only if reassignment is needed.
3. Avoid `var` in new code.

This approach makes your code easier to understand and reduces accidental bugs.

## Quick Check

Which keyword should you use for a value that will not be reassigned?

```js
const siteName = "DailyCoder";
```

Use `const` because `siteName` should keep the same value.

Which keyword should you use for a value that changes?

```js
let score = 0;
score = 10;
```

Use `let` because `score` changes over time.