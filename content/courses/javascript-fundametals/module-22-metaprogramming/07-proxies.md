# Proxies

A proxy wraps an object or function and intercepts operations performed on it.

```js
const target = {
  name: "Ava",
};

const proxy = new Proxy(target, {
  get(target, property, receiver) {
    console.log(`Reading ${String(property)}`);
    return Reflect.get(target, property, receiver);
  },
});

console.log(proxy.name);
```

Output:

```text
Reading name
Ava
```

The proxy lets you customize behavior without changing every place that reads the object.

## Proxy Terminology

`new Proxy(target, handler)` takes two arguments.

| Term | Meaning |
| --- | --- |
| `target` | the original object or function being wrapped |
| `handler` | an object containing trap methods |
| trap | a method that intercepts an operation |

Example:

```js
const proxy = new Proxy(target, handler);
```

If the handler does not define a trap for an operation, JavaScript forwards the operation to the target normally.

## The get Trap

The `get` trap runs when a property is read.

```js
const user = {
  name: "Ava",
};

const proxy = new Proxy(user, {
  get(target, property, receiver) {
    if (property === "displayName") {
      return target.name.toUpperCase();
    }

    return Reflect.get(target, property, receiver);
  },
});

console.log(proxy.name); // "Ava"
console.log(proxy.displayName); // "AVA"
```

Use `Reflect.get()` to preserve normal behavior for properties you do not handle specially.

## The set Trap

The `set` trap runs when a property is assigned.

```js
const user = {
  name: "Ava",
  age: 30,
};

const proxy = new Proxy(user, {
  set(target, property, value, receiver) {
    if (property === "age" && value < 0) {
      throw new RangeError("Age cannot be negative");
    }

    return Reflect.set(target, property, value, receiver);
  },
});

proxy.age = 31;
console.log(user.age); // 31

proxy.age = -1; // RangeError
```

The `set` trap should return `true` for success and `false` for failure.

`Reflect.set()` returns that boolean for you.

## The has Trap

The `has` trap runs when code uses the `in` operator.

```js
const user = {
  name: "Ava",
  passwordHash: "hashed-value",
};

const proxy = new Proxy(user, {
  has(target, property) {
    if (property === "passwordHash") {
      return false;
    }

    return Reflect.has(target, property);
  },
});

console.log("name" in proxy); // true
console.log("passwordHash" in proxy); // false
```

This can customize membership checks.

Be careful: hiding information from `in` is not the same as making it private.

## The deleteProperty Trap

The `deleteProperty` trap runs when code deletes a property.

```js
const user = {
  id: "u_123",
  name: "Ava",
};

const proxy = new Proxy(user, {
  deleteProperty(target, property) {
    if (property === "id") {
      throw new Error("Cannot delete id");
    }

    return Reflect.deleteProperty(target, property);
  },
});

delete proxy.name;
console.log(user.name); // undefined

delete proxy.id; // Error
```

Use this sparingly. Deletion rules that differ from normal objects can surprise readers.

## The ownKeys Trap

The `ownKeys` trap runs when code asks for the target's own keys.

```js
const user = {
  name: "Ava",
  passwordHash: "hashed-value",
};

const proxy = new Proxy(user, {
  ownKeys(target) {
    return Reflect.ownKeys(target).filter((key) => key !== "passwordHash");
  },
});

console.log(Reflect.ownKeys(proxy)); // ["name"]
```

Some operations, including `Object.keys()`, use this trap as part of their work.

Proxy traps must obey JavaScript invariants. For example, you cannot hide a non-configurable own property from `ownKeys`.

```js
const target = {};

Object.defineProperty(target, "id", {
  value: "u_123",
  configurable: false,
});

const proxy = new Proxy(target, {
  ownKeys() {
    return [];
  },
});

Reflect.ownKeys(proxy); // TypeError
```

JavaScript protects certain object rules even when proxies are involved.

## The apply Trap

The `apply` trap works when the target is a function and the proxy is called like a function.

