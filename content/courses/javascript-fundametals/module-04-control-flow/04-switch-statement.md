# switch Statement

When you need to compare one value against many specific possibilities, a long `if...else if` chain can become hard to read.

A `switch` statement gives you a structured way to handle that situation.

It is useful when one expression can match one of several known values.

Examples:

- a day of the week
- a user role
- a command name
- a status value
- a menu option

## Basic Structure

A `switch` statement evaluates one expression and compares it with multiple `case` values.

```js
const day = "Monday";

switch (day) {
  case "Monday":
    console.log("Start of the work week.");
    break;
  case "Wednesday":
    console.log("Middle of the week.");
    break;
  case "Friday":
    console.log("Almost the weekend.");
    break;
  default:
    console.log("Just another day.");
}
```

## How `switch` Works

JavaScript follows these steps:

1. Evaluate the expression inside `switch(...)`.
2. Compare the value with each `case`.
3. Run the first matching case.
4. Stop when it reaches `break`.
5. Run `default` if no case matches.

In this example:

```js
switch (day)
```

JavaScript compares `day` to each case:

```js
case "Monday":
case "Wednesday":
case "Friday":
```

Since `day` is `"Monday"`, the first case runs.

## `switch` Uses Strict Matching

`switch` uses strict equality behavior, similar to `===`.

That means both value and type must match.

```js
const value = "1";

switch (value) {
  case 1:
    console.log("Number one");
    break;
  case "1":
    console.log("String one");
    break;
}
```

Output:

```text
String one
```

The number `1` and the string `"1"` are different values for `switch`.

## The Role of `break`

The `break` keyword exits the `switch` block.

Without `break`, JavaScript keeps running the next cases. This is called **fall-through**.

```js
const color = "red";

switch (color) {
  case "red":
    console.log("Stop");
  case "yellow":
    console.log("Slow down");
    break;
  case "green":
    console.log("Go");
    break;
}
```

Output:

```text
Stop
Slow down
```

Even though `color` is not `"yellow"`, the `"yellow"` case runs because the `"red"` case did not have `break`.

Most of the time, this is a bug.

Use `break` unless you intentionally want fall-through.

## The `default` Case

`default` runs when no case matches.

```js
const role = "guest";

switch (role) {
  case "admin":
    console.log("Full access");
    break;
  case "editor":
    console.log("Edit access");
    break;
  case "viewer":
    console.log("Read access");
    break;
  default:
    console.log("No special access");
}
```

`default` is like the final `else` in an `if...else` chain.

It is a good habit to include a `default` case, especially when the input may be unexpected.

## Intentional Fall-Through

Sometimes you want multiple cases to share the same code.

In that case, fall-through can be intentional.

```js
const month = 2;
let daysInMonth;

switch (month) {
  case 1:
  case 3:
  case 5:
  case 7:
  case 8:
  case 10:
  case 12:
    daysInMonth = 31;
    break;
  case 4:
  case 6:
  case 9:
  case 11:
    daysInMonth = 30;
    break;
  case 2:
    daysInMonth = 28;
    break;
  default:
    daysInMonth = "Invalid month";
}

console.log(daysInMonth); // 28
```

Here, multiple cases intentionally share the same assignment.

This pattern is valid because it is clear and grouped.

## Returning from a Function

If a `switch` is inside a function, you can often use `return` instead of `break`.

```js
function getRoleLabel(role) {
  switch (role) {
    case "admin":
      return "Administrator";
    case "editor":
      return "Editor";
    case "viewer":
      return "Viewer";
    default:
      return "Unknown role";
  }
}

console.log(getRoleLabel("editor")); // Editor
```

Because `return` exits the function, no `break` is needed after it.

## `switch` vs `if...else`

Use `switch` when:

- You are checking one value.
- You are matching exact values.
- You have several possible cases.

```js
switch (status) {
  case "loading":
    console.log("Loading...");
    break;
  case "success":
    console.log("Done");
    break;
  case "error":
    console.log("Something went wrong");
    break;
}
```

Use `if...else` when:

- You need ranges.
- You need complex conditions.
- You need to check multiple variables.

```js
if (age >= 18 && hasTicket) {
  console.log("Entry allowed");
}
```

A `switch` is not good for range checks like this:

```js
if (score >= 90) {
  console.log("A");
} else if (score >= 80) {
  console.log("B");
}
```

Use `if...else` for ranges.

## Object Mapping as an Alternative

Sometimes a `switch` only maps one key to one value.

Example with `switch`:

```js
function getRolePermissions(role) {
  switch (role) {
    case "admin":
      return ["read", "write", "delete"];
    case "editor":
      return ["read", "write"];
    case "viewer":
      return ["read"];
    default:
      return [];
  }
}
```

This can also be written with an object:

```js
function getRolePermissions(role) {
  const permissions = {
    admin: ["read", "write", "delete"],
    editor: ["read", "write"],
    viewer: ["read"]
  };

  return permissions[role] || [];
}
```

Object mapping can be cleaner when you are simply looking up a value.

Use `switch` when each case has behavior or multiple statements.

Use an object or `Map` when you are mapping keys to values.

## Common Mistakes

## Forgetting `break`

```js
const status = "loading";

switch (status) {
  case "loading":
    console.log("Loading");
  case "success":
    console.log("Success");
    break;
}
```

This prints both messages.

Fix:

```js
switch (status) {
  case "loading":
    console.log("Loading");
    break;
  case "success":
    console.log("Success");
    break;
}
```

## Expecting Loose Equality

```js
const value = "1";

switch (value) {
  case 1:
    console.log("Matched");
    break;
  default:
    console.log("Not matched");
}
```

This prints `"Not matched"` because `"1"` and `1` are different types.

## Using `switch` for Ranges

Avoid trying to force range logic into `switch`.

```js
const score = 85;

if (score >= 80) {
  console.log("Passed");
}
```

This is clearer than a `switch` for range-based conditions.

## Best Practices

1. Use `switch` for one value with many exact matches.
2. Include a `default` case for unexpected values.
3. Use `break` unless you intentionally want fall-through.
4. Group fall-through cases clearly when they share logic.
5. Use `return` instead of `break` when inside a function and returning a value.
6. Prefer `if...else` for ranges and complex conditions.
7. Consider object mapping for simple key-to-value lookups.

## Summary

`switch` is a control-flow tool for matching one expression against multiple exact values.

Remember:

1. `switch` compares cases using strict matching.
2. `case` defines a possible matching value.
3. `break` exits the switch.
4. Missing `break` causes fall-through.
5. `default` handles unmatched values.
6. Fall-through can be intentional when grouping cases.
7. `if...else` is better for ranges and complex conditions.
8. Object mapping can be cleaner for simple lookups.

Next, you will learn about `break` and `continue`, which give you more control inside loops.
