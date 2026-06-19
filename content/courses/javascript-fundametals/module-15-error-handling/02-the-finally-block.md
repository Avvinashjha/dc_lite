# The finally Block

The `finally` block runs after `try` and `catch`, whether an error happened or not.

```js
try {
  console.log("Trying");
} catch (error) {
  console.log("Caught");
} finally {
  console.log("Finished");
}
```

Output:

```text
Trying
Finished
```

`finally` is useful for cleanup.

## Basic Syntax

```js
try {
  // risky code
} catch (error) {
  // handle error
} finally {
  // always runs
}
```

Example with an error:

```js
try {
  JSON.parse("{ bad json }");
} catch (error) {
  console.log("Invalid JSON");
} finally {
  console.log("Parse attempt finished");
}
```

Output:

```text
Invalid JSON
Parse attempt finished
```

## `finally` Runs on Success

```js
try {
  const user = JSON.parse('{"name":"Alice"}');
  console.log(user.name);
} catch (error) {
  console.log("Invalid JSON");
} finally {
  console.log("Done");
}
```

Output:

```text
Alice
Done
```

Even though no error occurred, `finally` still runs.

## `finally` Runs on Failure

```js
try {
  JSON.parse("{ bad json }");
  console.log("Success");
} catch (error) {
  console.log("Failure");
} finally {
  console.log("Done");
}
```

Output:

```text
Failure
Done
```

## `finally` Runs Before Control Leaves

`finally` runs even when the `try` or `catch` block returns.

```js
function parseUser(json) {
  try {
    return JSON.parse(json);
  } catch (error) {
    return null;
  } finally {
    console.log("parseUser finished");
  }
}

parseUser('{"name":"Alice"}');
```

Output:

```text
parseUser finished
```

The function returns, but `finally` runs first.

## Cleanup Use Cases

Use `finally` for cleanup work that should happen no matter what.

Examples:

- stop a loading spinner
- close a file or connection
- release a lock
- reset temporary state
- log that an operation completed

Example:

```js
let isLoading = true;

try {
  const data = JSON.parse(responseText);
  console.log(data);
} catch (error) {
  console.log("Could not parse response");
} finally {
  isLoading = false;
}
```

Whether parsing succeeds or fails, loading ends.

## `try...finally` Without `catch`

You can use `try...finally` without `catch`.

```js
function runTask() {
  try {
    console.log("Running task");
    throw new Error("Task failed");
  } finally {
    console.log("Cleaning up");
  }
}
```

The error is not handled.

It still continues upward after `finally` runs.

This is useful when the current function cannot handle the error but must clean up.

## Be Careful Returning From `finally`

Returning from `finally` can override returns from `try` or `catch`.

```js
function example() {
  try {
    return "try";
  } finally {
    return "finally";
  }
}

console.log(example()); // finally
```

This is usually confusing.

Avoid `return` inside `finally`.

## Be Careful Throwing From `finally`

Throwing from `finally` can hide the original error.

```js
try {
  throw new Error("Original error");
} finally {
  throw new Error("Finally error");
}
```

The `finally` error replaces the original one.

This can make debugging harder.

Keep `finally` blocks simple and safe.

## Best Practices

Use `finally` for cleanup.

Keep `finally` short.

Avoid returning from `finally`.

Avoid throwing from `finally` unless absolutely necessary.

Use `finally` to reset state that must be reset on success or failure.

## Common Mistakes

### Mistake 1: Thinking `finally` Runs Only on Errors

`finally` runs on success and failure.

```js
try {
  console.log("Success");
} finally {
  console.log("Always");
}
```

### Mistake 2: Returning From `finally`

```js
function getValue() {
  try {
    return "try";
  } finally {
    return "finally";
  }
}
```

This returns `"finally"`, which can surprise readers.

### Mistake 3: Putting Error Handling Only in `finally`

`finally` is for cleanup, not normal error handling.

Use `catch` to handle errors.

## Quick Check

What does this log?

```js
try {
  console.log("A");
  throw new Error("Failed");
} catch (error) {
  console.log("B");
} finally {
  console.log("C");
}
```

It logs:

```text
A
B
C
```

## Summary

`finally` runs after `try` and `catch`.

- It runs whether an error happens or not.
- It is useful for cleanup.
- It runs before control leaves the block.
- `try...finally` can be used without `catch`.
- Avoid returning from `finally`.
- Avoid throwing from `finally` unless needed.
