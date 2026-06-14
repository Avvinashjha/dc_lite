# Custom Errors

Built-in error types are useful, but sometimes your application needs more specific errors.

Examples:

- `ValidationError`
- `AuthenticationError`
- `PermissionError`
- `NotFoundError`
- `PaymentError`

Custom errors help make failures easier to identify and handle.

## Why Create Custom Errors?

Imagine this function:

```js
function createUser(data) {
  if (!data.email) {
    throw new Error("Email is required");
  }
}
```

This works.

But if you want to treat validation errors differently from other errors, a custom error is clearer.

```js
throw new ValidationError("Email is required");
```

Now calling code can check:

```js
error instanceof ValidationError
```

## Creating a Custom Error Class

Custom errors usually extend the built-in `Error` class.

```js
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}
```

Use it:

```js
function createUser(data) {
  if (!data.email) {
    throw new ValidationError("Email is required");
  }

  return data;
}
```

Catch it:

```js
try {
  createUser({});
} catch (error) {
  if (error instanceof ValidationError) {
    console.log("Please fix the form");
  } else {
    throw error;
  }
}
```

## Why Call `super(message)`?

`super(message)` calls the parent `Error` constructor.

```js
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}
```

This sets up important error behavior, including the `message` property and stack trace.

In a class that extends another class, you must call `super()` before using `this`.

## Adding Extra Data

Custom errors can include extra information.

```js
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

throw new ValidationError("Email is required", "email");
```

Catch:

```js
try {
  throw new ValidationError("Email is required", "email");
} catch (error) {
  console.log(error.message); // Email is required
  console.log(error.field); // email
}
```

Extra data can help UI code highlight the correct field.

## Multiple Custom Error Types

```js
class NotFoundError extends Error {
  constructor(resource) {
    super(`${resource} was not found`);
    this.name = "NotFoundError";
    this.resource = resource;
  }
}

class PermissionError extends Error {
  constructor(action) {
    super(`You do not have permission to ${action}`);
    this.name = "PermissionError";
    this.action = action;
  }
}
```

Then handle them differently:

```js
try {
  runAction();
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log("Show 404 page");
  } else if (error instanceof PermissionError) {
    console.log("Show access denied message");
  } else {
    throw error;
  }
}
```

## Custom Errors in Application Boundaries

Custom errors are useful at boundaries:

- form validation
- API request handling
- authentication
- authorization
- parsing external data
- business rules

Example:

```js
class AuthenticationError extends Error {
  constructor(message = "You must be logged in") {
    super(message);
    this.name = "AuthenticationError";
  }
}

function requireUser(user) {
  if (!user) {
    throw new AuthenticationError();
  }

  return user;
}
```

## Do Not Create Custom Errors for Everything

Custom errors are helpful when code needs to distinguish between failure categories.

They are unnecessary when a simple message is enough.

Good custom error use:

```js
throw new ValidationError("Email is required", "email");
```

Probably unnecessary:

```js
throw new ButtonClickError("Button was clicked wrong");
```

Use custom errors when they improve handling, not just naming.

## Best Practices

Extend `Error`.

Call `super(message)`.

Set a useful `name`.

Add extra properties only when they are useful.

Use `instanceof` to handle custom error types.

Rethrow errors you do not understand.

Avoid creating too many custom error classes.

## Common Mistakes

### Mistake 1: Forgetting `super(message)`

```js
class ValidationError extends Error {
  constructor(message) {
    this.name = "ValidationError"; // ReferenceError
  }
}
```

In derived classes, call `super()` before using `this`.

### Mistake 2: Throwing Plain Objects Instead of Errors

```js
throw {
  type: "ValidationError",
  message: "Email is required",
};
```

Prefer a real Error subclass.

### Mistake 3: Catching a Custom Error and Hiding All Others

```js
catch (error) {
  console.log("Validation failed");
}
```

Check the type:

```js
if (error instanceof ValidationError) {
  console.log("Validation failed");
} else {
  throw error;
}
```

## Quick Check

What does this log?

```js
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

const error = new ValidationError("Invalid email");

console.log(error instanceof Error);
console.log(error instanceof ValidationError);
```

It logs:

```text
true
true
```

## Summary

Custom errors represent application-specific failures.

- Create custom errors by extending `Error`.
- Call `super(message)` in the constructor.
- Set a useful `name`.
- Add extra properties when helpful.
- Use `instanceof` to handle specific custom errors.
- Rethrow unexpected errors.
- Use custom errors when they improve handling and clarity.
