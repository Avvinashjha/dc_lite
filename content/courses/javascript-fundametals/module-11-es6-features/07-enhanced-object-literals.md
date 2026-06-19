# Enhanced Object Literals

ES6 made object literals easier to write.

These improvements are called enhanced object literals.

They include:

- property shorthand
- method shorthand
- computed property names
- cleaner object creation patterns

You already saw some of these ideas in the Objects module.

This lesson brings them together as modern JavaScript syntax.

## Property Shorthand

Before ES6, object properties often repeated the same name twice.

```js
const name = "Alice";
const role = "admin";

const user = {
  name: name,
  role: role,
};
```

With property shorthand:

```js
const name = "Alice";
const role = "admin";

const user = {
  name,
  role,
};
```

Both create:

```js
{
  name: "Alice",
  role: "admin"
}
```

Use shorthand when the variable name and property name are the same.

## Method Shorthand

Before ES6:

```js
const user = {
  name: "Alice",
  greet: function () {
    return `Hello, ${this.name}`;
  },
};
```

Modern method shorthand:

```js
const user = {
  name: "Alice",
  greet() {
    return `Hello, ${this.name}`;
  },
};
```

This is shorter and easier to read.

It is also the preferred style for object methods that use `this`.

## Computed Property Names

Computed property names let you create object keys dynamically.

```js
const field = "email";

const user = {
  name: "Alice",
  [field]: "alice@example.com",
};

console.log(user.email); // alice@example.com
```

The expression inside `[]` is evaluated.

This is useful for forms, settings, and dynamic data.

```js
const settingName = "darkMode";

const settings = {
  [settingName]: true,
};

console.log(settings.darkMode); // true
```

## Combining Shorthand Features

Modern object literals often combine several ES6 features.

```js
function createUser(name, role) {
  return {
    name,
    role,
    active: true,
    describe() {
      return `${this.name} is an ${this.role}`;
    },
  };
}

const user = createUser("Alice", "admin");

console.log(user.describe()); // Alice is an admin
```

This object uses:

- property shorthand
- method shorthand
- a normal property
- `this` inside a method

## Dynamic Object Updates

Computed property names are common when updating data based on a field name.

```js
function updateUser(user, field, value) {
  return {
    ...user,
    [field]: value,
  };
}

const user = {
  name: "Alice",
  role: "user",
};

const updated = updateUser(user, "role", "admin");

console.log(updated);
// { name: "Alice", role: "admin" }
```

This pattern is used often in forms.

## Object Literals as Return Values

Enhanced object literals make factory functions concise.

```js
function createCounter() {
  let count = 0;

  return {
    increment() {
      count += 1;
      return count;
    },
    reset() {
      count = 0;
      return count;
    },
  };
}
```

The returned object contains methods that share the same closure.

This combines objects, functions, and closures.

## Avoid Arrow Methods That Need `this`

Do not use arrow functions for object methods that need dynamic `this`.

```js
const user = {
  name: "Alice",
  greet: () => `Hello, ${this.name}`,
};
```

Use method shorthand:

```js
const user = {
  name: "Alice",
  greet() {
    return `Hello, ${this.name}`;
  },
};
```

This connects back to the `this` module.

## Best Practices

Use property shorthand when possible:

```js
const user = { name, role };
```

Use method shorthand for object methods:

```js
const user = {
  greet() {
    return "Hello";
  },
};
```

Use computed property names for dynamic keys:

```js
const object = { [key]: value };
```

Keep object literals readable.

If an object becomes too large, consider breaking logic into functions.

## Common Mistakes

### Mistake 1: Forgetting Brackets for Dynamic Keys

```js
const key = "email";

const user = {
  key: "alice@example.com",
};
```

This creates a property named `key`.

Correct:

```js
const user = {
  [key]: "alice@example.com",
};
```

### Mistake 2: Using Shorthand When No Variable Exists

```js
const user = {
  name,
};
```

This only works if a variable named `name` exists in scope.

### Mistake 3: Using Arrow Functions for Methods That Need `this`

```js
const user = {
  name: "Alice",
  greet: () => this.name,
};
```

Use method shorthand instead.

## Summary

Enhanced object literals make objects cleaner and more expressive.

- Property shorthand avoids repetition.
- Method shorthand is the modern way to write object methods.
- Computed property names create dynamic keys.
- These features combine well with spread and destructuring.
- Use method shorthand when a method needs `this`.
