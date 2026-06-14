# Factory Pattern

The factory pattern centralizes object creation.

Instead of creating objects directly in many places, you call a function or method that returns the object you need.

A factory is useful when creation involves:

- defaults
- validation
- choosing between object types
- shared setup
- hiding implementation details

## Simple Factory Function

```js
function createUser(name, role = "member") {
  return {
    id: crypto.randomUUID(),
    name,
    role,
    active: true,
  };
}

const user = createUser("Ada");
```

The calling code does not need to remember every property.

The factory creates a consistent shape.

## Factory With Validation

```js
function createProduct({ name, price }) {
  if (!name) {
    throw new Error("Product name is required");
  }

  if (price < 0) {
    throw new Error("Price cannot be negative");
  }

  return {
    name,
    price,
    available: true,
  };
}
```

Now invalid objects are harder to create.

## Choosing Between Types

A factory can choose which object to create based on input.

```js
function createNotification(type, message) {
  if (type === "email") {
    return {
      send() {
        console.log(`Sending email: ${message}`);
      },
    };
  }

  if (type === "sms") {
    return {
      send() {
        console.log(`Sending SMS: ${message}`);
      },
    };
  }

  throw new Error(`Unknown notification type: ${type}`);
}

const notification = createNotification("email", "Welcome!");
notification.send();
```

The caller uses the same `send()` method no matter which object was created.

## Factory With Classes

Factories can return class instances too.

```js
class EmailNotification {
  constructor(message) {
    this.message = message;
  }

  send() {
    console.log(`Sending email: ${this.message}`);
  }
}

class SmsNotification {
  constructor(message) {
    this.message = message;
  }

  send() {
    console.log(`Sending SMS: ${this.message}`);
  }
}

function createNotification(type, message) {
  const notifications = {
    email: EmailNotification,
    sms: SmsNotification,
  };

  const NotificationClass = notifications[type];

  if (!NotificationClass) {
    throw new Error(`Unknown notification type: ${type}`);
  }

  return new NotificationClass(message);
}
```

The factory hides the `new` keyword from the calling code.

## Object Maps Instead of Long Conditionals

When a factory chooses between many options, an object map can be cleaner than many `if` statements.

```js
const formatters = {
  currency(value) {
    return `$${value.toFixed(2)}`;
  },
  percent(value) {
    return `${value * 100}%`;
  },
  uppercase(value) {
    return String(value).toUpperCase();
  },
};

function createFormatter(type) {
  const formatter = formatters[type];

  if (!formatter) {
    throw new Error(`Unknown formatter: ${type}`);
  }

  return formatter;
}
```

This keeps each option easy to find.

## Factory vs Constructor

A constructor creates one specific kind of object.

```js
const date = new Date();
```

A factory can decide what to return.

```js
const formatter = createFormatter(user.preference);
```

Factories can also return plain objects, functions, class instances, cached objects, or mock objects.

## Testing Benefits

Factories can make tests easier when they provide consistent test data.

```js
function createTestUser(overrides = {}) {
  return {
    id: "user-1",
    name: "Test User",
    role: "member",
    ...overrides,
  };
}

const admin = createTestUser({ role: "admin" });
```

This avoids repeating object setup in every test.

## Common Mistakes

### Hiding Too Much

A factory should make creation clearer.

If it hides important behavior, callers may be surprised.

### Returning Inconsistent Shapes

If one factory branch returns `{ send() {} }` and another returns `{ deliver() {} }`, callers must know too much.

Try to return objects with a shared interface.

### Making Every Object Use a Factory

If object creation is simple and local, an object literal may be enough.

```js
const point = { x: 10, y: 20 };
```

No factory is needed here.

## Best Practices

- Use factories for repeated or complex creation.
- Keep returned objects consistent.
- Validate inputs at the creation boundary.
- Use clear names like `createUser`, `createLogger`, or `createFormatter`.
- Prefer plain factory functions before adding classes.
- Keep factory logic small enough to understand.

## Summary

The factory pattern puts object creation in one place.

It helps keep object shapes consistent, apply defaults, validate inputs, and choose between implementations.

Use it when creation has real logic, not just because an object exists.

