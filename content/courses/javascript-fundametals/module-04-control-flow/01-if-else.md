# if / else

So far, most of your JavaScript code has run from top to bottom.

Real programs need to make decisions.

For example:

- If the user is logged in, show the dashboard.
- If the cart is empty, show an empty-cart message.
- If the score is high enough, show a passing grade.

This is called **control flow**.

Control flow lets you decide which blocks of code should run depending on conditions.

The most fundamental control-flow tool is the `if...else` statement.

## The Basic `if` Statement

An `if` statement checks a condition.

If the condition is truthy, the code inside the block runs.

```js
const age = 20;

if (age >= 18) {
  console.log("You are an adult.");
}
```

The condition is:

```js
age >= 18
```

This evaluates to:

```js
true
```

So the code block runs.

If the condition is false, the block is skipped.

```js
const age = 16;

if (age >= 18) {
  console.log("You are an adult.");
}
```

Nothing is printed because `age >= 18` is false.

## The Shape of an `if` Statement

An `if` statement has this structure:

```js
if (condition) {
  // code to run when condition is truthy
}
```

The condition goes inside parentheses.

The code to run goes inside curly braces.

## Adding `else`

Use `else` when you want a fallback block.

```js
const isLoggedIn = false;

if (isLoggedIn) {
  console.log("Welcome back.");
} else {
  console.log("Please log in.");
}
```

If the `if` condition is truthy, the first block runs.

If the `if` condition is falsy, the `else` block runs.

Only one of the two blocks runs.

## Handling Multiple Conditions with `else if`

Sometimes you have more than two possible outcomes.

Use `else if` to check multiple conditions in order.

```js
const score = 85;

if (score >= 90) {
  console.log("Grade: A");
} else if (score >= 80) {
  console.log("Grade: B");
} else if (score >= 70) {
  console.log("Grade: C");
} else {
  console.log("Grade: F");
}
```

JavaScript checks from top to bottom.

The first truthy condition wins.

In this example:

```js
score >= 90 // false
score >= 80 // true
```

So `"Grade: B"` is printed, and the rest of the chain is skipped.

## Order Matters

When using `else if`, put the most specific or highest-priority checks first.

This works:

```js
const score = 95;

if (score >= 90) {
  console.log("Grade: A");
} else if (score >= 80) {
  console.log("Grade: B");
}
```

This is wrong:

```js
const score = 95;

if (score >= 80) {
  console.log("Grade: B");
} else if (score >= 90) {
  console.log("Grade: A");
}
```

The first condition already matches, so JavaScript never reaches the `score >= 90` check.

## Truthy and Falsy Conditions

The condition inside an `if` statement does not have to be exactly `true` or `false`.

JavaScript converts the condition to a boolean using truthy and falsy rules.

```js
const user = {
  name: "Asha"
};

if (user) {
  console.log(`Hello, ${user.name}`);
}
```

Objects are truthy, so the block runs.

An empty string is falsy:

```js
const errorMessage = "";

if (errorMessage) {
  console.log("There was an error.");
}
```

The block is skipped because `""` is falsy.

Common falsy values include:

```js
false;
0;
"";
null;
undefined;
NaN;
```

Most other values are truthy.

## Be Careful with Falsy Checks

Truthy/falsy checks are useful, but they can be too broad.

```js
const quantity = 0;

if (quantity) {
  console.log("Quantity exists");
} else {
  console.log("No quantity");
}
```

This prints `"No quantity"` because `0` is falsy.

But `0` may be a valid value.

If you specifically want to check for missing values, use a direct check:

```js
if (quantity === null || quantity === undefined) {
  console.log("Quantity is missing");
} else {
  console.log("Quantity is available");
}
```

## Combining Conditions

You can combine conditions using logical operators.

```js
const isLoggedIn = true;
const hasPermission = true;

if (isLoggedIn && hasPermission) {
  console.log("Access granted");
}
```

Use `&&` when all conditions must be true.

Use `||` when at least one condition must be true.

```js
const isAdmin = false;
const isOwner = true;

if (isAdmin || isOwner) {
  console.log("Can edit");
}
```

Use `!` to check the opposite.

```js
const isLoggedIn = false;

if (!isLoggedIn) {
  console.log("Please log in");
}
```

## Always Use Curly Braces

JavaScript allows single-line `if` statements without braces, but you should avoid that style.

Avoid:

```js
if (isAdmin)
  grantAccess();
```

Prefer:

```js
if (isAdmin) {
  grantAccess();
}
```

Braces make the code safer when you add more lines later.

This is a common bug:

```js
if (isAdmin)
  grantAccess();
  deleteUser();
```

Only `grantAccess()` belongs to the `if`.

`deleteUser()` runs every time.

With braces, the intent is clear:

```js
if (isAdmin) {
  grantAccess();
  deleteUser();
}
```

## Use Strict Equality in Conditions

Prefer `===` and `!==` when comparing values.

Avoid:

```js
if (status == "success") {
  console.log("Done");
}
```

Prefer:

```js
if (status === "success") {
  console.log("Done");
}
```

Strict equality avoids hidden type coercion.

## Guard Clauses

A guard clause is an early check that exits a function when conditions are not met.

This can make code easier to read.

Nested version:

```js
function processUser(user) {
  if (user) {
    if (user.isActive) {
      console.log("Processing user");
    }
  }
}
```

Guard clause version:

```js
function processUser(user) {
  if (!user || !user.isActive) {
    return;
  }

  console.log("Processing user");
}
```

The guard clause handles the invalid case first, then the main logic stays flat.

## Practical Example: Login Message

```js
const user = {
  name: "Asha",
  isLoggedIn: true,
  isAdmin: false
};

if (!user.isLoggedIn) {
  console.log("Please log in.");
} else if (user.isAdmin) {
  console.log(`Welcome admin ${user.name}.`);
} else {
  console.log(`Welcome ${user.name}.`);
}
```

This example checks:

1. Whether the user is logged in.
2. Whether the user is an admin.
3. The fallback for normal logged-in users.

## Common Mistakes

## Assignment Instead of Comparison

This is a bug:

```js
let status = "pending";

if (status = "success") {
  console.log("Done");
}
```

`=` assigns a value. It does not compare.

Use `===`:

```js
if (status === "success") {
  console.log("Done");
}
```

## Wrong `else if` Order

```js
const score = 95;

if (score >= 70) {
  console.log("C or better");
} else if (score >= 90) {
  console.log("A");
}
```

The `score >= 90` branch never runs because `score >= 70` matches first.

Put stricter checks first.

## Overusing Nested `if` Statements

Deep nesting can be hard to read.

Prefer guard clauses or named boolean variables when logic grows.

```js
const canAccessDashboard = isLoggedIn && hasPermission && !isBlocked;

if (canAccessDashboard) {
  console.log("Show dashboard");
}
```

## Summary

`if...else` statements let JavaScript make decisions.

Remember:

1. `if` runs a block when the condition is truthy.
2. `else` provides a fallback.
3. `else if` lets you check multiple conditions in order.
4. The first matching branch runs, and the rest are skipped.
5. Truthy/falsy checks are useful, but direct checks are safer when values like `0` or `""` are valid.
6. Always use curly braces.
7. Prefer strict equality with `===` and `!==`.
8. Guard clauses can make functions easier to read.

Next, you will learn about `switch`, another control-flow tool for handling multiple possible values.
