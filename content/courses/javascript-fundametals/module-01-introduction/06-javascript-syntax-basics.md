# JavaScript Syntax Basics

Syntax is the set of rules that defines how a JavaScript program is written.

Think of syntax like grammar in a spoken language. If a sentence does not follow grammar rules, it becomes hard to understand. If JavaScript code does not follow syntax rules, the JavaScript engine cannot understand it and will throw an error.

In this lesson, you will learn the basic syntax rules that appear in almost every JavaScript program.

## Statements

A **statement** is a single instruction that tells JavaScript to do something.

```js
let message = "Hello";
console.log(message);
```

This code has two statements:

1. Create a variable named `message`.
2. Print the value of `message` to the console.

Most JavaScript programs are made of many statements running one after another.

## Semicolons

JavaScript uses semicolons (`;`) to mark the end of a statement.

```js
let name = "Asha";
console.log(name);
```

JavaScript also has a feature called **Automatic Semicolon Insertion (ASI)**. This means the engine can add missing semicolons in many situations.

For example, this often works:

```js
let name = "Asha"
console.log(name)
```

However, relying on ASI can sometimes create confusing bugs, especially when your code becomes more advanced.

Best practice while learning:

```js
let name = "Asha";
console.log(name);
```

Use semicolons consistently.

## Case Sensitivity

JavaScript is **case-sensitive**. Uppercase and lowercase letters are treated as different characters.

```js
let myVariable = 10;
let MyVariable = 20;

console.log(myVariable); // 10
console.log(MyVariable); // 20
```

These are two different variables.

This will cause an error:

```js
let score = 100;

console.log(Score); // Error: Score is not defined
```

`score` and `Score` are not the same name.

## Naming Conventions

JavaScript developers usually follow common naming conventions so code is easier to read.

Use **camelCase** for variables and functions:

```js
let firstName = "Asha";
let totalPrice = 499;

function calculateTotal() {
  console.log("Calculating total...");
}
```

Use **PascalCase** for classes:

```js
class UserProfile {
  // Class code goes here
}
```

You will learn classes later. For now, just remember that names should be clear and consistent.

## Whitespace and Indentation

JavaScript ignores extra spaces, tabs, and new lines in most places.

This code works:

```js
let age=25;if(age>=18){console.log("Adult");}
```

But it is hard to read.

This version does the same thing and is much easier to understand:

```js
let age = 25;

if (age >= 18) {
  console.log("Adult");
}
```

Readable code matters. It helps you find mistakes faster and makes it easier for other developers to understand your work.

Tools like **Prettier** can format your code automatically.

## Identifiers

An **identifier** is a name you create in JavaScript. Variables, functions, and classes all use identifiers.

These are identifiers:

```js
let userName = "Alice";

function greetUser() {
  console.log("Hello!");
}
```

JavaScript has rules for identifier names:

1. They must start with a letter, underscore (`_`), or dollar sign (`$`).
2. After the first character, they can also include numbers.
3. They cannot start with a number.
4. They cannot be reserved keywords such as `let`, `function`, `return`, or `class`.

Valid examples:

```js
let userName = "Alice";
let _privateValue = 42;
let $button = "Save";
let place1 = "Gold";
```

Invalid examples:

```js
let 1stPlace = "Gold";
let let = 10;
let user-name = "Alice";
```

`user-name` is invalid because JavaScript reads the hyphen as a minus operator.

## Comments

Comments are notes in your code. JavaScript ignores them when the program runs.

Use comments to explain **why** something is happening, especially when the code is not obvious.

### Single-Line Comments

Single-line comments start with `//`.

```js
// Apply an 8% tax rate
let total = price * 1.08;
```

Everything after `//` on that line is ignored by JavaScript.

### Multi-Line Comments

Multi-line comments start with `/*` and end with `*/`.

```js
/*
  This calculation is temporary.
  We will replace it after adding discounts.
*/
let total = price * 1.08;
```

Avoid writing comments for code that is already obvious.

Less useful:

```js
// Create a variable named age
let age = 25;
```

More useful:

```js
// Users must be 18 or older to create an account
let minimumAge = 18;
```

## Literals

A **literal** is a fixed value written directly in your code.

String literals:

```js
"Hello";
'JavaScript';
`Welcome`;
```

Number literals:

```js
42;
3.14;
```

Boolean literals:

```js
true;
false;
```

Array literal:

```js
["HTML", "CSS", "JavaScript"];
```

Object literal:

```js
{
  name: "Asha",
  role: "developer"
}
```

You will use literals constantly when writing JavaScript.

## Blocks

A **block** is a group of statements wrapped in curly braces `{}`.

```js
if (true) {
  console.log("This is inside a block");
}
```

Blocks are commonly used with conditionals, loops, functions, and classes.

The indentation inside the block is not required by the engine, but it makes the code much easier to read.

## Putting It Together

Here is a small example that uses several syntax rules:

```js
let firstName = "Asha";
let age = 21;

// Check whether the user is old enough
if (age >= 18) {
  console.log(firstName + " can create an account.");
}
```

This example includes:

- Statements
- Semicolons
- camelCase identifiers
- String and number literals
- A comment
- A block

## Common Syntax Errors

When JavaScript cannot understand your code, it throws a syntax error.

Missing quote:

```js
let message = "Hello;
```

Missing closing parenthesis:

```js
console.log("Hello";
```

Missing closing brace:

```js
if (true) {
  console.log("Hello");
```

When this happens, read the error message carefully. It usually points near the place where JavaScript got confused.

## Syntax Checklist

Before moving on, make sure you can remember these rules:

1. A statement is one instruction in your program.
2. Use semicolons consistently.
3. JavaScript is case-sensitive.
4. Use camelCase for variable and function names.
5. Do not start identifiers with numbers.
6. Use whitespace and indentation to make code readable.
7. Use comments to explain important decisions.
8. Literals are fixed values written directly in code.
9. Blocks group statements inside `{}`.

## Module Wrap-Up

You have now completed the Introduction to JavaScript module.

You learned:

- What JavaScript is
- How JavaScript was created and standardized
- How JavaScript runs inside an engine and runtime
- How to set up your development environment
- How to write and run your first script
- The basic syntax rules for writing JavaScript

Next, you will move into variables and data types, where JavaScript programs start becoming more useful.