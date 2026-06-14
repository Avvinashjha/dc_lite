# entries

Sometimes you need both pieces of information while looping through an array:

- the index
- the value at that index

You already know arrays are zero-indexed:

```js
const fruits = ["Apple", "Banana", "Cherry"];

console.log(fruits[0]); // Apple
console.log(fruits[1]); // Banana
console.log(fruits[2]); // Cherry
```

The `.entries()` method gives you a clean way to loop over both the index and the value together.

## What Is `entries`?

The `.entries()` method returns an **iterator** containing index-value pairs from an array.

Each pair looks like this:

```js
[index, value]
```

Example:

```js
const fruits = ["Apple", "Banana", "Cherry"];

const entries = fruits.entries();

console.log(entries);
```

The result is an iterator object.

You usually do not use that object directly.

Instead, you loop over it.

## Basic Example With `for...of`

The most common way to use `.entries()` is with `for...of`.

```js
const fruits = ["Apple", "Banana", "Cherry"];

for (const entry of fruits.entries()) {
  console.log(entry);
}
```

Output:

```text
[0, "Apple"]
[1, "Banana"]
[2, "Cherry"]
```

Each `entry` is an array with two values:

- the index
- the element

## Using Destructuring

Because each entry is an array, you can use destructuring.

```js
const fruits = ["Apple", "Banana", "Cherry"];

for (const [index, fruit] of fruits.entries()) {
  console.log(`${index}: ${fruit}`);
}
```

Output:

```text
0: Apple
1: Banana
2: Cherry
```

This is the cleanest way to use `.entries()`.

The destructuring:

```js
const [index, fruit]
```

takes the two values from each entry array.

## Why Use `entries`?

Use `.entries()` when you want the readability of `for...of`, but you also need the index.

Without `entries`, you might write a traditional `for` loop:

```js
const fruits = ["Apple", "Banana", "Cherry"];

for (let index = 0; index < fruits.length; index++) {
  console.log(`${index}: ${fruits[index]}`);
}
```

This works, but it is more mechanical.

With `.entries()`:

```js
for (const [index, fruit] of fruits.entries()) {
  console.log(`${index}: ${fruit}`);
}
```

This reads more directly:

```text
For each index-value pair in the array, do something.
```

## Human-Friendly Numbering

Indexes start at `0`, but users usually expect numbering to start at `1`.

```js
const steps = ["Install", "Build", "Deploy"];

for (const [index, step] of steps.entries()) {
  console.log(`${index + 1}. ${step}`);
}
```

Output:

```text
1. Install
2. Build
3. Deploy
```

This is a common use case for `.entries()`.

You use the real index for calculations, then display `index + 1`.

## Practical Example: Rendering Labels

Imagine you want to create labels for a list of tasks.

```js
const tasks = ["Write notes", "Review lesson", "Publish update"];

const labels = [];

for (const [index, task] of tasks.entries()) {
  labels.push(`Task ${index + 1}: ${task}`);
}

console.log(labels);
```

Output:

```js
[
  "Task 1: Write notes",
  "Task 2: Review lesson",
  "Task 3: Publish update"
]
```

This could also be done with `.map()`, but `.entries()` is useful when you prefer loop syntax.

## Practical Example: Finding Positions While Looping

You can use `.entries()` when the index matters during a loop.

```js
const scores = [80, 95, 72, 88];

for (const [index, score] of scores.entries()) {
  if (score < 75) {
    console.log(`Score at index ${index} needs review.`);
  }
}
```

Output:

```text
Score at index 2 needs review.
```

The value tells you what happened.

The index tells you where it happened.

## `entries` Returns an Iterator

`.entries()` does not return a normal array.

It returns an iterator.

```js
const fruits = ["Apple", "Banana"];

const iterator = fruits.entries();

console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
```

Output:

```js
{ value: [0, "Apple"], done: false }
{ value: [1, "Banana"], done: false }
{ value: undefined, done: true }
```

An iterator produces values one at a time.

Most of the time, you do not call `.next()` manually.

You use `for...of` instead:

```js
for (const [index, fruit] of fruits.entries()) {
  console.log(index, fruit);
}
```

## Converting Entries to an Array

If you want to see all entries as a normal array, use `Array.from()`.

```js
const fruits = ["Apple", "Banana", "Cherry"];

const entryArray = Array.from(fruits.entries());

console.log(entryArray);
```

Output:

```js
[
  [0, "Apple"],
  [1, "Banana"],
  [2, "Cherry"]
]
```

You can also use spread syntax:

```js
const entryArray = [...fruits.entries()];
```

Both produce an array of index-value pairs.

## `entries` vs `forEach`

`forEach` also gives you the current value and index.

```js
const fruits = ["Apple", "Banana", "Cherry"];

fruits.forEach((fruit, index) => {
  console.log(`${index}: ${fruit}`);
});
```

So why use `.entries()`?

`.entries()` works nicely with `for...of`.

That gives you loop control tools like `break` and `continue`.

```js
for (const [index, fruit] of fruits.entries()) {
  if (fruit === "Banana") {
    break;
  }

  console.log(`${index}: ${fruit}`);
}
```

You cannot use `break` inside `forEach`.

So `.entries()` plus `for...of` is useful when you need both:

- index-value pairs
- loop control

## `entries` vs `keys` vs `values`

Arrays also have `.keys()` and `.values()`.

```js
const fruits = ["Apple", "Banana", "Cherry"];
```

`.keys()` gives indexes:

```js
for (const index of fruits.keys()) {
  console.log(index);
}
```

Output:

```text
0
1
2
```

`.values()` gives values:

```js
for (const fruit of fruits.values()) {
  console.log(fruit);
}
```

Output:

```text
Apple
Banana
Cherry
```

`.entries()` gives both:

