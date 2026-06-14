# Symbols and Well-Known Symbols

A symbol is a primitive value that can be used as a unique property key.

```js
const id = Symbol("id");

const user = {
  name: "Ava",
  [id]: "u_123",
};

console.log(user[id]); // "u_123"
```

Symbols are useful when you want a property key that will not accidentally collide with normal string keys.

## Creating Symbols

Use `Symbol()` to create a new symbol.

```js
const first = Symbol("id");
const second = Symbol("id");

console.log(first === second); // false
```

The description helps with debugging, but it does not make symbols equal.

Each call to `Symbol()` creates a unique value.

## Symbols as Property Keys

Use square brackets when using a symbol as a property key.

```js
const statusKey = Symbol("status");

const task = {
  title: "Write docs",
  [statusKey]: "draft",
};

console.log(task[statusKey]); // "draft"
```

Dot notation cannot use a symbol variable.

```js
console.log(task.statusKey); // undefined
```

That checks the string key `"statusKey"`, not the symbol.

## Symbols Are Not Returned by Object.keys()

Symbol keys are skipped by common string-key enumeration.

```js
const id = Symbol("id");

const user = {
  name: "Ava",
  [id]: "u_123",
};

console.log(Object.keys(user)); // ["name"]
console.log(JSON.stringify(user)); // {"name":"Ava"}
```

Use `Object.getOwnPropertySymbols()` to inspect own symbol keys.

```js
console.log(Object.getOwnPropertySymbols(user)); // [Symbol(id)]
```

Use `Reflect.ownKeys()` to include string and symbol keys together.

```js
console.log(Reflect.ownKeys(user)); // ["name", Symbol(id)]
```

## Symbols Are Not Private

Symbols can hide keys from casual enumeration, but they are not private.

```js
const secretKey = Symbol("secret");

const user = {
  name: "Ava",
  [secretKey]: "not really secret",
};

const symbols = Object.getOwnPropertySymbols(user);

console.log(user[symbols[0]]); // "not really secret"
```

If code can access the object, it can discover its symbol keys.

Use symbols to avoid collisions, not to store secrets.

## Symbol.for()

`Symbol.for()` uses a global symbol registry.

```js
const first = Symbol.for("app.userId");
const second = Symbol.for("app.userId");

console.log(first === second); // true
```

This is different from `Symbol()`, which always creates a new symbol.

`Symbol.for()` is useful when separate parts of an application need to agree on the same symbol key.

Use namespaced descriptions to avoid accidental registry collisions.

```js
const pluginKey = Symbol.for("dailycoder.plugin.metadata");
```

## Symbol.keyFor()

`Symbol.keyFor()` returns the registry key for a global symbol.

```js
const key = Symbol.for("app.userId");

console.log(Symbol.keyFor(key)); // "app.userId"
```

It returns `undefined` for local symbols created with `Symbol()`.

```js
const local = Symbol("id");

console.log(Symbol.keyFor(local)); // undefined
```

## Well-Known Symbols

JavaScript has built-in symbols that let objects customize language behavior.

These are called well-known symbols.

Examples include:

| Symbol | Customizes |
| --- | --- |
| `Symbol.iterator` | how an object is iterated |
| `Symbol.toStringTag` | text shown by `Object.prototype.toString` |
| `Symbol.toPrimitive` | how an object converts to a primitive |
| `Symbol.hasInstance` | how `instanceof` behaves |

You do not create these symbols yourself. JavaScript provides them.

## Symbol.toStringTag

`Symbol.toStringTag` customizes the tag used by `Object.prototype.toString.call()`.

```js
const collection = {
  [Symbol.toStringTag]: "UserCollection",
};

console.log(Object.prototype.toString.call(collection));
// "[object UserCollection]"
```

This can make debugging and library output clearer.

## Symbol.toPrimitive

`Symbol.toPrimitive` customizes how an object becomes a primitive value.

```js
const money = {
  amount: 19.99,

  [Symbol.toPrimitive](hint) {
    if (hint === "number") {
      return this.amount;
    }

    return `$${this.amount}`;
  },
};

console.log(Number(money)); // 19.99
console.log(String(money)); // "$19.99"
```

Use this carefully. Implicit conversion can already be hard to follow.

## Symbol.hasInstance

`Symbol.hasInstance` customizes `instanceof`.

```js
class Admin {
  static [Symbol.hasInstance](value) {
    return Boolean(value && value.role === "admin");
  }
}

const user = { role: "admin" };

console.log(user instanceof Admin); // true
```

This is powerful, but it can surprise readers because `instanceof` usually checks prototypes.

Use it rarely.

## Symbol.iterator

`Symbol.iterator` defines how an object works with `for...of`, spread, and other iteration tools.

```js
const numbers = {
  start: 1,
  end: 3,

  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;

    return {
      next() {
        if (current <= end) {
          return { value: current++, done: false };
        }

        return { value: undefined, done: true };
      },
    };
  },
};

console.log([...numbers]); // [1, 2, 3]
```

You will learn more about this in the next lesson.

## Common Mistake: Confusing Descriptions with Identity

Symbol descriptions are labels, not identifiers.

```js
const a = Symbol("id");
const b = Symbol("id");

console.log(a === b); // false
```

If you need shared identity, use `Symbol.for()`.

If you need guaranteed uniqueness, use `Symbol()`.

## Best Practices

Use symbols to avoid property name collisions in shared objects or library-like code.

Use `Symbol()` for local uniqueness.

Use `Symbol.for()` only when separate code needs the same symbol.

Do not use symbols as a security mechanism.

Treat well-known symbols as advanced customization points and keep their behavior predictable.

## Summary

Symbols are unique primitive values that can act as property keys.

They help avoid naming collisions and enable language-level customization through well-known symbols.

The most common well-known symbol you will use is `Symbol.iterator`, which makes objects iterable.
