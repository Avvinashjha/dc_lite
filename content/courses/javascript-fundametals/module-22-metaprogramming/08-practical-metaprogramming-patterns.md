# Practical Metaprogramming Patterns

Metaprogramming tools can be exciting because they let you change how objects behave.

They can also make code harder to read.

This lesson focuses on practical patterns and when to choose simpler alternatives.

## Pattern: Object Inspection

Inspection is useful for debugging, logging, testing, and building small utilities.

```js
function describeObject(object) {
  return Reflect.ownKeys(object).map((key) => {
    const descriptor = Object.getOwnPropertyDescriptor(object, key);

    return {
      key: String(key),
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      kind: "value" in descriptor ? "data" : "accessor",
    };
  });
}

const id = Symbol("id");

const user = {
  name: "Ava",
  [id]: "u_123",
};

Object.defineProperty(user, "internal", {
  value: true,
  enumerable: false,
});

console.log(describeObject(user));
```

This utility sees more than `Object.keys()` because it uses `Reflect.ownKeys()`.

## Pattern: Non-Enumerable Metadata

Sometimes you want to attach metadata without including it in normal loops or JSON output.

```js
function attachMetadata(object, metadata) {
  Object.defineProperty(object, "__metadata", {
    value: metadata,
    enumerable: false,
    writable: false,
    configurable: true,
  });

  return object;
}

const user = attachMetadata(
  { name: "Ava" },
  { loadedAt: new Date().toISOString() }
);

console.log(Object.keys(user)); // ["name"]
console.log(user.__metadata);
```

This can be useful for framework-like code, caching, or debugging.

Remember that non-enumerable metadata is still accessible.

## Pattern: Symbol Metadata

Symbols reduce the chance of colliding with user-defined string keys.

```js
const metadataKey = Symbol("metadata");

function attachMetadata(object, metadata) {
  object[metadataKey] = metadata;
  return object;
}

const user = attachMetadata(
  { name: "Ava" },
  { source: "api" }
);

console.log(user[metadataKey]); // { source: "api" }
console.log(Object.keys(user)); // ["name"]
```

This pattern is common in library code where objects may come from users.

The symbol key avoids accidental overlap with a normal `"metadata"` property.

## Pattern: Read-Only Public Values

Descriptors can expose values that should not be reassigned.

```js
const constants = {};

Object.defineProperty(constants, "API_VERSION", {
  value: "v1",
  writable: false,
  enumerable: true,
  configurable: false,
});

console.log(constants.API_VERSION); // "v1"
```

This can be useful for constants on library objects.

In application code, `const API_VERSION = "v1"` is usually simpler.

## Pattern: Validated Assignment

Setters or proxies can validate assignment.

Setter example:

```js
const user = {
  _email: "",

  get email() {
    return this._email;
  },

  set email(value) {
    if (!value.includes("@")) {
      throw new TypeError("Invalid email");
    }

    this._email = value;
  },
};

user.email = "ava@example.com";
```

Proxy example:

```js
function withValidation(object, rules) {
  return new Proxy(object, {
    set(target, property, value, receiver) {
      const validate = rules[property];

      if (validate && !validate(value)) {
        throw new TypeError(`Invalid value for ${String(property)}`);
      }

      return Reflect.set(target, property, value, receiver);
    },
  });
}

const user = withValidation(
  { email: "ava@example.com" },
  {
    email: (value) => value.includes("@"),
  }
);

user.email = "mia@example.com";
```

Validation hidden behind assignment can be convenient, but explicit validation functions are often easier for teams to follow.

## Pattern: Default Values

Proxies can provide default values for missing properties.

```js
function withDefaults(object, defaults) {
  return new Proxy(object, {
    get(target, property, receiver) {
      if (Reflect.has(target, property)) {
        return Reflect.get(target, property, receiver);
      }

      return Reflect.get(defaults, property);
    },
  });
}

const settings = withDefaults(
  { theme: "dark" },
  { theme: "light", pageSize: 20 }
);

console.log(settings.theme); // "dark"
console.log(settings.pageSize); // 20
```

This can be useful for configuration objects.

Be careful when a missing property should be a bug. A default can hide spelling mistakes.

```js
console.log(settings.pagesize); // undefined
```

The misspelled property did not fail loudly.

## Pattern: Logging and Debugging

A proxy can trace property access.

