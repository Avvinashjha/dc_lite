# Ternary Operator

You already know how to make decisions with `if...else`.

Sometimes, though, you only need to choose between two values.

For example:

```js
let message;

if (age >= 18) {
  message = "Adult";
} else {
  message = "Minor";
}
```

This works, but it is a lot of code for a simple value assignment.

The **ternary operator** gives you a shorter way to write simple conditional expressions.

## What Is the Ternary Operator?

The ternary operator is JavaScript's only operator that takes three operands.

It uses:

- `?`
- `:`

Syntax:

```js
condition ? expressionIfTrue : expressionIfFalse
```

Read it like this:

```text
Is the condition truthy?
If yes, use the first expression.
If no, use the second expression.
```

## Basic Example

```js
const age = 20;

const message = age >= 18 ? "You are an adult." : "You are a minor.";

console.log(message); // You are an adult.
```

The condition is:

```js
age >= 18
```

If it is true, JavaScript returns:

```js
"You are an adult."
```

If it is false, JavaScript returns:

```js
"You are a minor."
```

## Ternary vs `if...else`

This `if...else`:

```js
let message;

if (age >= 18) {
  message = "You are an adult.";
} else {
  message = "You are a minor.";
}
```

Can be written as:

```js
const message = age >= 18 ? "You are an adult." : "You are a minor.";
```

The ternary version is useful because it produces a value.

That value can be assigned, returned, or passed into another expression.

## Parentheses for Readability

Parentheses around the condition are optional.

```js
const message = age >= 18 ? "Adult" : "Minor";
```

This also works:

```js
const message = (age >= 18) ? "Adult" : "Minor";
```

Many developers use parentheses when the condition is more complex.

```js
const access = (isLoggedIn && hasPermission) ? "Allowed" : "Denied";
```

Use whichever style keeps the code readable.

## Returning from Functions

The ternary operator is useful when returning one of two values from a function.

```js
function getDiscountPrice(price, isMember) {
  return isMember ? price * 0.8 : price;
}

console.log(getDiscountPrice(100, true)); // 80
console.log(getDiscountPrice(100, false)); // 100
```

This function returns:

- discounted price when `isMember` is true
- original price when `isMember` is false

## Using Ternary with Template Literals

You can use a ternary inside a template literal.

```js
const isLoggedIn = true;

console.log(`Status: ${isLoggedIn ? "Online" : "Offline"}`);
```

Output:

```text
Status: Online
```

This pattern is common when building UI text.

## Ternary with Boolean Labels

A ternary is good for choosing labels.

```js
const isDarkMode = false;

const buttonText = isDarkMode ? "Switch to light mode" : "Switch to dark mode";

console.log(buttonText); // Switch to dark mode
```

It is also useful for class names or display text:

```js
const isActive = true;
const className = isActive ? "tab active" : "tab";
```

## Avoid Using Ternary for Side Effects

A ternary should usually produce a value.

Avoid using it mainly to run actions.

Hard to read:

```js
isLoggedIn ? showDashboard() : showLogin();
```

This is clearer:

```js
if (isLoggedIn) {
  showDashboard();
} else {
  showLogin();
}
```

If the goal is to perform actions, use `if...else`.

If the goal is to choose a value, a ternary may be a good fit.

## Chained Ternaries

You can chain ternary operators.

```js
const score = 85;

const grade = score >= 90
  ? "A"
  : score >= 80
    ? "B"
    : score >= 70
      ? "C"
      : "F";

console.log(grade); // B
```

This is valid JavaScript, but it can become hard to read quickly.

For multiple conditions, `if...else` is often clearer:

```js
let grade;

if (score >= 90) {
  grade = "A";
} else if (score >= 80) {
  grade = "B";
} else if (score >= 70) {
  grade = "C";
} else {
  grade = "F";
}
```

Use chained ternaries only when they remain easy to scan.

## Common Mistakes

## Making the Ternary Too Complex

Avoid code like this:

```js
const result = isLoggedIn
  ? hasPermission
    ? isActive
      ? "Allowed"
      : "Inactive"
    : "No permission"
  : "Not logged in";
```

This is technically valid, but hard to read.

Prefer `if...else`, named variables, or a helper function.

## Using Ternary Instead of Clear Control Flow

Avoid:

```js
isLoggedIn ? (showDashboard(), updateStats()) : (showLogin(), clearCache());
```

Prefer:

```js
if (isLoggedIn) {
  showDashboard();
  updateStats();
} else {
  showLogin();
  clearCache();
}
```

The `if...else` version is longer, but much easier to understand.

## Forgetting That Ternary Is an Expression

The ternary operator produces a value.

Good use:

```js
const label = isSaving ? "Saving..." : "Save";
```

Less ideal use:

```js
isSaving ? console.log("Saving") : console.log("Save");
```

For actions, use `if...else`.

## Best Practices

1. Use ternary for simple value selection.
2. Prefer `if...else` for complex branching or side effects.
3. Avoid deeply chained ternaries.
4. Use parentheses when they improve readability.
5. Keep each branch short and easy to understand.

## Summary

The ternary operator is a concise way to choose between two values.

Remember:

1. Syntax: `condition ? valueIfTrue : valueIfFalse`.
2. It is useful for assignments and returns.
3. It produces a value.
4. It works well for short, simple conditions.
5. It becomes hard to read when deeply nested or used for side effects.

Next, you will learn about truthy and falsy values in more depth.