```js
for (const [index, fruit] of fruits.entries()) {
  console.log(index, fruit);
}
```

Output:

```text
0 Apple
1 Banana
2 Cherry
```

## Comparison Table

| Method | Gives you | Example item |
| --- | --- | --- |
| `keys()` | Indexes | `0` |
| `values()` | Values | `"Apple"` |
| `entries()` | Index-value pairs | `[0, "Apple"]` |

Use the method that gives you the data you need.

If you only need values, a plain `for...of` is often enough:

```js
for (const fruit of fruits) {
  console.log(fruit);
}
```

If you need both index and value, use `.entries()`.

## Modifying Values While Using `entries`

You can use the index from `.entries()` to update array elements.

```js
const numbers = [1, 2, 3];

for (const [index, number] of numbers.entries()) {
  numbers[index] = number * 2;
}

console.log(numbers); // [2, 4, 6]
```

This mutates the original array.

If you want a new transformed array, use `.map()` instead:

```js
const doubled = numbers.map((number) => number * 2);
```

Use `.entries()` for index-aware looping.

Use `.map()` for transformations.

## Skipping Items With `continue`

Because `.entries()` is often used with `for...of`, you can use `continue`.

```js
const scores = [90, 40, 75, 30];

for (const [index, score] of scores.entries()) {
  if (score >= 50) {
    continue;
  }

  console.log(`Score at index ${index} failed.`);
}
```

Output:

```text
Score at index 1 failed.
Score at index 3 failed.
```

This is harder to express cleanly with `forEach` because `continue` is not allowed inside a `forEach` callback.

## Stopping Early With `break`

You can also stop early.

```js
const users = ["Ava", "Noah", "Mira", "Liam"];

for (const [index, user] of users.entries()) {
  if (user === "Mira") {
    console.log(`Found Mira at index ${index}`);
    break;
  }
}
```

Output:

```text
Found Mira at index 2
```

If your goal is simply to find an item, `.find()` or `.findIndex()` may be clearer.

But `.entries()` is useful when you are doing custom loop logic.

## Entries and Sparse Arrays

Sparse arrays have empty slots.

```js
const values = [];

values[2] = "Hello";
```

This creates empty slots at indexes `0` and `1`.

With `.entries()`:

```js
for (const [index, value] of values.entries()) {
  console.log(index, value);
}
```

Output:

```text
0 undefined
1 undefined
2 Hello
```

This is another reason to avoid sparse arrays when possible.

Use normal methods like `push()` to build arrays.

## Best Practices

Use `.entries()` when you need both index and value:

```js
for (const [index, item] of items.entries()) {
  console.log(index, item);
}
```

Use destructuring for readability:

```js
for (const [index, task] of tasks.entries()) {
  console.log(`${index + 1}. ${task}`);
}
```

Use `for...of` with `.entries()` when you need `break` or `continue`:

```js
for (const [index, value] of values.entries()) {
  if (value == null) {
    continue;
  }

  console.log(index, value);
}
```

Use `.map()` if your goal is to create a transformed array:

```js
const labels = tasks.map((task, index) => `${index + 1}. ${task}`);
```

Use `.findIndex()` if your goal is only to find an index:

```js
const index = users.findIndex((user) => user.id === targetId);
```

## Common Mistakes

### Mistake 1: Expecting `entries()` to Return a Normal Array

```js
const fruits = ["Apple", "Banana"];

const entries = fruits.entries();

console.log(entries[0]); // undefined
```

`entries()` returns an iterator, not a normal array.

Convert it if needed:

```js
const entriesArray = [...fruits.entries()];

console.log(entriesArray[0]); // [0, "Apple"]
```

### Mistake 2: Forgetting Destructuring

```js
const fruits = ["Apple", "Banana"];

for (const entry of fruits.entries()) {
  console.log(entry);
}
```

This logs arrays like:

```text
[0, "Apple"]
[1, "Banana"]
```

That is fine, but destructuring is usually clearer:

```js
for (const [index, fruit] of fruits.entries()) {
  console.log(index, fruit);
}
```

### Mistake 3: Using `entries()` When You Only Need Values

```js
for (const [index, fruit] of fruits.entries()) {
  console.log(fruit);
}
```

If you do not need the index, write:

```js
for (const fruit of fruits) {
  console.log(fruit);
}
```

### Mistake 4: Using `entries()` Instead of `map()` for Transformations

```js
const labels = [];

for (const [index, task] of tasks.entries()) {
  labels.push(`${index + 1}. ${task}`);
}
```

This works.

But if your goal is only to create a new array, `.map()` is often clearer:

```js
const labels = tasks.map((task, index) => `${index + 1}. ${task}`);
```

## Quick Check

What does this log?

```js
const colors = ["Red", "Green"];

for (const entry of colors.entries()) {
  console.log(entry);
}
```

It logs:

```text
[0, "Red"]
[1, "Green"]
```

What does this log?

```js
const colors = ["Red", "Green"];

for (const [index, color] of colors.entries()) {
  console.log(`${index}: ${color}`);
}
```

It logs:

```text
0: Red
1: Green
```

How do you convert entries to a normal array?

Use spread syntax:

```js
const entriesArray = [...colors.entries()];
```

Or use `Array.from()`:

```js
const entriesArray = Array.from(colors.entries());
```

## Summary

`entries()` gives you index-value pairs from an array.

- Each entry is `[index, value]`.
- `entries()` returns an iterator, not a normal array.
- Use `for...of` to loop over entries.
- Use destructuring like `[index, value]` for readability.
- Use `entries()` when you need both the index and the value.
- Use `keys()` when you only need indexes.
- Use `values()` or plain `for...of` when you only need values.
- Use `map()` when your goal is to create a transformed array.
- Use `findIndex()` when your goal is only to find an index.
