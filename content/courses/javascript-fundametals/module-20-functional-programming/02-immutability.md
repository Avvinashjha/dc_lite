# Immutability

Immutability means not changing existing values directly.

Instead of modifying data in place, you create updated copies.

This is especially important when working with objects, arrays, and application state.

## Mutable Update

```js
const user = {
  name: "Alice",
  points: 10,
};

user.points = 20;

console.log(user); // { name: "Alice", points: 20 }
```

This changes the original object.

That is mutation.

## Immutable Update

```js
const user = {
  name: "Alice",
  points: 10,
};

const updatedUser = {
  ...user,
  points: 20,
};

console.log(user); // { name: "Alice", points: 10 }
console.log(updatedUser); // { name: "Alice", points: 20 }
```

The original object stays unchanged.

## Why Immutability Helps

Immutable updates make code easier to reason about.

They help you avoid bugs caused by unexpected shared references.

They are useful in:

- React state updates
- reducers
- undo/redo systems
- caching
- tests
- data transformation pipelines

## Arrays and Immutability

Some array methods mutate the original array.

```js
const numbers = [3, 1, 2];

numbers.sort();

console.log(numbers); // [1, 2, 3]
```

`sort()` mutates.

Create a copy first:

```js
const numbers = [3, 1, 2];
const sorted = [...numbers].sort();

console.log(numbers); // [3, 1, 2]
console.log(sorted); // [1, 2, 3]
```

## Non-Mutating Array Methods

These methods return new arrays:

| Method | Purpose |
| --- | --- |
| `map()` | transform each item |
| `filter()` | keep some items |
| `slice()` | copy part of an array |
| `concat()` | combine arrays |
| `toSorted()` | sort without mutating |
| `toReversed()` | reverse without mutating |
| `toSpliced()` | splice without mutating |

Examples:

```js
const numbers = [1, 2, 3];

const doubled = numbers.map((number) => number * 2);
const even = numbers.filter((number) => number % 2 === 0);

console.log(numbers); // [1, 2, 3]
console.log(doubled); // [2, 4, 6]
console.log(even); // [2]
```

## Mutating vs Non-Mutating Methods

| Mutates original | Returns new value |
| --- | --- |
| `push()` | `concat()` |
| `pop()` | `slice(0, -1)` |
| `splice()` | `toSpliced()` |
| `sort()` | `toSorted()` |
| `reverse()` | `toReversed()` |

If your environment does not support newer methods like `toSorted()`, use copies with spread.

```js
const sorted = [...numbers].sort();
```

## Immutable Object Updates

Add or replace a property:

```js
const user = {
  id: 1,
  name: "Alice",
};

const updatedUser = {
  ...user,
  role: "admin",
};
```

Remove a property with destructuring:

```js
const user = {
  id: 1,
  name: "Alice",
  password: "secret",
};

const { password, ...safeUser } = user;

console.log(safeUser); // { id: 1, name: "Alice" }
```

## Updating Nested Data

Spread only copies one level deep.

```js
const state = {
  user: {
    name: "Alice",
    address: {
      city: "Delhi",
    },
  },
};
```

To update nested data immutably, copy each level you change.

```js
const updatedState = {
  ...state,
  user: {
    ...state.user,
    address: {
      ...state.user.address,
      city: "Mumbai",
    },
  },
};
```

This is verbose, but predictable.

## Immutability Is About Behavior

`const` does not make objects immutable.

```js
const user = {
  name: "Alice",
};

user.name = "Bob"; // allowed
```

`const` prevents reassignment of the variable.

It does not freeze the object.

## Object.freeze()

`Object.freeze()` prevents direct changes to an object.

```js
const settings = Object.freeze({
  theme: "dark",
});

settings.theme = "light"; // ignored or error in strict mode
```

But it is shallow.

```js
const state = Object.freeze({
  user: {
    name: "Alice",
  },
});

state.user.name = "Bob"; // nested object can still change
```

## Best Practices

Prefer returning new arrays and objects.

Avoid mutating function arguments.

Use `map`, `filter`, and `reduce` for transformations.

Copy each nested level that changes.

Remember that spread creates shallow copies.

Use mutation intentionally when it is local and safe.

## Common Mistakes

### Mistake 1: Mutating State With push

```js
items.push(newItem);
```

Immutable version:

```js
const updatedItems = [...items, newItem];
```

### Mistake 2: Thinking Spread Deep Copies Everything

```js
const copy = { ...state };
copy.user.name = "Bob";
```

If `user` is nested, both objects still share the same nested object.

### Mistake 3: Thinking `const` Means Immutable

`const` protects the variable binding, not the object contents.

## Summary

Immutability means creating updated copies instead of changing existing data.

- Mutation changes existing arrays or objects.
- Immutable updates return new arrays or objects.
- Spread syntax is useful but shallow.
- Copy every nested level you update.
- `const` does not make objects immutable.
- Immutability helps keep state predictable.
