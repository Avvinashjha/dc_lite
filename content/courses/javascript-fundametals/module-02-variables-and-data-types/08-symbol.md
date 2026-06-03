# Symbol

`Symbol` is one of JavaScript's primitive types.

It was introduced in ES6, also called ECMAScript 2015.

Symbols are more advanced than strings, numbers, and booleans, but the core idea is simple:

**A symbol is a unique value.**

Even if two symbols look similar, they are not the same.

## What Is a Symbol?

A **symbol** is a unique and immutable primitive value.

You create a symbol with the `Symbol()` function.

```js
const id = Symbol();

console.log(typeof id); // symbol
```

Do not use `new` with `Symbol`.

This is correct:

```js
const id = Symbol();
```

This is not correct:

```js
const id = new Symbol(); // Error
```

`Symbol` creates a primitive value, not a normal object instance.

## Symbol Descriptions

You can pass a description to `Symbol()`.

```js
const userId = Symbol("user_id");

console.log(userId); // Symbol(user_id)
```

The description is mainly for debugging. It helps you recognize the symbol when logging it.

The description does not control equality.

```js
const id1 = Symbol("id");
const id2 = Symbol("id");

console.log(id1 === id2); // false
```

Even though both descriptions are `"id"`, the symbols are different.

This is the most important rule:

**Every call to `Symbol()` creates a new unique symbol.**

## Why Symbols Exist

Symbols are useful when you need a property key that will not accidentally conflict with another property key.

Imagine this object:

```js
const user = {
  id: 123,
  name: "Asha"
};
```

If another part of the code also uses `id`, it can overwrite the existing value:

```js
user.id = "session-999";

console.log(user.id); // session-999
```

That may not be what you wanted.

Symbols help avoid this kind of collision.

## Symbols as Object Keys

Symbols can be used as object property keys.

```js
const USER_ID = Symbol("id");
const SESSION_ID = Symbol("id");

const user = {
  name: "Asha",
  [USER_ID]: 12345,
  [SESSION_ID]: "session-999"
};

console.log(user.name); // Asha
console.log(user[USER_ID]); // 12345
console.log(user[SESSION_ID]); // session-999
```

Both symbols have the description `"id"`, but they are unique keys.

There is no collision.

## Bracket Notation Is Required

When using a symbol as an object key, use bracket notation.

```js
const ID = Symbol("id");

const user = {
  [ID]: 123
};

console.log(user[ID]); // 123
```

Dot notation does not work for symbol variables.

```js
console.log(user.ID); // undefined
```

`user.ID` looks for a string key named `"ID"`, not the symbol stored in the variable `ID`.

## Symbols Are Hidden from Common Iteration

Symbol keys are not included in many common object operations.

```js
const secret = Symbol("secret");

const user = {
  name: "Asha",
  [secret]: "hidden value"
};

console.log(Object.keys(user)); // ["name"]
```

`Object.keys()` returns string keys, not symbol keys.

`for...in` also skips symbol keys:

```js
for (const key in user) {
  console.log(key); // name
}
```

`JSON.stringify()` ignores symbol-keyed properties:

```js
console.log(JSON.stringify(user)); // {"name":"Asha"}
```

This does not make symbols fully private or secure. It only means they are skipped by common enumeration tools.

## Getting Symbol Keys

If you need to find symbol keys on an object, use `Object.getOwnPropertySymbols()`.

```js
const secret = Symbol("secret");

const user = {
  name: "Asha",
  [secret]: "hidden value"
};

const symbols = Object.getOwnPropertySymbols(user);

console.log(symbols); // [Symbol(secret)]
console.log(user[symbols[0]]); // hidden value
```

So symbol properties are hidden from normal iteration, but they are still accessible.

## The Global Symbol Registry

Normally, every `Symbol()` call creates a new symbol.

```js
const a = Symbol("app_id");
const b = Symbol("app_id");

console.log(a === b); // false
```

Sometimes you want different parts of an application to share the same symbol. For that, JavaScript provides the **global symbol registry**.

Use `Symbol.for()`.

```js
const id1 = Symbol.for("app_id");
const id2 = Symbol.for("app_id");

console.log(id1 === id2); // true
```

How it works:

1. `Symbol.for("app_id")` checks the global registry.
2. If a symbol already exists for that key, it returns the existing symbol.
3. If not, it creates one and stores it in the registry.

You can get the registry key with `Symbol.keyFor()`.

```js
const appId = Symbol.for("app_id");

console.log(Symbol.keyFor(appId)); // app_id
```

`Symbol.keyFor()` only works with symbols from the global registry.

```js
const localId = Symbol("local_id");

console.log(Symbol.keyFor(localId)); // undefined
```

## `Symbol()` vs `Symbol.for()`

| Feature | `Symbol()` | `Symbol.for()` |
| --- | --- | --- |
| Creates a unique symbol every time | Yes | No |
| Uses the global registry | No | Yes |
| Same key can return same symbol | No | Yes |
| Best for | Private-ish unique keys | Shared symbols across code |

Use `Symbol()` when you want guaranteed uniqueness.

Use `Symbol.for()` when you intentionally want shared access to the same symbol.

## Well-Known Symbols

JavaScript has built-in symbols called **well-known symbols**.

They let you customize some built-in language behavior.

One common example is `Symbol.iterator`.

Arrays and strings can be used in `for...of` loops because they have iterator behavior.

```js
const text = "JS";

for (const character of text) {
  console.log(character);
}
```

Under the hood, JavaScript uses `Symbol.iterator` to know how to loop over the value.

You do not need to master well-known symbols yet. For now, just know that symbols are also used internally by JavaScript itself.

## When Should Beginners Use Symbols?

As a beginner, you will not use symbols every day.

Most beginner code uses:

- strings
- numbers
- booleans
- null and undefined
- objects and arrays

Symbols become useful when you are:

- Building libraries
- Avoiding property name collisions
- Working with advanced object behavior
- Learning JavaScript internals

## Summary

`Symbol` is a primitive type used to create unique values.

Remember:

1. `Symbol()` creates a new unique symbol every time.
2. Symbol descriptions are for debugging and do not affect uniqueness.
3. Symbols can be used as object property keys.
4. Symbol keys require bracket notation.
5. Symbol-keyed properties are skipped by `Object.keys()`, `for...in`, and `JSON.stringify()`.
6. Use `Object.getOwnPropertySymbols()` to retrieve symbol keys.
7. Use `Symbol.for()` when you intentionally want a shared symbol from the global registry.
8. JavaScript also has well-known symbols such as `Symbol.iterator`.

Next, you will learn about `bigint`, JavaScript's primitive type for very large whole numbers.