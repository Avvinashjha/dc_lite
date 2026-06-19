# Iterator Pattern

The iterator pattern provides a standard way to move through a collection one item at a time.

JavaScript has built-in support for iterators and iterables.

You use this pattern whenever you write a `for...of` loop.

## Iterable Values

Arrays are iterable.

```js
const names = ["Ada", "Grace", "Linus"];

for (const name of names) {
  console.log(name);
}
```

Strings, maps, sets, and many browser APIs are iterable too.

```js
const roles = new Set(["admin", "editor"]);

for (const role of roles) {
  console.log(role);
}
```

## What an Iterator Returns

An iterator has a `next()` method.

Each call returns an object with:

- `value`: the current value
- `done`: whether iteration is finished

```js
const iterator = ["a", "b"][Symbol.iterator]();

console.log(iterator.next()); // { value: "a", done: false }
console.log(iterator.next()); // { value: "b", done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```

Most of the time you do not call `next()` directly.

`for...of` does it for you.

## Creating a Custom Iterable

An object becomes iterable when it has a `[Symbol.iterator]` method.

```js
const range = {
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

for (const number of range) {
  console.log(number);
}
```

This logs `1`, `2`, and `3`.

## Generator Functions

Generator functions provide a shorter way to create iterators.

```js
function* createRange(start, end) {
  for (let number = start; number <= end; number += 1) {
    yield number;
  }
}

for (const number of createRange(1, 3)) {
  console.log(number);
}
```

The `yield` keyword produces one value at a time.

## Why Iterators Help

Iterators separate traversal from storage.

The code using the collection does not need to know how values are stored internally.

```js
function printAll(items) {
  for (const item of items) {
    console.log(item);
  }
}

printAll(["a", "b"]);
printAll(new Set(["x", "y"]));
printAll(createRange(1, 3));
```

`printAll` works with any iterable.

## Lazy Values

Iterators can produce values lazily.

They do not have to build a full array first.

```js
function* takeFirst(count, iterable) {
  let taken = 0;

  for (const item of iterable) {
    if (taken >= count) {
      return;
    }

    yield item;
    taken += 1;
  }
}
```

This is useful for large or endless sequences.

## Iterating Object Entries

Plain objects are not directly iterable by default.

Use `Object.entries()` when you want key-value pairs.

```js
const user = {
  name: "Ada",
  role: "admin",
};

for (const [key, value] of Object.entries(user)) {
  console.log(key, value);
}
```

## Common Mistakes

### Confusing Iterable and Iterator

An iterable is something that can create an iterator.

An iterator is the object with `next()`.

Arrays are iterable.

The result of `array[Symbol.iterator]()` is an iterator.

### Forgetting `done`

Custom iterators must eventually return `done: true` unless they are intentionally endless.

### Mutating While Iterating

Changing a collection while looping through it can produce confusing results.

Prefer creating a new collection when possible.

## Best Practices

- Use `for...of` for iterable values.
- Use generator functions for custom iteration when they make code clearer.
- Accept iterables in utility functions when you do not need array-specific methods.
- Convert to an array with `Array.from()` when you need array methods.
- Keep custom iterator behavior simple and predictable.

## Summary

The iterator pattern gives code a standard way to read values one at a time.

JavaScript supports this pattern through iterables, iterators, `Symbol.iterator`, `for...of`, and generator functions.

Use iterators when you want code to work with many collection types or produce values lazily.

