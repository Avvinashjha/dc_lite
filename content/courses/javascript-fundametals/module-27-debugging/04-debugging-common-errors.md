# Debugging Common Errors

JavaScript error messages can look intimidating at first.

They become much more useful when you learn how to read them.

Most runtime errors tell you three important things:

- what kind of error happened
- what message describes it
- where the error happened

## Anatomy of an Error

A browser error may look like this:

```text
Uncaught TypeError: Cannot read properties of undefined (reading 'name')
    at renderUser (user-card.js:12:21)
    at app.js:30:3
```

Read it in parts:

- `TypeError` is the error type.
- `Cannot read properties of undefined` is the message.
- `renderUser (user-card.js:12:21)` is the first relevant location.
- `app.js:30:3` shows where `renderUser` was called.

Start with the first stack frame that belongs to your code.

## SyntaxError

A `SyntaxError` means JavaScript could not parse the code.

```js
const user = {
  name: "Maya",
  role: "admin",
;
```

This object literal is missing a closing `}`.

Common causes:

- missing braces
- missing parentheses
- missing quotes
- extra commas in unsupported places
- invalid import or export syntax

Syntax errors usually stop the file from running at all.

## ReferenceError

A `ReferenceError` often means you used a variable name that does not exist in the current scope.

```js
function showTotal(total) {
  console.log(totel);
}
```

The variable is named `total`, but the code tries to read `totel`.

Another common cause is accessing a block-scoped variable outside its block.

```js
if (isLoggedIn) {
  const message = "Welcome back";
}

console.log(message);
```

`message` only exists inside the `if` block.

## TypeError

A `TypeError` means a value is not the type or shape your code expected.

```js
const user = undefined;

console.log(user.name);
```

The code expects `user` to be an object, but it is `undefined`.

Common `TypeError` examples:

```text
Cannot read properties of undefined
Cannot read properties of null
someValue is not a function
Cannot set properties of undefined
```

When you see a `TypeError`, inspect the value before the failing line.

```js
console.log("user before render:", user);
```

Or pause with a breakpoint before reading the property.

## RangeError

A `RangeError` means a value is outside an allowed range.

One common cause is accidental infinite recursion.

```js
function countDown(number) {
  return countDown(number - 1);
}

countDown(10);
```

This eventually causes a stack overflow because the function never stops calling itself.

Fix it with a base case.

```js
function countDown(number) {
  if (number <= 0) {
    return;
  }

  return countDown(number - 1);
}
```

## JSON Parsing Errors

`JSON.parse()` throws when the text is not valid JSON.

```js
const data = JSON.parse("{ name: 'Maya' }");
```

Valid JSON requires double-quoted property names and string values.

```js
const data = JSON.parse('{ "name": "Maya" }');
```

When parsing API responses, confirm that the response body is actually JSON.

```js
const text = await response.text();
console.log("raw response:", text);
```

If the server returned HTML, an empty body, or an error message, `response.json()` may fail.

## Promise Rejections

Async code can fail later.

```js
async function loadUser() {
  const response = await fetch("/api/user");
  return response.json();
}

loadUser();
```

If the request fails and nothing catches the error, you may see an unhandled promise rejection.

Handle it with `try...catch` or `.catch()`.

```js
async function loadUser() {
  try {
    const response = await fetch("/api/user");

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Could not load user:", error);
    throw error;
  }
}
```

## Reading Stack Traces

A stack trace shows the path of function calls.

```js
function startCheckout(cart) {
  return calculateTotal(cart);
}

function calculateTotal(cart) {
  return cart.items.reduce((sum, item) => sum + item.price, 0);
}

startCheckout(undefined);
```

The failing line is inside `calculateTotal`, but the root cause may be that `startCheckout` received `undefined`.

Use the stack trace to walk backward:

1. Where did the error happen?
2. Which function called it?
3. What value was passed?
4. Where did that value come from?

## Reproduce Before Fixing

Before changing code, try to reproduce the error reliably.

Write down:

- the exact steps
- the expected behavior
- the actual behavior
- the error message
- the browser or environment
- any relevant input data

If you cannot reproduce the bug, you may accidentally fix the wrong thing.

## Reduce the Problem

When a bug is confusing, make the example smaller.

Remove anything unrelated until only the failing behavior remains.

For example, if a filter function returns the wrong results, test it with a tiny array.

```js
const users = [
  { name: "Asha", active: true },
  { name: "Noah", active: false },
];

const activeUsers = users.filter((user) => user.active);
console.log(activeUsers);
```

A minimal example makes wrong assumptions easier to spot.

## Common Mistakes

Do not fix the line that crashed without checking where the bad value came from.

Do not hide errors with broad fallback values unless you understand the cause.

```js
const name = user?.name || "Unknown";
```

This can be fine in UI code, but it can also hide a bug where `user` should never be missing.

Do not ignore the first error. Later errors may happen only because the first one stopped important code from running.

Do not assume an error message is wrong. It may be pointing to an assumption in your code.

## Summary

Common JavaScript errors are clues.

Use the error type, message, and stack trace to find:

- which value was unexpected
- where it was used
- where it came from
- which assumption failed

Good debugging starts by reading the error carefully, reproducing the problem, and following the data backward.