```js
function add(a, b) {
  return a + b;
}

const loggedAdd = new Proxy(add, {
  apply(target, thisArgument, argumentsList) {
    console.log(`Calling with ${argumentsList.join(", ")}`);
    return Reflect.apply(target, thisArgument, argumentsList);
  },
});

console.log(loggedAdd(2, 3)); // 5
```

This is useful for logging, timing, validation, or wrapping functions.

## The construct Trap

The `construct` trap works when a function or class proxy is called with `new`.

```js
class User {
  constructor(name) {
    this.name = name;
  }
}

const UserProxy = new Proxy(User, {
  construct(target, argumentsList, newTarget) {
    console.log(`Creating user: ${argumentsList[0]}`);
    return Reflect.construct(target, argumentsList, newTarget);
  },
});

const user = new UserProxy("Ava");

console.log(user.name); // "Ava"
```

The `construct` trap must return an object.

## Practical Example: Validation

```js
function createValidatedUser(user) {
  return new Proxy(user, {
    set(target, property, value, receiver) {
      if (property === "email" && !value.includes("@")) {
        throw new TypeError("Email must contain @");
      }

      if (property === "age" && value < 0) {
        throw new RangeError("Age cannot be negative");
      }

      return Reflect.set(target, property, value, receiver);
    },
  });
}

const user = createValidatedUser({
  email: "ava@example.com",
  age: 30,
});

user.email = "mia@example.com";
user.age = -5; // RangeError
```

This can be useful for small validation layers or learning.

For larger apps, explicit validation functions are often easier to debug and test.

## Practical Example: Default Values

```js
const defaults = {
  theme: "light",
  pageSize: 20,
};

const settings = new Proxy(
  {
    theme: "dark",
  },
  {
    get(target, property, receiver) {
      if (Reflect.has(target, property)) {
        return Reflect.get(target, property, receiver);
      }

      return Reflect.get(defaults, property);
    },
  }
);

console.log(settings.theme); // "dark"
console.log(settings.pageSize); // 20
```

This pattern can make fallback behavior feel natural.

Keep it documented so readers know missing properties may come from defaults.

## Revocable Proxies

`Proxy.revocable()` creates a proxy that can be disabled.

```js
const target = {
  name: "Ava",
};

const { proxy, revoke } = Proxy.revocable(target, {});

console.log(proxy.name); // "Ava"

revoke();

console.log(proxy.name); // TypeError
```

This is useful for temporary access patterns, though it is less common in everyday code.

## Common Mistake: Forgetting to Delegate

A trap replaces the default behavior for that operation.

```js
const user = {
  name: "Ava",
};

const proxy = new Proxy(user, {
  get(target, property) {
    console.log(property);
  },
});

console.log(proxy.name); // undefined
```

The trap did not return the original property value.

Usually, traps should either handle the operation intentionally or delegate with `Reflect`.

```js
const proxy = new Proxy(user, {
  get(target, property, receiver) {
    console.log(property);
    return Reflect.get(target, property, receiver);
  },
});
```

## Proxy Cautions

Proxies are powerful, but they can make code harder to understand.

Property reads may run arbitrary code.

Assignments may validate, reject, log, or redirect data.

Some JavaScript engine optimizations may be harder with proxies.

Many built-in objects have internal behavior that proxies cannot perfectly imitate.

Use proxies when the benefit is clear.

## Best Practices

Prefer plain objects, classes, functions, and explicit validation for common application code.

Use proxies for cross-cutting object behavior, library utilities, debugging helpers, and controlled experiments.

Delegate to `Reflect` when you want normal behavior plus a small customization.

Keep proxy traps small and predictable.

Document proxy behavior because it is not visible at the call site.

## Summary

A proxy intercepts operations on an object or function through traps.

Important traps include `get`, `set`, `has`, `deleteProperty`, `ownKeys`, `apply`, and `construct`.

Proxies are one of JavaScript's strongest metaprogramming tools, but they should be used carefully because they can hide behavior behind ordinary-looking syntax.
