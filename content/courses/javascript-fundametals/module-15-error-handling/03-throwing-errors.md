# Throwing Errors

Sometimes your code should stop because something invalid happened.

In JavaScript, you can create that failure with `throw`.

```js
throw new Error("Something went wrong");
```

Throwing an error interrupts normal execution.

JavaScript looks for the nearest matching `catch` block.

## Basic Example

```js
function divide(a, b) {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }

  return a / b;
}

try {
  console.log(divide(10, 0));
} catch (error) {
  console.log(error.message); // Cannot divide by zero
}
```

The function refuses to return an invalid result.

## The `throw` Statement

Syntax:

```js
throw expression;
```

You can technically throw any value:

```js
throw "Failed";
throw 123;
throw { message: "Failed" };
```

But best practice is to throw `Error` objects.

```js
throw new Error("Failed");
```

Error objects include useful debugging information such as:

- `name`
- `message`
- `stack`

## Why Throw Errors?

Throw errors when a function cannot do its job correctly.

Example:

```js
function createUser(name) {
  if (!name) {
    throw new Error("Name is required");
  }

  return {
    name,
    active: true,
  };
}
```

Returning a fake user with invalid data would hide the problem.

Throwing makes the failure clear.

## Validation Example

```js
function setAge(age) {
  if (!Number.isInteger(age)) {
    throw new Error("Age must be an integer");
  }

  if (age < 0) {
    throw new Error("Age cannot be negative");
  }

  return age;
}
```

This protects the function's assumptions.

The rest of the program can trust that returned ages are valid.

## Throwing Stops Execution

```js
function example() {
  console.log("Before");
  throw new Error("Failed");
  console.log("After");
}

try {
  example();
} catch (error) {
  console.log("Caught");
}
```

Output:

```text
Before
Caught
```

`"After"` never runs.

## Rethrowing Errors

Sometimes a function catches an error but cannot fully handle it.

It can rethrow the error.

```js
function parseConfig(json) {
  try {
    return JSON.parse(json);
  } catch (error) {
    console.log("Config parsing failed");
    throw error;
  }
}
```

The caller can catch it later.

You can also wrap it with more context.

```js
function parseConfig(json) {
  try {
    return JSON.parse(json);
  } catch (error) {
    throw new Error(`Invalid config: ${error.message}`);
  }
}
```

## Throwing in Constructors

Constructors can throw when invalid instances should not exist.

```js
class Product {
  constructor(name, price) {
    if (price < 0) {
      throw new Error("Price cannot be negative");
    }

    this.name = name;
    this.price = price;
  }
}
```

This prevents creating invalid products.

## Throwing vs Returning `null`

Sometimes a function can return `null` for a normal "not found" result.

```js
function findUser(users, id) {
  return users.find((user) => user.id === id) ?? null;
}
```

This is not necessarily an error.

But invalid input may deserve an error.

```js
function findUser(users, id) {
  if (!Array.isArray(users)) {
    throw new Error("users must be an array");
  }

  return users.find((user) => user.id === id) ?? null;
}
```

Use judgment.

Not every absence is an exception.

## Best Practices

Throw `Error` objects, not strings.

Use clear error messages.

Throw when a function cannot complete its responsibility.

Do not use errors for normal control flow.

Validate inputs at important boundaries.

Rethrow errors when the current function cannot handle them.

## Common Mistakes

### Mistake 1: Throwing Strings

```js
throw "Invalid user";
```

Prefer:

```js
throw new Error("Invalid user");
```

### Mistake 2: Catching Errors Too Early

If a low-level function cannot recover, it may be better to let the caller handle the error.

### Mistake 3: Using Errors for Expected Results

```js
function findUser(users, id) {
  const user = users.find((user) => user.id === id);

  if (!user) {
    throw new Error("User not found");
  }
}
```

If "not found" is a normal possibility, returning `null` may be clearer.

## Quick Check

What does this log?

```js
function test() {
  throw new Error("Failed");
  return "Done";
}

try {
  console.log(test());
} catch (error) {
  console.log(error.message);
}
```

It logs:

```text
Failed
```

The `return` after `throw` never runs.

## Summary

`throw` creates an error and stops normal execution.

- Throw `Error` objects with useful messages.
- Throw when a function cannot complete correctly.
- Throwing skips the rest of the current execution path.
- A nearby `catch` block can handle the error.
- Rethrow when the current code cannot fully handle the error.
- Do not use errors for normal expected outcomes.