```js
function traceObject(object, label) {
  return new Proxy(object, {
    get(target, property, receiver) {
      console.log(`[${label}] get ${String(property)}`);
      return Reflect.get(target, property, receiver);
    },

    set(target, property, value, receiver) {
      console.log(`[${label}] set ${String(property)} = ${value}`);
      return Reflect.set(target, property, value, receiver);
    },
  });
}

const user = traceObject({ name: "Ava" }, "user");

user.name;
user.name = "Mia";
```

This can help during debugging or teaching.

Remove or isolate tracing before production if it creates noisy logs or performance concerns.

## Pattern: Function Wrapping

The `apply` trap can wrap a function call.

```js
function withTiming(fn, label) {
  return new Proxy(fn, {
    apply(target, thisArgument, argumentsList) {
      const start = performance.now();

      try {
        return Reflect.apply(target, thisArgument, argumentsList);
      } finally {
        const duration = performance.now() - start;
        console.log(`${label} took ${duration.toFixed(2)}ms`);
      }
    },
  });
}

function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

const timedTotal = withTiming(calculateTotal, "calculateTotal");

timedTotal([{ price: 10 }, { price: 15 }]);
```

This pattern can support metrics, logging, or access control.

For many cases, a normal wrapper function is simpler.

```js
function withTiming(fn, label) {
  return (...args) => {
    const start = performance.now();

    try {
      return fn(...args);
    } finally {
      const duration = performance.now() - start;
      console.log(`${label} took ${duration.toFixed(2)}ms`);
    }
  };
}
```

Choose the simpler wrapper unless you specifically need proxy behavior.

## Pattern: Custom Iteration

Objects that represent collections can define `Symbol.iterator`.

```js
const team = {
  members: ["Ava", "Mia", "Noah"],

  *[Symbol.iterator]() {
    for (const member of this.members) {
      yield member;
    }
  },
};

console.log([...team]); // ["Ava", "Mia", "Noah"]
```

This can make domain objects pleasant to use with JavaScript's iteration tools.

Avoid making every object iterable just because you can.

## Metadata-Like Patterns in JavaScript

JavaScript does not have one universal built-in metadata system for ordinary objects.

Instead, you often see metadata represented with:

- non-enumerable properties
- symbol properties
- WeakMaps
- naming conventions
- framework-specific APIs

`WeakMap` is especially useful when metadata should not appear on the object at all.

```js
const metadata = new WeakMap();

function attachMetadata(object, value) {
  metadata.set(object, value);
  return object;
}

function getMetadata(object) {
  return metadata.get(object);
}

const user = attachMetadata({ name: "Ava" }, { source: "api" });

console.log(getMetadata(user)); // { source: "api" }
console.log(Reflect.ownKeys(user)); // ["name"]
```

The metadata is stored outside the object.

When the object can be garbage collected, its WeakMap metadata can be collected too.

## When Not to Use Metaprogramming

Avoid metaprogramming when ordinary code is clearer.

Prefer this:

```js
function validateUser(user) {
  if (!user.email.includes("@")) {
    throw new TypeError("Invalid email");
  }
}
```

Over a proxy if validation only happens in one obvious place.

Prefer this:

```js
const names = users.map((user) => user.name);
```

Over custom iteration if the data is already a normal array.

Metaprogramming is best when it removes repeated infrastructure code or creates a clear, reusable interface.

## Common Mistake: Hiding Too Much Behavior

This line looks simple:

```js
user.email = "bad-value";
```

With metaprogramming, it might:

- call a setter
- trigger a proxy `set` trap
- validate the value
- throw an error
- write to a different object
- log the change

That power is useful only when the team can still understand the code.

If behavior is surprising, make it more explicit.

## Best Practices

Start with normal JavaScript syntax.

Reach for descriptors, symbols, `Reflect`, and proxies only when they solve a real problem.

Keep metaprogramming behavior small, documented, and tested.

Prefer `Reflect` inside proxy traps to preserve default behavior.

Do not use non-enumerable or symbol properties as secrets.

Be careful with performance-sensitive code.

## Summary

JavaScript metaprogramming is practical when used with restraint.

Descriptors can control property behavior, symbols can avoid key collisions, iterators can customize loops, `Reflect` can express object operations, and proxies can intercept behavior.

The best metaprogramming code makes an interface clearer. The worst hides important behavior behind ordinary-looking syntax.
