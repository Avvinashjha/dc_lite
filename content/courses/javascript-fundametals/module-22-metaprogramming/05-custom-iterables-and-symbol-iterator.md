# Custom Iterables and Symbol.iterator

An iterable is an object that JavaScript can loop over with `for...of`.

Arrays, strings, maps, and sets are iterable.

```js
for (const letter of "abc") {
  console.log(letter);
}
```

Output:

```text
a
b
c
```

You can make your own objects iterable by defining `Symbol.iterator`.

## Iterable vs Iterator

Two terms matter:

| Term | Meaning |
| --- | --- |
| Iterable | an object with a `[Symbol.iterator]()` method |
| Iterator | an object with a `next()` method that returns `{ value, done }` |

The iterable creates the iterator.

The iterator produces values one at a time.

## The Iterator Protocol

An iterator's `next()` method returns an object.

```js
{
  value: "some value",
  done: false
}
```

When iteration is finished, `done` should be `true`.

```js
{
  value: undefined,
  done: true
}
```

## A Manual Iterator

Here is a simple iterator object.

```js
const iterator = {
  current: 1,

  next() {
    if (this.current <= 3) {
      return { value: this.current++, done: false };
    }

    return { value: undefined, done: true };
  },
};

console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 3, done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```

This is an iterator, but it is not yet an iterable.

`for...of` expects an iterable.

## Making an Object Iterable

Define a `[Symbol.iterator]()` method.

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

Output:

```text
1
2
3
```

Now `range` works with `for...of`.

## Iterables Work with Spread

Spread uses the iterable protocol.

```js
console.log([...range]); // [1, 2, 3]
```

So does `Array.from()`.

```js
console.log(Array.from(range)); // [1, 2, 3]
```

This is why implementing `Symbol.iterator` can make custom objects feel natural in JavaScript.

## Fresh Iterator Each Time

An iterable should usually return a fresh iterator each time `[Symbol.iterator]()` is called.

```js
console.log([...range]); // [1, 2, 3]
console.log([...range]); // [1, 2, 3]
```

In the previous example, `current` is created inside `[Symbol.iterator]()`, so each loop gets its own state.

If iterator state is stored on the object itself, later loops may behave incorrectly.

```js
const brokenRange = {
  start: 1,
  end: 3,
  current: 1,

  [Symbol.iterator]() {
    return this;
  },

  next() {
    if (this.current <= this.end) {
      return { value: this.current++, done: false };
    }

    return { value: undefined, done: true };
  },
};

console.log([...brokenRange]); // [1, 2, 3]
console.log([...brokenRange]); // []
```

The second spread is empty because the object reused the same exhausted iterator state.

## Generators Make Iterables Easier

A generator function can produce an iterator automatically.

```js
function* countToThree() {
  yield 1;
  yield 2;
  yield 3;
}

console.log([...countToThree()]); // [1, 2, 3]
```

You can use a generator for `[Symbol.iterator]`.

```js
const range = {
  start: 1,
  end: 3,

  *[Symbol.iterator]() {
    for (let current = this.start; current <= this.end; current++) {
      yield current;
    }
  },
};

console.log([...range]); // [1, 2, 3]
```

This is often clearer than writing `next()` manually.

## Iterating Object-Like Data

Plain objects are not iterable by default.

```js
const user = {
  name: "Ava",
  role: "admin",
};

// for (const item of user) {} // TypeError
```

You can make an object iterable, but first ask whether it should be.

```js
const user = {
  name: "Ava",
  role: "admin",

  *[Symbol.iterator]() {
    yield this.name;
    yield this.role;
  },
};

console.log([...user]); // ["Ava", "admin"]
```

For most plain objects, `Object.entries()` is clearer.

```js
console.log(Object.entries(user));
```

Custom iteration is best when the object represents a collection or sequence.

## Practical Example: Playlist

```js
const playlist = {
  songs: ["Intro", "Loop", "Finale"],

  *[Symbol.iterator]() {
    for (const song of this.songs) {
      yield song;
    }
  },
};

for (const song of playlist) {
  console.log(song);
}
```

The playlist object can keep its internal structure while exposing a clean iteration experience.

## Common Mistake: Returning Values Directly

`[Symbol.iterator]()` must return an iterator object, not an array value or a single item.

```js
const bad = {
  [Symbol.iterator]() {
    return [1, 2, 3]; // wrong: array is iterable, but not the iterator expected here
  },
};

// [...bad] // TypeError
```

Return the array's iterator instead.

```js
const good = {
  values: [1, 2, 3],

  [Symbol.iterator]() {
    return this.values[Symbol.iterator]();
  },
};

console.log([...good]); // [1, 2, 3]
```

## Best Practices

Use custom iterables for collection-like objects.

Prefer generator methods when they make iteration logic easier to read.

Return a fresh iterator for repeatable iteration.

Use `Object.keys()`, `Object.values()`, or `Object.entries()` for ordinary plain object data.

Keep iteration order obvious and documented.

## Summary

`Symbol.iterator` lets an object define how it is looped over.

An iterable returns an iterator, and an iterator returns `{ value, done }` objects.

Custom iterables can make collection-like objects work naturally with `for...of`, spread, and `Array.from()`.
