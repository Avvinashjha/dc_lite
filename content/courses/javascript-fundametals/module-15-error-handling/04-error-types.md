# Error Types

JavaScript has several built-in error types.

You do not need to memorize every error type immediately, but recognizing the common ones helps you debug faster.

Every error object usually has:

```js
error.name
error.message
error.stack
```

Example:

```js
try {
  missingVariable;
} catch (error) {
  console.log(error.name); // ReferenceError
  console.log(error.message);
}
```

## `Error`

`Error` is the general error type.

```js
throw new Error("Something went wrong");
```

Use `Error` when you do not need a more specific built-in error type.

```js
function createUser(name) {
  if (!name) {
    throw new Error("Name is required");
  }

  return { name };
}
```

## `ReferenceError`

A `ReferenceError` happens when code tries to use a variable that does not exist in scope.

```js
console.log(username); // ReferenceError
```

Common causes:

- misspelled variable names
- using a variable before declaration
- expecting a variable from another scope

Example:

```js
const userName = "Alice";

console.log(username); // ReferenceError: username is not defined
```

JavaScript is case-sensitive.

`userName` and `username` are different names.

## `TypeError`

A `TypeError` happens when a value is not the type you expected for an operation.

```js
const user = null;

console.log(user.name); // TypeError
```

You tried to read a property from `null`.

Another example:

```js
const value = 42;

value.toUpperCase(); // TypeError
```

Numbers do not have `toUpperCase()`.

Common causes:

- calling something that is not a function
- reading properties from `null` or `undefined`
- using a method on the wrong data type

## `SyntaxError`

A `SyntaxError` happens when JavaScript code or JSON text has invalid syntax.

```js
if (true {
  console.log("missing parenthesis");
}
```

This code cannot be parsed.

`JSON.parse()` can also throw `SyntaxError`.

```js
JSON.parse("{ bad json }"); // SyntaxError
```

Syntax errors often prevent code from running at all.

## `RangeError`

A `RangeError` happens when a value is outside an allowed range.

```js
const number = 123.456;

number.toFixed(200); // RangeError
```

Another common example:

```js
function recurse() {
  recurse();
}

recurse(); // RangeError: maximum call stack size exceeded
```

This happens because the recursion never stops.

## `URIError`

A `URIError` happens when URI encoding or decoding is invalid.

```js
decodeURIComponent("%"); // URIError
```

This is less common for beginners, but you may see it when working with URLs.

## `AggregateError`

`AggregateError` represents multiple errors grouped together.

You may see it with promise-related APIs such as `Promise.any()`.

```js
Promise.any([
  Promise.reject(new Error("A failed")),
  Promise.reject(new Error("B failed")),
]).catch((error) => {
  console.log(error instanceof AggregateError); // true
});
```

You will learn promises later.

For now, just recognize that some APIs can group multiple errors.

## Checking Error Types

You can use `instanceof` to check an error type.

```js
try {
  JSON.parse("{ bad json }");
} catch (error) {
  if (error instanceof SyntaxError) {
    console.log("Invalid JSON syntax");
  } else {
    throw error;
  }
}
```

This is useful when you want to handle only specific errors.

Do not catch every error the same way if the response should be different.

## Reading Stack Traces

The stack trace shows where an error happened.

```js
try {
  throw new Error("Failed");
} catch (error) {
  console.log(error.stack);
}
```

A stack trace usually includes:

- the error message
- the function where it happened
- the chain of function calls
- file names and line numbers

Stack traces are mainly for debugging.

Do not show raw stack traces to end users.

## Best Practices

Read `error.name` and `error.message` when debugging.

Use `instanceof` when you need different handling for different error types.

Handle expected errors specifically.

Rethrow unexpected errors.

Do not show internal stack traces to users.

## Common Mistakes

### Mistake 1: Treating All Errors the Same

```js
catch (error) {
  return null;
}
```

This might hide serious bugs.

Handle what you expect.

Rethrow what you do not understand.

### Mistake 2: Confusing `ReferenceError` and `TypeError`

```js
missingVariable; // ReferenceError
```

```js
null.name; // TypeError
```

Reference means the name does not exist.

Type means the value exists but cannot be used that way.

### Mistake 3: Ignoring the Stack Trace

The stack trace often points directly to where the problem started.

Use it while debugging.

## Quick Check

What kind of error is this?

```js
console.log(total);
```

If `total` was never declared, it is a `ReferenceError`.

What kind of error is this?

```js
const user = undefined;
console.log(user.name);
```

It is a `TypeError`.

## Summary

JavaScript has several built-in error types.

- `Error` is the general error type.
- `ReferenceError` means a variable name cannot be found.
- `TypeError` means a value is being used in an invalid way.
- `SyntaxError` means code or JSON syntax is invalid.
- `RangeError` means a value is outside an allowed range.
- Use `instanceof` to handle specific error types.
- Stack traces help with debugging.
