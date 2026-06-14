# try / catch Blocks

Errors are a normal part of programming.

Files may be missing.

User input may be invalid.

JSON may be malformed.

Network requests may fail.

Good JavaScript code does not pretend errors cannot happen. It handles expected failures clearly.

## What Is `try...catch`?

`try...catch` lets you run code that might throw an error and respond without crashing the whole program.

```js
try {
  const result = JSON.parse("{ bad json }");
  console.log(result);
} catch (error) {
  console.log("Could not parse JSON");
}
```

The code inside `try` runs first.

If an error is thrown, JavaScript jumps to `catch`.

## Basic Syntax

```js
try {
  // code that might throw
} catch (error) {
  // handle the error
}
```

Example:

```js
try {
  const user = JSON.parse('{"name":"Alice"}');
  console.log(user.name);
} catch (error) {
  console.log("Invalid JSON");
}
```

If parsing succeeds, `catch` does not run.

If parsing fails, `catch` runs.

## The Error Object

The `catch` block receives an error object.

```js
try {
  JSON.parse("{ bad json }");
} catch (error) {
  console.log(error.name);
  console.log(error.message);
}
```

Common error properties:

| Property | Meaning |
| --- | --- |
| `name` | The error type name |
| `message` | Human-readable explanation |
| `stack` | Stack trace showing where the error happened |

Example output:

```text
SyntaxError
Expected property name or '}' in JSON
```

The exact message can vary by JavaScript engine.

## Code After an Error in `try`

When an error is thrown, the rest of the `try` block is skipped.

```js
try {
  console.log("Before");
  JSON.parse("{ bad json }");
  console.log("After");
} catch (error) {
  console.log("Caught error");
}
```

Output:

```text
Before
Caught error
```

`"After"` never logs.

## Catching Synchronous Errors

`try...catch` catches synchronous errors.

```js
try {
  const value = missingVariable;
} catch (error) {
  console.log("Something went wrong");
}
```

This catches the `ReferenceError`.

It also catches errors from functions called inside the `try`.

```js
function parseUser(json) {
  return JSON.parse(json);
}

try {
  parseUser("{ bad json }");
} catch (error) {
  console.log("Could not parse user");
}
```

## What `try...catch` Does Not Catch

A normal `try...catch` does not catch asynchronous errors that happen later.

```js
try {
  setTimeout(() => {
    throw new Error("Timer failed");
  }, 1000);
} catch (error) {
  console.log("Caught");
}
```

The `catch` block does not catch this timer error because the `try` block has already finished.

Asynchronous error handling uses callbacks, promises, `.catch()`, or `try...catch` with `async/await`.

You will learn that in the asynchronous modules.

## When Should You Use `try...catch`?

Use `try...catch` when:

- an operation can reasonably fail
- you can recover from the failure
- you want to show a useful message
- you need to add context before rethrowing
- you are parsing external data

Good example:

```js
function parseSettings(json) {
  try {
    return JSON.parse(json);
  } catch (error) {
    return {
      theme: "light",
      notifications: true,
    };
  }
}
```

The function returns defaults if parsing fails.

## Do Not Catch Errors You Cannot Handle

Avoid catching errors just to hide them.

```js
try {
  runImportantLogic();
} catch (error) {
  // do nothing
}
```

This is dangerous.

It hides bugs and makes debugging harder.

If you catch an error, do something useful:

- log it
- show a message
- return a safe fallback
- rethrow it with more context

## Rethrowing Errors

Sometimes you catch an error, add context, and throw it again.

```js
function loadConfig(json) {
  try {
    return JSON.parse(json);
  } catch (error) {
    throw new Error(`Could not load config: ${error.message}`);
  }
}
```

The caller can decide what to do next.

## Best Practices

Keep `try` blocks focused.

```js
try {
  const user = JSON.parse(json);
  return user;
} catch (error) {
  return null;
}
```

Avoid wrapping huge sections of unrelated code in one `try`.

Use meaningful fallback behavior.

Do not silently ignore errors.

Use the error object for debugging.

## Common Mistakes

### Mistake 1: Catching and Ignoring

```js
try {
  riskyOperation();
} catch (error) {}
```

This hides problems.

At minimum, log or handle the error intentionally.

### Mistake 2: Expecting `try...catch` to Catch Future Async Errors

```js
try {
  setTimeout(() => {
    throw new Error("Failed");
  }, 1000);
} catch (error) {
  console.log("Caught");
}
```

This does not catch the timer error.

### Mistake 3: Catching Too Broadly

```js
try {
  // 100 lines of unrelated code
} catch (error) {
  console.log("Something failed");
}
```

This makes it harder to know what failed.

## Quick Check

What does this log?

```js
try {
  console.log("A");
  JSON.parse("{ bad json }");
  console.log("B");
} catch (error) {
  console.log("C");
}
```

It logs:

```text
A
C
```

The error skips the rest of the `try` block.

## Summary

`try...catch` handles errors thrown during synchronous code execution.

- Put risky code in `try`.
- Handle errors in `catch`.
- The `catch` block receives an error object.
- Code after a thrown error inside `try` is skipped.
- Do not silently ignore caught errors.
- `try...catch` does not catch asynchronous errors that happen later.
